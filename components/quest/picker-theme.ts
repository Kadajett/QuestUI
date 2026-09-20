import {createElement} from 'react'
import type {ComponentStyleMap} from '@astryxdesign/core/theme'
import * as stylex from '@stylexjs/stylex'
import {PixelIcon} from './pixel-icon'

const frame = {
  position: 'relative', isolation: 'isolate', boxSizing: 'border-box',
  borderWidth: '0px', borderRadius: '0px', backgroundColor: 'transparent',
  boxShadow: 'none', filter: 'drop-shadow(4px 4px 0 var(--q-shadow))',
  color: 'var(--q-popover-foreground)', fontFamily: 'var(--q-font-body)',
  fontSize: '18px', lineHeight: '1.4',
  '::before': {
    content: '""', position: 'absolute', inset: '0px', zIndex: '-1',
    pointerEvents: 'none', clipPath: 'var(--q-step)', backgroundColor: 'var(--q-highlight)',
  },
  '::after': {
    content: '""', position: 'absolute', inset: '3px', zIndex: '-1',
    pointerEvents: 'none', clipPath: 'var(--q-step)', backgroundColor: 'var(--q-popover)',
    boxShadow: 'inset 0 4px 0 var(--q-border)',
  },
}

/** Public Astryx targets only; private calendar slots inherit scoped tokens. */
export const pickerThemeComponents: ComponentStyleMap = {
  popover: {base: frame},
  'calendar-nav': {
    base: {
      width: '48px', height: '48px', minHeight: '48px', padding: '12px',
      borderWidth: '0px', borderRadius: '0px', boxShadow: 'none',
      backgroundColor: 'transparent', color: 'var(--q-foreground)',
      ':hover': {backgroundColor: 'var(--q-accent)', color: 'var(--q-accent-foreground)'},
      ':focus-visible': {outline: '3px solid var(--q-ring)', outlineOffset: '-3px'},
    },
    'disabled:disabled': {opacity: '.45', cursor: 'not-allowed'},
  },
  'calendar-day': {
    base: {
      width: '100%', minWidth: '44px', height: '44px', padding: '4px',
      border: '3px solid transparent', borderRadius: '0px', boxShadow: 'none',
      backgroundColor: 'transparent', backgroundImage: 'none',
      color: 'var(--q-foreground)', fontFamily: 'var(--q-font-body)',
      fontSize: '20px', lineHeight: '1.2', transition: 'none',
      ':hover': {backgroundColor: 'var(--q-accent)', color: 'var(--q-accent-foreground)', outline: '2px solid var(--q-ring)', outlineOffset: '-2px'},
      ':focus-visible': {outline: '3px solid var(--q-ring)', outlineOffset: '-3px'},
    },
    'in-range:in-range': {backgroundColor: 'var(--q-accent)', color: 'var(--q-accent-foreground)'},
    'today:today': {
      backgroundColor: 'var(--q-accent)', color: 'var(--q-accent-foreground)', boxShadow: 'none',
      '::after': {content: '""', position: 'absolute', bottom: '3px', width: '12px', height: '3px', backgroundColor: 'currentColor'},
    },
    'selected:selected': {
      backgroundColor: 'var(--q-primary)', color: 'var(--q-primary-foreground)',
      borderColor: 'var(--q-edge)', boxShadow: 'inset 0 -3px 0 color-mix(in srgb,var(--q-primary),black 25%)',
    },
    'disabled:disabled': {opacity: '.45', cursor: 'not-allowed'},
  },
  'selector-popup': {
    base: {
      ...frame, padding: '8px', minWidth: '240px',
      '--color-text-primary': 'var(--q-popover-foreground)',
      '--color-text-secondary': 'var(--q-muted-foreground)',
      '--color-overlay-hover': 'var(--q-accent)',
      '--color-accent': 'var(--q-ring)',
      '--text-label-size': '18px', '--font-family-body': 'var(--q-font-body)',
      '--radius-element': '0px', '--radius-container': '0px',
      '--focus-outline-width': '3px', '--focus-outline-color': 'var(--q-ring)',
    },
  },
  'selector-search': {
    base: {
      boxSizing: 'border-box', minHeight: '44px', padding: '8px',
      border: '2px solid transparent', borderRadius: '0px',
      color: 'var(--q-popover-foreground)', fontFamily: 'var(--q-font-body)',
      fontSize: '18px', lineHeight: '1.4', backgroundColor: 'transparent',
      ':focus-visible': {borderColor: 'var(--q-ring)'},
      '::placeholder': {color: 'var(--q-muted-foreground)', opacity: '1'},
    },
  },
  'selector-option-row': {
    base: {
      minHeight: '44px', padding: '8px', border: '2px solid transparent',
      borderRadius: '0px', fontFamily: 'var(--q-font-body)', fontSize: '18px',
      color: 'var(--q-popover-foreground)',
      ':hover': {borderColor: 'var(--q-ring)', backgroundColor: 'var(--q-accent)', color: 'var(--q-accent-foreground)'},
      ':focus-visible': {outline: '3px solid var(--q-ring)', outlineOffset: '-3px'},
    },
    'selected:selected': {fontWeight: '700'},
    'disabled:disabled': {opacity: '.45', cursor: 'not-allowed'},
  },
  'selector-section-heading': {
    base: {padding: '8px', color: 'var(--q-muted-foreground)', fontFamily: 'var(--q-font-display)', fontSize: '14px', fontWeight: '700'},
  },
  'selector-empty-state': {
    base: {padding: '24px 12px', color: 'var(--q-muted-foreground)', fontFamily: 'var(--q-font-body)', fontSize: '18px', textAlign: 'center'},
  },
  'selector-indicator-icon': {base: {width: '16px', height: '16px', color: 'var(--q-foreground)', transition: 'none'}},
}

const iconStyles = stylex.create({
  left: {transform: 'rotate(180deg)'},
  down: {transform: 'rotate(90deg)'},
})

export const pickerThemeIcons = {
  chevronLeft: createElement(PixelIcon, {name: 'arrow', ...stylex.props(iconStyles.left)}),
  chevronRight: createElement(PixelIcon, {name: 'arrow'}),
  chevronDown: createElement(PixelIcon, {name: 'arrow', ...stylex.props(iconStyles.down)}),
}
