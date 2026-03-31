-- Dữ liệu mẫu demo
-- Using existing admin profile id from the database: 1058c27a-32ae-4ea8-9638-a9672a74a18d

INSERT INTO profiles (id, email, display_name, role, status) VALUES
('1058c27a-32ae-4ea8-9638-a9672a74a18d', 'thangminhhoang98@gmail.com', 'Nguyễn Văn B', 'admin', 'active'),
(gen_random_uuid(), 'tran.a@gmail.com', 'Trần Văn A', 'user', 'active'),
(gen_random_uuid(), 'le.b@gmail.com', 'Lê Văn B', 'user', 'active'),
(gen_random_uuid(), 'pham.c@gmail.com', 'Phạm Văn C', 'user', 'active'),
(gen_random_uuid(), 'hoang.d@gmail.com', 'Hoàng Văn D', 'user', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO clans (id,name,slug,is_public)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Nguyễn Văn', 'nguyen-van', true), 
('22222222-2222-2222-2222-222222222222', 'Trần Tộc', 'tran-toc', true),
('33333333-3333-3333-3333-333333333333', 'Lê Gia', 'le-gia', true),
('44444444-4444-4444-4444-444444444444', 'Phạm Họ', 'pham-ho', false),
('55555555-5555-5555-5555-555555555555', 'Hoàng Tộc', 'hoang-toc', true)
ON CONFLICT (id) DO NOTHING;

WITH u AS (
  SELECT id 
  FROM profiles 
  WHERE id <> '1058c27a-32ae-4ea8-9638-a9672a74a18d'
  LIMIT 4
)
INSERT INTO clan_members (clan_id,user_id,role)
VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '1058c27a-32ae-4ea8-9638-a9672a74a18d',
  'owner'
),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM u LIMIT 1 OFFSET 0), 'owner'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM u LIMIT 1 OFFSET 1), 'owner'),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM u LIMIT 1 OFFSET 2), 'owner'),
('55555555-5555-5555-5555-555555555555', (SELECT id FROM u LIMIT 1 OFFSET 3), 'owner')
ON CONFLICT (clan_id, user_id) DO NOTHING;

-- INSERT INTO clan_members (clan_id,user_id,role)
-- VALUES (
-- '11111111-1111-1111-1111-111111111111',
-- '1058c27a-32ae-4ea8-9638-a9672a74a18d',
-- 'owner'
-- ),
-- ('22222222-2222-2222-2222-222222222222', (SELECT id FROM u LIMIT 1 OFFSET 0), 'owner'),
-- ('33333333-3333-3333-3333-333333333333', (SELECT id FROM u LIMIT 1 OFFSET 1), 'owner'),
-- ('44444444-4444-4444-4444-444444444444', (SELECT id FROM u LIMIT 1 OFFSET 2), 'owner'),
-- ('55555555-5555-5555-5555-555555555555', (SELECT id FROM u LIMIT 1 OFFSET 3), 'owner')
-- ON CONFLICT (clan_id, user_id) DO NOTHING;

