export default function Footer() {
  return (
    <footer className="bg-[#002B5B]/95 backdrop-blur-sm text-white mt-0 pt-10 pb-6 relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
        {/* Section 1 – Description */}
        <div>
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <img src="/indeed-logo.png" alt="Indeed Immobilier" className="h-6" />
            Indeed Immobilier
          </h3>
          <p className="text-sm text-gray-200 leading-relaxed">
            Agence immobilière située à <strong>Ariana, Tunis</strong>, spécialisée dans
            la vente et la location de biens d’exception. Nous offrons un service
            personnalisé et un accompagnement complet pour concrétiser vos projets
            immobiliers.
          </p>
        </div>

        {/* Section 2 – Contact */}
        <div>
          <h3 className="text-xl font-bold mb-2">📞 Contact</h3>
          <ul className="text-sm text-gray-200 space-y-2">
            <li>
              <strong>Adresse :</strong> Ariana, Tunis
            </li>
            <li>
              <strong>Téléphone :</strong>{" "}
              <a href="tel:26454266" className="text-blue-200 hover:text-white underline">
                26 454 266
              </a>
            </li>
            <li>
              <strong>Agents :</strong>{" "}
              <a href="tel:98454266" className="text-blue-200 hover:text-white underline">
                98 454 266
              </a>{" "}
              |{" "}
              <a href="tel:20133333" className="text-blue-200 hover:text-white underline">
                20 133 333
              </a>
            </li>
            <li>
              <strong>Email :</strong>{" "}
              <a
                href="mailto:fouratiimmo@gmail.com"
                className="text-blue-200 hover:text-white underline"
              >
                fouratiimmo@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Section 3 – Google Map */}
        <div className="hidden lg:block">
          <h3 className="text-xl font-bold mb-2">📍 Localisation</h3>
          <iframe
            title="Indeed Immobilier Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.201927156189!2d10.1838!3d36.8660!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34c6d13d4c67%3A0x497c60b04a9313e6!2sAriana%2C%20Tunisie!5e0!3m2!1sfr!2stn!4v1700000000000!5m2!1sfr!2stn"
            width="100%"
            height="180"
            style={{ border: 0, borderRadius: "8px" }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="border-t border-blue-800/60 mt-10 pt-4 text-center text-xs text-gray-300">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-white">Indeed Immobilier</span> — Tous droits réservés.
      </div>
    </footer>
  );
}
