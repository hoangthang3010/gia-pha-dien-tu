require('dotenv').config();
const { Client } = require('pg');
const crypto = require('crypto');

const client = new Client(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'gia_pha',
      },
);

const ADMIN_ID = '1058c27a-32ae-4ea8-9638-a9672a74a18d';
const CLAN_DEFINITIONS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Nguyễn Văn Tộc',
    slug: 'nguyen-van-toc',
    rootMaleName: 'Nguyễn Văn Khởi',
    rootFemaleName: 'Trần Thị Hiền',
    branchMaleNames: ['Nguyễn Văn Quang', 'Nguyễn Văn Hòa', 'Nguyễn Văn Phúc', 'Nguyễn Văn Long'],
    branchFemaleNames: ['Lê Thị Lan', 'Đặng Thị Hương', 'Phạm Thị Minh', 'Võ Thị Ngọc'],
    childMaleNames: ['Nguyễn Văn Dũng', 'Nguyễn Văn Thành', 'Nguyễn Văn Khang', 'Nguyễn Văn An'],
    childFemaleNames: ['Nguyễn Thị Nhung', 'Nguyễn Thị Bích', 'Nguyễn Thị Hạnh', 'Nguyễn Thị Yến'],
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Trần Gia Tộc',
    slug: 'tran-gia-toc',
    rootMaleName: 'Trần Văn Cường',
    rootFemaleName: 'Nguyễn Thị Duyên',
    branchMaleNames: ['Trần Văn Bảo', 'Trần Văn Hưng', 'Trần Văn Tấn', 'Trần Văn Khải'],
    branchFemaleNames: ['Lý Thị Hà', 'Huỳnh Thị Thu', 'Mai Thị Thanh', 'Đỗ Thị Mẫn'],
    childMaleNames: ['Trần Văn Lực', 'Trần Văn Nam', 'Trần Văn Đức', 'Trần Văn Phát'],
    childFemaleNames: ['Trần Thị Trúc', 'Trần Thị Tâm', 'Trần Thị Diễm', 'Trần Thị Nhi'],
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Lê Gia Tộc',
    slug: 'le-gia-toc',
    rootMaleName: 'Lê Văn Đạt',
    rootFemaleName: 'Phan Thị Ái',
    branchMaleNames: ['Lê Văn Toàn', 'Lê Văn Kiên', 'Lê Văn Huy', 'Lê Văn Tuấn'],
    branchFemaleNames: ['Ngô Thị Hoa', 'Tạ Thị Nghi', 'Bùi Thị Liên', 'Châu Thị Thảo'],
    childMaleNames: ['Lê Văn Tài', 'Lê Văn Minh', 'Lê Văn Khoa', 'Lê Văn Sang'],
    childFemaleNames: ['Lê Thị Xoan', 'Lê Thị Thu', 'Lê Thị Ly', 'Lê Thị Mơ'],
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Phạm Gia Tộc',
    slug: 'pham-gia-toc',
    rootMaleName: 'Phạm Văn Thịnh',
    rootFemaleName: 'Hoàng Thị Vân',
    branchMaleNames: ['Phạm Văn Tùng', 'Phạm Văn Hòa', 'Phạm Văn Quý', 'Phạm Văn Sơn'],
    branchFemaleNames: ['Đinh Thị Vi', 'Nguyễn Thị Nhi', 'Lương Thị Lan', 'Vũ Thị Hà'],
    childMaleNames: ['Phạm Văn Kỳ', 'Phạm Văn Long', 'Phạm Văn Trí', 'Phạm Văn Châu'],
    childFemaleNames: ['Phạm Thị Hồng', 'Phạm Thị Nguyệt', 'Phạm Thị Diệu', 'Phạm Thị Kim'],
  },
];

const HO_NGUYEN = [
  'Hữu', 'Đăng', 'Minh', 'Thanh', 'Văn', 'Thị', 'Xuân', 'Kim', 'Bảo', 'Gia',
  'Ngọc', 'Khánh', 'Hoài', 'Anh', 'Tú', 'Đức', 'Trọng', 'Công', 'Phúc', 'Duy',
  'Hoàng', 'Quang', 'Hồng', 'Mỹ', 'Như', 'Quỳnh', 'Lan', 'Mai', 'Cúc', 'Trúc'
];