INSERT INTO people (
  handle, clan_id, display_name, gender, generation, birth_year, death_year,
  is_living, is_patrilineal, families, parent_families
)
VALUES
('P001', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn An', 1, 1, 1920, 1995, false, true, '{"F001"}', '{}'),
('P002', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Bình', 1, 2, 1945, NULL, true, true, '{"F002","F020","F021"}', '{"F001"}'),
('P003', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Cường', 1, 2, 1948, NULL, true, true, '{"F003"}', '{"F001"}'),
('P004', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Dũng', 1, 2, 1951, 2020, false, true, '{"F004"}', '{"F001"}'),
('P005', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Hải', 1, 3, 1970, NULL, true, true, '{"F005"}', '{"F002"}'),
('P006', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Hùng', 1, 3, 1973, NULL, true, true, '{}', '{"F002"}'),
('P007', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Khoa', 1, 3, 1975, NULL, true, true, '{"F006"}', '{"F003"}'),
('P008', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Khánh', 1, 3, 1978, NULL, true, true, '{}', '{"F003"}'),
('P009', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Long', 1, 3, 1980, NULL, true, true, '{}', '{"F004"}'),
('P021', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Bình Con', 1, 3, 1980, NULL, true, true, '{}', '{"F021"}'),
('P010', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Minh', 1, 4, 1995, NULL, true, true, '{}', '{"F005"}'),
('P011', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Nam', 1, 4, 1998, NULL, true, true, '{}', '{"F005"}'),
('P012', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Phúc', 1, 4, 2000, NULL, true, true, '{}', '{"F006"}'),
('P013', '11111111-1111-1111-1111-111111111111', 'Trần Thị Lan', 2, 1, 1925, 2000, false, false, '{}', '{}'),
('P016', '11111111-1111-1111-1111-111111111111', 'Trần Thị Lan B', 2, 1, 1930, NULL, false, false, '{}', '{}'),
('P014', '11111111-1111-1111-1111-111111111111', 'Lê Thị Mai', 2, 2, 1948, NULL, true, false, '{}', '{}'),
('P015', '11111111-1111-1111-1111-111111111111', 'Phạm Thị Hoa', 2, 3, 1972, NULL, true, false, '{}', '{}'),
('P020', '11111111-1111-1111-1111-111111111111', 'Lê Thị Mai B', 2, 2, 1948, NULL, true, false, '{}', '{}'),

-- Gen 4 mở rộng
('P030', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Sơn', 1, 4, 1996, NULL, true, true, '{}', '{"F006"}'),
('P031', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Tùng', 1, 4, 1997, NULL, true, true, '{}', '{"F006"}'),
('P032', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Việt', 1, 4, 2001, NULL, true, true, '{}', '{"F004"}'),

-- Nữ
('P033', '11111111-1111-1111-1111-111111111111', 'Nguyễn Thị Hoa', 2, 4, 1999, NULL, true, false, '{}', '{"F033"}'),
('P034', '11111111-1111-1111-1111-111111111111', 'Nguyễn Thị Hương', 2, 4, 2002, NULL, true, false, '{}', '{"F034"}'),
('P050', '11111111-1111-1111-1111-111111111111', 'Nguyễn Thị Hoa Con', 2, 4, 1999, NULL, true, false, '{}', '{"F005"}'),

-- Gen 5 (cháu)
('P040', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Bảo', 1, 5, 2022, NULL, true, true, '{}', '{"F030"}'),
('P041', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Khang', 1, 5, 2023, NULL, true, true, '{}', '{"F031"}'),

-- Vợ/chồng thêm
('P035', '11111111-1111-1111-1111-111111111111', 'Hoàng Thị Linh', 2, 4, 1998, NULL, true, false, '{}', '{}'),
('P036', '11111111-1111-1111-1111-111111111111', 'Đỗ Thị Trang', 2, 4, 2000, NULL, true, false, '{}', '{}'),


('T001', '22222222-2222-2222-2222-222222222222', 'Trần Văn Tổ', 1, 1, 1930, NULL, false, true, '{"TF001"}', '{}'),
('T002', '22222222-2222-2222-2222-222222222222', 'Trần Văn Con', 1, 2, 1960, NULL, true, true, '{}', '{"TF001"}'),

('L001', '33333333-3333-3333-3333-333333333333', 'Lê Văn Tổ', 1, 1, 1940, NULL, false, true, '{"LF001"}', '{}'),
('L002', '33333333-3333-3333-3333-333333333333', 'Lê Văn Con', 1, 2, 1970, NULL, true, true, '{}', '{"LF001"}')
ON CONFLICT (handle) DO NOTHING;

INSERT INTO families (
  handle, clan_id, father_handle, mother_handle, children
)
VALUES
('F001', '11111111-1111-1111-1111-111111111111', 'P001', 'P013', '{"P002","P003","P004"}'),
('F002', '11111111-1111-1111-1111-111111111111', 'P002', 'P014', '{"P005","P006"}'),
('F003', '11111111-1111-1111-1111-111111111111', 'P003', NULL, '{"P007","P008"}'),
('F004', '11111111-1111-1111-1111-111111111111', 'P004', NULL, '{"P009"}'),
('F005', '11111111-1111-1111-1111-111111111111', 'P005', 'P015', '{"P010","P011","P050"}'),
('F006', '11111111-1111-1111-1111-111111111111', 'P007', NULL, '{"P012","P030","P031"}'),
('F020', '11111111-1111-1111-1111-111111111111', 'P002', 'P020', '{}'),
('F021', '11111111-1111-1111-1111-111111111111', 'P002', NULL, '{"P021"}'),
('F022', '11111111-1111-1111-1111-111111111111', 'P001', 'P016', '{}'),

-- Con của P007
('F030', '11111111-1111-1111-1111-111111111111', 'P007', 'P035', '{"P040"}'),

-- Con của P008
('F031', '11111111-1111-1111-1111-111111111111', 'P008', 'P036', '{"P041"}'),

-- Nhánh mới từ P009
('F032', '11111111-1111-1111-1111-111111111111', 'P009', NULL, '{"P032"}'),

-- Nhánh thêm từ P005
('F033', '11111111-1111-1111-1111-111111111111', 'P005', NULL, '{"P033"}'),

-- Nhánh thêm từ P006
('F034', '11111111-1111-1111-1111-111111111111', 'P006', NULL, '{"P034"}'),

('TF001', '22222222-2222-2222-2222-222222222222', 'T001', NULL, '{"T002"}'),
('LF001', '33333333-3333-3333-3333-333333333333', 'L001', NULL, '{"L002"}')
ON CONFLICT (handle) DO NOTHING;
