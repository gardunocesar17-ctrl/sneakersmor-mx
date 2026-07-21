import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  
  if (!slug) return NextResponse.json({ error: "Missing slug" });
  
  try {
    const res = await fetch(`https://airfire.com.mx/products/${slug}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });
    if (!res.ok) return NextResponse.json({ error: "Fetch failed" });
    const html = await res.text();
    
    const invRegex = /"(\d+)":\s*\{\s*"inventory_management"[^}]+"inventory_quantity":\s*(-?\d+)/g;
    let invMatch;
    const scrapedInv: Record<string, number> = {};
    while ((invMatch = invRegex.exec(html)) !== null) {
      scrapedInv[invMatch[1]] = parseInt(invMatch[2]);
    }
    
    return NextResponse.json({ success: true, scrapedInv });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
