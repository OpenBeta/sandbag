const ypsRegex = /^5\.([0-9]{1,2})([a-zA-Z])?([/+])?([/-])?([a-zA-Z]?)/
const vGradeRegex = /^V([0-9]{1,2})([/+])?([/-])?([0-9]{1,2})?/i
const vGradeIrregular = /^V-([a-zA-Z]*)/i

/**
 * Calculate a number score for the YDS scale to make it easier to sort
 * 10x number + 2 for each letter + 1 for a slash grade or +
 *
 * 5.11a = 112 // 110 for 11, 2 for "a"
 * 5.11b/c = 113 // 110 for 11, 4 for "b", 1 for "/b"
 * 5.9+ = 91 // 90 for 9, 0 for the letter & 1 for "+"
 *
 * Bouldering starts at 1000
 * V-easy = 1000
 * V0 = 1012 // 1000
 *
 * @param {string} yds
 * @returns {number} score or -1 if format is invalid
 */
export const getScoreForGrade = (grade: string): number => {
  const isYds = grade.match(ypsRegex)
  const isVGrade = (grade.match(vGradeRegex) !== null) || grade.match(vGradeIrregular)

  // If there isn't a match sort it to the bottom
  if ((isVGrade === null) && (isYds === null)) {
    console.warn(`Unexpected grade format: ${grade}`)
    return 0
  }
  if (isYds !== null) {
    return getScoreForYdsGrade(isYds)
  }
  if (isVGrade !== null) {
    return getScoreForVGrade(grade.match(vGradeRegex), grade.match(vGradeIrregular))
  }
  return -1
}

const getScoreForVGrade = (match: RegExpMatchArray|null, irregularMatch: RegExpMatchArray|null): number => {
  let score = 0
  if (match !== null) {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const [_, num, hasPlus, hasMinus, secondNumber] = match
    const minus = (hasMinus !== undefined && secondNumber === undefined) ? -1 : 0 // check minus is not a V1-2
    const plus = (hasMinus !== undefined && secondNumber !== undefined) || (hasPlus !== undefined) ? 1 : 0 // grade V1+ the same as V1-2
    score = (parseInt(num, 10) + 1) * 10 + minus + plus // V0 = 10, leave room for V-easy to be below 0
  } else if (irregularMatch !== null) {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const [_, group] = irregularMatch
    switch (group) {
      case 'easy':
        score = 1
        break
      default:
        score = 0
        break
    }
  }
  return score + 1000
}

const getScoreForYdsGrade = (match: RegExpMatchArray): number => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [_, num, firstLetter, plusOrSlash, hasMinus] = match
  const letterScore = firstLetter !== undefined
    ? (firstLetter.toLowerCase().charCodeAt(0) - 96) * 2
    : 0
  const plusSlash = plusOrSlash === undefined ? 0 : 1
  const minus = hasMinus !== undefined ? -1 : 0

  return parseInt(num, 10) * 10 + letterScore + plusSlash + minus
}
