# FirebaseAuth2Sheet

Export Firebase Auth to Google Spreadsheet

# Usage

## 1. Create service account assuming "Firebase Authentication Viewer" role

Create servcie account from GCP console.

<kbd>  
  <img width="940" alt="create-service-account" src="https://user-images.githubusercontent.com/1908575/86923362-e589e300-c168-11ea-8131-f60912e1a260.png">
</kbd>

Assume "Firebase Authentication Viewer" role.

<kbd>
  <img width="940" alt="assume-role" src="https://user-images.githubusercontent.com/1908575/86923446-fdf9fd80-c168-11ea-839a-1c60c157b179.png">
</kbd>

## 2. Create key file of service account and place it at the root of project

<kbd>
  <img width="542" alt="create-key-file" src="https://user-images.githubusercontent.com/1908575/86923561-2c77d880-c169-11ea-8424-647f4e633baa.png">
</kbd>

## 3. Enable APIs

### Google Drive API

https://console.developers.google.com/apis/library/drive.googleapis.com?

<kbd>
  <img width="670" alt="google-drive-api" src="https://user-images.githubusercontent.com/1908575/86921090-8d9dad00-c165-11ea-9980-35e865653b49.png">
</kbd>

### Google Sheets API

https://console.developers.google.com/apis/library/sheets.googleapis.com

<kbd>
  <img width="670" alt="google-sheets-api" src="https://user-images.githubusercontent.com/1908575/86921129-9aba9c00-c165-11ea-8680-09e2c573c9a7.png">
</kbd>

## 4. Share drive

You can share drive with service account like user account

<kbd>
  <img width="612" alt="share-drive" src="https://user-images.githubusercontent.com/1908575/86923663-4d402e00-c169-11ea-9a33-cb3898672cdb.png">
</kbd>

## 5. Execute commands

```bash
$ yarn
$ yarn build
$ node index.js -f <folderID> -k <keyFilePath>
```

e.g.) `node index.js -f 1234567890ABCDFGHIJKLMNOPQRSTU-00 -k ./key.json`

folderID can be seen in URL

<kbd>
  <img width="585" alt="folderid-url" src="https://user-images.githubusercontent.com/1908575/86921347-f4bb6180-c165-11ea-8dca-8ea88f903d1c.png">
</kbd>
