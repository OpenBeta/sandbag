import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple } from '../GradeScale'
import routes from '../data/routes.json'
import { Route } from '.'

export type YdsType = 'yds'

const ydsRegex = /(^5\.([0-9]{1,2})([a-zA-Z])?)([/+])?([/-])?([a-zA-Z]?)/i

// const unicodeAlphabetStart = 96

const YosemiteDecimal: GradeScale = {
  displayName: 'Yosemite Decimal System',
  name: GradeScales.Yds,
  offset: 1000,
  isType: (grade: string): boolean => {
    const isYds = grade.match(ydsRegex)
    if (isYds === null) {
      return false
    }
    return true
  },

  getScore: (grade: string): number | Tuple => {
    const parse = grade.match(ydsRegex)
    if (parse == null) {
      // not a valid V scale
      return 0
    }
    const [wholeMatch, basicGrade, number, letter, plusOrSlash, hasMinus] = parse
    let normalizedGrade = basicGrade
    const isLargeNonLetter = parseInt(number, 10) > 9 && letter === undefined
    if (isLargeNonLetter) {
      // 11-, 13+
      const letter = hasMinus === '-' ? 'a' : plusOrSlash === '+' ? 'c' : 'b'
      normalizedGrade = basicGrade + letter
    }
    const basicScore = findScoreRange((r: Route) => {
      return r.yds === normalizedGrade
    }, routes)
    
    if (wholeMatch !== normalizedGrade) {
      let otherGrade
      const plusSlash = plusOrSlash === undefined
      const minus = hasMinus !== undefined
      // V5+, V2-3
      if (plusSlash || isLargeNonLetter) {
        otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[1]) + 1
      } else if (minus) {
        // V5-, V2-
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
