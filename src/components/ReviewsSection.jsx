import { useState } from "react";
import { reviews } from "../data";
import useBreakpoint from "../hooks/useBreakpoint";

export default function ReviewsSection() {
  const { isMobile, isTablet } = useBreakpoint();
  const [active, setActive] = useState(0);
  const perPage = isMobile ? 1 : isTablet ? 2 : 3;
  const pages = Math.ceil(reviews.length / perPage);
  const visible = reviews.slice(active * perPage, active * perPage + perPage);

  return (
    <section className="py-12 md:py-20 px-5 md:px-10 bg-[#0f0f17]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <div className="w-12 h-0.5 bg-gold rounded mx-auto mb-5" />
          <h2 className="font-playfair text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-3">
            Ce que disent nos clients
          </h2>
          <div className="flex justify-center items-center gap-2">
            <span className="text-gold text-xl">★★★★★</span>
            <span className="font-bold text-base">4.8/5</span>
            <span className="text-cream/40 text-sm">· 1,200+ avis vérifiés</span>
          </div>
        </div>

        <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: `repeat(${perPage}, 1fr)` }}>
          {visible.map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>

        {pages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded border-none cursor-pointer p-0 transition-all duration-300 ${
                  active === i ? "w-8 bg-gold" : "w-2 bg-cream/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-dark border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-4">
      <div className="text-gold text-sm">
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </div>

      <p className="text-cream/70 text-sm leading-relaxed flex-1 italic">
        "{review.text}"
      </p>

      <div className="text-[11px] text-gold font-semibold tracking-widest uppercase">
        🚗 {review.car}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-[#8a6520] flex items-center justify-center text-[13px] font-extrabold text-dark-bg shrink-0">
          {review.avatar}
        </div>
        <div>
          <div className="font-bold text-sm">{review.name}</div>
          <div className="text-xs text-cream/40">📍 {review.city} · {review.date}</div>
        </div>
      </div>
    </div>
  );
}
