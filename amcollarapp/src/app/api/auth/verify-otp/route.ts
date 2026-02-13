import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { phone, code, role } = await req.json();

  if (!phone || !code) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // شبیه‌سازی توکن
  const res = NextResponse.json({
    user: { phone, role },
  });

  res.cookies.set("auth", "mock-token", {
    httpOnly: true,
    path: "/",
  });

  return res;
}
