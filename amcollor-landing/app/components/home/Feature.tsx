type FeatureProps = {
  label: string;
  position: "leftTop" | "leftBottom" | "right";
  isRTL?: boolean;
};

export default function Feature({
  label,
  position,
  isRTL = false,
}: FeatureProps) {
  const positionsLTR = {
    leftTop: "top-10 left-0",
    leftBottom: "bottom-16 left-0",
    right: "top-1/2 right-0",
  };

  const positionsRTL = {
    leftTop: "top-10 right-0",
    leftBottom: "bottom-16 right-0",
    right: "top-1/2 left-0",
  };

  const pos = isRTL ? positionsRTL : positionsLTR;

  return (
    <div className={`absolute ${pos[position]} flex items-center gap-3 text-white z-30 px-4`}>
      {/* Small circle at label */}
      <span 
        className="w-2.5 h-2.5 rounded-full bg-white flex-shrink-0"
        style={{
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
        }}
      />
      
      {/* Dashed line */}
      <span 
        className="h-px bg-white/60 flex-1 max-w-[60px]"
        style={{
          backgroundImage: 'repeating-linear-gradient(to right, white 0, white 4px, transparent 4px, transparent 8px)',
        }}
      />
      
      <span 
        className="text-sm whitespace-nowrap opacity-90 font-medium"
        style={{
          textShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
        }}
      >
        {label}
      </span>
    </div>
  );
}