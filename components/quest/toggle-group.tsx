'use client'

import type {KeyboardEvent} from 'react'
import {ToggleButtonGroup, type ToggleButtonGroupProps} from '@astryxdesign/core/ToggleButton'
import {Stack} from '@astryxdesign/core/Stack'
import {Toggle, type QuestToggleProps} from './toggle'

export type QuestToggleGroupProps = ToggleButtonGroupProps
export type QuestToggleGroupItemProps = QuestToggleProps & {value: string}

type Movement = 'first' | 'last' | 'previous' | 'next'

function movementFor(key: string, orientation: QuestToggleGroupProps['orientation']): Movement | undefined {
  if (key === 'Home') return 'first'
  if (key === 'End') return 'last'
  if (key === (orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft')) return 'previous'
  if (key === (orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight')) return 'next'
  return undefined
}

function targetIndex(movement: Movement, current: number, count: number): number {
  if (movement === 'first') return 0
  if (movement === 'last') return count - 1
  const delta = movement === 'previous' ? -1 : 1
  return (current + delta + count) % count
}

function moveFocus(event: KeyboardEvent<HTMLElement>, orientation: QuestToggleGroupProps['orientation']): void {
  const modified = event.altKey || event.ctrlKey || event.metaKey
  if (modified) return
  const movement = movementFor(event.key, orientation)
  if (!movement) return
  const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button[aria-pressed]:not(:disabled):not([data-quest-disabled="true"])')]
  const current = buttons.indexOf(event.target as HTMLButtonElement)
  if (current < 0) return
  event.preventDefault()
  buttons[targetIndex(movement, current, buttons.length)]?.focus()
}

/**
 * Astryx's group context overrides per-item isDisabled (ToggleButton.tsx uses
 * `group?.isDisabled ?? isDisabledProp`), so Quest applies the item's disabled
 * state itself: aria-disabled keeps the row focusable per the library's
 * focusable-disabled pattern, selection is suppressed, and the group's roving
 * handler skips it.
 */
export function ToggleGroup(props: QuestToggleGroupProps) {
  return <Stack onKeyDown={event => moveFocus(event, props.orientation)}>
    <ToggleButtonGroup {...props} />
  </Stack>
}

export function ToggleGroupItem({isDisabled, onPressedChange, ...props}: QuestToggleGroupItemProps) {
  // The group context overrides per-item isDisabled before Button renders, so
  // mark the row ourselves; data-quest-disabled survives the rest spread where
  // aria-disabled is recomputed by Button. Selection stays suppressed.
  const handler = isDisabled || !onPressedChange ? {} : {onPressedChange}
  return <Toggle {...props} {...handler} data-quest-disabled={isDisabled ? 'true' : undefined} />
}
