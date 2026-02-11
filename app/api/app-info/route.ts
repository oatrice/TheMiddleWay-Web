import { getAppUrls, getBuildInfo } from "@/lib/runtime/appInfo";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    urls: getAppUrls(),
    build: getBuildInfo(),
  });
}
