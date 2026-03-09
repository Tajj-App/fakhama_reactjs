import React, { useMemo, useRef, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Flag from "../icons/Flag";
import Star from "../icons/Star";
import Meal from "../icons/Meal";
import PlaneSmall from "../icons/PlaneSmall";
import Wallet from "../icons/Wallet";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTrips, type Trip } from "../../lib/api/trips";
import { getPlaces, type Place } from "../../lib/api/places";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle, MapPin, PlaneTakeoff } from "lucide-react";

const Destinations: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [activePlaceIndex, setActivePlaceIndex] = useState(0);

  // Destination tabs slider nav state
  const [destIsBeginning, setDestIsBeginning] = useState(true);
  const [destIsEnd, setDestIsEnd] = useState(false);
  const destSwiperRef = useRef<SwiperClass | null>(null);

  // Trip cards slider nav state
  const [tripsIsBeginning, setTripsIsBeginning] = useState(true);
  const [tripsIsEnd, setTripsIsEnd] = useState(false);
  const tripsSwiperRef = useRef<SwiperClass | null>(null);

  const updateDestNav = (swiper: SwiperClass) => {
    setDestIsBeginning(swiper.isBeginning);
    setDestIsEnd(swiper.isEnd);
  };

  const updateTripsNav = (swiper: SwiperClass) => {
    setTripsIsBeginning(swiper.isBeginning);
    setTripsIsEnd(swiper.isEnd);
  };

  const { data: places = [], isLoading: placesLoading } = useQuery<Place[]>({
    queryKey: ["places"],
    queryFn: getPlaces,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: trips = [],
    isLoading: tripsLoading,
    isError,
  } = useQuery<Trip[]>({
    queryKey: ["trips"],
    queryFn: getTrips,
    staleTime: 5 * 60 * 1000,
  });

  const tripsByPlace = useMemo(() => {
    const grouped = trips.reduce(
      (acc, trip) => {
        const placeId = trip.place_id ?? trip.place?.id;
        if (!acc[placeId]) acc[placeId] = [];
        acc[placeId].push(trip);
        return acc;
      },
      {} as Record<number, Trip[]>,
    );
    return grouped;
  }, [trips]);

  const activeTrips =
    places.length > 0 ? (tripsByPlace[places[activePlaceIndex]?.id] ?? []) : [];

  if (placesLoading || tripsLoading)
    return (
      <div className="flex flex-col gap-6 py-20 px-4 md:px-0">
        <Skeleton className="h-[20px] w-[150px] rounded-full" />
        <Skeleton className="h-[40px] w-[300px] md:w-[500px] rounded-lg" />
        <div className="flex gap-4 mt-6 md:mt-12 overflow-x-auto">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="w-[119px] md:w-[377px] h-[119px] md:h-[377px] rounded-[20px] md:rounded-[50px]"
            />
          ))}
        </div>
      </div>
    );
  if (isError)
    return (
      <section className="container">
        <div className="flex flex-col items-center justify-center py-20 md:py-28 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <AlertCircle className="w-9 h-9 text-red-400" />
          </div>
          <h3 className="text-dark text-base md:text-xl font-semibold mb-2">
            {t("destinations.error_title")}
          </h3>
          <p className="text-gray text-sm md:text-base max-w-xs">
            {t("destinations.error_desc")}
          </p>
        </div>
      </section>
    );

  if (!places.length)
    return (
      <section className="container">
        <div className="flex flex-col items-center justify-center py-20 md:py-28 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[#EAF5FB] flex items-center justify-center mb-5">
            <MapPin className="w-9 h-9 text-[#0478AF]" />
          </div>
          <h3 className="text-dark text-base md:text-xl font-semibold mb-2">
            {t("destinations.no_places_title")}
          </h3>
          <p className="text-gray text-sm md:text-base max-w-xs">
            {t("destinations.no_places_desc")}
          </p>
        </div>
      </section>
    );

  return (
    <section className="container overflow-hidden md:overflow-visible">
      {/* Section Header */}
      <div className="px-4! md:px-0!">
        <p className="text-gray text-[10px]! md:text-lg! font-medium">
          {t("destinations.subtitle")}
        </p>
        <h2 className="text-dark text-lg md:text-[40px] font-semibold leading-[150%]">
          <span className="text-[#00567E]">{t("destinations.titleStart")}</span>{" "}
          {t("destinations.titleEnd")}{" "}
          <span className="text-[#00567E]">
            {t("destinations.titleHighlight")}
          </span>
        </h2>
      </div>
      {/* Destination Tabs Slider */}
      <div className="mt-6! md:mt-12! px-4! md:px-0! relative destinations-slider">
        <Swiper
          modules={[Navigation]}
          slidesPerView={3}
          spaceBetween={12}
          navigation={{
            nextEl: ".destinations-next",
            prevEl: ".destinations-prev",
          }}
          dir={isRTL ? "rtl" : "ltr"}
          key={isRTL ? "rtl" : "ltr"}
          breakpoints={{
            768: {
              spaceBetween: 24,
            },
          }}
          className="!pb-2"
          onSwiper={(swiper) => {
            destSwiperRef.current = swiper;
            updateDestNav(swiper);
          }}
          onSlideChange={updateDestNav}
        >
          {places.map((place, index) => (
            <SwiperSlide key={place.id}>
              <div
                className="cursor-pointer"
                onClick={() => setActivePlaceIndex(index)}
              >
                <div
                  className={`relative overflow-hidden rounded-[20px] md:rounded-[50px] transition-all duration-100 w-full h-[119px] md:h-[377px] ${activePlaceIndex === index
                    ? ""
                    : "border-[3px] md:border-[5px] border-transparent "
                    }`}
                >
                  <img
                    src={place.images?.[0]?.url}
                    alt="place"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Trip Count Badge */}
                  <div className="w-auto px-2! h-6 md:h-8 bg-[#FEFEFE] rounded-[34px] absolute top-2 md:top-4 right-2 md:right-6 flex items-center justify-center gap-3!">
                    <div className="w-2 h-2 md:w-3 md:h-3 mb-2!">
                      <Flag />
                    </div>
                    <p className="text-dark text-[8px] md:text-base font-semibold leading-[100%]">
                      {place.num_trips} {t("destinations.trips")}
                    </p>
                  </div>

                  {/* Place Name */}
                  <div className="w-full h-[22px] md:h-14 bg-[#FFFFFF80] backdrop-blur-sm absolute bottom-0 flex items-center justify-center text-[#FEFEFE] text-sm md:text-[32px] font-semibold">
                    {isRTL ? place.name.ar : place.name.en}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows - Desktop Only */}
        {/* Left button = prev: disabled at isBeginning (slide 0) in both LTR and RTL */}
        {/* In RTL the icon flips to point right (→) because prev moves content rightward visually */}
        <button
          className={`destinations-prev hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg transition-colors -translate-x-5 ${destIsBeginning
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
            }`}
          aria-label="Previous destination"
          disabled={destIsBeginning}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {/* Right button = next: disabled at isEnd in both LTR and RTL */}
        {/* In RTL the icon flips to point left (←) because next moves content leftward visually */}
        <button
          className={`destinations-next hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg transition-colors translate-x-5 ${destIsEnd
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
            }`}
          aria-label="Next destination"
          disabled={destIsEnd}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      {/* Trip Cards Section */}
      <div id="programs" className="mt-8! md:mt-12! relative trips-slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlaceIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {activeTrips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4! text-center">
                <div className="w-20 h-20 rounded-full bg-[#EAF5FB] flex items-center justify-center mb-5">
                  <PlaneTakeoff className="w-9 h-9 text-[#0478AF]" />
                </div>
                <h3 className="text-dark text-base md:text-xl font-semibold mb-2">
                  {t("destinations.no_trips_title") || "No trips available"}
                </h3>
                <p className="text-gray text-sm md:text-base max-w-xs">
                  {t("destinations.no_trips_desc") ||
                    "There are no trips for this destination yet. Check back soon!"}
                </p>
              </div>
            ) : (
              <Swiper
                modules={[Navigation]}
                slidesPerView={1.33}
                spaceBetween={16}
                navigation={{
                  nextEl: ".trips-next",
                  prevEl: ".trips-prev",
                }}
                dir={isRTL ? "rtl" : "ltr"}
                key={`trips-${isRTL ? "rtl" : "ltr"}`}
                breakpoints={{ 768: { slidesPerView: 3, spaceBetween: 32 } }}
                className="px-4! md:px-0!"
                onSwiper={(swiper) => {
                  tripsSwiperRef.current = swiper;
                  updateTripsNav(swiper);
                }}
                onSlideChange={updateTripsNav}
              >
                {activeTrips.map((trip: Trip) => (
                  <SwiperSlide key={trip.id}>
                    <Link to={`/trip-details/${trip.id}`}>
                      <div className="relative overflow-hidden rounded-[32px] md:rounded-4xl cursor-pointer group">
                        {/* Background Image */}
                        <Swiper
                          modules={[Autoplay]}
                          slidesPerView={1}
                          autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                          }}
                          loop={true}
                          className="w-full h-[430px] md:h-[585px]"
                        >
                          {trip.portrait_images?.map((img, index) => (
                            <SwiperSlide key={index}>
                              <img
                                src={img.responsive_urls?.[0] || img.url}
                                alt={`trip-${trip.id}`}
                                className="w-full h-full object-cover"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>

                        {/* Gradient Overlay */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(0deg, rgba(0, 0, 0, 0.5) 28.38%, rgba(248, 243, 243, 0.25) 100%)",
                          }}
                        />
                        <div className="absolute top-4 left-4 z-10">
                          <div className="flex items-center gap-1 bg-white rounded-full px-3! py-1!">
                            <span className="text-dark text-xs font-semibold">
                              {t("destinations.installment")}
                            </span>
                            <Wallet className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 p-4! z-10 w-full">
                          <h3 className="text-white text-lg font-semibold">
                            {isRTL ? trip.name.ar : trip.name.en}
                          </h3>
                          <p className="text-white text-sm mt-1!">
                            {t("destinations.prices_start_from")}{" "}
                            {trip.prices[0]?.price ?? "0"}
                          </p>
                          <p className="text-white text-sm">
                            {t("destinations.duration")} {trip.number_of_days}{" "}
                            {t("destinations.days")}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3!">
                            {trip.hotels.length > 0 && (
                              <div className="flex items-center gap-1 bg-[#E9E9E9] rounded-full px-2! py-1! text-dark text-xs">
                                <Star className="w-3 h-3" /> {trip.hotels[0]}
                              </div>
                            )}
                            {trip.airlines.length > 0 && (
                              <div className="flex items-center gap-1 bg-[#E9E9E9] rounded-full px-2! py-1! text-dark text-xs">
                                <PlaneSmall className="w-3 h-3" />{" "}
                                {trip.airlines[0]}
                              </div>
                            )}
                            {trip.airports.length > 0 && (
                              <div className="flex items-center gap-1 bg-[#E9E9E9] rounded-full px-2! py-1! text-dark text-xs">
                                <Meal className="w-3 h-3" /> {trip.airports[0]}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Desktop Only */}
        <button
          className={`trips-prev hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg transition-colors -translate-x-5 ${tripsIsBeginning
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
            }`}
          aria-label="Previous trip"
          disabled={tripsIsBeginning}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className={`trips-next hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg transition-colors translate-x-5 ${tripsIsEnd
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
            }`}
          aria-label="Next trip"
          disabled={tripsIsEnd}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      {/* Show More Button */}
      <div className="flex justify-center mt-8! md:mt-12! px-4! md:px-0!">
        <Link
          to="/trips"
          className="bg-[#0478AF] text-white font-semibold text-sm md:text-lg px-10! md:px-14! py-2.5! md:py-3! rounded-[50px] cursor-pointer hover:bg-[#0590D0] transition-colors w-full md:w-auto flex items-center justify-center"
        >
          {t("destinations.showMore")}
        </Link>
      </div>
    </section>
  );
};

export default Destinations;
