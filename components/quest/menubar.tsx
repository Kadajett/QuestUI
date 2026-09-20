'use client'

import type {KeyboardEvent, ReactNode} from 'react'
import {Toolbar, type ToolbarProps} from '@astryxdesign/core/Toolbar'
import {
  DropdownMenuItem, DropdownMenuDivider, DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSubMenu,
  type DropdownMenuProps,
} from '@astryxdesign/core/DropdownMenu'
import {DropdownMenu} from './dropdown-menu'
import {pickerStyles} from './picker.styles'
import {overlayStyles} from './overlays-extra.stylex'
import './overlays-extra.css'

export type QuestMenubarProps = Omit<ToolbarProps, 'startContent'> & {children: ReactNode}
export type QuestMenubarMenuProps = DropdownMenuProps
export type {
  DropdownMenuItemProps as QuestMenubarItemProps,
  DropdownMenuDividerProps as QuestMenubarSeparatorProps,
  DropdownMenuCheckboxItemProps as QuestMenubarCheckboxItemProps,
  DropdownMenuRadioGroupProps as QuestMenubarRadioGroupProps,
  DropdownMenuRadioItemProps as QuestMenubarRadioItemProps,
  DropdownMenuSubMenuProps as QuestMenubarSubMenuProps,
} from '@astryxdesign/core/DropdownMenu'
export {
  DropdownMenuItem as MenubarItem, DropdownMenuDivider as MenubarSeparator,
  DropdownMenuCheckboxItem as MenubarCheckboxItem, DropdownMenuRadioGroup as MenubarRadioGroup,
  DropdownMenuRadioItem as MenubarRadioItem, DropdownMenuSubMenu as MenubarSubMenu,
}

/** Native toolbar of menu buttons: arrows rove triggers; Enter/Down opens a menu; Escape returns focus. */
export function Menubar({children, xstyle, className, onKeyDown, ...props}: QuestMenubarProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    const target = event.target as HTMLElement
    if (target.closest('[role="menu"]')) return
    const triggers = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button[aria-haspopup="menu"]')]
      .filter(trigger => !trigger.closest('[role="menu"]'))
    const current = triggers.indexOf(document.activeElement as HTMLButtonElement)
    if (current < 0 || triggers.length < 2) return
    event.preventDefault()
    const direction = getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1
    const delta = event.key === 'ArrowRight' ? direction : -direction
    triggers[(current + delta + triggers.length) % triggers.length]?.focus()
  }
  return <Toolbar {...props} startContent={children} onKeyDown={handleKeyDown}
    className={['quest-overlay-extra', className].filter(Boolean).join(' ')}
    xstyle={[pickerStyles.popover, overlayStyles.toolbar, xstyle]} />
}

/** Supports both native item data and real compound menu children, including nested/checked items. */
export function MenubarMenu({button, hasChevron = false, ...props}: QuestMenubarMenuProps) {
  const styledButton = button
    ? {button: {...button, variant: button.variant ?? 'ghost', xstyle: [overlayStyles.text, button.xstyle]}}
    : {}
  return <DropdownMenu {...props} {...styledButton} hasChevron={hasChevron} />
}
