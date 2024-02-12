const {DATABASE_DIALECT, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD} = require("./envConfig");

const {Sequelize} = require("sequelize")

const tableSync = {
    alter: true
};

module.exports = {
    sequelize: new Sequelize({
        dialect: DATABASE_DIALECT,
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        database: DATABASE_NAME,
        username: DATABASE_USERNAME,
        password: DATABASE_PASSWORD
    }),
    tableSync
}