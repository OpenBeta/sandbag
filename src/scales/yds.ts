import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple } from '../GradeScale'
import routes from '../data/routes.json'
import { Route } from '.'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'

const REGEX_5_X = /(^5\.([0-9]|1[0-6]))()([+-])?$/i
// Support 5.0 to 5.16 with + and -
const REGEX_5_10_LETTER = /(^5\.(1[0-6]))([abcd])(\/[abcd])?$/i
// Support 5.10x to 5.16x where x can be a,b,c,d. Allows for slash grade
const REGEX_5_X_LETTER = /(^5\.(?:[0-9]|1[0-6]))([abcd])?$/i
// Support 5.0(x) to 5.16(x) where x can be a,b,c,d.

// const unicodeAlphabetStart = 96

const isYds = (grade: string): RegExpMatchArray | null =>
  grade.match(REGEX_5_X) ?? grade.match(REGEX_5_10_LETTER)

const YosemiteDecimal: GradeScale = {
  displayName: 'Yosemite Decimal System',
  name: GradeScales.YDS,
  offset: 1000,
  allowableConversionType: [GradeScales.FRENCH, GradeScales.EWBANK, GradeScales.SAXON],
  isType: (grade: string): boolean => {
    if (isYds(grade) === null) {
      return false
    }
    return true
  },

  getScore: (grade: string): number | Tuple => {
    return getScore(grade)
  },
  getGrade: (score: number | Tuple): string => {
    function validateScore (score: number): number {
      return Math.min(Math.max(0, score), routes.length - 1)
    }

    if (typeof score === 'number') {
      return routes[validateScore(score)].yds
    }
    const low: string = routes[validateScore(score[0])].yds
    const high: string = routes[validateScore(score[1])].yds
    if (low === high) return low

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const [_, lowBasicGrade, lowLetter] = low.match(REGEX_5_X_LETTER) ?? []
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const [__, highBasicGrade, highLetter] = high.match(REGEX_5_X_LETTER) ?? []

    if (lowBasicGrade !== highBasicGrade) {
      return `${low}/${high}`
    }
    return `${lowBasicGrade}${lowLetter}/${highLetter}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const score = getScore(grade)
    return routeScoreToBand(getAvgScore(score))
  }
}

const getScore = (grade: string): number | Tuple => {
  const parse = isYds(grade)
  if (parse === null) {
    console.warn(`Unexpected grade format: ${grade} for grade scale yds`)
    return -1
  }
  const [wholeMatch, basicGrade, number, letter, plusOrMinusOrSlash] = parse
  let normalizedGrade = basicGrade

  const slash = plusOrMinusOrSlash?.startsWith('/')
  const minus = plusOrMinusOrSlash === '-'
  const plus = plusOrMinusOrSlash === '+'

  let normalizedLetter = letter
  const isLargeNonLetter = parseInt(number, 10) > 9 && normalizedLetter === ''
  if (isLargeNonLetter) {
    // 11-, 13+, 12
    normalizedLetter = minus ? 'a' : (plus || slash) ? 'c' : 'b'
  }
  normalizedGrade = basicGrade + normalizedLetter
  const basicScore = findScoreRange((r: Route) => {
    return r.yds === normalizedGrade
  }, routes)

  if (wholeMatch !== normalizedGrade) {
    let otherScore
    if (plus || slash || isLargeNonLetter) {
      // 5.11+, 5.10a/b
      otherScore = (typeof basicScore === 'number' ? basicScore : basicScore[1]) + 1
    } else if (minus) {
      // 5.11-
      otherScore = (typeof basicScore === 'number' ? basicScore : basicScore[0]) - 1
    }

    if (otherScore !== undefined) {
      const nextGrade = findScoreRange((r: Route) => {
        return r.yds.toLowerCase() === routes[Math.max(otherScore, 0)].yds.toLowerCase()
      }, routes)
      const basicAvg = getAvgScore(basicScore)
      const nextGradeAvg = getAvgScore(nextGrade)
      const low = Math.ceil(Math.min(basicAvg, nextGradeAvg))
      const high = Math.floor(Math.max(basicAvg, nextGradeAvg))
      return [low, high] as Tuple
    }
  }
  return basicScore
}

export default YosemiteDecimal
