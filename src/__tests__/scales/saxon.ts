import { GradeBands } from '../../GradeBands'
import { Saxon } from '../../scales'

describe('Saxon', () => {
  describe('Get Score', () => {
    test('7a > 5', () => {
      const highGrade = Saxon.getScore('7a')
      const lowGrade = Saxon.getScore('5')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('10c > 8b', () => {
      const highGrade = Saxon.getScore('10c')
      const lowGrade = Saxon.getScore('8b')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('9b > 9a', () => {
      const highGrade = Saxon.getScore('9b')
      const lowGrade = Saxon.getScore('9a')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
    })

    test('3 > 2', () => {
      const highGrade = Saxon.getScore('3')
      const lowGrade = Saxon.getScore('2')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      if (lowGrade[1] !== undefined && highGrade[1] !== undefined) {
        expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
      }
    })
  })

  describe('Invalid grade format', () => {
    jest.spyOn(console, 'warn').mockImplementation()
    beforeEach(() => {
      jest.clearAllMocks()
    })
    test('plus modifier', () => {
      const invalidGrade = Saxon.getScore('20+')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 20+ for grade scale Saxon')
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid plus modifier', () => {
      const invalidGrade = Saxon.getScore('+5')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: +5 for grade scale Saxon'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid minus modifier', () => {
      const invalidGrade = Saxon.getScore('-5')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: -5 for grade scale Saxon'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('extra slash grade', () => {
      const invalidGrade = Saxon.getScore('5/5+/6-')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: 5/5+/6- for grade scale Saxon'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('not Saxon scale', () => {
      const invalidGrade = Saxon.getScore('V11')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: V11 for grade scale Saxon'
      )
      expect(invalidGrade).toEqual(-1)
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(Saxon.getGrade(0)).toBe('1')
    })

    test('top of range', () => {
      expect(Saxon.getGrade(1000)).toBe('13c')
    })

    test('single score provided', () => {
      expect(Saxon.getGrade(34)).toBe('3')
      expect(Saxon.getGrade(38)).toBe('4')
      expect(Saxon.getGrade(52)).toBe('7a')
    })
    test('range of scores provided', () => {
      expect(Saxon.getGrade([45, 46])).toBe('5/6')
      expect(Saxon.getGrade([65, 66])).toBe('8b/8c')
      expect(Saxon.getGrade([16, 17])).toBe('2')
    })
  })

  describe('Get Grade Band', () => {
    test('gets Gradeband', () => {
      expect(Saxon.getGradeBand('1')).toEqual(GradeBands.BEGINNER)
      expect(Saxon.getGradeBand('11c')).toEqual(GradeBands.EXPERT)
    })
  })
})
