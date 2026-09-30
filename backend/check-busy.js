const mongoose = require('mongoose');
const Faculty = require('./models/Faculty');

const MONGO_URI = 'mongodb://127.0.0.1:27017/smart-timetable';

async function addAnkur() {
    try {
        await mongoose.connect(MONGO_URI);

        const existing = await Faculty.findOne({
            name: 'Ankur Priyedarshi'
        });

        if (existing) {
            console.log('Ankur Priyedarshi already exists.');
        } else {
            const faculty = await Faculty.create({
                name: 'Ankur Priyedarshi',
                email: '',
                department: ['Electrical'],
                expertiseSubjects: ['Digital Electronics']
            });

            console.log('Ankur Priyedarshi added successfully.');
            console.log(faculty);
        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('Error:', error.message);
    }
}

addAnkur();