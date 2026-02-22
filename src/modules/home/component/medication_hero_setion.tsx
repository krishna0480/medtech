export function AnalysisHero() {
  return (
    <div className="w-full mb-8">
      {/* Main Gradient Card */}
      <div className="bg-gradient-to-r from-[#3b82f6] via-[#2dd4bf] to-[#22c55e] rounded-[2rem] p-8 text-white shadow-lg">
        <div className="flex items-start gap-4 mb-8">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Good Evening!</h1>
            <p className="text-white/80">Ready to stay on track with your medication?</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Day Streak */}
          <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-6 border border-white/10">
            <div className="text-4xl font-bold mb-1">0</div>
            <div className="text-sm font-medium text-white/90">Day Streak</div>
          </div>

          {/* Today's Status */}
          <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-6 border border-white/10 flex flex-col justify-between">
            <div className="w-6 h-6 rounded-full border-2 border-white/50 mb-2" />
            <div className="text-sm font-medium text-white/90">Today's Status</div>
          </div>

          {/* Monthly Rate */}
          <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-6 border border-white/10">
            <div className="text-4xl font-bold mb-1">0%</div>
            <div className="text-sm font-medium text-white/90">Monthly Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}