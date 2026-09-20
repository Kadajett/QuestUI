import type {ReactElement, ReactNode} from 'react'
import * as stylex from '@stylexjs/stylex'
import type {QuestButtonSize, QuestButtonVariant} from './button'

const turn = stylex.keyframes({to: {transform: 'rotate(360deg)'}})
const styles = stylex.create({
  root: {position:'relative', display:'inline-grid', verticalAlign:'middle'},
  overlay: {position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', gap:12, pointerEvents:'none', color:'var(--q-primary-foreground, white)', fontFamily:'var(--q-font-display, "Pixelify Sans", monospace)', fontSize:20, fontWeight:700, opacity:0.8},
  spinner: {width:14, height:14, boxSizing:'border-box', borderWidth:3, borderStyle:{default:'solid','@media (prefers-reduced-motion: reduce)':'dotted'}, borderColor:'currentColor', borderRightColor:{default:'transparent','@media (prefers-reduced-motion: reduce)':'currentColor'}, animationName:{default:turn,'@media (prefers-reduced-motion: reduce)':'none'}, animationDuration:'800ms', animationTimingFunction:'steps(4, end)', animationIterationCount:'infinite'},
  secondary: {color:'var(--q-secondary-foreground, white)'},
  danger: {color:'var(--q-destructive-foreground, white)'},
  plain: {color:'var(--q-foreground, #1c2b45)'},
  sm: {fontSize:18},
  lg: {fontSize:24},
})

/** The native loading button owns busy/disabled state; this layer only paints it. */
export function ButtonLoading({children,text,variant,size}:{children:ReactNode;text:string;variant:QuestButtonVariant;size:QuestButtonSize}):ReactElement {
  return <span {...stylex.props(styles.root)}>{children}<span data-quest-loading="" {...stylex.props(styles.overlay,variant==='secondary' && styles.secondary,variant==='danger' && styles.danger,(variant==='outline'||variant==='ghost') && styles.plain,size==='sm'&&styles.sm,size==='lg'&&styles.lg)} aria-hidden="true"><span {...stylex.props(styles.spinner)}/>{size==='icon' ? null : text}</span></span>
}
