import { GradeBands } from '../../GradeBands'
import { Norwegian } from '../../scales'

describe('Norwegian', () => {
  describe('Get Score', () => {
    test('9- > 4+', () => {
      const lowGrade = Norwegian.getScore('4+')
      const highGrade = Norwegian.getScore('9-')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('6 > 5+', () => {
      const highGrade = Norwegian.getScore('6')
      const lowGrade = Norwegian.getScore('5+')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('6+ > 6-', () => {
      const highGrade = Norwegian.getScore('6+')
      const lowGrade = Norwegian.getScore('6-')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
    })

    test('8- > 7/7+', () => {
      const highGrade = Norwegian.getScore('8-')
      const lowGrade = Norwegian.getScore('7/7+')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      if (lowGrade[1] !== undefined && highGrade[1] !== undefined) {
        expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
      }
    })

    test('Slash grade provided', () => {
      expect(Norwegian.getScore('4-/4')).toStrictEqual([30.5, 33.5])
      expect(Norwegian.getScore('5/5+')).toStrictEqual([45.5, 51.5])
      expect(Norwegian.getScore('7+/8-')).toStrictEqual([72.5, 75.5])
      expect(Norwegian.getScore('7+/7')).toStrictEqual([72.5, 75.5])
    })
  })

  describe('Invalid grade format', () => {
    jest.spyOn(console, 'warn').mockImplementation()
    beforeEach(() => {
      jest.clearAllMocks()
    })
    test('invalid plus modifier', () => {
      const invalidGrade = Norwegian.getScore('+5')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: +5 for grade scale Norwegian'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid minus modifier', () => {
      const invalidGrade = Norwegian.getScore('-5')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: -5 for grade scale Norwegian'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('extra slash grade', () => {
      const invalidGrade = Norwegian.getScore('5/5+/6-')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: 5/5+/6- for grade scale Norwegian'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('not Norwegian scale', () => {
      const invalidGrade = Norwegian.getScore('V11')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: V11 for grade scale Norwegian'
      )
      expect(invalidGrade).toEqual(-1)
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(Norwegian.getGrade(0)).toBe('1-')
    })

    test('top of range', () => {
      expect(Norwegian.getGrade(1000)).toBe('11+')
    })

    test('single score provided', () => {
      expect(Norwegian.getGrade(25)).toBe('3')
      expect(Norwegian.getGrade(30)).toBe('4-')
      expect(Norwegian.getGrade(48)).toBe('5+')
      expect(Norwegian.getGrade(55)).toBe('5+')
    })
    test('range of scores provided', () => {
      expect(Norwegian.getGrade([43, 44])).toBe('5-/5')
      expect(Norwegian.getGrade([71, 72])).toBe('7/7+')
      expect(Norwegian.getGrade([12, 15])).toBe('2')
      expect(Norwegian.getGrade([44, 55])).toBe('5/5+')
    })
  })

  describe('Get Grade Band', () => {
    test('gets Gradeband', () => {
      expect(Norwegian.getGradeBand('1')).toEqual(GradeBands.BEGINNER)
      expect(Norwegian.getGradeBand('10')).toEqual(GradeBands.EXPERT)
    })
  })
})
