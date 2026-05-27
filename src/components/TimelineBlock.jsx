import { useState, useRef } from 'react'
import { BookOpen, Dumbbell, Utensils, Code2, Circle, Pencil, Sparkles, Check, Plus, X } from 'lucide-react'

const CATEGORY_ICONS = { class: BookOpen, gym: Dumbbell, food: Utensils, work: Code2 }

function CategoryIcon({ category, ...props }) {
  const Comp = CATEGORY_ICONS[category] ?? Circle
  return <Comp {...props} />
}

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="group/task flex items-center gap-2 py-0.5">
      <button
        onClick={(e) => { e.stopPropagation(); onToggle() }}
        aria-label={task.done ? 'Mark not done' : 'Mark done'}
        className="shrink-0 relative grid place-items-center transition-all"
        style={{ width: 28, height: 28, margin: -6 }}
      >
        <span className="w-4 h-4 rounded grid place-items-center"
          style={task.done
            ? { background: 'linear-gradient(135deg,#f97316,#ec4899)', border: '1px solid transparent' }
            : { background: 'transparent', border: '1.5px solid rgba(100,116,139,0.5)' }}>
          {task.done && <Check size={9} strokeWidth={3} style={{ color: '#fff' }} />}
        </span>
      </button>
      <span className={[
        'flex-1 text-[12px] leading-snug min-w-0 break-words',
        task.done ? 'line-through text-slate-500' : 'text-slate-300',
      ].join(' ')}>
        {task.text}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        aria-label="Delete task"
        className="shrink-0 opacity-0 group-hover/task:opacity-100 w-4 h-4 rounded grid place-items-center text-slate-600 hover:text-slate-300 transition-all"
      >
        <X size={11} strokeWidth={2} />
      </button>
    </div>
  )
}

function TimelineBlock({ block, dim, onEdit, onToggleDone, onAddTask, onToggleTask, onDeleteTask }) {
  const [addingTask, setAddingTask] = useState(false)
  const [taskDraft, setTaskDraft] = useState('')
  const inputRef = useRef(null)

  const isDone = !!block.done
  const tasks = block.tasks ?? []
  const doneTasks = tasks.filter((t) => t.done).length

  const baseGlow = block.changed
    ? '0 0 0 1px rgba(249,115,22,0.35), 0 0 32px rgba(249,115,22,0.18)'
    : '0 8px 24px rgba(0,0,0,0.3)'

  const openAddTask = (e) => {
    e.stopPropagation()
    setAddingTask(true)
    setTimeout(() => inputRef.current?.focus(), 40)
  }

  const commitTask = () => {
    if (taskDraft.trim()) {
      onAddTask(block.id, taskDraft.trim())
    }
    setTaskDraft('')
    setAddingTask(false)
  }

  return (
    <div
      role={onEdit ? 'button' : undefined}
      tabIndex={onEdit ? 0 : undefined}
      onClick={onEdit ? () => onEdit(block) : undefined}
      onKeyDown={onEdit ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEdit(block) } } : undefined}
      className={[
        'group relative rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 transition-all duration-300',
        'flex flex-col gap-0 bg-slate-900/50',
        onEdit ? 'cursor-pointer hover:brightness-110' : '',
        dim ? 'opacity-50' : '',
        isDone ? 'opacity-55' : '',
      ].join(' ')}
      style={{
        boxShadow: `${baseGlow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
        border: '1px solid rgba(249,115,22,0.28)',
        backgroundImage: 'linear-gradient(180deg, rgba(249,115,22,0.03), transparent 80%)',
      }}
    >
      {/* main row */}
      <div className="flex items-start gap-3 sm:gap-4">
        {/* done toggle — 44px touch target */}
        {onToggleDone && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleDone(block) }}
            aria-label={isDone ? `Mark ${block.title} not done` : `Mark ${block.title} done`}
            aria-pressed={isDone}
            className="shrink-0 self-start sm:self-center relative grid place-items-center transition-all"
            style={{ width: 44, height: 44, margin: -9 }}
          >
            <span className="w-6 h-6 rounded-full grid place-items-center transition-all"
              style={isDone
                ? { background: 'linear-gradient(135deg,#f97316,#ec4899)', border: '1px solid transparent' }
                : { background: 'transparent', border: '1.5px solid rgba(100,116,139,0.55)' }}>
              {isDone && <Check size={13} strokeWidth={3} style={{ color: '#fff' }} />}
            </span>
          </button>
        )}

        {/* category glyph — smaller on mobile */}
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl grid place-items-center shrink-0 self-start sm:self-center text-orange-200"
          style={{ background: 'rgba(249,115,22,0.15)' }}
        >
          <CategoryIcon category={block.category} size={16} strokeWidth={1.5} />
        </div>

        {/* body — title takes available width, meta wraps below */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1.5">
            <div className={['text-[15px] sm:text-[16px] font-medium leading-snug flex-1 min-w-0 break-words', isDone ? 'line-through text-slate-400' : 'text-slate-50'].join(' ')}>{block.title}</div>
            {block.changed && (
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: 'linear-gradient(135deg,rgba(249,115,22,0.18),rgba(236,72,153,0.18))', color: '#fb923c', border: '1px solid rgba(249,115,22,0.35)' }}>
                <Sparkles size={10} strokeWidth={2} />
                moved
              </span>
            )}
          </div>
          {/* meta row — wraps cleanly on narrow widths */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-slate-400">
            <span className="font-mono text-slate-300" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {block.start}
            </span>
            <span className="text-slate-700">·</span>
            <span className="font-mono text-slate-500" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {block.durationMin}m
            </span>
            {(block.location || block.hint) && (
              <>
                <span className="text-slate-700">·</span>
                <span className="break-words">{block.location || block.hint}</span>
              </>
            )}
            {tasks.length > 0 && (
              <>
                <span className="text-slate-700">·</span>
                <span className="text-[11px] text-slate-500">
                  {doneTasks}/{tasks.length} tasks
                </span>
              </>
            )}
          </div>
        </div>

        {/* tap-to-edit affordance */}
        {onEdit && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity self-center text-slate-500" aria-hidden="true">
            <Pencil size={16} strokeWidth={1.5} />
          </span>
        )}
      </div>

      {/* ── tasks section ── */}
      {(tasks.length > 0 || addingTask || onAddTask) && (
        <div
          className="mt-3 pl-4 border-l"
          style={{ borderColor: 'rgba(100,116,139,0.15)' }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {/* task list */}
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => onToggleTask(block.id, task.id)}
              onDelete={() => onDeleteTask(block.id, task.id)}
            />
          ))}

          {/* inline add input */}
          {addingTask ? (
            <div className="flex items-center gap-2 py-0.5">
              <div className="shrink-0 w-4 h-4 rounded" style={{ border: '1.5px solid rgba(100,116,139,0.4)' }} />
              <input
                ref={inputRef}
                value={taskDraft}
                onChange={(e) => setTaskDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); commitTask() }
                  if (e.key === 'Escape') { setTaskDraft(''); setAddingTask(false) }
                }}
                onBlur={commitTask}
                placeholder="Task name…"
                className="flex-1 bg-transparent text-[12px] text-slate-200 placeholder-slate-600 outline-none"
              />
            </div>
          ) : onAddTask ? (
            <button
              onClick={openAddTask}
              className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
            >
              <Plus size={11} strokeWidth={2} />
              Add task
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default TimelineBlock
