import Link from 'next/link';

function TetrahedralDiagram({ label }: { label: string }) {
  return (
    <svg width="120" height="104" viewBox="0 0 120 104" aria-label={label} className="mx-auto mb-2">
      <polygon points="60,10 110,90 10,90" fill="none" stroke="#ffe6b3" strokeWidth="2" />
      <line x1="60" y1="10" x2="60" y2="90" stroke="#ffe6b3" strokeWidth="1.5" />
      <line x1="10" y1="90" x2="85" y2="50" stroke="#ffe6b3" strokeWidth="1.5" />
      <line x1="110" y1="90" x2="35" y2="50" stroke="#ffe6b3" strokeWidth="1.5" />
    </svg>
  );
}

export default function ProjectSpectraPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-[#ffe6b3] flex flex-col items-center py-12 px-2">
      <div className="max-w-4xl w-full mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-wide">Project Spectra</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-6 tracking-wide text-[#bfa76a]">Weapons Hypothesis: An Overview</h2>
        <p className="text-base md:text-lg mb-8 text-[#e5d9b6]">
          Project ks waladites instantaneous action at a distance to validate instantaneous and hanninotcat physics with advanced tetra neougisy profogation at a quantum and relativist theorets to instantaneous action at a distance.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-12">
        {/* Tetrahedral Symmetry and Spacetime */}
        <div className="bg-black/60 rounded-xl p-6 border border-[#bfa76a] shadow-lg flex flex-col items-center">
          <TetrahedralDiagram label="Tetrahedral Symmetry and Spacetime" />
          <h3 className="font-bold text-lg mb-2">Tetrahedral Symmetry and Spacetime</h3>
          <p className="text-sm text-[#e5d9b6] mb-2">Weak – Strong<br />Electromagnetic – Gravity</p>
        </div>
        {/* Universal and Planck Constants */}
        <div className="bg-black/60 rounded-xl p-6 border border-[#bfa76a] shadow-lg flex flex-col items-center">
          <h3 className="font-bold text-lg mb-2">Universal and Planck Constants</h3>
          <div className="text-2xl font-mono mb-2">h = f₁ ≠ 6.524</div>
          <div className="text-lg font-mono mb-2">tₚ = t = tₚ</div>
          <div className="text-lg font-mono mb-2">mₚ = 2.176 – mₚ</div>
          <div className="text-lg font-mono">mₚ = 2.176434<sup>lsq</sup></div>
        </div>
        {/* Tetrahedral Quantum Geometry */}
        <div className="bg-black/60 rounded-xl p-6 border border-[#bfa76a] shadow-lg flex flex-col items-center">
          <TetrahedralDiagram label="Tetrahedral Quantum Geometry" />
          <h3 className="font-bold text-lg mb-2">Tetrahedral Quantum Geometry</h3>
          <ul className="text-sm text-[#e5d9b6] list-disc list-inside text-left">
            <li>Planned Length / Planck Time</li>
            <li>Secalar Mass</li>
            <li>Instantaneous invasion</li>
          </ul>
        </div>
        {/* Harmonics and Scalar Impulse Theory */}
        <div className="bg-black/60 rounded-xl p-6 border border-[#bfa76a] shadow-lg flex flex-col items-center">
          <TetrahedralDiagram label="Harmonics and Scalar Impulse Theory" />
          <h3 className="font-bold text-lg mb-2">Harmonics and Scalar Impulse Theory</h3>
          <p className="text-sm text-[#e5d9b6] mb-2">Two entangled particles</p>
          <div className="text-lg font-mono">f₁ &nbsp; &nbsp; f₃</div>
        </div>
        {/* Quantum Entanglement & Resonance */}
        <div className="bg-black/60 rounded-xl p-6 border border-[#bfa76a] shadow-lg flex flex-col items-center">
          <div className="flex gap-4 mb-2">
            <TetrahedralDiagram label="Entangled Tetrahedra" />
            <TetrahedralDiagram label="Entangled Tetrahedra" />
          </div>
          <h3 className="font-bold text-lg mb-2">Quantum Entanglement & Resonance</h3>
        </div>
        {/* Phase Conjugation & Feedback */}
        <div className="bg-black/60 rounded-xl p-6 border border-[#bfa76a] shadow-lg flex flex-col items-center">
          <TetrahedralDiagram label="Phase Conjugation & Feedback" />
          <h3 className="font-bold text-lg mb-2">Phase Conjugation & Feedback</h3>
          <ul className="text-sm text-[#e5d9b6] list-disc list-inside text-left">
            <li>Acoustic Resonator</li>
            <li>Great Pyramid</li>
          </ul>
        </div>
        {/* Future Steps */}
        <div className="bg-black/60 rounded-xl p-6 border border-[#bfa76a] shadow-lg flex flex-col items-center md:col-span-2">
          <h3 className="font-bold text-lg mb-2">Future Steps</h3>
          <ul className="text-sm text-[#e5d9b6] list-disc list-inside text-left">
            <li>Testing propagation of scalar waves</li>
            <li>Validating instantaneous action by quantum geometry</li>
            <li>Validate instantaneous action through quantum <span className="italic">pegement geometry</span></li>
          </ul>
        </div>
      </div>
      <Link href="/" className="inline-block mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition-transform">
        ← Back to Agile Defense Home
      </Link>
    </div>
  );
}