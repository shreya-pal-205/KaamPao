import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job);

  return (
    <div className='max-w-7xl mx-auto my-20 px-4'>
      <h1 className='text-4xl font-extrabold text-center mb-12'>
        <span className='bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent'>
          Latest & Top
        </span>{' '}
        Job Openings
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {allJobs.length <= 0 ? (
          <div className='text-center col-span-full text-gray-500 text-lg'>No Job Available</div>
        ) : (
          allJobs.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
