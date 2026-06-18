import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HamburgerIcon from "./icons/HamburgerIcon";
import MenuOverlay from "./MenuOverlay";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ logoSrc = "/logo_original.svg", className = "" }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#031B17]/95 backdrop-blur-md shadow-lg py-2" : "bg-transparent py-4"
        } ${className.replace("absolute", "").replace("top-0", "").replace("left-0", "").replace("z-40", "").replace("w-full", "")}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-10">
          <Link to="/">
            <img
              src={logoSrc}
              alt="Aymen Promotion — promoteur immobilier haut de gamme à Alger"
              className={`w-auto transition-all duration-300 ${isScrolled ? "h-10 md:h-12" : "h-12 md:h-14"}`}
              draggable={false}
              fetchPriority="high"
              width="200"
              height="56"
            />
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="compact" />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group inline-flex items-center gap-3 text-white/90"
              aria-label={t("nav.open_menu")}
            >
              <span className="text-base font-medium">{t("nav.menu")}</span>
              <span className="text-white/50">|</span>
              <HamburgerIcon className="h-6 w-7 text-white" />
            </button>
          </div>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
