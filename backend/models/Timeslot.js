const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    day: { type: String, required: true },       // e.g., 'Monday'
    slotNumber: { type: Number, required: true } // e.g., 1, 2, 3...
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);