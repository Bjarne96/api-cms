module.exports = {
    //Session Config
    jwt_expiry : "15m",
    jwt_secret : process.env.JWT_SECRET,

    //bcrypt config
    saltrounds : process.env.SALTROUNDS,
};