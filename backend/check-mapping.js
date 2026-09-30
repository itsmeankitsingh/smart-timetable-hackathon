const mongoose = require('mongoose');
const Faculty = require('./models/Faculty');
const SubstituteMapping = require('./models/SubstituteMapping');

const MONGO_URI = 'mongodb://127.0.0.1:27017/smart-timetable';

async function checkMapping() {
    try {
        await mongoose.connect(MONGO_URI);

        const mapping = await SubstituteMapping.findOne({
            subjectName: 'Digital Electronics'
        })
        .populate('regularFacultyId', 'name')
        .populate('substituteFacultyId', 'name');

        console.log('Mapping found:');
        console.log(mapping);

        await mongoose.connection.close();

    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkMapping();