import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple } from '../GradeScale'
import aid_table from '../data/aid.json'
import { AidRoute } from '.'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'

// Supports A0 -> A5, with + grades on A2->A4 and no slash grades
// https://en.wikipedia.org/wiki/Grade_(climbing)#Clean_scale
const aidGradeRegex = /^((A[0-1])|(A[2-4]\+?)|(A5)){1}$/
const isAid = (grade: string): RegExpMatchArray | null => grade.match(aidGradeRegex)

const AidScale: GradeScale = {
  displayName: 'Aid Grade',
  name: GradeScales.AID,
  offset: 1000,
  allowableConversionType: [GradeScales.CLEANAID],
  isType: (grade: string): boolean => {
    if (isAid(grade) === null) {
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
      return Math.min(Math.max(0, validScore), aid_table.length - 1)
    }

    if (typeof score === 'number') {
      return aid_table[validateScore(score)].aid
    }

    const low: string = aid_table[validateScore(score[0])].aid
    const high: string = aid_table[validateScore(score[1])].aid
    if (low === high) return low
    return `${low}/${high}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const score = getScore(grade)
    return routeScoreToBand(getAvgScore(score))
  }
}

const getScore = (grade: string): number | Tuple => {
  const parse = isAid(grade)
  if (parse == null) {
    console.warn(`Unexpected grade format: ${grade} for grade scale Aid`)
    return -1
  }
  const [wholeMatch, basicGrade, slash] = parse
  const basicScore = findScoreRange((r: AidRoute) => {
    return r.aid === basicGrade
  }, aid_table)

  if (wholeMatch !== basicGrade) {
    // Slash grade
    let otherGrade
    if (slash !== null) {
      otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[1]) + 1
    }
    if (otherGrade !== undefined) {
      const nextGrade = findScoreRange(
        (r: AidRoute) => r.aid === aid_table[otherGrade].aid,
        aid_table
      )
      return [getAvgScore(basicScore), getAvgScore(nextGrade)].sort((a, b) => a - b) as Tuple
    }
  }
  return basicScore
}

export default AidScale
