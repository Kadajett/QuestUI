"use client"
import {Children, isValidElement, type ComponentProps, type ReactElement, type ReactNode} from 'react'
import {Button as AstryxButton} from '@astryxdesign/core/Button'
import * as stylex from '@stylexjs/stylex'
import {ButtonLoading} from './button-loading'
import {PixelIcon} from './pixel-icon'

export type QuestButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type QuestButtonSize = 'sm' | 'md' | 'lg' | 'icon'
export type QuestButtonProps = Omit<ComponentProps<'button'>, 'size'> & {
  variant?: QuestButtonVariant
  size?: QuestButtonSize
  loading?: boolean
  loadingText?: string
}

const styles = stylex.create({
  frame: {
    '--q-btn-fill': 'var(--q-primary, #c92e35)',
    '--q-btn-ink': 'var(--q-primary-foreground, #ffffff)',
    '--q-btn-edge': 'var(--q-edge, #17243b)',
    '--q-hover-fill': {default: 'var(--q-btn-fill)', ':hover:not(:disabled)': 'color-mix(in srgb, var(--q-btn-fill), var(--q-foreground, #1c2b45) 12%)'},
    position: 'relative', isolation: 'isolate',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, gap: 12, paddingBlock: 12, paddingInline: 24,
    minHeight: 48, height: 'auto', width: 'auto',
    borderWidth: 0, borderRadius: 0, backgroundColor: 'transparent',
    backgroundImage: 'none', color: 'var(--q-btn-ink)',
    fontFamily: 'var(--q-font-display, "Pixelify Sans", monospace)',
    fontSize: 20, fontWeight: 700, lineHeight: 1.2, boxShadow: 'none',
    whiteSpace: 'normal',
    filter: {default: 'drop-shadow(0 4px 0 var(--q-shadow, #a6bbd5))', ':active:not(:disabled)': 'drop-shadow(0 1px 0 var(--q-shadow, #a6bbd5))'},
    transform: {default: 'none', ':active:not(:disabled)': 'translateY(3px)'},
    transitionProperty: 'transform', transitionDuration: '80ms',
    transitionTimingFunction: 'steps(2, end)',
    outline: {default: 'none', ':focus-visible': '3px solid var(--q-ring, #255cbd)'},
    outlineOffset: 5,
    cursor: {default: 'pointer', ':disabled': 'not-allowed'},
    opacity: {default: 1, ':disabled': 0.45, '[aria-busy="true"]': 0.8},
    '::before': {
      content: '""', position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1,
      clipPath: 'polygon(0 8px,4px 8px,4px 4px,8px 4px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 4px,calc(100% - 4px) 4px,calc(100% - 4px) 8px,100% 8px,100% calc(100% - 8px),calc(100% - 4px) calc(100% - 8px),calc(100% - 4px) calc(100% - 4px),calc(100% - 8px) calc(100% - 4px),calc(100% - 8px) 100%,8px 100%,8px calc(100% - 4px),4px calc(100% - 4px),4px calc(100% - 8px),0 calc(100% - 8px))',
      backgroundColor: 'var(--q-btn-edge)',
    },
    '::after': {
      content: '""', position: 'absolute', inset: 3, pointerEvents: 'none', zIndex: -1,
      clipPath: 'polygon(0 8px,4px 8px,4px 4px,8px 4px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 4px,calc(100% - 4px) 4px,calc(100% - 4px) 8px,100% 8px,100% calc(100% - 8px),calc(100% - 4px) calc(100% - 8px),calc(100% - 4px) calc(100% - 4px),calc(100% - 8px) calc(100% - 4px),calc(100% - 8px) 100%,8px 100%,8px calc(100% - 4px),4px calc(100% - 4px),4px calc(100% - 8px),0 calc(100% - 8px))',
      backgroundColor: 'var(--q-hover-fill)',
      boxShadow: 'inset 0 3px 0 color-mix(in srgb,var(--q-btn-fill),white 24%),inset 0 -4px 0 color-mix(in srgb,var(--q-btn-fill),black 25%)',
    },
  },
  secondary: {'--q-btn-fill': 'var(--q-secondary, #255cbd)', '--q-btn-ink': 'var(--q-secondary-foreground, #ffffff)', color: 'var(--q-btn-ink)'},
  danger: {'--q-btn-fill': 'var(--q-destructive, #8e1e30)', '--q-btn-ink': 'var(--q-destructive-foreground, #ffffff)', color: 'var(--q-btn-ink)'},
  outline: {'--q-btn-fill': 'var(--q-card, #fffefa)', '--q-btn-ink': 'var(--q-foreground, #1c2b45)', '--q-btn-edge': 'var(--q-input, #667f9b)', color: 'var(--q-btn-ink)'},
  ghost: {'--q-btn-fill': 'transparent', '--q-btn-ink': 'var(--q-foreground, #1c2b45)', '--q-btn-edge': 'transparent', filter: 'none', '::after': {boxShadow: 'none'}},
  sm: {paddingBlock: 10, paddingInline: 16, minHeight: 44, fontSize: 18},
  lg: {paddingBlock: 16, paddingInline: 32, minHeight: 60, fontSize: 24},
  loading: {color:'transparent', opacity:0.8, cursor:'wait'},
  icon: {padding: 12, width: 48, minWidth: 48, height: 48},
})

