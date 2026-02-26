import React, { useState, useEffect, useMemo, memo } from 'react';
import { Chart } from 'chart.js/auto';

const OverviewCard = memo(function OverviewCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color} rounded-md p-3`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
});

const FacilityChart = memo(function FacilityChart({ facilityDistribution }) {
  useEffect(() => {
    if (facilityDistribution.length > 0) {
      const ctx = document.getElementById('facilityChart');
      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: facilityDistribution.map(f => f.type),
            datasets: [{
              data: facilityDistribution.map(f => f.count),
              backgroundColor: [
                '#3B82F6',
                '#10B981',
                '#F59E0B',
                '#EF4444'
              ]
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
    }
  }, [facilityDistribution]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">การกระจายสถานพยาบาล</h3>
      <canvas id="facilityChart"></canvas>
    </div>
  );
});

const DistrictSummaryTable = memo(function DistrictSummaryTable({ districtSummary }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">สรุปตามอำเภอ</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อำเภอ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานพยาบาล</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เตียง</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บุคลากร</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {districtSummary.map((district, index) => (
              <tr key={`${district.district}-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{district.district}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.facility_count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.total_beds}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.staff_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const Dashboard = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [facilityDistribution, setFacilityDistribution] = useState([]);
  const [districtSummary, setDistrictSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewRes, distributionRes, districtRes] = await Promise.all([
        fetch('http://localhost:5000/api/statistics/overview'),
        fetch('http://localhost:5000/api/statistics/facility-distribution'),
        fetch('http://localhost:5000/api/statistics/district-summary')
      ]);

      const [overview, distribution, district] = await Promise.all([
        overviewRes.json(),
        distributionRes.json(),
        districtRes.json()
      ]);

      setOverviewData(overview);
      setFacilityDistribution(distribution);
      setDistrictSummary(district);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  const overviewCards = useMemo(() => [
    {
      title: 'สถานพยาบาลทั้งหมด',
      value: overviewData?.totalFacilities || 0,
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-primary-500'
    },
    {
      title: 'บุคลากรแพทย์',
      value: overviewData?.totalStaff || 0,
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      title: 'เตียงทั้งหมด',
      value: overviewData?.totalBeds || 0,
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: 'bg-yellow-500'
    },
    {
      title: 'อัตราการใช้เตียง',
      value: `${overviewData?.bedOccupancyRate || 0}%`,
      icon: (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-red-500'
    }
  ], [overviewData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">ภาพรวมระบบสุขภาพจังหวัดเชียงราย</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <OverviewCard
            key={`${card.title}-${index}`}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FacilityChart facilityDistribution={facilityDistribution} />
        <DistrictSummaryTable districtSummary={districtSummary} />
      </div>
    </div>
  );
};

export default Dashboard;
