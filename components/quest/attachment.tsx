"use client"
import type {ComponentProps, ReactNode} from 'react'
import {Item} from '@astryxdesign/core/Item'
import {FileInput} from '@astryxdesign/core/FileInput'
import {Text} from '@astryxdesign/core/Text'
import {Stack} from '@astryxdesign/core/Stack'
import * as stylex from '@stylexjs/stylex'
import {Button} from './button'
import {conversationStyles as styles} from './conversation.stylex'
import {controlStyles} from './controls.stylex'

export type QuestAttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done'
export type QuestAttachmentProps = Omit<ComponentProps<typeof Item>, 'label' | 'description' | 'startContent' | 'endContent'> & {
  name: string
  size?: number
  mediaType?: string
  src?: string
  alt?: string
  href?: string
  state?: QuestAttachmentState
  progress?: number
  error?: string
  media?: ReactNode
  onRemove?: () => void
  onRetry?: () => void
}

function formatBytes(size: number | undefined): string | undefined {
  if (size === undefined) return undefined
  if (size < 1024) return `${size} B`
  if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1048576).toFixed(1)} MB`
}

function stateText(state: QuestAttachmentState, percent: number | undefined, error: string | undefined): string {
  if (state === 'error') return error ?? 'Upload failed'
  if (state === 'uploading') return `Uploading${percent === undefined ? '' : ` · ${percent}%`}`
  if (state === 'processing') return 'Processing'
  return 'Ready'
}

function AttachmentMedia({media, src, alt}: {
  media: ReactNode | undefined
  src: string | undefined
  alt: string | undefined
}) {
  if (media) return media
  if (src) return <img {...stylex.props(styles.image)} src={src} alt={alt ?? ''} />
  return <Text as="span" aria-hidden="true">FILE</Text>
}

type AttachmentDescriptionProps = {
  name: string
  mediaType: string | undefined
  state: QuestAttachmentState
  error: string | undefined
  bytes: string | undefined
  percent: number | undefined
}

function AttachmentDescription({name, mediaType, state = 'idle', error, bytes, percent}: AttachmentDescriptionProps) {
  return <Stack gap={2}>
    <Text xstyle={styles.metadata}>{[mediaType, bytes].filter(Boolean).join(' · ')}</Text>
    {state !== 'idle' && <Text as="span" role={state === 'error' ? 'alert' : 'status'}
      xstyle={state === 'error' ? styles.error : undefined}>{stateText(state, percent, error)}</Text>}
    {state === 'uploading' && <progress aria-label={`Uploading ${name}`} value={percent} max={100} />}
  </Stack>
}

type AttachmentActionsProps = {
  name: string
  href: string | undefined
  state: QuestAttachmentState
  onRetry: (() => void) | undefined
  onRemove: (() => void) | undefined
  busy: boolean
}

function AttachmentActions({name, href, state = 'idle', onRetry, onRemove, busy}: AttachmentActionsProps) {
  return <Stack direction="horizontal" gap={2}>
    {href && !busy && state !== 'error' && <a {...stylex.props(styles.link)} href={href} download={name}>Download {name}</a>}
    {state === 'error' && onRetry && <Button type="button" size="sm" onClick={onRetry}>Retry {name}</Button>}
    {onRemove && <Button type="button" size="sm" variant="ghost" onClick={onRemove}
      aria-label={`${busy ? 'Cancel upload of' : 'Remove'} ${name}`}>{busy ? 'Cancel' : 'Remove'}</Button>}
  </Stack>
}

/** The upload owner supplies lifecycle state; this component never invents a network upload. */
export function Attachment({name, size, mediaType, src, alt = '', href, state = 'idle', progress, error, media, onRemove, onRetry, xstyle, ...props}: QuestAttachmentProps) {
  const busy = state === 'uploading' || state === 'processing'
  const percent = progress == null || !Number.isFinite(progress) ? undefined : Math.min(100, Math.max(0, progress))
  return <Item {...props} xstyle={[styles.frame, xstyle]} aria-busy={busy || undefined}
    data-quest-attachment-state={state} label={<Text xstyle={styles.title}>{name}</Text>}
    startContent={<AttachmentMedia media={media} src={src} alt={alt}/>}
    description={<AttachmentDescription name={name} mediaType={mediaType} state={state}
      error={error} bytes={formatBytes(size)} percent={percent}/>}
    endContent={<AttachmentActions name={name} href={href} state={state}
      onRetry={onRetry} onRemove={onRemove} busy={busy}/>} />
}

export type QuestAttachmentInputProps = ComponentProps<typeof FileInput>
export function AttachmentInput({xstyle, ...props}: QuestAttachmentInputProps) {
  return <FileInput {...props} xstyle={[controlStyles.field, xstyle]} />
}

export type QuestAttachmentGroupProps = ComponentProps<'div'> & {xstyle?: stylex.StyleXStyles}
export function AttachmentGroup({xstyle, className, ...props}: QuestAttachmentGroupProps) {
  const styled = stylex.props(styles.column, xstyle)
  return <div {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')} />
}
