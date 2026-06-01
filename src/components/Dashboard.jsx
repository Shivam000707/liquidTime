import { useState, useCallback } from 'react'
import { AudioWaveform, Plus } from 'lucide-react'
import TopBar from './TopBar'
import Timeline from './Timeline'
import MicButton from './MicButton'
import VoiceModal from './VoiceModal'
import BlockEditor from './BlockEditor'
import Toast from './Toast'
import { useSchedule } from '../hooks/useSchedule'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { sendVoiceCommand, friendlyError } from '../services/api'
import { GRAD, SHADOW, BORDER, BLUR, CLR } from '../styles/tokens'

function mergeDoneState(next, prev) {
  const doneIds = new Set(prev.filter((b) => b.done).map((b) => b.id))
  return next.map((b) => (doneIds.has(b.id) ? { ...b, done: true } : b))
}

function Dashboard({ userName = 'there', onNameChange, onReset }) {
  const { blocks, updateBlocks, addBlock, editBlock, deleteBlock, addTask, toggleTask, deleteTask } = useSchedule()
  const { transcript, isListening, isSupported, startListening, stopListening } = useSpeechRecognition()

  const [recording, setRecording]   = useState(false)
  const [modalOpen, setModalOpen]   = useState(false)
  const [syncing, setSyncing]       = useState(false)
  const [synced, setSynced]         = useState(true)

  const [voiceSubmitting, setVoiceSubmitting] = useState(false)
  const [voiceError, setVoiceError]           = useState(null)

  const [toast, setToast]                = useState(null)
  const [lastAIMessage, setLastAIMessage] = useState(null)

  const [editorOpen, setEditorOpen]     = useState(false)
  const [editorMode, setEditorMode]     = useState('add')
  const [editingBlock, setEditingBlock] = useState(null)

  const doneCount = blocks.filter((b) => b.done).length

  const openVoice = useCallback(() => {
    setVoiceError(null)
    setModalOpen(true)
    setRecording(true)
    if (isSupported) startListening()
  }, [isSupported, startListening])

  const closeVoice = useCallback(() => {
    stopListening()
    setModalOpen(false)
    setRecording(false)
    setVoiceError(null)
  }, [stopListening])

  const commitVoice = useCallback(async (text) => {
    const cmd = (text ?? '').trim()
    if (!cmd) return

    stopListening()
    setVoiceError(null)
    setVoiceSubmitting(true)
    setSyncing(true)
    setSynced(false)

    try {
      const { schedule, message } = await sendVoiceCommand(cmd, blocks)
      const prev = blocks
      updateBlocks(mergeDoneState(schedule, prev))
      setLastAIMessage(message)
      setSynced(true)
      setModalOpen(false)
      setRecording(false)
      setToast({
        message: message || 'Schedule updated.',
        actionLabel: 'Undo',
        onAction: () => { updateBlocks(prev); setLastAIMessage(null) },
      })
    } catch (err) {
      setVoiceError(friendlyError(err))
      setSynced(true)
    } finally {
      setVoiceSubmitting(false)
      setSyncing(false)
    }
  }, [blocks, stopListening, updateBlocks])

  const toggleDone    = useCallback((block) => editBlock(block.id, { done: !block.done }), [editBlock])
  const openAddBlock  = useCallback(() => { setEditorMode('add'); setEditingBlock(null); setEditorOpen(true) }, [])
  const openEditBlock = useCallback((block) => { setEditorMode('edit'); setEditingBlock(block); setEditorOpen(true) }, [])
  const saveBlock     = useCallback((block) => { if (editorMode === 'edit') editBlock(block.id, block); else addBlock(block); setEditorOpen(false) }, [editorMode, editBlock, addBlock])
  const removeBlock   = useCallback((id) => { deleteBlock(id); setEditorOpen(false) }, [deleteBlock])

  return (
    <div className="min-h-screen relative" style={{ background: CLR.bgDark, color: '#f8fafc', fontFamily: 'Geist, Inter, system-ui, sans-serif' }}>
      {/* ambient atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(16,185,129,0.08),transparent 60%)' }} />
        <div className="absolute top-[40%] -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(52,211,153,0.06),transparent 60%)' }} />
      </div>

      <div className="relative">
        <TopBar userName={userName} synced={synced} syncing={syncing} onNameChange={onNameChange} onReset={onReset} />

        <main className="px-4 sm:px-8 py-5 sm:py-8 max-w-[1280px] mx-auto">
          {/* mobile greeting */}
          <div className="md:hidden mb-4">
            <h1 className="text-[18px] font-medium tracking-tight text-slate-200">
              Hello, <span className="text-slate-50">{userName}</span>
            </h1>
          </div>

          <section>
              <div className="flex items-center justify-between mb-5">
                <div className="min-w-0">
                  <h2 className="text-[20px] sm:text-[22px] font-medium tracking-tight text-slate-50">Today</h2>
                  <p className="text-[12px] sm:text-[13px] text-slate-400 mt-0.5">
                    {blocks.length} blocks
                    {blocks.length > 0 && <> · {doneCount} of {blocks.length} done</>}
                  </p>
                </div>
                <button
                  onClick={openAddBlock}
                  aria-label="Add block"
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl text-[13px] font-medium text-slate-100 transition-all hover:brightness-110 active:scale-95"
                  style={{ background: GRAD.primary, boxShadow: SHADOW.btnSm, padding: '10px 12px' }}
                >
                  <Plus size={16} strokeWidth={2.4} />
                  <span className="hidden sm:inline">Add block</span>
                </button>
              </div>

              {/* day progress */}
              {blocks.length > 0 && (
                <div className="mb-5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(30,41,59,0.7)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(doneCount / blocks.length) * 100}%`, background: GRAD.progress }}
                  />
                </div>
              )}

              <Timeline
                blocks={blocks}
                reflowing={syncing}
                onEditBlock={openEditBlock}
                onToggleDone={toggleDone}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
              />
            </section>

          <div style={{ height: 'calc(15rem + env(safe-area-inset-bottom))' }} />
        </main>

        {/* docked mic */}
        {!modalOpen && (
          <div
            className="fixed left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3"
            style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
          >
            <MicButton recording={recording} onClick={openVoice} />
            <div
              className="px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-[0.08em]"
              style={{ background: CLR.bgPanelMd, color: '#94a3b8', border: BORDER.slateDark, ...BLUR.sm }}
            >
              tap to speak
            </div>
          </div>
        )}

        {/* type command — desktop only */}
        {!modalOpen && (
          <div
            className="fixed right-6 z-30 hidden md:flex flex-col gap-2 items-end"
            style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
          >
            <button
              onClick={openVoice}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium text-slate-200 bg-slate-900/70 border border-slate-800/70 hover:bg-slate-800/80 hover:text-slate-50 transition-colors backdrop-blur"
            >
              <AudioWaveform size={14} strokeWidth={1.6} />
              {isSupported ? 'Simulate voice input' : 'Type command'}
            </button>
          </div>
        )}

        <VoiceModal
          open={modalOpen} onClose={closeVoice} onCommit={commitVoice}
          transcript={transcript} isListening={isListening} isSupported={isSupported}
          submitting={voiceSubmitting} error={voiceError}
          startListening={startListening} stopListening={stopListening}
        />
        <BlockEditor
          open={editorOpen} mode={editorMode} block={editingBlock} blocks={blocks}
          onClose={() => setEditorOpen(false)} onSave={saveBlock} onDelete={removeBlock}
        />
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </div>
    </div>
  )
}

export default Dashboard
