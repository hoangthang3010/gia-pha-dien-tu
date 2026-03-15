-- ============================================================
-- 🌳 Gia Phả Điện Tử — Database Setup
-- ============================================================
-- Chạy file này trong: Supabase Dashboard → SQL Editor
-- File này tạo toàn bộ cấu trúc database + dữ liệu mẫu demo
-- ============================================================


-- ╔══════════════════════════════════════════════════════════╗
-- ║  2. AUTH: profiles + auto-create trigger                ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'editor', 'archivist', 'guest')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    person_handle TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure profiles schema stays compatible even on existing databases
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT;
UPDATE profiles SET status = 'active' WHERE status IS NULL;
ALTER TABLE profiles ALTER COLUMN status SET DEFAULT 'active';
ALTER TABLE profiles ALTER COLUMN status SET NOT NULL;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
ALTER TABLE profiles
    ADD CONSTRAINT profiles_status_check CHECK (status IN ('active', 'suspended'));
UPDATE profiles SET role = 'member' WHERE role = 'viewer';
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'member';
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles
    ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'member', 'editor', 'archivist', 'guest'));

-- Auto-create profile on signup
-- ⚠️ ĐỔI EMAIL ADMIN: thay 'your-admin@example.com' bằng email admin thật
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_display_name TEXT;
BEGIN
    user_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', '');
    user_display_name := COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(user_email, '@', 1));
    IF user_email != '' THEN
        INSERT INTO public.profiles (id, email, display_name, role, status)
        VALUES (
            NEW.id,
            user_email,
            NULLIF(user_display_name, ''),
            CASE WHEN lower(user_email) = lower('thangminhhoang98@gmail.com') THEN 'admin' ELSE 'member' END,
            'active'
        )
        ON CONFLICT (email) DO UPDATE
            SET id = EXCLUDED.id,
                display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
                role = CASE
                    WHEN lower(EXCLUDED.email) = lower('thangminhhoang98@gmail.com') THEN 'admin'
                    ELSE 'member'
                END,
                status = 'active';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ╔══════════════════════════════════════════════════════════╗
-- ║  1. CORE TABLES: clans + clan_members                      ║
-- ╚══════════════════════════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS clans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  slug text UNIQUE,
  is_public boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clan_members (
  clan_id uuid REFERENCES clans(id),
  user_id uuid REFERENCES profiles(id),
  role text CHECK (role IN ('owner','admin','editor','viewer')) DEFAULT 'viewer',
  PRIMARY KEY (clan_id, user_id)
);

