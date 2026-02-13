export type BuyStep = 1 | 2 | 3 | 4 | 5 | 6;
export type StepperStep = 1 | 2 | 3 | 4 | 5 | 6;

export type BuyState = {
  step: BuyStep;

  // Product Configuration
  strapColor?: string;
  deviceColor?: string;
  size?: "S" | "M" | "L";

  // Step 2: Phone Verification
  phone?: string;
  otp?: string;
  phoneVerified?: boolean;
  accessToken?: string; // Token received from OTP verification

  // Step 3: User & Pet Info
  ownerName?: string;
  address?: string;
  petName?: string;
  petType?: "dog" | "cat";
  petBreed?: string;
  petSex?: "male" | "female";
  petAge?: number;

  // Step 4: Veterinarian
  vetId?: string;
  vetName?: string; // Store vet name for display in review step

  // Step 5: Payment Gateway
  paymentMethod?: string;

  // Step 6: Review & Payment
};

export const STEP_LABELS = {
  1: "Configure",
  2: "Verify",
  3: "Details",
  4: "Veterinarian",
  5: "Payment",
  6: "Review",
};

export const NEXT_STEP: Record<BuyStep, BuyStep> = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 6,
};

export const PREV_STEP: Record<BuyStep, BuyStep> = {
  1: 1,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

// Color options
export const STRAP_COLORS = [
  { id: "black", name: "Black", hex: "#1a1a1a" },
  { id: "brown", name: "Brown", hex: "#8B4513" },
  { id: "blue", name: "Blue", hex: "#2563eb" },
  { id: "red", name: "Red", hex: "#dc2626" },
  { id: "green", name: "Green", hex: "#0F5D4A" },
];

export const DEVICE_COLORS = [
  { id: "silver", name: "Silver", hex: "#c0c0c0" },
  { id: "black", name: "Black", hex: "#1a1a1a" },
  { id: "gold", name: "Gold", hex: "#D4AF37" },
  { id: "rose", name: "Rose Gold", hex: "#e8b4b8" },
  { id: "space", name: "Space Gray", hex: "#4a4a4a" },
];

export const SIZES = [
  { 
    id: "S", 
    name: "Small", 
    nameFa: "کوچک",
    description: "For pets 5-15 lbs",
    descriptionFa: "برای حیوانات ۵ تا ۱۵ پوند"
  },
  { 
    id: "M", 
    name: "Medium", 
    nameFa: "متوسط",
    description: "For pets 15-40 lbs",
    descriptionFa: "برای حیوانات ۱۵ تا ۴۰ پوند"
  },
  { 
    id: "L", 
    name: "Large", 
    nameFa: "بزرگ",
    description: "For pets 40+ lbs",
    descriptionFa: "برای حیوانات بالای ۴۰ پوند"
  },
];

// Payment gateways
export const PAYMENT_METHODS = [
  { 
    id: "zarinpal", 
    name: "Zarinpal", 
    nameFa: "زرین‌پال",
    description: "Secure online payment",
    descriptionFa: "پرداخت امن آنلاین"
  },
  { 
    id: "saman", 
    name: "Saman Bank", 
    nameFa: "بانک سامان",
    description: "Bank gateway",
    descriptionFa: "درگاه بانکی"
  },
  { 
    id: "mellat", 
    name: "Mellat Bank", 
    nameFa: "بانک ملت",
    description: "Bank gateway",
    descriptionFa: "درگاه بانکی"
  },
];