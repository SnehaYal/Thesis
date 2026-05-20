const QUESTIONS = [
  {
    key: 'reflection1',
    optionKey: 'reflection1Option',
    tag: 'App usage',
    label: 'Which app is eating the most of your time right now?',
    sublabel: 'Go with your gut. What\'s the app you find yourself in most without really meaning to be?',
    options: ['Instagram', 'TikTok', 'YouTube', 'Twitter / X', 'Reddit', 'WhatsApp', 'Messages', 'Email', 'Snapchat', 'LinkedIn'],
    elaboratePlaceholder: 'Anything to add, or be more specific...',
    multi: true,
  },
  {
    key: 'reflection2',
    optionKey: 'reflection2Option',
    tag: 'Focus disruption',
    label: 'When you\'re doing something, a task, a conversation, a thought, how often does your phone pull you away?',
    sublabel: 'Think about yesterday specifically.',
    options: ['Every few minutes', 'Every 15–30 min', 'A few times an hour', 'Only when I choose to'],
    elaboratePlaceholder: 'What usually triggers it?',
  },
  {
    key: 'reflection3',
    optionKey: 'reflection3Option',
    tag: 'App layout',
    label: 'Where do you keep the apps you use most?',
    sublabel: 'How your home screen is laid out is the single biggest driver of daily friction.',
    options: ['Home screen, front row', 'In my dock', 'In a folder', 'Spread across pages', 'I use search'],
    elaboratePlaceholder: 'Which apps specifically? Where exactly?',
    multi: true,
  },
  {
    key: 'reflection4',
    optionKey: 'reflection4Option',
    tag: 'App switching',
    label: 'What apps do you alternate between a lot?',
    sublabel: 'List the apps you bounce between most, e.g. \'Instagram and Safari\' or \'Slack, Notes, and Gmail\'.',
    options: ['Instagram + Safari', 'Slack + Email', 'TikTok + YouTube', 'Reddit + Twitter / X', 'Messages + Instagram', 'Notes + Messages'],
    elaboratePlaceholder: 'Name the actual apps if different...',
    multi: true,
  },
  {
    key: 'reflection5',
    tag: 'Pickups',
    label: 'How many times a day are you picking up your phone?',
    sublabel: 'This is your most honest data point. Find your actual number in Screen Time before answering.',
    steps: [
      'Open Settings',
      'Tap Screen Time',
      'Scroll down to Pickups',
      'Note the daily average shown on the chart',
    ],
  },
  {
    key: 'reflection6',
    tag: 'Screen Time → Most Used',
    label: 'Which apps are you opening over and over, and does the time you spend match how often you open them?',
    sublabel: 'Some apps get opened constantly but used briefly (checking without doing). Others get opened rarely but for long sessions. Which pattern do you see?',
    steps: [
      'Settings → Screen Time → See All Activity',
      'Under Most Used, note your top 3 apps and their total time',
      'Tap each app to see how many times it was opened vs. total time',
      'High opens + low time = checking habit. Low opens + high time = time sink.',
    ],
  },
]

export default function StepReflect({ page = 1, state, onStateChange, onBack, onNext }) {
  const questions = page === 1 ? QUESTIONS.slice(0, 4) : QUESTIONS.slice(4)
  const allAnswered = questions.every(q => {
    const hasText = state[q.key]?.trim()
    if (!q.optionKey) return hasText
    const hasOption = q.multi ? (state[q.optionKey] || []).length > 0 : state[q.optionKey]
    return hasOption || hasText
  })

  return (
    <div id="reflect">
      <div className="reflect-header">
        <div className="reflect-eyebrow">Before you build</div>
        <div className="reflect-page-indicator">Page {page} of 2</div>
        <h2 className="reflect-title">A few questions first</h2>
        <p className="reflect-subtitle">
          These aren't requirements; they're prompts. Answer honestly and we'll suggest some widget ideas you could build. You stay in full control of what actually gets made.
        </p>
      </div>

      {questions.map(({ key, optionKey, tag, label, sublabel, options, elaboratePlaceholder, steps, multi }, i) => (
        <div key={key} className="question-block">
          <div className="reflect-q-meta">
            <span className="reflect-q-num">Question {String((page === 1 ? 0 : 4) + i + 1).padStart(2, '0')}</span>
            <span className="reflect-q-tag">{tag}</span>
          </div>
          <div className="question-label">{label}</div>
          {sublabel && <div className="question-sublabel">{sublabel}</div>}

          {options && (
            <div className="reflect-options">
              {options.map(opt => {
                const selected = multi
                  ? (state[optionKey] || []).includes(opt)
                  : state[optionKey] === opt
                const handleClick = () => {
                  if (multi) {
                    const current = state[optionKey] || []
                    const next = current.includes(opt)
                      ? current.filter(v => v !== opt)
                      : [...current, opt]
                    onStateChange({ [optionKey]: next })
                  } else {
                    onStateChange({ [optionKey]: opt })
                  }
                }
                return (
                  <button
                    key={opt}
                    className={`reflect-option${selected ? ' selected' : ''}`}
                    onClick={handleClick}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          )}

          {steps && (
            <div className="reflect-howto">
              <div className="reflect-howto-label">How to find it</div>
              <ol className="reflect-howto-steps">
                {steps.map((step, j) => <li key={j}>{step}</li>)}
              </ol>
            </div>
          )}

          <textarea
            className="reflect-textarea"
            placeholder={elaboratePlaceholder || 'Your answer...'}
            value={state[key] || ''}
            onChange={e => onStateChange({ [key]: e.target.value })}
            rows={options ? 2 : 3}
          />
        </div>
      ))}

      <div className="step-nav">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <button className="next-btn" disabled={!allAnswered} onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  )
}
