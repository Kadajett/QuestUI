export type AvatarCategoryId = 'hair' | 'eyes' | 'face' | 'skinColor' | 'clothing' | 'background'

export type AvatarSelection = Readonly<Record<AvatarCategoryId, string>>

export interface AvatarOption {
  readonly id: string
  readonly label: string
}

export const avatarCategories: readonly AvatarCategoryId[] = Object.freeze([
  'hair', 'eyes', 'face', 'skinColor', 'clothing', 'background',
])
