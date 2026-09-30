const mongoose = require('mongoose');

const substituteMappingSchema = new mongoose.Schema({

    subjectName: {
        type: String,
        required: true,
        unique: true
    },

    regularFacultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },

    substituteFacultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    }

});

module.exports = mongoose.model(
    'SubstituteMapping',
    substituteMappingSchema
);