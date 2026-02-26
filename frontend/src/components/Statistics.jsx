import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Chart } from 'chart.js/auto';

const PatientChart = memo(function PatientChart({ patientStats }) {
  useEffect(() => {
    if (patientStats.length > 0) {
      const ctx = document.getElementById('patientChart');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: patientStats.map(stat => stat.date),
            datasets: [
              {
                label: 'ผู้ป่วยนอก',
                data: patientStats.map(stat => stat.outpatients),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
              },
              {
                label: 'ผู้ป่วยใน',
                data: patientStats.map(stat => stat.inpatients),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
              },
              {
                label: 'ผู้ป่วยฉุกเฉิน',
                data: patientStats.map(stat => stat.emergency_cases),
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  }, [patientStats]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">แนวโน้มผู้ป่วย</h3>
      <canvas id="patientChart"></canvas>
    </div>
  );
});

const StatsCards = memo(function StatsCards({ totalStats }) {
  const statsCards = useMemo(() => [
    { label: 'ผู้ป่วยนอก', value: totalStats.outpatients, color: 'text-blue-600' },
    { label: 'ผู้ป่วยใน', value: totalStats.inpatients, color: 'text-green-600' },
    { label: 'ฉุกเฉิน', value: totalStats.emergency_cases, color: 'text-red-600' },
    { label: 'การผ่าตัด', value: totalStats.surgeries, color: 'text-purple-600' },
    { label: 'การคลอด', value: totalStats.births, color: 'text-pink-600' },
    { label: 'เสียชีวิต', value: totalStats.deaths, color: 'text-gray-600' }
  ], [totalStats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statsCards.map((stat, index) => (
        <div key={`${stat.label}-${index}`} className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">{stat.label}</div>
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
});

const PatientStatsTable = memo(function PatientStatsTable({ patientStats }) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">ข้อมูลรายวัน</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ป่วยนอก</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ป่วยใน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ฉุกเฉิน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การผ่าตัด</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การคลอด</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เสียชีวิต</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patientStats.map((stat, index) => (
              <tr key={`${stat.date}-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.outpatients.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.inpatients.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.emergency_cases.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.surgeries.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.births.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.deaths.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const Statistics = () => {
  const [patientStats, setPatientStats] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
    fetchPatientStats();
  }, []);

  useEffect(() => {
    fetchPatientStats();
  }, [selectedFacility, startDate, endDate]);

  const fetchFacilities = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/facilities');
      const data = await response.json();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  }, []);

  const fetchPatientStats = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedFacility) params.append('facility_id', selectedFacility);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await fetch(`http://localhost:5000/api/statistics/patient-stats?${params}`);
      const data = await response.json();
      setPatientStats(data);
    } catch (error) {
      console.error('Error fetching patient statistics:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedFacility, startDate, endDate]);


  const getTotalStats = useCallback(() => {
    return patientStats.reduce((acc, stat) => ({
      outpatients: acc.outpatients + stat.outpatients,
      inpatients: acc.inpatients + stat.inpatients,
      emergency_cases: acc.emergency_cases + stat.emergency_cases,
      surgeries: acc.surgeries + stat.surgeries,
      births: acc.births + stat.births,
      deaths: acc.deaths + stat.deaths
    }), { outpatients: 0, inpatients: 0, emergency_cases: 0, surgeries: 0, births: 0, deaths: 0 });
  }, [patientStats]);

  const totalStats = useMemo(() => getTotalStats(), [getTotalStats]);

  const handleReset = useCallback(() => {
    setSelectedFacility('');
    setStartDate('');
    setEndDate('');
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">สถิติข้อมูลผู้ป่วย</h2>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">ตัวกรองข้อมูล</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">สถานพยาบาล</label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">ทุกสถานพยาบาล</option>
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">วันที่เริ่มต้น</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">วันที่สิ้นสุด</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              รีเซ็ต
            </button>
          </div>
        </div>
      </div>

      <StatsCards totalStats={totalStats} />

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">แนวโน้มผู้ป่วย</h3>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <PatientChart patientStats={patientStats} />
        )}
      </div>

      <PatientStatsTable patientStats={patientStats} />
    </div>
  );
};

export default Statistics;
