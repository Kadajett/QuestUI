"use client"
import {useId, type ComponentProps, type ReactNode} from 'react'
import {Text} from '@astryxdesign/core/Text'
import * as stylex from '@stylexjs/stylex'
import {conversationStyles} from './conversation.stylex'

export type QuestMarkerProps = ComponentProps<'div'> & {
  variant?: 'default' | 'border' | 'separator'
  icon?: ReactNode
  xstyle?: stylex.StyleXStyles
}
const styles = stylex.create({
  root: {display: 'flex', alignItems: 'center', gap: 12, paddingBlock: 8, width: '100%'},
  border: {borderBottomWidth: 2, borderBottomStyle: 'solid', borderBottomColor: {default: 'var(--q-edge)', '@media (forced-colors: active)': 'CanvasText'}},
  line: {flex: 1, borderTopWidth: 2, borderTopStyle: 'solid', borderTopColor: {default: 'var(--q-edge)', '@media (forced-colors: active)': 'CanvasText'}},
})
function SeparatorLine() {
  return <span {...stylex.props(styles.line)} aria-hidden="true" />
}

function MarkerIcon({icon}: {icon: ReactNode}) {
  return <span aria-hidden="true">{icon}</span>
}

function MarkerContents({separator, icon, labelId, children}: {
  separator: boolean
  icon: ReactNode | undefined
  labelId: string
  children: ReactNode
}) {
  return <>
    {separator && <SeparatorLine/>}
    {icon && <MarkerIcon icon={icon}/>}
    <Text id={labelId}>{children}</Text>
    {separator && <SeparatorLine/>}
  </>
}

export function Marker({variant = 'default', icon, children, role, xstyle, className, ...props}: QuestMarkerProps) {
  const labelId = useId()
  const separator = variant === 'separator'
  const resolvedRole = role ?? (separator ? 'separator' : undefined)
  const orientation = separator && resolvedRole === 'separator' ? 'horizontal' : undefined
  const styled = stylex.props(styles.root, conversationStyles.metadata,
    variant === 'border' && styles.border, xstyle)
  return <div role={resolvedRole} aria-labelledby={separator ? labelId : undefined}
    aria-orientation={orientation} {...props} {...styled}
    className={[styled.className, className].filter(Boolean).join(' ')}>
    <MarkerContents separator={separator} icon={icon} labelId={labelId}>{children}</MarkerContents>
  </div>
}
