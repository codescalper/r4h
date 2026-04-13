"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bebas_Neue, Lora } from "next/font/google"
import { Heart, Shield, CheckCircle, TrendingUp, DollarSign } from "lucide-react"
import useCountUp from "./use-count-up"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type PageKey = "home" | "about" | "programs" | "news" | "register" | "dashboard" | "donate" | "gallery" | "contact" | "admin"

// ─── PAGE 7: Donations ────────────────────────────────────────────────────────
function DonatePage({ setCurrentPage }: { setCurrentPage: (p: PageKey) => void }) {
  const [amount, setAmount] = useState("")
  const [custom, setCustom] = useState(false)
  const presets = ["₹100","₹500","₹1000","₹5000","Custom"]

  const { count: raised, ref: raisedRef } = useCountUp(1200000, 2000)

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-primary-foreground">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`${bebasNeue.className} text-7xl sm:text-9xl tracking-wider leading-none`}>
            SUPPORT<br />THE MOVEMENT
          </motion.h1>
          <p className={`${lora.className} text-primary-foreground/80 mt-4 max-w-lg text-lg`}>Your contribution directly funds health camps, running kits, and community events across Thane.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <div ref={raisedRef as React.RefObject<HTMLDivElement>} className="mb-8">
            <p className={`${bebasNeue.className} text-5xl tracking-wider text-primary`}>₹{raised.toLocaleString("en-IN")}</p>
            <p className={`${lora.className} text-sm text-muted-foreground mb-2`}>raised of ₹20,00,000 goal</p>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${(1200000/2000000)*100}%` }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }} className="h-full bg-primary rounded-full" />
            </div>
          </div>

          <Card className="border-border">
            <CardContent className="p-6 space-y-5">
              <div>
                <Label className={`${lora.className} font-medium text-sm`}>Select Amount</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {presets.map(p => (
                    <Button key={p} size="sm" variant={amount === p && !custom || (custom && p === "Custom") ? "default" : "outline"}
                      onClick={() => { if (p === "Custom") { setCustom(true); setAmount("") } else { setCustom(false); setAmount(p) } }}
                      className="border-primary/30"
                    >{p}</Button>
                  ))}
                </div>
                {custom && <Input className="mt-2" placeholder="Enter custom amount (₹)" type="number" value={amount} onChange={e => setAmount(e.target.value)} />}
              </div>
              <div><Label>Donor Name</Label><Input className="mt-1" placeholder="Rahul Sharma" /></div>
              <div><Label>Email</Label><Input className="mt-1" placeholder="rahul@email.com" /></div>
              <div><Label>Message (optional)</Label><Textarea className="mt-1 h-20" placeholder="A message of support..." /></div>
              <Button className="w-full gap-2 text-base" size="lg"><Heart className="w-4 h-4" /> Donate Now</Button>
              <p className={`${lora.className} text-xs text-center text-muted-foreground`}>Powered by Razorpay — integration ready</p>
              <div className="flex justify-around pt-2">
                {[
                  { icon: <Shield className="w-4 h-4" />, label: "100% Secure" },
                  { icon: <CheckCircle className="w-4 h-4" />, label: "Tax Exempt 80G" },
                  { icon: <TrendingUp className="w-4 h-4" />, label: "Transparent Usage" },
                ].map(b => (
                  <div key={b.label} className="flex flex-col items-center gap-1 text-primary">
                    {b.icon}
                    <span className={`${lora.className} text-xs text-muted-foreground`}>{b.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact + History */}
        <div className="space-y-6">
          <div>
            <h3 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-4`}>YOUR IMPACT</h3>
            <div className="space-y-3">
              {[
                { amount: "₹500", impact: "funds a runner's full kit — shoes, bib, and hydration pack" },
                { amount: "₹1,000", impact: "sponsors one participant's event entry and timing chip" },
                { amount: "₹5,000", impact: "supports an entire health awareness camp in a Thane colony" },
              ].map(c => (
                <Card key={c.amount} className="border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <span className={`${bebasNeue.className} text-2xl tracking-wider text-primary shrink-0`}>{c.amount}</span>
                    <p className={`${lora.className} text-sm text-muted-foreground`}>{c.impact}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-4`}>RECENT DONATIONS</h3>
            <Card className="border-border overflow-hidden">
              <div className="divide-y divide-border">
                {[
                  { donor: "A generous donor from Mumbai", amount: "₹2,000", time: "2 days ago" },
                  { donor: "A supporter from Thane", amount: "₹500", time: "3 days ago" },
                  { donor: "Anonymous", amount: "₹5,000", time: "5 days ago" },
                  { donor: "A community member from Navi Mumbai", amount: "₹1,000", time: "1 week ago" },
                  { donor: "Anonymous", amount: "₹200", time: "1 week ago" },
                ].map((d, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className={`${lora.className} text-sm font-medium text-foreground`}>{d.donor}</p>
                      <p className={`${lora.className} text-xs text-muted-foreground`}>{d.time}</p>
                    </div>
                    <span className={`${bebasNeue.className} text-lg tracking-wide text-primary`}>{d.amount}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonatePage