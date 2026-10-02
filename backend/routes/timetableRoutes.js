const express = require('express');
const router = express.Router();

const Timetable = require('../models/Timetable');
const Faculty = require('../models/Faculty');
const Room = require('../models/Room');
const TimeSlot = require('../models/TimeSlot');
const SwapRequest = require('../models/SwapRequest');
const SubstituteMapping = require('../models/SubstituteMapping');

// =====================================================
// 1. GET ALL TIMETABLE ENTRIES
// =====================================================

router.get('/', async (req, res) => {
    try {

        const timetables = await Timetable.find({
    branch: req.query.branch,
    section: req.query.section,
    semester: Number(req.query.semester)
})
            .populate('facultyId', 'name department')
            .populate('coFacultyId', 'name department')
            .populate('roomId', 'roomNo type')
            .populate('timeSlotId', 'day slotNumber');

        res.status(200).json(timetables);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});


// =====================================================
// 1.5 GET DASHBOARD STATISTICS
// =====================================================
router.get('/stats', async (req, res) => {
    try {
        const filter = {};
        if (req.query.branch) filter.branch = req.query.branch;
        if (req.query.semester) filter.semester = req.query.semester;
        
        const totalClasses = await Timetable.countDocuments(filter);
        
        const facultyCount = await Timetable.distinct('facultyId', filter).then(arr => arr.length);
        const roomCount = await Timetable.distinct('roomId', filter).then(arr => arr.length);
        const slotCount = await Timetable.distinct('timeSlotId', filter).then(arr => arr.length);

        res.status(200).json({
            totalClasses,
            facultyCount,
            roomCount,
            slotCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =====================================================
// 2. AUTO GENERATE TIMETABLE
// =====================================================

router.post('/generate', async (req, res) => {

    try {

        const branch = req.body.branch || 'Electrical';
        const semester = Number(req.body.semester) || 4;
        const section = req.body.section || 'A';
        console.log("GENERATE REQUEST:", {
    branch,
    semester,
    section
});


        // -------------------------------------------------
        // Faculty
        // -------------------------------------------------

        const facultyData = [
    // =========================
    // ELECTRICAL ENGINEERING
    // =========================
    {
    name: 'Dr. Pritam Kumar',
    email: 'pritam@gicemadhubani.ac.in',
    department: 'Electrical',
    expertiseSubjects: [
        'Electromagnetic Field Theory',
        'Electrical Circuit Analysis'
    ]
},
    {
    name: 'Ravi Kumar',
    email: 'ravi@gicemadhubani.ac.in',
    department: 'Electrical',
    expertiseSubjects: [
        'Digital Electronics',
        'Electrical Machine-I'
    ]
},
    {
        name: 'Ajeet Kumar',
        email: 'ajeet@gicemadhubani.ac.in',
        department: 'Electrical',
        expertiseSubjects: ['Control System']
    },
    {
        name: 'Rashmi Kumari',
        email: 'rashmi@gicemadhubani.ac.in',
        department: 'Electrical',
        expertiseSubjects: ['Signals and Systems']
    },
    {
        name: 'Kavita Yadav',
        email: 'kavita@gicemadhubani.ac.in',
        department: 'Electrical',
        expertiseSubjects: ['Electrical Machine-II']
    },
    {
        name: 'Sumit Kumar',
        email: 'sumit@gicemadhubani.ac.in',
        department: 'Electrical',
        expertiseSubjects: ['Environmental Science']
    },

    // =========================
    // CSE
    // =========================
    {
        name: 'Anand Kamal',
        department: 'CSE',
        expertiseSubjects: ['D&AoA']
    },
    {
        name: 'Lakhindra Mahto',
        department: 'CSE',
        expertiseSubjects: ['CN']
    },
    {
        name: 'Dr. Md. Irshad',
        department: 'CSE',
        expertiseSubjects: ['ETC']
    },
    {
        name: 'Sapna Kumari',
        department: 'CSE',
        expertiseSubjects: ['FL&AT']
    },
    {
        name: 'Rashke Jahan',
        department: 'CSE',
        expertiseSubjects: ['DBMS']
    },
    {
        name: 'Sanjay Kumar Sahani',
        department: 'CSE',
        expertiseSubjects: ['CO&A']
    },

    // =========================
    // IoT
    // =========================
    {
        name: 'Sanjay Kumar Sahani',
        department: 'IoT',
        expertiseSubjects: ['CO&A']
    },
    {
        name: 'Sapna Kumari',
        department: 'IoT',
        expertiseSubjects: ['FL&AT']
    },
    {
        name: 'Dr. Md. Irshad',
        department: 'IoT',
        expertiseSubjects: ['ETC']
    },
    {
        name: 'Rashke Jahan',
        department: 'IoT',
        expertiseSubjects: ['DBMS']
    },
    {
        name: 'Anand Kamal',
        department: 'IoT',
        expertiseSubjects: ['D&AoA']
    },
    {
        name: 'Lakhindra Mahto',
        department: 'IoT',
        expertiseSubjects: ['CN']
    },

    // =========================
    // MECHANICAL ENGINEERING
    // =========================
    {
        name: 'Navaseen (NS)',
        department: 'Mechanical',
        expertiseSubjects: ['Applied Thermodynamics']
    },
    {
        name: 'Rahul Kumar-2 (RK-2)',
        department: 'Mechanical',
        expertiseSubjects: ['Fluid Mechanics & Hydraulic Mechanics']
    },
    {
        name: 'Rakesh Kumar Rajak (RKR)',
        department: 'Mechanical',
        expertiseSubjects: ['Strength of Material']
    },
    {
        name: 'Dr. Ranu Srivastav (RS)',
        department: 'Mechanical',
        expertiseSubjects: ['Kinematics of Machine']
    },
    {
        name: 'Akhilesh Kumar Singh (AKS)',
        department: 'Mechanical',
        expertiseSubjects: ['Project Management']
    },

    // =========================
    // CIVIL ENGINEERING
    // =========================
    {
        name: 'Dr. Vikash Kumar',
        department: 'Civil',
        expertiseSubjects: ['Engineering Geology']
    },
    {
        name: 'Chetan Anand',
        department: 'Civil',
        expertiseSubjects: ['Engineering Geology']
    },
    {
        name: 'Manish Kumar',
        department: 'Civil',
        expertiseSubjects: ['Hydraulics Engineering']
    },
    {
        name: 'Ravi Anand',
        department: 'Civil',
        expertiseSubjects: ['Structural Analysis']
    },
    {
        name: 'Shubham Kumar',
        department: 'Civil',
        expertiseSubjects: ['BP&CACED']
    },
    {
        name: 'Dr. Vinod Kumar',
        department: 'Civil',
        expertiseSubjects: ['Transportation Engineering']
    },
    {
        name: 'Vinod Kumar',
        department: 'Civil',
        expertiseSubjects: ['Transportation Engineering']
    },
    {
        name: 'MD Tabrej Alam',
        department: 'Civil',
        expertiseSubjects: ['CE-S&GI']
    },
    {
        name: 'Shashank Saurabh',
        department: 'Civil',
        expertiseSubjects: ['CE-S&GI']
    },
    {
        name: 'Sumit Kumar',
        department: 'Civil',
        expertiseSubjects: ['Geo Technical Engineering']
    }
,
    // =========================
    // 3rd SEMESTER CSE
    // =========================

    {
        name: 'Gaurav Kumar',
        department: 'CSE',
        expertiseSubjects: ['Data Structures & Algorithms']
    },
    {
        name: 'Dr. Ankur Priyadarshi',
        department: 'CSE',
        expertiseSubjects: ['Object-Oriented Programming using Java']
    },
    {
        name: 'Sanjay Kumar Sahani',
        department: 'CSE',
        expertiseSubjects: ['Operating System']
    },
    {
        name: 'Ashutosh Kumar Jha',
        department: 'CSE',
        expertiseSubjects: ['Digital Electronics']
    },
    {
        name: 'Gaurav Kumar (Guest Faculty)',
        department: 'CSE',
        expertiseSubjects: ['Discrete Mathematics & Graph Theory']
    },
    {
        name: 'Akhilesh Kumar Singh',
        department: 'CSE',
        expertiseSubjects: [
            'Universal Human Values',
            'Indian Knowledge System'
        ]
    },


    // =========================
    // 3rd SEMESTER ELECTRICAL
    // =========================

    {
        name: 'Md. Shadab Hussain',
        department: 'Electrical',
        expertiseSubjects: ['Analog Electronics']
    },
    {
        name: 'Kumar Vikas',
        department: 'Electrical',
        expertiseSubjects: ['Engineering Mechanics']
    },
    {
        name: 'Poonam Kumari',
        department: 'Electrical',
        expertiseSubjects: ['Indian Knowledge System']
    },
    {
        name: 'Dr. Rajan Kumar',
        department: 'Electrical',
        expertiseSubjects: ['Engineering Mathematics-III']
    },
    {
        name: 'Akhilesh Kumar Singh',
        department: 'Electrical',
        expertiseSubjects: ['Universal Human Values']
    },


    // =========================
    // 3rd SEMESTER MECHANICAL
    // =========================

    {
        name: 'Navaseen (NS)',
        department: 'Mechanical',
        expertiseSubjects: [
            'Thermodynamics'
        ]
    },
    {
        name: 'Rahul Kumar-1 (RK-1)',
        department: 'Mechanical',
        expertiseSubjects: [
            'Engineering Mechanics'
        ]
    },
    {
        name: 'Rakesh Kumar Rajak (RKR)',
        department: 'Mechanical',
        expertiseSubjects: [
            'Indian Knowledge System'
        ]
    },
    {
        name: 'Dr. Ranu Srivastav (RS)',
        department: 'Mechanical',
        expertiseSubjects: [
            'Material Science and Engineering'
        ]
    },
    {
        name: 'Shadab Hussain (SH)',
        department: 'Mechanical',
        expertiseSubjects: [
            'Basic Electronics Engineering'
        ]
    },
    {
        name: 'Pappu Kumar (PK)',
        department: 'Mechanical',
        expertiseSubjects: [
            'Universal Human Values'
        ]
    },
    {
        name: 'Rakesh Kumar Rajak (RKR)',
        department: 'Mechanical',
        expertiseSubjects: [
            'Engineering Mathematics-III'
        ]
    },
    {
        name: 'Rahul Kumar-2 (RK-2)',
        department: 'Mechanical',
        expertiseSubjects: [
            'Engineering Mechanics'
        ]
    },
    {
        name: 'KS',
        department: 'Mechanical',
        expertiseSubjects: [
            'Solid Works'
        ]
    }
    ];
const facultyList = [];

for (const faculty of facultyData) {

    let existingFaculty = await Faculty.findOne({
        name: faculty.name,
        department: faculty.department
    });

    if (!existingFaculty) {

        existingFaculty = await Faculty.create({
            name: faculty.name,
            email: faculty.email,
            department: Array.isArray(faculty.department)
                ? faculty.department
                : [faculty.department],
            expertiseSubjects: faculty.expertiseSubjects || []
        });

    } else {

        // Add any new expertise subjects to the existing faculty
        const existingSubjects =
            existingFaculty.expertiseSubjects || [];

        const newSubjects =
            faculty.expertiseSubjects || [];

        const mergedSubjects = [
            ...new Set([
                ...existingSubjects,
                ...newSubjects
            ])
        ];

        existingFaculty.expertiseSubjects =
            mergedSubjects;

        await existingFaculty.save();
    }

    facultyList.push(existingFaculty);
}

        // -------------------------------------------------
        // Rooms
        // -------------------------------------------------

        const roomData = [
            {
                roomNo: 'E-101',
                type: 'Lecture Hall',
                status: 'AVAILABLE'
            },
            {
                roomNo: 'E-102',
                type: 'Lecture Hall',
                status: 'AVAILABLE'
            },
            {
                roomNo: 'E-LAB-1',
                type: 'Lab',
                status: 'AVAILABLE'
            }
        ];


        const roomList = [];

        for (const room of roomData) {

            let existingRoom = await Room.findOne({
                roomNo: room.roomNo
            });

            if (!existingRoom) {

                existingRoom = await Room.create(room);

            }

            roomList.push(existingRoom);
        }


        // -------------------------------------------------
        // Time Slots
        // -------------------------------------------------

        const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

        const timeSlotList = [];

for (const day of days) {

    // 6 periods per day
    // Slot 1 = 10-11
    // Slot 2 = 11-12
    // Slot 3 = 12-1
    // Recess = 1-2
    // Slot 4 = 2-3
    // Slot 5 = 3-4
    // Slot 6 = 4-5

    for (let slotNumber = 1; slotNumber <= 6; slotNumber++) {

        let existingSlot = await TimeSlot.findOne({
            day: day,
            slotNumber: slotNumber
        });

        if (!existingSlot) {

            existingSlot = await TimeSlot.create({
                day: day,
                slotNumber: slotNumber
            });

        }

        timeSlotList.push(existingSlot);
    }
}


        // -------------------------------------------------
        // Subjects
        // -------------------------------------------------

        const subjectsByBranch = {

    Electrical: {

        3: [
            'Electrical Circuit Analysis',
            'Analog Electronics',
            'Electrical Machine-I',
            'Engineering Mathematics-III',
            'Engineering Mechanics',
            'Universal Human Values',
            'Indian Knowledge System'
        ],

        4: [
            'Electromagnetic Field Theory',
            'Digital Electronics',
            'Control System',
            'Signals and Systems',
            'Electrical Machine-II',
            'Environmental Science'
        ]
    },

CSE: {

    3: [
        'Data Structures & Algorithms',
        'Object-Oriented Programming using Java',
        'Operating System',
        'Digital Electronics',
        'Discrete Mathematics & Graph Theory',
        'Universal Human Values',
        'Indian Knowledge System'
    ],

    4: [
        'D&AoA',
        'CN',
        'ETC',
        'FL&AT',
        'DBMS',
        'CO&A'
    ]
},


    Mechanical: {

    3: [
        'Engineering Mathematics-III',
        'Material Science and Engineering',
        'Thermodynamics',
        'Universal Human Values',
        'Basic Electronics Engineering',
        'Indian Knowledge System',
        'Engineering Mechanics'
    ],

    4: [
        'Applied Thermodynamics',
        'Fluid Mechanics & Hydraulic Mechanics',
        'Strength of Material',
        'Kinematics of Machine',
        'Project Management'
    ]
},


    Civil: {

        4: [
            'Engineering Geology',
            'Hydraulics Engineering',
            'Structural Analysis',
            'BP&CACED',
            'Transportation Engineering',
            'CE-S&GI',
            'Geo Technical Engineering'
        ]
    },


    IoT: {

    3: [
        'Object-Oriented Programming using Java',
        'Data Structures & Algorithms',
        'Operating System',
        'Discrete Mathematics & Graph Theory',
        'Universal Human Values',
        'Digital Electronics',
        'Indian Knowledge System'
    ],

    4: [
        'CO&A',
        'FL&AT',
        'ETC',
        'DBMS',
        'D&AoA',
        'CN'
    ]
},
};


const subjects = subjectsByBranch[branch]?.[semester];

if (!subjects) {
    throw new Error(
        `Subjects are not configured for ${branch} Semester ${semester}`
    );
}

        // -------------------------------------------------
        // Remove previously generated timetable
        // -------------------------------------------------

        await Timetable.deleteMany({
    branch: branch,
    semester: semester,
    section: section
});


        // -------------------------------------------------
        // Generate timetable
        // -------------------------------------------------

        const generatedTimetable = [];

const facultyBusySlots = new Set();


// =====================================================
// Helper: find faculty
// =====================================================

function findFacultyByName(facultyList, name, department) {

    return facultyList.find(f =>
        f.name === name &&
        f.department.includes(department)
    );
}


// =====================================================
// Exact CSE 3rd Semester Routine
// =====================================================

const cse3Routine = {

    Monday: {
        1: {
            subject: 'Data Structures & Algorithms',
            faculty: 'Gaurav Kumar'
        },
        2: {
            subject: 'Object-Oriented Programming using Java',
            faculty: 'Dr. Ankur Priyadarshi'
        },
        3: {
            subject: 'Operating System',
            faculty: 'Sanjay Kumar Sahani'
        },
        4: {
            subject: 'Digital Electronics',
            faculty: 'Ashutosh Kumar Jha'
        },
        5: {
            subject: 'Object-Oriented Programming using Java',
            faculty: 'Dr. Ankur Priyadarshi'
        },
        6: {
            subject: 'Indian Knowledge System',
            faculty: 'Akhilesh Kumar Singh'
        }
    },


    Tuesday: {

        1: {
            subject: 'Operating System',
            faculty: 'Sanjay Kumar Sahani'
        },

        2: {
            subject: 'Digital Electronics LAB',
            faculty: 'Ashutosh Kumar Jha',
            group: 'G1',
            duration: 2
        },

        2.1: {
            subject: 'Data Structures & Algorithms LAB',
            faculty: 'Gaurav Kumar',
            group: 'G2',
            duration: 2
        },

        4: {
            subject: 'Data Structures & Algorithms',
            faculty: 'Gaurav Kumar'
        },

        5: {
            subject: 'Universal Human Values',
            faculty: 'Akhilesh Kumar Singh'
        },

        6: {
            subject: 'Indian Knowledge System',
            faculty: 'Akhilesh Kumar Singh'
        }
    },


    Wednesday: {

        1: {
            subject: 'Indian Knowledge System',
            faculty: 'Akhilesh Kumar Singh'
        },

        2: {
            subject: 'Discrete Mathematics & Graph Theory',
            faculty: 'Gaurav Kumar (Guest Faculty)'
        },

        3: {
            subject: 'Remedial Class',
            group: 'ALL'
        },

        4: {
            subject: 'Operating System LAB',
            faculty: 'Sanjay Kumar Sahani',
            group: 'G1',
            duration: 2
        },

        4.1: {
            subject: 'Object-Oriented Programming using Java LAB',
            faculty: 'Dr. Ankur Priyadarshi',
            group: 'G2',
            duration: 2
        },

        6: {
            subject: 'Universal Human Values',
            faculty: 'Akhilesh Kumar Singh'
        }
    },


    Thursday: {

        1: {
            subject: 'Discrete Mathematics & Graph Theory',
            faculty: 'Gaurav Kumar (Guest Faculty)'
        },

        2: {
            subject: 'Digital Electronics',
            faculty: 'Ashutosh Kumar Jha'
        },

        3: {
            subject: 'Remedial Class',
            group: 'ALL'
        },

        4: {
            subject: 'Operating System LAB',
            faculty: 'Sanjay Kumar Sahani',
            group: 'G2',
            duration: 2
        },

        4.1: {
            subject: 'Object-Oriented Programming using Java LAB',
            faculty: 'Dr. Ankur Priyadarshi',
            group: 'G1',
            duration: 2
        },

        6: {
            subject: 'Library',
            group: 'ALL'
        }
    },


    Friday: {

        1: {
            subject: 'Digital Electronics',
            faculty: 'Ashutosh Kumar Jha'
        },

        2: {
            subject: 'Operating System',
            faculty: 'Sanjay Kumar Sahani'
        },

        3: {
            subject: 'Data Structures & Algorithms',
            faculty: 'Gaurav Kumar'
        },

        4: {
            subject: 'Library',
            group: 'ALL'
        },

        5: {
            subject: 'Universal Human Values',
            faculty: 'Akhilesh Kumar Singh'
        },

        6: {
            subject: 'Remedial Class',
            group: 'ALL'
        }
    },


    Saturday: {

        1: {
            subject: 'Object-Oriented Programming using Java',
            faculty: 'Dr. Ankur Priyadarshi'
        },

        2: {
            subject: 'Remedial Class',
            group: 'ALL'
        },

        3: {
            subject: 'Discrete Mathematics & Graph Theory',
            faculty: 'Gaurav Kumar (Guest Faculty)'
        },

        4: {
            subject: 'Digital Electronics LAB',
            faculty: 'Ashutosh Kumar Jha',
            group: 'G2',
            duration: 2
        },

        4.1: {
            subject: 'Data Structures & Algorithms LAB',
            faculty: 'Gaurav Kumar',
            group: 'G1',
            duration: 2
        },

        6: {
            subject: 'Data Structures & Algorithms',
            faculty: 'Gaurav Kumar'
        }
    }

};


// =====================================================
// Exact Electrical 4th Semester Routine
// =====================================================

const electrical4Routine = {

    Monday: {
        1: 'Electrical Machine-II',
        2: 'Signals and Systems',
        3: 'Digital Electronics',
        4: 'Environmental Science'
    },

    Tuesday: {
        1: 'Signals and Systems',
        2: 'Electromagnetic Field Theory',
        3: 'Environmental Science'
    },

    Wednesday: {
        1: 'Electromagnetic Field Theory',
        2: 'Signals and Systems',
        3: 'Digital Electronics'
    },

    Thursday: {
        1: 'Digital Electronics',
        2: 'Electrical Machine-II',
        3: 'Control System'
    },

    Friday: {
        1: 'Control System'
    },

    Saturday: {
        1: 'Electrical Machine-II',
        2: 'Electromagnetic Field Theory',
        3: 'Control System'
    }

};


// =====================================================
// Generate timetable
// =====================================================

for (let i = 0; i < timeSlotList.length; i++) {

    const slot = timeSlotList[i];

    let routineEntry = null;
    let subject = null;
    let faculty = null;
    let group = 'ALL';
    let duration = 1;


    // -------------------------------------------------
    // CSE Semester 3
    // -------------------------------------------------

    if (
        branch === 'CSE' &&
        semester === 3 &&
        section === 'A'
    ) {

        // Handle second group entry in same starting slot
        if (slot.slotNumber === 2) {

            const entry1 =
                cse3Routine[slot.day]?.[2];

            const entry2 =
                cse3Routine[slot.day]?.['2.1'];

            if (entry1) {

                routineEntry = entry1;

            }

            // First entry will be created normally.
            // Second group entry will be created below.
        }

        else if (slot.slotNumber === 4) {

            const entry1 =
                cse3Routine[slot.day]?.[4];

            const entry2 =
                cse3Routine[slot.day]?.['4.1'];

            if (entry1) {
                routineEntry = entry1;
            }

        }

        else {

            routineEntry =
                cse3Routine[slot.day]?.[slot.slotNumber];

        }


        if (!routineEntry) {
            continue;
        }


        subject = routineEntry.subject;

        group = routineEntry.group || 'ALL';

        duration = routineEntry.duration || 1;


        if (routineEntry.faculty) {

            faculty = findFacultyByName(
                facultyList,
                routineEntry.faculty,
                'CSE'
            );

            if (!faculty) {
                throw new Error(
                    `CSE faculty not found: ${routineEntry.faculty}`
                );
            }

        }


    }


    // -------------------------------------------------
    // Electrical Semester 4
    // -------------------------------------------------

    else if (
        branch === 'Electrical' &&
        semester === 4 &&
        section === 'A'
    ) {

        subject =
            electrical4Routine[slot.day]?.[slot.slotNumber];


        // Skip empty periods
        if (!subject) {
            continue;
        }


        faculty = facultyList.find(f =>
    f.department.includes('Electrical') &&
    f.expertiseSubjects.some(
        s => s.trim().toLowerCase() === subject.trim().toLowerCase()
    )
);
console.log(
    'DEBUG:',
    subject,
    facultyList
        .filter(f => f.department.includes('Electrical'))
        .map(f => ({
            name: f.name,
            department: f.department,
            expertiseSubjects: f.expertiseSubjects
        }))
);

    }


    // -------------------------------------------------
    // Other branches
    // -------------------------------------------------

    else {

        subject = subjects[i % subjects.length];


        if (branch === 'Civil') {

            const civilFacultyBySection = {

                A: {
                    'Engineering Geology': 'Dr. Vikash Kumar',
                    'Hydraulics Engineering': 'Manish Kumar',
                    'Structural Analysis': 'Ravi Anand',
                    'BP&CACED': 'Shubham Kumar',
                    'Transportation Engineering': 'Dr. Vinod Kumar',
                    'CE-S&GI': 'MD Tabrej Alam',
                    'Geo Technical Engineering': 'Sumit Kumar'
                },

                B: {
                    'Engineering Geology': 'Dr. Vikash Kumar',
                    'Hydraulics Engineering': 'Manish Kumar',
                    'Structural Analysis': 'Ravi Anand',
                    'BP&CACED': 'Shubham Kumar',
                    'Transportation Engineering': 'Dr. Vinod Kumar',
                    'CE-S&GI': 'Shashank Saurabh',
                    'Geo Technical Engineering': 'Sumit Kumar'
                }

            };


            const facultyName =
                civilFacultyBySection[section]?.[subject];


            faculty = facultyList.find(f =>
                f.name === facultyName &&
                f.department.includes('Civil')
            );

        }

        else {

            faculty = facultyList.find(f =>
                f.expertiseSubjects.includes(subject) &&
                f.department.includes(branch)
            );

        }

    }


    // -------------------------------------------------
    // Check faculty
    // -------------------------------------------------

    if (
        subject !== 'Library' &&
        subject !== 'Remedial Class' &&
        !faculty
    ) {

        throw new Error(
            `Faculty not found for subject: ${subject}`
        );

    }


    // -------------------------------------------------
    // Faculty clash check
    // -------------------------------------------------

    if (faculty) {

        const facultySlotKey =
            `${faculty._id}_${slot._id}`;

        if (facultyBusySlots.has(facultySlotKey)) {

            throw new Error(
                `Faculty clash: ${faculty.name} is already assigned to this time slot.`
            );

        }

        facultyBusySlots.add(facultySlotKey);

    }


    // -------------------------------------------------
    // Room
    // -------------------------------------------------

    const room =
        roomList[i % roomList.length];


    // -------------------------------------------------
    // Create main timetable entry
    // -------------------------------------------------

    const timetableEntry =
        await Timetable.create({

            subjectName: subject,

            branch: branch,

            semester: semester,

            section: section,

            facultyId: faculty
                ? faculty._id
                : undefined,

            roomId:
                room
                ? room._id
                : undefined,

            timeSlotId: slot._id,

            group: group,

            duration: duration

        });


    generatedTimetable.push(timetableEntry);


    // -------------------------------------------------
    // Create second G1/G2 laboratory entry
    // -------------------------------------------------

    if (
        branch === 'CSE' &&
        semester === 3 &&
        section === 'A' &&
        (slot.slotNumber === 2 || slot.slotNumber === 4)
    ) {

        const secondKey =
            `${slot.slotNumber}.1`;

        const secondEntry =
            cse3Routine[slot.day]?.[secondKey];


        if (secondEntry) {

            const secondFaculty =
                findFacultyByName(
                    facultyList,
                    secondEntry.faculty,
                    'CSE'
                );


            if (!secondFaculty) {

                throw new Error(
                    `CSE faculty not found: ${secondEntry.faculty}`
                );

            }


            const secondFacultySlotKey =
                `${secondFaculty._id}_${slot._id}`;


            if (
                facultyBusySlots.has(
                    secondFacultySlotKey
                )
            ) {

                throw new Error(
                    `Faculty clash: ${secondFaculty.name} is already assigned to this time slot.`
                );

            }


            facultyBusySlots.add(
                secondFacultySlotKey
            );


            const secondRoom =
                roomList[
                    (i + 1) % roomList.length
                ];


            const secondTimetableEntry =
                await Timetable.create({

                    subjectName:
                        secondEntry.subject,

                    branch: branch,

                    semester: semester,

                    section: section,

                    facultyId:
                        secondFaculty._id,

                    roomId:
                        secondRoom
                        ? secondRoom._id
                        : undefined,

                    timeSlotId:
                        slot._id,

                    group:
                        secondEntry.group,

                    duration:
                        secondEntry.duration || 1

                });


            generatedTimetable.push(
                secondTimetableEntry
            );

        }

    }


    // -------------------------------------------------
    // Skip the second period of a 2-period lab
    // -------------------------------------------------

    

}

        // -------------------------------------------------
        // Return generated timetable
        // -------------------------------------------------

        const finalTimetable = await Timetable.find({
    branch: branch,
    semester: semester,
    section: section
})
            .populate('facultyId', 'name department')
            .populate('roomId', 'roomNo type')
            .populate('timeSlotId', 'day slotNumber');


        res.status(200).json({

            message: 'Timetable generated successfully!',

            branch: branch,

            semester: semester,

            totalClasses: generatedTimetable.length,

            timetable: finalTimetable

        });


    } catch (err) {

        console.error('Timetable generation error:', err);

        res.status(500).json({

            error: err.message

        });

    }

});


// =====================================================
// 3. ADD A MANUAL TIMETABLE ENTRY
// =====================================================

router.post('/add', async (req, res) => {

    try {

        const newEntry = new Timetable(req.body);

        const savedEntry = await newEntry.save();

        res.status(201).json({

            message: 'Timetable entry created successfully!',

            timetable: savedEntry

        });

    } catch (err) {

        res.status(400).json({

            error: err.message

        });

    }

});


// =====================================================
// 4. GET TIMETABLE FOR A FACULTY MEMBER
// =====================================================

router.get('/faculty/:facultyId', async (req, res) => {

    try {

        const facultyTimetable = await Timetable.find({
            facultyId: req.params.facultyId
        })
            .populate('roomId', 'roomNo type')
            .populate('timeSlotId', 'day slotNumber');

        res.status(200).json(facultyTimetable);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});


// =====================================================
// 5. FACULTY LEAVE REQUEST
// =====================================================

router.post('/leave-request', async (req, res) => {
    try {

        const { facultyId, timeSlotId, leaveDate } = req.body;

        if (!facultyId || !timeSlotId || !leaveDate) {
            return res.status(400).json({
                message: 'facultyId, timeSlotId and leaveDate are required.'
            });
        }

        // Find the class affected by the leave
        const affectedClass = await Timetable.findOne({
            facultyId: facultyId,
            timeSlotId: timeSlotId
        });

        if (!affectedClass) {
            return res.status(404).json({
                message: 'No class found for this faculty in the selected time slot.'
            });
        }

        // Find the faculty applying for leave
        const leavingFaculty = await Faculty.findById(facultyId);

        if (!leavingFaculty) {
            return res.status(404).json({
                message: 'Faculty not found.'
            });
        }

        // Find the fixed substitute mapping for this subject
        const substituteMapping = await SubstituteMapping.findOne({
            subjectName: affectedClass.subjectName,
            regularFacultyId: facultyId
        }).populate(
            'substituteFacultyId',
            'name department expertiseSubjects'
        );

        if (!substituteMapping) {
            return res.status(404).json({
                message: 'No fixed substitute mapping found for this subject.'
            });
        }

        const fixedSubstitute = substituteMapping.substituteFacultyId;

        // Find all faculty already busy in this time slot
        const busyFacultyIds = await Timetable.find({
            timeSlotId: timeSlotId
        }).distinct('facultyId');

        // Find other suitable faculty who are free
        // Find free faculty from the same department
const freeFacultyFilter = {
    department: { $in: leavingFaculty.department },
    _id: {
        $nin: [...busyFacultyIds, facultyId]
    }
};

// First find faculty qualified for the same subject
const qualifiedSubstitutes = await Faculty.find({
    ...freeFacultyFilter,
    expertiseSubjects: affectedClass.subjectName
});

// If no qualified faculty are available,
// allow other free faculty from the same department as fallback
const availableSubstitutes =
    qualifiedSubstitutes.length > 0
        ? qualifiedSubstitutes
        : await Faculty.find(freeFacultyFilter);

        // Check whether the fixed substitute is currently busy
        const fixedSubstituteIsBusy = busyFacultyIds.some(
            id => id.toString() === fixedSubstitute._id.toString()
        );

        // Prepare substitute options
        const substituteOptions = [];

        // Fixed substitute gets priority if available
        if (!fixedSubstituteIsBusy) {
            substituteOptions.push({
                facultyId: fixedSubstitute._id,
                name: fixedSubstitute.name,
                type: 'FIXED'
            });
        }

        // Add other available qualified faculty
        for (const faculty of availableSubstitutes) {

            if (
                faculty._id.toString() ===
                fixedSubstitute._id.toString()
            ) {
                continue;
            }

            substituteOptions.push({
                facultyId: faculty._id,
                name: faculty.name,
                type: 'ALTERNATIVE'
            });
        }

        if (substituteOptions.length === 0) {
            return res.status(404).json({
                message: 'No suitable substitute faculty is available for this time slot.'
            });
        }

        // Return all available substitute options
        // instead of automatically selecting the first one
        res.status(200).json({
            message: 'Leave request checked successfully. Select a substitute faculty.',
            leaveDate: leaveDate,
            subjectName: affectedClass.subjectName,
            timetableId: affectedClass._id,
            originalFacultyId: facultyId,
            substituteOptions: substituteOptions
        });

    } catch (err) {

        console.error('Leave request error:', err);

        res.status(500).json({
            error: err.message
        });
    }
});

// ============================================
// CUSTOM TIMETABLE GENERATION
// ============================================
router.post('/generate-custom', async (req, res) => {
    try {
        const { branch, semester, section, subjects, recessSlot } = req.body;

        if (!branch || !semester || !subjects || subjects.length === 0) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const recess = parseInt(recessSlot) || 3;

        // Ensure faculties exist or create them
        const facultyMap = {};
        for (const sub of subjects) {
            if (!sub.facultyName) continue;
            let fac = await Faculty.findOne({ name: sub.facultyName });
            if (!fac) {
                fac = await Faculty.create({
                    name: sub.facultyName,
                    department: branch,
                    expertiseSubjects: [sub.name]
                });
            }
            facultyMap[sub.name] = fac._id;
        }

        // Delete existing timetable for this custom combo
        await Timetable.deleteMany({ branch, semester: Number(semester), section });

        // Ensure TimeSlots exist
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const timeSlotIds = [];
        for (const day of days) {
            for (let slotNumber = 1; slotNumber <= 6; slotNumber++) {
                let slot = await TimeSlot.findOne({ day, slotNumber });
                if (!slot) {
                    slot = await TimeSlot.create({ day, slotNumber, startTime: "10:00 AM", endTime: "5:00 PM" }); // Simplified
                }
                timeSlotIds.push(slot);
            }
        }
        
        // Ensure dummy room exists
        let dummyRoom = await Room.findOne({ roomNo: 'CUSTOM-101' });
        if (!dummyRoom) {
            dummyRoom = await Room.create({ roomNo: 'CUSTOM-101', capacity: 100, type: 'Lecture Hall' });
        }

        const newTimetable = [];

        for (const day of days) {
            // Track which subjects/faculties have been assigned today
            const assignedToday = new Set();
            
            for (let slotNum = 1; slotNum <= 6; slotNum++) {
                if (slotNum === recess) continue; // Recess time

                // Find subjects not yet assigned today
                let availableSubjects = subjects.filter(s => !assignedToday.has(s.name));
                
                if (availableSubjects.length === 0) {
                    break; // No more subjects can be assigned today, remaining slots will be Free
                }
                
                // Shuffle available subjects
                availableSubjects.sort(() => 0.5 - Math.random());
                
                let sub = availableSubjects[0];
                
                // Prevent lab from crossing recess or day end
                if (sub.isLab && (slotNum + 1 === recess || slotNum + 1 > 6)) {
                    const nonLabSub = availableSubjects.find(s => !s.isLab);
                    if (nonLabSub) {
                        sub = nonLabSub;
                    } else {
                        continue; // Skip this slot, try next slot
                    }
                }
                
                // Mark as assigned today
                assignedToday.add(sub.name);
                
                // Get slot document
                const ts = timeSlotIds.find(s => s.day === day && s.slotNumber === slotNum);
                
                const entry = new Timetable({
                    branch,
                    semester: Number(semester),
                    section: section || 'A',
                    subjectName: sub.name,
                    facultyId: facultyMap[sub.name] || null,
                    roomId: dummyRoom._id,
                    timeSlotId: ts._id,
                    duration: sub.isLab ? 2 : 1
                });

                newTimetable.push(entry);
                
                // Skip next slot if lab
                if (sub.isLab) slotNum++;
            }
        }

        await Timetable.insertMany(newTimetable);

        res.status(200).json({ message: "Custom timetable generated successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
// Save Bulk Edited Timetable
router.post('/save-bulk', async (req, res) => {
    try {
        const { branch, semester, section, entries } = req.body;
        
        if (!branch || !semester || !section || !entries) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        // Delete existing for this scope
        await Timetable.deleteMany({
            branch: branch,
            semester: semester,
            section: section
        });
        
        // Re-insert new entries
        if (entries.length > 0) {
            // Need to map entries back to mongoose IDs
            // But frontend already sends populated timeSlotId object, we just need _id
            const mappedEntries = [];
            for (let e of entries) {
                let resolvedFacultyId = e.facultyId._id || e.facultyId;
                
                // If they edited the name inline, e.facultyId.name is the new string
                const facName = e.facultyId?.name || (typeof e.facultyId === 'string' ? e.facultyId : null);
                
                if (facName) {
                    let fac = await Faculty.findOne({ name: facName });
                    if (!fac) {
                        fac = await Faculty.create({
                            name: facName,
                            email: `${facName.toLowerCase().replace(/\s+/g, '.')}@faculty.com`,
                            password: "password123",
                            department: branch,
                            expertiseSubjects: [e.subjectName || e.subject]
                        });
                    }
                    resolvedFacultyId = fac._id;
                }
                
                mappedEntries.push({
                    branch: branch,
                    semester: semester,
                    section: section,
                    timeSlotId: e.timeSlotId._id || e.timeSlotId,
                    facultyId: resolvedFacultyId,
                    roomId: e.roomId._id || e.roomId,
                    subjectName: e.subjectName || e.subject,
                    duration: e.duration || 1
                });
            }
            await Timetable.insertMany(mappedEntries);
        }

        res.status(200).json({ message: "Timetable saved successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;