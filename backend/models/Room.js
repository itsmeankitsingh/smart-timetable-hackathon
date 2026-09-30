const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNo: { type: String, required: true },
    type: { type: String, enum: ['Lecture Hall', 'Lab'], required: true },
    status: { type: String, default: 'AVAILABLE' }
});

module.exports = mongoose.model('Room', roomSchema);