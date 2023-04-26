export { default } from "next-auth/middleware";
// import { withAuth } from "next-auth/middleware";
// import { NextRequest, NextResponse } from "next/server";

// export default default();

// export default withAuth(
// `withAuth` augments your `Request` with the user's token.
// function middleware(req) {
// console.log("token: ", req.nextauth.token.data);

//     if (req.nextUrl.pathname.startsWith("/room") && !req.nextauth.token.data) {
//       console.log("1");
//       return NextResponse.rewrite(new URL("/login", req.url));
//     }
//     if (req.nextUrl.pathname.startsWith("/login") && req.nextauth.token.data) {
//       console.log("2");
//       return NextResponse.rewrite(new URL("/", req.url));
//     }

//     if (req.nextUrl.pathname.startsWith("/signup") && req.nextauth.token.data) {
//       console.log("3");
//       return NextResponse.rewrite(new URL("/", req.url));
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

export const config = {
  matcher: ["/room/:path*"],
};
