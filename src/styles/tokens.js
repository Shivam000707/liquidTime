// Design tokens — single source of truth for all repeated style values.
// Import what you need: import { CLR, GRAD, SHADOW, BORDER, BLUR } from '../styles/tokens'

export const CLR = {
  // brand
  emerald:      '#10b981',
  emeraldMid:   '#34d399',
  emeraldLight: '#6ee7b7',
  lime:         '#a3e635',
  limeLight:    '#bef264',
  // page backgrounds
  bgDeep:       '#010806',
  bgDark:       '#020617',
  // surface fills
  bgPanel:      'rgba(15,23,42,0.98)',
  bgPanelMd:    'rgba(15,23,42,0.7)',
  bgPanelSm:    'rgba(15,23,42,0.8)',
  bgTile:       'rgba(15,23,42,0.6)',
  // modal overlays
  bgOverlay60:  'rgba(2,6,23,0.6)',
  bgOverlay78:  'rgba(2,6,23,0.78)',
  // misc UI
  handle:       'rgba(100,116,139,0.4)',
  micIdleBg:    'rgba(30,41,59,0.6)',
  micIdleFg:    '#64748b',
  // emerald alpha fills
  emeraldFill10:  'rgba(16,185,129,0.10)',
  emeraldFill12:  'rgba(16,185,129,0.12)',
  emeraldFill15:  'rgba(16,185,129,0.15)',
  emeraldFill18:  'rgba(16,185,129,0.18)',
  // lime alpha fills
  limeFill15:   'rgba(163,230,53,0.15)',
  limeFill16:   'rgba(163,230,53,0.16)',
  // emerald border colors (raw, for use as borderColor)
  emeraldBorder20: 'rgba(16,185,129,0.20)',
  emeraldBorder25: 'rgba(16,185,129,0.25)',
  emeraldBorder28: 'rgba(16,185,129,0.28)',
  emeraldBorder32: 'rgba(16,185,129,0.32)',
  emeraldBorder35: 'rgba(16,185,129,0.35)',
  emeraldBorder45: 'rgba(16,185,129,0.45)',
}

export const GRAD = {
  primary:     'linear-gradient(135deg,#10b981,#34d399)',
  primaryHero: 'linear-gradient(135deg,#059669 0%,#10b981 60%,#34d399 100%)',
  primaryLime: 'linear-gradient(135deg,#10b981,#a3e635)',
  progress:    'linear-gradient(90deg,#10b981,#34d399)',
  modal:       'linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))',
  modalLight:  'linear-gradient(180deg,rgba(15,23,42,0.97),rgba(2,6,23,0.97))',
  syncPill:    'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(52,211,153,0.12))',
  aiInsight:   'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(163,230,53,0.08))',
  blockBg:     'linear-gradient(180deg,rgba(16,185,129,0.03),transparent 80%)',
  destructive: 'linear-gradient(135deg,#dc2626,#9f1239)',
}

export const SHADOW = {
  // ambient glow
  emeraldGlow:    '0 0 16px rgba(16,185,129,0.6), 0 0 32px rgba(52,211,153,0.4)',
  emeraldAmbient: '0 0 40px rgba(16,185,129,0.14)',
  emeraldOrb:     '0 0 0 4px rgba(16,185,129,0.18), 0 0 16px rgba(16,185,129,0.6)',
  // mic button
  micActive: '0 0 0 1px rgba(16,185,129,0.40), 0 0 32px rgba(16,185,129,0.55), 0 0 64px rgba(52,211,153,0.4)',
  micIdle:   '0 8px 24px rgba(0,0,0,0.4), 0 0 24px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
  // panels / surfaces
  panel:     '0 -8px 40px rgba(0,0,0,0.5), 0 0 40px rgba(16,185,129,0.14), inset 0 1px 0 rgba(255,255,255,0.07)',
  editor:    '0 -8px 60px rgba(0,0,0,0.6), 0 0 64px rgba(16,185,129,0.14), inset 0 1px 0 rgba(255,255,255,0.07)',
  tile:      '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
  block:     '0 8px 24px rgba(0,0,0,0.3)',
  blockGlow: '0 0 0 1px rgba(16,185,129,0.35), 0 0 32px rgba(16,185,129,0.18)',
  toast:     '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(16,185,129,0.14)',
  menu:      '0 16px 48px rgba(0,0,0,0.7), 0 0 24px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
  aiInsight: '0 0 32px rgba(16,185,129,0.10), inset 0 1px 0 rgba(255,255,255,0.06)',
  // buttons
  btnPrimary: '0 8px 24px rgba(16,185,129,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
  btnSm:      '0 8px 24px rgba(16,185,129,0.25), inset 0 1px 0 rgba(255,255,255,0.18)',
  btnCommit:  '0 6px 20px rgba(16,185,129,0.30), inset 0 1px 0 rgba(255,255,255,0.18)',
  ctaBtn:     '0 0 28px rgba(16,185,129,0.50), 0 0 56px rgba(16,185,129,0.18), inset 0 1px 0 rgba(255,255,255,0.18)',
  avatar:     '0 0 24px rgba(16,185,129,0.25)',
}

// Full border shorthand strings (use for `border` style prop)
export const BORDER = {
  emerald20: '1px solid rgba(16,185,129,0.20)',
  emerald25: '1px solid rgba(16,185,129,0.25)',
  emerald28: '1px solid rgba(16,185,129,0.28)',
  emerald30: '1px solid rgba(16,185,129,0.30)',
  emerald32: '1px solid rgba(16,185,129,0.32)',
  emerald35: '1px solid rgba(16,185,129,0.35)',
  emerald45: '1px solid rgba(16,185,129,0.45)',
  slate45:   '1px solid rgba(51,65,85,0.45)',
  slate70:   '1px solid rgba(51,65,85,0.7)',
  slateDark: '1px solid rgba(30,41,59,0.8)',
}

// Backdrop blur pairs (always need both prefixed + unprefixed)
export const BLUR = {
  xs: { backdropFilter: 'blur(4px)',  WebkitBackdropFilter: 'blur(4px)'  },
  sm: { backdropFilter: 'blur(8px)',  WebkitBackdropFilter: 'blur(8px)'  },
  md: { backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' },
  lg: { backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' },
}
