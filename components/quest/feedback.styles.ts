import * as stylex from '@stylexjs/stylex'

const skeletonPulse = stylex.keyframes({
  '0%, 100%': {opacity: 1},
  '50%': {opacity: 0.55},
})

export const feedbackStyles = stylex.create({
  progress: {
    fontFamily: 'var(--q-font-body)', color: 'var(--q-foreground)',
    '--text-label-size': '20px', '--font-weight-medium': '400',
    gap: 8, paddingBottom: 4,
  },
  skeleton: {
    borderRadius: 0,
    clipPath: 'var(--q-step)',
    backgroundColor: 'var(--q-muted)',
    backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 12px, color-mix(in srgb, var(--q-border), transparent 65%) 12px, color-mix(in srgb, var(--q-border), transparent 65%) 16px)',
    animationTimingFunction: 'steps(3, end)',
    animationName: {default: skeletonPulse, '@media (prefers-reduced-motion: reduce)': 'none'},
  },
})
