const mongoose = require('mongoose');
const Faculty = require('./models/Faculty');

const MONGO_URI = 'mongodb://127.0.0.1:27017/smart-timetable';

async function addSubstituteFaculty() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log('MongoDB Connected Successfully');

        const facultyList = [
            {
                name: 'Saddam Hussain',
                email: '',
                department: ['Electrical'],
                expertiseSubjects: ['Signals and Systems']
            },
            {
                name: 'Poonam Mam',
                email: '',
                department: ['Electrical'],
                expertiseSubjects: ['Electrical Machine-II']
            },
            {
                name: 'Akhilesh Kumar',
                email: '',
                department: ['Electrical'],
                expertiseSubjects: ['Environmental Science']
            }
        ];

        for (const facultyData of facultyList) {

            const existingFaculty = await Faculty.findOne({
                name: facultyData.name
            });

            if (existingFaculty) {
                console.log(
                    `Already exists: ${facultyData.name}`
                );
            } else {
                const newFaculty = await Faculty.create(facultyData);

                console.log(
                    `Added successfully: ${newFaculty.name}`
                );
            }
        }

        console.log('Finished.');
        await mongoose.connection.close();

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

addSubstituteFaculty();