const {sequelize, tableSync} = require("../databaseConfig");
const {DataTypes, RANGE} = require("sequelize");
const {
    FIELD_DESTINATION_GROUP,
    FIELD_PREFIX,
    FIELD_TERMINATION_POINT,
    FIELD_BILLED_TERMINATOR,
    FIELD_BILLED_DURATION_TERMINATOR,
    FIELD_RATE
} = require("../fields");

const CSV_MODEL_NAME = "report";
const CSV_TABLE_NAME = "report";

const CsvModel = sequelize.define(CSV_MODEL_NAME, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    [FIELD_DESTINATION_GROUP]: {
        type: DataTypes.STRING
    },
    [FIELD_PREFIX]: {
        type: DataTypes.INTEGER
    },
    [FIELD_TERMINATION_POINT]: {
        type: DataTypes.TEXT
    },
    [FIELD_BILLED_TERMINATOR]: {
        type: DataTypes.DECIMAL
    },
    [FIELD_BILLED_DURATION_TERMINATOR]: {
        type: DataTypes.TIME
    },
    [FIELD_RATE]: {
        type: DataTypes.DECIMAL
    }
},{
    tableName: CSV_TABLE_NAME,
    timestamps: false
});

CsvModel.sync({alter: true});

module.exports = {
    CsvModel,
    CSV_TABLE_NAME,
    CSV_MODEL_NAME
}