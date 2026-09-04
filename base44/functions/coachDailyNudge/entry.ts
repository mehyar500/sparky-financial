import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const LANG_NAMES = { en: 'English', es: 'Spanish', pt: 'Portuguese' };

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const kind = body.kind === 'checkin' ? 'checkin' : 'morning';
    const svc = base44.asServiceRole;

    const profiles = await svc.entities.UserProfile.filter({ daily_nudges_on: true, onboarding_complete: true }, '-updated_date', 200);
    const today = new Date().toISOString().slice(0, 10);
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

      const language = LANG_NAMES[profile.language] || 'English';
      const brief = kind === 'morning'
        ? 'Write a short morning message: one line of real encouragement tied to their goal, then name the ONE task they should do today and why it moves them closer to money. End with a nudge to reply and get walked through it.'
        : 'Write a short check-in message: ask directly whether anything moved today on their task, invite them to say what they earned or where they got stuck, and remind them you will update their progress from their answer.';

      const prompt = `You are Sparky, a direct, warm income coach in the FirstDollar app. ${brief}

Write it in ${language}. Max 60 words. Warm, direct, action-first. At most two emojis. No buzzwords, no motivational fluff, never guarantee earnings.

Person: ${profile.name || 'there'} in ${profile.location || 'their area'}, ${profile.hours_per_week || 'limited'} hours a week available.
Income path: ${path.selected_option_json?.title || 'their income path'}
Goal: ${path.first_goal || 'first income'} ($${path.first_goal_amount || 100})
Progress: ${done} of ${tasks.length} tasks done, ${pending.length} pending.
Today's task: ${focus ? `${focus.title} — ${focus.description || ''}` : 'all tasks are complete, suggest the next real move'}

Return only the message text.`;

      const message = await svc.integrations.Core.InvokeLLM({ prompt });
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