// To run script, in project root directory,
// run `yarn ts-node --esm src/data/csvtojson.ts`

import csv from 'csv-parser'
import * as fs from 'fs'
import { AidGrade, Boulder, Route, IceGrade } from '../scales'
import path from 'path'

const dataDir = path.join(process.cwd(), 'src', 'data')
/* Use 'unknown' for default band property as grade band is assigned in each individual grade scale.
 */

async function getData (pathCsv: any, pathJson, data, parseRow): Promise<any> {
  return await new Promise((resolve, reject) => {
    fs.createReadStream(pathCsv)
      .on('error', error => {
        console.warn('error in parsing:', error)
        reject(error)
      })
      .pipe(csv())
      .on('data', (row) => {
        data.push(parseRow(row))
      })
      .on('end', () => {
        const parsedData = JSON.stringify(data)
        fs.writeFileSync(pathJson, parsedData)

        resolve(data)
      })
  })
}

const CSV_PATH_BOULDER = path.join(dataDir, 'boulder.csv')
const JSON_PATH_BOULDER = path.join(dataDir, 'boulder.json')
const boulderGrades: Boulder[] = []
function parseRowBoulder (row): Object {
  return {
    score: parseInt(row.Score, 10),
    v: row['V Scale'],
    font: row['Font Scale']
  }
}
void getData(CSV_PATH_BOULDER, JSON_PATH_BOULDER, boulderGrades, parseRowBoulder)

const CSV_PATH_ROUTES = path.join(dataDir, 'routes.csv')
const JSON_PATH_ROUTES = path.join(dataDir, 'routes.json')
const routeGrades: Route[] = []
function parseRowRoutes (row): Object {
  return {
    score: parseInt(row.Score, 10),
    yds: row.Yosemite,
    french: row.French,
    uiaa: row.UIAA,
    ewbank: row.Ewbank,
    saxon: row.Saxon,
    norwegian: row.Norwegian
  }
}
void getData(CSV_PATH_ROUTES, JSON_PATH_ROUTES, routeGrades, parseRowRoutes)

const CSV_PATH_ICE = path.join(dataDir, 'ice.csv')
const JSON_PATH_ICE = path.join(dataDir, 'ice.json')
const iceGrades: IceGrade[] = []
function parseRowIce (row): Object {
  return {
    score: parseInt(row.Score, 10),
    wi: row.WI,
    ai: row.AI
  }
}
void getData(CSV_PATH_ICE, JSON_PATH_ICE, iceGrades, parseRowIce)

const CSV_PATH_AID = path.join(dataDir, 'aid.csv')
const JSON_PATH_AID = path.join(dataDir, 'aid.json')
const aidGrades: AidGrade[] = []
function parseRowAid (row): Object {
  return {
    score: parseInt(row.Score, 10),
    aid: row.Aid
  }
}
void getData(CSV_PATH_AID, JSON_PATH_AID, aidGrades, parseRowAid)
