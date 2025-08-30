import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import store from "@/redux/store";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
    const {companies, searchCompanyByText} = useSelector(store=> store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    


    useEffect(()=> {
      const filteredCompany = companies.length >= 0 && companies.filter((company) => {
        if(!searchCompanyByText){
          return true;
        }
        return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
      });
      setFilterCompany(filteredCompany);
    },[companies, searchCompanyByText])

  return (
    <div className="max-w-6xl mx-auto bg-orange-100 border border-orange-300 rounded-2xl shadow-2xl overflow-x-auto p-4">
      <Table>
        <TableCaption className="text-orange-600 text-md font-semibold mb-2">
          🧾 Recently Registered Companies
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-orange-200 text-orange-800">
            <TableHead className="py-3">Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
            {
                filterCompany.length === 0 ? <span>Companies not found</span> : (
                    <>{
                     filterCompany?.map((company) => {
                        return (
                            <>
                             <tr>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src="https://ui-avatars.com/api/?name=Company&background=FFA500&color=fff&size=40"/>
                                    </Avatar>
                                </TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            <div onClick={()=> navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </tr>
                            </>
                        )
                     })
                    }
                    </>
                )
            }
          
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
