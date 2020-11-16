const express = require('express')
const router = express.Router()
const Doctor = require('../models/doctor')
const labTest = require('../models/labTest')
//Search all doctors
router.get('/', async (req, res) => {
    let searchOptions = {}
    if ( req.query.name != null && req.query.name != ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const doctors = await Doctor.find(searchOptions)
        res.render('doctors/index', {
            doctors: doctors, 
            searchOptions: req.query
        })
    }
    catch{
        res.redirect('/')
    }
   
})

//New doctor
router.get('/new', async (req,res) => {
    res.render('doctors/new', {doctor: new Doctor()})
})

//Create New doctor
router.post('/', async(req,res) => {
    //res.send('Create')
    const doctor = new Doctor({
        name: req.body.name
    })
    try{
        const newDoctor = await doctor.save()  // when using async also use await for async call to be completed 
        res.redirect(`doctors/${newDoctor.id}`)    // yet to implement
        //res.redirect(`doctors`)
    }
    catch{
        res.render('doctors/new',{
            doctor: doctor,
            errorMessage: 'Err doctor name not saved'
        })
    }
    //res.send(req.body.name)
})

router.get('/:id', async (req,res) => {
    //res.send("Show doctor "+ req.params.id)
    try{
        const doctor_t = await Duthor.findById(req.params.id)
        const labTests = await labTest.find({doctor: doctor_t.id}).limit(6).exec()
        console.log(labTests)
        res.render('doctors/show',{
            doctor: doctor_t,
            labTestsBydoctor: labTests
        })
    }
    catch{
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req,res) => {
    //res.send("Edit doctor "+ req.params.id)
    try{
        const doctor = await Doctor.findById(req.params.id)
        res.render('doctors/edit',{doctor: doctor})
    }
    catch{
        res.redirect('doctors')
    }
})

router.put('/:id',  async (req,res) => {
    //res.send("Update doctor "+ req.params.id) 
    let doctor
    try{
        doctor = await Doctor.findById(req.params.id)
        doctor.name = req.body.name
        await doctor.save()  // when using async also use await for async call to be completed 
        res.redirect(`/doctors/${doctor.id}`) 
        //res.redirect(`doctors`)
    }
    catch{
        if(doctor == null){
            res.redirect('/')
        }
        res.render('doctors/edit',{
            doctor: doctor,
            errorMessage: 'Err in doctor update name'
        })
    }
})

router.delete('/:id', async (req,res) => {
    //res.send("Delete doctor "+ req.params.id)
    let doctor
    try{
        doctor = await Doctor.findById(req.params.id)
        await doctor.remove()  // when using async also use await for async call to be completed 
        res.redirect('/doctors') 
        //res.redirect(`doctors`)
    }
    catch{
        if(doctor == null){
            res.redirect('/')
        }
        else{
            res.redirect(`/doctors/${doctor.id}`)
        }
    }
})

// this will export for making use from else where in proj
module.exports = router 