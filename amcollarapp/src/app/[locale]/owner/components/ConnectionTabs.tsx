"use client";

interface Tab {
  id: string;
  label: string;
}

interface ConnectionTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function ConnectionTabs({
  tabs,
  activeTab,
  onTabChange,
}: ConnectionTabsProps) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-[#0F5D4A] text-[#0F5D4A]"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}



















