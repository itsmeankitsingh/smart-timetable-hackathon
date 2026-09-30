const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
    originalFacultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    substituteFacultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    timetableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Timetable', required: true },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },

leaveDate: { type: Date, required: true },

createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SwapRequest', swapRequestSchema);