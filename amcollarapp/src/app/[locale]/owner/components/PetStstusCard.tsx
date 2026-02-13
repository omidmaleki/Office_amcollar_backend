export default function PetStatusCard() {
  return (
    <div className="mb-6 rounded-2xl bg-[#102a23] p-5 shadow">
      <h2 className="mb-4 text-lg font-medium text-white">🐾 Pet Status</h2>

      <div className="space-y-2 text-sm text-gray-300">
        <div>Status: <span className="text-gray-400">No data yet</span></div>
        <div>Battery: <span className="text-gray-400">—</span></div>
        <div>Last update: <span className="text-gray-400">—</span></div>
      </div>
    </div>
  );
}
