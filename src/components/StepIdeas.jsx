import { useState, useEffect } from 'react'

const TAG_LABELS = {
  Focus: 'Focus',
  Awareness: 'Awareness',
  Friction: 'Friction',
  Habit: 'Habit',
}

const TAG_TOOLTIPS = {
  Focus: 'Helps you stay on task by reducing distractions and keeping your attention where it matters.',
  Awareness: 'Surfaces information about your own behaviour so you can see patterns and make conscious choices.',
  Friction: 'Adds a small, intentional barrier to slow down habits you want to reduce.',
  Habit: 'Reinforces a positive routine through reminders, streaks, or progress tracking.',
}

export default function StepIdeas({ state, onBack, onSelect, onSkip }) {
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reflection1Option: state.reflection1Option,
        reflection1: state.reflection1,
        reflection2Option: state.reflection2Option,
        reflection2: state.reflection2,
        reflection3Option: state.reflection3Option,
        reflection3: state.reflection3,
        reflection4Option: state.reflection4Option,
        reflection4: state.reflection4,
        reflection5: state.reflection5,
        reflection6: state.reflection6,
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setIdeas(data.ideas)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div id="ideas">
      <div className="ideas-header">
        <div className="reflect-eyebrow">Based on your habits</div>
        <h2 className="reflect-title">Here are some recommended UIs</h2>
        <p className="reflect-subtitle">
          These are starting points, not instructions. Pick one to use as your prompt and edit it however you like — or skip straight to <strong>build your own</strong>.
        </p>
      </div>

      {loading && (
        <div className="ideas-loading">
          <div className="spinner" />
          <p className="ideas-loading-text">Analysing your habits...</p>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <div className="ideas-grid">
          {ideas.map((idea, i) => (
            <div
              key={i}
              className={`idea-card${selected === i ? ' selected' : ''}`}
              onClick={() => setSelected(selected === i ? null : i)}
            >
              <span className={`idea-tag idea-tag--${idea.tag?.toLowerCase()}`}>
                {TAG_LABELS[idea.tag] ?? idea.tag}
                {TAG_TOOLTIPS[idea.tag] && (
                  <span className="idea-tag-info">
                    <span className="idea-tag-info-icon">ⓘ</span>
                    <span className="idea-tag-tooltip">{TAG_TOOLTIPS[idea.tag]}</span>
                  </span>
                )}
              </span>
              <h3 className="idea-title">{idea.title}</h3>
              <p className="idea-description">{idea.description}</p>
              <p className="idea-rationale">{idea.rationale}</p>
            </div>
          ))}
        </div>
      )}

      <div className="ideas-footer step-nav">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <button className="back-btn ideas-skip-btn" onClick={onSkip}>Build my own</button>
        <button
          className="next-btn"
          disabled={selected === null || loading}
          onClick={() => onSelect(ideas[selected])}
        >
          Use this idea →
        </button>
      </div>
    </div>
  )
}
