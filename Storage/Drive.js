const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const colors = require('colors');

let InputCallback = () => {};
exports.WaitingForInput = false;
/**
 * @param {Function} callback 
 */
exports.WaitingForInputCallback = function(callback){
    InputCallback = callback;
};

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';


// // Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//     if (err) return console.log('Error loading client secret file:', err);
//     // Authorize a client with credentials, then call the Google Drive API.
//     authorize(JSON.parse(content), listLastFiles);
// });

class Project{

    /**
     * @param {String} credentialsPath Path to file with credentials
     * @param {function(exports.Project)} callback The callback function
     */
    constructor(credentialsPath = "credentials.json", callback){
        // Load client secrets from a local file.
        fs.readFile(credentialsPath, (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            this.credentials = JSON.parse(content)
            this.authorize(() => {callback(this)})
        });
    }

    
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {function} callback The callback to call with the authorized client.
     */
    authorize(callback) {
        exports.authorize(this.credentials, auth => {
            this.auth = auth;
            callback();
        })
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    getAccessToken(callback){
        exports.getAccessToken(this.auth, callback)
    }

    /**
     * List of last 10 files
     */
    listLastFiles(){
        exports.listLastFiles(this.auth)
    }
        
    /**
     * List of directories
     */
    getDirectories(){
        exports.getDirectories(this.auth)
    }

    async getFile(ID){
        return await exports.getFile(this.auth, ID)
    }
}
exports.Project = Project;


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}
exports.authorize = authorize

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    exports.WaitingForInput = true;
    console.log('Authorize this app by visiting this url:\n' + authUrl.green) + '\n\n';
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        InputCallback()
        exports.WaitingForInput = false;
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
        });
    });
}
exports.getAccessToken = getAccessToken

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLastFiles(auth) {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    });
}
exports.listLastFiles = listLastFiles;

/**
 * List of directories
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getDirectories(auth) {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.folder'",
        fields: 'nextPageToken, files(id, name)'
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const folders = res.data.files;
        if (folders.length) {
            console.log('Folders:');
            folders.map((folders) => {
                console.log(`${folders.name} (${folders.id})`);
            });
        } else {
            console.log('No directories found.');
        }
    });
}
exports.getDirectories = getDirectories;

async function getFile(auth, fileId) {
    const drive = google.drive({version: 'v3', auth});
    const res = await drive.files.get({fileId, alt: 'media'}).catch(e => {
        console.log(e)
    });

    return res.data
}
exports.getFile = getFile;