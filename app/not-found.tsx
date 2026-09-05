import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030405] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
        <Sparkles className="w-8 h-8 text-neutral-400" />
      </div>
      <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase mb-2">
        Error 404 // Dimension Not Found
      </span>
      <h1 className="font-display font-medium text-4xl sm:text-5xl text-white mb-4">
        Transmission Severed
      </h1>
      <p className="max-w-md text-sm text-neutral-400 font-sans mb-8">
        The requested coordinate does not exist or has been relocated within the Zenvitra protocol mesh.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition flex items-center gap-2 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Nexus</span>
      </Link>
    </div>
  );
}
