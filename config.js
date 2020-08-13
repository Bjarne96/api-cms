module.exports = {
    //Server
    port: 4000,
    mode: "Development",
    //Session Config
    jwt_expiry: "15m",
    jwt_secret: "MYPERSONALJWTTOKENILIKEITVERYMUCHHOPEITSSECUREENOUGHT0923812936186253753671235123",
    //bcrypt config
    bcrypt_saltrounds: 10,
    bcrypt_password: "d6X3Eflq",
    bcrypt_alogrithm: "aes-256-ctr",
    //Mongo DB
    mongo_uri: "mongodb://ucc33nolfwmvw3vxjinq:QELvSZseBXrzYl3SoqZy@bbwscirwkwee7iy-mongodb.services.clever-cloud.com:27017/bbwscirwkwee7iy",
    //Google fileserver
    google_token: '{"access_token":"ya29.a0Adw1xeU3tdcaq0ai7YNkc3NVbZ2ih7RKYPvXj2FsYYgKk6iHQ4TYBk5cIgP1vlu6DUHTfOz7w1G_jEBx351utnVZUFlMWujJ_Ogbba2A5deeTAxn5huDVvbzYwdIBxxD4qpuNitiq6e4HFCc728b7-dydWC94uZRIKo","refresh_token":"1//03hiAvpzznF4tCgYIARAAGAMSNwF-L9Ir_sMT5-MVcpjPgIkUIQEJoN76-9XEHGzAq6LmyAa2kDkH_KiJHNAUl7CR9KdbaAOFrd4","scope":"https://www.googleapis.com/auth/drive","token_type":"Bearer","expiry_date":1584960784037}',
    google_credentials: '{"installed":{"client_id":"1040616235056-jskp8mjq38h7spetbq5dkm8osm67da5l.apps.googleusercontent.com","project_id":"filestorage-1584956811007","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"LDO_wGvCvIuuQslcEwsKIHdW","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}',
    google_folder: "1PXf7Rq5-218fIZrTwpiApaewYp22kfbS"
};