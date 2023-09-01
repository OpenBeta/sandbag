import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple, getRoundedScoreTuple } from '../GradeScale'
import routes from '../data/routes.json'
import { Route } from '.'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'

const saxonGradeRegex = /^((([7-9]|1[0-3])([a-c]))|([1-6])|([7-9]|1[0-3])(([a-c])\/([7-9]|1[0-3])([a-c])))$/i
// Saxon grading system, predominant in Central Europe (esp. Germany, Austria, Switzerland)
// Supports 1 -> 13c, slash grades i.e. 7a/7b
// Uses Arabic numerals with letters from a-c, e.g. "7a" , "7b", or "7c" (hardest)
// (Roman numerals, e. g. "V", are used - this is not supported)
const isSaxon = (grade: string): RegExpMatchArray | null => grade.match(saxonGradeRegex)

const SaxonScale: GradeScale = {
  displayName: 'Saxon Scale',
  name: GradeScales.SAXON,
  offset: 1000,
  allowableConversionType: [GradeScales.YDS, GradeScales.EWBANK, GradeScales.FRENCH],
  isType: (grade: string): boolean => {
    if (isSaxon(grade) === null) {
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
      return routes[validateScore(score)].saxon
    }

    const low: string = routes[validateScore(score[0])].saxon
    const high: string = routes[validateScore(score[1])].saxon
    if (low === high) return low
    return `${low}/${high}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const score = getScore(grade)
    return routeScoreToBand(getAvgScore(score))
  }
}

const getScore = (grade: string): number | Tuple => {
  const parse = isSaxon(grade)
  if (parse == null) {
    console.warn(`Unexpected grade format: ${grade} for grade scale Saxon`)
    return -1
  }
  const [wholeMatch, basicGrade, slash] = parse
  const basicScore = findScoreRange((r: Route) => {
    return r.saxon === basicGrade
  }, routes)

  if (wholeMatch !== basicGrade) {
    let otherGrade
    if (slash !== null) {
      otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[1]) + 1
    }
    if (otherGrade !== undefined) {
      const nextGrade = findScoreRange(
        (r: Route) => r.saxon.toLowerCase() === routes[otherGrade].saxon.toLowerCase(),
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

export default SaxonScale
