export default function OwnerHeader() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-white">Owner Dashboard</h1>
        <p className="text-sm text-gray-400">Pet: —</p>
      </div>

      <div className="h-10 w-10 rounded-full bg-[#1f4f43]" />
    </div>
  );
}
