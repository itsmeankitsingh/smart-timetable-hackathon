const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({

    subjectName: {
        type: String,
        required: true
    },

    branch: {
        type: String,
        required: true
    },
    section: {
    type: String,
    default: 'A'
    },
    semester: {
        type: Number,
        required: true
    },

    facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: false
},

coFacultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    default: null
},

group: {
    type: String,
    default: 'ALL'
},

duration: {
    type: Number,
    default: 1
},

roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: false
    },

    timeSlotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSlot',
        required: true
    }

});

module.exports = mongoose.model('Timetable', timetableSchema);