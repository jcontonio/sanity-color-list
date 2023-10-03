import {definePlugin} from 'sanity'
import {schema} from './schemas'

interface MyPluginConfig {
  /* nothing here yet */
}

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {myPlugin} from 'sanity-plugin-sanity-color-list-v3'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [myPlugin()],
 * })
 * ```
 */
export const colorList = definePlugin<MyPluginConfig | void>((config = {}) => {
  // eslint-disable-next-line no-console
  console.log('hello from sanity-plugin-sanity-color-list-v3')
  return {
    name: 'sanity-plugin-sanity-color-list-v3',
    schema: {
      types: [schema],
    },
  }
})
