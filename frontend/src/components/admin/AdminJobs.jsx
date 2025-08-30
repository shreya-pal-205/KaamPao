import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '@/redux/jobSlice';

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-200 py-12 px-4">
        {/* Header */}
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-extrabold drop-shadow-xl tracking-wide">
            Company Directory
          </h1>
          <p className="text-orange-100 mt-2 text-sm">Manage and explore all your partner companies</p>
        </div>

        {/* Main layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Table section */}
          <div className="lg:col-span-8">
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-orange-200 hover:shadow-orange-300 transition-shadow">
              <h2 className="text-xl font-semibold text-orange-700 mb-4">📋 Companies List</h2>
              <AdminJobsTable />
            </div>
          </div>

          {/* Sidebar filter & action */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-orange-50/70 backdrop-blur-md border border-orange-200 rounded-3xl p-6 shadow-xl space-y-6">
              <div>
                <label className="block text-orange-800 text-sm font-semibold mb-2">Search Companies</label>
                <Input
                  className="bg-white border border-orange-300 placeholder-orange-400 text-orange-700 rounded-xl focus-visible:ring-orange-500"
                  placeholder="🔍 Filter companies..."
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <Button
                onClick={() => navigate("/admin/jobs/create")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-xl shadow-md"
              >
                <Plus size={18} />&nbsp; Add New Job
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminJobs;

