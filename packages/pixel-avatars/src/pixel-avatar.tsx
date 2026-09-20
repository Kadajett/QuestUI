import {memo, useMemo, type ReactElement} from 'react'
import * as stylex from '@stylexjs/stylex'
import {renderAvatarSvg} from './render.ts'
import type {AvatarSelection} from './types.ts'

export interface PixelAvatarProps {
  readonly selection: AvatarSelection
  readonly size?: number
  readonly label?: string
}
const styles = stylex.create({image: {imageRendering: 'pixelated', display: 'block', maxWidth: '100%', height: 'auto', aspectRatio: '1 / 1'}})
export const PixelAvatar = memo(function PixelAvatar({selection, size = 96, label = 'Pixel adventurer'}: PixelAvatarProps): ReactElement {
  const {hair, eyes, face, skinColor, clothing, background} = selection
  const src = useMemo(() => `data:image/svg+xml,${encodeURIComponent(renderAvatarSvg({hair, eyes, face, skinColor, clothing, background}))}`, [hair, eyes, face, skinColor, clothing, background])
  return <img {...stylex.props(styles.image)} src={src} width={size} height={size} alt={label}/>
})
