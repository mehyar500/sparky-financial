import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../../components/MobileShell';
import { base44 } from '../../api/base44Client';
import { getSession, saveSession } from '../../lib/onboardingState';

function categorizeAssets(assets) {
  const categories = {
    home: ['Extra room', 'Parking space', 'Storage', 'Tools', 'Outdoor space', 'Kitchen', 'Party décor', 'Music equipment', 'Costumes'],
    knowledge: ["I'm bilingual", 'I help kids with school', 'I am tech savvy', 'I can teach cooking', 'I can teach guitar/music', 'I can teach swimming', 'I can teach a sport/a dance', 'I can teach online', 'I can teach arts & crafts'],
    creative: ['I have fashion style', "I'm a neat closet organizer", 'I can make costumes', 'I can decorate', "Friends tell me I'm funny", 'I can do hair/make-up well', "I'm creative online (pics, videos & social posts)", "There's something special I'm good at"],
    online: ['Become an online tutor', 'Create an online course', 'Review products online', 'Create and sell art', 'Online Freelancer', 'Offer AI-powered services'],
    food: ['I plan great parties', 'I can cook', 'I plan great trips', "I'm good with animals", "I'm good with kids", 'People naturally follow my lead'],
    handson: ['I enjoy building, fixing, or working with my hands', 'I like working outside, gardening/moving things'],
  };
  const counts = {};
  for (const [cat, catItems] of Object.entries(categories)) {
    counts[cat] = assets.filter(a => catItems.includes(a)).length;
  }
  return counts;
}

export default function Processing() {
  const navigate = useNavigate();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const run = async () => {
      const session = getSession() || {};
      const assets = session.selected_assets || [];
      const counts = categorizeAssets(assets);

      const prompt = `You are Sparky, an AI income coach. Based on this user profile, generate exactly 2 realistic income opportunities they can start THIS WEEK.

User Profile:
- Name: ${session.name}
- Location: ${session.location}
- Situation: ${session.situation}
- Timeline: ${session.timeline}
- Hours per week: ${session.hours_per_week}
- Selected assets/skills: ${assets.join(', ')}
- Extra skills/hobbies: ${session.extra_skills_text || 'none mentioned'}

Asset counts: Home=${counts.home}, Knowledge=${counts.knowledge}, Creative=${counts.creative}, Online=${counts.online}, Food=${counts.food}, Hands-on=${counts.handson}

Return ONLY valid JSON with this exact structure:
{
  "total_assets": <number>,
  "asset_counts": { "Home Assets": <n>, "Knowledge Assets": <n>, "Creative Assets": <n>, "Online Assets": <n> },
  "option1": {
    "title": "<specific income idea>",
    "income_range": "$X–$Y/week",
    "fastest_path": "<This week / Within 2-3 weeks>",
    "best_for": "<short phrase>",
    "why_picked": "<1-2 sentences referencing their specific skills/assets>",
    "action_steps": ["<step1>", "<step2>", "<step3>", "<step4>"],
    "first_goal": "$50–$100",
    "why_fits": ["<reason1>", "<reason2>", "<reason3>", "<reason4>"]
  },
  "option2": {
    "title": "<different specific income idea>",
    "income_range": "$X–$Y/week",
    "fastest_path": "<This week / Within 2-3 weeks>",
    "best_for": "<short phrase>",
    "why_picked": "<1-2 sentences referencing their specific skills/assets>",
    "action_steps": ["<step1>", "<step2>", "<step3>", "<step4>"],
    "first_goal": "$50–$100",
    "why_fits": ["<reason1>", "<reason2>", "<reason3>", "<reason4>"]
  }
}`;

      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: 'object',
            properties: {
              total_assets: { type: 'number' },
              asset_counts: { type: 'object' },
              option1: { type: 'object' },
              option2: { type: 'object' }
            }
          }
        });
        saveSession({
          ...session,
          asset_counts: result.asset_counts,
          total_assets: result.total_assets,
          option1: result.option1,
          option2: result.option2,
        });
        navigate('/onboarding/score');
      } catch (e) {
        // Fallback to mock data
        saveSession({
          ...session,
          asset_counts: { 'Home Assets': counts.home, 'Knowledge Assets': counts.knowledge, 'Creative Assets': counts.creative, 'Online Assets': counts.online },
          total_assets: assets.length,
          option1: {
            title: 'Rent Your Space',
            income_range: '$50–$250/week',
            fastest_path: 'This week',
            best_for: 'Quick passive income',
            why_picked: 'You mentioned available space and needing money quickly.',
            action_steps: ['Take 3 photos of your space', 'Create a listing online', 'Share locally', 'Respond to inquiries'],
            first_goal: '$50–$100',
            why_fits: ['You need income quickly', 'You have available space', 'No startup costs', 'You can begin this week']
          },
          option2: {
            title: 'Offer Online Services',
            income_range: '$100–$400/week',
            fastest_path: 'This week',
            best_for: 'Helping others online',
            why_picked: "You're comfortable online and enjoy helping people.",
            action_steps: ['Define your service', 'Create a profile on Fiverr/Upwork', 'Set competitive rates', 'Send 5 outreach messages'],
            first_goal: '$50–$150',
            why_fits: ['Use existing skills', 'Work from home', 'Flexible hours', 'Start immediately']
          }
        });
        navigate('/onboarding/score');
      }
    };
    run();
  }, []);

  return (
    <MobileShell>
      <div className="w-full bg-gradient-to-b from-[#5BC8C8] to-[#7dd4d4] rounded-b-[50%_25%]" style={{ minHeight: 90 }} />
      <div className="flex flex-col items-center px-8 flex-1 justify-center pb-4">
        <div className="text-center mb-8">
          <p className="text-gray-400 text-base">Just a moment, now.</p>
          <p className="text-[#2c4a4a] font-bold text-lg mt-2">Sparky is building your<br />personalized plan{dots}</p>
        </div>
        <div className="text-8xl animate-pulse">📋</div>
        <div className="mt-8 flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#5BC8C8] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </MobileShell>
  );
}