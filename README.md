[![Develop branch](https://github.com/openbeta/climbing-grades/actions/workflows/nodejs.yml/badge.svg?branch=develop)](https://github.com/OpenBeta/climbing-grades/actions/workflows/nodejs.yml?query=develop)  [![License](https://img.shields.io/github/license/openbeta/climbing-grades?style=flat-square)](./LICENSE)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
# What is this?

Sandbag is a TypeScript library that translates climbing grades across the world's major grading systems by mapping every grade to a shared internal score — letting you convert, compare, and sort grades that would otherwise be incompatible strings.

### Supported systems

**Sport & Traditional climbing**
- [x] Yosemite Decimal System
- [x] French
- [x] UIAA
- [x] Ewbanks
- [x] Saxon
- [x] Brazilian

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
const slashGradeScore=French.getScore('7c+/8a') // Output [ 83, 84 ]

// Accept +/- modifier
const plusGrade= YosemiteDecimal.getScore('5.12+') // Output [ 79, 80 ]
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
Named skill tiers (Beginner, Intermediate, Advanced, Expert) — using fixed score thresholds per discipline.

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

---
### How it works (in depth)
**The core idea: a universal internal score**
\
In climbing, we have many different _systems_ for grading - for example, the Yosemite Decimal System (5.14d), or the French system (9a) to name a few. 

Every grade in every supported system maps to an integer score (0–107 for routes and bouldering). These mappings live in lookup tables (src/data/routes.json, src/data/boulder.json, etc.), where each row equates grades across systems at the same difficulty. Score 54 maps to 5.9 (YDS), 5b+ (French), 6- (UIAA), and 17 (Ewbank) simultaneously.

**The GradeScale interface**
\
Each grading system is implemented as a `GradeScale` (src/GradeScale.ts) with three key responsibilities:
- `isType(grade)` — validates whether a string belongs to this grading system
- `getScore(grade)` — converts a grade string to a score or [low, high] tuple
- `getGrade(score)` — converts a score back to a grade string

**Conversion of grades**
\
Every grading system (`GradeScale`) has a field called `conversionGroup`, which declares the climbing discipline it belongs to: [`FREE`, `BOULDERING`, `ICE`, `AID`]. A grading system can only be part of one `conversionGroup`. 
| Conversion Group | GradeScales |
|---|:---|
| FREE (sport/trad) | YDS, French, UIAA, Ewbank, Saxon, Norwegian, Brazilian |
| BOULDERING | V-Scale, Fontainebleau |
| ICE | Winter Ice (WI), Alpine Ice (AI) |
| AID | A-grade, C-grade |

\
`convertGrade(fromGrade, fromScale, toScale)` is a two-step lookup: grade → standardized Score → grade (on the target scale). Critically, conversions are gated by conversionGroup — 5.11a (YDS, FREE group) can convert to a French grade, but not to a V-scale grade, since sport climbing and bouldering are separate disciplines with incompatible score ranges.

**Fuzzy grades become score ranges**
\
Grades like 5.12+ or V3-4 don't sit at a single point — they span between two adjacent scores. getScore returns a tuple [low, high] for these, and the library can return the average or either bound depending on the use case (e.g. sorting uses getScoreForSort which collapses the range to a single number).

**Grade bands**
\
Scores also bucket into skill tiers via getGradeBand (src/GradeBands.ts): Beginner, Intermediate, Advanced, Expert — using fixed score thresholds per discipline.

### Development (TBD)

```
yarn install
yarn test
```

#### Generating Test Coverage Report

To generate a test coverage report using Jest run the following command in your terminal:

```sh
npx jest --coverage
```

If you're using macOS, you can directly access the coverage report in your browser by opening the following URL:

```
file:///Users/<userName>/sandbag/coverage/lcov-report/index.html
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
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/marinojoey"><img src="https://avatars.githubusercontent.com/u/87674525?v=4?s=100" width="100px;" alt="Joey Marino"/><br /><sub><b>Joey Marino</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=marinojoey" title="Code">💻</a> <a href="#ideas-marinojoey" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/enapupe"><img src="https://avatars.githubusercontent.com/u/291082?v=4?s=100" width="100px;" alt="Iacami Gevaerd"/><br /><sub><b>Iacami Gevaerd</b></sub></a><br /><a href="https://github.com/OpenBeta/sandbag/commits?author=enapupe" title="Code">💻</a> <a href="#ideas-enapupe" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
