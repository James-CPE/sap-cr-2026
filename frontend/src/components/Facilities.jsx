import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';

const FacilityForm = memo(function FacilityForm({ 
  showForm, 
  editingFacility, 
  formData, 
  setFormData, 
  setShowForm, 
  setEditingFacility, 
  fetchFacilities 
}) {
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const url = editingFacility 
        ? `http://localhost:5000/api/facilities/${editingFacility.id}`
        : 'http://localhost:5000/api/facilities';
      
      const method = editingFacility ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchFacilities();
        setShowForm(false);
        setEditingFacility(null);
        setFormData({
          name: '',
          type: 'hospital',
          district: '',
          subdistrict: '',
          address: '',
          phone: '',
          email: '',
          beds_total: 0,
          beds_available: 0,
          latitude: '',
          longitude: ''
        });
      }
    } catch (error) {
      console.error('Error saving facility:', error);
    }
  }, [editingFacility, formData, fetchFacilities, setShowForm, setEditingFacility, setFormData]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setEditingFacility(null);
  }, [setShowForm, setEditingFacility]);

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  }, [setFormData]);

  if (!showForm) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {editingFacility ? 'แก้ไขสถานพยาบาล' : 'เพิ่มสถานพยาบาลใหม่'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ชื่อสถานพยาบาล</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ประเภท</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="hospital">โรงพยาบาล</option>
            <option value="clinic">คลินิก</option>
            <option value="health_center">ศูนย์สุขภาพ</option>
            <option value="sub_health_center">สถานีอนามัย</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">อำเภอ</label>
          <input
            type="text"
            name="district"
            required
            value={formData.district}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ตำบล</label>
          <input
            type="text"
            name="subdistrict"
            required
            value={formData.subdistrict}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">ที่อยู่</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">โทรศัพท์</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">อีเมล</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">เตียงทั้งหมด</label>
          <input
            type="number"
            name="beds_total"
            value={formData.beds_total}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">เตียงว่าง</label>
          <input
            type="number"
            name="beds_available"
            value={formData.beds_available}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="md:col-span-2 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            {editingFacility ? 'บันทึกการแก้ไข' : 'เพิ่มสถานพยาบาล'}
          </button>
        </div>
      </form>
    </div>
  );
});

const FacilityCard = memo(function FacilityCard({ facility, onEdit, onDelete }) {
  const getFacilityTypeText = useCallback((type) => {
    const types = {
      hospital: 'โรงพยาบาล',
      clinic: 'คลินิก',
      health_center: 'ศูนย์สุขภาพ',
      sub_health_center: 'สถานีอนามัย'
    };
    return types[type] || type;
  }, []);

  return (
    <li>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <p className="text-sm font-medium text-primary-600 truncate">{facility.name}</p>
              <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {getFacilityTypeText(facility.type)}
              </span>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  {facility.district}, {facility.subdistrict}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  เตียง: {facility.beds_available}/{facility.beds_total}
                </p>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <p>บุคลากร: {facility.staff_count}</p>
                <p className="ml-6">อุปกรณ์: {facility.equipment_count}</p>
              </div>
            </div>
          </div>
          <div className="ml-5 flex-shrink-0 flex space-x-2">
            <button
              onClick={() => onEdit(facility)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              แก้ไข
            </button>
            <button
              onClick={() => onDelete(facility.id)}
              className="text-red-600 hover:text-red-900"
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    </li>
  );
});

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'hospital',
    district: '',
    subdistrict: '',
    address: '',
    phone: '',
    email: '',
    beds_total: 0,
    beds_available: 0,
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/facilities');
      const data = await response.json();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = useCallback((facility) => {
    setEditingFacility(facility);
    setFormData(facility);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('คุณต้องการลบสถานพยาบาลนี้ใช่หรือไม่?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/facilities/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchFacilities();
        }
      } catch (error) {
        console.error('Error deleting facility:', error);
      }
    }
  }, [fetchFacilities]);

  const handleAddNew = useCallback(() => {
    setEditingFacility(null);
    setFormData({
      name: '',
      type: 'hospital',
      district: '',
      subdistrict: '',
      address: '',
      phone: '',
      email: '',
      beds_total: 0,
      beds_available: 0,
      latitude: '',
      longitude: ''
    });
    setShowForm(true);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">จัดการสถานพยาบาล</h2>
        <button
          onClick={handleAddNew}
          className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600"
        >
          เพิ่มสถานพยาบาล
        </button>
      </div>

      <FacilityForm
        showForm={showForm}
        editingFacility={editingFacility}
        formData={formData}
        setFormData={setFormData}
        setShowForm={setShowForm}
        setEditingFacility={setEditingFacility}
        fetchFacilities={fetchFacilities}
      />

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {facilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Facilities;
