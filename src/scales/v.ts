import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple } from '../GradeScale'
import boulder from '../data/boulder.json'
import { Boulder } from '.'
export type VScaleType = 'vScale'

const vGradeRegex = /^(V[0-9]{1,2})([/+])?([/-])?([0-9]{1,2})?$/i
const vGradeIrregular = /^V-([a-zA-Z]*)$/i

const VScale: GradeScale = {
  displayName: 'V Scale',
  name: GradeScales.VScale,
  offset: 1000,
  isType: (grade: string): boolean => {
    const isVGrade = (grade.match(vGradeRegex) !== null) || grade.match(vGradeIrregular)
    // If there isn't a match sort it to the bottom
    if ((isVGrade === null)) {
      return false
    }
    return true
  },
  getScore: (grade: string): number | Tuple => {
    const parse = grade.match(vGradeRegex)
    if (parse == null) {
      // not a valid V scale
      return 0
    }
    const [wholeMatch, basicGrade, plus, dash, secondGrade] = parse

    const basicScore = findScoreRange(
      (r: Boulder) => r.v.toLowerCase() === basicGrade.toLowerCase(),
      boulder
    )
    // ugly but working will fix later (says ever dev ever)
    if (wholeMatch !== basicGrade) {
      let otherGrade
      // V5+, V2-3
      if (plus !== undefined || secondGrade !== undefined) {
        otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[1]) + 1
      } else if (dash !== undefined) {
        // V5-, V2-
        otherGrade = (typeof basicScore === 'number' ? basicScore : basicScore[0]) - 1
      }
      if (otherGrade !== undefined) {
        const nextGrade = findScoreRange(
          (r: Boulder) => r.v.toLowerCase() === boulder[otherGrade].v.toLowerCase(),
          boulder
        )
        return [getAvgScore(basicScore), getAvgScore(nextGrade)].sort((a, b) => a - b) as Tuple
      }
    }
    return basicScore
  },
  getGrade: (score: number | Tuple): string => {
    function validateScore (score: number): number {
      return Math.min(Math.max(0, score), boulder.length - 1)
    }

    if (typeof score === 'number') {
      const validScore = validateScore(score)
      return boulder[validScore].v
    }

    const low: string = boulder[validateScore(score[0])].v
    const high: string = boulder[validateScore(score[1])].v
    return `${low}/${high}`
  }
}

export default VScale

export const getScoreIrregular = (irregularMatch: RegExpMatchArray): number => {
  let score = 0
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [_, group] = irregularMatch
  switch (group) {
    case 'easy':
      score = 1
      break
    default:
      score = 0
      break
  }
  return score
}

export const getScoreCommon = (match: RegExpMatchArray): number => {
  let score = 0
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [_, num, hasPlus, hasMinus, secondNumber] = match
  const minus = (hasMinus !== undefined && secondNumber === undefined) ? -1 : 0 // check minus is not a V1-2
  const plus = (hasMinus !== undefined && secondNumber !== undefined) || (hasPlus !== undefined) ? 1 : 0 // grade V1+ the same as V1-2
  score = (parseInt(num, 10) + 1) * 10 + minus + plus // V0 = 10, leave room for V-easy to be below 0

  return score
}
