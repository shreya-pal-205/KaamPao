import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setSingleCompany } from '@/redux/companySlice';
import { toast } from 'sonner';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();
    const dispatch = useDispatch();


    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-200 py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white/30 border border-orange-300 backdrop-blur-xl rounded-3xl shadow-2xl px-10 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-orange-900 drop-shadow-lg">
              Let’s Set Up Your Company
            </h1>
            <p className="mt-3 text-orange-800 text-lg font-medium">
              Give your company a name and upload its logo. You can edit this later.
            </p>
          </div>

          {/* Company Logo Upload (Mock) */}
          <div className="mb-8">
            <Label className="text-orange-900 font-semibold">Company Logo</Label>
            <div className="mt-2 border-2 border-dashed border-orange-400 rounded-xl p-6 flex flex-col items-center justify-center bg-white/40 hover:bg-white/60 transition">
              <UploadCloud className="w-10 h-10 text-orange-600 mb-2" />
              <span className="text-orange-700 font-medium">Drag & drop or click to upload</span>
              <p className="text-sm text-orange-600 opacity-70 mt-1">PNG, JPG, or SVG (max 2MB)</p>
            </div>
          </div>

          {/* Company Name */}
          <div className="mb-6">
            <Label className="text-orange-900 font-semibold">Company Name</Label>
            <Input
              type="text"
              placeholder="e.g. JobHunt, Microsoft"
              onChange= {(e) => setCompanyName(e.target.value)}
              className="mt-2 bg-white/70 placeholder-orange-500 border-orange-300 focus-visible:ring-orange-600 text-orange-900 font-medium"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              variant="outline" onClick={() => navigate("/admin/companies")}
              className="border-orange-600 text-orange-700 hover:bg-orange-100 hover:border-orange-700 transition"
            >
              Cancel
            </Button>
            <Button onClick={registerNewCompany}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold shadow-lg px-6 py-2"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyCreate;
