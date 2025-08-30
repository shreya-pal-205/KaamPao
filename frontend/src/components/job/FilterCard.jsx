import React, { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";


const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Delhi", "Kolkata", "Noida", "Gujarat","Kerela", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        array: ["Car Mechanic", "Electrician", "Welding & Fitting"]
    },
    {
        fitlerType: "Salary",
        array: ["0-5000", "5000-10000", "10000-20000"]
    },
]




const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();
    const changeHandler = (value) => {
        setSelectedValue(value);
    }

     useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);

  return (
    <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    fitlerData.map((data, index) => (
                        <div>
                            <h1 className='font-bold text-lg'>{data.fitlerType}</h1>
                            {
                                data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`
                                    return (
                                        <div className='flex items-center space-x-2 my-2'>
                                            <RadioGroupItem value={item} id={itemId} />
                                            <Label htmlFor={itemId}>{item}</Label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
  );
};

export default FilterCard;
