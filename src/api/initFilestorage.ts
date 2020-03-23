const { google } = require('googleapis');

let credentials = JSON.parse(process.env.GOOGLE_CREDENIALS);
let token = JSON.parse(process.env.GOOGLE_TOKEN);
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(token);
export const filestorage = oAuth2Client;

export default filestorage;