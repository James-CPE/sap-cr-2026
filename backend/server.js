const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const facilitiesRoutes = require('./routes/facilities');
const statisticsRoutes = require('./routes/statistics');

app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/statistics', statisticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Chiang Rai Health Dashboard API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
