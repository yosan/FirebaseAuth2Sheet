import { google, sheets_v4, drive_v3 } from 'googleapis'
import * as admin from 'firebase-admin'
import * as moment from 'moment-timezone'
import { program } from 'commander'

const scopes = [ 'https://www.googleapis.com/auth/drive.file' ]

const writeThreashold = 5000
const limitPerRequest = 1000
const sheetTitle = 'auth'
const fields: (keyof admin.auth.UserRecord)[] = [
  'uid',
  'email',
  'emailVerified',
  'disabled',
  'metadata',
  'tokensValidAfterTime',
  'providerData'
]

program
  .requiredOption('-f, --folder <folderId>', 'folder ID to output')
  .requiredOption('-k, --key <keyFilePath>', 'path to service acccount key json file')
  .parse(process.argv)

const folderId: string = program.folder
const keyFile: string =  program.key

const credentials = require(keyFile)

admin.initializeApp({
  credential: admin.credential.cert(credentials)
})

const moveFileToFoler = async (fileId: string, folderId: string, drive: drive_v3.Drive) => {
  await drive.files.update({addParents: folderId, removeParents: 'root', fileId})
}

const createNewSheet = async (title: string, sheetTitle: string, sheets: sheets_v4.Sheets) => {
  const spreadsheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title
      },
      sheets: [{
        properties: {
          title: sheetTitle
        },
        data: [{
          rowData: [{
            values: fields.map(field => {
              return {
                userEnteredValue: {
                  stringValue: field
                }
              }
            })
          }]
        }]
      }]
    }
  })
  return spreadsheet.data.spreadsheetId
}

const writeRecords = async (spreadsheetId: string, sheetTitle: string, records: admin.auth.UserRecord[], sheets: sheets_v4.Sheets) => {
  console.log(`write ${records.length} records.`)
  sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetTitle,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: records.map(record => {
        return fields.map(field => {
          const value = record[field]
          if (typeof value === 'object') {
            return JSON.stringify(value)
          } else {
            return value
          }
        })
      })
    }
  })
}

const filterRecords = (records: admin.auth.UserRecord[]) => {
  return records.filter(record => record.email && !record.disabled)
}

const listUsersByPage = async (limitPerRequest: number, fbAuth: admin.auth.Auth, callback: (records: admin.auth.UserRecord[]) => void) => {
  let pageToken: string | undefined
  do {
    const result = await fbAuth.listUsers(limitPerRequest, pageToken)
    callback(result.users)
    pageToken = result.pageToken
  } while (pageToken !== undefined)
}

const exportAuth = async (spreadsheetId: string, sheetTitle: string, limitPerRequest: number, fbAuth: admin.auth.Auth, sheets: sheets_v4.Sheets) => {
  let recordsBuffer: admin.auth.UserRecord[] = []

  await listUsersByPage(limitPerRequest, fbAuth, records => {
    const filtered = filterRecords(records)
    recordsBuffer = recordsBuffer.concat(filtered)
    if (recordsBuffer.length >= writeThreashold) {
      writeRecords(spreadsheetId, sheetTitle, recordsBuffer, sheets)
      recordsBuffer = []
    }
  })

  writeRecords(spreadsheetId, sheetTitle, recordsBuffer, sheets)
}

const main = async () => {
  console.log('start exporting...')

  const auth = await google.auth.getClient({
    credentials,
    scopes
  })
  const sheets = google.sheets({version: 'v4', auth})
  const drive = google.drive({version: 'v3', auth})
  const fbAuth = admin.auth()

  const fileName = moment().tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ss')
  const spreadsheetId = await createNewSheet(fileName, sheetTitle, sheets)

  if (!spreadsheetId) {
    throw new Error('Failed to create spreadsheet')
  }

  await exportAuth(spreadsheetId, sheetTitle, limitPerRequest, fbAuth, sheets)
  await moveFileToFoler(spreadsheetId, folderId, drive)

  console.log('finish!!')
  process.exit(0)
}

main().catch(e => console.error(e))