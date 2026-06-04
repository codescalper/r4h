import { NextRequest, NextResponse } from "next/server"
import { execSync } from "child_process"
import crypto from "crypto"

export const runtime = "nodejs"

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || ""
const DEPLOY_SCRIPT = process.env.DEPLOY_SCRIPT_PATH || "/var/www/r4h/deploy.sh"

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false
  const expected = "sha256=" + crypto.createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("hex")
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify signature
    const signature = req.headers.get("x-hub-signature-256") || ""
    const payload = await req.clone().text()
    if (WEBHOOK_SECRET && !verifySignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // 2. Verify it's a push event
    const event = req.headers.get("x-github-event") || ""
    if (event !== "push") {
      return NextResponse.json({ message: `Ignored event: ${event}` })
    }

    // 3. Optionally filter by branch
    const body = JSON.parse(payload)
    const ref = body.ref || ""
    const allowedBranch = process.env.DEPLOY_BRANCH || "refs/heads/main"
    if (ref !== allowedBranch) {
      return NextResponse.json({ message: `Ignored push to ${ref}` })
    }

    // 4. Fire off deploy in background (don't block GitHub's request)
    execSync(`bash ${DEPLOY_SCRIPT}`, {
      cwd: process.cwd(),
      timeout: 5 * 60 * 1000, // 5 minutes
      stdio: "pipe",
    })

    const commitMsg = body.head_commit?.message || ""
    const author = body.pusher?.name || ""
    console.log(`[webhook] Deploy triggered — ${author}: ${commitMsg}`)

    return NextResponse.json({ success: true, message: "Deploy triggered" })
  } catch (err: any) {
    console.error("[webhook] Deploy failed:", err.message)
    return NextResponse.json({ error: "Deploy failed", details: err.message }, { status: 500 })
  }
}
