import { getScoreForGrade } from '../vyds'

describe('YDS', () => {
  test('5.9 > 5.8', () => {
    expect(getScoreForGrade('5.9')).toBeGreaterThan(getScoreForGrade('5.8'))
  })

  test('5.10b > 5.10a', () => {
    expect(getScoreForGrade('5.10b')).toBeGreaterThan(getScoreForGrade('5.10a'))
  })

  test('5.11 > 5.10+', () => {
    expect(getScoreForGrade('5.11')).toBeGreaterThan(getScoreForGrade('5.10+'))
  })
})
