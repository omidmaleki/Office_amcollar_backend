import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // TODO: Replace with actual backend integration
    // Check veterinarian status in database
    // Example:
    // const vet = await db.vets.findUnique({
    //   where: { phone },
    //   select: { status: true },
    // });
    //
    // if (!vet) {
    //   return NextResponse.json({ status: "NOT_REGISTERED" });
    // }
    //
    // return NextResponse.json({ status: vet.status });

    // Mock response for development
    // Return NOT_REGISTERED by default for testing registration flow
    // In production, this should check the actual database
    console.log("🟡 MOCK Vet Status Check:", { phone, status: "NOT_REGISTERED" });

    return NextResponse.json({ status: "NOT_REGISTERED" });
  } catch (error) {
    console.error("Failed to check vet status:", error);
    return NextResponse.json(
      { error: "Failed to check veterinarian status" },
      { status: 500 }
    );
  }
}


















