import { getSession } from "@/utils/session";
import { NextRequest, NextResponse } from "next/server";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/log-in": true,
  "/create-account": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isPublicUrl = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!isPublicUrl) {
      return NextResponse.redirect(new URL("/log-in", request.url));
    }
  } else {
    if (isPublicUrl) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
