import { getScoreForSort } from '../GradeParser'
import { GradeScales } from '../GradeScale'

describe('YDS', () => {
  test('5.9 > 5.8', () => {
    expect(getScoreForSort('5.9', GradeScales.Yds)).toBeGreaterThan(
      getScoreForSort('5.8', GradeScales.Yds)
    )
  })

  test('5.10b > 5.10a', () => {
    expect(getScoreForSort('5.10b', GradeScales.Yds)).toBeGreaterThan(
      getScoreForSort('5.10a', GradeScales.Yds)
    )
  })

  test('5.11a > 5.10+', () => {
    expect(getScoreForSort('5.11a', GradeScales.Yds)).toBeGreaterThan(
      getScoreForSort('5.10+', GradeScales.Yds)
    )
  })
})

describe('V', () => {
  test('v5 > V3', () => {
    expect(getScoreForSort('v5', GradeScales.VScale)).toBeGreaterThan(
      getScoreForSort('V3', GradeScales.VScale)
    )
  })

  test('v2-3 > V2', () => {
    expect(getScoreForSort('v2-3', GradeScales.VScale)).toBeGreaterThan(
      getScoreForSort('V2', GradeScales.VScale)
    )
  })

  test('v3 > V2-3', () => {
    expect(getScoreForSort('v3', GradeScales.VScale)).toBeGreaterThan(
      getScoreForSort('V2-3', GradeScales.VScale)
    )
  })

  test('v20+ > V20', () => {
    expect(getScoreForSort('V20+', GradeScales.VScale)).toBeGreaterThan(
      getScoreForSort('V20', GradeScales.VScale)
    )
  })
})
describe('Font', () => {
  test('2a > 1a', () => {
    expect(getScoreForSort('2a', GradeScales.Font)).toBeGreaterThan(
      getScoreForSort('1a', GradeScales.Font)
    )
  })
  test('2a+ > 2a', () => {
    expect(getScoreForSort('2a+', GradeScales.Font)).toBeGreaterThan(
      getScoreForSort('2a', GradeScales.Font)
    )
  })
  test('3a/3a+ > 3a', () => {
    expect(getScoreForSort('3a/3a+', GradeScales.Font)).toBeGreaterThan(
      getScoreForSort('3a', GradeScales.Font)
    )
  })
  test('4a > 3a+/4a', () => {
    expect(getScoreForSort('4a', GradeScales.Font)).toBeGreaterThan(
      getScoreForSort('3a+/4a', GradeScales.Font)
    )
  })
})
