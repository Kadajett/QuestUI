"use client"
import {useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode} from 'react'
import {ChatMessageList} from '@astryxdesign/core/Chat'
import * as stylex from '@stylexjs/stylex'
import {Button} from './button'
import {conversationStyles} from './conversation.stylex'

export type QuestMessageScrollerItem = {id: string; content: ReactNode}
export type QuestMessageScrollerProps = Omit<ComponentProps<'div'>, 'children'> & {
  items: readonly QuestMessageScrollerItem[]
  label?: string
  height?: number | string
  nearBottomThreshold?: number
  initialPosition?: 'start' | 'end'
  scrollToId?: string
  isStreaming?: boolean
  xstyle?: stylex.StyleXStyles
}
const styles = stylex.create({
  root: {position: 'relative', minHeight: 0, minWidth: 0},
  viewport: {overflowY: 'auto', overflowAnchor: 'none', overscrollBehavior: 'contain', height: '100%', outlineOffset: 3},
  content: {flex: 'none'},
  jump: {position: 'absolute', bottom: 12, insetInlineEnd: 12},
})
type Anchor = {id: string; offset: number}

/** Tracks visible message identity rather than total height: appending and prepending can coexist. */
export function MessageScroller({items, label = 'Conversation', height = 360, nearBottomThreshold = 48, initialPosition = 'end', scrollToId, isStreaming = false, xstyle, className, style, ...props}: QuestMessageScrollerProps) {
  const viewport = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const following = useRef(initialPosition === 'end')
  const anchor = useRef<Anchor | null>(null)
  const initialized = useRef(false)
  const lastTarget = useRef<string | undefined>(undefined)
  const [atBottom, setAtBottom] = useState(initialPosition === 'end')
  const rows = () => content.current?.querySelectorAll<HTMLElement>('[data-quest-message-id]') ?? []
  const recordAnchor = () => {
    const view = viewport.current
    if (!view) return
    const top = view.getBoundingClientRect().top
    const row = Array.from(rows()).find(item => item.getBoundingClientRect().bottom > top)
    const rowID = row?.dataset['questMessageId']
    anchor.current = row && rowID ? {id: rowID, offset: row.getBoundingClientRect().top - top} : null
  }
  const reconcile = () => {
    const view = viewport.current
    if (!view) return
    if (following.current) view.scrollTop = view.scrollHeight
    else if (anchor.current) {
      const saved = anchor.current
      const row = Array.from(rows()).find(item => item.dataset['questMessageId'] === saved.id)
      if (row) view.scrollTop += row.getBoundingClientRect().top - view.getBoundingClientRect().top - saved.offset
    }
    setAtBottom(view.scrollHeight - view.clientHeight - view.scrollTop <= Math.max(0, nearBottomThreshold))
    recordAnchor()
  }
  useLayoutEffect(() => {
    const view = viewport.current
    if (!view) return
    if (scrollToId && lastTarget.current !== scrollToId) {
      const row = Array.from(rows()).find(item => item.dataset['questMessageId'] === scrollToId)
      if (row) {
        following.current = false
        view.scrollTop += row.getBoundingClientRect().top - view.getBoundingClientRect().top
        lastTarget.current = scrollToId
        recordAnchor()
      }
    } else if (!scrollToId) lastTarget.current = undefined
    if (!initialized.current) {
      initialized.current = true
      if (!following.current) recordAnchor()
    }
    reconcile()
  })
  useLayoutEffect(() => {
    if (!content.current || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(reconcile)
    observer.observe(content.current)
    return () => observer.disconnect()
  }, [nearBottomThreshold])
  const styled = stylex.props(conversationStyles.frame, styles.root, xstyle)
  return <div {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')} style={{...styled.style, height, ...style}}>
    <div ref={viewport} {...stylex.props(styles.viewport)} tabIndex={0} role="region" aria-label={`${label} scroll area`}
      onScroll={event => {
        const view = event.currentTarget
        following.current = view.scrollHeight - view.clientHeight - view.scrollTop <= Math.max(0, nearBottomThreshold)
        setAtBottom(following.current)
        recordAnchor()
      }}>
      <div ref={content}>
        <ChatMessageList aria-label={label} aria-relevant="additions" isStreaming={isStreaming} align="top" xstyle={styles.content}>
          {items.map(item => <div key={item.id} data-quest-message-id={item.id}>{item.content}</div>)}
        </ChatMessageList>
      </div>
    </div>
    {!atBottom && <div {...stylex.props(styles.jump)}><Button type="button" size="sm" onClick={() => {
      following.current = true
      reconcile()
      viewport.current?.focus({preventScroll: true})
    }}>Jump to latest</Button></div>}
  </div>
}
