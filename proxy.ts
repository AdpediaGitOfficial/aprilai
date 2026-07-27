import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { authEnabled } from "@/lib/config";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

/**
 * Next 16 "proxy" convention (formerly `middleware.ts`).
 *
 * When auth is configured, protect every route except the sign-in/up pages.
 * When it isn't, this is a pass-through so the app stays open in guest mode.
 */
const withClerk = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export default authEnabled ? withClerk : function proxy() {};

export const config = {
  matcher: [
    // Skip Next internals and static files unless referenced in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
