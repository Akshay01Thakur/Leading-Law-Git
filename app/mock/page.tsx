"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { icons } from "../data";

export default function MockPage() {
  return (
    <Suspense fallback={<MockShell feature="prototype" />}>
      <MockContent />
    </Suspense>
  );
}

function MockContent() {
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature") ?? "prototype";
  return <MockShell feature={feature} />;
}

function MockShell({ feature }: { feature: string }) {
  const readable = feature
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <main className="mock-page">
      <section className="mock-card">
        <div className="brand-block">
          <div className="brand-mark">
            <icons.Scale size={26} />
          </div>
          <div>
            <strong>LegalSeva</strong>
            <span>Prototype destination</span>
          </div>
        </div>

        <div className="mock-icon">
          <icons.FileCheck2 size={34} />
        </div>
        <p className="eyebrow">Mockup page</p>
        <h1>{readable}</h1>
        <p>
          This destination represents a future product workflow. It is intentionally inert in the prototype,
          so additional clicks here do not open another page or create side effects.
        </p>

        <div className="mock-grid">
          <div>
            <strong>State</strong>
            <span>Mocked</span>
          </div>
          <div>
            <strong>Data</strong>
            <span>Sample only</span>
          </div>
          <div>
            <strong>Action</strong>
            <span>No operation</span>
          </div>
        </div>

        <button className="primary-action wide" disabled>
          Prototype action disabled
        </button>
      </section>
    </main>
  );
}
