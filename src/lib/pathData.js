import { base44 } from '@/api/base44Client';
import { generateActionPlan } from '@/lib/sparkyAI';

export async function getMyProfile() {
  const user = await base44.auth.me();
  const rows = await base44.entities.UserProfile.filter({ created_by_id: user.id }, '-updated_date', 1);
  return rows[0] || null;
}

export async function getActiveRecSet() {
  const rows = await base44.entities.RecommendationSet.filter({ status: 'active' }, '-created_date', 1);
  return rows[0] || null;
}

export async function getActivePath() {
  const rows = await base44.entities.IncomePath.filter({ status: 'active' }, '-updated_date', 1);
  return rows[0] || null;
}

export async function getTasks(pathId) {
  return await base44.entities.ActionTask.filter({ income_path_id: pathId }, 'order');
}

// Choose an option: pause any current path, generate a real AI plan, create IncomePath + tasks.
export async function startPath(recSet, option, profile) {
  const current = await getActivePath();
  if (current) await base44.entities.IncomePath.update(current.id, { status: 'paused', reason_paused: 'Switched to a new path' });
  const plan = await generateActionPlan(option, profile);
  const now = new Date().toISOString();
  const path = await base44.entities.IncomePath.create({
    selected_option_json: option, status: 'active',
    first_goal: plan.first_goal, first_goal_amount: plan.first_goal_amount || 100,
    long_term_goal: plan.long_term_goal, income_total: 0, progress_percentage: 0,
    start_date: now, last_activity: now, milestone_history: []
  });
  await base44.entities.ActionTask.bulkCreate(plan.tasks.map(t => ({ ...t, income_path_id: path.id, status: 'not_started' })));
  if (recSet) await base44.entities.RecommendationSet.update(recSet.id, { status: 'selected' });
  return path;
}

export async function touchPath(pathId, data = {}) {
  return await base44.entities.IncomePath.update(pathId, { ...data, last_activity: new Date().toISOString() });
}