-- ╔══════════════════════════════════════════════════════════╗
-- ║  1. CORE TABLES: people + families                      ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS people (
    handle TEXT PRIMARY KEY,
    gramps_id TEXT,
    gender INT NOT NULL DEFAULT 1,           -- 1=Nam, 2=Nữ
    display_name TEXT NOT NULL,
    surname TEXT,
    first_name TEXT,
    generation INT DEFAULT 1,
    chi INT,
    birth_year INT,
    birth_date TEXT,
    birth_place TEXT,
    death_year INT,
    death_date TEXT,
    death_place TEXT,
    is_living BOOLEAN DEFAULT true,
    is_privacy_filtered BOOLEAN DEFAULT false,
    is_patrilineal BOOLEAN DEFAULT true,     -- true=chính tộc, false=ngoại tộc
    families TEXT[] DEFAULT '{}',            -- family handles where this person is parent
    parent_families TEXT[] DEFAULT '{}',     -- family handles where this person is child
    phone TEXT,
    email TEXT,
    zalo TEXT,
    facebook TEXT,
    current_address TEXT,
    hometown TEXT,
    occupation TEXT,
    company TEXT,
    education TEXT,
    nick_name TEXT,
    notes TEXT,
    clan_id uuid REFERENCES clans(id) ON DELETE CASCADE,
    created_by uuid references profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS families (
    handle TEXT PRIMARY KEY,
    father_handle TEXT,
    mother_handle TEXT,
    children TEXT[] DEFAULT '{}',
    clan_id uuid REFERENCES clans(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ╔══════════════════════════════════════════════════════════╗
-- ║  3. CONTRIBUTIONS (đề xuất chỉnh sửa)                  ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_email TEXT,
    person_handle TEXT NOT NULL,
    person_name TEXT,
    field_name TEXT NOT NULL,
    field_label TEXT,
    old_value TEXT,
    new_value TEXT NOT NULL,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_note TEXT,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ╔══════════════════════════════════════════════════════════╗
-- ║  4. EVENTS (lịch sự kiện gia đình)                      ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_at TIMESTAMPTZ NOT NULL,
    location TEXT,
    type TEXT DEFAULT 'event',
    creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    clan_id uuid REFERENCES clans(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  5. POSTS (bảng tin gia đình)                      ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title TEXT,
    body TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    status TEXT DEFAULT 'published'
    CHECK (status IN ('draft','published','archived')),
    is_pinned BOOLEAN DEFAULT false,
    clan_id uuid REFERENCES clans(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ╔══════════════════════════════════════════════════════════╗
-- ║  6. COMMENTS (bình luận)                                ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_email TEXT,
    author_name TEXT,
    body TEXT NOT NULL,
    clan_id uuid REFERENCES clans(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ╔══════════════════════════════════════════════════════════╗
-- ║  7. ROW LEVEL SECURITY (RLS)                            ║
-- ╚══════════════════════════════════════════════════════════╝

-- People & Families: public read, authenticated write, admin delete
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can read people" ON people;
CREATE POLICY "anyone can read people" ON people FOR SELECT USING (
    -- member của clan
    clan_id IN (
        SELECT clan_id
        FROM clan_members
        WHERE user_id = auth.uid()
    )

    -- admin xem tất cả
    OR EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);
DROP POLICY IF EXISTS "anyone can read families" ON families;
CREATE POLICY "anyone can read families" ON families FOR SELECT USING (
    clan_id IN (
        SELECT clan_id
        FROM clan_members
        WHERE user_id = auth.uid()
    )

    OR EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);
DROP POLICY IF EXISTS "authenticated can update people" ON people;
CREATE POLICY "authenticated can update people" ON people
    FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated can insert people" ON people;
CREATE POLICY "authenticated can insert people" ON people
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "admin can delete people" ON people;
CREATE POLICY "admin can delete people" ON people
    FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "authenticated can update families" ON families;
CREATE POLICY "authenticated can update families" ON families
    FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "authenticated can insert families" ON families;
CREATE POLICY "authenticated can insert families" ON families
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "admin can delete families" ON families;
CREATE POLICY "admin can delete families" ON families
    FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Profiles: public read, update own or admin
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone can read profiles" ON profiles;
CREATE POLICY "anyone can read profiles" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "users can insert own profile" ON profiles;
CREATE POLICY "users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "users or admin can update profile" ON profiles;
CREATE POLICY "users or admin can update profile" ON profiles
    FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Clans members: public read, authenticated write, admin delete
ALTER TABLE clan_members ENABLE ROW LEVEL SECURITY;
-- admin xem tất cả
DROP POLICY IF EXISTS "admin can read all clan_members" ON clan_members;
CREATE POLICY "admin can read all clan_members"
ON clan_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- user chỉ xem record của mình
DROP POLICY IF EXISTS "member can read own clan_members" ON clan_members;
CREATE POLICY "member can read own clan_members"
ON clan_members
FOR SELECT
USING (
  user_id = auth.uid()
);


-- Clans: public read, authenticated write, admin delete
ALTER TABLE clans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone can read clans" ON clans;
CREATE POLICY "anyone can read clans"
ON clans
FOR SELECT
USING (true);

-- Contributions: public read, user insert own, admin update
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone can read contributions" ON contributions;
CREATE POLICY "anyone can read contributions" ON contributions FOR SELECT USING (true);
DROP POLICY IF EXISTS "users can insert contributions" ON contributions;
CREATE POLICY "users can insert contributions" ON contributions FOR INSERT WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "admin can update contributions" ON contributions;
CREATE POLICY "admin can update contributions" ON contributions
    FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Comments: public read, user insert own, owner/admin delete
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone can read comments" ON comments;
CREATE POLICY "anyone can read comments" ON comments FOR SELECT USING (clan_id IN (
        SELECT clan_id
        FROM clan_members
        WHERE user_id = auth.uid()
    ));
DROP POLICY IF EXISTS "users can insert comments" ON comments;
CREATE POLICY "users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "owner or admin can delete comments" ON comments;
CREATE POLICY "owner or admin can delete comments" ON comments
    FOR DELETE USING (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Events: public read, user insert own, owner/admin delete
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can read events" ON events;
CREATE POLICY "anyone can read events"
ON events
FOR SELECT
USING (clan_id IN (
        SELECT clan_id
        FROM clan_members
        WHERE user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "authenticated can insert events" ON events;
CREATE POLICY "authenticated can insert events"
ON events
FOR INSERT
WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "creator can update events" ON events;
CREATE POLICY "creator can update events"
ON events
FOR UPDATE
USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "creator or admin can delete events" ON events;
CREATE POLICY "creator or admin can delete events"
ON events
FOR DELETE
USING (
    creator_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

-- Posts: public read, user insert own, owner/admin delete
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read posts" ON posts;
CREATE POLICY "read posts"
ON posts
FOR SELECT
USING (
    clan_id IN (
        SELECT clan_id
        FROM clan_members
        WHERE user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "insert posts" ON posts;
CREATE POLICY "insert posts"
ON posts
FOR INSERT
WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "update posts" ON posts;
CREATE POLICY "update posts"
ON posts
FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "delete posts" ON posts;
CREATE POLICY "delete posts"
ON posts
FOR DELETE
USING (
    author_id = auth.uid()
    OR EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_person ON contributions(person_handle);
CREATE INDEX IF NOT EXISTS idx_events_start_at ON events(start_at);
CREATE INDEX IF NOT EXISTS idx_events_creator ON events(creator_id);
CREATE INDEX IF NOT EXISTS idx_comments_person ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_people_generation ON people (generation);
CREATE INDEX IF NOT EXISTS idx_people_surname ON people (surname);
CREATE INDEX IF NOT EXISTS idx_families_father ON families (father_handle);
CREATE INDEX IF NOT EXISTS idx_families_mother ON families (mother_handle);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_people_clan ON people(clan_id);
CREATE INDEX IF NOT EXISTS idx_families_clan ON families(clan_id);
CREATE INDEX IF NOT EXISTS idx_posts_clan ON posts(clan_id);
CREATE INDEX IF NOT EXISTS idx_events_clan ON events(clan_id);
CREATE INDEX IF NOT EXISTS idx_comments_clan ON comments(clan_id);
CREATE INDEX IF NOT EXISTS idx_people_clan_generation ON people(clan_id, generation);
CREATE INDEX IF NOT EXISTS idx_families_clan ON families(clan_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS people_updated_at ON people;
CREATE TRIGGER people_updated_at BEFORE UPDATE ON people
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS families_updated_at ON families;
CREATE TRIGGER families_updated_at BEFORE UPDATE ON families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS posts_updated_at ON posts;
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS events_updated_at ON events;
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Constraints
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_body_length;
ALTER TABLE comments ADD CONSTRAINT comments_body_length CHECK (char_length(body) BETWEEN 1 AND 2000);
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
ALTER TABLE comments ADD CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES profiles(id);

ALTER TABLE contributions DROP CONSTRAINT IF EXISTS contributions_value_length;
ALTER TABLE contributions ADD CONSTRAINT contributions_value_length CHECK (char_length(new_value) <= 5000);

ALTER TABLE events DROP CONSTRAINT IF EXISTS events_creator_id_fkey;
ALTER TABLE events ADD CONSTRAINT events_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES profiles(id);

ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;
ALTER TABLE posts ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES profiles(id);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  7. DỮ LIỆU MẪU DEMO (xóa phần này nếu dùng dữ liệu thật)║
-- ╚══════════════════════════════════════════════════════════╝

-- Dòng họ mẫu: Họ Nguyễn Văn — 4 thế hệ, 15 thành viên
-- Cấu trúc:
--   Đời 1: Nguyễn Văn An (tổ tiên)
--   Đời 2: Bình, Cường, Dũng (3 con trai)
--   Đời 3: Bình → Hải, Hùng | Cường → Khoa, Khánh | Dũng → Long
--   Đời 4: Hải → Minh, Nam | Khoa → Phúc

INSERT INTO clans (id,name,slug,is_public)
VALUES (
'11111111-1111-1111-1111-111111111111',
'Họ Nguyễn Văn',
'ho-nguyen-van',
true
) ON CONFLICT (id)
DO UPDATE SET
name = EXCLUDED.name,
slug = EXCLUDED.slug;


INSERT INTO clan_members (clan_id,user_id,role)
VALUES (
'11111111-1111-1111-1111-111111111111',
'49e8a213-5626-4cfb-9487-001596d8519d',
'admin'
) ON CONFLICT (clan_id, user_id) DO NOTHING;

-- People
INSERT INTO people (
  handle, clan_id, display_name, gender, generation, birth_year, death_year,
  is_living, is_patrilineal, families, parent_families
)
VALUES
-- Đời 1
('P001', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn An', 1, 1, 1920, 1995, false, true, '{"F001"}', '{}'),

-- Đời 2
('P002', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Bình', 1, 2, 1945, NULL, true, true, '{"F002","F020","F021"}', '{"F001"}'),
('P003', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Cường', 1, 2, 1948, NULL, true, true, '{"F003"}', '{"F001"}'),
('P004', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Dũng', 1, 2, 1951, 2020, false, true, '{"F004"}', '{"F001"}'),

-- Đời 3
('P005', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Hải', 1, 3, 1970, NULL, true, true, '{"F005"}', '{"F002"}'),
('P006', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Hùng', 1, 3, 1973, NULL, true, true, '{}', '{"F002"}'),
('P007', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Khoa', 1, 3, 1975, NULL, true, true, '{"F006"}', '{"F003"}'),
('P008', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Khánh', 1, 3, 1978, NULL, true, true, '{}', '{"F003"}'),
('P009', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Long', 1, 3, 1980, NULL, true, true, '{}', '{"F004"}'),
('P021', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Bình Con', 1, 3, 1980, NULL, true, true, '{}', '{"F021"}'),

-- Đời 4
('P010', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Minh', 1, 4, 1995, NULL, true, true, '{}', '{"F005"}'),
('P011', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Nam', 1, 4, 1998, NULL, true, true, '{}', '{"F005"}'),
('P012', '11111111-1111-1111-1111-111111111111', 'Nguyễn Văn Phúc', 1, 4, 2000, NULL, true, true, '{}', '{"F006"}'),

-- Vợ (ngoại tộc)
('P013', '11111111-1111-1111-1111-111111111111', 'Trần Thị Lan', 2, 1, 1925, 2000, false, false, '{}', '{}'),
('P016', '11111111-1111-1111-1111-111111111111', 'Trần Thị Lan B', 2, 1, 1930, NULL, false, false, '{}', '{}'),
('P014', '11111111-1111-1111-1111-111111111111', 'Lê Thị Mai', 2, 2, 1948, NULL, true, false, '{}', '{}'),
('P015', '11111111-1111-1111-1111-111111111111', 'Phạm Thị Hoa', 2, 3, 1972, NULL, true, false, '{}', '{}'),
('P020', '11111111-1111-1111-1111-111111111111', 'Lê Thị Mai B', 2, 2, 1948, NULL, true, false, '{}', '{}')
ON CONFLICT (handle) DO NOTHING;


-- Families
INSERT INTO families (
  handle,
  clan_id,
  father_handle,
  mother_handle,
  children
)
VALUES
('F001', '11111111-1111-1111-1111-111111111111', 'P001', 'P013', '{"P002","P003","P004"}'),
('F002', '11111111-1111-1111-1111-111111111111', 'P002', 'P014', '{"P005","P006"}'),
('F003', '11111111-1111-1111-1111-111111111111', 'P003', NULL, '{"P007","P008"}'),
('F004', '11111111-1111-1111-1111-111111111111', 'P004', NULL, '{"P009"}'),
('F005', '11111111-1111-1111-1111-111111111111', 'P005', 'P015', '{"P010","P011"}'),
('F006', '11111111-1111-1111-1111-111111111111', 'P007', NULL, '{"P012"}'),
('F020', '11111111-1111-1111-1111-111111111111', 'P002', 'P020', '{}'),
('F021', '11111111-1111-1111-1111-111111111111', 'P002', NULL, '{"P021"}'),
('F022', '11111111-1111-1111-1111-111111111111', 'P001', 'P016', '{}')
ON CONFLICT (handle) DO NOTHING;


-- ============================================================
SELECT '✅ Database setup complete! Demo data loaded.' AS status;
-- ============================================================

create or replace function get_clan_tree(p_clan_id uuid)
returns json
language sql
security invoker
as $$
  select json_build_object(
    'people', (
      select json_agg(p)
      from people p
      where p.clan_id = p_clan_id
    ),
    'families', (
      select json_agg(f)
      from families f
      where f.clan_id = p_clan_id
    )
  );
$$;

