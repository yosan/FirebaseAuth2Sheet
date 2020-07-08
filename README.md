# FirebaseAuth2Sheet

Export Firebase Auth to Google Spreadsheet

# Usage

1. Create service account assuming "Firebase Authentication Viewer" role

Create servcie account from GCP console.

<img width="940" alt="create-service-account" src="https://user-images.githubusercontent.com/1908575/86920546-e91b6b00-c164-11ea-9271-1b0c70c331b5.png">

Assume "Firebase Authentication Viewer" role.

<img width="940" alt="assume-role" src="https://user-images.githubusercontent.com/1908575/86920972-6ba42a80-c165-11ea-8f8c-687c57741103.png">

2. Create key file of service account and place it at the root of project

<img width="561" alt="create-key-file" src="https://user-images.githubusercontent.com/1908575/86921040-7b237380-c165-11ea-986a-65e2d3d52597.png">

3. Enable APIs

Google Drive API

https://console.developers.google.com/apis/library/drive.googleapis.com?

<img width="670" alt="google-drive-api" src="https://user-images.githubusercontent.com/1908575/86921090-8d9dad00-c165-11ea-9980-35e865653b49.png">

Google Sheets API

https://console.developers.google.com/apis/library/sheets.googleapis.com

<img width="670" alt="google-sheets-api" src="https://user-images.githubusercontent.com/1908575/86921129-9aba9c00-c165-11ea-8680-09e2c573c9a7.png">

4. Share drive

You can share drive with service account like user account

<img width="643" alt="share-drive" src="https://user-images.githubusercontent.com/1908575/86921153-a312d700-c165-11ea-93e1-26d2911f1d5e.png">

5. Execute commands

```bash
$ yarn
$ yarn build
$ node index.js -f <folderID> -k <keyFilePath>
```

e.g.) `node index.js -f 1234567890ABCDFGHIJKLMNOPQRSTU-00 -k ./key.json`

folderID can be seen in URL

<img width="585" alt="folderid-url" src="https://user-images.githubusercontent.com/1908575/86921347-f4bb6180-c165-11ea-8dca-8ea88f903d1c.png">
