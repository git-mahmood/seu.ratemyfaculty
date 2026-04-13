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
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 pb-2">
            Rate My Faculty
          </h1>
          <p className="text-lg text-muted-foreground">
            Honest reviews, past year questions, and comprehensive profiles for university students.
          </p>
          
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search by name, department, or university..." 
              className="pl-12 py-6 text-lg rounded-full shadow-lg shadow-primary/5 border-primary/20 focus-visible:ring-primary/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[4/5] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">
            <h2 className="text-2xl font-bold">Failed to load teachers</h2>
            <p>Please try again later.</p>
          </div>
        ) : filteredTeachers?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <h2 className="text-xl font-medium">No teachers found</h2>
            <p>Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {filteredTeachers?.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          Engineered with ⚡ by <span className="font-semibold text-foreground">Mahmud</span>
        </div>
      </footer>
    </div>
  );
}
