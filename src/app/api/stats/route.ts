import { NextResponse } from "next/server";
import { getSystemStats } from "@/lib/server/bot-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getSystemStats();
  return NextResponse.json(stats);
}