const TEN_NGUYEN = [
  'An', 'Bình', 'Cường', 'Dũng', 'Em', 'Giang', 'Hải', 'Hùng', 'Khanh', 'Long',
  'Minh', 'Nam', 'Phong', 'Quân', 'Sơn', 'Tùng', 'Vinh', 'Yến', 'Lan', 'Mai',
  'Linh', 'Trang', 'Hương', 'Ngọc', 'Vy', 'Trinh', 'Oanh', 'Thảo', 'Hoa', 'Phúc',
  'Thịnh', 'Phát', 'Lộc', 'Khang', 'Tài', 'Nhân', 'Nghĩa', 'Trí', 'Tín', 'Đức'
];

const POST_TITLES = [
  'Thông báo về việc đóng góp quỹ dòng họ năm 2026',
  'Kế hoạch trùng tu nhà thờ tổ chi họ Nguyễn Văn',
  'Hình ảnh buổi gặp mặt đầu xuân Bính Ngọ',
  'Lịch giỗ tổ năm nay và phân công chuẩn bị lễ vật',
  'Tìm kiếm thông tin nhánh cụ Nguyễn Văn Bột di cư năm 1954',
  'Mừng thọ các cụ cao niên trong dòng họ tròn 80, 90 tuổi',
  'Trao thưởng khuyến học cho con cháu đạt học sinh giỏi',
  'Chia sẻ tư liệu cổ về gia phả bản chữ Hán dòng họ',
  'Thông tin cưới hỏi của cháu Nguyễn Văn Minh và Trần Thị Lan',
  'Kỷ niệm ngày thành lập ban liên lạc dòng họ',
  'Danh sách đóng góp quỹ xây dựng lăng mộ tổ dòng họ',
  'Lời khuyên giáo dục con cháu giữ gìn truyền thống gia đình',
  'Tổ chức chuyến đi về nguồn tại đền Hùng',
  'Tin buồn: Cụ Nguyễn Thị Hoa đã tạ thế',
  'Khởi công xây dựng cổng làng dòng họ Nguyễn Văn'
];

const POST_BODIES = [
  'Kính gửi toàn thể bà con cô bác dòng họ, ban liên lạc xin thông báo mức đóng góp quỹ năm nay là 200.000đ/hộ gia đình để duy trì các hoạt động cúng giỗ và khuyến học.',
  'Dự án sửa sang lại mái ngói nhà thờ họ Nguyễn đã chính thức hoàn thành. Xin gửi lời cảm ơn sâu sắc tới các gia đình đã đóng góp công sức và tài chính.',
  'Buổi họp mặt diễn ra trong không khí vô cùng ấm cúng và xúc động. Rất nhiều gia đình ở xa cũng đã hội tụ về thắp hương cho tổ tiên.',
  'Năm nay chi trưởng sẽ chịu trách nhiệm chính chuẩn bị lễ phẩm. Đề nghị ban liên lạc hỗ trợ sắp xếp bàn ghế và tiếp đón khách khứa phương xa về dự.',
  'Theo nguồn tin cũ, một nhánh nhỏ của dòng họ đã chuyển vào Nam lập nghiệp từ lâu. Ai có thông tin gì xin vui lòng bình luận phía dưới để chắp nối gia phả.',
  'Chúc các cụ luôn mạnh khỏe, sống lâu trăm tuổi cùng con cháu. Sự hiện diện của các cụ là niềm tự hào lớn nhất của dòng họ chúng ta.',
  'Năm học vừa qua dòng họ ghi nhận hơn 30 cháu đạt thành tích cao. Ban khuyến học sẽ tổ chức phát quà tại nhà thờ tổ vào chủ nhật tuần tới.',
  'Bản dịch nghĩa sơ bộ của gia phả chữ Nôm thế kỷ 19 đã hoàn thiện. Con cháu có nhu cầu đọc bản dịch xin liên hệ chi thư ký họ Nguyễn.',
  'Chúc hai cháu trăm năm hạnh phúc, sớm sinh quý tử. Đám cưới sẽ được tổ chức trang trọng tại tư gia dòng họ ngày 18 tháng sau.',
  'Mười năm là một chặng đường ý nghĩa để dòng họ chúng ta gắn kết hơn. Cảm ơn ban liên lạc đã tận tâm cống hiến suốt thời gian qua.'
];

