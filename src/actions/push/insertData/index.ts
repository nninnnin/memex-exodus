// 컬렉션 데이터를 Neon PostgreSQL에 INSERT한다.
// 아이템의 data 필드를 순회해 컬럼 타입을 추론하고 테이블을 자동 생성한다.
// uid를 PK로 upsert하여 재실행 가능하다.

import postgres from 'postgres';

type PgType = 'TEXT' | 'BOOLEAN' | 'NUMERIC' | 'JSONB';

interface Item {
  uid: string;
  data: Record<string, unknown>;
  createdAt?: string;
  updateAt?: string;
}

function inferPgType(values: unknown[]): PgType {
  const nonNull = values.filter(v => v !== null && v !== undefined);
  if (nonNull.length === 0) return 'TEXT';
  if (nonNull.every(v => typeof v === 'boolean')) return 'BOOLEAN';
  if (nonNull.every(v => typeof v === 'number')) return 'NUMERIC';
  if (nonNull.every(v => typeof v === 'string')) return 'TEXT';
  return 'JSONB';
}

function inferSchema(items: Item[]): Record<string, PgType> {
  const keyValues: Record<string, unknown[]> = {};
  for (const item of items) {
    for (const [key, value] of Object.entries(item.data)) {
      if (!keyValues[key]) keyValues[key] = [];
      keyValues[key].push(value);
    }
  }
  return Object.fromEntries(
    Object.entries(keyValues).map(([key, values]) => [key, inferPgType(values)]),
  );
}

function replaceUrls(value: unknown, s3Map: Record<string, string>): unknown {
  if (typeof value === 'string') return s3Map[value] ?? value;
  if (Array.isArray(value)) return value.map(v => replaceUrls(v, s3Map));
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, replaceUrls(v, s3Map)]),
    );
  }
  return value;
}

export async function insertData(
  collections: { modelKey: string; items: Item[] }[],
  s3Map: Record<string, string>,
  dbUrl: string,
): Promise<void> {
  const sql = postgres(dbUrl, { ssl: 'require' });

  for (const { modelKey, items } of collections) {
    const replaced = items.map(item => ({
      ...item,
      data: replaceUrls(item.data, s3Map) as Record<string, unknown>,
    }));

    const schema = inferSchema(replaced);
    const dataKeys = Object.keys(schema);

    const colDefs = [
      'uid TEXT PRIMARY KEY',
      'created_at TEXT',
      'updated_at TEXT',
      ...dataKeys.map(k => `"${k}" ${schema[k]}`),
    ].join(', ');

    await sql.unsafe(`CREATE TABLE IF NOT EXISTS "${modelKey}" (${colDefs})`);
    console.log(`table ready: ${modelKey}`);

    for (const item of replaced) {
      const cols = ['uid', 'created_at', 'updated_at', ...dataKeys];
      const values: unknown[] = [
        item.uid,
        item.createdAt ?? null,
        item.updateAt ?? null,
        ...dataKeys.map(k => {
          const v = item.data[k];
          if (v === null || v === undefined) return null;
          if (schema[k] === 'JSONB') return JSON.stringify(v);
          return v;
        }),
      ];

      const colList = cols.map(c => `"${c}"`).join(', ');
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
      const updates = ['created_at', 'updated_at', ...dataKeys]
        .map(k => `"${k}" = EXCLUDED."${k}"`)
        .join(', ');

      await sql.unsafe(
        `INSERT INTO "${modelKey}" (${colList}) VALUES (${placeholders})
         ON CONFLICT (uid) DO UPDATE SET ${updates}`,
        values as any[],
      );
    }

    console.log(`inserted ${replaced.length} rows → ${modelKey}`);
  }

  await sql.end();
}
