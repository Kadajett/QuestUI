import {lazy, Suspense, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Text} from '@astryxdesign/core/Text'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from './components/quest/theme'
import {LandingPage} from './demo-landing'

import '@astryxdesign/core/reset.css'
import '@astryxdesign/core/astryx.css'
import './components/quest/fonts.css'

const Workbench = lazy(() => import('./demo-workbench'))


function App() {
  const [dark, setDark] = useState(false)
  const onThemeToggle = () => setDark(value => !value)
  const isWorkbench = window.location.pathname.startsWith('/demo')
  document.title = isWorkbench ? 'QuestUI component workbench' : 'QuestUI · Pixel components for React'
  return <Theme theme={questTheme} mode={dark ? 'dark' : 'light'}>
    {isWorkbench
      ? <Suspense fallback={<Text>Loading component workbench…</Text>}>
        <Workbench dark={dark} onThemeToggle={onThemeToggle} />
      </Suspense>
      : <LandingPage dark={dark} onThemeToggle={onThemeToggle} />}
  </Theme>
}

const root = document.getElementById('root')
if (!root) throw new Error('Missing application root')
createRoot(root).render(<App />)
