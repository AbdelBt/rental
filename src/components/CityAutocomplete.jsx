import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";

async function fetchCities(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=8&countrycodes=ma&accept-language=fr`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const seen = new Set();
  return data
    .map((p) => p.address?.city || p.address?.town || p.address?.village || p.name)
    .filter((name) => name && !seen.has(name) && seen.add(name));
}

/**
 * Single city autocomplete — Nominatim API, Morocco only
 * Dropdown rendered via portal → escapes any overflow/z-index parent
 */
export function CityAutocomplete({ value, onChange, placeholder = "Rechercher une ville…", className = "" }) {
  const [input, setInput] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => { setInput(value || ""); }, [value]);

  // Keep dropdown aligned to input on every frame while open
  useLayoutEffect(() => {
    if (!open || !inputRef.current || !dropRef.current) return;
    const sync = () => {
      const r = inputRef.current?.getBoundingClientRect();
      if (!r || !dropRef.current) return;
      dropRef.current.style.top = `${r.bottom + 4}px`;
      dropRef.current.style.left = `${r.left}px`;
      dropRef.current.style.width = `${r.width}px`;
    };
    sync();
    const id = setInterval(sync, 16); // ~60fps sync
    return () => clearInterval(id);
  }, [open]);

  const search = useCallback((text) => {
    clearTimeout(debounceRef.current);
    if (!text) { setSuggestions([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await fetchCities(text);
      setSuggestions(results);
      setOpen(results.length > 0);
      setLoading(false);
    }, 350);
  }, []);

  const handleFocus = () => search(input);
  const handleInput = (e) => { setInput(e.target.value); search(e.target.value); };
  const handleSelect = (city) => { setInput(city); setOpen(false); onChange(city); };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={className}>
      <div className="relative">
        <input
          ref={inputRef}
          className="input-field w-full pr-8"
          value={input}
          onChange={handleInput}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-gold rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && suggestions.length > 0 && createPortal(
        <ul
          ref={dropRef}
          style={{ position: "fixed", zIndex: 99999 }}
          className="bg-[#151422] border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-52 overflow-y-auto"
        >
          {suggestions.map((city) => (
            <li
              key={city}
              onMouseDown={() => handleSelect(city)}
              className="flex items-center gap-2.5 px-4 py-2.5 cursor-pointer hover:bg-white/[0.06] transition-colors text-[13px] text-cream/85"
            >
              <span className="text-sm shrink-0">📍</span>
              {city}
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
}

/**
 * Multi-city tag selector
 */
export function CitiesMultiSelect({ cities = [], onChange }) {
  const addCity = (city) => {
    if (city && !cities.includes(city)) onChange([...cities, city]);
  };
  const removeCity = (city) => onChange(cities.filter((c) => c !== city));

  return (
    <div className="flex flex-col gap-3">
      <CityAutocomplete value="" onChange={addCity} placeholder="Ajouter une ville…" />
      {cities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <span key={city} className="flex items-center gap-1.5 text-[13px] font-semibold text-gold bg-gold/10 border border-gold/25 py-1.5 px-3 rounded-full">
              📍 {city}
              <button
                type="button"
                onClick={() => removeCity(city)}
                className="text-gold/50 hover:text-gold bg-transparent border-none cursor-pointer leading-none text-sm ml-0.5"
              >✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
