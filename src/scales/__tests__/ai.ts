import { AI } from '../../scales'

describe('AI', () => {
  describe('valid grade formats', () => {
    // Check that no warnings are raised and that the score is not -1
    // Don't check for correct values of score, that is separate
    jest.spyOn(console, 'warn').mockImplementation()
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('AI1', () => {
      const score = AI.getScore('AI1')
      expect(console.warn).not.toHaveBeenCalled()
      expect(score).not.toEqual(-1)
    })

    test('valid + modifier', () => {
      const score = AI.getScore('AI4+')
      expect(console.warn).not.toHaveBeenCalled()
      expect(score).not.toEqual(-1)
    })

    test.failing('slash grade', () => {
      const score = AI.getScore('AI1/AI2')
      expect(console.warn).not.toHaveBeenCalledWith()
      expect(score).not.toEqual(-1)
    })

    test('highest grade', () => {
      const score = AI.getScore('AI13+')
      expect(console.warn).not.toHaveBeenCalledWith()
      expect(score).not.toEqual(-1)
    })
  })

  describe('invalid grade formats', () => {
    jest.spyOn(console, 'warn').mockImplementation()
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('AI14 out of range', () => {
      const score = AI.getScore('AI14')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: AI14 for grade scale AI')
      expect(score).toEqual(-1)
    })

    test('invalid minus modifier', () => {
      const score = AI.getScore('AI1-')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: AI1- for grade scale AI')
      expect(score).toEqual(-1)
    })

    test('invalid plus modifier', () => {
      const score = AI.getScore('AI1+')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: AI1+ for grade scale AI')
      expect(score).toEqual(-1)
    })

    test('plain YDS grade', () => {
      const score = AI.getScore('5.9')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: 5.9 for grade scale AI')
      expect(score).toEqual(-1)
    })

    test('not aid scale', () => {
      const score = AI.getScore('v11')
      expect(console.warn).toHaveBeenCalledWith('Unexpected grade format: v11 for grade scale AI')
      expect(score).toEqual(-1)
    })
  })

  describe('correct relative scores', () => {
    test('AI4+ > AI4', () => {
      const lowGrade = AI.getScore('AI4')
      const highGrade = AI.getScore('AI4+')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })

    test('AI4 > AI1', () => {
      const lowGrade = AI.getScore('AI1')
      const highGrade = AI.getScore('AI4')
      expect(highGrade[0]).toBeGreaterThan(lowGrade[1])
    })
  })

  describe('Get Grade', () => {
    test('bottom of range', () => {
      expect(AI.getGrade(0)).toBe('AI1')
    })

    test('top of range', () => {
      expect(AI.getGrade(Infinity)).toBe('AI13+')
    })
  })
})
