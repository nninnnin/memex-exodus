# Memex → PostgreSQL + S3 마이그레이션 도구

## 목표

외부 CMS(Memex)에 종속된 데이터를 자체 인프라로 이전하는 범용 CLI 도구.
여러 프로젝트에서 재사용 가능하도록 독립 패키지로 개발.

---

## 구조

```
memex-exodus/
  src/
    commands/
      pull.ts       ← memex에서 데이터 + 파일 전부 긁어오기
      push.ts       ← PostgreSQL + S3에 밀어넣기
      dump.ts       ← DB 덤프 생성
    lib/
      memex.ts      ← memex API 클라이언트
      s3.ts         ← S3 업로드
      db.ts         ← PostgreSQL 연결 및 쿼리
      schema.ts     ← 스키마 추론 및 생성
    config.ts       ← 설정 파일 로드
  config.example.json
  README.md
```

---

## 설정 파일 (config.json)

```json
{
  "memex": {
    "token": "...",
    "projectId": "..."
  },
  "collections": [
    {
      "name": "arProjects",
      "fields": {
        "title": "text",
        "templateId": "text",
        "groupName": "text"
      }
    },
    {
      "name": "glbModels",
      "fields": {
        "name": "text",
        "mediaPath": "file",
        "scale": "json",
        "position": "json",
        "rotation": "json"
      }
    }
  ],
  "s3": {
    "bucket": "...",
    "region": "ap-northeast-2",
    "prefix": "assets/"
  },
  "db": {
    "url": "postgresql://..."
  },
  "output": {
    "dataDir": "./data",
    "backupDir": "./backups"
  }
}
```

---

## 실행 흐름

### 1. pull — 데이터 수집

```bash
memex-exodus pull
```

- 각 컬렉션의 전체 데이터를 `data/{collection}.json`으로 저장
- `"file"` 타입 필드는 URL로 파일 다운로드 → `data/files/` 에 저장
- 원본 URL과 로컬 경로 매핑 테이블 생성 (`data/file-map.json`)

### 2. push — 데이터 이식

```bash
memex-exodus push
```

- `file-map.json` 기준으로 로컬 파일 → S3 업로드
- S3 URL로 경로 치환
- `config.json` 스키마 기반으로 PostgreSQL 테이블 자동 생성
- 데이터 INSERT

### 3. dump — DB 백업

```bash
memex-exodus dump
```

- `pg_dump` 실행 → `backups/YYYYMMDD.sql` 저장
- (선택) git add + commit + push 자동화

---

## 재사용 시 필요한 것

- `config.json`에 컬렉션 구조 정의
- memex 토큰 + 프로젝트 ID
- S3 버킷
- PostgreSQL URL
