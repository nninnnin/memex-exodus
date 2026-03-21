# memex-exodus

## 1. 목적
Memex CMS 데이터를 PostgreSQL + S3로 이전하는 CLI 도구

## 2. 실행 흐름
- `pull` → Memex에서 데이터 수집
  - `fetchCollection` → 컬렉션별 전체 아이템 반환
  - `downloadFiles` → URL 탐색 → 파일 다운로드 → file-map 반환
- `push` → S3 업로드 + PostgreSQL INSERT (미구현)
- `dump` → pg_dump 백업 (미구현)

## 3. 구조
- `src/index.ts` → CLI 진입점 (commander)
- `src/actions/` → 커맨드별 실행 로직
  - `pull/fetchCollection/` → Memex API 호출
  - `pull/downloadFiles/` → 파일 다운로드
- `src/config/` → 커맨드별 대화형 입력
  - `utils.ts` → prompt, printSummary 공유 유틸
  - `pull.ts` / `push.ts` → 커맨드별 config

## 4. 주요 결정사항

### fetchCollection
- 페이지 0-based (API 스펙)
- PAGE_SIZE=20 (100은 API에서 빈 응답 반환)
- `pageInfo.totalPages`로 전체 페이지 수 파악 (`getListLength` 미사용 - body 필수라 500)

### downloadFiles
- 아이템 전체를 재귀 순회해 URL 추출
- 확장자 화이트리스트로 다운로드 대상 필터링
- 필터링된 URL은 `skipped-urls.json`으로 저장
- 반환값 `{ url → localPath }` = file-map

### config
- 저장 없이 실행 시마다 대화형 입력
- 커맨드별로 필요한 항목만 질문

## 5. 출력 결과 (`data/`)
- `{modelKey}.json` → 컬렉션 raw 데이터
- `files/` → 다운로드된 파일
- `skipped-urls.json` → 필터링된 URL 목록
- `file-map.json` → URL ↔ 로컬 경로 매핑
