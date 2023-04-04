import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple } from '../GradeScale'
import routes from '../data/routes.json'
import { Route } from '.'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'

const uiaaGradeRegex = /^(\d{1,2}[+-]?\/?\d?[+-]?)$/
const isUIAA = (grade: string): RegExpMatchArray | null => grade.match(uiaaGradeRegex)

// UIAA grading system, predominant in Central Europe (esp. Germany, Austria, Switzerland)
// Uses Arabic numerals with +/- signs, e.g. "7", "7-" (easier), or "7+" (harder)
// (Sometimes roman numerals, e. g. "VII", are used - this is not supported)

const UIAAScale: GradeScale = {
  displayName: 'UIAA Scale',
  name: GradeScales.UIAA,
  offset: 2000,
  allowableConversionType: [GradeScales.YDS],
  isType: (grade: string): boolean => {
    if (isUIAA(grade) === null) {
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
      return routes[validateScore(score)].uiaa
    }

    const low: string = routes[validateScore(score[0])].uiaa
    const high: string = routes[validateScore(score[1])].uiaa
    if (low === high) return low
    return `${low}/${high}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const score = getScore(grade)
    return routeScoreToBand(getAvgScore(score))
  }
}

const getScore = (grade: string): number | Tuple => {
  const parse = isUIAA(grade)
  if (parse == null) {
    console.warn(`Unexpected grade format: ${grade} for grade scale UIAA`)
    return -1
  }
  const [wholeMatch, basicGrade, slash] = parse
  const basicScore = findScoreRange((r: Route) => {
    return r.uiaa === basicGrade
  }, routes)

  if (wholeMatch !== basicGrade) {
    let otherGrade
    if (slash !== null) {
      otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[1]) + 1
    }
    if (otherGrade !== undefined) {
      const nextGrade = findScoreRange(
        (r: Route) => r.uiaa.toLowerCase() === routes[otherGrade].uiaa.toLowerCase(),
        routes
      )
      return [getAvgScore(basicScore), getAvgScore(nextGrade)].sort((a, b) => a - b) as Tuple
    }
  }
  return basicScore
}

export default UIAAScale
