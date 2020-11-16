const express = require('express')
const router = express.Router()

const labTest = require('../models/labTest')
const doctor = require('../models/doctor')
const imageMimeTypes = ['image/jpeg', 'image/png','image/gif']

//Search all labTests
router.get('/', async (req, res) => {
    //res.send('All labTests')
    let query = labTest.find()
    if( req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if( req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if( req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try{
        const labTests = await query.exec()
        res.render('labTests/index',{
            labTests: labTests,
            searchOptions: query
        })
    }
    catch{
        res.redirect('/')
    }

})

//New labTest
router.get('/new', async (req,res) => {
    renderNewPage(res, new labTest())
})

//Create labTest
router.post('/',  async (req,res) => {
    const labTest = new labTest({
        title: req.body.title,
        doctor: req.body.doctor,
        publishDate: new Date(req.body.publishDate),
        testAmount: req.body.testAmount,
        description: req.body.description
    })
    saveCover(labTest,req.body.cover1)

    try{ 
        const newlabTest = await labTest.save()
        res.redirect(`labTests/${newlabTest.id}`)
        //res.redirect(`labTests`)
    }
    catch(err){
        console.error(err)
        renderNewPage(res, labTest, true)
    }

})

router.get('/:id', async (req,res) => {
    //res.redirect("Show labTest : " + req.params.id)
    try{
        const labTest = await labTest.findById(req.params.id).populate('doctor').exec()
        if(labTest == null) return
        console.log("labTest Title ", labTest.doctor)
        res.render('labTests/show',{labTest: labTest})
    }
    catch{
       // console.log(err)
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req,res) => {
    //res.redirect("Edit labTest : " + req.params.id)
    try{
        const labTest = await labTest.findById(req.params.id)
        renderEditPage(res,labTest)
    }
    catch(err){
        console.log(err)
        res.redirect('/')
    }
})

router.put('/:id', async (req,res) => {
    //once multer is implemented with upload and capturing filename now save to db
    let labTest
    try{ 
    labTest = await labTest.findById(req.params.id).populate('doctor').exec()
    console.log(labTest)
    labTest.title = req.body.title
    labTest.doctor.name = req.body.doctor.name
    labTest.publishDate = new Date(req.body.publishDate)
    labTest.testAmount = req.body.testAmount
    labTest.description = req.body.description
    if(req.body.cover1 != null && req.body.cover1 !== ''){
        saveCover(labTest,req.body.cover1)
    }
         await labTest.save()
        res.redirect(`/labTests/${labTest.id}`)
    }
    catch(err){
        console.error(err)
       if(labTest === null){
        renderEditPage(res, labTest, true)
       }
       else
       {
           res.redirect('/')
       }
        
    }
})

router.delete('/:id', async (req,res) => {
    //res.redirect("Delete labTest : " + req.params.id)
    let labTest
    try{
        labTest = await labTest.findById(req.params.id)
        await labTest.remove()
        res.redirect('/labTests')
    }
    catch(err){
        console.log(err)
        if(labTest != null)
        {
            res.render('labTests/show',{
                labTest: labTest,
                errorMessage: "Error deleting labTest. Try Again or check"
            })
        }
        else{
            res.redirect('/')
        }
    }
})

function saveCover(labTest,coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        labTest.coverImage = new Buffer.from(cover.data, 'base64')
        labTest.coverImageType = cover.type
    }
}

//under route New labTest get the logic can be encapsulated into a generic function 
async function renderNewPage(res, labTest, hasError = false)
{
    renderFormPage(res,labTest,'new',hasError) 
}

async function renderEditPage(res, labTest, hasError = false)
{
    renderFormPage(res,labTest,'edit',hasError)
}

async function renderFormPage(res, labTest, form, hasError = false)
{
    try{
        const doctors = await doctor.find({})
        const params = {
            doctors: doctors,
            labTest: labTest
        }
        if(hasError){
            if(form === "edit"){
                params.errorMessage = "Error Updating labTest"
            }
            else{
                params.errorMessage = "Error Creating labTest"
            }
        }
        res.render(`labTests/${form}`, params)
    }
    catch{
        res.redirect('/labTests')
    } 
}

// this will export for making use from else where in proj
module.exports = router 