import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "https://amcollar.com/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }

    console.log("📤 Proxying send OTP request to:", `${API_BASE_URL}/auth/vets/send-otp`);
    
    const response = await fetch(`${API_BASE_URL}/auth/vets/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `Server error: ${response.status}` }));
      return NextResponse.json(
        { error: error.message || "Failed to send OTP" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}