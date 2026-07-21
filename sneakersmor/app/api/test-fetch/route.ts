import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`https://airfire.com.mx/products.json?limit=1`);
    if (!res.ok) {
      return NextResponse.json({ error: "Fetch failed", status: res.status });
    }
    const data = await res.json();
    return NextResponse.json({ success: true, count: data.products?.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
