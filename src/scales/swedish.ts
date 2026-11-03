import GradeScale, { findScoreRange, getAvgScore, GradeScales, ConversionGroups, Tuple, getRoundedScoreTuple } from '../GradeScale'
import routes from '../data/routes.json'
import { Route } from '.'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'

const SWEDISH_ARRAY = Array.from(new Set(routes.map((r) => r[GradeScales.SWEDISH])))

// Supports 1- -> 11+, slash grades i.e. 6-/6 or 7+/8-
// NOTE: this currently assumes "incorrect" slash grades follow the normal pattern
// i.e. 6-/5 => 6-/6
const swedishGradeRegex = /^((?:[1-9]|1[0-1])[+-]?)((?:\/)(?:[1-9]|1[0-1])[+-]?)?$/i
const isSwedish = (grade: string): RegExpMatchArray | null => grade.match(swedishGradeRegex)

const Swedish: GradeScale = {
  displayName: 'Swedish Scale',
  name: GradeScales.SWEDISH,
  grades: SWEDISH_ARRAY,
  offset: 1000,
  conversionGroup: ConversionGroups.FREE,
  isType: (grade: string): boolean => {
    if (isSwedish(grade) === null) {
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
      return routes[validateScore(score)].swedish
    }

    const low: string = routes[validateScore(score[0])].swedish
    const high: string = routes[validateScore(score[1])].swedish
    if (low === high) return low
    return `${low}/${high}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const score = getScore(grade)
    return routeScoreToBand(getAvgScore(score))
  }
}

const getScore = (grade: string): number | Tuple => {
  const parse = isSwedish(grade)
  if (parse == null) {
    console.warn(`Unexpected grade format: ${grade} for grade scale Swedish`)
    return -1
  }
  const [wholeMatch, basicGrade, slashGrade] = parse
  const basicScore = findScoreRange((r: Route) => {
    return r.swedish === basicGrade
  }, routes)

  if (wholeMatch !== basicGrade) {
    // 5/5+
    let otherGrade
    if (slashGrade !== null) {
      otherGrade = (basicScore as Tuple)[1] + 1
    }
    if (otherGrade !== undefined) {
      const nextGrade = findScoreRange(
        (r: Route) => r.swedish === routes[otherGrade].swedish,
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

export default Swedish