const COMMENTS_POOL = [
  'Thông tin rất hữu ích, gia đình tôi sẽ đóng góp đầy đủ.',
  'Chúc mừng ban liên lạc dòng họ đã hoàn thành công việc xuất sắc!',
  'Ảnh chụp rất đẹp và tự nhiên, chúc dòng họ ngày càng thịnh vượng.',
  'Gia đình tôi ở xa xin phép gửi quỹ chuyển khoản qua ban đại diện.',
  'Thật tự hào khi là một phần của dòng họ Nguyễn Văn.',
  'Hy vọng sớm tìm lại được các bác nhánh di cư để sum họp gia đình.',
  'Chúc các cụ bách niên giai lão, luôn là chỗ dựa tinh thần cho con cháu.',
  'Ban khuyến học làm việc rất ý nghĩa, động viên các cháu học tập tốt.',
  'Tôi muốn xin một bản in gia phả dịch nghĩa thì đăng ký ở đâu ạ?',
  'Nhìn ảnh thèm được về quê ăn giỗ họ quá, hẹn mọi người năm sau vậy.',
  'Đã nhận được thông báo, gia đình tôi sẽ sắp xếp công việc về tham gia.',
  'Ý kiến đóng góp rất thiết thực, chúc hai cháu hạnh phúc viên mãn.'
];

function generateUuid() {
  return crypto.randomUUID();
}

function buildPerson({ handle, displayName, gender, generation, birthYear, deathYear, isLiving, isPatrilineal, families = [], parentFamilies = [] }) {
  return {
    handle,
    displayName,
    gender,
    generation,
    birthYear,
    deathYear,
    isLiving,
    isPatrilineal,
    families,
    parentFamilies,
  };
}

