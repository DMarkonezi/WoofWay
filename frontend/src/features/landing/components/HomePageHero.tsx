interface HomeHeroProps {
  onRegister: () => void;
  onLogin: () => void;
}

export function HomePageHero({ onRegister, onLogin }: HomeHeroProps) {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
        <span className="text-5xl">🐾</span>
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
          Pronađi svog <span className="text-woof-blue-600">najboljeg prijatelja</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl">
          WoofWay povezuje vlasnike, čuvare i azile. Pomozi izgubljenom psu da pronađe dom ili pronađi pouzdanog čuvara za svog ljubimca. Ako nemaš svog ljubimca, udomi.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button onClick={onRegister} className="px-6 py-3 bg-woof-blue-600 hover:bg-woof-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            Pridruži se besplatno
          </button>
          <button onClick={onLogin} className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors">
            Prijavi se
          </button>
        </div>
      </div>
    </section>
  );
}