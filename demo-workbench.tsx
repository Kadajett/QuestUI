import {Heading} from '@astryxdesign/core/Heading'
import {Text} from '@astryxdesign/core/Text'
import {VStack} from '@astryxdesign/core/VStack'
import {themes, type QuestTheme} from './components/quest/theme'
import {AvatarGeneratorExample} from './demo-avatars'
import {ContextExamples} from './demo-context'
import {ConversationExtraExamples} from './demo-conversation-extra'
import {DataExtraExamples} from './demo-data-extra'
import {DisclosureExamples} from './demo-disclosure'
import {FeedbackExamples} from './demo-feedback'
import {FormExtraExamples} from './demo-form-extra'
import {FormExamples} from './demo-forms'
import {LayoutExtraExamples} from './demo-layout-extra'
import {NavigationExtraExamples} from './demo-navigation-extra'
import {NavigationExamples} from './demo-navigation'
import {OverlaysExtraExamples} from './demo-overlays-extra'
import {PickerExamples} from './demo-pickers'
import {SurfaceExamples} from './demo-surfaces'
import {ThemePicker} from './demo-theme-picker'

export interface WorkbenchProps {
  themeName: QuestTheme
  onThemeChange: (themeName: QuestTheme) => void
}

export default function Workbench({themeName, onThemeChange}: WorkbenchProps) {
  return <VStack as="main" padding={8} gap={6} width="100%">
    <Heading level={1} type="display-1">QuestUI workbench</Heading>
    <Text as="p" type="large" color="secondary">Four built-in palettes and a palette factory for custom Quest themes.</Text>
    <ThemePicker themeName={themeName} onThemeChange={onThemeChange} />
    <Text as="p" type="supporting">Active theme: {themes[themeName].name}</Text>
    <SurfaceExamples />
    <FormExamples />
    <PickerExamples />
    <NavigationExamples />
    <FeedbackExamples />
    <DisclosureExamples />
    <ContextExamples />
    <LayoutExtraExamples />
    <NavigationExtraExamples />
    <OverlaysExtraExamples />
    <FormExtraExamples />
    <DataExtraExamples />
    <ConversationExtraExamples />
    <AvatarGeneratorExample />
  </VStack>
}
