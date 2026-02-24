const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/overview', (req, res) => {
  const queries = {
    totalFacilities: 'SELECT COUNT(*) as count FROM health_facilities',
    totalStaff: 'SELECT COUNT(*) as count FROM medical_staff WHERE status = "active"',
    totalBeds: 'SELECT SUM(beds_total) as total FROM health_facilities',
    availableBeds: 'SELECT SUM(beds_available) as total FROM health_facilities',
    operationalEquipment: 'SELECT COUNT(*) as count FROM equipment WHERE status = "operational"'
  };

  const promises = Object.values(queries).map(query => 
    new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    })
  );

  Promise.all(promises)
    .then(([facilities, staff, totalBeds, availableBeds, equipment]) => {
      res.json({
        totalFacilities: facilities.count,
        totalStaff: staff.count,
        totalBeds: totalBeds.total || 0,
        availableBeds: availableBeds.total || 0,
        bedOccupancyRate: totalBeds.total > 0 ? 
          ((totalBeds.total - availableBeds.total) / totalBeds.total * 100).toFixed(1) : 0,
        operationalEquipment: equipment.count
      });
    })
    .catch(err => {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error' });
    });
});

router.get('/patient-stats', (req, res) => {
  const { facility_id, start_date, end_date } = req.query;
  
  let query = `
    SELECT 
      DATE(date) as date,
      SUM(outpatients) as outpatients,
      SUM(inpatients) as inpatients,
      SUM(emergency_cases) as emergency_cases,
      SUM(surgeries) as surgeries,
      SUM(births) as births,
      SUM(deaths) as deaths
    FROM patient_statistics
    WHERE 1=1
  `;
  
  const params = [];
  
  if (facility_id) {
    query += ' AND facility_id = ?';
    params.push(facility_id);
  }
  
  if (start_date) {
    query += ' AND date >= ?';
    params.push(start_date);
  }
  
  if (end_date) {
    query += ' AND date <= ?';
    params.push(end_date);
  }
  
  query += ' GROUP BY DATE(date) ORDER BY date';
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

router.get('/facility-distribution', (req, res) => {
  const query = `
    SELECT 
      type,
      COUNT(*) as count,
      SUM(beds_total) as total_beds
    FROM health_facilities
    GROUP BY type
    ORDER BY count DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

router.get('/district-summary', (req, res) => {
  const query = `
    SELECT 
      district,
      COUNT(*) as facility_count,
      SUM(beds_total) as total_beds,
      SUM(beds_available) as available_beds,
      COUNT(DISTINCT s.id) as staff_count
    FROM health_facilities f
    LEFT JOIN medical_staff s ON f.id = s.facility_id AND s.status = 'active'
    GROUP BY district
    ORDER BY facility_count DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;
