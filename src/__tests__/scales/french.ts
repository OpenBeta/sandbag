import { French, Font } from '../../scales'
import { getScoreForSort } from '../../GradeParser'
import { GradeScales } from '../../index'

describe('French', () => {
  describe('Get Score', () => {
    test('1c > 1a+', () => {
      const lowGrade = French.getScore('1c')
      const highGrade = French.getScore('1a+')
      expect(lowGrade[0]).toBeGreaterThan(highGrade[1])
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(Font.getGrade(0)).toBe('1a')
    })

    test('top of range', () => {
      expect(Font.getGrade(1000)).toBe('9c+')
    })
  })

  describe('Verify getScoreForSort()', () => {
    test('6b > 5b', () => {
      expect(getScoreForSort('6b', GradeScales.French))
        .toBeGreaterThan(getScoreForSort('5b', GradeScales.French))
    })

    test('5b > 5a', () => {
      expect(getScoreForSort('5b', GradeScales.French))
        .toBeGreaterThan(getScoreForSort('5a', GradeScales.French))
    })

    test('5b+ > 5b', () => {
      expect(getScoreForSort('5b+', GradeScales.French))
        .toBeGreaterThan(getScoreForSort('5.b', GradeScales.French))
    })
  })
})
