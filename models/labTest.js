const mongoose = require('mongoose')

const labTestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    testAmount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
        type: Buffer,
        required: false
    },
    coverImageType: {
        type: String,
        required: false
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'doctor'
    }
}) 

labTestSchema.virtual('coverImagePath').get(function() {
   if(this.coverImage != null && this.coverImageType != null){
       return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
   }
})

module.exports = mongoose.model('LabTests', labTestSchema)

