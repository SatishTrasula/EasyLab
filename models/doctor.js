const mongoose = require('mongoose')
const labTest = require('./labTest')
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}    
)

doctorSchema.pre('remove', function(next){
    labTest.find({doctor: this.id}, (err, labTests) => {
        if(err){
            next(err)
        }
        else if(labTests.length > 0){
            new Error("This doctor has labTests still")
        }
        else
        {
            next()
        }
    })
})

module.exports = mongoose.model('Doctor', doctorSchema)

