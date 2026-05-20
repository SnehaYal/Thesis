import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(express.json({ limit: '20mb' }));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

console.log('Using Anthropic API (claude-sonnet-4-6)');

const SYSTEM_PROMPT = `You are an expert mobile UI/UX prototyper. Generate complete, self-contained HTML prototypes of phone UI screens and interactions.

OUTPUT RULES:
- Return ONLY raw HTML. No explanation, no markdown fences, no comments outside the code.
- Single file: all CSS and JS embedded inline. No external dependencies except Google Fonts and optionally a CDN icon library (e.g. unpkg.com/feather-icons).
- Fits naturally in an iframe — zero body margin, no overflow bleed.

PHONE UI QUALITY BAR:
- Default to a mobile viewport: 390px wide × 844px tall (iPhone 14 proportions) unless the description says otherwise.
- Render a realistic phone shell around the UI when it enhances the prototype (status bar with time/signal/battery, home indicator bar at bottom, optional notch/dynamic island).
- Touch targets: minimum 44×44px for any tappable element.
- Typography: minimum 14px body text, 16px+ for inputs (prevents iOS zoom). Use San Francisco / -apple-system / Roboto stack, or fetch a clean sans-serif from Google Fonts.
- Spacing: generous padding (16–24px gutters), card-style surfaces with subtle shadows and rounded corners (12–20px radii).

PLATFORM CONVENTIONS — match whichever the description implies:
- iOS: SF Pro font stack, system blue (#007AFF) accents, bottom tab bar, back-chevron nav, modal sheets that slide up, haptic-style spring animations, blurred backgrounds (backdrop-filter: blur).
- Android / Material 3: Roboto, dynamic color tokens, FAB placement, top app bar, bottom nav or nav rail, Material ripple effects on tap.
- Generic / cross-platform: clean flat design, use the description's color cues.

INTERACTIONS — always implement these correctly in JS:
- Navigation: simulate screen transitions (slide-in from right for push, slide-up for modals/sheets, fade for tab switches). Keep a simple stack so Back works.
- Gestures: swipe-to-dismiss on cards/sheets (touch events), pull-to-refresh skeleton where relevant, tap ripple on buttons.
- Micro-animations: button press scale (0.96), smooth scroll, skeleton loaders for async content, toast notifications that auto-dismiss.
- State: make interactive elements actually work — toggles toggle, tabs switch content, forms validate and show feedback, sliders update values, counters count.

VISUAL POLISH:
- Use realistic placeholder content (names, messages, prices, icons) that fits the use case — never Lorem Ipsum for phone UIs.
- Subtle gradients, glassmorphism surfaces, or flat color depending on the style cue.
- Consistent icon style: use inline SVG or feather-icons for crisp, scalable icons.
- Dark-mode-ready when the description asks for it (CSS custom properties with a data-theme toggle if appropriate).

SIZE GUIDELINES (when no phone shell is shown):
- Small = 200px tall | Medium = 300px tall | Large = 450px tall | Whole Screen = 100vw × 100vh
- For phone-shell prototypes, default to 390×844px centered in the iframe.
- Honor any custom size description literally (e.g. "half screen iPhone", "tablet landscape").`;

async function generateWithAnthropic(prompt, sketchDataUrl) {
  let messages;
  if (sketchDataUrl) {
    messages = [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: 'image/png', data: sketchDataUrl.split(',')[1] }
        },
        { type: 'text', text: prompt }
      ]
    }];
  } else {
    messages = [{ role: 'user', content: prompt }];
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages
  });

  return response.content.map(b => b.text || '').join('');
}

