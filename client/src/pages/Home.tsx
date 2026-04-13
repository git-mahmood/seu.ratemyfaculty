import { useState } from "react";
import { useTeachers } from "@/hooks/use-teachers";
import { Navbar } from "@/components/Navbar";
import { TeacherCard } from "@/components/TeacherCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  const { data: teachers, isLoading, error } = useTeachers();
  const [search, setSearch] = useState("");

  const filteredTeachers = teachers?.filter(t => 
    t.fullName.toLowerCase().includes(search.toLowerCase()) || 
    t.department.toLowerCase().includes(search.toLowerCase()) ||
    t.university.toLowerCase().includes(search.toLowerCase())
  );

  return (
    /* Sci-fi Theme: Dark base, subtle radial gradient, and grid pattern */
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30">
      {/* Background Overlay for Grid Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-cyan-400 to-blue-600 pb-2">
              FACULTY DATABASE // TERMINAL
            </h1>
            <p className="text-lg text-slate-400 font-mono">
              Accessing encrypted peer reviews and academic records...
            </p>
            
            <div className="relative max-w-xl mx-auto mt-8">
              <div className="absolute -inset-1 bg-cyan-500/20 blur-xl rounded-full" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 h-5 w-5 z-10" />
              <Input 
                placeholder="Query system by name, dept, or uni..." 
                className="relative z-10 pl-12 py-6 text-lg rounded-full bg-slate-900/80 border-cyan-500/30 text-cyan-50 focus-visible:ring-cyan-500/50 backdrop-blur-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/5] rounded-xl bg-slate-800/50 animate-pulse border border-slate-700/50" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-400 font-mono">
              <h2 className="text-2xl font-bold uppercase tracking-widest">Critical System Error</h2>
              <p>Unable to retrieve faculty data packets.</p>
            </div>
          ) : filteredTeachers?.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-mono">
              <h2 className="text-xl font-medium">No matches found in database</h2>
              <p>Adjust search parameters and retry.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {filteredTeachers?.map((teacher) => (
                <div key={teacher.id} className="transition-transform hover:scale-[1.02]">
                  <TeacherCard teacher={teacher} />
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer Section */}
        <footer className="py-8 border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-500 text-xs tracking-[0.2em] uppercase font-mono">
              Engineered with ⚡ by <span className="text-cyan-400 font-bold">Mahmud</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
