import { Aid } from '../../scales'

describe('Aid', () => {
  describe('Get Score', () => {
    test('A3+ > A1', () => {
      const lowGrade = Aid.getScore('A1')
      const highGrade = Aid.getScore('A3+')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('A4 > A3+', () => {
      const lowGrade = Aid.getScore('A3+')
      const highGrade = Aid.getScore('A4')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    describe('invalid grade format', () => {
      jest.spyOn(console, 'warn').mockImplementation()
      beforeEach(() => {
        jest.clearAllMocks()
      })
      test('plain YDS grade', () => {
        const invalidGrade = Aid.getScore('5.9')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5.9 for grade scale Aid')
        expect(invalidGrade).toEqual(-1)
      })
      test('invalid minus modifier', () => {
        const invalidGrade = Aid.getScore('A3-')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: A3- for grade scale Aid')
        expect(invalidGrade).toEqual(-1)
      })
      test('extra slash grade', () => {
        const invalidGrade = Aid.getScore('5.8 A0')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5.8 A0 for grade scale Aid')
        expect(invalidGrade).toEqual(-1)
      })
      test('extra slash', () => {
        const invalidGrade = Aid.getScore('A0/')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: A0/ for grade scale Aid')

        expect(invalidGrade).toEqual(-1)
      })
      test('not aid scale', () => {
        const invalidGrade = Aid.getScore('v11')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: v11 for grade scale Aid')

        expect(invalidGrade).toEqual(-1)
      })
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(Aid.getGrade(0)).toBe('A0')
    })

    test('top of range', () => {
      expect(Aid.getGrade(1000)).toBe('A5')
    })

    test('single score provided', () => {
      expect(Aid.getGrade(34)).toBe('A5')
      expect(Aid.getGrade(34.5)).toBe('A5')
      expect(Aid.getGrade(35)).toBe('A5')
    })
    test('range of scores provided', () => {
      expect(Aid.getGrade([0.5, 2])).toBe('A0')
      expect(Aid.getGrade([8, 12])).toBe('A2/A2+')
      expect(Aid.getGrade([16, 17])).toBe('A3')
    })
  })
})
