export async function POST() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return Response.json(
    { success: true },
    {
      headers: {
        'Set-Cookie': `r4h_admin_token=; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      },
    },
  );
}
