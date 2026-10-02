const express = require('express');
const router = express.Router();

const Timetable = require('../models/Timetable');
const Faculty = require('../models/Faculty');
const SwapRequest = require('../models/SwapRequest');
const TimeSlot = require('../models/TimeSlot');

// Faculty Leave Request & Auto-Substitute
router.post('/leave-request', async (req, res) => {

    const { facultyId, date, leaveDate, timeSlotId, substituteFacultyId, substituteSubject } = req.body;
    const effectiveDate = date || leaveDate;

    try {

        // 1. Validate input
        if (!facultyId || !effectiveDate || !timeSlotId) {
            return res.status(400).json({
                message: "Faculty, leave date and time slot are required."
            });
        }

        // 1.5 Parse timeSlotId (e.g. "Thursday-1") to find the actual TimeSlot
        let realTimeSlotId = timeSlotId;
        if (typeof timeSlotId === 'string' && timeSlotId.includes('-')) {
            const [day, slotNumber] = timeSlotId.split('-');
            const actualTimeSlot = await TimeSlot.findOne({ day, slotNumber: Number(slotNumber) });
            if (actualTimeSlot) {
                realTimeSlotId = actualTimeSlot._id;
            } else {
                return res.status(404).json({ message: `Time slot ${timeSlotId} not found in database.` });
            }
        }

        // 2. Find the faculty member who is taking leave
        const leavingFaculty = await Faculty.findById(facultyId);

        if (!leavingFaculty) {
            return res.status(404).json({
                message: "Faculty member not found."
            });
        }

        // 3. Find classes assigned to this faculty in the selected time slot
        const affectedClasses = await Timetable.find({
            facultyId: facultyId,
            timeSlotId: realTimeSlotId
        });

        // 4. If faculty has no class in this slot
        if (affectedClasses.length === 0) {
            return res.status(200).json({
                message: "No class is assigned to this faculty in the selected time slot."
            });
        }

        // 5. Get the subject that needs a substitute
        let requiredSubject = affectedClasses[0].subjectName;

        // 6. Find faculty already busy in this time slot
        const busyFacultyIds = await Timetable
            .find({ timeSlotId: realTimeSlotId })
            .distinct('facultyId');

        // 7. Find suitable substitute faculty
        const availableSubstitutes = await Faculty.find({
            department: leavingFaculty.department,
            _id: {
                $nin: [
                    ...busyFacultyIds,
                    facultyId
                ]
            },
            expertiseSubjects: requiredSubject
        });

        // 8. No substitute available and no substitute explicitly provided
        if (availableSubstitutes.length === 0 && !substituteFacultyId) {
            return res.status(404).json({
                message: `No suitable substitute found for ${requiredSubject}.`
            });
        }

        // 9. Select the substitute
        let bestSubstitute = null;
        if (substituteFacultyId) {
            bestSubstitute = await Faculty.findById(substituteFacultyId);
        }
        
        if (!bestSubstitute && availableSubstitutes.length > 0) {
            bestSubstitute = availableSubstitutes[0];
        }

        if (!bestSubstitute) {
            return res.status(404).json({
                message: "Substitute faculty could not be resolved."
            });
        }
        
        // 9.5 Handle Subject Override
        let finalSubject = requiredSubject;
        if (substituteSubject && substituteSubject.trim() !== '') {
            finalSubject = substituteSubject.trim();
        }

        // 10. Create swap request and update timetable immediately
        const swapInvite = await SwapRequest.create({
            originalFacultyId: facultyId,
            substituteFacultyId: bestSubstitute._id,
            timetableId: affectedClasses[0]._id,
            status: 'ACCEPTED', // Auto-approve for hackathon demo
            leaveDate: effectiveDate
        });

        // Actually swap the faculty and possibly subject in the timetable
        affectedClasses[0].facultyId = bestSubstitute._id;
        affectedClasses[0].subjectName = finalSubject;
        await affectedClasses[0].save();

        // 11. Send response to frontend
        res.status(200).json({

            message: "Substitute found successfully.",

            facultyOnLeave: leavingFaculty.name,

            subject: requiredSubject,
            
            finalSubject: finalSubject,

            substituteName: bestSubstitute.name,

            leaveDate: effectiveDate,

            inviteId: swapInvite._id
        });

    } catch (err) {

        console.error("Leave request error:", err);

        res.status(500).json({
            error: err.message
        });
    }
});
router.get('/', async (req, res) => {
    try {

        const faculty = await Faculty.find()
            .select('_id name department expertiseSubjects');

        res.status(200).json(faculty);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
});
module.exports = router;