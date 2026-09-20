'use client'

import {Dialog as AstryxDialog, type DialogProps} from '@astryxdesign/core/Dialog'
import {pickerStyles} from './picker.styles'
import {overlayStyles} from './overlays-extra.stylex'
import './overlays-extra.css'

export type QuestSheetProps = Omit<DialogProps, 'variant' | 'position'> & {
  /** Logical side; start/end follow the reading direction. */
  side?: 'start' | 'end'
}

/** Native modal side panel; retains Dialog purpose, Escape handling and opener focus restoration. */
export function Sheet({side = 'end', width = 400, maxHeight = '100dvh', xstyle, className, ...props}: QuestSheetProps) {
  return <AstryxDialog {...props} width={width} maxHeight={maxHeight} position={{top: 0, bottom: 0, [side]: 0}}
    className={['quest-overlay-extra', className].filter(Boolean).join(' ')}
    xstyle={[pickerStyles.popover, overlayStyles.modal, overlayStyles.sheet, overlayStyles[side], xstyle]} />
}
