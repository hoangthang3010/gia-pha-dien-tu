-- Dữ liệu mẫu demo
-- Using existing admin profile id from the database: 1058c27a-32ae-4ea8-9638-a9672a74a18d

INSERT INTO profiles AS p (id, email, hashed_password, display_name, role, status) VALUES
('1058c27a-32ae-4ea8-9638-a9672a74a18d', 'thangminhhoang98@gmail.com', '$2b$10$3HLlRbvKuVPQLTzPiKJiGORfq8EdisD8kj8GjTfrmhy9t.2Jb7gB2', 'Nguyễn Văn B', 'admin', 'active'),
('22222222-2222-2222-2222-222222222222', 'tran.a@gmail.com', '$2b$10$3HLlRbvKuVPQLTzPiKJiGORfq8EdisD8kj8GjTfrmhy9t.2Jb7gB2', 'Trần Văn A', 'user', 'active'),
('33333333-3333-3333-3333-333333333333', 'le.b@gmail.com', '$2b$10$3HLlRbvKuVPQLTzPiKJiGORfq8EdisD8kj8GjTfrmhy9t.2Jb7gB2', 'Lê Văn B', 'user', 'active'),
('44444444-4444-4444-4444-444444444444', 'pham.c@gmail.com', '$2b$10$3HLlRbvKuVPQLTzPiKJiGORfq8EdisD8kj8GjTfrmhy9t.2Jb7gB2', 'Phạm Văn C', 'user', 'active'),
('55555555-5555-5555-5555-555555555555', 'hoang.d@gmail.com', '$2b$10$3HLlRbvKuVPQLTzPiKJiGORfq8EdisD8kj8GjTfrmhy9t.2Jb7gB2', 'Hoàng Văn D', 'user', 'active')
ON CONFLICT (email) DO UPDATE SET
  hashed_password = COALESCE(p.hashed_password, EXCLUDED.hashed_password),
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role,
  status = EXCLUDED.status;
-- Default password for seeded users: Admin@123

