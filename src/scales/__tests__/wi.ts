import { WI } from '../../scales'

describe('WI', () => {
  describe('valid grade formats', () => {
    // Check that no warnings are raised and that the score is not -1
    // Don't check for correct values of score, that is separate
    jest.spyOn(console, 'warn').mockImplementation()
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('WI1', () => {
      const score = WI.getScore('WI1')
      expect(console.warn).not.toHaveBeenCalled()
      expect(score).not.toEqual(-1)
    })

    test('valid + modifier', () => {
      const score = WI.getScore('WI4+')
      expect(console.warn).not.toHaveBeenCalled()
      expect(score).not.toEqual(-1)
    })

    test.failing('slash grade', () => {
      const score = WI.getScore('WI1/WI2')
      expect(console.warn).not.toHaveBeenCalledWith()
      expect(score).not.toEqual(-1)
    })

    test('highest grade', () => {
      const score = WI.getScore('WI13+')
      expect(console.warn).not.toHaveBeenCalledWith()
      expect(score).not.toEqual(-1)
    })
  })

  describe('invalid grade formats', () => {
    jest.spyOn(console, 'warn').mockImplementation()
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('WI14 out of range', () => {
      const score = WI.getScore('WI14')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: WI14 for grade scale WI')
      expect(score).toEqual(-1)
    })

    test('invalid minus modifier', () => {
      const score = WI.getScore('WI1-')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: WI1- for grade scale WI')
      expect(score).toEqual(-1)
    })

    test('invalid plus modifier', () => {
      const score = WI.getScore('WI1+')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: WI1+ for grade scale WI')
      expect(score).toEqual(-1)
    })

    test('plain YDS grade', () => {
      const score = WI.getScore('5.9')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5.9 for grade scale WI')
      expect(score).toEqual(-1)
    })

    test('not WI scale', () => {
      const score = WI.getScore('v11')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: v11 for grade scale WI')
      expect(score).toEqual(-1)
    })
  })

  describe('correct relative scores', () => {
    test('WI4+ > WI4', () => {
      const lowGrade = WI.getScore('WI4')
      const highGrade = WI.getScore('WI4+')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('WI4 > WI1', () => {
      const lowGrade = WI.getScore('WI1')
      const highGrade = WI.getScore('WI4')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(WI.getGrade(0)).toBe('WI1')
    })

    test('top of range', () => {
      expect(WI.getGrade(Infinity)).toBe('WI13+')
    })
  })
})
