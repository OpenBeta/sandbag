import { expect, test } from '@jest/globals'

// NOTE: these imports implicitly regenerate the JSON files that store the conversions.
import {
  BOULDER_GRADE_TABLE,
  ROUTE_GRADE_TABLE,
  ICE_GRADE_TABLE,
  AID_GRADE_TABLE
} from '../csvtojson'

describe.each([
  { table: BOULDER_GRADE_TABLE },
  { table: ROUTE_GRADE_TABLE },
  { table: ICE_GRADE_TABLE },
  { table: AID_GRADE_TABLE }
])('Grade tables are parsable', ({ table }) => {
  test('each table is an array', async () => {
    expect.hasAssertions() // double check that async tests run
    const TABLE = await table

    expect(TABLE).toBeInstanceOf(Array)

    expect(TABLE.length).toBeGreaterThan(1)
  })

  test('each table has a numeric score in first row', async () => {
    expect.hasAssertions() // double check that async tests run
    const TABLE = await table

    expect(TABLE[1]).toMatchObject(
      { score: expect.any(Number) }
    )
  })
})
