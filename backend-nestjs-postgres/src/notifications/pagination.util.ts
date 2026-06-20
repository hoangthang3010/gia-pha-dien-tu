export function encodeCursor(createdAt: string, id: string) {
  return Buffer.from(JSON.stringify({ created_at: createdAt, id })).toString('base64');
}

export function decodeCursor(cursor: string): { created_at: string; id: string } | null {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}
