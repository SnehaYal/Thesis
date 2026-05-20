export default function Home({ onStart }) {
  return (
    <div id="home">
      <div className="home-inner">
        <div className="home-badge">AI Widget Builder</div>
        <h1 className="home-title">ALIGNED</h1>
        <p className="home-tagline">
          Answer a few questions about your phone habits. Get suggestions for widgets that could help, then build exactly what you want.
        </p>

        <div className="home-steps">
          <div className="home-step">
            <span className="home-step-num">01</span>
            <div>
              <strong>Reflect on your habits</strong>
              <p>A short questionnaire to help you think about what kind of widget would actually be useful for you.</p>
            </div>
          </div>
          <div className="home-step">
            <span className="home-step-num">02</span>
            <div>
              <strong>Review ideas, or ignore them</strong>
              <p>We'll suggest some starting points based on your answers. Use one, tweak it, or go your own way entirely.</p>
            </div>
          </div>
          <div className="home-step">
            <span className="home-step-num">03</span>
            <div>
              <strong>Build what you want</strong>
              <p>Describe or sketch your widget. You're in full control. The final result is whatever you decide to make.</p>
            </div>
          </div>
        </div>

        <button className="home-start-btn" onClick={onStart}>
          Get started →
        </button>
      </div>
    </div>
  )
}
