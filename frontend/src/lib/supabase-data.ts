/**
 * API data layer for the genealogy tree
 * Replaces Supabase SDK with Axios Client for NestJS Backend
 */
import apiClient from "./api-client";
import type { TreeNode, TreeFamily } from "./tree-layout";

export type { TreeNode, TreeFamily };

const DEFAULT_PAGE_LIMIT = 200;

export function createPaginationParams(limit = DEFAULT_PAGE_LIMIT, page = 1) {
  return {
    limit,
    page,
  };
}

function normalizePagedData<T>(data: any): T[] {
  const payload = data?.items ?? data ?? [];
  return Array.isArray(payload) ? payload : [];
}

// ── Read operations ──

/** Fetch people from NestJS with optional page pagination */
export async function fetchPeople(limit = DEFAULT_PAGE_LIMIT, page = 1): Promise<TreeNode[]> {
  try {
    const { data } = await apiClient.get('/people', { params: createPaginationParams(limit, page) });
    const rows = normalizePagedData<any>(data);
    return rows.map((row) => ({
      ...row,
      displayName: row.display_name,
      birthYear: row.birth_year,
      deathYear: row.death_year,
      isLiving: row.is_living,
      isPrivacyFiltered: row.is_privacy_filtered,
      isPatrilineal: row.is_patrilineal,
      parentFamilies: row.parent_families || [],
      families: row.families || [],
    }));
  } catch (error: any) {
    console.error("Failed to fetch people:", error.message);
    return [];
  }
}

/** Fetch all families from NestJS */
export async function fetchFamilies(limit = DEFAULT_PAGE_LIMIT, page = 1): Promise<TreeFamily[]> {
  try {
    const { data } = await apiClient.get('/families', { params: createPaginationParams(limit, page) });
    const rows = normalizePagedData<any>(data);
    return rows.map((row) => ({
      ...row,
      fatherHandle: row.father_handle,
      motherHandle: row.mother_handle,
      children: row.children || [],
    }));
  } catch (error: any) {
    console.error("Failed to fetch families:", error.message);
    return [];
  }
}

export async function fetchClans(limit = DEFAULT_PAGE_LIMIT, page = 1) {
  try {
    const { data } = await apiClient.get('/clans', { params: createPaginationParams(limit, page) });
    return normalizePagedData<any>(data);
  } catch (error) {
    throw error;
  }
}

export async function fetchClanMembers(limit = DEFAULT_PAGE_LIMIT, page = 1) {
  try {
    const { data } = await apiClient.get('/clan-members', { params: createPaginationParams(limit, page) });
    const rows = normalizePagedData<any>(data);
    return rows.map((item) => ({
      label: item.clan?.name,
      value: item.clan?.id,
      role: item.role,
      description: item.clan?.description,
    }));
  } catch (error) {
    throw error;
  }
}

/** Fetch both people and families in parallel */
export async function fetchTreeData(clanId?: string): Promise<{
  people: TreeNode[];
  families: TreeFamily[];
}> {
  console.log(clanId);

  try {
    // clanId is now fetched from the cookie by the backend
    const [pRes, fRes] = await Promise.all([
      apiClient.get('/people', { params: createPaginationParams() }),
      apiClient.get('/families', { params: createPaginationParams() }),
    ]);

    const peopleRows = Array.isArray(pRes.data) ? pRes.data : pRes.data?.items ?? [];
    const familyRows = Array.isArray(fRes.data) ? fRes.data : fRes.data?.items ?? [];

    return {
      people: peopleRows.map((row: any) => ({
        ...row,
        displayName: row.display_name,
        birthYear: row.birth_year,
        deathYear: row.death_year,
        isLiving: row.is_living,
        isPrivacyFiltered: row.is_privacy_filtered,
        isPatrilineal: row.is_patrilineal,
        parentFamilies: row.parent_families || [],
        families: row.families || [],
      })),
      families: familyRows.map((row: any) => ({
        ...row,
        fatherHandle: row.father_handle,
        motherHandle: row.mother_handle,
        children: row.children || [],
      })),
    };
  } catch (error) {
    throw error;
  }
}

// ── Write operations (editor mode) ──

export async function updateFamilyChildren(
  familyHandle: string,
  newChildrenOrder: string[],
): Promise<void> {
  try {
    await apiClient.patch(`/families/${familyHandle}`, { children: newChildrenOrder });
  } catch (error: any) {
    console.error("Failed to update family children:", error.message);
  }
}

