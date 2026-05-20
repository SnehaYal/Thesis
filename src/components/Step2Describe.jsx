import { useState, useRef, useEffect } from 'react'

const INPUT_METHODS = [
  { mode: 'text',   emoji: '📝', label: 'Text',   sub: 'Type your description' },
  { mode: 'draw',   emoji: '✏️', label: 'Sketch', sub: 'Draw your idea' },
  { mode: 'upload', emoji: '🖼️', label: 'Upload', sub: 'Use an existing image' },
]

export default function Step2Describe({ state, onStateChange, onBack, onGenerate }) {
  const [erasing, setErasing] = useState(false)
  const fileInputRef = useRef(null)

  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const lastPosRef = useRef([0, 0])
  const erasingRef = useRef(false)
  const canvasInitRef = useRef(false)
  const onStateChangeRef = useRef(onStateChange)
  useEffect(() => { onStateChangeRef.current = onStateChange })

  // Attach mouse/touch event listeners once on mount
  useEffect(() => {
    const canvas = canvasRef.current

    function getPos(e) {
      const rect = canvas.getBoundingClientRect()
      const src = e.touches ? e.touches[0] : e
      return [src.clientX - rect.left, src.clientY - rect.top]
    }

    function startDraw(e) {
      e.preventDefault()
      drawingRef.current = true
      lastPosRef.current = getPos(e)
    }

    function doDraw(e) {
      e.preventDefault()
      if (!drawingRef.current || !ctxRef.current) return
      const [x, y] = getPos(e)
      const ctx = ctxRef.current
      ctx.globalCompositeOperation = erasingRef.current ? 'destination-out' : 'source-over'
      ctx.beginPath()
      ctx.moveTo(lastPosRef.current[0], lastPosRef.current[1])
      ctx.lineTo(x, y)
      ctx.stroke()
      lastPosRef.current = [x, y]
      onStateChangeRef.current({ sketchDataUrl: canvas.toDataURL() })
    }

    function stopDraw() { drawingRef.current = false }

    canvas.addEventListener('mousedown', startDraw)
    canvas.addEventListener('mousemove', doDraw)
    canvas.addEventListener('mouseup', stopDraw)
    canvas.addEventListener('mouseleave', stopDraw)
    canvas.addEventListener('touchstart', startDraw, { passive: false })
    canvas.addEventListener('touchmove', doDraw, { passive: false })
    canvas.addEventListener('touchend', stopDraw)

    return () => {
      canvas.removeEventListener('mousedown', startDraw)
      canvas.removeEventListener('mousemove', doDraw)
      canvas.removeEventListener('mouseup', stopDraw)
      canvas.removeEventListener('mouseleave', stopDraw)
      canvas.removeEventListener('touchstart', startDraw)
      canvas.removeEventListener('touchmove', doDraw)
      canvas.removeEventListener('touchend', stopDraw)
    }
  }, [])

  // Initialize canvas context the first time the user switches to draw mode
  useEffect(() => {
    if (state.inputMode === 'draw' && !canvasInitRef.current) {
      const canvas = canvasRef.current
      const wrap = canvas.parentElement
      canvas.width = wrap.clientWidth
      canvas.height = 420
      const ctx = canvas.getContext('2d')
      ctx.strokeStyle = '#111'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctxRef.current = ctx
      canvasInitRef.current = true
    }
  }, [state.inputMode])

  function handleErasingToggle(isErasing) {
    setErasing(isErasing)
    erasingRef.current = isErasing
  }

  function handleClear() {
    if (!ctxRef.current) return
    const canvas = canvasRef.current
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height)
    onStateChange({ sketchDataUrl: null })
  }

  function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onStateChange({ sketchDataUrl: ev.target.result })
    reader.readAsDataURL(file)
  }

  const hasContent = state.description.trim() || state.sketchDataUrl

  return (
    <div id="step2">
      <div className="step2-title">Tell us what you want your widget to do.</div>

      <div className="tag-row">
        {['size', 'functionality', 'format'].map(key =>
          state[key] ? (
            <div key={key} className="tag">
              {state[key]}{' '}
              <span className="tag-x" onClick={() => onStateChange({ [key]: null })}>x</span>
            </div>
          ) : null
        )}
      </div>

      {/* Input method selector */}
      <div className="input-method-label">Choose your input method:</div>
      <div className="input-method-row">
        {INPUT_METHODS.map(({ mode, emoji, label, sub }) => (
          <button
            key={mode}
            className={`input-method-card${state.inputMode === mode ? ' active' : ''}`}
            onClick={() => onStateChange({ inputMode: mode })}
          >
            <span className="method-emoji">{emoji}</span>
            <span className="method-label">{label}</span>
            <span className="method-sub">{sub}</span>
          </button>
        ))}
      </div>

      {/* TEXT INPUT — always visible */}
      <div className="text-input-wrap">
        <input
          type="text"
          placeholder={state.inputMode === 'text' ? 'Describe your widget…' : 'Add written directions…'}
          value={state.description}
          onChange={e => onStateChange({ description: e.target.value })}
        />
      </div>

      {/* DRAW MODE, always in DOM so canvas persists */}
      <div style={{ display: state.inputMode === 'draw' ? 'block' : 'none' }}>
        <div className="canvas-wrap">
          <div className="canvas-toolbar">
            <button
              className={`tool-btn${!erasing ? ' active' : ''}`}
              onClick={() => handleErasingToggle(false)}
            >
              ✏️ Draw
            </button>
            <button
              className={`tool-btn${erasing ? ' active' : ''}`}
              onClick={() => handleErasingToggle(true)}
            >
              ◇ Erase
            </button>
            <button className="tool-btn" onClick={handleClear}>🗑 Clear</button>
          </div>
          <canvas ref={canvasRef} id="sketchCanvas" />
        </div>
      </div>

      {/* UPLOAD MODE */}
      <div style={{ display: state.inputMode === 'upload' ? 'block' : 'none' }}>
        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
          {state.sketchDataUrl && state.inputMode === 'upload' ? (
            <img src={state.sketchDataUrl} alt="Uploaded" className="upload-preview" />
          ) : (
            <>
              <span className="upload-icon">🖼️</span>
              <span className="upload-prompt">Click to choose an image</span>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
      </div>

      <div className="step-nav">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <button
          className={`generate-btn${hasContent ? ' ready' : ''}`}
          onClick={onGenerate}
        >
          Generate Widget
        </button>
      </div>
    </div>
  )
}
