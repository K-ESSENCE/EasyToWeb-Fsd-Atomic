import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("[PREVIEW API] parsedSections:");

  const { projectId, sections } = await req.json();

  // sections는 stringified JSON임
  let parsedSections = null;
  try {
    parsedSections = JSON.parse(sections);
  } catch (e) {
    console.error("[PREVIEW API] Invalid sections format:", e);
    return NextResponse.json(
      { error: "Invalid sections format" },
      { status: 400 }
    );
  }

  // 여기서 원하는 로직 수행 (예: 미리보기용 임시 저장 등)
  // 일단 로그만 찍고, 더미 URL 반환
  console.log("[PREVIEW API] projectId:", projectId);
  console.log("[PREVIEW API] sections:", parsedSections);

  // 실제로는 미리보기용 URL을 생성해서 반환해야 함
  // 여기서는 더미 URL 반환
  return NextResponse.json(
    { url: `preview-${projectId}-${Date.now()}` },
    { status: 200 }
  );
}
