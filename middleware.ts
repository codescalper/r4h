import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth-edge';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Protect /admin/dashboard and sub-paths ──────────────────────────────
  if (pathname.startsWith('/admin/dashboard')) {
    const token = request.cookies.get('r4h_admin_token')?.value;
    if (!token || !(await verifyTokenEdge(token))) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // ─── Redirect /admin/login if already authenticated ──────────────────────
  if (pathname === '/admin/login') {
    const token = request.cookies.get('r4h_admin_token')?.value;
    if (token && (await verifyTokenEdge(token))) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // ─── Protect /member/dashboard and sub-paths ─────────────────────────────
  if (pathname.startsWith('/member/dashboard')) {
    const token = request.cookies.get('r4h_member_token')?.value;
    if (!token || !(await verifyTokenEdge(token))) {
      return NextResponse.redirect(new URL('/member/login', request.url));
    }
  }

  // ─── Redirect /member/login if already authenticated ─────────────────────
  if (pathname === '/member/login') {
    const memberToken = request.cookies.get('r4h_member_token')?.value;
    if (memberToken && (await verifyTokenEdge(memberToken))) {
      return NextResponse.redirect(new URL('/member/dashboard', request.url));
    }
    // Admin visiting member login → send to admin dashboard
    const adminToken = request.cookies.get('r4h_admin_token')?.value;
    if (adminToken && (await verifyTokenEdge(adminToken))) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/member/:path*'],
};
