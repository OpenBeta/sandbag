import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple, getRoundedScoreTuple } from '../GradeScale'
import routes from '../data/routes.json'
import { Route } from '.'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'

const frenchGradeRegex = /^([1-9][a-c][+]?){1}(?:(\/)([1-9][a-c][+]?))?$/i
// Supports 1a -> 9c+, slash grades i.e. 5a/5a+ or 6a+/6b
// NOTE: this currently assumes "incorrect" slash grades follows the normal pattern
// i.e. 6b+/5a => 6b+/6c
const isFrench = (grade: string): RegExpMatchArray | null => grade.match(frenchGradeRegex)

const FrenchScale: GradeScale = {
  displayName: 'French Scale',
  name: GradeScales.FRENCH,
  offset: 1000,
  allowableConversionType: [GradeScales.YDS, GradeScales.EWBANK, GradeScales.SAXON],
  isType: (grade: string): boolean => {
    if (isFrench(grade) === null) {
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
      return routes[validateScore(score)].french
    }

    const low: string = routes[validateScore(score[0])].french
    const high: string = routes[validateScore(score[1])].french
    if (low === high) return low
    return `${low}/${high}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const score = getScore(grade)
    return routeScoreToBand(getAvgScore(score))
  }
}

const getScore = (grade: string): number | Tuple => {
  const parse = isFrench(grade)
  if (parse == null) {
    console.warn(`Unexpected grade format: ${grade} for grade scale french`)
    return -1
  }
  const [wholeMatch, basicGrade, slash] = parse
  const basicScore = findScoreRange((r: Route) => {
    return r.french === basicGrade
  }, routes)

  if (wholeMatch !== basicGrade) {
    // 5a/5a+
    let otherGrade
    if (slash !== null) {
      otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[1]) + 1
    }
    if (otherGrade !== undefined) {
      const nextGrade = findScoreRange(
        (r: Route) => r.french.toLowerCase() === routes[otherGrade].french.toLowerCase(),
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

export default FrenchScale
