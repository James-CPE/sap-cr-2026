const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
  const query = `
    SELECT 
      f.*,
      COUNT(s.id) as staff_count,
      COUNT(e.id) as equipment_count
    FROM health_facilities f
    LEFT JOIN medical_staff s ON f.id = s.facility_id AND s.status = 'active'
    LEFT JOIN equipment e ON f.id = e.facility_id AND e.status = 'operational'
    GROUP BY f.id
    ORDER BY f.name
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM health_facilities WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    res.json(results[0]);
  });
});

router.post('/', (req, res) => {
  const {
    name, type, district, subdistrict, address, phone, email,
    beds_total, beds_available, latitude, longitude
  } = req.body;

  const query = `
    INSERT INTO health_facilities 
    (name, type, district, subdistrict, address, phone, email, 
     beds_total, beds_available, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name, type, district, subdistrict, address, phone, email,
    beds_total, beds_available, latitude, longitude
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, message: 'Facility created successfully' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    name, type, district, subdistrict, address, phone, email,
    beds_total, beds_available, latitude, longitude
  } = req.body;

  const query = `
    UPDATE health_facilities 
    SET name = ?, type = ?, district = ?, subdistrict = ?, address = ?, 
        phone = ?, email = ?, beds_total = ?, beds_available = ?, 
        latitude = ?, longitude = ?
    WHERE id = ?
  `;

  const values = [
    name, type, district, subdistrict, address, phone, email,
    beds_total, beds_available, latitude, longitude, id
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    res.json({ message: 'Facility updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM health_facilities WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    res.json({ message: 'Facility deleted successfully' });
  });
});

module.exports = router;
