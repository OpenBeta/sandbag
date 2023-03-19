import { GradeBands } from '../../GradeBands'
import { UIAA } from '../../scales'

describe('UIAA', () => {
  describe('Get Score', () => {
    test('9- > 4+', () => {
      const lowGrade = UIAA.getScore('4+')
      const highGrade = UIAA.getScore('9-')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('6 > 5+', () => {
      const highGrade = UIAA.getScore('6')
      const lowGrade = UIAA.getScore('5+')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('6+ > 6-', () => {
      const highGrade = UIAA.getScore('6+')
      const lowGrade = UIAA.getScore('6-')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
    })

    test('8- > 7/7+', () => {
      const highGrade = UIAA.getScore('8-')
      const lowGrade = UIAA.getScore('7/7+')
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
    test('invalid plus modifier', () => {
      const invalidGrade = UIAA.getScore('+5')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: +5 for grade scale UIAA'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid minus modifier', () => {
      const invalidGrade = UIAA.getScore('-5')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: -5 for grade scale UIAA'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('extra slash grade', () => {
      const invalidGrade = UIAA.getScore('5/5+/6-')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: 5/5+/6- for grade scale UIAA'
      )
      expect(invalidGrade).toEqual(-1)
    })
    test('not UIAA scale', () => {
      const invalidGrade = UIAA.getScore('V11')
      expect(console.warn).toHaveBeenCalledWith(
        'Unexpected grade format: V11 for grade scale UIAA'
      )
      expect(invalidGrade).toEqual(-1)
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(UIAA.getGrade(0)).toBe('1')
    })

    test('top of range', () => {
      expect(UIAA.getGrade(1000)).toBe('12')
    })

    test('single score provided', () => {
      expect(UIAA.getGrade(34)).toBe('3')
      expect(UIAA.getGrade(38)).toBe('4+')
      expect(UIAA.getGrade(52)).toBe('5+')
    })
    test('range of scores provided', () => {
      expect(UIAA.getGrade([45, 46])).toBe('5-/5')
      expect(UIAA.getGrade([65, 66])).toBe('7/7+')
      expect(UIAA.getGrade([16, 17])).toBe('2')
    })
  })

  describe('Get Grade Band', () => {
    test('gets Gradeband', () => {
      expect(UIAA.getGradeBand('1')).toEqual(GradeBands.BEGINNER)
      expect(UIAA.getGradeBand('9+')).toEqual(GradeBands.EXPERT)
    })
  })
})
