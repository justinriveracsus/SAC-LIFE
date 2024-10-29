
const express = require("express");
const sql = require("mssql");
const cors = require('cors')
const port = 5000;


require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

const studentsRoute = require('./routes/students');
const campus_servicesRoute = require('./routes/campus_services');
const tagsRoute = require('./routes/tags');

app.use('/api/students', studentsRoute);
app.use('/api/campus_services', campus_servicesRoute);
app.use('/api/tags', tagsRoute);

const config = {
    user: 'SacStateLifeAdmin',
    password: 'TheNest2024',
    server: 'csuslife.database.windows.net',
    database: 'csusLifeAppMainDB',
    options: {
        encrypt: true
    }
};

app.get('/', (req, res) => {
    res.send('Hello from Node.js backend!')
})

// Get test_student_tags table from SQL
app.get('/api/tags', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM test_student_tags')
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server Error');
    }
})

// Get test_student_tags table from SQL
app.get('/api/tags_service', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM test_tag_service')
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server Error');
    }
})

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})


//sql connect(config) establishes connection to Azure SQL database using config
sql.connect(config).then(pool => {
    return pool.request().query('SELECT * FROM test_students');
}).then(result => {
    console.log(result);
}).catch(err => {
    console.error(err);
});


connectAndGetDB();

// make a connection and query from database
async function connectAndGetDB() {
    try{
        console.log('Attempting to connect and retrieve data')
        var poolConnection = await sql.connect(config);
        var resultSet = await poolConnection.request().query('SELECT f_name, l_name, serv_name FROM test_students, test_student_tags, test_tag_service, test_campus_services WHERE test_students.std_id = test_student_tags.std_id AND test_student_tags.tag_id = test_tag_service.tag_id AND test_tag_service.service_id = test_campus_services.service_id');
        console.log('Retrieved data on students and services recommended');
        console.log(resultSet);
        //close connection
        // poolConnection.close();
    } catch (err){
        console.error(err.message);
    }
}

// Additional function for another query
async function connectAndGetAdditionalData() {
    try {
        console.log('Attempting to connect and retrieve additional data');
        var poolConnection = await sql.connect(config);
        var additionalResultSet = await poolConnection.request().query('SELECT * FROM another_table'); // Replace with your actual query
        console.log('Retrieved additional data');
        console.log(additionalResultSet);
        // Close connection
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}

// Data retrieval function for Student Services
async function connectAndGetServices() {
    try {
        console.log('Attempting to connect and retrieve additional data');
        var poolConnection = await sql.connect(config);
        var additionalResultSet = await poolConnection.request().query('SELECT * FROM test_campus_services'); // Replace with your actual query
        console.log('Retrieved additional data');
        console.log(additionalResultSet);
        // Close connection
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}

// Function to retrieve students and their tags (Need to test this one still...)
async function connectAndGetStudentNamesAndTags() {
    try {
        console.log('Attempting to connect and retrieve additional data');
        var poolConnection = await sql.connect(config);
        var additionalResultSet = await poolConnection.request().query('SELECT s.std_id, s.f_name, s.l_name, t.tag_name FROM test_students AS s JOIN test_student_tags AS st ON s.std_id = st.std_id JOIN test_tags AS t ON st.tag_id = t.tag_id ORDER BY s.l_name, s.f_name;'); // Replace with your actual query
        console.log('Retrieved additional data');
        console.log(additionalResultSet);
        // Close connection
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}
