# sanity-color-list

This is a fork of [Sanity Color List](https://github.com/KimPaow/sanity-color-list) that works in v3 Sanity Studio.

> This is a **Sanity Studio v3** plugin.

## Installation

```sh
npm install "https://github.com/jcontonio/sanity-color-list"
```

## Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import {colorList} from 'sanity-color-list'

export default defineConfig({
  //...
  plugins: [colorList()],
})
```

## Development

Run `npm run link-watch` to get the yalc command to run inside of your studio development.

## License

[MIT](LICENSE) © Jay Contonio

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
