// src/components/dashboard/PatientHero.tsx
export function PatientHero({ stats }: { stats: any[] }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 rounded-3xl p-8 text-white shadow-lg">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">👤</div>
        <div>
          <h1 className="text-3xl font-bold">Good Evening!</h1>
          <p className="text-blue-50">Ready to stay on track with your medication?</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-widest opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}