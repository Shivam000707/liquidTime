// Lightweight class name combiner — no dependency needed.
// cx('a', condition && 'b', ['c', 'd']) → 'a b c d'
export function cx(...args) {
  return args
    .flat()
    .filter(Boolean)
    .join(' ')
}
