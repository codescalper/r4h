"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bebas_Neue, Lora } from "next/font/google"
import { CheckCircle, MapPin, Phone, Mail } from "lucide-react"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

// ─── PAGE 9: Contact ──────────────────────────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-16">
        {/* Left */}
        <div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`${bebasNeue.className} text-7xl sm:text-8xl tracking-wider text-foreground mb-10`}>
            GET IN<br /><span className="text-primary">TOUCH</span>
          </motion.h1>
          <div className={`${lora.className} space-y-5 text-muted-foreground`}>
            <div className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div><p className="font-medium text-foreground">Address</p><p className="text-sm mt-0.5">Run4Health Community Center, Thane West, Maharashtra — 400601</p></div>
            </div>
            <div className="flex gap-3 items-center">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <div><p className="font-medium text-foreground">Phone</p><p className="text-sm">+91 98765 43210</p></div>
            </div>
            <div className="flex gap-3 items-center">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <div><p className="font-medium text-foreground">Email</p><p className="text-sm">hello@run4health.in</p></div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-8 h-56 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border flex flex-col items-center justify-center gap-2">
            <MapPin className="w-8 h-8 text-primary/40" />
            <p className={`${lora.className} text-sm text-muted-foreground`}>Thane, Maharashtra</p>
          </div>
        </div>

        {/* Right — Form */}
        <div>
          <Card className="border-border">
            <CardContent className="p-7">
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 py-12">
                  <CheckCircle className="w-12 h-12 text-primary" />
                  <p className={`${bebasNeue.className} text-3xl tracking-wide text-foreground`}>MESSAGE SENT!</p>
                  <p className={`${lora.className} text-sm text-muted-foreground text-center`}>We'll respond within 24 hours.</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-2`}>SEND A MESSAGE</h2>
                  <div><Label>Name</Label><Input className="mt-1" placeholder="Rahul Sharma" /></div>
                  <div><Label>Email</Label><Input className="mt-1" placeholder="rahul@email.com" /></div>
                  <div>
                    <Label>Subject</Label>
                    <Select>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>
                        {["General Inquiry","Event Registration","Donation","Media","Partnership"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Message</Label><Textarea className="mt-1 h-28" placeholder="Tell us how we can help..." /></div>
                  <Button className="w-full gap-2" onClick={() => setSent(true)}><Mail className="w-4 h-4" /> Send Message</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContactPage