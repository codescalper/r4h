import Image from "next/image"
import { Bebas_Neue, Lora } from "next/font/google"
import { MapPin, Phone, Mail } from "lucide-react"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type PageKey = "home" | "about" | "programs" | "news" | "register" | "donate" | "gallery" | "contact"

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer({ setCurrentPage }: { setCurrentPage: (p: PageKey) => void }) {
  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Image src="/logo.png" alt="Run4Health" width={130} height={38} className="object-contain mb-3" />
          <p className={`${lora.className} text-sm text-muted-foreground leading-relaxed`}>Fitness First — Building healthier communities across Thane & Mumbai, one stride at a time.</p>
        </div>
        <div>
          <p className={`${bebasNeue.className} tracking-wider text-base text-foreground mb-3`}>Quick Links</p>
          {(["home","about","programs","news","gallery","contact"] as PageKey[]).map(p => (
            <button key={p} onClick={() => setCurrentPage(p)} className={`${lora.className} block text-sm text-muted-foreground hover:text-primary capitalize py-0.5`}>{p}</button>
          ))}
        </div>
        <div>
          <p className={`${bebasNeue.className} tracking-wider text-base text-foreground mb-3`}>Programs</p>
          {["Marathon Training","Yoga Sessions","Health Awareness Camps","Corporate Wellness","Fun Runs"].map(p => (
            <p key={p} className={`${lora.className} text-sm text-muted-foreground py-0.5`}>{p}</p>
          ))}
        </div>
        <div>
          <p className={`${bebasNeue.className} tracking-wider text-base text-foreground mb-3`}>Contact</p>
          <div className={`${lora.className} text-sm text-muted-foreground space-y-2`}>
            <div className="flex gap-2 items-start"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" /><span>Run4Health Community Center, Thane West, Maharashtra — 400601</span></div>
            <div className="flex gap-2 items-center"><Phone className="w-4 h-4 shrink-0 text-primary" /><span>+91 98765 43210</span></div>
            <div className="flex gap-2 items-center"><Mail className="w-4 h-4 shrink-0 text-primary" /><span>hello@run4health.in</span></div>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center">
        <p className={`${lora.className} text-xs text-muted-foreground`}>
          Made with ❤️ for community health · <a href="/admin/login" className="hover:text-primary underline underline-offset-2">Admin</a>
        </p>
      </div>
    </footer>
  )
}

export default Footer