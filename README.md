# memex-exodus

## 1. 목적

Memex CMS 데이터를 PostgreSQL + S3로 이전하는 CLI 도구

## 2. 사전 요구사항

`dump` 커맨드는 내부적으로 `pg_dump`를 사용하므로 서버 버전과 일치하는 PostgreSQL 17 클라이언트가 필요합니다.

- **PostgreSQL 17**
  ```bash
  brew install postgresql@17
  echo 'export PATH="/opt/homebrew/opt/postgresql@17/bin:$PATH"' >> ~/.zshrc
  source ~/.zshrc
  ```

## 3. 사용 방법

```bash
pnpm pull    # Memex에서 데이터 + 파일 수집
pnpm upload  # 로컬 파일 → S3 업로드
pnpm push    # 컬렉션 데이터 → PostgreSQL INSERT
pnpm dump    # DB 백업 (pg_dump → backups/YYYYMMDD.sql)
pnpm clear   # data/ 디렉토리 초기화
```

각 커맨드 실행 시 필요한 값을 대화형으로 입력:

| 커맨드 | 입력 항목 |
|--------|-----------|
| `pull` | MEMEX_TOKEN, PROJECT_ID, PROJECT_NAME, MODEL_KEYS |
| `upload` | PROJECT_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET, S3_REGION, S3_PREFIX |
| `push` | PROJECT_NAME, NEON_DB_URL |
| `dump` | NEON_DB_URL |

## 4. 실행 순서

```
pull → upload → push → dump
```

- `upload`는 `pull` 이후에 실행 (`data/{projectName}/file-map.json` 필요)
- `push`는 `upload` 이후에 실행 (`data/{projectName}/s3-map.json` 필요)

## 5. 데이터 디렉토리

```
data/
  {projectName}/
    {modelKey}.json      # 컬렉션 raw 데이터
    files/               # 다운로드된 파일
    file-map.json        # URL ↔ 로컬 경로 매핑
    s3-map.json          # 원본 URL ↔ S3 URL 매핑
    skipped-urls.json    # 화이트리스트 외 필터링된 URL

backups/
  YYYYMMDD.sql           # pg_dump 백업 파일
```