export async function moveChildToFamily(
  childHandle: string,
  fromFamilyHandle: string,
  toFamilyHandle: string,
  currentFamilies: TreeFamily[],
): Promise<void> {
  // Ideally this complex transaction is handled by a single NestJS endpoint
  // e.g. PUT /families/move-child
  try {
    await apiClient.post('/families/move-child', {
      childHandle,
      fromFamilyHandle,
      toFamilyHandle
    });
  } catch (error: any) {
    console.error("Failed to move child:", error.message);
  }
}

export async function removeChildFromFamily(
  childHandle: string,
  familyHandle: string,
  currentFamilies: TreeFamily[],
): Promise<void> {
  try {
    await apiClient.post('/families/remove-child', {
      childHandle,
      familyHandle
    });
  } catch (error: any) {
    console.error("Failed to remove child:", error.message);
  }
}

export async function updatePersonLiving(
  handle: string,
  isLiving: boolean,
): Promise<void> {
  try {
    await apiClient.patch(`/people/${handle}`, { is_living: isLiving });
  } catch (error: any) {
    console.error("Failed to update person living status:", error.message);
  }
}

export async function updatePerson(
  handle: string,
  fields: {
    displayName?: string;
    birthYear?: number | null;
    deathYear?: number | null;
    isLiving?: boolean;
    phone?: string | null;
    email?: string | null;
    currentAddress?: string | null;
    hometown?: string | null;
    occupation?: string | null;
    education?: string | null;
    notes?: string | null;
  },
): Promise<void> {
  try {
    await apiClient.patch(`/people/${handle}`, {
      display_name: fields.displayName,
      birth_year: fields.birthYear,
      death_year: fields.deathYear,
      is_living: fields.isLiving,
      phone: fields.phone,
      email: fields.email,
      current_address: fields.currentAddress,
      hometown: fields.hometown,
      occupation: fields.occupation,
      education: fields.education,
      notes: fields.notes,
    });
  } catch (error: any) {
    console.error("Failed to update person:", error.message);
  }
}

export async function addPerson(person: {
  handle: string;
  displayName: string;
  gender: number;
  generation: number;
  birthYear?: number | null;
  deathYear?: number | null;
  isLiving?: boolean;
  families?: string[];
  parentFamilies?: string[];
}): Promise<{ error: string | null }> {
  try {
    await apiClient.post('/people', {
      handle: person.handle,
      display_name: person.displayName,
      gender: person.gender,
      generation: person.generation,
      birth_year: person.birthYear,
      death_year: person.deathYear,
      is_living: person.isLiving,
      families: person.families,
      parent_families: person.parentFamilies,
    });
    return { error: null };
  } catch (error: any) {
    console.error("Failed to add person:", error.message);
    return { error: error.message };
  }
}

export async function deletePerson(
  handle: string,
): Promise<{ error: string | null }> {
  try {
    await apiClient.delete(`/people/${handle}`);
    return { error: null };
  } catch (error: any) {
    console.error("Failed to delete person:", error.message);
    return { error: error.message };
  }
}

export async function addFamily(family: {
  handle: string;
  fatherHandle?: string;
  motherHandle?: string;
  children?: string[];
}): Promise<{ error: string | null }> {
  try {
    await apiClient.post('/families', {
      handle: family.handle,
      father_handle: family.fatherHandle,
      mother_handle: family.motherHandle,
      children: family.children,
    });
    return { error: null };
  } catch (error: any) {
    console.error("Failed to add family:", error.message);
    return { error: error.message };
  }
}

export async function fetchUnreadNotificationsCount(): Promise<number> {
  try {
    const { data } = await apiClient.get('/notifications/unread-count');
    return data.count || 0;
  } catch (error) {
    return 0;
  }
}

export async function createContribution(payload: any): Promise<{ error: string | null }> {
  try {
    await apiClient.post('/contributions', payload);
    return { error: null };
  } catch (error: any) {
    console.error("Failed to create contribution:", error.message);
    return { error: error.message };
  }
}

export async function fetchDashboardStats(clanId: string): Promise<any> {
  try {
    const { data } = await apiClient.get(`/clans/${clanId}/stats`);
    return data;
  } catch (error) {
    return { people: 0, families: 0, posts: 0, events: 0, media: 0, clan_members: 0 };
  }
}

