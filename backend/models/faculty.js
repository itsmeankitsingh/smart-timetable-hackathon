const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },

    // A faculty member can teach in one or more departments
    department: {
        type: [String],
        required: true
    },

    expertiseSubjects: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('Faculty', facultySchema);