function accessibleLabel(label: QuestButtonProps['aria-label'], children: QuestButtonProps['children']): string {
  return label ?? (typeof children === 'string' ? children : '')
}

function isPixelIcon(node: ReactNode): boolean {
  return isValidElement(node) && node.type === PixelIcon
}

/** Splits leading/trailing pixel icons into Astryx's icon slots so they render inline beside the label. */
function splitIcons(children: QuestButtonProps['children'], iconOnly: boolean): {icon?: ReactNode; end?: ReactNode; text?: ReactNode} {
  if (iconOnly) return {icon: children, text: undefined}
  const items = Children.toArray(children)
  if (items.length < 2) return {icon: undefined, text: children}
  const start = isPixelIcon(items[0]) ? items[0] : undefined
  const end = isPixelIcon(items[items.length - 1]) ? items[items.length - 1] : undefined
  const text = items.slice(start !== undefined ? 1 : 0, end !== undefined ? -1 : items.length)
  return {icon: start, end, text: text.length === 1 ? text[0] : text}
}

function nativeAttributes({ref, name, value, form, onClick, rel}: Pick<QuestButtonProps, 'ref' | 'name' | 'value' | 'form' | 'onClick' | 'rel'>) {
  return {
    ...(ref === undefined ? {} : {ref}),
    ...(name === undefined ? {} : {name}),
    ...(value === undefined ? {} : {value}),
    ...(form === undefined ? {} : {form}),
    ...(onClick === undefined ? {} : {onClick}),
    ...(rel === undefined ? {} : {rel}),
  }
}

/** Astryx interaction semantics, with Quest's original stepped pixel frame. */
export function Button({variant = 'primary', size = 'md', loading = false, loadingText = 'Loading…', disabled = false, children, type = 'button', ref, name, value, form, onClick, rel, ...props}: QuestButtonProps): ReactElement {
  const {icon, end, text} = splitIcons(children, size === 'icon')
  const label = accessibleLabel(props['aria-label'], text)
  const button = <AstryxButton {...props} {...nativeAttributes({ref, name, value, form, onClick, rel})} label={label} type={type} variant="ghost"
    size={size === 'icon' ? 'md' : size} isIconOnly={size === 'icon'}
    icon={icon} endContent={end} isDisabled={disabled} isLoading={loading}
    xstyle={[styles.frame, variant !== 'primary' && styles[variant], size !== 'md' && styles[size], loading && styles.loading]}>
    {text}
  </AstryxButton>
  return loading ? <ButtonLoading variant={variant} size={size} text={loadingText}>{button}</ButtonLoading> : button
}
