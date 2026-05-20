import { useState, useEffect } from 'react'
import Home from './components/Home.jsx'
import StepReflect from './components/StepReflect.jsx'
import Step1Properties from './components/Step1Properties.jsx'
import Step2Describe from './components/Step2Describe.jsx'
import Step3Loading from './components/Step3Loading.jsx'
import StepIdeas from './components/StepIdeas.jsx'
import Step4Result from './components/Step4Result.jsx'

const initialState = {
  type: null,
  size: null,
  customSize: '',
  functionality: null,
  customFunctionality: '',
  format: null,
  customFormat: '',
  description: '',
  sketchDataUrl: null,
  inputMode: 'text',
  reflection1Option: [],
  reflection1: '',
  reflection2Option: null,
  reflection2: '',
  reflection3Option: [],
  reflection3: '',
  reflection4Option: [],
  reflection4: '',
  reflection5: '',
  reflection6: '',
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [state, setState] = useState(initialState)
  const [generatedHtml, setGeneratedHtml] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  function handleStateChange(updates) {
    setState(prev => ({ ...prev, ...updates }))
  }

  async function handleGenerate() {
    setScreen('step3')
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: state.type,
          size: (state.size && state.size !== 'Custom') ? state.size : state.customSize,
          functionality: state.functionality || state.customFunctionality,
          format: (state.format && state.format !== 'Other') ? state.format : state.customFormat,
          description: state.description,
          sketchDataUrl: state.sketchDataUrl,
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

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'API error')
      }

      const { html } = await response.json()
      setGeneratedHtml(html)
      setHistory([{ html, label: state.description.trim() || 'Initial generation' }])
      setScreen('step4')
    } catch (err) {
      alert('Error generating widget: ' + err.message)
      setScreen('step2')
    }
  }

  async function handleRefine(refinementText) {
    const response = await fetch('/api/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentHtml: generatedHtml, refinement: refinementText })
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || 'API error')
    }
    const { html } = await response.json()
    setGeneratedHtml(html)
    setHistory(prev => [...prev, { html, label: refinementText }])
  }

  function handleCreateAnother() {
    setState(initialState)
    setGeneratedHtml('')
    setHistory([])
    setScreen('home')
  }

  return (
    <>
      {screen === 'home' && (
        <Home onStart={() => setScreen('reflect')} />
      )}
      {screen === 'reflect' && (
        <StepReflect
          page={1}
          state={state}
          onStateChange={handleStateChange}
          onBack={() => setScreen('home')}
          onNext={() => setScreen('reflect2')}
        />
      )}
      {screen === 'reflect2' && (
        <StepReflect
          page={2}
          state={state}
          onStateChange={handleStateChange}
          onBack={() => setScreen('reflect')}
          onNext={() => setScreen('ideas')}
        />
      )}
      {screen === 'ideas' && (
        <StepIdeas
          state={state}
          onBack={() => setScreen('reflect2')}
          onSkip={() => setScreen('step1')}
          onSelect={idea => {
            handleStateChange({ description: `${idea.title}: ${idea.description}` })
            setScreen('step2')
          }}
        />
      )}
      {screen === 'step1' && (
        <Step1Properties
          state={state}
          onStateChange={handleStateChange}
          onBack={() => setScreen('ideas')}
          onNext={() => setScreen('step2')}
        />
      )}
      {screen === 'step2' && (
        <Step2Describe
          state={state}
          onStateChange={handleStateChange}
          onBack={() => setScreen('step1')}
          onGenerate={handleGenerate}
        />
      )}
      {screen === 'step3' && <Step3Loading state={state} />}
      {screen === 'step4' && (
        <Step4Result
          state={state}
          html={generatedHtml}
          history={history}
          onRefine={handleRefine}
          onBack={() => setScreen('step2')}
          onCreateAnother={handleCreateAnother}
        />
      )}
    </>
  )
}
