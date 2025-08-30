import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useGetCompanyById from '@/hooks/useGetCompanyById';
import { toast } from 'sonner';
import { setSingleCompany } from '@/redux/companySlice';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
        name: "",
        description: "",
        location: "",
        file: null
    });
    const {singleCompany} = useSelector(store=>store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }





     useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            location: singleCompany.location || "",
            file: singleCompany.file || null
        })
    },[setSingleCompany]);




  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-200 to-orange-500 py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white border border-orange-200 rounded-3xl shadow-lg px-10 py-12">

          {/* Header */}
          <div className="flex items-center gap-5 mb-10">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="flex items-center gap-2 border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Button>
            <h1 className="text-3xl font-bold text-orange-800 drop-shadow-sm">
              Company Setup
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <Label className="text-orange-700 font-medium">Company Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="e.g. Microsoft"
                  className="mt-2 bg-orange-50 text-orange-900 placeholder-orange-400 border-orange-200 focus-visible:ring-orange-500"
                />
              </div>

              <div>
                <Label className="text-orange-700 font-medium">Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Brief description"
                  className="mt-2 bg-orange-50 text-orange-900 placeholder-orange-400 border-orange-200 focus-visible:ring-orange-500"
                />
              </div>

              

              <div>
                <Label className="text-orange-700 font-medium">Location</Label>
                <Input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  placeholder="City, Country"
                  className="mt-2 bg-orange-50 text-orange-900 placeholder-orange-400 border-orange-200 focus-visible:ring-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-orange-700 font-medium">Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="mt-2 bg-orange-50 text-orange-800 border-orange-200 file:text-orange-700 file:bg-orange-100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10">
              {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                    }
            </div>
          </form>

        </div>
      </div>
    </>
  );
};

export default CompanySetup;
