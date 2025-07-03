"use client";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

interface Oncologist {
  name: string;
  specialty: string;
  phone: string;
  rating: number; // 1–5
}

const oncologists: Oncologist[] = [
  {
    name: "Stacie Cheney, APRN",
    specialty: "Medical Oncology",
    phone: "502-897-1166",
    rating: 5,
  },
  {
    name: "Mounika Mandadi, MD",
    specialty: "Hematology Oncology",
    phone: "502-897-1166",
    rating: 4.9,
  },
  {
    name: "Wangjian Zhong, MD",
    specialty: "Hematology Oncology",
    phone: "502-897-1166",
    rating: 4.9,
  },
];

const services = [
  "Chemotherapy & Immunotherapy",
  "Radiation Therapy (LINAC, SBRT)",
  "Surgical Oncology (da Vinci, VATS)",
  "Ion™ Robotic Bronchoscopy",
  "Genetic Counseling & Clinical Trials",
];

export default function BaptistOncologyDemoPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Branded header */}
      <header className="bg-[#005587] text-white px-6 py-10 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Baptist Health Louisville – Oncology Virtual Care Demo
          </h1>
          <p className="max-w-2xl text-sm md:text-base">
            Explore how secure LiveKit video, AI-powered transcriptions, and one-click Epic
            context can streamline tumor boards and tele-oncology visits.
          </p>
          <div className="mt-6 flex gap-4 flex-wrap">
            <Button asChild>
              <Link href="/conference?room=osborn-demo">Launch Demo Room</Link>
            </Button>
            <Button variant="secondary" asChild>
              <a href="tel:502-896-3009">Main Cancer Center ☎ (502) 896-3009</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 max-w-5xl mx-auto space-y-16">
        {/* Services */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Flagship Services</h2>
          <ul className="grid md:grid-cols-2 gap-4 list-disc list-inside">
            {services.map((svc) => (
              <li key={svc} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                {svc}
              </li>
            ))}
          </ul>
        </section>

        {/* Oncologist roster */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Key Providers</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {oncologists.map((doc) => (
              <Card key={doc.name} className="p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg leading-snug">{doc.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{doc.specialty}</p>
                  <p className="text-xs text-yellow-600">
                    {"★".repeat(Math.round(doc.rating))}
                    <span className="sr-only">Rating: {doc.rating}</span>
                  </p>
                </div>
                <Button asChild variant="outline" className="mt-4">
                  <a href={`tel:${doc.phone}`} aria-label={`Call ${doc.name}`}>Call Office</a>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology highlight */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Technology Spotlight</h2>
          <p className="text-sm md:text-base mb-6 max-w-prose">
            This demo leverages LiveKit for HIPAA-ready media transport, WebAssembly-based noise
            suppression, and our on-device AR overlays powered by Three.js. AI Copilot generates
            real-time summaries and action items, which you can export as a PDF using the
            <code className="px-1 py-0.5 bg-gray-100 rounded mx-1">Export Summary</code> button inside the
            conference.
          </p>
          <Button asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </section>
      </main>

      <footer className="bg-gray-100 py-6 text-xs text-gray-500 text-center">
        Demo only – not representative of actual medical advice. © 2025 Executive AI Conference.
      </footer>
    </div>
  );
}