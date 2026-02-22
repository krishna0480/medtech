
import { useRouter } from "next/router";
import { ROLE_OPTIONS } from "../constants/patient";
import { RoleCard } from "../component/role_card";

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10 space-y-2">
        <div className="mx-auto w-14 h-14 bg-[#00c2cb] rounded-2xl flex items-center justify-center text-white text-2xl shadow-inner">♥</div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome to MediCare Companion</h1>
        <p className="text-slate-500">Your trusted partner in medication management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {ROLE_OPTIONS.map((role) => (
          <RoleCard 
                list={[]} key={role.id}
                {...role}
                onSelect={() => router.push("/dashboard")}          
            />
        ))}
      </div>
    </div>
  );
}