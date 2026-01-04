import { GradeBands } from '../../GradeBands'
import { IRCRA } from '../../scales'

describe('IRCRA', () => {
  describe('Get Score', () => {
    test('32 > 1', () => {
      const lowGrade = IRCRA.getScore('1')
      const highGrade = IRCRA.getScore('32')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('15 > 10', () => {
      const highGrade = IRCRA.getScore('15')
      const lowGrade = IRCRA.getScore('10')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('25 > 20', () => {
      const highGrade = IRCRA.getScore('25')
      const lowGrade = IRCRA.getScore('20')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })
  })

  describe('invalid grade format', () => {
    jest.spyOn(console, 'warn').mockImplementation()
    beforeEach(() => {
      jest.clearAllMocks()
    })
    test('invalid grade with letters', () => {
      const invalidGrade = IRCRA.getScore('5a')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5a for grade scale IRCRA')
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid grade with decimal', () => {
      const invalidGrade = IRCRA.getScore('15.5')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 15.5 for grade scale IRCRA')
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid grade with plus', () => {
      const invalidGrade = IRCRA.getScore('15+')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 15+ for grade scale IRCRA')
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid grade with minus', () => {
      const invalidGrade = IRCRA.getScore('15-')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 15- for grade scale IRCRA')
      expect(invalidGrade).toEqual(-1)
    })
    test('invalid grade with slash', () => {
      const invalidGrade = IRCRA.getScore('15/16')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 15/16 for grade scale IRCRA')
      expect(invalidGrade).toEqual(-1)
    })
    test('not IRCRA scale', () => {
      const invalidGrade = IRCRA.getScore('v11')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: v11 for grade scale IRCRA')
      expect(invalidGrade).toEqual(-1)
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(IRCRA.getGrade(0)).toBe('1')
    })

    test('top of range', () => {
      expect(IRCRA.getGrade(1000)).toBe('32')
    })

    test('single score provided', () => {
      expect(IRCRA.getGrade(34)).toBe('9')
      expect(IRCRA.getGrade(34.5)).toBe('9')
      expect(IRCRA.getGrade(35)).toBe('9')
    })
    test('range of scores provided', () => {
      expect(IRCRA.getGrade([0.5, 2])).toBe('1')
      expect(IRCRA.getGrade([8, 12])).toBe('2/4')
      expect(IRCRA.getGrade([16, 17])).toBe('5')
    })
  })

  describe('Get Grade Band', () => {
    test('gets Gradeband', () => {
      expect(IRCRA.getGradeBand('1')).toEqual(GradeBands.BEGINNER)
      expect(IRCRA.getGradeBand('32')).toEqual(GradeBands.EXPERT)
    })
  })

  describe('Is Type', () => {
    test('valid IRCRA grades', () => {
      expect(IRCRA.isType('1')).toBe(true)
      expect(IRCRA.isType('15')).toBe(true)
      expect(IRCRA.isType('32')).toBe(true)
    })

    test('invalid IRCRA grades', () => {
      expect(IRCRA.isType('5a')).toBe(false)
      expect(IRCRA.isType('15.5')).toBe(false)
      expect(IRCRA.isType('15+')).toBe(false)
      expect(IRCRA.isType('15-')).toBe(false)
      expect(IRCRA.isType('15/16')).toBe(false)
      expect(IRCRA.isType('v11')).toBe(false)
    })
  })
})
