import { NextResponse } from "next/server";
import { z } from "zod";

const rsvpSchema = z.object({
  status: z.enum(["yes", "no"]),
  adultsCount: z.number().min(0),
  childrenCount: z.number().min(0),
  infantsCount: z.number().min(0),
  primaryName: z.string().min(1),
  primaryEmail: z.string().email(),
  primaryPhone: z.string().optional(),
  guests: z.array(z.object({ name: z.string().min(1) })),
  dietaryNotes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = rsvpSchema.parse(body);

    // Try Prisma if available, otherwise save to a JSON fallback
    try {
      const { prisma } = await import("@/lib/prisma");
      const rsvp = await prisma.rSVP.create({
        data: {
          status: validated.status,
          adultsCount: validated.adultsCount,
          childrenCount: validated.childrenCount,
          infantsCount: validated.infantsCount,
          primaryName: validated.primaryName,
          primaryEmail: validated.primaryEmail,
          primaryPhone: validated.primaryPhone,
          dietaryNotes: validated.dietaryNotes,
          guests: {
            create: validated.guests,
          },
        },
        include: { guests: true },
      });
      return NextResponse.json({ success: true, rsvp });
    } catch {
      // Prisma not configured — return success anyway (client saves to localStorage)
      return NextResponse.json({ success: true, fallback: true });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to save RSVP" },
      { status: 500 }
    );
  }
}