INSERT INTO clans (id,name,slug,is_public)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Nguyễn Văn', 'nguyen-van', true), 
('22222222-2222-2222-2222-222222222222', 'Trần Tộc', 'tran-toc', true),
('33333333-3333-3333-3333-333333333333', 'Lê Gia', 'le-gia', true),
('44444444-4444-4444-4444-444444444444', 'Phạm Họ', 'pham-ho', false),
('55555555-5555-5555-5555-555555555555', 'Hoàng Tộc', 'hoang-toc', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO clan_members (clan_id,user_id,role)
VALUES 
('11111111-1111-1111-1111-111111111111','1058c27a-32ae-4ea8-9638-a9672a74a18d','owner'),
('22222222-2222-2222-2222-222222222222','22222222-2222-2222-2222-222222222222','owner'),
('33333333-3333-3333-3333-333333333333','33333333-3333-3333-3333-333333333333','owner'),
('44444444-4444-4444-4444-444444444444','44444444-4444-4444-4444-444444444444','owner'),
('55555555-5555-5555-5555-555555555555','55555555-5555-5555-5555-555555555555','owner')
ON CONFLICT (clan_id, user_id) DO NOTHING;

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

-- Contributions
INSERT INTO contributions (id, author_id, author_email, person_handle, person_name, field_name, field_label, old_value, new_value, note, status, reviewed_by, reviewed_at)
VALUES
('c1111111-1111-4111-8111-111111111111', '33333333-3333-3333-3333-333333333333', 'le.b@gmail.com', 'P005', 'Nguyễn Văn Hải', 'occupation', 'Nghề nghiệp', 'N/A', 'Kỹ sư phần mềm', 'Cập nhật nghề nghiệp của Hải', 'pending', NULL, NULL),
('c2222222-2222-4222-8222-222222222222', '44444444-4444-4444-4444-444444444444', 'pham.c@gmail.com', 'P010', 'Nguyễn Văn Minh', 'birth_year', 'Năm sinh', '1995', '1996', 'Chỉnh lại năm sinh Minh', 'approved', '1058c27a-32ae-4ea8-9638-a9672a74a18d', '2026-01-10T09:30:00Z'),
('c3333333-3333-4333-8333-333333333333', '22222222-2222-2222-2222-222222222222', 'tran.a@gmail.com', 'P014', 'Lê Thị Mai', 'note', 'Ghi chú', NULL, 'Thêm thông tin Mai', 'rejected', '1058c27a-32ae-4ea8-9638-a9672a74a18d', '2026-02-15T14:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Events
INSERT INTO events (id, title, description, start_at, location, type, creator_id, clan_id)
VALUES
('e1111111-1111-4111-8111-111111111111', 'Lễ giỗ họ Nguyễn', 'Tổ chức lễ giỗ đầu năm cho gia đình họ Nguyễn', '2026-07-10T10:00:00Z', 'Nhà thờ họ Nguyễn', 'memorial', '1058c27a-32ae-4ea8-9638-a9672a74a18d', '11111111-1111-1111-1111-111111111111'),
('e2222222-2222-4222-8222-222222222222', 'Họp mặt dòng họ Trần', 'Buổi họp mặt chia sẻ lịch sử và ảnh gia đình', '2026-07-17T14:00:00Z', 'Phòng cộng đồng Trần Tộc', 'meeting', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222'),
('e3333333-3333-4333-8333-333333333333', 'Ra mắt album gia đình', 'Giới thiệu bộ ảnh mới cho họ Lê', '2026-08-05T16:00:00Z', 'Nhà văn hóa Lê Gia', 'announcement', '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

INSERT INTO event_rsvps (id, event_id, user_id, status, clan_id)
VALUES
('r1111111-1111-4111-8111-111111111111', 'e1111111-1111-4111-8111-111111111111', '22222222-2222-2222-2222-222222222222', 'YES', '11111111-1111-1111-1111-111111111111'),
('r2222222-2222-4222-8222-222222222222', 'e1111111-1111-4111-8111-111111111111', '33333333-3333-3333-3333-333333333333', 'MAYBE', '11111111-1111-1111-1111-111111111111'),
('r3333333-3333-4333-8333-333333333333', 'e2222222-2222-4222-8222-222222222222', '44444444-4444-4444-4444-444444444444', 'NO', '22222222-2222-2222-2222-222222222222'),
('r4444444-4444-4444-8444-444444444444', 'e3333333-3333-4333-8333-333333333333', '55555555-5555-5555-5555-555555555555', 'YES', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

-- Posts and comments
INSERT INTO posts (id, author_id, title, body, type, status, is_pinned, clan_id)
VALUES
('p1111111-1111-4111-8111-111111111111', '33333333-3333-3333-3333-333333333333', 'Thư mời tham dự', 'Mời các thành viên họ Lê đến dự lễ hội mùa hè.', 'announcement', 'published', true, '33333333-3333-3333-3333-333333333333'),
('p2222222-2222-4222-8222-222222222222', '22222222-2222-2222-2222-222222222222', 'Kỷ niệm giỗ tổ', 'Đã cập nhật lịch giỗ tổ tại nhà thờ họ Nguyễn.', 'general', 'published', false, '11111111-1111-1111-1111-111111111111'),
('p3333333-3333-4333-8333-333333333333', '44444444-4444-4444-4444-444444444444', 'Chia sẻ câu chuyện', 'Các con cháu họ Phạm đã thu thập được tư liệu.', 'general', 'published', false, '44444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

INSERT INTO comments (id, author_id, post_id, author_email, author_name, content, person_handle, clan_id)
VALUES
('cm1111111-1111-4111-8111-111111111111', '55555555-5555-5555-5555-555555555555', 'p1111111-1111-4111-8111-111111111111', 'hoang.d@gmail.com', 'Hoàng Văn D', 'Rất mong có thêm nhiều hình ảnh.', 'P034', '33333333-3333-3333-3333-333333333333'),
('cm2222222-2222-4222-8222-222222222222', '22222222-2222-2222-2222-222222222222', 'p2222222-2222-4222-8222-222222222222', 'tran.a@gmail.com', 'Trần Văn A', 'Cảm ơn đã cập nhật lịch.', 'P005', '11111111-1111-1111-1111-111111111111'),
('cm3333333-3333-4333-8333-333333333333', '33333333-3333-3333-3333-333333333333', 'p3333333-3333-4333-8333-333333333333', 'le.b@gmail.com', 'Lê Văn B', 'Thật ý nghĩa khi lưu giữ ký ức này.', 'P014', '44444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

-- Media
INSERT INTO media (id, file_name, mime_type, file_size, title, description, state, uploader_id)
VALUES
('m1111111-1111-4111-8111-111111111111', 'nguyen_memorial.jpg', 'image/jpeg', 204800, 'Ảnh lễ giỗ', 'Hình ảnh lễ giỗ họ Nguyễn năm 2026.', 'PUBLISHED', '1058c27a-32ae-4ea8-9638-a9672a74a18d'),
('m2222222-2222-4222-8222-222222222222', 'tran_family.pdf', 'application/pdf', 512000, 'Tư liệu Trần Tộc', 'Tập hợp ký ức và tư liệu họ Trần.', 'APPROVED', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- Notifications
INSERT INTO notifications (id, user_id, type, title, message, link_url, is_read)
VALUES
('n1111111-1111-4111-8111-111111111111', '22222222-2222-2222-2222-222222222222', 'event', 'Lời mời dự giỗ tổ', 'Bạn được mời tham gia lễ giỗ họ Nguyễn.', '/events/e1111111-1111-4111-8111-111111111111', false),
('n2222222-2222-4222-8222-222222222222', '33333333-3333-3333-3333-333333333333', 'post', 'Bài viết mới từ họ Lê', 'Có bài viết mới trong nhóm họ Lê.', '/posts/p1111111-1111-4111-8111-111111111111', false)
ON CONFLICT (id) DO NOTHING;

-- Invite links
INSERT INTO invite_links (id, code, role, max_uses, used_count, created_by, expires_at)
VALUES
('i1111111-1111-4111-8111-111111111111', 'INVITE-NGUYEN', 'member', 20, 2, '1058c27a-32ae-4ea8-9638-a9672a74a18d', '2026-12-31T23:59:59Z'),
('i2222222-2222-4222-8222-222222222222', 'INVITE-TRAN', 'member', 15, 1, '22222222-2222-2222-2222-222222222222', '2026-10-31T23:59:59Z')
ON CONFLICT (code) DO NOTHING;

-- Sessions
INSERT INTO sessions (id, user_id, refresh_token, expires_at)
VALUES
('s1111111-1111-4111-8111-111111111111', '22222222-2222-2222-2222-222222222222', 'token-tran-a-000000000000000000000000000000000000000000000000000000000000', '2026-12-31T23:59:59Z'),
('s2222222-2222-4222-8222-222222222222', '33333333-3333-3333-3333-333333333333', 'token-le-b-000000000000000000000000000000000000000000000000000000000000', '2026-12-31T23:59:59Z')
ON CONFLICT (id) DO NOTHING;
