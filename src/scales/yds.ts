import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple } from '../GradeScale'
import routes from '../data/routes.json'
import { Route } from '.'

export type YdsType = 'yds'

const REGEX_5_X = /(^5\.([0-9]|1[0-6]))()([+-])?$/i
const REGEX_5_10_LETTER = /(^5\.(1[0-6]))([abcd])(\/[abcd])?$/i
// const unicodeAlphabetStart = 96

const isYds = (grade: string): RegExpMatchArray | null => grade.match(REGEX_5_X) ?? grade.match(REGEX_5_10_LETTER)

const YosemiteDecimal: GradeScale = {
  displayName: 'Yosemite Decimal System',
  name: GradeScales.Yds,
  offset: 1000,
  isType: (grade: string): boolean => {
    if (isYds(grade) === null) {
      return false
    }
    return true
  },

  getScore: (grade: string): number | Tuple => {
    const parse = isYds(grade)
    if (parse === null) {
      console.warn(`Unexpected grade format: ${grade}`)
      return 0
    }
    const [wholeMatch, basicGrade, number, letter, plusOrMinusOrSlash] = parse
    let normalizedGrade = basicGrade
    const plusSlash = ['+', '/'].includes(plusOrMinusOrSlash)
    const minus = plusOrMinusOrSlash === '-'
    let normalizedLetter = letter
    const isLargeNonLetter = parseInt(number, 10) > 9 && normalizedLetter === ''
    if (isLargeNonLetter) {
      // 11-, 13+, 12
      normalizedLetter = minus ? 'a' : plusSlash ? 'c' : 'b'
    }
    normalizedGrade = basicGrade + normalizedLetter
    const basicScore = findScoreRange((r: Route) => {
      return r.yds === normalizedGrade
    }, routes)

    if (wholeMatch !== normalizedGrade) {
      let otherGrade
      // 5.11+, 5.10a/b
      if (plusSlash || isLargeNonLetter) {
        otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[1]) + 1
      } else if (minus) {
        // 5.11-
        otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[0]) - 1
      }

      if (otherGrade !== undefined) {
        const nextGrade = findScoreRange(
          (r: Route) => {
            return r.yds.toLowerCase() === routes[Math.max(otherGrade, 0)].yds.toLowerCase()
          },
          routes
        )
        return [getAvgScore(basicScore), getAvgScore(nextGrade)].sort((a, b) => a - b) as Tuple
      }
    }
    return basicScore
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

    return `${low}/${high}`
  }
}

export default YosemiteDecimal
