const mongoose = require('mongoose')
const labTest = require('./labTest')
const doctor = require('./doctor')
const patientSchema = new mongoose.Schema({
    pName: {
        type: String,
        required: true
    },
    pAge: {
        type: Number,
        required: true
    },
    pRegNumber: {
        type: String,
        required: false
    },
    pRefByDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'doctor'
    },
    pReqDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    pRepDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    pRepPrnDate: {
        type: Date,
        required: true,
        default: Date.now
    }
}    
)

patientSchema.pre('remove', function(next){
    labTest.find({labTest: this.id}, (err, labTests) => {
        if(err){
            next(err)
        }
        else if(labTests.length > 0){
            new Error("This patient has labTests still")
        }
        else
        {
            next()
        }
    })
})

module.exports = mongoose.model('Patient', patientSchema)

