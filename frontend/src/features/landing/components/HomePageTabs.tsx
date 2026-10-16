type ActiveTab = 'home' | 'spotted';

interface HomeTabsProps {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}

export function HomePageTabs({ activeTab, onChange }: HomeTabsProps) {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-1">
          <button
            onClick={() => onChange('home')}
            className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'home'
                ? 'border-woof-blue-600 text-woof-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🐾 Početna
          </button>
          <button
            onClick={() => onChange('spotted')}
            className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'spotted'
                ? 'border-yellow-400 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📸 Vidio/la sam psa
          </button>
        </div>
      </div>
    </div>
  );
}