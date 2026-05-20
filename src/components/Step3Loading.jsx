export default function Step3Loading({ state }) {
  return (
    <div id="step3">
      <div className="loading-title">Your Generated Widget</div>
      <div className="loading-sub">
        {state.type ? `${state.type} Widget` : 'Analyzing your requirements...'}
      </div>
      <div className="spinner-wrap">
        <div className="spinner"></div>
        <div className="gen-text">Generating your widget...</div>
      </div>
    </div>
  )
}
