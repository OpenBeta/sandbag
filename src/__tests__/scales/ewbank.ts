import { GradeBands } from '../../GradeBands'
import { Ewbank } from '../../scales'

describe('Ewbank', () => {
  describe('Get Score', () => {
    test('34 > 16', () => {
      const lowGrade = Ewbank.getScore('16')
      const highGrade = Ewbank.getScore('34')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('16/17 > 16, one grade away', () => {
      const highGrade = Ewbank.getScore('16/17')
      const lowGrade = Ewbank.getScore('16')
      expect(highGrade[0] < lowGrade[1] && highGrade[0] > lowGrade[0])
      expect(highGrade[1]).toBeGreaterThan(lowGrade[1])
    })
  })

  describe('invalid grade format', () => {
    jest.spyOn(console, 'warn').mockImplementation()
    beforeEach(() => {
      jest.clearAllMocks()
    })
    test('plus modifier', () => {
      const invalidGrade = Ewbank.getScore('20+')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 20+ for grade scale Ewbank')
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid minus modifier', () => {
      const invalidGrade = Ewbank.getScore('5-')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5- for grade scale Ewbank')
      expect(invalidGrade).toEqual(-1)
    })
    test('extra slash grade', () => {
      const invalidGrade = Ewbank.getScore('5/6/7')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5/6/7 for grade scale Ewbank')
      expect(invalidGrade).toEqual(-1)
    })
    test('extra slash', () => {
      const invalidGrade = Ewbank.getScore('5/')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5/ for grade scale Ewbank')
      expect(invalidGrade).toEqual(-1)
    })
    test('not Ewbank scale', () => {
      const invalidGrade = Ewbank.getScore('v11')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: v11 for grade scale Ewbank')
      expect(invalidGrade).toEqual(-1)
    })
    test('not Ewbank scale', () => {
      const invalidGrade = Ewbank.getScore('8a+')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 8a+ for grade scale Ewbank')
      expect(invalidGrade).toEqual(-1)
    })
    test('not Ewbank scale', () => {
      const invalidGrade = Ewbank.getScore('5.8')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5.8 for grade scale Ewbank')
      expect(invalidGrade).toEqual(-1)
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(Ewbank.getGrade(0)).toBe('1')
    })

    test('top of range', () => {
      expect(Ewbank.getGrade(1000)).toBe('40')
    })

    test('single score provided', () => {
      expect(Ewbank.getGrade(34)).toBe('12')
      expect(Ewbank.getGrade(34.5)).toBe('12')
      expect(Ewbank.getGrade(35)).toBe('12')
    })
    test('range of scores provided', () => {
      expect(Ewbank.getGrade([0.5, 5])).toBe('1/2')
      expect(Ewbank.getGrade([9, 10])).toBe('2/3')
      expect(Ewbank.getGrade([16, 17])).toBe('6')
    })
  })

  describe('Get Grade Band', () => {
    test('gets Gradeband', () => {
      expect(Ewbank.getGradeBand('1')).toEqual(GradeBands.BEGINNER)
      expect(Ewbank.getGradeBand('31')).toEqual(GradeBands.EXPERT)
    })
  })
})
