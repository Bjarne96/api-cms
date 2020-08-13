const { google } = require('googleapis');
import config = require('./../../config')

let credentials = JSON.parse(config.google_credentials);
let token = JSON.parse(config.google_token);
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(token);
export const filestorage = oAuth2Client;

export default filestorage;