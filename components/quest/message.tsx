"use client"
import type {ComponentProps, ReactNode} from 'react'
import {ChatMessage} from '@astryxdesign/core/Chat'
import {Stack} from '@astryxdesign/core/Stack'
import * as stylex from '@stylexjs/stylex'
import {Avatar, type QuestAvatarProps} from './avatar'
import {conversationStyles} from './conversation.stylex'

export type QuestMessageProps = Omit<ComponentProps<typeof ChatMessage>, 'sender' | 'name' | 'metadata'> & {
  sender?: 'user' | 'assistant' | 'system'
  align?: 'start' | 'end'
  header?: ReactNode
  footer?: ReactNode
}
/** Astryx supplies sender context, article semantics and avatar/body alignment. */
export function Message({sender = 'assistant', align, header, footer, xstyle, ...props}: QuestMessageProps) {
  return <ChatMessage {...props} sender={align ? align === 'end' ? 'user' : 'assistant' : sender}
    name={header} metadata={footer} xstyle={xstyle} />
}
export type QuestMessageAvatarProps = QuestAvatarProps
export function MessageAvatar(props: QuestMessageAvatarProps) { return <Avatar {...props} /> }
export type QuestMessageGroupProps = ComponentProps<typeof Stack>
export function MessageGroup(props: QuestMessageGroupProps) { return <Stack gap={3} {...props} /> }
export type QuestMessageContentProps = ComponentProps<typeof Stack>
export function MessageContent(props: QuestMessageContentProps) { return <Stack gap={2} {...props} /> }
export type QuestMessageHeaderProps = ComponentProps<'div'> & {xstyle?: stylex.StyleXStyles}
export type QuestMessageFooterProps = QuestMessageHeaderProps
export function MessageHeader({xstyle, className, ...props}: QuestMessageHeaderProps) {
  const styled = stylex.props(conversationStyles.row, conversationStyles.title, xstyle)
  return <div {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')} />
}
export function MessageFooter({xstyle, className, ...props}: QuestMessageFooterProps) {
  const styled = stylex.props(conversationStyles.row, conversationStyles.metadata, xstyle)
  return <div {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')} />
}
