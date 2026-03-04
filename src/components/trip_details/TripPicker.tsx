import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import type { Trip } from "../../lib/api/trips";
import { getSocialLinks, type SocialLinks } from "../../lib/api/social";
import { useTripSelection } from "../../lib/useTripSelection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Price from "../icons/Price";
import SeatIcon from "../icons/SeatIcon";

interface TripPickerProps {
  trip: Trip;
}

const TripPicker = ({ trip }: TripPickerProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";

  const { data: social } = useQuery<SocialLinks>({
    queryKey: ["socialLinks"],
    queryFn: getSocialLinks,
    staleTime: Infinity,
  });

  const {
    selectedAirportId,
    selectedFlightScheduleId,
    selectedPriceId,
    selectedHotel,
    selectedAirline,
    selectedAirportName,
    setSelectedAirport,
    setSelectedFlightSchedule,
    setSelectedPrice,
    setSelectedHotel,
    setSelectedAirline,
    setSelectedAirportName,
  } = useTripSelection();

  // Extract unique airports from BOTH prices and flight_schedules
  const uniqueAirports = useMemo(() => {
    const airportMap = new Map<number, { id: number; name: string }>();

    // From prices
    trip.prices.forEach((p) => {
      if (p.airport && !airportMap.has(p.airport.id)) {
        airportMap.set(p.airport.id, {
          id: p.airport.id,
          name: p.airport.name?.[lang] || p.airport.name?.en || "",
        });
      }
    });

    // From flight_schedules (may have airports not present in prices)
    trip.flight_schedules.forEach((fs) => {
      if (fs.airport && !airportMap.has(fs.airport.id)) {
        airportMap.set(fs.airport.id, {
          id: fs.airport.id,
          name: fs.airport.name?.[lang] || fs.airport.name?.en || "",
        });
      }
    });

    return Array.from(airportMap.values());
  }, [trip.prices, trip.flight_schedules, lang]);

  // Auto-select first airport if none selected
  useEffect(() => {
    if (selectedAirportId === null && uniqueAirports.length > 0) {
      setSelectedAirport(uniqueAirports[0].id);
    }
  }, [uniqueAirports, selectedAirportId, setSelectedAirport]);

  // Auto-select hotel if only one
  useEffect(() => {
    if (trip.hotels && trip.hotels.length === 1 && !selectedHotel) {
      setSelectedHotel(trip.hotels[0]);
    }
  }, [trip.hotels, selectedHotel, setSelectedHotel]);

  // Auto-select airline if only one
  useEffect(() => {
    if (trip.airlines && trip.airlines.length === 1 && !selectedAirline) {
      setSelectedAirline(trip.airlines[0]);
    }
  }, [trip.airlines, selectedAirline, setSelectedAirline]);

  // Auto-select airport name (from trip.airports string list) if only one
  useEffect(() => {
    if (trip.airports && trip.airports.length === 1 && !selectedAirportName) {
      setSelectedAirportName(trip.airports[0]);
    }
  }, [trip.airports, selectedAirportName, setSelectedAirportName]);

  // Filter flight schedules and prices for selected airport
  const filteredSchedules = useMemo(
    () =>
      trip.flight_schedules.filter(
        (fs) => fs.airport_id === selectedAirportId && fs.is_active,
      ),
    [trip.flight_schedules, selectedAirportId],
  );

  const filteredPrices = useMemo(
    () =>
      trip.prices.filter(
        (p) => p.airport_id === selectedAirportId && p.is_active,
      ),
    [trip.prices, selectedAirportId],
  );

  // Auto-select flight schedule if only one
  useEffect(() => {
    if (filteredSchedules.length === 1 && !selectedFlightScheduleId) {
      setSelectedFlightSchedule(filteredSchedules[0].id);
    }
  }, [filteredSchedules, selectedFlightScheduleId, setSelectedFlightSchedule]);

  // Auto-select price if only one
  useEffect(() => {
    if (filteredPrices.length === 1 && !selectedPriceId) {
      setSelectedPrice(filteredPrices[0].id);
    }
  }, [filteredPrices, selectedPriceId, setSelectedPrice]);

  // Min price for the banner
  const minPrice = useMemo(() => {
    if (trip.prices.length === 0) return null;
    return trip.prices.reduce((min, p) => {
      const val = parseFloat(p.price);
      return val < min ? val : min;
    }, parseFloat(trip.prices[0].price));
  }, [trip.prices]);

  const hasHotels = trip.hotels && trip.hotels.length > 0;
  const hasAirlines = trip.airlines && trip.airlines.length > 0;
  const hasAirports = trip.airports && trip.airports.length > 0;
  const hasAirportTabs = uniqueAirports.length > 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const handleBookNow = () => {
    if (!social?.whatsapp) return;

    const currentUrl = window.location.href;

    // Look up selected objects
    const schedule = trip.flight_schedules.find(
      (fs) => fs.id === selectedFlightScheduleId,
    );
    const price = trip.prices.find((p) => p.id === selectedPriceId);

    const tripId = trip.id ?? "";
    const tripName = trip.name?.[lang] || trip.name?.en || "";

    // IDs
    const hotelIndex = selectedHotel ? trip.hotels.indexOf(selectedHotel) : -1;
    const hotelId = hotelIndex >= 0 ? hotelIndex + 1 : "";
    const hotelName = selectedHotel ?? "";

    const airportId = selectedAirportId ?? "";
    const airportName =
      uniqueAirports.find((a) => a.id === selectedAirportId)?.name ??
      selectedAirportName ??
      "";

    const placeId = trip.place_id ?? "";
    const placeName = trip.place?.name?.[lang] || trip.place?.name?.en || "";

    const date = schedule?.from_date
      ? schedule.from_date.split("T")[0]
      : "";

    const roomId = price?.id ?? "";
    const roomName = price?.name?.[lang] || price?.name?.en || "";

    const airCompanyId = price?.airline_id ?? "";
    const airCompanyName = selectedAirline ?? "";

    // Reference key
    const refParts = [
      hotelId ? `h:${hotelId}` : null,
      airportId ? `a:${airportId}` : null,
      placeId ? `p:${placeId}` : null,
      date ? `s:${date}` : null,
      roomId ? `r:${roomId}` : null,
      airCompanyId ? `c:${airCompanyId}` : null,
      tripId ? `t:${tripId}` : null,
    ].filter(Boolean);

    const refKey = refParts.join("");

    const messageLines = [
      `Link: ${currentUrl}`,
      `Reference key: ${refKey}`,
      hotelName ? `Hotel: ${hotelName}` : null,
      airportName ? `Airport: ${airportName}` : null,
      placeName ? `Place: ${placeName}` : null,
      tripName ? `Trip: ${tripName}` : null,
      date ? `Date: ${date}` : null,
      roomName ? `Room: ${roomName}` : null,
      airCompanyName ? `Aircompany: ${airCompanyName}` : null,
      ``,
      `*Kindly do not edit this message to ensure your inquiry is sent to the agent`,
    ].filter(Boolean);

    const message = messageLines.join("\n");
    // Strip any leading + from the number since wa.me expects digits only
    const phone = social.whatsapp.replace(/^\+/, "");
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="w-full md:w-[379px] h-auto py-8! px-4! bg-[#F7FAFC] rounded-[32px]"
    >
      {/* Price Banner */}
      {minPrice !== null && (
        <div className="p-3! bg-[#DBEEF7] border border-[#0478AF] rounded-[8px] mb-6! flex items-center gap-2">
          <Price />
          <p className="text-dark text-lg font-medium">
            {t("tripPicker.priceStartsFrom")}{" "}
            <span className="text-[#00567E] text-xl font-semibold">
              {minPrice.toLocaleString()} {t("tripPicker.currency")}
            </span>{" "}
            {t("tripPicker.perPerson")}
          </p>
        </div>
      )}

      {/* Hotels */}
      {hasHotels && (
        <>
          <h2 className="text-[#00567E] text-xl font-medium mb-3! text-start">
            {t("tripDetails.hotelsLabel")}
          </h2>
          <div className="flex flex-wrap gap-2 mb-6! justify-start">
            {trip.hotels.map((hotel, i) => (
              <button
                key={i}
                onClick={() => setSelectedHotel(hotel)}
                className={`py-2! px-4! rounded-4xl text-sm font-medium border transition-all cursor-pointer ${selectedHotel === hotel
                  ? "bg-[#0478AF] text-white border-[#0478AF]"
                  : "bg-white text-dark border-[#D2D1D1] hover:border-[#0478AF]"
                  }`}
              >
                {hotel}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Airlines */}
      {hasAirlines && (
        <>
          <h2 className="text-[#00567E] text-xl font-medium mb-3! text-start">
            {t("tripDetails.airlinesLabel")}
          </h2>
          <div className="flex flex-wrap gap-2 mb-6! justify-start">
            {trip.airlines.map((airline, i) => (
              <button
                key={i}
                onClick={() => setSelectedAirline(airline)}
                className={`py-2! px-4! rounded-4xl text-sm font-medium border transition-all cursor-pointer ${selectedAirline === airline
                  ? "bg-[#0478AF] text-white border-[#0478AF]"
                  : "bg-white text-dark border-[#D2D1D1] hover:border-[#0478AF]"
                  }`}
              >
                {airline}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Airports (trip.airports string list) */}
      {hasAirports && (
        <>
          <h2 className="text-[#00567E] text-xl font-medium mb-3! text-start">
            {t("tripDetails.airportsLabel")}
          </h2>
          <div className="flex flex-wrap gap-2 mb-6! justify-start">
            {trip.airports.map((airport, i) => (
              <button
                key={i}
                onClick={() => setSelectedAirportName(airport)}
                className={`py-2! px-4! rounded-4xl text-sm font-medium border transition-all cursor-pointer ${selectedAirportName === airport
                  ? "bg-[#0478AF] text-white border-[#0478AF]"
                  : "bg-white text-dark border-[#D2D1D1] hover:border-[#0478AF]"
                  }`}
              >
                {airport}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Divider before flight tabs */}
      {(hasHotels || hasAirlines || hasAirports) && hasAirportTabs && (
        <div className="w-full h-px border-b border-[#D2D1D1] border-dashed mb-6!" />
      )}

      {/* Airport Tabs (from prices) */}
      {hasAirportTabs ? (
        <Tabs
          value={selectedAirportId?.toString() || ""}
          onValueChange={(val) => setSelectedAirport(Number(val))}
        >
          {uniqueAirports.length > 1 && (
            <TabsList className="w-full flex">
              {uniqueAirports.map((airport) => (
                <TabsTrigger
                  key={airport.id}
                  value={airport.id.toString()}
                  className="flex-1 h-10! bg-[#EEEEEE] data-[state=active]:bg-[#0478AF] data-[state=active]:text-white"
                >
                  {airport.name}
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          {uniqueAirports.map((airport) => (
            <TabsContent
              key={airport.id}
              value={airport.id.toString()}
              className="mt-6!"
            >
              {/* Flight Schedules */}
              {filteredSchedules.length > 0 && (
                <>
                  <h2 className="text-[#00567E] text-xl font-medium text-start rtl:text-right">
                    {t("tripPicker.flightSchedules")}
                  </h2>
                  <div className="w-full h-px border-b border-[#D2D1D1] border-dashed mt-4!" />

                  <div className="mt-4!">
                    {filteredSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        dir={lang === "ar" ? "rtl" : "ltr"}
                        className={`flex items-center justify-between gap-8.75 mb-3! px-2! py-2! rounded-lg transition-all cursor-pointer ${selectedFlightScheduleId === schedule.id
                          ? "border-2 border-[#0478AF] bg-white"
                          : "border-2 border-transparent hover:border-[#D2D1D1]"
                          }`}
                        onClick={() => setSelectedFlightSchedule(schedule.id)}
                      >
                        {/* Custom circular checkbox — on the START side (left in LTR, left in RTL) */}
                        <div
                          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedFlightScheduleId === schedule.id
                            ? "bg-[#0478AF] border-[#0478AF]"
                            : "bg-white border-[#D2D1D1]"
                            }`}
                        >
                          {selectedFlightScheduleId === schedule.id && (
                            <svg
                              width="12"
                              height="9"
                              viewBox="0 0 12 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 4L4.5 7.5L11 1"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Right group: date + seats badge */}
                        <div className="flex items-center gap-3 flex-1 ltr:flex-row-reverse justify-end">
                          {/* Orange seats badge */}
                          {schedule.remaining_seats > 0 && (
                            <div className="flex items-center gap-1 bg-[#E5800C] rounded-4xl px-2! py-2! shrink-0">
                              <span className="text-[#FEFEFE] text-xs font-medium leading-none">
                                {schedule.remaining_seats}{" "}
                                {t("tripPicker.seatsRemaining")}
                              </span>
                              <SeatIcon className="w-4 h-4 text-[#FEFEFE] shrink-0" />
                            </div>
                          )}
                          {/* Date text */}
                          <span className="text-dark text-lg font-medium leading-none">
                            {formatDate(schedule.from_date)} –{" "}
                            {formatDate(schedule.to_date)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Prices */}
              {filteredPrices.length > 0 && (
                <>
                  <div className="w-full h-px border-b border-[#D2D1D1] border-dashed my-6!" />

                  <h2 className="text-[#00567E] text-xl font-medium rtl:text-right">
                    {t("tripPicker.pricesTitle")}{" "}
                    <span className="text-gray text-sm">
                      ({t("tripPicker.priceNote")})
                    </span>
                  </h2>

                  <div className="mt-4!">
                    {filteredPrices.map((price) => (
                      <div
                        key={price.id}
                        dir={lang === "ar" ? "rtl" : "ltr"}
                        className={`flex items-center justify-between gap-8.75 mb-3! px-2! py-2! rounded-lg transition-all cursor-pointer ${selectedPriceId === price.id
                          ? "border-2 border-[#0478AF] bg-white"
                          : "border-2 border-transparent hover:border-[#D2D1D1]"
                          }`}
                        onClick={() => setSelectedPrice(price.id)}
                      >
                        {/* Custom circular checkbox */}
                        <div
                          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPriceId === price.id
                            ? "bg-[#0478AF] border-[#0478AF]"
                            : "bg-white border-[#D2D1D1]"
                            }`}
                        >
                          {selectedPriceId === price.id && (
                            <svg
                              width="12"
                              height="9"
                              viewBox="0 0 12 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 4L4.5 7.5L11 1"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Right group: price name + price value */}
                        <div className="flex flex-col items-end flex-1">
                          <span className="text-dark text-lg font-medium">
                            {price.name?.[lang] || price.name?.en || ""}
                          </span>
                          <span className="text-[#00567E] text-base font-medium mt-1!">
                            {parseFloat(price.price).toLocaleString()}{" "}
                            {t("tripPicker.currency")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        !hasHotels &&
        !hasAirlines &&
        !hasAirports && (
          <p className="text-gray text-center py-4">
            {t("tripPicker.noAirports")}
          </p>
        )
      )}

      {/* Book Now Button */}
      <button
        onClick={handleBookNow}
        className="w-full h-14 bg-[#0478AF] rounded-[50px] mt-8! text-[#FEFEFE] text-lg font-semibold hover:bg-[#0590D0] transition-colors cursor-pointer"
      >
        {t("tripPicker.bookNow")}
      </button>
    </div>
  );
};

export default TripPicker;
