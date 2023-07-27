const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); 
const app = express();
const port = 3000;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'manager',
  database: 'Wathare',
});

app.use(express.json());
app.use(cors()); 


app.get('/students', async (req, res) => {
  const sql = 'SELECT * FROM student';
  try {
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Error fetching students' });
  }
});

app.post('/students', async (req, res) => {
  const { student_name, roll_no, percentage, result, year_of_passout } = req.body;
  const sql = 'INSERT INTO student (student_name, roll_no, percentage, result, year_of_passout) VALUES (?, ?, ?, ?, ?)';
  const values = [student_name, roll_no, percentage, result, year_of_passout];

  try {
    await pool.query(sql, values);
    console.log('Student created successfully');
    res.status(201).json({ message: 'Student created successfully' });
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ error: 'Error creating student' });
  }
});

app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { student_name, roll_no, percentage, result, year_of_passout } = req.body;
  const sql = 'UPDATE student SET student_name=?, roll_no=?, percentage=?, result=?, year_of_passout=? WHERE student_id=?';
  const values = [student_name, roll_no, percentage, result, year_of_passout, id];

  try {
    await pool.query(sql, values);
    console.log('Student updated successfully');
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ error: 'Error updating student' });
  }
});


app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM student WHERE student_id=?';
  const values = [id];

  try {
    await pool.query(sql, values);
    console.log('Student deleted successfully');
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ error: 'Error deleting student' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
