/** Quest pixel overrides for Astryx internal control targets; merge into defineTheme({components}). */
export const questControlTargets = {
  'switch': {
    base: {
      borderRadius: '0',
      backgroundColor: 'var(--q-muted)',
      boxShadow: 'inset 0 3px 0 color-mix(in srgb, var(--q-card), white 0%), inset 0 0 0 3px var(--q-edge), inset 0 -3px 0 color-mix(in srgb, var(--q-muted), black 18%)',
      ':checked': {backgroundColor: 'var(--q-primary)'},
      ':focus-visible': {outline: '3px solid var(--q-ring)', outlineOffset: '4px'},
    },
    checked: {backgroundColor: 'var(--q-primary)'},
    disabled: {opacity: '0.45'},
  },
  'switch-thumb': {
    base: {
      borderRadius: '0',
      clipPath: 'var(--q-step)',
      backgroundColor: 'var(--q-foreground)',
      boxShadow: 'inset 0 -4px 0 var(--q-edge)',
      '@media (forced-colors: active)': {backgroundColor: 'ButtonText', boxShadow: 'none', clipPath: 'none'},
    },
    checked: {backgroundColor: 'var(--q-primary-foreground)', '@media (forced-colors: active)': {backgroundColor: 'HighlightText'}},
  },
  'slider': {base: {}},
  'slider-track': {
    base: {
      borderRadius: '0',
      backgroundColor: 'var(--q-muted)',
      boxShadow: 'inset 0 0 0 3px var(--q-edge)',
      ':focus-visible': {outline: 'none'},
      '@media (forced-colors: active)': {backgroundColor: 'Canvas', boxShadow: 'inset 0 0 0 2px ButtonText'},
    },
  },
  'slider-thumb': {
    base: {
      borderRadius: '0',
      clipPath: 'var(--q-step)',
      backgroundColor: 'var(--q-primary)',
      filter: 'drop-shadow(0 3px 0 var(--q-shadow))',
      cursor: 'grab',
      ':active': {cursor: 'grabbing'},
      ':focus-visible': {outline: '3px solid var(--q-ring)', outlineOffset: '4px'},
      '@media (forced-colors: active)': {borderRadius: '0', clipPath: 'none', backgroundColor: 'Highlight', filter: 'none'},
    },
  },
  'selector': {
    base: {
      paddingBlock: '10px',
      paddingInline: '16px',
      borderRadius: '0',
      borderWidth: '0',
      backgroundColor: 'transparent',
      filter: 'drop-shadow(0 3px 0 var(--q-shadow))',
      fontFamily: 'var(--q-font-display)',
      fontSize: '20px',
      lineHeight: '1.3',
      '@media (forced-colors: active)': {filter: 'none', border: '2px solid ButtonText', backgroundColor: 'Canvas'},
    },
    'size:sm': {paddingBlock: '8px', paddingInline: '12px', fontSize: '18px'},
  },
  'selector-popup': {
    base: {
      borderRadius: '0',
      borderWidth: '3px',
      borderStyle: 'solid',
      borderColor: 'var(--q-edge)',
      backgroundColor: 'var(--q-popover)',
      color: 'var(--q-popover-foreground)',
      fontFamily: 'var(--q-font-body)',
      fontSize: '22px',
      padding: '6px',
      '@media (forced-colors: active)': {border: '2px solid ButtonText', backgroundColor: 'Canvas', color: 'CanvasText', boxShadow: 'none'},
    },
  },
  'selector-option-row': {
    base: {
      minHeight: '44px',
      paddingBlock: '8px',
      paddingInline: '12px',
      borderRadius: '0',
      clipPath: 'var(--q-step)',
      cursor: 'default',
      ':hover': {backgroundColor: 'color-mix(in srgb, var(--q-card), var(--q-foreground) 10%)'},
      '@media (forced-colors: active)': {clipPath: 'none'},
    },
    selected: {
      backgroundColor: 'var(--q-accent)',
      color: 'var(--q-accent-foreground)',
      boxShadow: 'inset 0 0 0 2px var(--q-ring)',
      '@media (forced-colors: active)': {forcedColorAdjust: 'none', backgroundColor: 'Highlight', color: 'HighlightText'},
    },
    disabled: {opacity: '0.45', pointerEvents: 'none'},
  },
  'selector-section-heading': {
    base: {fontFamily: 'var(--q-font-display)', fontSize: '20px', fontVariant: 'small-caps', fontWeight: '700', color: 'var(--q-muted-foreground)', paddingBlock: '8px', paddingInline: '12px'},
  },
  'selector-indicator-icon': {
    base: {width: '16px', height: '16px'},
    expanded: {transform: 'rotate(180deg)'},
  },
  'checkbox-indicator': {
    base: {},
    checked: {}, indeterminate: {}, disabled: {},
  },
  'radio-indicator': {base: {}, checked: {}, disabled: {}},
} as const
