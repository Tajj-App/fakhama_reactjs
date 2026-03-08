import footerMapBg from "../../assets/footer-map-bg-6a9584.png";

import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import Logo from "../icons/Logo";
import FooterLogo from "../icons/FooterLogo";
import { getSocialLinks, type SocialLinks } from "../../lib/api/social";
import { useNavigate, useLocation } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "header.home", href: "#hero" },
  { label: "header.whyUs", href: "#why-us" },
  { label: "header.destinations", href: "#destinations" },
  { label: "header.programs", href: "#programs" },
  { label: "header.testimonials", href: "#testimonials" },
  { label: "header.howToBook", href: "#how-to-book" },
];

function InstagramIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 21.3332C17.4145 21.3332 18.771 20.7713 19.7712 19.7711C20.7714 18.7709 21.3333 17.4143 21.3333 15.9998C21.3333 14.5853 20.7714 13.2288 19.7712 12.2286C18.771 11.2284 17.4145 10.6665 16 10.6665C14.5855 10.6665 13.229 11.2284 12.2288 12.2286C11.2286 13.2288 10.6667 14.5853 10.6667 15.9998C10.6667 17.4143 11.2286 18.7709 12.2288 19.7711C13.229 20.7713 14.5855 21.3332 16 21.3332Z"
        stroke="#FEFEFE"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 21.3333V10.6667C4 8.89856 4.70238 7.20286 5.95262 5.95262C7.20286 4.70238 8.89856 4 10.6667 4H21.3333C23.1014 4 24.7971 4.70238 26.0474 5.95262C27.2976 7.20286 28 8.89856 28 10.6667V21.3333C28 23.1014 27.2976 24.7971 26.0474 26.0474C24.7971 27.2976 23.1014 28 21.3333 28H10.6667C8.89856 28 7.20286 27.2976 5.95262 26.0474C4.70238 24.7971 4 23.1014 4 21.3333Z"
        stroke="#FEFEFE"
        strokeWidth="1.8"
      />
      <path
        d="M23.3334 8.68019L23.3467 8.66553"
        stroke="#FEFEFE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.8062 6.92344C23.1875 4.39219 19.7 3 15.9937 3C8.34375 3 2.11875 9.00268 2.11875 16.3795C2.11875 18.7359 2.75625 21.0382 3.96875 23.0692L2 30L9.35625 28.1377C11.3813 29.2045 13.6625 29.765 15.9875 29.765H15.9937C23.6375 29.765 30 23.7623 30 16.3855C30 12.8116 28.425 9.45469 25.8062 6.92344ZM15.9937 27.5109C13.9187 27.5109 11.8875 26.9746 10.1187 25.9621L9.7 25.721L5.3375 26.8239L6.5 22.7196L6.225 22.2978C5.06875 20.5259 4.4625 18.4828 4.4625 16.3795C4.4625 10.2502 9.6375 5.26004 16 5.26004C19.0812 5.26004 21.975 6.41719 24.15 8.52054C26.325 10.6239 27.6625 13.4143 27.6562 16.3855C27.6562 22.5208 22.35 27.5109 15.9937 27.5109ZM22.3188 19.1819C21.975 19.0132 20.2688 18.2056 19.95 18.0971C19.6313 17.9826 19.4 17.9283 19.1688 18.2658C18.9375 18.6033 18.275 19.3507 18.0688 19.5797C17.8688 19.8027 17.6625 19.8328 17.3188 19.6641C15.2812 18.6817 13.9438 17.9103 12.6 15.6864C12.2438 15.0958 12.9562 15.1379 13.6187 13.8603C13.7312 13.6373 13.675 13.4444 13.5875 13.2757C13.5 13.1069 12.8062 11.4616 12.5187 10.7926C12.2375 10.1417 11.95 10.2321 11.7375 10.2201C11.5375 10.208 11.3062 10.208 11.075 10.208C10.8438 10.208 10.4688 10.2924 10.15 10.6239C9.83125 10.9614 8.9375 11.769 8.9375 13.4143C8.9375 15.0596 10.1813 16.6507 10.35 16.8737C10.525 17.0967 12.7937 20.4717 16.275 21.9241C18.475 22.8402 19.3375 22.9185 20.4375 22.7618C21.1063 22.6654 22.4875 21.9542 22.775 21.1708C23.0625 20.3873 23.0625 19.7183 22.975 19.5797C22.8938 19.429 22.6625 19.3446 22.3188 19.1819Z"
        fill="#FEFEFE"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.6667 2.6665H18.6667C16.8986 2.6665 15.2029 3.36888 13.9526 4.61913C12.7024 5.86937 12 7.56506 12 9.33317V13.3332H8V18.6665H12V29.3332H17.3333V18.6665H21.3333L22.6667 13.3332H17.3333V9.33317C17.3333 8.97955 17.4738 8.64041 17.7239 8.39036C17.9739 8.14031 18.313 7.99984 18.6667 7.99984H22.6667V2.6665Z"
        stroke="#FEFEFE"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  function handleScrollTo(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    e.preventDefault();
    const id = href.replace("#", "");

    // If not on home page
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  const {
    data: social,
    isLoading,
    error,
  } = useQuery<SocialLinks>({
    queryKey: ["socialLinks"],
    queryFn: getSocialLinks,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <footer className="relative bg-[#0478AF] overflow-hidden pb-8!">
      {/* Background Image (map overlay) */}
      <img
        src={footerMapBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.15 }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Desktop Footer */}
        <div className="hidden lg:flex flex-col items-center gap-[41px] container py-6">
          {/* Top Section: Logo + Description */}
          <div className="flex flex-col items-center gap-12">
            <div className="flex flex-col items-center gap-12">
              {/* Logo and Description */}
              <div className="flex flex-col items-center">
                <div>
                  <Logo />
                </div>
                <p className="text-white text-base font-semibold leading-none text-center !text-center">
                  {t("footer.description")}
                </p>
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center justify-center gap-10 flex-wrap">
                {FOOTER_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className={`text-xl leading-none text-white transition-opacity hover:opacity-80 ${link.href === "#hero" ? "font-semibold" : "font-medium"
                      }`}
                  >
                    {t(link.label)}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Subscribe Section */}
          <div className="flex flex-col items-center gap-4 w-[218px]">
            <p className="text-sm font-semibold text-white text-center leading-none !text-center">
              {t("footer.subscribeTitle")}
            </p>
            <div className="flex items-center gap-4">
              {!isLoading && social && (
                <>
                  <a
                    href={social.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our Instagram"
                  >
                    <InstagramIcon aria-hidden="true" />
                  </a>
                  <a
                    href={`https://wa.me/${social.whatsapp.replace(/^\+/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with us on WhatsApp"
                  >
                    <WhatsAppIcon aria-hidden="true" />
                  </a>
                  <a
                    href={social.facebook_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our Facebook"
                  >
                    <FacebookIcon aria-hidden="true" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="lg:hidden flex flex-col items-center gap-6 container py-6">
          <FooterLogo />
          <p className="text-white text-[8px] font-semibold text-center -mt-4">
            {t("footer.description")}
          </p>

          <nav className="flex flex-col items-center gap-4 w-[123px]">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={`text-sm leading-none text-white hover:opacity-80 transition-opacity ${link.href === "#hero" ? "font-semibold" : "font-medium"}`}
              >
                {t(link.label)}
              </a>
            ))}
          </nav>

          <div className="w-[292px] h-px bg-[#4D9FC6]" />

          <div className="flex flex-col items-center gap-4 w-[218px]">
            <p className="text-xs font-medium text-white text-center leading-none">
              {t("footer.subscribeTitle")}
            </p>
            <div className="flex items-center gap-4">
              {isLoading && <p className="text-white text-xs">Loading...</p>}
              {error && (
                <p className="text-white text-xs">Failed to load links</p>
              )}
              {!isLoading && social && (
                <>
                  <a
                    href={social.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href={`https://wa.me/${social.whatsapp.replace(/^\+/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon />
                  </a>
                  <a
                    href={social.facebook_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FacebookIcon />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
