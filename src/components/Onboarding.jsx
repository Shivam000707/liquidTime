import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Mic, MicOff, Loader2, Sparkles } from 'lucide-react'
import Timeline from './Timeline'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { generateSchedule } from '../services/api'
import { saveProfile, saveSchedule } from '../services/storage'

function todayStr() {
  const t = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`
}

const PANEL = {
  background: 'linear-gradient(180deg, rgba(15,23,42,0.92), rgba(2,6,23,0.92))',
  border: '1px solid rgba(16,185,129,0.30)',
  boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 64px rgba(16,185,129,0.16), inset 0 1px 0 rgba(255,255,255,0.07)',
}
const INPUT = { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(16,185,129,0.25)' }

const EXAMPLES = [
  { label: 'Packed class day', value: 'Lectures 9 to 11, lab 2 to 4:30, gym at 6, dinner at 8, study before bed' },
  { label: 'Light day', value: 'Classes till noon, free afternoon, coding session 3 to 6, dinner at 8, sleep by 11' },
  { label: 'Gym + project', value: 'Morning gym at 7, lectures 10 to 1, lunch, project work in the afternoon, evening walk' },
]
const CTA = { background: 'linear-gradient(135deg,#10b981,#34d399)', boxShadow: '0 12px 36px rgba(16,185,129,0.30), inset 0 1px 0 rgba(255,255,255,0.18)' }

function Onboarding({ onComplete }) {
  const [step, setStep]               = useState('name')   // name | describe | review
  const [name, setName]               = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [result, setResult]           = useState(null)     // { schedule, message }

  const { transcript, isListening, isSupported, startListening, stopListening } = useSpeechRecognition()

  // Mirror live speech into the description field.
  useEffect(() => {
    if (isListening && transcript) setDescription(transcript)
  }, [transcript, isListening])

  const toggleMic = () => {
    if (isListening) stopListening()
    else startListening()
  }

  const runGenerate = async () => {
    if (!description.trim()) return
    stopListening()
    setLoading(true)
    setError(null)
    try {
      const res = await generateSchedule(description.trim(), name.trim(), todayStr())
      setResult(res)
      setStep('review')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const confirm = () => {
    saveProfile({ name: name.trim() || 'there', onboarded: true })
    saveSchedule(result.schedule)
    onComplete()
  }

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-6 py-12 overflow-hidden"
      style={{ background: '#020617', color: '#f8fafc', fontFamily: 'Geist, Inter, system-ui, sans-serif' }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.09), transparent 60%)' }} />
        <div className="absolute top-[40%] -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.07), transparent 60%)' }} />
      </div>

      <div
        className="relative w-full max-w-[560px] rounded-[28px] p-8 sm:p-10"
        style={PANEL}
      >
        {/* Step indicator — only on name/describe steps */}
        {(step === 'name' || step === 'describe') && (
          <div className="flex items-center gap-2 mb-7">
            {[0, 1].map((i) => {
              const active = i === (step === 'name' ? 0 : 1)
              return (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: active ? 24 : 8,
                    height: 8,
                    background: active ? 'linear-gradient(135deg,#10b981,#34d399)' : 'rgba(51,65,85,0.6)',
                  }}
                />
              )
            })}
            <span className="ml-1 text-[11px] text-slate-500 font-medium uppercase tracking-[0.08em]">
              Step {step === 'name' ? 1 : 2} of 2
            </span>
          </div>
        )}

        {/* STEP 1 — NAME */}
        {step === 'name' && (
          <div style={{ animation: 'lt-fade-in 300ms ease-out both' }}>
            <h2 className="text-[24px] font-medium tracking-tight">Welcome to LiquidTime</h2>
            <p className="text-[14px] text-slate-400 mt-1.5 mb-6">First — what should we call you?</p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) setStep('describe') }}
              placeholder="Your name"
              className="w-full rounded-xl px-4 py-3 text-[15px] text-slate-100 placeholder-slate-500 outline-none"
              style={INPUT}
            />
            <div className="mt-7 flex justify-end">
              <button
                onClick={() => setStep('describe')}
                disabled={!name.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-medium text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                style={CTA}
              >
                Continue <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — DESCRIBE */}
        {step === 'describe' && (
          <div style={{ animation: 'lt-fade-in 300ms ease-out both' }}>
            <h2 className="text-[24px] font-medium tracking-tight">
              Describe your day, {name.trim()}
            </h2>
            <p className="text-[14px] text-slate-400 mt-1.5 mb-5">
              Tell us your classes, work, gym, meals — anything. The AI will lay it out for you.
            </p>

            <textarea
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='e.g. "Lectures 9 to 11, lab 2 to 4:30, gym in the evening, dinner at 8, study before bed"'
              className="w-full rounded-xl px-4 py-3 text-[15px] text-slate-100 placeholder-slate-500 resize-none outline-none"
              style={{ ...INPUT, minHeight: 130 }}
            />

            {!description.trim() && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[12px] text-slate-500">Try:</span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => setDescription(ex.value)}
                    className="text-[12px] font-medium text-slate-300 px-3 py-1.5 rounded-lg transition-colors hover:text-slate-50 hover:brightness-125"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.30)' }}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            )}

            {isSupported && (
              <button
                onClick={toggleMic}
                className="mt-4 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all hover:brightness-110"
                style={isListening
                  ? { background: 'rgba(110,231,183,0.18)', color: '#6ee7b7', border: '1px solid rgba(110,231,183,0.45)', boxShadow: '0 0 24px rgba(16,185,129,0.25)' }
                  : { background: 'rgba(16,185,129,0.10)', color: '#34d399', border: '1px solid rgba(16,185,129,0.35)', boxShadow: '0 4px 16px rgba(16,185,129,0.12)' }}
              >
                {isListening ? <MicOff size={15} strokeWidth={1.8} /> : <Mic size={15} strokeWidth={1.8} />}
                {isListening ? 'Stop dictating' : 'Dictate by voice'}
              </button>
            )}

            {error && (
              <div className="mt-4 px-4 py-2.5 rounded-xl text-[13px] text-red-300 bg-red-900/40 border border-red-800/60">
                {error}
              </div>
            )}

            <div className="mt-7 flex items-center justify-between">
              <button
                onClick={() => { stopListening(); setStep('name') }}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-400 hover:text-slate-100 transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={runGenerate}
                disabled={!description.trim() || loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-medium text-white transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                style={CTA}
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Building…</>
                  : <><Sparkles size={16} /> Generate schedule</>}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — REVIEW */}
        {step === 'review' && result && (
          <div style={{ animation: 'lt-fade-in 300ms ease-out both' }}>
            <h2 className="text-[24px] font-medium tracking-tight">Here's your day</h2>
            <p className="text-[14px] text-slate-400 mt-1.5 mb-5">{result.message}</p>

            <div className="max-h-[340px] overflow-y-auto pr-1 -mr-1">
              <Timeline blocks={result.schedule} />
            </div>

            <div className="mt-7 flex items-center justify-between">
              <button
                onClick={() => setStep('describe')}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-[14px] font-medium text-slate-400 hover:text-slate-100 transition-colors"
              >
                <ArrowLeft size={16} /> Describe again
              </button>
              <button
                onClick={confirm}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-medium text-white transition-all hover:brightness-110"
                style={CTA}
              >
                Looks good <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Onboarding
