import {Heading} from '@astryxdesign/core/Heading'
import {Text} from '@astryxdesign/core/Text'
import {VStack} from '@astryxdesign/core/VStack'
import {Button} from './components/quest/button'
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

export interface WorkbenchProps {
  dark: boolean
  onThemeToggle: () => void
}

export default function Workbench({dark, onThemeToggle}: WorkbenchProps) {
  return <VStack as="main" padding={8} gap={6} width="100%">
    <Heading level={1} type="display-1">QuestUI workbench</Heading>
    <Text as="p" type="large" color="secondary">All 64 source-copy compositions, exercised with real state in both Quest themes.</Text>
    <Button onClick={onThemeToggle}>{dark ? 'Switch to Overworld' : 'Switch to Castle'}</Button>
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
