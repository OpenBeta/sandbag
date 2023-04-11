import { Aid } from '../../scales'

describe('Aid', () => {
  describe('Get Score', () => {
    describe('valid grade formats', () => {
      jest.spyOn(console, 'warn').mockImplementation()
      beforeEach(() => {
        jest.clearAllMocks()
      })

      test('basic grade A', () => {
        const score = Aid.getScore('A0')
        expect(console.warn).not.toHaveBeenCalled()
        expect(score).not.toEqual(-1)
      })

      test('basic grade C', () => {
        const score = Aid.getScore('C0')
        expect(console.warn).not.toHaveBeenCalled()
        expect(score).not.toEqual(-1)
      })

      test('valid + modifier', () => {
        const score = Aid.getScore('A3+')
        expect(console.warn).not.toHaveBeenCalled()
        expect(score).not.toEqual(-1)
      })

      test.failing('mandatory free', () => {
        const score = Aid.getScore('5.9 A0')
        expect(console.warn).not.toHaveBeenCalled()
        expect(score).not.toEqual(-1)
      })
    })

    describe('invalid grade formats', () => {
      jest.spyOn(console, 'warn').mockImplementation()
      beforeEach(() => {
        jest.clearAllMocks()
      })

      test('A6 out of range', () => {
        const score = Aid.getScore('A6')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: A6 for grade scale Aid')
        expect(score).toEqual(-1)
      })

      test('invalid minus modifier', () => {
        const score = Aid.getScore('A3-')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: A3- for grade scale Aid')
        expect(score).toEqual(-1)
      })

      test('invalid plus modifier', () => {
        const score = Aid.getScore('A5+')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: A5+ for grade scale Aid')
        expect(score).toEqual(-1)
      })

      test('plain YDS grade', () => {
        const score = Aid.getScore('5.9')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5.9 for grade scale Aid')
        expect(score).toEqual(-1)
      })

      test('slash grade', () => {
        const score = Aid.getScore('A0/A1')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: A0/A1 for grade scale Aid')
        expect(score).toEqual(-1)
      })

      test('not aid scale', () => {
        const score = Aid.getScore('v11')
        expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: v11 for grade scale Aid')
        expect(score).toEqual(-1)
      })
    })

    describe('correct relative scores', () => {
      test('C0 = A0', () => {
        const aGrade = Aid.getScore('A0')
        const cGrade = Aid.getScore('C0')
        expect(cGrade).toEqual(aGrade)
      })

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

      test('C4 > C3+', () => {
        const lowGrade = Aid.getScore('A3+')
        const highGrade = Aid.getScore('A4')
        expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
      })

      test('C4 > A3+', () => {
        const lowGrade = Aid.getScore('A3+')
        const highGrade = Aid.getScore('A4')
        expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
      })

      test('C5 = A5', () => {
        const aGrade = Aid.getScore('A5')
        const cGrade = Aid.getScore('C5')
        expect(cGrade).toEqual(aGrade)
      })
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(Aid.getGrade(0)).toBe('A0')
    })

    test('top of range', () => {
      expect(Aid.getGrade(Infinity)).toBe('A5')
    })
  })
})
