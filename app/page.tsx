import ChatBot from '@/components/ChatBot';
import AuthButton from '@/components/AuthButton';
import PillNav from '@/components/PillNav';
import { ContainerTextFlip } from '@/components/ui/container-text-flip';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="text-2xl font-bold text-white tracking-widest flex items-center gap-2">
          🛡️ BLUEFORT
        </div>
        <AuthButton />
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center max-w-5xl mx-auto w-full">
          <h1 className="text-5xl md:text-7xl font-bold text-center text-white mb-6 drop-shadow-2xl">
            Community Cyber Defense
          </h1>
          
          <div className="mb-10">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-white/50 rounded-full px-8 py-2 shadow-lg hover:shadow-xl transition-all hover:bg-white/90 cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <ContainerTextFlip
                 words={["Report threats", "Share knowledge", "Protect the community"]}
                 className="text-lg md:text-xl font-medium text-black bg-transparent shadow-none p-0 tracking-wide"
              />
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="flex justify-center mb-12 relative w-full h-[60px] items-center z-30">
            <PillNav
              items={[
                { label: 'View Reports', href: '/reports' },
                { label: 'Admin Dashboard', href: '/admin' },
                { label: 'Contact Support', href: '/contact' }
              ]}
              baseColor="#1e293b"
              pillColor="#3b82f6"
              pillTextColor="#ffffff"
              hoveredPillTextColor="#ffffff"
            />
          </div>

          {/* ChatBot */}
          <div className="w-full relative z-20">
              <ChatBot />
          </div>

          {/* Emergency Contact */}
          <div className="w-full mt-16 mb-8 relative z-20">
            <div className="bg-red-950/20 backdrop-blur-md border border-red-500/20 rounded-2xl p-8 text-center max-w-2xl mx-auto hover:bg-red-950/30 transition-colors">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Critical Security Incident?</h2>
              <p className="text-neutral-300 mb-8 max-w-md mx-auto">
                If you are detecting an active breach or ransomware attack, do not wait. Our 24/7 rapid response team is standing by.
              </p>
              
              <a 
                href="tel:911" 
                className="group relative inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Special Security Team
                <span className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors"></span>
              </a>
            </div>
          </div>

          {/* Support Section */}
      </div>
    </div>
  );
}
