import React from 'react'
import {
   Zap,
  Users, Code,
  Github,
  Linkedin,
  Mail
} from 'lucide-react';
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold text-white mb-2">EMR CLUB</h4>
            <p className="text-zinc-500 text-sm">NIT Kurukshetra, Haryana, India</p>
          </div>

          <div className="flex gap-6">
            <a href="https://github.com/EmrNITK" className="text-zinc-400 hover:text-cyan-400 transition-colors"><Github size={20} /></a>
            <a href="https://www.linkedin.com/company/emrclub/" className="text-zinc-400 hover:text-cyan-400 transition-colors"><Linkedin size={20} /></a>
            <a href="mailto:emr@nitkkr.ac.in" className="text-zinc-400 hover:text-cyan-400 transition-colors"><Mail size={20} /></a>
          </div>

          <p className="text-zinc-600 text-xs">
  © {new Date().getFullYear()} EMR Club. Built with React & Tailwind.
</p>

        </div>
      </footer>
  )
}
