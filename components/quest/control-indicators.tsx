"use client"
import * as stylex from '@stylexjs/stylex'
import type {IndicatorProps} from '@astryxdesign/core/Indicator'
import {PixelIcon} from './pixel-icon'

const styles = stylex.create({
  box: {
    '--q-control-fill': 'var(--q-card)', '--q-control-ink': 'var(--q-card-foreground)',
    '--q-control-hover': {default: 'var(--q-control-fill)', ':hover': 'color-mix(in srgb,var(--q-control-fill),var(--q-foreground) 10%)'},
    position: 'relative', isolation: 'isolate', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    boxSizing: 'border-box', flexShrink: 0, width: 44, height: 44, borderWidth: 0, borderRadius: 0,
    backgroundColor: 'transparent', color: 'var(--q-control-ink)', filter: 'drop-shadow(0 3px 0 var(--q-shadow))',
    '::before': {content: '""', position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', clipPath: 'var(--q-step)', backgroundColor: 'var(--q-edge)'},
    '::after': {content: '""', position: 'absolute', inset: 3, zIndex: -1, pointerEvents: 'none', clipPath: 'var(--q-step)', backgroundColor: 'var(--q-control-hover)', boxShadow: 'inset 0 3px 0 color-mix(in srgb,var(--q-control-fill),white 20%),inset 0 -3px 0 color-mix(in srgb,var(--q-control-fill),black 18%)'},
    '@media (forced-colors: active)': {borderWidth: 2, borderStyle: 'solid', borderColor: 'ButtonText', backgroundColor: 'Canvas', color: 'CanvasText', filter: 'none', '::before': {display: 'none'}, '::after': {display: 'none'}},
  },
  checked: {'--q-control-fill': 'var(--q-primary)', '--q-control-ink': 'var(--q-primary-foreground)',
    '@media (forced-colors: active)': {forcedColorAdjust: 'none', backgroundColor: 'Highlight', color: 'HighlightText'}},
  disabled: {opacity: 0.45, cursor: 'not-allowed', '@media (forced-colors: active)': {opacity: 1, color: 'GrayText', borderColor: 'GrayText'}},
  dash: {width: 20, height: 4, backgroundColor: 'currentColor'},
  mark: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, color: 'inherit', flexShrink: 0},
})

export function PixelCheckboxIndicator({state, size: _size, isDisabled, children, xstyle, className, style, ...props}: IndicatorProps<'multiSelection'>) {
  const visual = stylex.props(styles.box, state !== 'unchecked' && styles.checked, isDisabled && styles.disabled, xstyle)
  return <span {...props} {...visual} className={[visual.className, className].filter(Boolean).join(' ')} style={{...visual.style, ...style}} aria-hidden="true">
    {children ?? (state === 'indeterminate' ? <span {...stylex.props(styles.dash)}/> : state === 'checked' ? <PixelIcon name="check" width={20} height={20}/> : null)}
  </span>
}

export function PixelRadioIndicator({state, children, ...props}: IndicatorProps<'singleSelection'>) {
  return <PixelCheckboxIndicator {...props} state={state}>{children ?? (state === 'checked' ? <PixelIcon name="diamond" width={20} height={20}/> : null)}</PixelCheckboxIndicator>
}

export function PixelSelectionIndicator({state, size: _size, isDisabled: _disabled, children, xstyle, className, style, ...props}: IndicatorProps<'singleSelection'>) {
  const visual = stylex.props(styles.mark, xstyle)
  return <span {...props} {...visual} className={[visual.className, className].filter(Boolean).join(' ')} style={{...visual.style, ...style}} aria-hidden="true">{children ?? (state === 'checked' ? <PixelIcon name="check"/> : null)}</span>
}

export const questIndicators = {checkbox: PixelCheckboxIndicator, radio: PixelRadioIndicator, check: PixelSelectionIndicator}
