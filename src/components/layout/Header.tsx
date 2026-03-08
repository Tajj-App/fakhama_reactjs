import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchSidebar from "./SearchSidebar";
import { useTranslation } from "react-i18next";
import Language from "../icons/Language";
import HeaderLogo from "../icons/HeaderLogo";
import HeaderMobileLogo from "../icons/HeaderMobileLogo";

const NAV_LINKS = [
  { label: "header.home", href: "#hero" },
  { label: "header.whyUs", href: "#why-us" },
  { label: "header.destinations", href: "#destinations" },
  { label: "header.programs", href: "#programs" },
  { label: "header.testimonials", href: "#testimonials" },
  { label: "header.howToBook", href: "#how-to-book" },
];

/** Returns the id of whichever section is currently most in view. */
function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    const existing = sectionIds.filter((id) => document.getElementById(id));
    if (existing.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    existing.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 100) setActiveId(sectionIds[0]);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds]);

  return activeId;
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="9" stroke="#121212" strokeWidth="1.5" />
      <path
        d="M20 20L22 22"
        stroke="#121212"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 6H21M3 12H21M3 18H21"
        stroke="#121212"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="#121212"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sectionIds = NAV_LINKS.map((l) => l.href.replace("#", ""));
  const activeId = useActiveSection(sectionIds);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace("#", "");
      const isHomePage = location.pathname === "/";

      if (isHomePage) {
        // Already on home page — just scroll to the section
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        window.history.pushState(null, "", href);
      } else {
        // On another page — navigate home and let the hash direct the scroll
        navigate(`/${href}`);
      }

      setIsMobileMenuOpen(false);
    },
    [location.pathname, navigate],
  );

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? "bg-[#F7FAFC] shadow-sm" : "bg-white"
          }`}
      >
        {/* Desktop Header */}
        <nav className="hidden lg:flex items-center justify-between h-20 container">
          {/* Right side: Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="shrink-0"
            aria-label="Go to homepage"
          >
            <HeaderLogo />
          </a>

          {/* Center: Navigation Links */}
          <div className="flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace("#", "");
              const active = activeId === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative flex flex-col items-center gap-2 text-lg leading-none transition-colors duration-200 ${active
                    ? "font-semibold text-[#0478AF]"
                    : "font-medium text-[#121212] hover:text-[#0478AF]"
                    }`}
                >
                  {t(link.label)}
                  {active && (
                    <span className="w-10 h-1 bg-[#0478AF] rounded-full" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Left side: CTA + Search */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center rounded-full border border-[#D2D1D1] w-14 h-14 text-[#0478AF] hover:bg-[#0478AF] hover:text-white transition-colors duration-200"
              aria-label={t("header.search")}
            >
              <SearchIcon className="w-6 h-6" />
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center rounded-full border border-[#D2D1D1] w-14 h-14 text-[#0478AF] hover:bg-[#0478AF] hover:text-white transition-colors duration-200 font-semibold"
            >
              <Language />
            </button>
            <a
              href="#destinations"
              onClick={(e) => handleNavClick(e, "#destinations")}
              className="flex items-center justify-center bg-[#0478AF] text-white font-semibold text-lg rounded-full w-[205px] h-14 hover:bg-[#00567E] transition-colors duration-200"
            >
              {t("header.bookNow")}
            </a>
          </div>
        </nav>

        {/* Mobile Header */}
        <nav className="lg:hidden flex items-center justify-between h-[68px] px-4">
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="shrink-0"
            aria-label="Go to homepage"
          >
            <HeaderMobileLogo />
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center rounded-full border border-[#D2D1D1] w-10 h-10 text-[#0478AF]"
              aria-label={t("header.search")}
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10"
              aria-label={
                isMobileMenuOpen ? t("header.menuClose") : t("header.menuOpen")
              }
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 top-[68px] bg-black/30 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Drawer */}
        <div
          className={`lg:hidden fixed top-[68px] right-0 w-[85vw] max-w-[320px] h-[calc(100vh-68px)] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col py-4">
              {NAV_LINKS.map((link) => {
                const id = link.href.replace("#", "");
                const active = activeId === id;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`py-2! px-6! text-[15px] border-b border-gray-50 transition-colors duration-200 text-center ${active
                      ? "font-semibold text-[#0478AF]"
                      : "font-medium text-[#121212] hover:bg-[#F7FAFC]"
                      }`}
                  >
                    {t(link.label)}
                  </a>
                );
              })}
            </div>

            <div className="p-6!">
              <a
                href="#destinations"
                onClick={(e) => handleNavClick(e, "#destinations")}
                className="flex items-center justify-center bg-[#0478AF] text-white font-semibold text-[15px] rounded-full h-12 hover:bg-[#00567E] transition-colors duration-200 w-full"
              >
                {t("header.bookNow")}
              </a>

              <button
                onClick={toggleLanguage}
                aria-label="Toggle language"
                className="flex items-center justify-center rounded-full border border-[#0478AF] w-full h-12 text-[#00567E] font-bold text-xs mt-4!"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12Z"
                    stroke="#00567E"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.9999 2.0498C12.9999 2.0498 15.9999 5.9998 15.9999 11.9998C15.9999 17.9998 12.9999 21.9498 12.9999 21.9498M10.9999 21.9498C10.9999 21.9498 7.99988 17.9998 7.99988 11.9998C7.99988 5.9998 10.9999 2.0498 10.9999 2.0498M2.62988 15.4998H21.3699M2.62988 8.4998H21.3699"
                    stroke="#00567E"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Sidebar */}
      <SearchSidebar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
