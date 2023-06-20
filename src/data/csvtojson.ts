// To run script, in project root directory,
// run `yarn ts-node --esm src/data/csvtojson.ts`

import csv from 'csv-parser'
import * as fs from 'fs'
import { AidGrade, Boulder, Route, IceGrade } from '../scales'
import path from 'path'

const dataDir = path.join(process.cwd(), 'src', 'data')

async function getData<T> (pathCsv: any, pathJson, parseRow): Promise<T[]> {
  const data: T[] = []
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
function parseRowBoulder (row): Object {
  return {
    score: parseInt(row.Score, 10),
    v: row['V Scale'],
    font: row['Font Scale']
  }
}
export const BOULDER_GRADE_TABLE: Promise<Boulder[]> = getData(CSV_PATH_BOULDER, JSON_PATH_BOULDER, parseRowBoulder)

const CSV_PATH_ROUTES = path.join(dataDir, 'routes.csv')
const JSON_PATH_ROUTES = path.join(dataDir, 'routes.json')
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
export const ROUTE_GRADE_TABLE: Promise<Route[]> = getData(CSV_PATH_ROUTES, JSON_PATH_ROUTES, parseRowRoutes)

const CSV_PATH_ICE = path.join(dataDir, 'ice.csv')
const JSON_PATH_ICE = path.join(dataDir, 'ice.json')
function parseRowIce (row): Object {
  return {
    score: parseInt(row.Score, 10),
    wi: row.WI,
    ai: row.AI
  }
}
export const ICE_GRADE_TABLE: Promise<IceGrade[]> = getData(CSV_PATH_ICE, JSON_PATH_ICE, parseRowIce)

const CSV_PATH_AID = path.join(dataDir, 'aid.csv')
const JSON_PATH_AID = path.join(dataDir, 'aid.json')
function parseRowAid (row): Object {
  return {
    score: parseInt(row.Score, 10),
    aid: row.Aid
  }
}
export const AID_GRADE_TABLE: Promise<AidGrade[]> = getData(CSV_PATH_AID, JSON_PATH_AID, parseRowAid)
