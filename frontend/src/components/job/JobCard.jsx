import React from "react";
import { Button } from "../ui/button";
import { MapPin, Clock, Bookmark, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();


  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currTime = new Date();
    const timeDiff = currTime - createdAt;
    return Math.floor(timeDiff/ (1000*24*60*60))
  }

  return (
    <div className="bg-white rounded-3xl border shadow-xl p-6 border-orange-300 hover:scale-[1.02] transition-transform duration-300 ease-in-out space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <img
          src="https://dummyimage.com/60x60/ffa726/fff.png&text=O"
          alt="logo"
          className="w-14 h-14 rounded-full border-2 border-orange-300"
        />
        <div>
          <span>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</span>
          <h3 className="text-lg font-semibold text-orange-700">
            {job?.company?.name}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {job?.location}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-orange-800 mb-1">{job?.title}</h2>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job?.description}</p>
        <ul className="text-sm text-orange-700 space-y-1">
          <li><strong>🧰 Requirements:</strong> {job?.requirements}</li>
          <li><strong>🕒 Type:</strong> Full-time</li>
          <li><strong>💰 Salary:</strong> {job?.salary}</li>
        </ul>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-4 py-1 flex items-center gap-1 text-sm"
        >
          <Info className="w-4 h-4" /> Details
        </Button>
        <Button
          variant="outline"
          className="text-orange-600 border-orange-400 hover:bg-orange-100 font-semibold rounded-full px-4 py-1 flex items-center gap-1 text-sm"
        >
          <Bookmark className="w-4 h-4" /> Save for later
        </Button>
      </div>
    </div>
  );
};

export default JobCard;

