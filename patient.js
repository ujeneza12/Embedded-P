const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
const db = require("./connect");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.post("/api/patient", (req, res) => {
  const patientInfo = req.body;

  if (patientInfo.BodyTemperature < 37 || patientInfo.BodyTemperature > 40) {
    return res.status(400).json({ error: "Invalid temperature. BodyTemp should be between 37 and 40 degrees Celsius." });
  }

  if (patientInfo.HeartRate < 60 || patientInfo.HeartRate > 80) {
    return res.status(400).json({ error: "Invalid heart rate. HeartRate should be between 60 and 80 beats per minute." });
  }
  
  const stmt = db.prepare("INSERT INTO patients (PatientName, NationalID, HeartRate, BodyTemperature, FrequentSickness) VALUES (?, ?, ?, ?, ?)");
        stmt.run(
    patientInfo.PatientName,
    patientInfo.NationalID,
    patientInfo.HeartRate,
    patientInfo.BodyTemperature,
    patientInfo.FrequentSickness
  );
  stmt.finalize();1
  res.status(201).json({ message: "Patient data received and stored." });
});


app.get("/api/patients", (req, res) => {
  
  db.all("SELECT * FROM patients", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});