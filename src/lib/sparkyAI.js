import { base44 } from '@/api/base44Client';
import { MODELS, coreBlock, profileSummary, unwrap, EARNINGS_DISCLAIMER } from '@/lib/promptCore';

export { EARNINGS_DISCLAIMER, profileSummary };

const optionSchema = {
  type: 'object',
  properties: {
    option_number: { type: 'number' },
    title: { type: 'string' },
    one_sentence_description: { type: 'string' },
    why_this_fits_user: { type: 'string' },
    estimated_startup_cost: { type: 'string' },
    estimated_time_to_launch: { type: 'string' },
    estimated_time_to_first_income: { type: 'string' },
    realistic_starter_income_range: { type: 'string' },
    difficulty_level: { type: 'string' },
    social_interaction_level: { type: 'string' },
    remote_or_local: { type: 'string' },
    risks_or_requirements: { type: 'array', items: { type: 'string' } },
    first_goal: { type: 'string' },
    first_three_steps: { type: 'array', items: { type: 'string' } }
  },
  required: ['title', 'one_sentence_description', 'why_this_fits_user', 'estimated_startup_cost', 'estimated_time_to_launch', 'estimated_time_to_first_income', 'realistic_starter_income_range', 'difficulty_level', 'social_interaction_level', 'remote_or_local', 'risks_or_requirements', 'first_goal', 'first_three_steps']
};

export async function generateOptions(profile, { rejected = [], reason = '', preferences = '' } = {}) {
  const rejectedText = rejected.length
    ? `Previously rejected ideas (do NOT repeat these): ${rejected.map(o => o.title).join('; ')}. The user rejected them because: "${reason}". New preferences: "${preferences}".`
    : '';
  const result = await base44.integrations.Core.InvokeLLM({
    model: MODELS.research,
    prompt: `${coreBlock(profile)}

Task: generate exactly TWO different, realistic income opportunities this person can start now.
User profile: ${profileSummary(profile)}
${rejectedText}
First, identify the concrete skills, software expertise, experience and strengths in user_described_special_skills. Treat that free-text description as the strongest recommendation signal. Questionnaire selections are secondary evidence, not the main direction. At least ONE of the two options must directly monetize a skill from the user's own description unless it is unsafe, impossible within their constraints, or they provided no description. Do not make ChatGPT, Claude or another AI tool the basis of an option merely because a questionnaire answer mentioned it; use such tools only as optional support unless the user explicitly described them as a core skill or goal.
Build a broad candidate pool internally across local and remote services, then return only the TWO strongest and genuinely distinct fits. Each option must identify a specific paying buyer, a tightly scoped deliverable, a credible way to reach buyers and a simple paid-pilot offer. Do not imply an audience, expensive software or credentials they do not have. You have no live web search in this request: mark rates, demand and platform availability as unverified estimates, never fabricate citations or claim current verification, and add a quick local verification step.
Personalize why_this_fits_user by naming or quoting the specific skill or experience the user actually described; never justify a recommendation only from generic questionnaire selections. realistic_starter_income_range must read as an estimate in their local currency (e.g. "50–250 per week, depending on local demand"). first_three_steps are 3 short concrete actions they can do this week. risks_or_requirements are 2-4 practical safety/legal/platform notes for their area.`,
    response_json_schema: {
      type: 'object',
      properties: { option_1: optionSchema, option_2: optionSchema },
      required: ['option_1', 'option_2']
    }
  });
  const data = unwrap(result, 'option_1');
  if (!data?.option_1 || !data?.option_2) throw new Error('Sparky could not build your options. Please try again.');
  data.option_1.option_number = 1;
  data.option_2.option_number = 2;
  return data;
}

export async function generateExploreDetail(option, profile) {
  const result = await base44.integrations.Core.InvokeLLM({
    model: MODELS.research,
    prompt: `${coreBlock(profile)}

The user is deciding whether to commit to this income opportunity: ${JSON.stringify(option)}
Their profile: ${profileSummary(profile)}
Give deeper detail for THIS opportunity and THIS person. Explain who pays, what they receive, likely beginner pricing assumptions, how to find a first buyer and how to deliver an acceptable pilot. You have no live web search: explicitly distinguish estimates from verified user-provided facts and explain how to check changing platform fees, local rules and demand. likely_challenges: 3-4 things that realistically go wrong for beginners. safety_legal_considerations: 2-4 real requirements or precautions where they live (licences, permits, platform rules, meeting strangers safely).`,
    response_json_schema: {
      type: 'object',
      properties: {
        short_explanation: { type: 'string' },
        likely_challenges: { type: 'array', items: { type: 'string' } },
        safety_legal_considerations: { type: 'array', items: { type: 'string' } }
      },
      required: ['short_explanation', 'likely_challenges', 'safety_legal_considerations']
    }
  });
  return unwrap(result, 'short_explanation');
}

