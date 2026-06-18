import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "fr", label: "FR", full: "Français", dir: "ltr" },
  { code: "en", label: "EN", full: "English", dir: "ltr" },
  { code: "es", label: "ES", full: "Español", dir: "ltr" },
  { code: "ar", label: "AR", full: "العربية", dir: "rtl" },
] as const;

interface Props {
  /** compact = just the code label (for header); full = pill list (for menu overlay) */
  variant?: "compact" | "full";
  className?: string;
}

export default function LanguageSwitcher({ variant = "compact", className = "" }: Props) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const change = (code: string) => {
    i18n.changeLanguage(code);
    const dir = LANGUAGES.find((l) => l.code === code)?.dir ?? "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", code);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (variant === "full") {
    return (
      <div className={`flex flex-wrap items-center justify-end gap-2 ${className}`}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => change(lang.code)}
            className={[
              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border",
              i18n.language === lang.code
                ? "bg-[#F7C66A] text-[#031B17] border-[#F7C66A]"
                : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white",
            ].join(" ")}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-white/80 hover:text-white transition text-sm font-semibold uppercase tracking-wider"
        aria-label="Changer de langue"
      >
        <span className="text-[#F7C66A]">{current.label}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-[6000] min-w-[120px] rounded-xl border border-white/10 bg-[#0a1714]/95 backdrop-blur-md shadow-xl overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => change(lang.code)}
              className={[
                "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2",
                i18n.language === lang.code
                  ? "bg-[#F7C66A]/15 text-[#F7C66A]"
                  : "text-white/75 hover:bg-white/8 hover:text-white",
              ].join(" ")}
              style={{ direction: lang.dir }}
            >
              <span className="font-bold w-7">{lang.label}</span>
              <span className="text-xs opacity-70">{lang.full}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
