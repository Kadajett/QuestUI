'use client'

import {useCallback} from 'react'
import {
  Toast as AstryxToast, ToastViewport as AstryxToastViewport, useToast as useAstryxToast,
  type ToastProps, type ToastOptions, type ToastViewportProps, type ToastDismissFn,
  type ToastContentRenderProps,
} from '@astryxdesign/core/Toast'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {Button} from './button'
import './toast.css'

export type QuestToastProps = Omit<ToastProps, 'renderContent'> & {dismissLabel?: string}
export type QuestToastOptions = Omit<ToastOptions, 'renderContent'> & {dismissLabel?: string}
export type QuestToastViewportProps = ToastViewportProps
export type QuestShowToastFn = (options: QuestToastOptions) => ToastDismissFn
export type {ToastType, ToastPosition, ToastCollisionBehavior, ToastDismissReason, ToastDismissFn} from '@astryxdesign/core/Toast'

function ToastContent({body, endContent, dismiss, dismissLabel}: ToastContentRenderProps & {dismissLabel: string}) {
  return <Stack data-quest-toast="" gap={3}>
    <Text as="p" className="quest-toast-message">{body}</Text>
    <Stack direction="horizontal" gap={3} wrap="wrap" hAlign="end">
      {endContent}
      <Button variant="outline" size="sm" onClick={dismiss}>{dismissLabel}</Button>
    </Stack>
  </Stack>
}

/**
 * Direct, consumer-owned lifetime: mount to show; unmount in onDismiss(reason).
 * Astryx owns status/alert semantics, swipe and auto-hide (paused on hover/focus).
 * Supply endContent for actions; dismissLabel localizes the dismiss button.
 */
export function Toast({dismissLabel = 'Dismiss notification', ...props}: QuestToastProps) {
  return <AstryxToast {...props} renderContent={content => <ToastContent {...content} dismissLabel={dismissLabel}/>}/>
}

/**
 * Wrap your app once, inside Theme. This is Astryx's provider AND viewport;
 * do not add a second provider. F6 focuses the newest notification's controls.
 * position, maxVisible, inset and isTopLayer retain their native contracts.
 */
export function ToastViewport(props: QuestToastViewportProps) {
  return <AstryxToastViewport {...props}/>
}

/**
 * Call within ToastViewport. Returns show(options) -> dismiss(). Astryx retains
 * uniqueID/collisionBehavior, onHide(reason), timer and focus-return behavior.
 * Info auto-hides after 5000ms by default; error persists unless isAutoHide.
 */
export function useToast(): QuestShowToastFn {
  const showToast = useAstryxToast()
  return useCallback(({dismissLabel = 'Dismiss notification', ...options}: QuestToastOptions) => showToast({
    ...options,
    renderContent: content => <ToastContent {...content} dismissLabel={dismissLabel}/>,
  }), [showToast])
}
