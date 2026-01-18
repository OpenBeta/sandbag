import { boulderScoreToBand, GradeBands, routeScoreToBand } from '../GradeBands'

describe('GradeBands', () => {
  test('returns grade bands based on scores for a route distribution', () => {
    expect(routeScoreToBand(-1)).toEqual(GradeBands.UNKNOWN)
    expect(routeScoreToBand(0)).toEqual(GradeBands.BEGINNER)
    expect(routeScoreToBand(54)).toEqual(GradeBands.INTERMEDIATE)
    expect(routeScoreToBand(67.5)).toEqual(GradeBands.ADVANCED)
    expect(routeScoreToBand(82.5)).toEqual(GradeBands.EXPERT)
  })
  test('returns grade bands based on scores for a bouldering distribution', () => {
    expect(boulderScoreToBand(-1)).toEqual(GradeBands.UNKNOWN)
    expect(boulderScoreToBand(0)).toEqual(GradeBands.BEGINNER)
    expect(boulderScoreToBand(24)).toEqual(GradeBands.INTERMEDIATE)
    expect(boulderScoreToBand(28)).toEqual(GradeBands.ADVANCED)
    expect(boulderScoreToBand(38)).toEqual(GradeBands.EXPERT)
  })
})
