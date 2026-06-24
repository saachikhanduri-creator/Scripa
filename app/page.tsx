'use client'

import { useState, useRef } from 'react'
import { tradesExamples, buildTradesPrompt } from '@/lib/trades'
import { vetExamples, buildVetPrompt } from '@/lib/vet'
import { plumbingExamples, buildPlumbingPrompt } from '@/lib/plumbing'

type Vertical = 'trades' | 'vet' | 'plumbing'
type OutputTab = 'primary' | 'secondary'

interface TradesResult {
  report: {
    job_type: string
    job_ref: string
    date: string
    technician_note: string
    work_completed: string[]
    parts_used: string[]
    system_status: string
    next_action: string
  }
  client_summary: {
    greeting: string
    what_we_did: string
    outcome: string
    next_steps: string
  }
}

interface VetResult {
  soap_note: {
    patient: string
    date: string
    subjective: string
    objective: string
    assessment: string
    plan: string
    weight: string
    next_appointment: string
  }
  client_letter: {
    greeting: string
    what_we_found: string
    treatment: string
    at_home: string
    watch_for: string
  }
}

interface PlumbingResult {
  job_report: {
    job_type: string
    job_ref: string
    date: string
    technician_note: string
    pipe_specs: string
    pressure_readings: string
    fault_found: string
    work_completed: string[]
    materials_used: string[]
    system_status: string
    next_action: string
  }
  client_summary: {
    greeting: string
    what_we_did: string
    outcome: string
    next_steps: string
  }
}

