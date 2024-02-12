
const Router = require('express').Router;
const router = new Router();
const csvController = require("../controllers/csv.controller");

router.post("/upload", csvController.uploadFile)
router.get("/download", csvController.downloadReport)

module.exports = router;