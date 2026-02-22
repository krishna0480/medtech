import { cn } from "@/lib/utils";

// Update the opening <aside> tag in sidebar.tsx
export function Sidebar() {
  // ... your existing logic ...

  return (
    <aside className={cn(
      "w-64 border-r bg-white h-screen flex-col p-4",
      "hidden lg:flex" // <--- Add this: Hidden on mobile, flex on desktop (lg)
    )}>
      {/* ... rest of your code ... */}
    </aside>
  );
}