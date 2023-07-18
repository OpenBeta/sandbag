/**
 * What sort of climb is this? Routes can combine these fields, which is why
 * this is not an enumeration.
 * For example, a route may be a sport route, but also a top rope route.
 */
export interface DisciplineType {
  /** https://en.wikipedia.org/wiki/Traditional_climbing */
  trad?: boolean
  /** https://en.wikipedia.org/wiki/Sport_climbing */
  sport?: boolean
  /** https://en.wikipedia.org/wiki/Bouldering */
  bouldering?: boolean
  /** https://en.wikipedia.org/wiki/Deep-water_soloing */
  deepwatersolo?: boolean
  /** https://en.wikipedia.org/wiki/Alpine_climbing */
  alpine?: boolean
  /** https://en.wikipedia.org/wiki/Ice_climbing */
  snow?: boolean
  /** https://en.wikipedia.org/wiki/Ice_climbing */
  ice?: boolean
  /** https://en.wikipedia.org/wiki/Mixed_climbing */
  mixed?: boolean
  /** https://en.wikipedia.org/wiki/Aid_climbing */
  aid?: boolean
  /** https://en.wikipedia.org/wiki/Top_rope_climbing */
  tr?: boolean
}

export const validDisciplines = [
  'trad',
  'sport',
  'bouldering',
  'deepwatersolo',
  'alpine',
  'snow',
  'ice',
  'mixed',
  'aid',
  'tr'
]

/**
 * Perform runtime validation of climb discipline object
 * @param disciplineObj IClimbType
 */
export const sanitizeDisciplines = (disciplineObj: Partial<DisciplineType> | undefined): DisciplineType | undefined => {
  if (disciplineObj == null) return undefined

  const output = validDisciplines.reduce((acc, current) => {
    if (disciplineObj?.[current] != null) {
      acc[current] = disciplineObj[current]
    } else {
      acc[current] = false
    }
    return acc
  }, {})
  // @ts-expect-error
  if (disciplineObj?.boulder != null) {
    // @ts-expect-error
    output.bouldering = disciplineObj.boulder
  }
  return output as DisciplineType
}
