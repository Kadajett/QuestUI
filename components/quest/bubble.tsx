"use client"
import {useId, useState, type ComponentProps, type ReactNode} from 'react'
import {ChatMessageBubble} from '@astryxdesign/core/Chat'
import {Stack} from '@astryxdesign/core/Stack'
import * as stylex from '@stylexjs/stylex'
import {Button} from './button'
import {conversationStyles} from './conversation.stylex'

export type QuestBubbleVariant = 'default' | 'secondary' | 'muted' | 'tinted' | 'outline' | 'ghost' | 'destructive'
export type QuestBubbleReaction = {id: string; label: string; count: number; selected?: boolean}
export type QuestBubbleProps = Omit<ComponentProps<typeof ChatMessageBubble>, 'variant'> & {
  variant?: QuestBubbleVariant
  align?: 'start' | 'end'
  reactions?: readonly QuestBubbleReaction[]
  onReactionChange?: (id: string, selected: boolean) => void
  collapsedContent?: ReactNode
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}
const styles = stylex.create({
  root: {maxWidth: '80%', width: 'fit-content'},
  start: {alignSelf: 'flex-start', marginInlineEnd: 'auto'},
  end: {alignSelf: 'flex-end', marginInlineStart: 'auto'},
  default: {backgroundColor: {default: 'var(--q-primary)', '@media (forced-colors: active)': 'Canvas'}, color: {default: 'var(--q-primary-foreground)', '@media (forced-colors: active)': 'CanvasText'}},
  secondary: {backgroundColor: {default: 'var(--q-card)', '@media (forced-colors: active)': 'Canvas'}},
  muted: {backgroundColor: {default: 'var(--q-muted)', '@media (forced-colors: active)': 'Canvas'}},
  tinted: {backgroundColor: {default: 'color-mix(in srgb, var(--q-primary) 15%, var(--q-card))', '@media (forced-colors: active)': 'Canvas'}},
  outline: {backgroundColor: 'transparent'},
  ghost: {backgroundColor: 'transparent', borderWidth: 0, boxShadow: 'none', maxWidth: '100%', width: '100%'},
  destructive: {backgroundColor: {default: 'var(--q-destructive)', '@media (forced-colors: active)': 'Canvas'}, color: {default: 'var(--q-destructive-foreground)', '@media (forced-colors: active)': 'CanvasText'}},
})

type CollapsibleContentProps = {
  id: string
  open: boolean
  collapsedContent: ReactNode | undefined
  children: ReactNode
  onToggle: () => void
}

function CollapsibleContent({id, open, collapsedContent, children, onToggle}: CollapsibleContentProps) {
  return <Stack gap={2}>
    <Stack id={id}>{collapsedContent === undefined || open ? children : collapsedContent}</Stack>
    {collapsedContent !== undefined && <Button type="button" size="sm" variant="outline"
      aria-controls={id} aria-expanded={open} onClick={onToggle}>
      {open ? 'Show less' : 'Show more'}
    </Button>}
  </Stack>
}

function Reactions({items, onChange}: {
  items: readonly QuestBubbleReaction[] | undefined
  onChange: QuestBubbleProps['onReactionChange']
}) {
  if (!items?.length) return null
  return <Stack direction="horizontal" gap={2} role="group" aria-label="Reactions">
    {items.map(reaction => <Button key={reaction.id} type="button" size="sm" variant="outline"
      disabled={!onChange} aria-label={reaction.label} aria-pressed={reaction.selected ?? false}
      onClick={() => onChange?.(reaction.id, !reaction.selected)}>{reaction.label} {reaction.count}</Button>)}
  </Stack>
}

export function Bubble({variant = 'default', align, reactions, onReactionChange, collapsedContent, expanded, defaultExpanded = false, onExpandedChange, children, xstyle, ...props}: QuestBubbleProps) {
  const [internalExpanded, setExpanded] = useState(defaultExpanded)
  const open = expanded ?? internalExpanded
  const id = useId()
  const toggleExpanded = () => {
    const next = !open
    setExpanded(next)
    onExpandedChange?.(next)
  }
  return <ChatMessageBubble {...props} variant={variant === 'ghost' ? 'ghost' : 'filled'}
    xstyle={[conversationStyles.frame, styles.root, styles[variant],
      align === 'start' && styles.start, align === 'end' && styles.end, xstyle]}
    data-quest-bubble-variant={variant}>
    <CollapsibleContent id={id} open={open} collapsedContent={collapsedContent}
      onToggle={toggleExpanded}>{children}</CollapsibleContent>
    <Reactions items={reactions} onChange={onReactionChange}/>
  </ChatMessageBubble>
}

export type QuestBubbleGroupProps = ComponentProps<typeof Stack>
export function BubbleGroup({xstyle, ...props}: QuestBubbleGroupProps) {
  return <Stack gap={2} {...props} xstyle={xstyle} />
}
