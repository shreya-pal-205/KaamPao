import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ['Accepted', 'Rejected'];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status.');
    }
  };

  return (
    <div className="rounded-xl shadow-xl bg-white border border-orange-200 overflow-hidden">
      <h2 className="text-xl font-semibold text-orange-800 bg-orange-100 px-6 py-4 border-b border-orange-300">
        Applicants List
      </h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-orange-200 text-sm">
          <TableCaption className="text-orange-600 italic py-2">
            A list of users who applied for the job
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-orange-50 text-orange-800 uppercase text-xs font-bold">
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants?.applications?.length > 0 ? (
              applicants.applications.map((item, index) => (
                <TableRow
                  key={item._id}
                  className={`hover:bg-orange-50 transition-all ${
                    index % 2 === 0 ? 'bg-orange-50/10' : 'bg-white'
                  }`}
                >
                  <TableCell>{item?.applicant?.fullname}</TableCell>
                  <TableCell>{item?.applicant?.email}</TableCell>
                  <TableCell>{item?.applicant?.phone}</TableCell>
                  <TableCell>
                    {item?.applicant?.profile?.resume ? (
                      <a
                        href={item?.applicant?.profile?.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 underline hover:text-orange-800"
                      >
                        {item?.applicant?.profile?.resumeOriginalName}
                      </a>
                    ) : (
                      <span className="text-orange-400 italic">NA</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      {item?.applicant?.createdAt?.split('T')[0]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger className="text-orange-600 hover:text-orange-800">
                        <MoreHorizontal />
                      </PopoverTrigger>
                      <PopoverContent className="w-36 bg-white shadow-lg border border-orange-200 rounded-lg">
                        {shortlistingStatus.map((status, idx) => (
                          <div
                            key={idx}
                            onClick={() => statusHandler(status, item?._id)}
                            className="px-3 py-2 text-sm text-orange-700 hover:bg-orange-100 cursor-pointer rounded"
                          >
                            {status}
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-orange-400">
                  No applicants found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ApplicantsTable;
