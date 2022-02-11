import GradeScale, { findScoreRange, getAvgScore, GradeScales, Tuple } from '../GradeScale'
import routes from '../data/routes.json'
import { Route } from '.'

const FrenchScale: GradeScale = {
  displayName: 'French Scale',
  name: GradeScales.French,
  offset: 1000,
  isType: (grade: string): boolean => {
    throw new Error('Not implemented')
  },
  getScore: (grade: string): number | Tuple => {
    const scores = routes.filter((b: Route) => {
      return b.french === grade
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
      return Math.min(Math.max(0, score), routes.length - 1)
    }

    if (typeof score === 'number') {
      return routes[validateScore(score)].french
    }
    const low: string = routes[validateScore(score[0])].french
    const high: string = routes[validateScore(score[1])].french
    return `${low}/${high}`
  }
}

export default FrenchScale
