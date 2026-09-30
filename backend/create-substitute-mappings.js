const mongoose = require('mongoose');
const Faculty = require('./models/Faculty');
const SubstituteMapping = require('./models/SubstituteMapping');

const MONGO_URI = 'mongodb://127.0.0.1:27017/smart-timetable';

async function createMappings() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log('MongoDB Connected Successfully');

        const mappings = [
            {
                subjectName: 'Digital Electronics',
                regularFaculty: 'Ravi Kumar',
                substituteFaculty: 'Sapna Kumari'
            },
            {
                subjectName: 'Electrical Machine-II',
                regularFaculty: 'Kavita Yadav',
                substituteFaculty: 'Poonam Mam'
            },
            {
                subjectName: 'Electromagnetic Field Theory',
                regularFaculty: 'Dr. Pritam Kumar',
                substituteFaculty: 'Ajeet Kumar'
            },
            {
                subjectName: 'Control System',
                regularFaculty: 'Ajeet Kumar',
                substituteFaculty: 'Kavita Yadav'
            },
            {
                subjectName: 'Environmental Science',
                regularFaculty: 'Sumit Kumar',
                substituteFaculty: 'Akhilesh Kumar'
            },
            {
                subjectName: 'Signals and Systems',
                regularFaculty: 'Rashmi Kumari',
                substituteFaculty: 'Saddam Hussain'
            }
        ];

        for (const mapping of mappings) {

            const regular = await Faculty.findOne({
                name: mapping.regularFaculty
            });

            const substitute = await Faculty.findOne({
                name: mapping.substituteFaculty
            });

            if (!regular) {
                console.log(
                    `Regular faculty not found: ${mapping.regularFaculty}`
                );
                continue;
            }

            if (!substitute) {
                console.log(
                    `Substitute faculty not found: ${mapping.substituteFaculty}`
                );
                continue;
            }

            const existingMapping =
                await SubstituteMapping.findOne({
                    subjectName: mapping.subjectName
                });

            if (existingMapping) {
                console.log(
                    `Mapping already exists: ${mapping.subjectName}`
                );
                continue;
            }

            await SubstituteMapping.create({
                subjectName: mapping.subjectName,
                regularFacultyId: regular._id,
                substituteFacultyId: substitute._id
            });

            console.log(
                `Mapping created: ${mapping.subjectName} -> ${mapping.substituteFaculty}`
            );
        }

        console.log('Finished creating substitute mappings.');

        await mongoose.connection.close();

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createMappings();