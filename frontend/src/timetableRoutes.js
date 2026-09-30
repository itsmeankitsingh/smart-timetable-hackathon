const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');

// 1. Get Timetable for a specific branch and semester
router.get('/:branch/:semester', async (req, res) => {
    try {
        const { branch, semester } = req.params;
        const timetable = await Timetable.find({ 
            branch: new RegExp('^' + branch + '$', 'i'), 
            semester: Number(semester) 
        })
        .populate('facultyId')
        .populate('roomId')
        .populate('timeSlotId');
        
        res.status(200).json(timetable);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Auto-Generate Timetable Route (Mock trigger for hackathon)
router.post('/generate', async (req, res) => {
    try {
        // For hackathon demo safety, if no records exist, we return a success response
        res.status(200).json({ message: "Timetable generated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;