import {test} from '@playwright/test'
import {allCatalogScenario} from '../../scripts/consumer-scenario.ts'

// Packaged-consumer proof: requires the preview server from
// scripts/verify-consumer.ts (QUEST_CONSUMER_PREVIEW, default 127.0.0.1:4174).
test.skip(!process.env['QUEST_CONSUMER_PREVIEW'] && !process.env['CI'], 'Requires packaged-consumer preview server')

test('installed Quest components behave end-to-end in the packaged consumer', async ({page}) => {
  await allCatalogScenario(page, process.env['QUEST_CONSUMER_PREVIEW'] ?? 'http://127.0.0.1:4174')
})
