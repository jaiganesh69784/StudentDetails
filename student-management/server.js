const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://localhost:27017/studentDB', { useNewUrlParser: true, useUnifiedTopology: true });

const studentSchema = new mongoose.Schema({
    name: String,
    rollno: String,
    class: String,
    section: String,
    semester: String,
    cgpa: Number,
    attendance: Number,
    place: String,
});

const Student = mongoose.model('Student', studentSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/student', (req, res) => {
    res.render('student');
});

app.post('/student', (req, res) => {
    const student = new Student({
        name: req.body.name,
        rollno: req.body.rollno,
        class: req.body.class,
        section: req.body.section,
        semester: req.body.semester,
        cgpa: req.body.cgpa,
        attendance: req.body.attendance,
        place: req.body.place,
    });
    student.save((err) => {
        if (!err) {
            res.render('result', { message: 'Successfully submitted!' });
        } else {
            res.render('result', { message: 'Submission failed!' });
        }
    });
});

app.get('/teacher', (req, res) => {
    res.render('teacher');
});

app.post('/teacher', (req, res) => {
    Student.findOne({ name: req.body.name, rollno: req.body.rollno }, (err, foundStudent) => {
        if (foundStudent) {
            res.render('result', { message: `Details: ${JSON.stringify(foundStudent)}` });
        } else {
            res.render('result', { message: 'No student found!' });
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});