import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Button } from "../ui/button";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Category list
const categories = [
  "Senior Car Mechanic",
  "Car Mechanic",
  "Electrician",
  "Plumber",
  "Welding & Fitting",
  "Painter",
  "Maid Servant",
];



const CategoryCarousel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  }


  return (
    <section className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-orange-800 mb-6">
          Explore Opportunities by Role
        </h2>

        {/* Carousel */}
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {categories.map((cat, index) => (
              <CarouselItem
                key={index}
                className="basis-2/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 px-2"
              >
                <Button
                  onClick={() => searchJobHandler(cat)}
                  variant="outline"
                  className="w-full rounded-full py-3 text-orange-700 font-medium border-orange-300 hover:bg-orange-700 hover:text-white transition-all"
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