export async function generateActionPlan(option, profile) {
  const result = await base44.integrations.Core.InvokeLLM({
    model: MODELS.reasoning,
    prompt: `${coreBlock(profile)}

The user committed to this income path: ${JSON.stringify(option)}
Their profile: ${profileSummary(profile)}

Build the plan they will actually work from. Think about their real constraints first: ${profile.hours_per_week || 'limited'} hours a week, urgency "${profile.timeline || 'unknown'}", situation "${profile.situation || 'unknown'}", and what they already own or know. Then sequence the tasks so the earliest ones create a first customer conversation or validate willingness to pay, not preparation busywork. The first task must fit 15–30 minutes where practical. Define the buyer, scope, sample, price hypothesis and payment terms; include a permission-respecting outreach script and one reasonable follow-up, never bulk spam. Include delivery and quality review, then collecting payment and logging earnings. For AI-assisted work, include a copyable ChatGPT or Claude prompt and a human acceptance checklist, plus a free-tool alternative. Each task must have an observable finish condition. When no one responds, test one change to buyer, offer or channel before switching paths. Do not promise a sale within a fixed time.

Return:
- first_goal: their first concrete money milestone, and first_goal_amount as a number in their local currency (something reachable in 1-3 weeks at their available hours).
- long_term_goal: where this path leads in a few months.
- tip: one short practical sentence specific to this plan.
- tasks: 3-7 ordered tasks, never generic. Each has title, description, why_it_matters (tie it to their goal), estimated_minutes (a number that fits their weekly hours), difficulty (Easy/Medium/Hard), instructions (3-5 steps concrete enough to follow without thinking — exact words to send, where to post, what to price), order starting at 1.`,
    response_json_schema: {
      type: 'object',
      properties: {
        first_goal: { type: 'string' },
        first_goal_amount: { type: 'number' },
        long_term_goal: { type: 'string' },
        tip: { type: 'string' },
        tasks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' }, description: { type: 'string' }, why_it_matters: { type: 'string' },
              estimated_minutes: { type: 'number' }, difficulty: { type: 'string' },
              instructions: { type: 'array', items: { type: 'string' } }, order: { type: 'number' }
            },
            required: ['title', 'description', 'why_it_matters', 'estimated_minutes', 'difficulty', 'instructions', 'order']
          }
        }
      },
      required: ['first_goal', 'first_goal_amount', 'long_term_goal', 'tasks']
    }
  });
  return unwrap(result, 'first_goal');
}

export async function askSparky(message, context = {}) {
  const { profile = {}, option = {}, path = {}, tasks = [], history = [], checkins = [], nudge = null } = context;
  return await base44.integrations.Core.InvokeLLM({
    model: MODELS.fast,
    prompt: `${coreBlock(profile)}

You are mid-conversation with this person about their current plan.
- Profile: ${profileSummary(profile)}
- Income path: ${JSON.stringify(option)}
- Goal: ${path.first_goal || ''} (target ${path.first_goal_amount || 0}, earned so far ${path.income_total || 0}, progress ${path.progress_percentage || 0}%)
- Tasks: ${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, description: t.description, instructions: t.instructions, minutes: t.estimated_minutes, status: t.status, blocker: t.blocker_reason })))}
- Recent check-ins: ${JSON.stringify(checkins.slice(-3).map(c => ({ date: c.check_in_date, progress: c.progress_response, earned: c.amount_earned, blocker: c.blocker })))}
${nudge ? `- They may be replying to today's message you sent: "${nudge.message}"` : ''}
- Recent conversation (oldest first): ${JSON.stringify(history.slice(-8))}

Use the conversation above so you never repeat yourself or ask what they already told you. Answer style: acknowledge briefly, produce the usable deliverable (draft, script, checklist or prompt), then ONE clear next action. Ask at most one question, only when essential information is missing. Default to 120 words, but allow up to 300 for a copy-ready deliverable the user requested. Explain uncertainty; never claim to have recorded progress or scheduled emails because this call has no tools. Direct progress logging to the task coach. At most two emojis.

They just said: "${message}"`
  });
}

// One short, specific observation for the weekly review.
export async function weeklyInsight({ profile, path, tasks = [], checkins = [] }) {
  const done = tasks.filter(t => t.status === 'complete').length;
  return await base44.integrations.Core.InvokeLLM({
    model: MODELS.fast,
    prompt: `${coreBlock(profile)}

Write this person's weekly review note: what actually happened, then the single most useful move for next week. Be specific to their real numbers — no generic praise, no filler.
- Income path: ${path?.selected_option_json?.title || 'their path'}
- Goal: ${path?.first_goal || ''} (target ${path?.first_goal_amount || 0})
- Tasks: ${done} of ${tasks.length} complete. Pending: ${JSON.stringify(tasks.filter(t => t.status !== 'complete').map(t => t.title).slice(0, 5))}
- Earned so far: ${path?.income_total || 0}
- Recent check-ins: ${JSON.stringify(checkins.slice(-5).map(c => ({ date: c.check_in_date, progress: c.progress_response, earned: c.amount_earned, blocker: c.blocker })))}

Max 60 words. Two short paragraphs at most. Return only the note text.`
  });
}