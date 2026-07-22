import { base44 } from '@/api/base44Client';

const MODEL = 'claude_sonnet_4_6';

export const EARNINGS_DISCLAIMER = 'Actual earnings depend on location, demand, experience, pricing, and time invested.';

const SAFETY_RULES = `Rules you must follow:
- Never guarantee earnings or make unrealistic income promises. All income figures are estimates.
- Never suggest illegal, unsafe, or regulated (financial/medical/legal) work unless the user mentioned qualifications.
- Never recommend anything requiring certifications the user did not mention.
- Respect the user's time, location, mobility, preferences, and startup budget.
- Never recommend scams or questionable platforms.
- Be warm, empathetic, practical, concise, nonjudgmental, and realistic. Never shame the user or call anything a failure.`;

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

export function profileSummary(p = {}) {
  return JSON.stringify({
    name: p.name, location: p.location, situation: p.situation, urgency: p.timeline,
    available_time_per_week: p.hours_per_week, assets_and_skills: p.selected_assets,
    additional_notes: p.extra_skills_text
  });
}

export async function generateOptions(profile, { rejected = [], reason = '', preferences = '' } = {}) {
  const rejectedText = rejected.length
    ? `Previously rejected ideas (do NOT repeat these): ${rejected.map(o => o.title).join('; ')}. The user rejected them because: "${reason}". New preferences: "${preferences}".`
    : '';
  const result = await base44.integrations.Core.InvokeLLM({
    model: MODEL,
    prompt: `You are Sparky, a warm and practical income coach. Based on this user's real onboarding profile, generate exactly TWO different, realistic income opportunities they can actually start. Personalize every field to their specific profile — reference what they told you in why_this_fits_user.
User profile: ${profileSummary(profile)}
${rejectedText}
${SAFETY_RULES}
realistic_starter_income_range must read as an estimate (e.g. "$50–$250 per week, depending on local demand"). first_three_steps are 3 short concrete actions. risks_or_requirements are 2-4 practical safety/legal/platform notes.`,
    response_json_schema: {
      type: 'object',
      properties: { option_1: optionSchema, option_2: optionSchema },
      required: ['option_1', 'option_2']
    }
  });
  result.option_1.option_number = 1;
  result.option_2.option_number = 2;
  return result;
}

export async function generateExploreDetail(option, profile) {
  return await base44.integrations.Core.InvokeLLM({
    model: MODEL,
    prompt: `You are Sparky, a practical income coach. The user is exploring this income opportunity before committing: ${JSON.stringify(option)}
Their profile: ${profileSummary(profile)}
${SAFETY_RULES}
Provide deeper, personalized explore detail for this exact opportunity and this exact user.`,
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
}

export async function generateActionPlan(option, profile) {
  return await base44.integrations.Core.InvokeLLM({
    model: MODEL,
    prompt: `You are Sparky, a practical income coach. The user selected this income path: ${JSON.stringify(option)}
Their profile: ${profileSummary(profile)}
${SAFETY_RULES}
Create a personalized action plan specific to THIS opportunity and THIS user (never generic tasks). Include a first-$100 goal (first_goal, plus first_goal_amount as a number like 50 or 100), a longer-term goal, and 3-7 ordered starter tasks. Each task needs: title, description, why_it_matters, estimated_minutes (number), difficulty (Easy/Medium/Hard), instructions (3-5 short concrete steps), order (number starting at 1).`,
    response_json_schema: {
      type: 'object',
      properties: {
        first_goal: { type: 'string' },
        first_goal_amount: { type: 'number' },
        long_term_goal: { type: 'string' },
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
}

export async function askSparky(message, context = {}) {
  return await base44.integrations.Core.InvokeLLM({
    model: MODEL,
    prompt: `You are Sparky, a warm, empathetic, practical income coach helping the user with their CURRENT plan.
${SAFETY_RULES}
Current context:
- User profile: ${profileSummary(context.profile || {})}
- Selected income path: ${JSON.stringify(context.option || {})}
- Active goal: ${context.path?.first_goal || ''} (earned so far: $${context.path?.income_total || 0})
- Task list: ${JSON.stringify((context.tasks || []).map(t => ({ title: t.title, status: t.status, blocker: t.blocker_reason })))}
- Recent conversation: ${JSON.stringify((context.history || []).slice(-6))}
Response style: acknowledge the user in one short sentence, answer the immediate question practically, give ONE clear next action, and end with one relevant follow-up choice. Keep it brief — no long essays unless asked. Preferred tone examples: "Let's make the next step smaller." "You do not have to complete everything today."
User says: "${message}"`
  });
}