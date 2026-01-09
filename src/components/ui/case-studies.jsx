import React, { useEffect, useState } from "react";
import { Clock, Shield, CheckCircle } from "lucide-react";
import CountUp from "react-countup";
import { AnimatedGridPattern } from "./animated-grid-pattern";
import { cn } from "../../lib/utils";

/** Hook: respects user's motion preferences */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

/** Utility: parse a metric like "98%", "3.8x", "$1,200+", "1.5M", "€23.4k" */
function parseMetricValue(raw) {
  const value = (raw ?? "").toString().trim();
  const m = value.match(
    /^([^\d\-+]*?)\s*([\-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([^\d\s]*)$/
  );

  if (!m) {
    return { prefix: "", end: 0, suffix: value, decimals: 0 };
  }

  const [, prefix, num, suffix] = m;
  const normalized = num.replace(/,/g, "");
  const end = parseFloat(normalized);
  const decimals = (normalized.split(".")[1]?.length ?? 0);

  return {
    prefix: prefix ?? "",
    end: isNaN(end) ? 0 : end,
    suffix: suffix ?? "",
    decimals,
  };
}

/** Small component: one animated metric */
function MetricStat({
  value,
  label,
  sub,
  duration = 1.6,
}) {
  const reduceMotion = usePrefersReducedMotion();
  const { prefix, end, suffix, decimals } = parseMetricValue(value);

  return (
    <div className="flex flex-col gap-2 text-left p-6 border-l-2 border-slate-100 dark:border-slate-800 hover:border-accent transition-colors duration-300">
      <p
        className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white"
        aria-label={`${label} ${value}`}
      >
        {prefix}
        {reduceMotion ? (
          <span>
            {end.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </span>
        ) : (
          <CountUp
            end={end}
            decimals={decimals}
            duration={duration}
            separator=","
            enableScrollSpy
            scrollSpyOnce
          />
        )}
        {suffix}
      </p>
      <p className="font-semibold text-slate-900 dark:text-white text-left text-sm">
        {label}
      </p>
      {sub ? (
        <p className="text-slate-600 dark:text-slate-400 text-left text-xs">{sub}</p>
      ) : null}
    </div>
  );
}

export default function CaseStudies() {
  const caseStudies = [
    {
      id: 1,
      quote:
        "We respect your time. We show up when we say we will and finish on schedule, minimizing disruption to your home.",
      title: "On Time, Every Time",
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
      icon: Clock,
      metrics: [
        { value: "98%", label: "On-Time Completion", sub: "Projects finished on schedule" },
        { value: "24h", label: "Fast Response", sub: "For quotes and inspections" },
      ],
    },
    {
      id: 2,
      quote:
        "All our work complies with Australian Standards and comes with a 7-year workmanship warranty for your peace of mind.",
      title: "Quality Guaranteed",
      image:
        "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800",
      icon: Shield,
      metrics: [
        { value: "7yr", label: "Warranty", sub: "On all waterproofing" },
        { value: "100%", label: "Certified", sub: "Licensed tradespeople" },
      ],
    },
    {
      id: 3,
      quote:
        "No hidden costs. Detailed fixed-price quotes provided upfront before any work begins. What we quote is what you pay.",
      title: "Transparent Pricing",
      image:
        "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=800",
      icon: CheckCircle,
      metrics: [
        { value: "500+", label: "Happy Clients", sub: "Across Greater Sydney" },
        { value: "0", label: "Hidden Fees", sub: "Guaranteed fixed pricing" },
      ],
    },
  ];

  return (
    <section
      className="py-24 bg-white relative overflow-hidden"
      aria-labelledby="case-studies-heading"
    >
      {/* Animated Grid Pattern Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-sm mx-auto mb-4">
             <Shield className="w-4 h-4 text-accent" />
             <span>The Himalayan Standard</span>
          </div>
          <h2
            id="case-studies-heading"
            className="text-2xl font-bold text-slate-900 tracking-tight"
          >
            Why Homeowners <br/> Trust <span className="text-accent">Himalayan Tiling</span>
          </h2>
          <p className="text-slate-600 text-sm">
            We don't just lay tiles; we craft spaces. Our commitment to excellence ensures that every project receives the same level of precision and care.
          </p>
        </div>

        {/* Cases */}
        <div className="flex flex-col gap-24">
          {caseStudies.map((study, idx) => {
            const reversed = idx % 2 === 1;

            return (
              <div
                key={study.id}
                className="grid gap-12 lg:grid-cols-2 xl:gap-24 items-center border-b border-slate-100 pb-12 last:border-0"
              >
                {/* Left: Image + Quote */}
                <div
                  className={[
                    "flex flex-col gap-10",
                    reversed ? "lg:order-2" : "",
                  ].join(" ")}
                >
                  <div className="relative group max-w-md mx-auto lg:max-w-sm">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent to-yellow-200 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <img
                      src={study.image}
                      alt={study.title}
                      className="relative w-full aspect-[4/3] rounded-2xl object-cover shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center text-accent">
                      <study.icon className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* Right: Content & Metrics */}
                <div
                  className={[
                    "flex flex-col gap-8",
                    reversed ? "lg:order-1" : "",
                  ].join(" ")}
                >
                  <div>
                    <h3 className="text-xl md:text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                      {study.title}
                    </h3>
                    <blockquote className="text-sm text-slate-600 leading-relaxed border-l-4 border-accent pl-4 py-2 bg-slate-50/50">
                      "{study.quote}"
                    </blockquote>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                    {study.metrics.map((metric, i) => (
                      <MetricStat
                        key={`${study.id}-${i}`}
                        value={metric.value}
                        label={metric.label}
                        sub={metric.sub}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

