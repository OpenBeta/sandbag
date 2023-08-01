[![Develop branch](https://github.com/openbeta/climbing-grades/actions/workflows/nodejs.yml/badge.svg?branch=develop)](https://github.com/OpenBeta/climbing-grades/actions/workflows/nodejs.yml?query=develop)  [![License](https://img.shields.io/github/license/openbeta/climbing-grades?style=flat-square)](./LICENSE)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-11-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
# What is this?

Javascript utilities for working with rock climbing grades.

### Supported systems

**Sport & Traditional climbing**
- [x] Yosemite Decimal System
- [x] French
- [x] UIAA
- [x] Ewbanks
- [x] Saxon

**Bouldering**
- [x] Vermin (V-scale)
- [x] Fontainebleau

**Aid**
- [x] A# & C#
- [ ] Aid  with mandatory free climbing (5.8 A0, etc)

**Ice**
- [x] Winter Ice (WI#)
- [x] Alpine Ice (AI#)

### Help Wanted

Code contributions are most welcome!

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

#### Sample Usage

- Convert Grades to Scores

```javascript
import { French, YosemiteDecimal } from '@openbeta/sandbag'

const score = French.getScore('8a') // Output [ 84, 85 ]

// Support slash grade
const slashGradeScore=French.getScore('7c+/8a') // Output [ 82.5, 84.5 ]

// Accept +/- modifier
const plusGrade= YosemiteDecimal.getScore('5.12+') // Output [ 78.5, 80.5 ]
```

- Convert Scores to Grades

```javascript
import { Font } from '@openbeta/sandbag'

// Single score provided
Font.getGrade(80) // Output '7c'

// Support a range of scores 
Font.getGrade([79,81]) // Output'7b+/7c'

```

- Validate Grading Scales
``` javascript
import { VScale , Font }from '@openbeta/sandbag'

console.log('Is 6A a V Scale?',VScale.isType('6A'))  // Output false
console.log('Is 6A a Font Scale?',Font.isType('6A')) // Output true

```

- Convert Grades Across Scales

``` javascript
import {convertGrade , GradeScales }from '@openbeta/sandbag'

const ydsInFrench=convertGrade('5.11a',GradeScales.YDS,GradeScales.FRENCH) // Output '6b+/6c'

const fontInVScale=convertGrade('6a',GradeScales.FONT,GradeScales.VSCALE) //OutPut 'V3'

// Conversions across different disciplines are not allowed
const sportToBoulder=convertGrade('5.11a',GradeScales.YDS,GradeScales.VSCALE)
// Output: Scale: Yosemite Decimal System doesn't support converting to Scale: V Scale
// ''
```

- Get Gradeband

```javascript
import { Ewbank } from '@openbeta/sandbag'

Ewbank.getGradeBand('10') // Output: 'beginner'
Ewbank.getGradeBand('30') // Output: 'expert'
Ewbank.getGradeBand('6a') // Output: Unexpected grade format: 6a for grade scale Ewbank 'unknown'

```
- Compare Grades

```javascript

import { French, YosemiteDecimal } from '@openbeta/sandbag'

const harder = French.getScore('8a')  // Output: [ 84, 85 ]
const easier = YosemiteDecimal.getScore('5.13a') // Output: [ 82, 83 ]

console.log('Is 8a harder than 5.13a?',harder > easier) // Output: true

```



See [unit tests](./src/__tests__) for more examples.

### Development (TBD)

```
yarn install
yarn test
```

#### How to publish a new release to NPM
Submit a PR with commit message `[npm publish]`

### Project Maintainers
- [Nathan Musoke](https://github.com/musoke)
- [Viet Nguyen](https://github.com/vnugent)

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
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/TaliaMalia"><img src="https://avatars.githubusercontent.com/u/131688085?v=4?s=100" width="100px;" alt="Talia Aleyna Hortac"/><br /><sub><b>Talia Aleyna Hortac</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=TaliaMalia" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/actuallyyun"><img src="https://avatars.githubusercontent.com/u/87448230?v=4?s=100" width="100px;" alt="Yun Ji"/><br /><sub><b>Yun Ji</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=actuallyyun" title="Code">💻</a> <a href="#ideas-actuallyyun" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/josh610"><img src="https://avatars.githubusercontent.com/u/72105948?v=4?s=100" width="100px;" alt="Josh Zimmerman"/><br /><sub><b>Josh Zimmerman</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=josh610" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://johnny.sh/"><img src="https://avatars.githubusercontent.com/u/11850362?v=4?s=100" width="100px;" alt="John Roberts"/><br /><sub><b>John Roberts</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=johncalvinroberts" title="Code">💻</a> <a href="#ideas-johncalvinroberts" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
