import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const PostJob = () => {
  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    companyId: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-200 to-yellow-100 py-10 px-4 flex justify-center items-start">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-4xl bg-white/70 backdrop-blur-md border border-orange-300 shadow-xl rounded-2xl p-10"
        >
          <h1 className="text-3xl font-bold text-orange-700 mb-8 text-center drop-shadow-sm">
            Post a New Job
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="bg-orange-50 placeholder-orange-300 text-orange-700 focus-visible:ring-orange-500 mt-2"
                placeholder="e.g. Frontend Developer"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="bg-orange-50 placeholder-orange-300 text-orange-700 focus-visible:ring-orange-500 mt-2"
                placeholder="Short job description"
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="bg-orange-50 placeholder-orange-300 text-orange-700 focus-visible:ring-orange-500 mt-2"
                placeholder="e.g. React, Node.js"
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="bg-orange-50 placeholder-orange-300 text-orange-700 focus-visible:ring-orange-500 mt-2"
                placeholder="e.g. ₹6,00,000/year"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="bg-orange-50 placeholder-orange-300 text-orange-700 focus-visible:ring-orange-500 mt-2"
                placeholder="e.g. Kolkata / Remote"
              />
            </div>
            {companies.length > 0 && (
              <div>
                <Label>Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full bg-orange-50 text-orange-700 focus:ring-orange-500 mt-2">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {companies.length === 0 && (
            <p className="text-sm text-red-600 text-center mt-6 font-semibold">
              *Please register a company first before posting jobs.
            </p>
          )}

          {loading ? (
            <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
            >
              Post New Job
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
