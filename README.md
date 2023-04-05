[![Develop branch](https://github.com/openbeta/climbing-grades/actions/workflows/nodejs.yml/badge.svg?branch=develop)](https://github.com/OpenBeta/climbing-grades/actions/workflows/nodejs.yml?query=develop)  [![License](https://img.shields.io/github/license/openbeta/climbing-grades?style=flat-square)](./LICENSE)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-7-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
# What is this?

Javascript utilities for working with rock climbing grades.

### Supported systems 

**Sport & Traditional climbing**
- [x] Yosemite Decimal System
- [x] French
- [x] UIAA
- [x] Ewbanks

**Bouldering**
- [x] Vermin (V-scale)
- [x] Fontainebleau

### Help Wanted

Code contributions are most welcome!

We're also looking for a **project maintainer** to help us improve the API and expand support for other systems.  Email `viet at openbeta dot io` if interested.

### Questions?
Join us on [Discord](https://discord.gg/fY9DbRav8h).

---

### How to use the library

#### Install the package

Using NPM

```
npm install @openbeta/sandbag
```
Using Yarn
```
yarn add @openbeta/sandbag
```

#### Compare YDS grades
```javascript
import { YosemiteDecimal } from '@openbeta/sandbag'

const easier = YosemiteDecimal.getScoreForSort('5.6')
const harder = YosemiteDecimal.getScoreForSort('5.10')

console.log('Is 5.6 easier than 5.10?', easier < harder)  // Output: true
```

See [unit tests](./src/__tests__) for more examples.

### Development (TBD)

```
yarn install
yarn test
```

#### How to publish a new release to NPM
Submit a PR with commit message `[npm publish]`

### License

MIT

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AntoineMarnat"><img src="https://avatars.githubusercontent.com/u/28685732?v=4?s=100" width="100px;" alt="AntoineM"/><br /><sub><b>AntoineM</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=AntoineMarnat" title="Code">💻</a> <a href="#ideas-AntoineMarnat" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/gibboj"><img src="https://avatars.githubusercontent.com/u/2992272?v=4?s=100" width="100px;" alt="Kendra Gibbons"/><br /><sub><b>Kendra Gibbons</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=gibboj" title="Code">💻</a> <a href="#ideas-gibboj" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://twitter.com/m_dimmitt"><img src="https://avatars.githubusercontent.com/u/11463275?v=4?s=100" width="100px;" alt="MichaelDimmitt"/><br /><sub><b>MichaelDimmitt</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=MichaelDimmitt" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://clintonlunn.com"><img src="https://avatars.githubusercontent.com/u/24685932?v=4?s=100" width="100px;" alt="Clinton Lunn"/><br /><sub><b>Clinton Lunn</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=clintonlunn" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/DarrenZLew"><img src="https://avatars.githubusercontent.com/u/26758226?v=4?s=100" width="100px;" alt="Darren Lew"/><br /><sub><b>Darren Lew</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=DarrenZLew" title="Code">💻</a> <a href="#ideas-DarrenZLew" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/l4u532"><img src="https://avatars.githubusercontent.com/u/88317742?v=4?s=100" width="100px;" alt="Klaus"/><br /><sub><b>Klaus</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=l4u532" title="Code">💻</a> <a href="#ideas-l4u532" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://nathan.musoke.ca"><img src="https://avatars.githubusercontent.com/u/16665084?v=4?s=100" width="100px;" alt="Nathan Musoke"/><br /><sub><b>Nathan Musoke</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=musoke" title="Code">💻</a> <a href="#ideas-musoke" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
