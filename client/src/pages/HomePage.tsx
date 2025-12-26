import { useState } from "react";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"acheter" | "louer">("acheter");

  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-hidden">
      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat filter blur-[12px] scale-[1.03]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-black/40" />

      {/* Content */}
      <div className="relative z-10">
        <section className="flex flex-col items-center text-center pt-40 pb-20 px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold leading-tight drop-shadow-xl">
              Trouvez l’adresse d’exception qui vous ressemble
            </h1>

            <p className="mt-6 text-lg text-gray-200 leading-relaxed drop-shadow">
              Découvrez une sélection exclusive de villas, appartements et
              terrains haut de gamme en Tunisie. Avec{" "}
              <span className="font-semibold">Indeed Immobilier</span>,
              concrétisez votre projet en toute confiance et sérénité.
            </p>
          </div>

          {/* SEARCH BOX */}
          <div className="relative mt-14 w-full max-w-5xl">
            <div className="relative z-20 bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl">
              {/* Tabs */}
              <div className="flex justify-around border-b border-gray-200">
                {(["acheter", "louer"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-lg font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#002B5B] ${
                      activeTab === tab
                        ? "bg-[#002B5B] text-white"
                        : "text-[#002B5B] hover:bg-gray-100"
                    }`}
                    aria-pressed={activeTab === tab}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Pass the active tab so SearchBar picks the right budget scale */}
                <SearchBar mode={activeTab} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


