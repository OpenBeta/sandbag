[![Develop branch](https://github.com/openbeta/climbing-grades/actions/workflows/nodejs.yml/badge.svg?branch=develop)](https://github.com/OpenBeta/climbing-grades/actions/workflows/nodejs.yml?query=develop)  [![License](https://img.shields.io/github/license/openbeta/climbing-grades?style=flat-square)](./LICENSE)
# What is this?

Javascript utilities for working with rock climbing grades.

** Only YDS and V scale are supported at the moment. Code contributions are most welcome!**

Questions?  Join us on [Discord](https://discord.gg/fY9DbRav8h).


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

See [unit tests](./tree/develop/src/__tests__) for more examples.

### Development (TBD)

```
yarn install
yarn test
```

### License

MIT
