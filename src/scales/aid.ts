import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple } from '../GradeScale'
import aid_table from '../data/aid.json'
import { AidGrade } from '.'
import { GradeBandTypes, routeScoreToBand } from '../GradeBands'

// Supports [AC]0 -> [AC]5, with + grades on [AC]2 -> [AC]4 and no slash grades
// https://en.wikipedia.org/wiki/Grade_(climbing)#Clean_scale
const aidGradeRegex = /^([AC])([0-5]|[2-4]\+)$/i
const isAid = (grade: string): RegExpMatchArray | null => grade.match(aidGradeRegex)

const AidScale: GradeScale = {
  displayName: 'Aid Grade',
  name: GradeScales.AID,
  offset: 1000,
  allowableConversionType: [],
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
  const [wholeMatch, AorC, gradeNum] = parse // eslint-disable-line @typescript-eslint/no-unused-vars

  const score = findScoreRange((r: AidGrade) => {
    return r.aid === ('A' + gradeNum)
  }, aid_table)

  return score
}

export default AidScale
