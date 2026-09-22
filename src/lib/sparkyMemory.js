import { base44 } from '@/api/base44Client';

// Chat memory for the dashboard coach: one stored conversation per income path.
export async function loadChat(pathId) {
  const user = await base44.auth.me();
  const rows = await base44.entities.SparkyConversation.filter({ income_path_id: pathId, created_by_id: user.id }, '-last_updated', 1);
  return rows[0] || null;
}

export async function appendChat(chat, pathId, turns) {
  const messages = [...(chat?.messages || []), ...turns].slice(-40);
  const data = { messages, last_updated: new Date().toISOString() };
  return chat
    ? await base44.entities.SparkyConversation.update(chat.id, data)
    : await base44.entities.SparkyConversation.create({ income_path_id: pathId, ...data });
}