import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import CompaniesTable from './CompaniesTable';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(setSearchCompanyByText(input));
  }, [input]);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-200 py-12 px-4">
        {/* Header */}
        <div className="text-center text-white mb-10">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">Company Directory</h1>
          <p className="text-orange-100 mt-2 text-sm">All your partner companies in one place</p>
        </div>

        {/* Filter and Add */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-orange-100/30 backdrop-blur-sm border border-orange-300 p-6 rounded-xl shadow-lg">
          <Input
            className="md:w-1/3 bg-orange-50 border-none placeholder-orange-500 text-orange-700 focus-visible:ring-2 focus-visible:ring-white"
            placeholder="🔍 Filter companies..."
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/companies/create")} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg">
            <Plus size={16} />&nbsp; New Company
          </Button>
        </div>

        <CompaniesTable />
      </div>
    </>
  );
};

export default Companies;
