import { GradeBands } from '../../GradeBands'
import { Swedish } from '../../scales'
import { Swedish as SwedishFromIndex } from '../../index'

describe('Swedish', () => {
  describe('Get Score', () => {
    test('9- > 4+', () => {
      const lowGrade = Swedish.getScore('4+')
      const highGrade = Swedish.getScore('9-')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('6 > 5+', () => {
      const highGrade = Swedish.getScore('6')
      const lowGrade = Swedish.getScore('5+')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('6+ > 6-', () => {
      const highGrade = Swedish.getScore('6+')
      const lowGrade = Swedish.getScore('6-')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
    })

    test('8- > 7/7+', () => {
      const highGrade = Swedish.getScore('8-')
      const lowGrade = Swedish.getScore('7/7+')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      if (lowGrade[1] !== undefined && highGrade[1] !== undefined) {
        expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
      }
    })

    test('Slash grade provided', () => {
      expect(Swedish.getScore('4-/4')).toStrictEqual([34, 37])
      expect(Swedish.getScore('5/5+')).toStrictEqual([51, 55])
      expect(Swedish.getScore('7+/8-')).toStrictEqual([73, 75])
      expect(Swedish.getScore('7+/7')).toStrictEqual([73, 75])
    })
  })

  describe('Is Type', () => {
    test('valid Swedish grades', () => {
      expect(Swedish.isType('1-')).toBe(true)
      expect(Swedish.isType('6')).toBe(true)
      expect(Swedish.isType('11+')).toBe(true)
      expect(Swedish.isType('7+/8-')).toBe(true)
    })

    test('invalid Swedish grades', () => {
      expect(Swedish.isType('V11')).toBe(false)
      expect(Swedish.isType('+5')).toBe(false)
      expect(Swedish.isType('12')).toBe(false)
      expect(Swedish.isType('5/5+/6-')).toBe(false)
    })
  })

  describe('Invalid grade format', () => {
    jest.spyOn(console, 'warn').mockImplementation()
    beforeEach(() => {
      jest.clearAllMocks()
    })
    test('invalid plus modifier', () => {
      const invalidGrade = Swedish.getScore('+5')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: +5 for grade scale Swedish'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid minus modifier', () => {
      const invalidGrade = Swedish.getScore('-5')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: -5 for grade scale Swedish'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('extra slash grade', () => {
      const invalidGrade = Swedish.getScore('5/5+/6-')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: 5/5+/6- for grade scale Swedish'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('not Swedish scale', () => {
      const invalidGrade = Swedish.getScore('V11')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: V11 for grade scale Swedish'
      )
      expect(invalidGrade).toEqual(-1)
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(Swedish.getGrade(0)).toBe('1-')
    })

    test('top of range', () => {
      expect(Swedish.getGrade(1000)).toBe('11+')
    })

    test('single score provided', () => {
      expect(Swedish.getGrade(25)).toBe('3')
      expect(Swedish.getGrade(30)).toBe('3+')
      expect(Swedish.getGrade(48)).toBe('5-')
      expect(Swedish.getGrade(55)).toBe('5+')
    })
    test('non-integer score rounds up', () => {
      expect(Swedish.getGrade(24.5)).toBe(Swedish.getGrade(25))
    })
    test('exported from package index', () => {
      expect(SwedishFromIndex).toBe(Swedish)
    })
    test('range of scores provided', () => {
      expect(Swedish.getGrade([43, 44])).toBe('4+')
      expect(Swedish.getGrade([71, 72])).toBe('7/7+')
      expect(Swedish.getGrade([12, 15])).toBe('2-/2')
      expect(Swedish.getGrade([44, 55])).toBe('4+/5+')
    })
  })

  describe('Get Grade Band', () => {
    test('gets Gradeband', () => {
      expect(Swedish.getGradeBand('1')).toEqual(GradeBands.BEGINNER)
      expect(Swedish.getGradeBand('10')).toEqual(GradeBands.EXPERT)
    })
  })
})
