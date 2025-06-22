import { MoveRight } from "lucide-react"

export function HeroSection() {
  return (
    <div className="w-full bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
            DeepFake Detective
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            Advanced AI-powered deepfake detection at your fingertips
          </p>
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex items-center space-x-1 text-sm text-slate-400">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Powered by AI</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-slate-400">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>99.8% Accuracy</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-slate-400">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Real-time Detection</span>
            </div>
          </div>
          <a 
            href="#detection"
            className="inline-flex items-center justify-center group transition-all duration-300"
          >
            <span className="px-6 py-3 rounded-full bg-white text-slate-900 font-medium flex items-center gap-2 hover:gap-3 transition-all duration-300">
              Start Detection <MoveRight className="w-4 h-4 animate-pulse" />
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}