export default function Home() {
  const [vertical, setVertical] = useState<Vertical>('trades')
  const [spoken, setSpoken] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [outputTab, setOutputTab] = useState<OutputTab>('primary')
  const [tradesResult, setTradesResult] = useState<TradesResult | null>(null)
  const [vetResult, setVetResult] = useState<VetResult | null>(null)
  const [plumbingResult, setPlumbingResult] = useState<PlumbingResult | null>(null)
  const [copied, setCopied] = useState(false)

  // Trades fields
  const [jobType, setJobType] = useState('HVAC service')
  const [jobRef, setJobRef] = useState('')

  // Vet fields
  const [species, setSpecies] = useState('Dog')
  const [petName, setPetName] = useState('')

  // Plumbing fields
  const [plumbJobType, setPlumbJobType] = useState('Pipe repair')
  const [plumbJobRef, setPlumbJobRef] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const finalRef = useRef('')

  const hasOutput = vertical === 'trades' ? !!tradesResult : vertical === 'vet' ? !!vetResult : !!plumbingResult

  function switchVertical(v: Vertical) {
    setVertical(v)
    setSpoken('')
    setTradesResult(null)
    setVetResult(null)
    setPlumbingResult(null)
    setOutputTab('primary')
    finalRef.current = ''
  }

  function useExample(key: string) {
    const ex = vertical === 'trades' ? tradesExamples[key]
      : vertical === 'vet' ? vetExamples[key]
      : plumbingExamples[key]
    if (ex) setSpoken(ex)
  }

  function toggleMic() {
    if (isRecording) {
      recognitionRef.current?.stop()
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SR) { alert('Speech recognition not supported. Please type or use an example.'); return }

    const r = new SR()
    r.continuous = true
    r.interimResults = true
    r.lang = 'en-GB'
    finalRef.current = spoken

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalRef.current += e.results[i][0].transcript + ' '
        else interim = e.results[i][0].transcript
      }
      setSpoken(finalRef.current + interim)
    }
    r.onend = () => { setIsRecording(false); setSpoken(finalRef.current) }
    r.onerror = () => { setIsRecording(false) }
    r.start()
    recognitionRef.current = r
    setIsRecording(true)
  }

  async function generate() {
    if (!spoken.trim() || isLoading) return
    setIsLoading(true)
    setOutputTab('primary')

    const prompt = vertical === 'trades'
      ? buildTradesPrompt(jobType, jobRef || 'Not specified', spoken)
      : vertical === 'vet'
      ? buildVetPrompt(species, petName || 'Patient', spoken)
      : buildPlumbingPrompt(plumbJobType, plumbJobRef || 'Not specified', spoken)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (data.result) {
        if (vertical === 'trades') setTradesResult(data.result as TradesResult)
        else if (vertical === 'vet') setVetResult(data.result as VetResult)
        else setPlumbingResult(data.result as PlumbingResult)
      }
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  function copyOutput() {
    const el = document.getElementById('active-panel')
    if (el) {
      navigator.clipboard.writeText(el.innerText).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      })
    }
  }

  const statusClass = (s: string) =>
    s === 'Satisfactory' ? 'status-badge status-ok'
    : s === 'Unsatisfactory' ? 'status-badge status-bad'
    : 'status-badge status-warn'

  return (
    <div className="app-shell">
      {/* Top bar */}
      <div className="topbar">
        <div className="logo">scrip<span className="logo-accent">a</span></div>
        <div className="vertical-badge">
          {vertical === 'trades' ? '🔧 HVAC' : vertical === 'vet' ? '🐾 Veterinary' : '💧 Plumbing'}
        </div>
      </div>

      {/* Vertical switcher */}
      <div className="vertical-switcher">
        <div
          className={`vertical-tab${vertical === 'trades' ? ' active' : ''}`}
          onClick={() => switchVertical('trades')}
        >
          🔧 HVAC
        </div>
        <div
          className={`vertical-tab${vertical === 'plumbing' ? ' active' : ''}`}
          onClick={() => switchVertical('plumbing')}
        >
          💧 Plumbing
        </div>
        <div
          className={`vertical-tab${vertical === 'vet' ? ' active' : ''}`}
          onClick={() => switchVertical('vet')}
        >
          🐾 Veterinary
        </div>
      </div>

      <div className="content">
        {/* Meta fields */}
        {vertical === 'trades' ? (
          <div>
            <div className="label">Job details</div>
            <div className="meta-row">
              <select value={jobType} onChange={e => setJobType(e.target.value)}>
                <option>HVAC service</option>
                <option>Boiler inspection</option>
                <option>Annual service</option>
                <option>Electrical check</option>
                <option>Gas safety check</option>
              </select>
              <input
                type="text"
                placeholder="Job ref / address"
                value={jobRef}
                onChange={e => setJobRef(e.target.value)}
              />
            </div>
          </div>
        ) : vertical === 'plumbing' ? (
          <div>
            <div className="label">Job details</div>
            <div className="meta-row">
              <select value={plumbJobType} onChange={e => setPlumbJobType(e.target.value)}>
                <option>Pipe repair</option>
                <option>Leak inspection</option>
                <option>Boiler installation</option>
                <option>Drain clearance</option>
                <option>Emergency call-out</option>
                <option>Annual service</option>
              </select>
              <input
                type="text"
                placeholder="Job ref / address"
                value={plumbJobRef}
                onChange={e => setPlumbJobRef(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="label">Consultation details</div>
            <div className="meta-row">
              <select value={species} onChange={e => setSpecies(e.target.value)}>
                <option>Dog</option>
                <option>Cat</option>
                <option>Rabbit</option>
                <option>Bird</option>
                <option>Reptile</option>
                <option>Other</option>
              </select>
              <input
                type="text"
                placeholder="Patient name"
                value={petName}
                onChange={e => setPetName(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Dictation */}
        <div className="dictate-card">
          <div className="label">
            {vertical === 'vet' ? 'Dictate your consultation notes' : 'Dictate what you did on site'}
          </div>
          <textarea
            value={spoken}
            onChange={e => setSpoken(e.target.value)}
            placeholder={
              vertical === 'trades'
                ? 'e.g. Arrived at site, found boiler pressure low at 0.8 bar. Repressurised to 1.5, bled two radiators, checked flue gases all within limits…'
                : vertical === 'plumbing'
                ? 'e.g. Found 22mm copper pipe with pinhole leak under kitchen floorboards. Cut out damaged section, replaced with new pipe and end-feed couplings. Pressure tested at 6 bar…'
                : 'e.g. Saw Biscuit, 4-year-old Labrador. Owner reports lethargy for 3 days. Mild fever 39.4°C, enlarged lymph nodes. Suspect viral…'
            }
          />
          <div className="dictate-footer">
            <button
              className={`mic-btn${isRecording ? ' recording' : ''}`}
              onClick={toggleMic}
            >
              <span className="mic-dot" />
              {isRecording ? 'Stop' : 'Record'}
            </button>
            <div className="examples">
              {vertical === 'trades' ? (
                <>
                  <span className="ex-pill" onClick={() => useExample('hvac')}>HVAC</span>
                  <span className="ex-pill" onClick={() => useExample('boiler')}>Boiler</span>
                  <span className="ex-pill" onClick={() => useExample('elec')}>Electrical</span>
                </>
              ) : vertical === 'plumbing' ? (
                <>
                  <span className="ex-pill" onClick={() => useExample('pipe_repair')}>Pipe repair</span>
                  <span className="ex-pill" onClick={() => useExample('leak_inspection')}>Leak</span>
                  <span className="ex-pill" onClick={() => useExample('boiler_install')}>Install</span>
                </>
              ) : (
                <>
                  <span className="ex-pill" onClick={() => useExample('dog')}>Dog</span>
                  <span className="ex-pill" onClick={() => useExample('cat')}>Cat</span>
                  <span className="ex-pill" onClick={() => useExample('exotic')}>Exotic</span>
                </>
              )}
            </div>
            <span className="char-hint">{spoken.trim().length}</span>
          </div>
        </div>

        {/* Generate button */}
        <button
          className="gen-btn"
          onClick={generate}
          disabled={spoken.trim().length < 10 || isLoading}
        >
          {isLoading ? (
            <><span className="spinner" /> Generating…</>
          ) : (
            <>{hasOutput ? '↺ Re-generate' : '→ Generate report'}</>
          )}
        </button>

        {/* Output */}
        {(isLoading || hasOutput) && (
          <div className="output-section">
            <div className="output-tabs">
              <div
                className={`output-tab${outputTab === 'primary' ? ' active' : ''}`}
                onClick={() => setOutputTab('primary')}
              >
                {vertical === 'vet' ? 'SOAP note' : 'Job report'}
              </div>
              <div
                className={`output-tab${outputTab === 'secondary' ? ' active' : ''}`}
                onClick={() => setOutputTab('secondary')}
              >
                {vertical === 'vet' ? 'Client letter' : 'Client summary'}
              </div>
            </div>

            <div className="output-panel" id="active-panel">
              {isLoading ? (
                <div className="loading-state">
                  <span className="spinner" />
                  Building your {vertical === 'vet' ? 'consultation note' : 'job report'}…
                </div>
              ) : vertical === 'trades' && tradesResult ? (
                outputTab === 'primary' ? (
                  <TradesReport result={tradesResult} statusClass={statusClass} />
                ) : (
                  <TradesClient result={tradesResult} />
                )
              ) : vertical === 'plumbing' && plumbingResult ? (
                outputTab === 'primary' ? (
                  <PlumbingReport result={plumbingResult} statusClass={statusClass} />
                ) : (
                  <PlumbingClient result={plumbingResult} />
                )
              ) : vertical === 'vet' && vetResult ? (
                outputTab === 'primary' ? (
                  <VetSOAP result={vetResult} />
                ) : (
                  <VetClient result={vetResult} />
                )
              ) : null}
            </div>

            {!isLoading && hasOutput && (
              <div className="copy-row">
                <button className="copy-btn" onClick={copyOutput}>
                  {copied ? '✓ Copied' : '⎘ Copy'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="app-footer">
        Scripa — voice documentation for the trades · MVP demo
      </div>
    </div>
  )
}

function TradesReport({ result, statusClass }: { result: TradesResult; statusClass: (s: string) => string }) {
  const r = result.report
  return (
    <>
      <div className="field-grid">
        <div className="field-card">
          <div className="field-card-key">Job type</div>
          <div className="field-card-val">{r.job_type}</div>
        </div>
        <div className="field-card">
          <div className="field-card-key">Date</div>
          <div className="field-card-val">{r.date}</div>
        </div>
        <div className="field-card full">
          <div className="field-card-key">Reference / address</div>
          <div className="field-card-val">{r.job_ref}</div>
        </div>
      </div>

      <div className="report-section">
        <div className="report-section-title">Technician notes</div>
        <div className="report-section-body">{r.technician_note}</div>
      </div>

      <div className="report-section">
        <div className="report-section-title">Work completed</div>
        <div className="report-section-body">
          {r.work_completed.map((w, i) => <div key={i}>• {w}</div>)}
        </div>
      </div>

      <div className="report-section">
        <div className="report-section-title">Parts used</div>
        <div className="report-section-body">
          {r.parts_used.map((p, i) => <div key={i}>• {p}</div>)}
        </div>
      </div>

      <div className="status-row">
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>System status</span>
        <span className={statusClass(r.system_status)}>{r.system_status}</span>
      </div>

      <div className="next-action">
        Next action: <strong>{r.next_action}</strong>
      </div>
    </>
  )
}

function TradesClient({ result }: { result: TradesResult }) {
  const c = result.client_summary
  return (
    <>
      <div className="client-greeting">{c.greeting}</div>
      <div className="report-section">
        <div className="report-section-title">What we did</div>
        <div className="report-section-body">{c.what_we_did}</div>
      </div>
      <div className="report-section">
        <div className="report-section-title">Outcome</div>
        <div className="report-section-body">{c.outcome}</div>
      </div>
      <div className="report-section">
        <div className="report-section-title">Next steps</div>
        <div className="report-section-body">{c.next_steps}</div>
      </div>
    </>
  )
}

function VetSOAP({ result }: { result: VetResult }) {
  const s = result.soap_note
  return (
    <>
      <div className="field-grid">
        <div className="field-card full">
          <div className="field-card-key">Patient</div>
          <div className="field-card-val">{s.patient}</div>
        </div>
        <div className="field-card">
          <div className="field-card-key">Date</div>
          <div className="field-card-val">{s.date}</div>
        </div>
        <div className="field-card">
          <div className="field-card-key">Weight</div>
          <div className="field-card-val">{s.weight || '—'}</div>
        </div>
      </div>

      {[
        { key: 'S — Subjective', val: s.subjective },
        { key: 'O — Objective', val: s.objective },
        { key: 'A — Assessment', val: s.assessment },
        { key: 'P — Plan', val: s.plan },
      ].map(({ key, val }) => (
        <div className="report-section" key={key}>
          <div className="report-section-title">{key}</div>
          <div className="report-section-body">{val}</div>
        </div>
      ))}

      <div className="next-action">
        Next appointment: <strong>{s.next_appointment}</strong>
      </div>
    </>
  )
}

function VetClient({ result }: { result: VetResult }) {
  const c = result.client_letter
  return (
    <>
      <div className="client-greeting">{c.greeting}</div>
      {[
        { key: 'What we found', val: c.what_we_found },
        { key: 'Treatment', val: c.treatment },
        { key: 'At home', val: c.at_home },
        { key: 'Watch out for', val: c.watch_for },
      ].map(({ key, val }) => (
        <div className="report-section" key={key}>
          <div className="report-section-title">{key}</div>
          <div className="report-section-body">{val}</div>
        </div>
      ))}
    </>
  )
}

function PlumbingReport({ result, statusClass }: { result: PlumbingResult; statusClass: (s: string) => string }) {
  const r = result.job_report
  return (
    <>
      <div className="field-grid">
        <div className="field-card">
          <div className="field-card-key">Job type</div>
          <div className="field-card-val">{r.job_type}</div>
        </div>
        <div className="field-card">
          <div className="field-card-key">Date</div>
          <div className="field-card-val">{r.date}</div>
        </div>
        <div className="field-card full">
          <div className="field-card-key">Reference / address</div>
          <div className="field-card-val">{r.job_ref}</div>
        </div>
      </div>

      <div className="report-section">
        <div className="report-section-title">Technician notes</div>
        <div className="report-section-body">{r.technician_note}</div>
      </div>

      <div className="field-grid">
        <div className="field-card full">
          <div className="field-card-key">Pipe specs</div>
          <div className="field-card-val">{r.pipe_specs}</div>
        </div>
        <div className="field-card full">
          <div className="field-card-key">Pressure readings</div>
          <div className="field-card-val">{r.pressure_readings}</div>
        </div>
      </div>

      <div className="report-section">
        <div className="report-section-title">Fault found</div>
        <div className="report-section-body">{r.fault_found}</div>
      </div>

      <div className="report-section">
        <div className="report-section-title">Work completed</div>
        <div className="report-section-body">
          {r.work_completed.map((w, i) => <div key={i}>• {w}</div>)}
        </div>
      </div>

      <div className="report-section">
        <div className="report-section-title">Materials used</div>
        <div className="report-section-body">
          {r.materials_used.map((m, i) => <div key={i}>• {m}</div>)}
        </div>
      </div>

      <div className="status-row">
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>System status</span>
        <span className={statusClass(r.system_status)}>{r.system_status}</span>
      </div>

      <div className="next-action">
        Next action: <strong>{r.next_action}</strong>
      </div>
    </>
  )
}

function PlumbingClient({ result }: { result: PlumbingResult }) {
  const c = result.client_summary
  return (
    <>
      <div className="client-greeting">{c.greeting}</div>
      <div className="report-section">
        <div className="report-section-title">What we did</div>
        <div className="report-section-body">{c.what_we_did}</div>
      </div>
      <div className="report-section">
        <div className="report-section-title">Outcome</div>
        <div className="report-section-body">{c.outcome}</div>
      </div>
      <div className="report-section">
        <div className="report-section-title">Next steps</div>
        <div className="report-section-body">{c.next_steps}</div>
      </div>
    </>
  )
}
