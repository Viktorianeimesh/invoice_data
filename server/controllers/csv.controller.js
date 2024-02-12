const {formDataToJSON} = require("../utils/commonUtil");
const csvService = require("../services/csv.service");
const reportService = require("../services/report.service");
const path = require("path");

class CsvController {
  async uploadFile(req, res, next) {
    try {
      const files = req.files;
      const file = files["file"]; // file - name of field
      if(file["mimetype"] === "text/csv"){
        await csvService.uploadFile(file);
        res.json({success: true})
      }
      res.status(400).json({
        success: false,
        "message": "File is not correct!"
      })
    }catch (e){
      next(e);
    }
  }


  async downloadReport(req, res, next) {
    try {
      const data = await reportService.generateReport(res);
    }catch (e){
      next(e)
    }
  }
}

module.exports = new CsvController();
