import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple, getRoundedScoreTuple } from '../GradeScale'
import routes from '../data/routes.json'
import { Route } from '.'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'

// Supports 1- -> 11+, slash grades i.e. 6-/6 or 7+/8-
// NOTE: this currently assumes "incorrect" slash grades follow the normal pattern
// i.e. 6-/5 => 6-/6
const norwegianGradeRegex = /^((?:[1-9]|1[0-1])[+-]?)((?:\/)(?:[1-9]|1[0-1])[+-]?)?$/i
const isNorwegian = (grade: string): RegExpMatchArray | null => grade.match(norwegianGradeRegex)

const Norwegian: GradeScale = {
  displayName: 'Norwegian Scale',
  name: GradeScales.NORWEGIAN,
  offset: 1000,
  allowableConversionType: [],
  isType: (grade: string): boolean => {
    if (isNorwegian(grade) === null) {
      return false
    }
    return true
  },
  getScore: (grade: string): number | Tuple => {
    return getScore(grade)
  },
  getGrade: (score: number | Tuple): string => {
    const validateScore = (score: number): number => {
      const validScore = Number.isInteger(score) ? score : Math.ceil(score)
      return Math.min(Math.max(0, validScore), routes.length - 1)
    }

    if (typeof score === 'number') {
      return routes[validateScore(score)].norwegian
    }

    const low: string = routes[validateScore(score[0])].norwegian
    const high: string = routes[validateScore(score[1])].norwegian
    if (low === high) return low
    return `${low}/${high}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const score = getScore(grade)
    return routeScoreToBand(getAvgScore(score))
  }
}

const getScore = (grade: string): number | Tuple => {
  const parse = isNorwegian(grade)
  if (parse == null) {
    console.warn(`Unexpected grade format: ${grade} for grade scale Norwegian`)
    return -1
  }
  const [wholeMatch, basicGrade, slashGrade] = parse
  const basicScore = findScoreRange((r: Route) => {
    return r.norwegian === basicGrade
  }, routes)

  if (wholeMatch !== basicGrade) {
    // 5/5+
    let otherGrade
    if (slashGrade !== null) {
      otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[1]) + 1
    }
    if (otherGrade !== undefined) {
      const nextGrade = findScoreRange(
        (r: Route) => r.norwegian === routes[otherGrade].norwegian,
        routes
      )
      const basicAvg = getAvgScore(basicScore)
      const nextGradeAvg = getAvgScore(nextGrade)
      const tuple = getRoundedScoreTuple(basicAvg, nextGradeAvg)
      return tuple
    }
  }
  return basicScore
}

export default Norwegian
