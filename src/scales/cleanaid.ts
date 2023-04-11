import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple } from '../GradeScale'
import aid_table from '../data/aid.json'
import { AidRoute } from '.'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'

// Supports A0 -> A5, with + grades on A2->A4 and no slash grades
// https://en.wikipedia.org/wiki/Grade_(climbing)#Clean_scale
const cleanaidGradeRegex = /^((A[0-1])|(A[2-4]\+?)|(A5)){1}$/
const isCleanAid = (grade: string): RegExpMatchArray | null => grade.match(cleanaidGradeRegex)

const CleanAidScale: GradeScale = {
  displayName: 'CleanAid Grade',
  name: GradeScales.AID,
  offset: 1000,
  allowableConversionType: [GradeScales.CLEANAID],
  isType: (grade: string): boolean => {
    if (isCleanAid(grade) === null) {
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
      return aid_table[validateScore(score)]['clean aid']
    }

    const low: string = aid_table[validateScore(score[0])]['clean aid']
    const high: string = aid_table[validateScore(score[1])]['clean aid']
    if (low === high) return low
    return `${low}/${high}`
  },
  getGradeBand: (grade: string): GradeBandTypes => {
    const score = getScore(grade)
    return routeScoreToBand(getAvgScore(score))
  }
}

const getScore = (grade: string): number | Tuple => {
  const parse = isCleanAid(grade)
  if (parse == null) {
    console.warn(`Unexpected grade format: ${grade} for grade scale CleanAid`)
    return -1
  }
  const [wholeMatch, basicGrade, slash] = parse
  const basicScore = findScoreRange((r: AidRoute) => {
    return r['clean aid'] === basicGrade
  }, aid_table)

  if (wholeMatch !== basicGrade) {
    // Slash grade
    let otherGrade
    if (slash !== null) {
      otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[1]) + 1
    }
    if (otherGrade !== undefined) {
      const nextGrade = findScoreRange(
        (r: AidRoute) => r['clean aid'] === aid_table[otherGrade]['clean aid'],
        aid_table
      )
      return [getAvgScore(basicScore), getAvgScore(nextGrade)].sort((a, b) => a - b) as Tuple
    }
  }
  return basicScore
}

export default CleanAidScale
