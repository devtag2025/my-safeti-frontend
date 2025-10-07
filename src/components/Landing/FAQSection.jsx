import React, { useEffect, useRef, useState } from "react";

const CRIMSON = "#6e0001";
const CRIMSON_LIGHT = "#8a0000";

const FAQSection = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const panelsRef = useRef([]);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // keep refs array length in sync
  const setPanelRef = (el, idx) => {
    panelsRef.current[idx] = el;
  };

  const toggleQuestion = (index) => {
    setActiveQuestion((prev) => (prev === index ? null : index));
  };

  // Update panel heights on open/close and on resize
  useEffect(() => {
    const updateHeights = () => {
      panelsRef.current.forEach((panel, idx) => {
        if (!panel) return;
        const content = panel.querySelector(".faq-panel-content");
        if (!content) return;
        if (activeQuestion === idx) {
          // expand to measured height
          panel.style.maxHeight = `${content.scrollHeight}px`;
          panel.style.opacity = "1";
          panel.style.paddingTop = "1rem";
          panel.style.paddingBottom = "1rem";
        } else {
          // collapse
          panel.style.maxHeight = "0px";
          panel.style.opacity = "0";
          panel.style.paddingTop = "0px";
          panel.style.paddingBottom = "0px";
        }
      });
    };

    // If user prefers reduced motion, skip transition adjustments
    if (reducedMotion.current) {
      panelsRef.current.forEach((panel, idx) => {
        if (!panel) return;
        const content = panel.querySelector(".faq-panel-content");
        panel.style.transition = "none";
        panel.style.maxHeight = activeQuestion === idx ? `${content.scrollHeight}px` : "none";
        panel.style.opacity = activeQuestion === idx ? "1" : "1";
        panel.style.paddingTop = activeQuestion === idx ? "1rem" : "1rem";
        panel.style.paddingBottom = activeQuestion === idx ? "1rem" : "1rem";
      });
    } else {
      // apply smooth heights with a short timeout so scrollHeight is correct
      updateHeights();
      const onResize = () => updateHeights();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
  }, [activeQuestion]);

  // close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setActiveQuestion(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const faqs = [
    {
      q: "How does My Safeti verify reports?",
      a: `My Safeti employs a multi-step verification process. First, reports are reviewed by our moderation team for completeness and credibility. Reports with submitted media undergo an additional verification step. We also use pattern matching to identify multiple consistent reports for the same vehicle or incident.`,
    },
    {
      q: "Is my personal information kept private?",
      a: `Yes — personal information is kept private. We only share anonymized report details with verified partners (e.g. insurers) and comply with Australian privacy laws. We never publish your personal contact details to the reported driver.`,
    },
    {
      q: "How do I receive payment for my media submissions?",
      a: `When a partner requests access to your media and you approve, your reward is processed via your selected payout method. Processing times depend on partner review cycles, typically within 3–5 business days after approval.`,
    },
    {
      q: "What types of incidents should I report?",
      a: `Report dangerous driving behaviours such as excessive speed, aggressive or reckless driving, tailgating, running red lights, or any behaviour that puts others at risk. For emergencies or active incidents, contact emergency services (000) first.`,
    },
    {
      q: "How can insurance companies access My Safeti data?",
      a: `Registered insurance partners sign up for a client account and, once verified, can search anonymized report data, request media access, and use analytics tools in the client portal. Different subscription tiers control data access levels.`,
    },
  ];

  return (
    <section
      className="relative overflow-hidden py-20 bg-white"
      aria-labelledby="faq-heading"
    >
      {/* Subtle crimson radial accents */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            `radial-gradient(360px 140px at 6% 12%, ${CRIMSON}10, transparent), ` +
            `radial-gradient(300px 120px at 94% 86%, ${CRIMSON_LIGHT}08, transparent)`,
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2
            id="faq-heading"
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: CRIMSON }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Find answers to common questions about My Safeti.
          </p>
        </div>

        <div
          className="max-w-3xl mx-auto divide-y"
          style={{ borderColor: `${CRIMSON}16` }}
        >
          {faqs.map((item, idx) => {
            const isOpen = activeQuestion === idx;
            return (
              <div key={idx} className="py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => toggleQuestion(idx)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleQuestion(idx);
                        }
                        // Arrow up/down to navigate between items
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setActiveQuestion((prev) =>
                            prev === null || prev === faqs.length - 1
                              ? 0
                              : prev + 1
                          );
                        }
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          setActiveQuestion((prev) =>
                            prev === null || prev === 0
                              ? faqs.length - 1
                              : prev - 1
                          );
                        }
                      }}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${idx}-panel`}
                      className={`text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-${CRIMSON_LIGHT.replace(
                        "#",
                        ""
                      )} rounded`}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <h3
                            className={`text-lg font-medium transition-colors duration-150`}
                            style={{ color: isOpen ? CRIMSON : "#0f172a" }}
                          >
                            {item.q}
                          </h3>

                          <div className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                            <span
                              className="inline-block px-2 py-0.5 rounded-md text-xs font-medium"
                              style={{
                                border: `1px solid ${CRIMSON}12`,
                                color: CRIMSON,
                                background:
                                  isOpen === true ? `${CRIMSON}06` : "transparent",
                              }}
                            >
                              {isOpen ? "Open" : "Tap to view"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {isOpen
                                ? "Press Esc to close"
                                : "Press Enter or Space to open"}
                            </span>
                          </div>
                        </div>

                        <div className="ml-6 flex-shrink-0">
                          <svg
                            className={`h-6 w-6 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : "rotate-0"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke={CRIMSON}
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Collapsible panel */}
                <div
                  id={`faq-${idx}-panel`}
                  ref={(el) => setPanelRef(el, idx)}
                  className="overflow-hidden rounded-lg border transition-[max-height,opacity,padding] duration-300"
                  style={{
                    borderColor: isOpen ? CRIMSON : "rgba(15,23,42,0.06)",
                    boxShadow: isOpen ? `0 8px 30px ${CRIMSON}1a` : "none",
                    maxHeight: "0px", // will be updated in effect
                    opacity: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                >
                  <div className="faq-panel-content px-4">
                    <p className="leading-relaxed text-slate-700">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thin crimson accent at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 -z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${CRIMSON}22, transparent)`,
          height: 6,
        }}
      />
    </section>
  );
};

export default FAQSection;
