module.exports = {
    //Server Config
    mong_local_url : "mongodb://localhost:27017/schurwolldecken",
    web_local_url : "https://localhost:4000",
    port_api : 4000,
    port_web : 3000,

    //Session Config
    jwt_expiry : "15m",
    jwt_secret : process.env.JWT_SECRET,

    //bcrypt config
    saltrounds : process.env.SALTROUNDS,

    //Testing Variables
    test_url : "https://localhost:4000",
    test_email : process.env.TEST_EMAIL,
    test_password : process.env.TEST_PASSWORD,
    test_pasword_hash : process.env.TEST_PASSWORD_HASH
};