export async function fetchNotifications(limit = 50, cursor?: string): Promise<{ items: any[]; nextCursor?: string | null; }> {
  try {
    const params: any = { limit };
    if (cursor) params.cursor = cursor;
    const { data } = await apiClient.get('/notifications', { params });
    return data || { items: [], nextCursor: null };
  } catch (error) {
    return { items: [], nextCursor: null };
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    await apiClient.patch(`/notifications/${id}`, { is_read: true });
  } catch (error) {
    console.error("Failed to mark notification as read", error);
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await apiClient.post('/notifications/mark-all-read');
  } catch (error) {
    console.error("Failed to mark all notifications as read", error);
  }
}

export async function fetchDirectoryMembers(clan_id: string, limit = DEFAULT_PAGE_LIMIT, page = 1): Promise<any[]> {
  try {
    const { data } = await apiClient.get('/profiles', {
      params: {
        status: 'active',
        ...createPaginationParams(limit, page),
      },
    });
    return normalizePagedData<any>(data);
  } catch (error) {
    console.error("Failed to fetch directory members", error);
    return [];
  }
}

export async function fetchDirectoryMember(id: string): Promise<any | null> {
  try {
    const { data } = await apiClient.get(`/profiles/${id}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch directory member", error);
    return null;
  }
}

// --- Admin Users ---
export async function fetchAllProfiles(limit = DEFAULT_PAGE_LIMIT, page = 1): Promise<any[]> {
  try {
    const { data } = await apiClient.get('/profiles', {
      params: createPaginationParams(limit, page),
    });
    return normalizePagedData<any>(data);
  } catch (error) {
    return [];
  }
}

export async function updateProfileRole(id: string, role: string): Promise<void> {
  try {
    await apiClient.patch(`/profiles/${id}`, { role });
  } catch (error) {
    console.error(error);
  }
}

export async function updateProfileStatus(id: string, status: string): Promise<void> {
  try {
    await apiClient.patch(`/profiles/${id}`, { status });
  } catch (error) {
    console.error(error);
  }
}

export async function fetchInviteLinks(limit = DEFAULT_PAGE_LIMIT, page = 1): Promise<any[]> {
  try {
    const { data } = await apiClient.get('/invite-links', {
      params: createPaginationParams(limit, page),
    });
    return normalizePagedData<any>(data);
  } catch (error) {
    return [];
  }
}

export async function createInviteLink(payload: any): Promise<any | null> {
  try {
    const { data } = await apiClient.post('/invite-links', payload);
    return data;
  } catch (error) {
    return null;
  }
}

export async function deleteInviteLink(id: string): Promise<void> {
  try {
    await apiClient.delete(`/invite-links/${id}`);
  } catch (error) {
    console.error(error);
  }
}

// --- Admin Edits ---
export async function fetchAllContributions(filter?: string, limit = DEFAULT_PAGE_LIMIT, page = 1): Promise<any[]> {
  try {
    const params = {
      ...(filter && filter !== 'all' ? { status: filter } : {}),
      ...createPaginationParams(limit, page),
    };
    const { data } = await apiClient.get('/contributions', { params });
    return normalizePagedData<any>(data);
  } catch (error) {
    return [];
  }
}

export async function updateContributionStatus(id: string, payload: any): Promise<void> {
  try {
    await apiClient.patch(`/contributions/${id}`, payload);
  } catch (error) {
    console.error(error);
  }
}

// --- Auth ---
export async function resetPasswordForEmail(email: string): Promise<{ error: string | null }> {
  try {
    await apiClient.post('/auth/forgot-password', { email });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// --- Admin System ---
export async function createDatabaseBackup(): Promise<any> {
  try {
    const { data } = await apiClient.get('/admin/backup');
    return data;
  } catch (error) {
    console.error("Failed to create backup", error);
    return null;
  }
}

export async function fetchDatabaseStats(): Promise<Record<string, number>> {
  try {
    const { data } = await apiClient.get('/admin/stats');
    return data || {};
  } catch (error) {
    console.error("Failed to fetch db stats", error);
    return {};
  }
}

export async function fetchAuditLogs(): Promise<any[]> {
  try {
    const { data } = await apiClient.get('/admin/audit-logs');
    return data || [];
  } catch (error) {
    console.error("Failed to fetch audit logs", error);
    return [];
  }
}