function buildClanTree(clanConfig) {
  const people = [];
  const families = [];
  const familyPrefix = clanConfig.slug.replace(/-/g, '_');

  const rootFather = buildPerson({
    handle: `${familyPrefix}_root_father`,
    displayName: clanConfig.rootMaleName,
    gender: 1,
    generation: 1,
    birthYear: 1890,
    deathYear: 1965,
    isLiving: false,
    isPatrilineal: true,
  });
  const rootMother = buildPerson({
    handle: `${familyPrefix}_root_mother`,
    displayName: clanConfig.rootFemaleName,
    gender: 2,
    generation: 1,
    birthYear: 1895,
    deathYear: 1970,
    isLiving: false,
    isPatrilineal: false,
  });

  const rootFamilyHandle = `${familyPrefix}_fam_1`;
  rootFather.families = [rootFamilyHandle];
  rootMother.families = [rootFamilyHandle];
  const rootFamily = {
    handle: rootFamilyHandle,
    fatherHandle: rootFather.handle,
    motherHandle: rootMother.handle,
    children: [],
  };

  people.push(rootFather, rootMother);
  families.push(rootFamily);

  const generation2 = [];
  for (let index = 0; index < 4; index += 1) {
    const isMale = index % 2 === 0;
    const child = buildPerson({
      handle: `${familyPrefix}_g2_${index + 1}`,
      displayName: isMale ? clanConfig.branchMaleNames[index] : clanConfig.branchFemaleNames[index],
      gender: isMale ? 1 : 2,
      generation: 2,
      birthYear: 1920 + index * 6,
      deathYear: isMale ? 1985 + index : 1990 + index,
      isLiving: false,
      isPatrilineal: isMale,
      parentFamilies: [rootFamilyHandle],
    });
    rootFamily.children.push(child.handle);
    generation2.push(child);
    people.push(child);
  }

  const firstMaleChild = generation2.find((person) => person.gender === 1);
  if (firstMaleChild) {
    const firstSpouse = buildPerson({
      handle: `${familyPrefix}_spouse_1`,
      displayName: clanConfig.branchFemaleNames[2],
      gender: 2,
      generation: 2,
      birthYear: 1928,
      deathYear: 1998,
      isLiving: false,
      isPatrilineal: false,
      families: [`${familyPrefix}_fam_2`],
    });
    const firstFamilyHandle = `${familyPrefix}_fam_2`;
    const firstFamily = {
      handle: firstFamilyHandle,
      fatherHandle: firstMaleChild.handle,
      motherHandle: firstSpouse.handle,
      children: [],
    };
    firstMaleChild.families.push(firstFamilyHandle);
    people.push(firstSpouse);
    families.push(firstFamily);

    for (let index = 0; index < 2; index += 1) {
      const grandChild = buildPerson({
        handle: `${familyPrefix}_g3_${index + 1}`,
        displayName: index % 2 === 0 ? clanConfig.childMaleNames[index] : clanConfig.childFemaleNames[index],
        gender: index % 2 === 0 ? 1 : 2,
        generation: 3,
        birthYear: 1950 + index * 4,
        deathYear: null,
        isLiving: true,
        isPatrilineal: index % 2 === 0,
        parentFamilies: [firstFamilyHandle],
      });
      firstFamily.children.push(grandChild.handle);
      people.push(grandChild);
    }

    const secondSpouse = buildPerson({
      handle: `${familyPrefix}_spouse_2`,
      displayName: clanConfig.branchFemaleNames[3],
      gender: 2,
      generation: 2,
      birthYear: 1932,
      deathYear: null,
      isLiving: true,
      isPatrilineal: false,
      families: [`${familyPrefix}_fam_3`],
    });
    const secondFamilyHandle = `${familyPrefix}_fam_3`;
    const secondFamily = {
      handle: secondFamilyHandle,
      fatherHandle: firstMaleChild.handle,
      motherHandle: secondSpouse.handle,
      children: [],
    };
    firstMaleChild.families.push(secondFamilyHandle);
    people.push(secondSpouse);
    families.push(secondFamily);

    for (let index = 0; index < 2; index += 1) {
      const grandChild = buildPerson({
        handle: `${familyPrefix}_g4_${index + 1}`,
        displayName: index % 2 === 0 ? clanConfig.childMaleNames[index + 2] : clanConfig.childFemaleNames[index + 2],
        gender: index % 2 === 0 ? 1 : 2,
        generation: 3,
        birthYear: 1958 + index * 4,
        deathYear: null,
        isLiving: true,
        isPatrilineal: index % 2 === 0,
        parentFamilies: [secondFamilyHandle],
      });
      secondFamily.children.push(grandChild.handle);
      people.push(grandChild);
    }
  }

  const otherMaleChildren = generation2.filter((person) => person.gender === 1 && person.handle !== firstMaleChild?.handle);
  otherMaleChildren.forEach((person, index) => {
    const spouse = buildPerson({
      handle: `${familyPrefix}_spouse_${index + 3}`,
      displayName: clanConfig.branchFemaleNames[index],
      gender: 2,
      generation: 2,
      birthYear: 1930 + index * 3,
      deathYear: null,
      isLiving: true,
      isPatrilineal: false,
      families: [`${familyPrefix}_fam_${index + 4}`],
    });
    const familyHandle = `${familyPrefix}_fam_${index + 4}`;
    const family = {
      handle: familyHandle,
      fatherHandle: person.handle,
      motherHandle: spouse.handle,
      children: [],
    };
    person.families.push(familyHandle);
    people.push(spouse);
    families.push(family);

    for (let nestedIndex = 0; nestedIndex < 2; nestedIndex += 1) {
      const grandChild = buildPerson({
        handle: `${familyPrefix}_g5_${index + 1}_${nestedIndex + 1}`,
        displayName: nestedIndex % 2 === 0 ? clanConfig.childMaleNames[index + 1] : clanConfig.childFemaleNames[index + 1],
        gender: nestedIndex % 2 === 0 ? 1 : 2,
        generation: 3,
        birthYear: 1960 + index * 3 + nestedIndex * 2,
        deathYear: null,
        isLiving: true,
        isPatrilineal: nestedIndex % 2 === 0,
        parentFamilies: [familyHandle],
      });
      family.children.push(grandChild.handle);
      people.push(grandChild);
    }
  });

  return { people, families };
}

async function ensureClanMembership(clientInstance, clanId, userId, role) {
  await clientInstance.query(`
    INSERT INTO clan_members (clan_id, user_id, role)
    VALUES ($1, $2, $3)
    ON CONFLICT (clan_id, user_id) DO NOTHING;
  `, [clanId, userId, role]);
}

