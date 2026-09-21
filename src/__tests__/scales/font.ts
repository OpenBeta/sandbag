import { GradeBands } from '../../GradeBands'
import { Font } from '../../scales'

describe('Font', () => {
  describe('Get Score', () => {
    test('9a > 5+', () => {
      const lowGrade = Font.getScore('5+')
      const highGrade = Font.getScore('9a')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('1+ > 1', () => {
      const highGrade = Font.getScore('1+')
      const lowGrade = Font.getScore('1')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('2/2+ > 1, one grade away', () => {
      const highGrade = Font.getScore('2/2+')
      const lowGrade = Font.getScore('1')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
    })

    test('4 > 3+/4-, one grade away', () => {
      const highGrade = Font.getScore('4')
      const lowGrade = Font.getScore('3+/4-')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
    })

    describe('invalid grade format', () => {
      jest.spyOn(console, 'warn').mockImplementation()
      beforeEach(() => {
        jest.clearAllMocks()
      })
      test('extra plus modifier', () => {
        const invalidGrade = Font.getScore('5a++')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5a++ for grade scale font')
        expect(invalidGrade).toEqual(-1)
      })
      test('invalid minus modifier', () => {
        const invalidGrade = Font.getScore('5a-')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5a- for grade scale font')
        expect(invalidGrade).toEqual(-1)
      })
      test('extra slash grade', () => {
        const invalidGrade = Font.getScore('5/5+/6-')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5/5+/6- for grade scale font')

        expect(invalidGrade).toEqual(-1)
      })
      test('extra slash', () => {
        const invalidGrade = Font.getScore('5+/')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5+/ for grade scale font')

        expect(invalidGrade).toEqual(-1)
      })
      test('not font scale', () => {
        const invalidGrade = Font.getScore('v11')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: v11 for grade scale font')

        expect(invalidGrade).toEqual(-1)
      })
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(Font.getGrade(0)).toBe('1')
    })

    test('top of range', () => {
      expect(Font.getGrade(1000)).toBe('9c+')
    })

    test('single score provided', () => {
      expect(Font.getGrade(34)).toBe('6b+')
      expect(Font.getGrade(34.5)).toBe('6b+')
      expect(Font.getGrade(35)).toBe('6b+')
    })
    test('range of scores provided', () => {
      expect(Font.getGrade([0.5, 2])).toBe('1/1+')
      expect(Font.getGrade([8, 12])).toBe('2+/3')
      expect(Font.getGrade([16, 17])).toBe('4-')
    })
  })

  describe('Get Grade Band', () => {
    test('gets Gradeband', () => {
      expect(Font.getGradeBand('1')).toEqual(GradeBands.BEGINNER)
      expect(Font.getGradeBand('9c+')).toEqual(GradeBands.EXPERT)
    })
  })
})
