//const fs = require('fs');
//const csv = require('csv-parser');
//const { createObjectCsvWriter } = require('csv-writer');
//const connectDB = require("../db");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const csv = require('csv-parser')
const {parse} = require("csv-parse");
const {CsvModel, CSV_TABLE_NAME} = require("../models/csv.model");
const {FIELD_DESTINATION_GROUP, FIELD_PREFIX, FIELD_TERMINATION_POINT, FIELD_BILLED_TERMINATOR,
    FIELD_BILLED_DURATION_TERMINATOR, FIELD_RATE
} = require("../fields");
const {sequelize} = require("../databaseConfig");

function generateReport(res) {
    connectDB.query('SELECT destination_group AS destination, ROUND(SUM(billed_terminator), 2) AS amount, ROUND(SUM(EXTRACT(EPOCH FROM billed_duration_terminator) / 60), 2) AS duration FROM report GROUP BY destination_group ORDER BY destination_group ASC', (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ message: 'Error processing the file' });
        } else {
            const csvWriter = createObjectCsvWriter({
                path: 'report.csv',
                header: [
                    { id: 'destination', title: 'Destination' },
                    { id: 'amount', title: 'Amount' },
                    { id: 'duration', title: 'Duration' },
                ],
            });

            const csvData = result.rows.map(row => ({
                destination: row.destination,
                amount: row.amount,
                duration: row.duration,
            }));

            csvWriter.writeRecords(csvData)
                .then(() => {
                    console.log('CSV file written successfully');
                    res.status(200).json({ message: 'Your report is ready to download', downloadLink: '/download' });
                })
                .catch(err => {
                    console.error('Error writing CSV file:', err);
                    res.status(500).json({ message: 'Error generating CSV file' });
                });
        }
    });
}

function insertDataIntoDatabase(results, res) {
    const headers = Object.keys(results[0]);
    const insertQueries = results.map(row => {
        const values = headers.map(header => row[header]).join(',');
        return connectDB.query(`INSERT INTO report (${headers.join(', ')}) VALUES (${values})`);
    });

    Promise.all(insertQueries)
        .then(() => {
            console.log('Data inserted successfully into PostgreSQL database');
            generateReport(res);
        })
        .catch(err => {
            console.error('Error inserting data into PostgreSQL:', err);
            res.status(500).json({ message: 'Error inserting data into PostgreSQL' });
        });
}




class CsvService {
    async insertRow(row){
        return await CsvModel.create({
            [FIELD_DESTINATION_GROUP]: row[0],
            [FIELD_PREFIX]: +row[1],
            [FIELD_TERMINATION_POINT]: row[2],
            [FIELD_BILLED_TERMINATOR]: row[3],
            [FIELD_BILLED_DURATION_TERMINATOR]: row[4],
            [FIELD_RATE]: row[5]
        });
    }

    async insertData (filepath){
        const parseOptions = (chunkSize, count) => {
            let parseObjList = []
            for (let i = 0; i < (count / chunkSize); i++) {
                const from_line = i === 0 ? 2 : (i * chunkSize) + 1
                const to_line = (i + 1) * chunkSize;
                let parseObj = {
                    delimiter: ',',
                    from_line: from_line,
                    to_line: to_line,
                    skip_empty_lines: true
                }
                parseObjList.push(parseObj);
            }
            return parseObjList;
        }
        const insertRow = async (row) => await this.insertRow(row);

        const chunkSize = 10;

        const count = fs.readFileSync(filepath,'utf8').split('\n').length - 1;
        console.log('readFileSync', count)
        const parseObjList = parseOptions(chunkSize, count);
        console.log('parseObjList', parseObjList)
        for (let i = 0; i < parseObjList.length; i++){
            fs.createReadStream(filepath)
                .pipe(await parse(parseObjList[i]))
                .on('data', async function (row) {
                    await insertRow(row)
                })
                .on('end', async function (row) {
                    fs.unlinkSync(filepath);
                })
                .on('error', function (error) {});
        }
        /*
        await Promise.all(parseObjList.map(async (_, i) => {
            return fs.createReadStream(filepath)
                .pipe(await parse(parseObjList[i]))
                .on('data', async function (row) {
                    await insertRow(row)
                })
                .on('end', function () {
                                fs.unlinkSync(filepath);
                })
                .on('error', function (error) {});
        }));
        */
    }
    async uploadFile(file){
        let data = [];
        const filename  = uuid.v4() + ".csv";
        const pathname = path.resolve(__dirname, "..", "static", filename);

        await file.mv(pathname);
        await sequelize.query(`DELETE FROM ${CSV_TABLE_NAME}`);
        await this.insertData(pathname);
        return true;
    }

};

module.exports = new CsvService();