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
    <section
      style={{
        padding: `clamp(48px,8vw,80px) clamp(20px,4vw,40px)`,
        background: "#0f0f17",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              width: "48px",
              height: "3px",
              background: "#d4a853",
              borderRadius: "2px",
              margin: "0 auto 20px",
            }}
          />
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            Ce que disent nos clients
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "#d4a853", fontSize: "20px" }}>★★★★★</span>
            <span style={{ fontWeight: "700", fontSize: "16px" }}>4.8/5</span>
            <span style={{ color: "rgba(240,238,234,0.4)", fontSize: "14px" }}>
              · 1,200+ avis vérifiés
            </span>
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${perPage}, 1fr)`,
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          {visible.map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "8px" }}
          >
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: active === i ? "32px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background:
                    active === i ? "#d4a853" : "rgba(240,238,234,0.2)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
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
    <div
      style={{
        background: "#13131a",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Stars */}
      <div style={{ color: "#d4a853", fontSize: "14px" }}>
        {"★".repeat(review.rating)}
        {"☆".repeat(5 - review.rating)}
      </div>

      {/* Quote */}
      <p
        style={{
          color: "rgba(240,238,234,0.7)",
          fontSize: "14px",
          lineHeight: "1.8",
          flex: 1,
          fontStyle: "italic",
        }}
      >
        "{review.text}"
      </p>

      {/* Car */}
      <div
        style={{
          fontSize: "11px",
          color: "#d4a853",
          fontWeight: "600",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        🚗 {review.car}
      </div>

      {/* Author */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          paddingTop: "16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #d4a853, #8a6520)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: "800",
            color: "#0a0a0f",
            flexShrink: 0,
          }}
        >
          {review.avatar}
        </div>
        <div>
          <div style={{ fontWeight: "700", fontSize: "14px" }}>
            {review.name}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(240,238,234,0.4)" }}>
            📍 {review.city} · {review.date}
          </div>
        </div>
      </div>
    </div>
  );
}
