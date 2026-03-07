import { useState } from "react";
import { faqs } from "../data";

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section id="faq" className="py-20 px-10 bg-[#0f0f17]">
      <div className="max-w-[760px] mx-auto">
        <div className="text-center mb-12">
          <div className="gold-line mx-auto mb-5" />
          <h2 className="section-title">Questions fréquentes</h2>
        </div>

        {faqs.map((f, i) => (
          <div key={i} className="faq-item">
            <div className="faq-q" onClick={() => toggle(i)}>
              <span>{f.q}</span>
              <span
                className={`text-gold text-xl inline-block transition-transform duration-200 ${
                  open === i ? "rotate-45" : ""
                }`}
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
