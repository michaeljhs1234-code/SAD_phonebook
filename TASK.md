# TASK.md
## 웹 기반 전화번호 관리 시스템 — 개발 태스크 목록

---

## Phase 1. 프로젝트 초기 설정

- [x] **T-01** Next.js 프로젝트 생성 → `phonebook/`
- [x] **T-02** 필요 패키지 설치 (`@supabase/supabase-js@^2.106.2`)
- [ ] **T-03** Supabase 프로젝트 생성 및 URL/Key 확보 ← **사용자 직접 수행**
- [x] **T-04** `.env.local` 파일 생성 (플레이스홀더 작성 완료 — 실제 값 입력 필요)
- [ ] **T-05** Vercel 프로젝트 연결 및 환경변수 등록 ← **사용자 직접 수행**

---

## Phase 2. 데이터베이스 설정

- [x] **T-06** `supabase/schema.sql` 작성 완료 ← **Supabase SQL 에디터에서 실행 필요**
- [x] **T-07** RLS 비활성화 SQL 포함 (`alter table contacts disable row level security`)

---

## Phase 3. 백엔드 API 구현

- [x] **T-08** `lib/supabase.js` — Supabase 클라이언트 유틸
- [x] **T-09** `GET /api/contacts` — 전체 연락처 조회
- [x] **T-10** `POST /api/contacts` — 연락처 추가
- [x] **T-11** `PUT /api/contacts/[id]` — 연락처 수정
- [x] **T-12** `DELETE /api/contacts/[id]` — 연락처 삭제

---

## Phase 4. 프론트엔드 UI 구현

- [x] **T-13** 메인 페이지 레이아웃 (`app/page.js`)
- [x] **T-14** 연락처 목록 테이블
- [x] **T-15** 연락처 추가 폼
- [x] **T-16** 인라인 수정 기능
- [x] **T-17** 삭제 기능 (confirm 다이얼로그 포함)
- [x] **T-18** 반응형 스타일 (Tailwind CSS)

---

## Phase 5. 배포

- [ ] **T-19** Vercel 배포 ← **사용자 직접 수행**
- [ ] **T-20** 배포 환경에서 CRUD 기능 동작 확인 ← **사용자 직접 수행**

---

## 완료 기준 (Definition of Done)

- 브라우저에서 연락처 추가/조회/수정/삭제가 정상 동작한다.
- Vercel 배포 URL로 접근 가능하다.
- 로그인 없이 모든 기능을 사용할 수 있다.
