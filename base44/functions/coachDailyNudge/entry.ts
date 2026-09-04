import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { coreBlock, MODELS } from '../../shared/coachPrompt.ts';

const TZ = 'America/New_York';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const kind = body.kind === 'checkin' ? 'checkin' : 'morning';
    const svc = base44.asServiceRole;

    const all = await svc.entities.UserProfile.filter({ daily_nudges_on: true, onboarding_complete: true }, '-updated_date', 200);
    // One message per person: keep only their most recently updated profile.
    const seen = new Set();
    const profiles = all.filter(p => !seen.has(p.created_by_id) && seen.add(p.created_by_id));
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

      const brief = kind === 'morning'
        ? 'Write a short morning message: one line of real encouragement tied to their goal, then list today\'s priority tasks as a short numbered list (up to 3, most important first), each on its own line as a few words. End with a nudge to reply and get walked through the first one.'
        : 'Write a short check-in message: ask directly whether anything moved today on their task, invite them to say what they earned or where they got stuck, and remind them you will update their progress from their answer.';

      const prompt = `${coreBlock(profile, TZ)}

Task: ${brief}
Max 60 words. At most two emojis. Do not repeat yourself from previous days — react to where they actually are now.

Person: ${profile.name || 'there'} in ${profile.location || 'their area'}, ${profile.hours_per_week || 'limited'} hours a week available.
Income path: ${path.selected_option_json?.title || 'their income path'}
Goal: ${path.first_goal || 'first income'} (target ${path.first_goal_amount || 100}, earned so far ${path.income_total || 0})
Progress: ${done} of ${tasks.length} tasks done, ${pending.length} pending.
Recent check-ins: ${JSON.stringify(checkins.map(c => ({ date: c.check_in_date, progress: c.progress_response, earned: c.amount_earned, blocker: c.blocker })))}
Today's priority tasks (most important first): ${pending.length ? pending.slice(0, 3).map((t, i) => `${i + 1}. ${t.title}${t.description ? ` — ${t.description}` : ''}`).join(' | ') : 'all tasks are complete, suggest the next real move'}

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
        await svc.integrations.Core.SendEmail({
          from_name: 'Sparky',
          to: email,
          subject: kind === 'morning' ? `Today's move: ${focus?.title || 'your income path'}` : 'Quick check-in — anything move today?',
          body: `${text}\n\nOpen your coach: https://stringflix.base44.app/coach\n\nResults vary and nothing is guaranteed.`
        });
      }
      results.push({ profile_id: profile.id, emailed: Boolean(email) });
    }

    return Response.json({ kind, sent: results.length, results });
  } catch (error) {
    console.error('coachDailyNudge failed', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}