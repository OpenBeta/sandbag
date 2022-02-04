import boulder from '../data/boulder.json'

import GradeScale, { GradeScales, Tuple } from '../GradeScale'
import { Boulder } from '.'

const FontScale: GradeScale = {
  displayName: 'Fontainebleau',
  name: GradeScales.Font,
  offset: 1000,
  isType: (grade: string): boolean => {
    throw new Error('Not implemented')
  },
  getScore: (grade: string): number | Tuple => {
    const scores = boulder.filter((b: Boulder) => {
      return b.font === grade
    })
      .map(b => b.score)
      .sort((a, b) => b - a)

    const low = scores[0]
    const high = scores[scores.length - 1]
    if (low === undefined) {
      return 0
    }
    if (high === undefined) {
      return low
    }
    return [low, high]
  },
  getGrade: (score: number | Tuple): string => {
    function validateScore (score: number): number {
      return Math.min(Math.max(0, score), boulder.length - 1)
    }

    if (typeof score === 'number') {
      return boulder[validateScore(score)].font
    }
    const low: string = boulder[validateScore(score[0])].font
    const high: string = boulder[validateScore(score[1])].font
    return `${low}/${high}`
  }
}

export default FontScale
