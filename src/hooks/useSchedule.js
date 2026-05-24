import { useState, useCallback } from 'react'
import { getSchedule, saveSchedule, resetSchedule } from '../services/storage'
import { resolveConflicts } from '../utils/resolveConflicts'

export function useSchedule() {
  const [blocks, setBlocks] = useState(() => getSchedule())

  /** Sort, run the conflict pass, persist, and update state. */
  const commit = useCallback((next) => {
    const resolved = resolveConflicts(next)
    setBlocks(resolved)
    saveSchedule(resolved)
    return resolved
  }, [])

  // Used by the voice flow — backend already resolved conflicts, so persist as-is.
  const updateBlocks = useCallback((newBlocks) => {
    setBlocks(newBlocks)
    saveSchedule(newBlocks)
  }, [])

  const addBlock = useCallback((block) => {
    setBlocks((prev) => {
      const resolved = resolveConflicts([...prev, block])
      saveSchedule(resolved)
      return resolved
    })
  }, [])

  const editBlock = useCallback((id, patch) => {
    setBlocks((prev) => {
      const resolved = resolveConflicts(
        prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      )
      saveSchedule(resolved)
      return resolved
    })
  }, [])

  const deleteBlock = useCallback((id) => {
    setBlocks((prev) => {
      const resolved = resolveConflicts(prev.filter((b) => b.id !== id))
      saveSchedule(resolved)
      return resolved
    })
  }, [])

  const addTask = useCallback((blockId, text) => {
    setBlocks((prev) => {
      const next = prev.map((b) => {
        if (b.id !== blockId) return b
        const tasks = [...(b.tasks ?? []), { id: `t${Date.now()}`, text, done: false }]
        return { ...b, tasks }
      })
      saveSchedule(next)
      return next
    })
  }, [])

  const toggleTask = useCallback((blockId, taskId) => {
    setBlocks((prev) => {
      const next = prev.map((b) => {
        if (b.id !== blockId) return b
        const tasks = (b.tasks ?? []).map((t) => t.id === taskId ? { ...t, done: !t.done } : t)
        return { ...b, tasks }
      })
      saveSchedule(next)
      return next
    })
  }, [])

  const deleteTask = useCallback((blockId, taskId) => {
    setBlocks((prev) => {
      const next = prev.map((b) => {
        if (b.id !== blockId) return b
        const tasks = (b.tasks ?? []).filter((t) => t.id !== taskId)
        return { ...b, tasks }
      })
      saveSchedule(next)
      return next
    })
  }, [])

  const resetBlocks = useCallback(() => {
    setBlocks(resetSchedule())
  }, [])

  const reload = useCallback(() => {
    setBlocks(getSchedule())
  }, [])

  return { blocks, updateBlocks, addBlock, editBlock, deleteBlock, addTask, toggleTask, deleteTask, resetBlocks, reload, commit }
}
