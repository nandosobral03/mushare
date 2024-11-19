import { db } from "@/server/db";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    const { count } = await db.searchCache.deleteMany({
      where: {
        timestamp: {
          lt: oneDayAgo,
        },
      },
    });

    return NextResponse.json({ success: true, deletedCount: count });
  } catch (error) {
    console.error("Cache cleanup failed:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
