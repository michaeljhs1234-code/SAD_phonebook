-- ============================================================
-- 전화번호부 시스템 — Supabase SQL 설정
-- 실행 방법: Supabase 대시보드 → SQL Editor → 전체 복사 후 실행
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. 기존 테이블 초기화 (재실행 시 충돌 방지)
-- ────────────────────────────────────────────────────────────
drop table if exists contacts;


-- ────────────────────────────────────────────────────────────
-- 2. contacts 테이블 생성
-- ────────────────────────────────────────────────────────────
create table contacts (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null check (char_length(name) > 0),
  phone      text        not null check (char_length(phone) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table  contacts            is '전화번호부 연락처 테이블';
comment on column contacts.id         is '고유 식별자 (UUID)';
comment on column contacts.name       is '연락처 이름';
comment on column contacts.phone      is '전화번호';
comment on column contacts.created_at is '최초 생성 시각';
comment on column contacts.updated_at is '최종 수정 시각';


-- ────────────────────────────────────────────────────────────
-- 3. updated_at 자동 갱신 트리거
--    UPDATE 시 updated_at 을 현재 시각으로 자동 업데이트
-- ────────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_contacts_updated_at
  before update on contacts
  for each row
  execute function set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 4. 인덱스 — 이름 검색 및 정렬 성능 향상
-- ────────────────────────────────────────────────────────────
create index idx_contacts_name       on contacts (name);
create index idx_contacts_created_at on contacts (created_at desc);


-- ────────────────────────────────────────────────────────────
-- 5. RLS(Row Level Security) 설정
--    로그인 불필요 — anon 역할에 전체 CRUD 허용
-- ────────────────────────────────────────────────────────────
alter table contacts enable row level security;

-- 조회 허용
create policy "anon 전체 조회 허용"
  on contacts for select
  to anon
  using (true);

-- 추가 허용
create policy "anon 추가 허용"
  on contacts for insert
  to anon
  with check (true);

-- 수정 허용
create policy "anon 수정 허용"
  on contacts for update
  to anon
  using (true)
  with check (true);

-- 삭제 허용
create policy "anon 삭제 허용"
  on contacts for delete
  to anon
  using (true);


-- ────────────────────────────────────────────────────────────
-- 6. 샘플 데이터 (선택 사항 — 테스트용)
-- ────────────────────────────────────────────────────────────
insert into contacts (name, phone) values
  ('홍길동', '010-1234-5678'),
  ('김철수', '010-9876-5432'),
  ('이영희', '010-5555-1234');


-- ────────────────────────────────────────────────────────────
-- 7. 결과 확인
-- ────────────────────────────────────────────────────────────
select * from contacts order by created_at desc;
