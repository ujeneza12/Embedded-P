const express = require("express");
const bodyParser = require("body-parser");
const sqlite3= require('sqlite3').verbose();
const db= new sqlite3.Database('patient.db');

const app = express();
const port = 3000;

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY,
      PatientName TEXT,
      NationalID TEXT,
      HeartRate INTEGER,
      BodyTemperature REAL,
      FrequentSickness TEXT
    )`);
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("cors")());

const patientData = [];

app.post("/api/patient", (req, res) => {
  const patientInfo = req.body;
  patientData.push(patientInfo);
  res.status(201).json({ message: "Patient data received and stored." });

  db.run(`INSERT INTO patient (PatientName, NationalID, HeartRate, BodyTemperature, FrequentSickness) VALUES (?, ?, ?, ?, ?)`,
  [patientInfo.PatientName, patientInfo.NationalID, patientInfo.HeartRate, patientInfo.BodyTemperature, patientInfo.FrequentSickness],
  function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error saving patient data' });
    } else {
      res.status(201).json({ message: 'Patient data received and stored.' });
    }
  });
});

app.get("/api/patients", (req, res) => {
  res.json(patientData);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
