import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { coreBlock, MODELS } from '../../shared/coachPrompt.ts';
import { reminderEmail } from '../../shared/reminderEmail.js';

const TZ = 'America/New_York';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json().catch(() => ({}));
    const kind = body.kind === 'checkin' ? 'checkin' : 'morning';
    const svc = base44.asServiceRole;
    if (body.dryRun) {
      return Response.json({ dryRun: true, model: MODELS.fast, kind, email: reminderEmail({ language: body.language || 'en', kind, title: '', pathId: 'preview-only', message: '' }), sent: 0 });
    }

    const all = await svc.entities.UserProfile.filter({ onboarding_complete: true }, '-updated_date', 200);
    // One message per person: keep only their most recently updated profile.
    const seen = new Set();
    const profiles = all.filter(p => !seen.has(p.created_by_id) && seen.add(p.created_by_id)).filter(p => p.daily_nudges_on !== false);
    const today = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
    const results = [];

    for (const profile of profiles) {
      const paths = await svc.entities.IncomePath.filter({ created_by_id: profile.created_by_id, status: 'active' }, '-updated_date', 1);
      const path = paths[0];
      if (!path) continue;

      const already = await svc.entities.CoachNudge.filter({ profile_id: profile.id, kind, nudge_date: today }, '-created_date', 1);
      if (already.length) continue;

      const tasks = await svc.entities.ActionTask.filter({ income_path_id: path.id }, 'order', 100);
      const pending = tasks.filter(t => ['not_started', 'in_progress', 'blocked'].includes(t.status));
      const focus = pending.find(t => t.status === 'in_progress') || pending[0];
      const done = tasks.length - pending.length;

      const checkins = await svc.entities.CheckIn.filter({ income_path_id: path.id }, '-check_in_date', 3);

      const previousNudges = await svc.entities.CoachNudge.filter({ income_path_id: path.id, kind }, '-created_date', 3);
      const priority = [focus, ...pending.filter(t => t.id !== focus?.id)].filter(Boolean).slice(0, 3);
      const brief = kind === 'morning'
        ? 'Write a short morning message tied to the real goal. List up to 3 priority tasks, most important first, each with one concrete small action. Fit the first action into a short available time block; use any known blocker to make it easier. Finish by asking them to open their coach for help. Do not ask for an email reply.'
        : 'Write a short check-in about the actual task. Ask them to open their coach to report progress, money actually received, or a blocker. Do not claim progress has been recorded yet. If recent check-ins show no time, invite one smaller next step; never shame them.';

      const prompt = `${coreBlock(profile, TZ)}

Task: ${brief}
Max 60 words. At most two emojis. Do not repeat yourself from previous days — react to where they actually are now.

Person: ${profile.name || 'there'} in ${profile.location || 'their area'}, ${profile.hours_per_week || 'limited'} hours a week available.
Income path: ${path.selected_option_json?.title || 'their income path'}
Goal: ${path.first_goal || 'first income'} (target ${path.first_goal_amount || 100}, earned so far ${path.income_total || 0})
Progress: ${done} of ${tasks.length} tasks done, ${pending.length} pending.
Recent check-ins: ${JSON.stringify(checkins.map(c => ({ date: c.check_in_date, progress: c.progress_response, earned: c.amount_earned, blocker: c.blocker })))}
Today's priority tasks (most important first): ${priority.length ? priority.map((t, i) => `${i + 1}. ${t.title} — ${t.description || ''}; time: ${t.estimated_minutes || 'unknown'} minutes; blocker: ${t.blocker_reason || 'none'}`).join(' | ') : 'all tasks are complete, suggest one concrete follow-up to validate or repeat the paid result'}
Previous messages (avoid repeating): ${JSON.stringify(previousNudges.map(n => n.message))}

Return only the message text.`;

      const message = await svc.integrations.Core.InvokeLLM({ model: MODELS.fast, prompt });
      const text = typeof message === 'string' ? message.trim() : String(message?.response || '').trim();
      if (!text) continue;

      await svc.entities.CoachNudge.create({
        profile_id: profile.id,
        income_path_id: path.id,
        kind,
        nudge_date: today,
        message: text,
        task_title: focus?.title || ''
      });

      const users = await svc.entities.User.filter({ id: profile.created_by_id });
      const email = users[0]?.email;
      if (email) {
        const content = reminderEmail({ language: profile.language, kind, title: focus?.title, pathId: path.id, message: text });
        await svc.integrations.Core.SendEmail({ from_name: 'SparkyDollar', to: email, subject: content.subject, text: content.text });
      }
      results.push({ profile_id: profile.id, emailed: Boolean(email) });
    }

    return Response.json({ kind, sent: results.length, results });
  } catch (error) {
    console.error('coachDailyNudge failed', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}