const express = require('express')
const router = express.Router()
const labTest = require('../models/labTest')
router.get('/', async (req, res) => {
 	let labTests = []
	try {
		labTests = await labTest.find().sort({ createdDt: 'desc' }).limit(10).exec()
	}
	catch {
		labTests = []
	}
    res.render('index', {labTests: labTests})
    
   //res.render('index')
})

// this will export for making use from else where in proj
module.exports = router	