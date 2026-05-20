// ── Size visual cards ──────────────────────────────────────
const SIZE_CARDS = [
  {
    value: 'Small',
    widget: { width: '42%', height: '28%', top: '8%', left: '8%' },
  },
  {
    value: 'Medium',
    widget: { width: '84%', height: '46%', top: '8%', left: '8%' },
  },
  {
    value: 'Large',
    widget: { width: '84%', height: '66%', top: '8%', left: '8%' },
  },
  {
    value: 'Whole Screen',
    widget: { width: '100%', height: '100%', top: 0, left: 0, borderRadius: '4px' },
  },
  {
    value: 'Custom',
    widget: null,
  },
]

// ── Functionality icons ────────────────────────────────────
function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 10c0 0 3.2-6 8.5-6s8.5 6 8.5 6-3.2 6-8.5 6-8.5-6-8.5-6z"/>
      <circle cx="10" cy="10" r="2.5"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="10" cy="10" r="7.5"/>
      <path d="M10 6v4l3 2"/>
    </svg>
  )
}

function TapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3v10.5l3-3 2 4.5 2-.9-2-4.5h3L5 3z"/>
    </svg>
  )
}

function FormIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <rect x="2.5" y="3" width="15" height="14" rx="2"/>
      <path d="M6 8.5h8M6 12h5"/>
    </svg>
  )
}

// ── Format icons ───────────────────────────────────────────
function IOSIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <rect x="5" y="2" width="14" height="20" rx="3"/>
      <rect x="9" y="3.5" width="6" height="1.8" rx="0.9" fill="currentColor" stroke="none" opacity="0.55"/>
    </svg>
  )
}

function AndroidIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <rect x="5" y="3" width="14" height="18" rx="2.5"/>
      <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" opacity="0.55"/>
      <path d="M9 21h6"/>
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="13" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  )
}

// ── Data ───────────────────────────────────────────────────
const FUNC_OPTIONS = [
  { label: 'Display',          hint: 'shows content, no interaction',    icon: <EyeIcon /> },
  { label: 'Live / Real-time', hint: 'auto-updates, clock, feed, weather', icon: <ClockIcon /> },
  { label: 'Clickable',        hint: 'buttons, toggles, tap actions',    icon: <TapIcon /> },
  { label: 'Form / Input',     hint: 'collects user data or responses',  icon: <FormIcon /> },
]

const FORMAT_OPTIONS = [
  { label: 'iOS',     icon: <IOSIcon /> },
  { label: 'Android', icon: <AndroidIcon /> },
  { label: 'Other',   icon: <MonitorIcon /> },
]

// ── Component ──────────────────────────────────────────────
export default function Step1Properties({ state, onStateChange, onNext, onBack }) {
  const sizeValid = (state.size && state.size !== 'Custom') || state.customSize?.trim()
  const funcValid = state.functionality || state.customFunctionality?.trim()
  const formatValid = (state.format && state.format !== 'Other') || state.customFormat?.trim()
  const allSelected = sizeValid && funcValid && formatValid

  return (
    <div id="step1">

      {/* SIZE */}
      <div className="question-block">
        <div className="question-label">How much space should it take up?</div>
        <div className="question-sublabel">This determines how the widget fits on screen, from a small corner card to the full display.</div>
        <div className="size-cards">
          {SIZE_CARDS.map(({ value, widget }) => (
            <button
              key={value}
              className={`size-card${state.size === value ? ' selected' : ''}`}
              onClick={() => onStateChange({ size: value })}
            >
              <div className="size-screen">
                {widget ? (
                  <div className="size-widget" style={widget} />
                ) : (
                  <div className="size-custom-sym">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                      <rect x="3" y="7" width="16" height="11" rx="1.5" strokeDasharray="3 2"/>
                      <path d="M13 3l3 3-7 7H6v-3l7-7z"/>
                    </svg>
                  </div>
                )}
              </div>
              <span className="size-card-label">{value}</span>
            </button>
          ))}
        </div>
        <input
          className="custom-input"
          type="text"
          placeholder="or describe in your own words…"
          value={state.customSize || ''}
          onChange={e => onStateChange({ customSize: e.target.value })}
        />
      </div>

      {/* FUNCTIONALITY */}
      <div className="question-block">
        <div className="question-label">How will people use it?</div>
        <div className="question-sublabel">Pick the closest match; this shapes what kind of code gets generated.</div>
        <div className="pill-group">
          {FUNC_OPTIONS.map(({ label, hint, icon }) => (
            <button
              key={label}
              className={`pill pill--described pill--icon${state.functionality === label ? ' selected' : ''}`}
              onClick={() => onStateChange({ functionality: label })}
            >
              <span className="pill-icon">{icon}</span>
              <span className="pill-label">{label}</span>
              <span className="pill-hint">{hint}</span>
            </button>
          ))}
        </div>
        <input
          className="custom-input"
          type="text"
          placeholder="or describe in your own words…"
          value={state.customFunctionality || ''}
          onChange={e => onStateChange({ customFunctionality: e.target.value })}
        />
      </div>

      {/* FORMAT */}
      <div className="question-block">
        <div className="question-label">Where will this widget live?</div>
        <div className="question-sublabel">The platform affects layout rules, font sizes, and touch behaviour.</div>
        <div className="pill-group">
          {FORMAT_OPTIONS.map(({ label, icon }) => (
            <button
              key={label}
              className={`pill pill--described pill--icon${state.format === label ? ' selected' : ''}`}
              onClick={() => onStateChange({ format: label })}
            >
              <span className="pill-icon">{icon}</span>
              <span className="pill-label">{label}</span>
            </button>
          ))}
        </div>
        <input
          className="custom-input"
          type="text"
          placeholder="or describe in your own words…"
          value={state.customFormat || ''}
          onChange={e => onStateChange({ customFormat: e.target.value })}
        />
      </div>

      <div className="step-nav">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <button className="next-btn" disabled={!allSelected} onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  )
}
