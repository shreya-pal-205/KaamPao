import React, { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    fitlerType: "Location",
    array: ["Delhi", "Kolkata", "Noida", "Gujarat", "Kerela", "Mumbai"],
  },
  {
    fitlerType: "Industry",
    array: ["Car Mechanic", "Electrician", "Welding & Fitting"],
  },
  {
    fitlerType: "Salary",
    array: ["0-5000", "5000-10000", "10000-20000"],
  },
];

const FilterCard = ({ compact = false }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  if (compact) {
    // ✅ Compact horizontal version
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        {filterData.map((data, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="font-semibold text-sm">{data.fitlerType}:</span>
            <RadioGroup
              value={selectedValue}
              onValueChange={changeHandler}
              className="flex items-center gap-2"
            >
              {data.array.map((item, idx) => {
                const itemId = `id${index}-${idx}`;
                return (
                  <div
                    key={itemId}
                    className="flex items-center space-x-1 text-sm"
                  >
                    <RadioGroupItem value={item} id={itemId} />
                    <Label htmlFor={itemId}>{item}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        ))}
      </div>
    );
  }

  // Default (non-compact)
  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => (
          <div key={index}>
            <h1 className="font-bold text-lg mt-2">{data.fitlerType}</h1>
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div key={itemId} className="flex items-center space-x-2 my-1">
                  <RadioGroupItem value={item} id={itemId} />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
