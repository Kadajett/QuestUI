'use client'

import {BottomSheet, type BottomSheetProps} from '@astryxdesign/core/BottomSheet'
import {pickerStyles} from './picker.styles'
import {overlayStyles} from './overlays-extra.stylex'
import './overlays-extra.css'

export type QuestDrawerProps = BottomSheetProps
export type {BottomSheetHeight as QuestDrawerHeight, BottomSheetSnapPoint as QuestDrawerSnapPoint} from '@astryxdesign/core/BottomSheet'

/** Astryx bottom sheet retains drag/snap, scrim, Escape and finalFocusRef behavior. */
export function Drawer({xstyle, className, ...props}: QuestDrawerProps) {
  return <BottomSheet {...props} className={['quest-overlay-extra', className].filter(Boolean).join(' ')}
    xstyle={[pickerStyles.popover, overlayStyles.drawer, xstyle]} />
}
