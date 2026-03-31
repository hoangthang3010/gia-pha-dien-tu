export interface IPost {
  id: string;
  author_id: string;
  type: string;
  title: string | null;
  content: string;
  is_pinned: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  author?: { email: string; display_name: string | null; role: string };
  comment_count?: number;
}

export interface IComment {
  id: string;
  author_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  author?: { email: string; display_name: string | null };
}