async function runSeed() {
  try {
    await client.connect();
    console.log('Connected to DB successfully!');

    console.log('Clearing database tables...');
    await client.query(`
      TRUNCATE TABLE sessions, event_rsvps, comments, posts, contributions, events, media, notifications, invite_links, families, people, clan_members RESTART IDENTITY CASCADE;
    `);

    await client.query(`DELETE FROM profiles WHERE id != $1;`, [ADMIN_ID]);

    for (const clan of CLAN_DEFINITIONS) {
      await client.query(`
        INSERT INTO clans (id, name, slug, is_public)
        VALUES ($1, $2, $3, true)
        ON CONFLICT (id) DO NOTHING;
      `, [clan.id, clan.name, clan.slug]);
    }

    for (const clan of CLAN_DEFINITIONS) {
      await ensureClanMembership(client, clan.id, ADMIN_ID, 'owner');
    }

    console.log('Base profiles and clans ensured.');

    console.log('Generating profile users...');
    const userIds = [];
    const emails = [];
    for (let i = 1; i <= 40; i += 1) {
      const id = generateUuid();
      const email = `user.${i}@nguyenvan.org`;
      const displayName = `Nguyễn Văn Thành Viên ${i}`;
      const hashedPassword = '$2b$10$3HLlRbvKuVPQLTzPiKJiGORfq8EdisD8kj8GjTfrmhy9t.2Jb7gB2';
      const role = i <= 5 ? 'editor' : 'member';

      await client.query(`
        INSERT INTO profiles (id, email, hashed_password, display_name, role, status)
        VALUES ($1, $2, $3, $4, $5, 'active');
      `, [id, email, hashedPassword, displayName, role]);

      const assignedClans = [CLAN_DEFINITIONS[0].id];
      if (i <= 20) assignedClans.push(CLAN_DEFINITIONS[1].id);
      if (i % 2 === 0) assignedClans.push(CLAN_DEFINITIONS[2].id);
      if (i % 5 === 0) assignedClans.push(CLAN_DEFINITIONS[3].id);

      for (const clanId of assignedClans) {
        await ensureClanMembership(client, clanId, id, role);
      }

      userIds.push(id);
      emails.push({ id, email, displayName });
    }
    console.log(`Generated ${userIds.length} user profiles.`);

    console.log('Generating connected family trees for multiple clans...');
    const allPeople = [];
    const allFamilies = [];

    for (const clan of CLAN_DEFINITIONS) {
      const { people, families } = buildClanTree(clan);
      allPeople.push(...people.map((person) => ({ ...person, clanId: clan.id })));
      allFamilies.push(...families.map((family) => ({ ...family, clanId: clan.id })));
    }

    console.log(`Inserting ${allPeople.length} people into DB...`);
    for (const person of allPeople) {
      await client.query(`
        INSERT INTO people (
          handle, clan_id, display_name, gender, generation, birth_year, death_year,
          is_living, is_patrilineal, families, parent_families
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
      `, [
        person.handle,
        person.clanId,
        person.displayName,
        person.gender,
        person.generation,
        person.birthYear,
        person.deathYear,
        person.isLiving,
        person.isPatrilineal,
        person.families,
        person.parentFamilies,
      ]);
    }

    console.log(`Inserting ${allFamilies.length} families into DB...`);
    for (const family of allFamilies) {
      await client.query(`
        INSERT INTO families (handle, clan_id, father_handle, mother_handle, children)
        VALUES ($1, $2, $3, $4, $5);
      `, [family.handle, family.clanId, family.fatherHandle, family.motherHandle, family.children]);
    }
    console.log('Seeded clan tree structure.');

    console.log('Generating 60 posts...');
    const postIds = [];
    for (let i = 1; i <= 60; i += 1) {
      const id = generateUuid();
      const author = emails[i % emails.length];
      const clan = CLAN_DEFINITIONS[i % CLAN_DEFINITIONS.length];
      const title = `${POST_TITLES[i % POST_TITLES.length]} (Phần ${Math.ceil(i / POST_TITLES.length)})`;
      const body = `${POST_BODIES[i % POST_BODIES.length]} Hơn nữa, đây là hoạt động thường niên lần thứ ${i} của gia tộc chúng ta. Mong bà con nhiệt tình hưởng ứng.`;
      const type = i % 8 === 0 ? 'announcement' : i % 12 === 0 ? 'story' : 'general';
      const status = 'published';
      const isPinned = i === 1 || i === 5;
      const createdAt = new Date(Date.now() - i * 8 * 3600 * 1000);

      await client.query(`
        INSERT INTO posts (id, author_id, title, body, type, status, is_pinned, clan_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
      `, [id, author.id, title, body, type, status, isPinned, clan.id, createdAt]);
      postIds.push(id);
    }
    console.log(`Generated ${postIds.length} posts.`);

    console.log('Generating 150 comments...');
    for (let i = 1; i <= 150; i += 1) {
      const id = generateUuid();
      const author = emails[i % emails.length];
      const postId = postIds[i % postIds.length];
      const content = COMMENTS_POOL[i % COMMENTS_POOL.length] + ` (ý kiến thứ ${i})`;
      const personHandle = allPeople[i % allPeople.length].handle;
      const createdAt = new Date(Date.now() - i * 3 * 3600 * 1000);
      const clan = CLAN_DEFINITIONS[i % CLAN_DEFINITIONS.length];

      await client.query(`
        INSERT INTO comments (id, author_id, post_id, author_email, author_name, content, person_handle, clan_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
      `, [id, author.id, postId, author.email, author.displayName, content, personHandle, clan.id, createdAt]);
    }
    console.log('Seeded comments.');

    console.log('Generating 25 events...');
    const eventIds = [];
    for (let i = 1; i <= 25; i += 1) {
      const id = generateUuid();
      const title = `Sự kiện dòng tộc ${CLAN_DEFINITIONS[i % CLAN_DEFINITIONS.length].name} #${i}`;
      const description = `Mô tả chi tiết của sự kiện dòng họ số ${i}. Đây là dịp đặc biệt để thắt chặt tình cảm gia đình.`;
      const startAt = new Date(Date.now() + (i - 10) * 2 * 24 * 3600 * 1000);
      const location = `Nhà thờ tổ ${CLAN_DEFINITIONS[i % CLAN_DEFINITIONS.length].name}, khu vực ${i % 4 + 1}`;
      const type = i % 5 === 0 ? 'memorial' : i % 3 === 0 ? 'meeting' : 'announcement';
      const clan = CLAN_DEFINITIONS[i % CLAN_DEFINITIONS.length];

      await client.query(`
        INSERT INTO events (id, title, description, start_at, location, type, creator_id, clan_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `, [id, title, description, startAt, location, type, ADMIN_ID, clan.id]);

      eventIds.push(id);

      for (let j = 0; j < 10; j += 1) {
        const rsvpId = generateUuid();
        const user = emails[(i * 3 + j) % emails.length];
        const status = j % 3 === 0 ? 'YES' : j % 3 === 1 ? 'MAYBE' : 'NO';

        await client.query(`
          INSERT INTO event_rsvps (id, event_id, user_id, status, clan_id)
          VALUES ($1, $2, $3, $4, $5);
        `, [rsvpId, id, user.id, status, clan.id]);
      }
    }
    console.log(`Generated ${eventIds.length} events with RSVPs.`);

    console.log('Generating 30 notifications for admin user...');
    for (let i = 1; i <= 30; i += 1) {
      const id = generateUuid();
      const type = i % 3 === 0 ? 'event' : i % 3 === 1 ? 'post' : 'contribution';
      const title = `Thông báo hệ thống #${i}`;
      const message = `Có hoạt động mới: bạn nhận được thông báo về ${type} số ${i} liên quan đến gia tộc.`;
      const linkUrl = type === 'event' ? '/events' : type === 'post' ? '/feed' : '/admin/contributions';
      const isRead = i > 10;
      const createdAt = new Date(Date.now() - i * 6 * 3600 * 1000);

      await client.query(`
        INSERT INTO notifications (id, user_id, type, title, message, link_url, is_read, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `, [id, ADMIN_ID, type, title, message, linkUrl, isRead, createdAt]);
    }
    console.log('Seeded notifications.');

    console.log('Generating 30 invite links...');
    for (let i = 1; i <= 30; i += 1) {
      const id = generateUuid();
      const code = `NGUYEN-VAN-CODE-${i}`;
      const role = i % 5 === 0 ? 'editor' : 'member';
      const maxUses = i % 3 === 0 ? 5 : 1;
      const usedCount = i % 3 === 0 ? 2 : 0;
      const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000);

      await client.query(`
        INSERT INTO invite_links (id, code, role, max_uses, used_count, created_by, expires_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `, [id, code, role, maxUses, usedCount, ADMIN_ID, expiresAt]);
    }
    console.log('Seeded invite links.');

    console.log('Database seeding process completed successfully!');
  } catch (error) {
    console.error('Seed process failed:', error);
  } finally {
    await client.end();
  }
}

runSeed();
