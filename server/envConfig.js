require("dotenv").config();
const {cleanEnv, str, port} = require("envalid")

const envConfig = cleanEnv(process.env, {
    CLIENT_URL: str(),
    PORT: port(),
    DATABASE_DIALECT: str(),
    DATABASE_HOST: str(),
    DATABASE_PORT: port(),
    DATABASE_NAME: str(),
    DATABASE_USERNAME: str(),
    DATABASE_PASSWORD: str()
});

module.exports = {
    ...envConfig
};