app.post('/api/generate', async (req, res) => {
  const { type, size, functionality, format, description, sketchDataUrl,
          reflection1Option, reflection1, reflection2Option, reflection2,
          reflection3Option, reflection3, reflection4Option, reflection4,
          reflection5, reflection6 } = req.body;

  function combine(option, note) {
    const optStr = Array.isArray(option) ? option.join(', ') : option;
    if (optStr && note?.trim()) return `${optStr} — ${note.trim()}`;
    return optStr || note?.trim() || '';
  }

  let prompt = `Create a ${type || 'general'} widget with the following specs:
- Type: ${type || 'General'}
- Size: ${size || 'Medium'}
- Functionality: ${functionality || 'Static'}
- Platform: ${format || 'Unsure'}`;

  if (description?.trim()) prompt += `\n- Description: ${description}`;
  if (sketchDataUrl) prompt += `\n- The user provided a sketch showing their rough layout idea.`;

  if (reflection1 || reflection2 || reflection3 || reflection4 || reflection5 || reflection6) {
    prompt += `\n\nUser's phone habits (use these to make the widget more personally relevant):`;
    const r1 = combine(reflection1Option, reflection1);
    const r2 = combine(reflection2Option, reflection2);
    const r3 = combine(reflection3Option, reflection3);
    const r4 = combine(reflection4Option, reflection4);
    if (r1) prompt += `\n- App they use most without meaning to: ${r1}`;
    if (r2) prompt += `\n- How often their phone disrupts focus: ${r2}`;
    if (r3) prompt += `\n- Where they keep their most-used apps: ${r3}`;
    if (r4) prompt += `\n- Apps they alternate between most: ${r4}`;
    if (reflection5?.trim()) prompt += `\n- Daily phone pickups: ${reflection5}`;
    if (reflection6?.trim()) prompt += `\n- App opening habits (checking vs. time-sink patterns from Screen Time): ${reflection6}`;
  }

  prompt += `\n\nGenerate the complete widget HTML now.`;

  try {
    const html = await generateWithAnthropic(prompt, sketchDataUrl);

    res.json({ html });
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate widget' });
  }
});

app.post('/api/ideas', async (req, res) => {
  const { reflection1Option, reflection1, reflection2Option, reflection2,
          reflection3Option, reflection3, reflection4Option, reflection4,
          reflection5, reflection6 } = req.body;

  function combine(option, note) {
    const optStr = Array.isArray(option) ? option.join(', ') : option;
    if (optStr && note?.trim()) return `${optStr} — ${note.trim()}`;
    return optStr || note?.trim() || '';
  }

  const habits = [
    reflection1Option || reflection1 ? `- Apps eating most time: ${combine(reflection1Option, reflection1)}` : '',
    reflection2Option || reflection2 ? `- How often phone disrupts focus: ${combine(reflection2Option, reflection2)}` : '',
    reflection3Option || reflection3 ? `- App layout: ${combine(reflection3Option, reflection3)}` : '',
    reflection4Option || reflection4 ? `- Apps switched between most: ${combine(reflection4Option, reflection4)}` : '',
    reflection5?.trim() ? `- Daily phone pickups: ${reflection5}` : '',
    reflection6?.trim() ? `- App opening habits (checking vs. time-sink — which apps they open constantly for short bursts vs. rarely but for long sessions): ${reflection6}` : '',
  ].filter(Boolean).join('\n');

  const prompt = `You are a phone wellness UX designer. Based on the user's phone habits below, generate exactly 4 specific UI widget ideas that could reduce their screen time or help them build healthier phone habits.

User's phone habits:
${habits}

Return ONLY a valid JSON array — no markdown, no explanation, nothing else.
Each of the 4 objects must have exactly these fields:
{
  "title": "Short widget name (3-6 words)",
  "description": "What the widget looks like and does — be specific and visual (2-3 sentences)",
  "rationale": "One sentence explaining why this directly addresses their specific habits",
  "tag": "exactly one of: Focus, Awareness, Friction, Habit"
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = response.content.map(b => b.text || '').join('').trim();
    const ideas = JSON.parse(text);
    res.json({ ideas });
  } catch (err) {
    console.error('Ideas error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate ideas' });
  }
});

app.post('/api/refine', async (req, res) => {
  const { currentHtml, refinement } = req.body;
  const prompt = `Here is an existing HTML widget:\n\n${currentHtml}\n\nApply this change: ${refinement}\n\nReturn only the complete updated HTML.`;
  try {
    const html = await generateWithAnthropic(prompt, null);
    res.json({ html });
  } catch (err) {
    console.error('Refine error:', err);
    res.status(500).json({ error: err.message || 'Failed to refine widget' });
  }
});

app.listen(3001, () => {
  console.log('Widget Builder API server running on http://localhost:3001');
});
