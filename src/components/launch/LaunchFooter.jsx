import React from 'react';
import { Link } from 'react-router-dom';

export default function LaunchFooter({ copy }) {
  return <footer className="px-5 md:px-10 py-10 max-w-7xl mx-auto text-launch-soft">
    <div className="flex flex-col sm:flex-row justify-between gap-5"><div><Link to="/home" className="text-launch-paper text-xl font-black">SparkyDollar</Link><p className="text-xs mt-2">© {new Date().getFullYear()} · {copy.footer}</p></div><nav className="flex flex-wrap items-center gap-5 text-sm"><Link to="/privacy" className="py-3 hover:text-launch-paper">{copy.privacy}</Link><Link to="/terms" className="py-3 hover:text-launch-paper">{copy.terms}</Link><Link to="/waitlist" className="py-3 hover:text-launch-paper">{copy.unsubscribe}</Link></nav></div>
    <p className="text-xs leading-relaxed max-w-2xl mt-8 border-t border-launch-mint/20 pt-6">{copy.disclaimer}</p>
  </footer>;
}