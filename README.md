# memex-exodus

## 1. 목적

Memex CMS 데이터를 PostgreSQL + S3로 이전하는 CLI 도구

## 2. 사용 방법

```bash
npm run pull   # Memex에서 데이터 + 파일 수집
npm run push   # S3 업로드 + PostgreSQL INSERT
npm run dump   # DB 백업 (pg_dump)
npm run clear  # data/ 디렉토리 초기화
```

각 커맨드 실행 시 필요한 값을 대화형으로 입력:

| 커맨드 | 입력 항목 |
|--------|-----------|
| `pull` | MEMEX_TOKEN, PROJECT_ID, MODEL_KEYS (쉼표 구분) |
| `push` | (미구현) |
| `dump` | (미구현) |

`pull` 실행 결과는 `data/` 에 저장:

```
data/
  {modelKey}.json      # 컬렉션 raw 데이터
  files/               # 다운로드된 파일
  file-map.json        # URL ↔ 로컬 경로 매핑
  skipped-urls.json    # 화이트리스트 외 필터링된 URL
```
