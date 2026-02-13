import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone, firstName, lastName, medicalCouncilNumber } =
      await req.json();

    // Validation
    if (!phone || !firstName || !lastName || !medicalCouncilNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Replace with actual backend integration
    // Store veterinarian data in database with status: PENDING_VERIFICATION
    // Example:
    // await db.vets.create({
    //   data: {
    //     phone,
    //     firstName,
    //     lastName,
    //     medicalCouncilNumber,
    //     status: "PENDING_VERIFICATION",
    //   },
    // });

    // Mock response for development
    console.log("🟡 MOCK Vet Registration:", {
      phone,
      firstName,
      lastName,
      medicalCouncilNumber,
      status: "PENDING_VERIFICATION",
    });

    return NextResponse.json({
      success: true,
      message: "Registration submitted successfully",
    });
  } catch (error) {
    console.error("Failed to register vet:", error);
    return NextResponse.json(
      { error: "Failed to register veterinarian" },
      { status: 500 }
    );
  }
}


















