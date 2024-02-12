const {sequelize} = require("../databaseConfig")
const {CSV_TABLE_NAME} = require("../models/csv.model");
const {FIELD_DESTINATION_GROUP, FIELD_BILLED_TERMINATOR, FIELD_BILLED_DURATION_TERMINATOR} = require("../fields");
const {QueryTypes} = require("sequelize");
const {createWriteStream} = require("fs");
const uuid = require("uuid");
const path = require("path");

class ReportService{
    async generateReport(res){
        const reportDate = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const days = date.getDay();
            const his = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            return `${year}-${month}-${days}_${his}`;
        }

        const filename = `report-${reportDate()}` + ".csv";
        const pathname = path.resolve(__dirname, "..", "static", filename);
        const query = `
            SELECT ${FIELD_DESTINATION_GROUP} AS Destination, 
            ROUND(SUM(${FIELD_BILLED_TERMINATOR}), 2) AS Amount, 
            ROUND(SUM(EXTRACT(EPOCH FROM ${FIELD_BILLED_DURATION_TERMINATOR}) / 60), 2) AS Duration
            FROM ${CSV_TABLE_NAME}
            GROUP BY ${FIELD_DESTINATION_GROUP}
            ORDER BY ${FIELD_DESTINATION_GROUP} ASC`
      const data = await sequelize.query(query, { type: QueryTypes.SELECT });
        const headers = Object.keys(data[0]);

        let writeStream = createWriteStream(pathname);

        writeStream.write(headers.join(',')+ '\n', () => {
        });

        data.forEach((someObject, index) => {
            let newLine = []
            newLine.push(Object.values(someObject).join(','));

            writeStream.write(newLine + '\n', () => {
                // a line was written to stream
            })
        })

        writeStream.end()

        writeStream.on('finish', () => {
            console.log('finish write stream, moving along')
            res.download(pathname);

        }).on('error', (err) => {
            console.log(err)
        })
        console.log(pathname)
        return filename;
    }

};


module.exports = new ReportService();