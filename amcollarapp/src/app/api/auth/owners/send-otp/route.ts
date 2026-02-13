import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "https://amcollar.com/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }

    console.log("📤 Proxying send OTP request to:", `${API_BASE_URL}/auth/owners/send-otp`);
    console.log("📤 Request body:", { phone });
    
    const response = await fetch(`${API_BASE_URL}/auth/owners/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    console.log("📥 Response status:", response.status);
    console.log("📥 Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response from backend:", errorText);
      
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { message: `Server error: ${response.status}` };
      }
      
      return NextResponse.json(
        { error: error.message || error.error || "Failed to send OTP" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Send OTP success:", data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send OTP" },
      { status: 500 }
    );
  }
}