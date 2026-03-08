import { useTranslation } from "react-i18next";
import type { Trip } from "../../lib/api/trips";
import AboutTrip from "../icons/AboutTrip";
import BackArrow from "../icons/BackArrow";
import Calender from "../icons/Calender";
import Location from "../icons/Location";
import Breadcrumbs from "./Breadcrumbs";
import TripPicker from "./TripPicker";
import { Link } from "react-router-dom";

interface TripDetailsHeaderProps {
  trip: Trip;
}

const TripDetailsHeader = ({ trip }: TripDetailsHeaderProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";

  const tripName = trip.name?.[lang] || trip.name?.en || "";
  const placeName = trip.place?.name?.[lang] || trip.place?.name?.en || "";
  const description = trip.description?.[lang] || trip.description?.en || "";
  const imageUrl = trip.image?.url;

  const hasPlace = !!placeName;
  const hasDescription = !!description.trim();
  const hasTags = trip.tags && trip.tags.length > 0;

  return (
    <section className="container md:py-8!">
      <div className="md:block hidden">
        <Breadcrumbs tripName={tripName} placeName={placeName} />
      </div>

      {/* Mobile Header */}
      <Link to='/' className="md:hidden flex items-center gap-[85px]">
        <BackArrow />
        <p className="text-dark text-xl font-medium">
          {t("tripDetails.mobileTitle")}
        </p>
      </Link>

      <div className="md:mt-12! mt-6! flex flex-wrap justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Trip Image */}
          {trip.landscape_images?.[0]?.url ? (
            <img
              src={trip.landscape_images[0].responsive_urls?.[0] || trip.landscape_images[0].url}
              className="md:w-[789px] w-full md:h-[427px] h-[220px] rounded-[32px] object-cover"
              alt={tripName}
            />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              className="md:w-[789px] w-full md:h-[427px] h-[220px] rounded-[32px] object-cover"
              alt={tripName}
            />
          ) : (
            <div className="md:w-[789px] w-full md:h-[427px] h-[220px] rounded-[32px] bg-gray-200 flex items-center justify-center">
              <p className="text-gray text-sm">{t("tripDetails.noImage")}</p>
            </div>
          )}

          {/* Trip Title */}
          <h2 className="text-dark md:text-[40px] text-base font-semibold mt-8!">
            {tripName}
          </h2>

          {/* Place Tag */}
          {hasPlace && (
            <div className="flex items-center gap-2 bg-[#F7FAFC] px-3! py-2! rounded-[32px] w-fit mt-3">
              <Location />
              <p className="text-[#00567E] md:text-xl text-xs font-medium">
                {placeName}
              </p>
            </div>
          )}

          {/* About Section */}
          {hasDescription && (
            <>
              <div className="flex items-center gap-3 md:mt-8! mt-5!">
                <AboutTrip />
                <h3 className="text-dark md:text-[32px] text-lg font-semibold">
                  {t("tripDetails.aboutTitle")}
                </h3>
              </div>
              <p className="text-gray md:text-xl text-xs font-medium leading-[150%] mt-4 md:w-[730px]">
                {description}
              </p>
            </>
          )}

          {/* Duration Section */}
          <div className="flex items-center gap-3 md:mt-8! mt-5!">
            <Calender />
            <h3 className="text-dark md:text-[32px] text-lg font-semibold">
              {t("tripDetails.durationTitle")}
            </h3>
          </div>
          <p className="text-gray md:text-2xl text-sm font-semibold md:mt-6! mt-3!">
            {trip.number_of_days} {t("destinations.days")}
          </p>

          {/* Tags / Features */}
          {hasTags && (
            <>
              <div className="flex items-center gap-3 md:mt-8! mt-5!">
                <h3 className="text-dark md:text-[32px] text-lg font-semibold">
                  {t("tripDetails.tagsLabel")}
                </h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {trip.tags.map((tag, i) => (
                  <div
                    key={i}
                    className="md:py-3! py-2.5 px-4! bg-[#F7FAFC] rounded-[20px] flex items-center gap-1"
                  >
                    <p className="text-dark md:text-base text-xs font-medium">
                      {tag}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <TripPicker trip={trip} />
      </div>
    </section>
  );
};

export default TripDetailsHeader;
