import { ReactNode } from "react";

type CardProps = {
  title?: string;
  items: string[] | ReactNode[];
  index?: number;
};

export default function Card({ title, items, index = 0 }: CardProps) {
  // Gradient glows for each card
  const glowColors = [
    // Card 1: Warm pink/purple/red on left
    {
      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(15, 93, 74, 0.15) 50%, rgba(26, 45, 38, 0.1) 100%)',
      border: 'rgba(255, 255, 255, 0.3)',
      shadow: '0 0 30px rgba(255, 255, 255, 0.2), 0 0 60px rgba(212, 175, 55, 0.1)',
    },
    // Card 2: Central transition
     {
      background: 'linear-gradient(135deg, rgba(26, 45, 38, 0.2) 0%, rgba(15, 93, 74, 0.15) 50%, rgba(212, 175, 55, 0.1) 100%)',
      border: 'rgba(255, 255, 255, 0.3)',
      shadow: '0 0 30px rgba(255, 255, 255, 0.2), 0 0 60px rgba(212, 175, 55, 0.1)',
    },
    // Card 3: Cool blue/purple on right
     {
      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(15, 93, 74, 0.15) 50%, rgba(26, 45, 38, 0.1) 100%)',
      border: 'rgba(255, 255, 255, 0.3)',
      shadow: '0 0 30px rgba(255, 255, 255, 0.2), 0 0 60px rgba(212, 175, 55, 0.1)',
    },
  ];

  const glow = glowColors[index] || glowColors[0];

  // Check if items are ReactNode (from renderItemsWithIcons) or strings
  const itemsAreJSX = items.length > 0 && typeof items[0] !== 'string';

  return (
    <div 
      className="rounded-3xl p-8 text-white backdrop-blur-md relative overflow-hidden"
      style={{
        background: glow.background,
        border: `1px solid ${glow.border}`,
        boxShadow: glow.shadow,
      }}
    >
      {/* Subtle inner glow */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-50"
        style={{
          background: `radial-gradient(circle at ${index === 0 ? '20%' : index === 1 ? '50%' : '80%'} 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)`,
        }}
      />
      
      <div className="relative z-10">
        {title && (
          <h3 
            className="mb-6 font-bold text-xl text-white"
            style={{
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            }}
          >
            {title}
          </h3>
        )}
        
        <ul className="space-y-4">
          {items.map((item, i) => (
            <li key={i}>
              {itemsAreJSX ? (
                // Render JSX items directly (already have glassy circles from renderItemsWithIcons)
                item
              ) : (
                // Fallback for string items (Section 1 compatibility)
                <div className="flex items-start gap-3">
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 255, 255)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div className="w-5 h-5 rounded bg-white/30" />
                  </div>
                  <span className="text-sm text-white/90 leading-relaxed pt-2">
                    {item as string}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}