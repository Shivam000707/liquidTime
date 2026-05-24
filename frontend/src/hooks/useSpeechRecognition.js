import { useState, useRef, useCallback, useEffect } from 'react'

const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) || null

const isSafari = typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported] = useState(() => SpeechRecognition !== null)
  const recognizerRef = useRef(null)
  const finalRef = useRef('')
  // When true, onend restarts instead of stopping
  const shouldRestartRef = useRef(false)

  useEffect(() => {
    if (!SpeechRecognition) return

    const rec = new SpeechRecognition()
    rec.continuous = !isSafari
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.maxAlternatives = 1

    rec.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i]
        if (r.isFinal) {
          finalRef.current += r[0].transcript + ' '
        } else {
          interim += r[0].transcript
        }
      }
      setTranscript(finalRef.current + interim)
    }

    rec.onerror = (e) => {
      // 'no-speech' is expected during pauses — let onend handle restart
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        console.error('SpeechRecognition error:', e.error)
        shouldRestartRef.current = false
        setIsListening(false)
      }
    }

    rec.onend = () => {
      if (shouldRestartRef.current) {
        // Silence pause — restart silently, keep isListening true
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
