import React from 'react';
import { Badge } from '../ui/badge';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/description/${job._id}`)} className='relative p-6 rounded-2xl bg-gradient-to-br from-orange-100 to-yellow-50 border border-orange-200 shadow-md hover:shadow-xl transition-all duration-300 group'>
      
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h2 className='text-xl font-semibold text-orange-900'>{job?.company?.name}</h2>
          <div className='flex items-center gap-1 text-sm text-orange-700'>
            <MapPin className='w-4 h-4' />
            <span>{job?.location}</span>
          </div>
        </div>
        <div className='h-10 w-10 rounded-full bg-orange-300 flex items-center justify-center text-white font-bold shadow-md'>
          {job?.company?.name?.[0] || 'C'}
        </div>
      </div>

      {/* Body */}
      <div className='mb-4'>
        <h3 className='text-lg font-bold text-orange-800'>{job?.title}</h3>
        <p className='text-sm text-gray-700 mt-1 line-clamp-3'>{job?.description}</p>
      </div>

      {/* Footer Tags */}
      <div className='flex flex-wrap gap-2 mt-4'>
        
        <Badge className='bg-orange-300 text-orange-900 font-semibold px-3 py-1'>Part Time</Badge>
        <Badge className='bg-orange-100 text-orange-700 font-semibold px-3 py-1 flex items-center gap-1'>
          <DollarSign className='w-4 h-4' /> {job?.salary} LPA
        </Badge>
      </div>

      {/* Hover Effect Overlay */}
      <div className='absolute inset-0 opacity-0 group-hover:opacity-10 bg-orange-500 transition-opacity duration-300 rounded-2xl pointer-events-none'></div>
    </div>
  );
};

export default LatestJobCards;
