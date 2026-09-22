import { base44 } from '@/api/base44Client';
import { generateActionPlan } from '@/lib/sparkyAI';
import { accountStorageKey } from '@/lib/accountStorage';

export const ACTIVE_PATH_KEY = 'sparky_active_path_id';
export function getActivePathId() { const key = accountStorageKey(ACTIVE_PATH_KEY); return key ? localStorage.getItem(key) : null; }
export function setActivePathId(id) { const key = accountStorageKey(ACTIVE_PATH_KEY); if (key) localStorage.setItem(key, id); }

export async function getMyProfile() {
  const user = await base44.auth.me();
  const rows = await base44.entities.UserProfile.filter({ created_by_id: user.id }, '-updated_date', 1);
  return rows[0] || null;
}

export async function getActiveRecSet() {
  const user = await base44.auth.me();
  const rows = await base44.entities.RecommendationSet.filter({ created_by_id: user.id, status: 'active' }, '-created_date', 1);
  return rows[0] || null;
}

export async function getActivePath(requestedId) {
  const user = await base44.auth.me();
  const storedId = requestedId || getActivePathId();
  if (storedId) {
    const matches = await base44.entities.IncomePath.filter({ id: storedId, created_by_id: user.id }, '-updated_date', 1);
    const path = matches[0];
    if (path && (requestedId || path.status === 'active')) { setActivePathId(path.id); return path; }
    if (requestedId) return null;
  }
  const rows = await base44.entities.IncomePath.filter({ created_by_id: user.id, status: 'active' }, '-updated_date', 1);
  if (rows[0]) setActivePathId(rows[0].id);
  return rows[0] || null;
}

export async function getAllPaths() {
  const user = await base44.auth.me();
  return await base44.entities.IncomePath.filter({ created_by_id: user.id }, '-last_activity');
}

export async function getTasks(pathId) {
  const user = await base44.auth.me();
  return await base44.entities.ActionTask.filter({ income_path_id: pathId, created_by_id: user.id }, 'order');
}

// Choose an option: generate a real AI plan, create IncomePath + tasks. Existing paths stay untouched.
export async function startPath(recSet, option, profile) {
  const plan = await generateActionPlan(option, profile);
  const now = new Date().toISOString();
  const path = await base44.entities.IncomePath.create({
    selected_option_json: option, status: 'active',
    first_goal: plan.first_goal, first_goal_amount: plan.first_goal_amount || 100,
    long_term_goal: plan.long_term_goal, tip: plan.tip || '', income_total: 0, progress_percentage: 0,
    start_date: now, last_activity: now, milestone_history: []
  });
  await base44.entities.ActionTask.bulkCreate(plan.tasks.map(t => ({ ...t, income_path_id: path.id, status: 'not_started' })));
  if (recSet) await base44.entities.RecommendationSet.update(recSet.id, { status: 'selected' });
  setActivePathId(path.id);
  return path;
}

export async function touchPath(pathId, data = {}) {
  return await base44.entities.IncomePath.update(pathId, { ...data, last_activity: new Date().toISOString() });
}