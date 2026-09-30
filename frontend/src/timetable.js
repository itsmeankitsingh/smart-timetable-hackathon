const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: Number, required: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    timeSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot', required: true }
});

module.exports = mongoose.model('Timetable', timetableSchema);