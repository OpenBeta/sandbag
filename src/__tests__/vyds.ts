import { getScoreForGrade } from '../vyds'

describe('YDS', () => {
  test('is delicious', () => {
    expect(getScoreForGrade('5.3')).toStrictEqual(1)
  })
})
