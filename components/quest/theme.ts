import {defineTheme} from '@astryxdesign/core/theme'
import {neutralTheme} from '@astryxdesign/theme-neutral'
import {createElement} from 'react'
import {PixelIcon} from './pixel-icon'
import {pickerThemeComponents, pickerThemeIcons} from './picker-theme'
import {questControlTargets} from './control-theme'
import {questIndicators} from './control-indicators'
export const questTheme = defineTheme({
  name: 'questui',
  extends: neutralTheme,
  color: {accent: ['#c92e35', '#ee665e'], neutralStyle: 'cool'},
  typography: {
    scale: {base: 20, ratio: 1.15},
    body: {family: 'VT323', fallbacks: 'ui-monospace, monospace'},
    heading: {family: 'Pixelify Sans', fallbacks: 'ui-monospace, monospace'},
  },
  radius: {base: 0, multiplier: 0},
  localTokens: {
    '--q-font-display': '"Pixelify Sans", ui-monospace, monospace',
    '--q-font-body': '"VT323", ui-monospace, monospace',
    '--q-step': 'polygon(0 8px,4px 8px,4px 4px,8px 4px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 4px,calc(100% - 4px) 4px,calc(100% - 4px) 8px,100% 8px,100% calc(100% - 8px),calc(100% - 4px) calc(100% - 8px),calc(100% - 4px) calc(100% - 4px),calc(100% - 8px) calc(100% - 4px),calc(100% - 8px) 100%,8px 100%,8px calc(100% - 4px),4px calc(100% - 4px),4px calc(100% - 8px),0 calc(100% - 8px))',
    '--q-background': ['#e7f1fc', '#111820'],
    '--q-foreground': ['#1c2b45', '#edf0e9'],
    '--q-card': ['#fffefa', '#1b2735'],
    '--q-card-foreground': ['#1c2b45', '#edf0e9'],
    '--q-popover': ['#ffffff', '#263343'],
    '--q-popover-foreground': ['#1c2b45', '#edf0e9'],
    '--q-primary': ['#c92e35', '#ee665e'],
    '--q-primary-foreground': ['#ffffff', '#281013'],
    '--q-secondary': ['#255cbd', '#a8bed3'],
    '--q-secondary-foreground': ['#ffffff', '#151c29'],
    '--q-muted': ['#d4e2f2', '#2c3949'],
    '--q-muted-foreground': ['#485d76', '#aebbcd'],
    '--q-accent': ['#f6dcd9', '#3d272a'],
    '--q-accent-foreground': ['#8e1e30', '#f4dddd'],
    '--q-destructive': ['#8e1e30', '#f28d84'],
    '--q-destructive-foreground': ['#ffffff', '#301719'],
    '--q-border': ['#97abc1', '#4b5a6d'],
    '--q-input': ['#667f9b', '#7e90a7'],
    '--q-ring': ['#255cbd', '#edf0e9'],
    '--q-edge': ['#17243b', '#070c12'],
    '--q-shadow': ['#a6bbd5', '#070c12'],
    '--q-highlight': ['#4b6280', '#7b8899'],
  },
  tokens: {
    '--color-background-body': ['#e7f1fc', '#111820'],
    '--color-background-surface': ['#fffefa', '#1b2735'],
    '--color-background-card': ['#fffefa', '#1b2735'],
    '--color-text-primary': ['#1c2b45', '#edf0e9'],
    '--color-text-secondary': ['#485d76', '#aebbcd'],
    '--color-border': ['#97abc1', '#4b5a6d'],
    '--size-element-sm': '44px',
    '--size-element-md': '48px',
    '--size-element-lg': '60px',
    '--shadow-low': '4px 4px 0 var(--color-border)',
  },
  components: {
    button: {base: {borderRadius: '0px', boxShadow: 'none', fontFamily: 'var(--q-font-display, "Pixelify Sans")'}},
    card: {base: {borderRadius: '0px', backgroundColor: 'transparent', color: 'var(--q-card-foreground)'}},
    popover: {base: {borderRadius: '0px', borderWidth: '2px', borderStyle: 'solid', boxShadow: '4px 4px 0 var(--q-shadow)', backgroundColor: 'var(--q-popover)', color: 'var(--q-popover-foreground)'}},
    avatar: {base: {borderRadius: '0px', backgroundColor: 'var(--q-muted)', color: 'var(--q-foreground)', fontFamily: 'var(--q-font-display)', fontWeight: '700', lineHeight: '1'}},
    banner: {base: {backgroundColor: 'transparent', color: 'inherit', borderRadius: '0px'}},
    'banner-description': {base: {color: 'inherit'}},
    'banner-icon': {base: {color: 'inherit'}},
    'banner-content': {base: {backgroundColor: 'transparent', color: 'inherit', borderRadius: '0px'}},
    ...pickerThemeComponents,
    ...questControlTargets,
  },
  icons: {
    ...pickerThemeIcons,
    check: createElement(PixelIcon, {name: 'check'}),
  },
  indicators: questIndicators,
})

export const themeNames = ['overworld','castle'] as const
export type QuestTheme = (typeof themeNames)[number]
export const themes = {
  overworld: {name:'Overworld',mode:'light'},
  castle: {name:'Castle',mode:'dark'},
} as const
