import { useState, useRef, useCallback, useEffect } from 'react'

const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) || null

const isSafari = typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

const isMobile = typeof navigator !== 'undefined' &&
  /android|iphone|ipad|ipod/i.test(navigator.userAgent)

// Use continuous mode only on desktop Chrome — mobile re-delivers final results on restart
const USE_CONTINUOUS = !isSafari && !isMobile

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported] = useState(() => SpeechRecognition !== null)
  const recognizerRef = useRef(null)
  const finalRef = useRef('')
  const shouldRestartRef = useRef(false)
  // Tracks how many results were already processed in previous sessions
  const processedCountRef = useRef(0)

  useEffect(() => {
    if (!SpeechRecognition) return

    const rec = new SpeechRecognition()
    rec.continuous = USE_CONTINUOUS
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.maxAlternatives = 1

    rec.onresult = (event) => {
      let interim = ''
      // On non-continuous (mobile/safari), event.results resets each session.
      // On continuous (desktop), results accumulate; skip already-processed ones.
      const startIdx = USE_CONTINUOUS
        ? Math.max(event.resultIndex, processedCountRef.current)
        : event.resultIndex

      for (let i = startIdx; i < event.results.length; i++) {
        const r = event.results[i]
        if (r.isFinal) {
          finalRef.current += r[0].transcript + ' '
          processedCountRef.current = i + 1
        } else {
          interim += r[0].transcript
        }
      }
      setTranscript((finalRef.current + interim).trimStart())
    }

    rec.onerror = (e) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        console.error('SpeechRecognition error:', e.error)
        shouldRestartRef.current = false
        setIsListening(false)
      }
    }

    rec.onend = () => {
      if (shouldRestartRef.current) {
        // Reset per-session offset before restarting so non-continuous
        // mode doesn't skip results of the new session
        if (!USE_CONTINUOUS) processedCountRef.current = 0
        try { rec.start() } catch { /* already starting */ }
      } else {
        setIsListening(false)
      }
    }

    recognizerRef.current = rec
    return () => {
      shouldRestartRef.current = false
      rec.abort()
    }
  }, [])

  const startListening = useCallback(() => {
    if (!recognizerRef.current) return
    shouldRestartRef.current = true
    finalRef.current = ''
    processedCountRef.current = 0
    setTranscript('')
    setIsListening(true)
    try { recognizerRef.current.start() } catch (e) {
      if (e.name !== 'InvalidStateError') console.error(e)
    }
  }, [])

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false
    recognizerRef.current?.stop()
    // isListening goes false via onend
  }, [])

  return { transcript, isListening, isSupported, startListening, stopListening }
}
