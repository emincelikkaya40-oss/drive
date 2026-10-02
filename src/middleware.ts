import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Ce middleware tourne AVANT que la page ne soit rendue : un commerçant
// qui tape /admin dans la barre d'adresse sans être ADMIN ne voit jamais
// la page, même une fraction de seconde. C'est la vérification serveur
// exigée par le cahier des charges (section 19), pas une simple protection
// côté client qui pourrait être contournée.
export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/merchant") && role !== "MERCHANT" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      // false = pas de token du tout → next-auth redirige automatiquement vers /login
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: ["/merchant/:path*", "/admin/:path*"],
};
