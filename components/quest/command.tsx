'use client'

import {
  CommandPalette, CommandPaletteInput, CommandPaletteFooter,
  type CommandPaletteProps, type CommandPaletteInputProps, type CommandPaletteFooterProps,
} from '@astryxdesign/core/CommandPalette'
import type {SearchableItem} from '@astryxdesign/core/Typeahead'
import {pickerStyles} from './picker.styles'
import {overlayStyles} from './overlays-extra.stylex'
import './overlays-extra.css'

export type QuestCommandProps<T extends SearchableItem = SearchableItem> = CommandPaletteProps<T>
export type QuestCommandInputProps = CommandPaletteInputProps
export type QuestCommandFooterProps = CommandPaletteFooterProps
export {createStaticSource} from '@astryxdesign/core/Typeahead'
export type {SearchableItem, SearchSource} from '@astryxdesign/core/Typeahead'

/** SearchSource-driven palette. Native input/footer slots preserve filtering, grouping and keyboard activation. */
export function Command<T extends SearchableItem = SearchableItem>({xstyle, className, ...props}: QuestCommandProps<T>) {
  return <CommandPalette {...props} className={['quest-overlay-extra', className].filter(Boolean).join(' ')}
    xstyle={[pickerStyles.popover, overlayStyles.modal, xstyle]} />
}

export function CommandInput({xstyle, ...props}: QuestCommandInputProps) {
  return <CommandPaletteInput {...props} xstyle={[overlayStyles.text, xstyle]} />
}

export function CommandFooter({xstyle, ...props}: QuestCommandFooterProps) {
  return <CommandPaletteFooter {...props} xstyle={[overlayStyles.text, xstyle]} />
}
