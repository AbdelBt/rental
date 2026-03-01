import { useState } from "react";
import { faqs } from "../data";

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section id="faq" style={{ padding: "80px 40px", background: "#0f0f17" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div className="gold-line" style={{ margin: "0 auto 20px" }} />
          <h2 className="section-title">Questions fréquentes</h2>
        </div>

        {faqs.map((f, i) => (
          <div key={i} className="faq-item">
            <div className="faq-q" onClick={() => toggle(i)}>
              <span>{f.q}</span>
              <span
                style={{
                  color: "#d4a853",
                  fontSize: "20px",
                  transition: "transform 0.2s",
                  transform: open === i ? "rotate(45deg)" : "none",
                  display: "inline-block",
                }}
              >
                +
              </span>
            </div>
            {open === i && <div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
