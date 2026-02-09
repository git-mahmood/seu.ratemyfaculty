import { Link } from "wouter";
import { type TeacherWithReviewCount } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Building2, BookOpen } from "lucide-react";

interface TeacherCardProps {
  teacher: TeacherWithReviewCount;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 group border-border/50 overflow-hidden">
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <img
          src={teacher.photoUrl || "https://images.unsplash.com/photo-1544531320-9854b5098cf4?w=800&auto=format&fit=crop&q=60"} 
          /* academic placeholder image */
          alt={teacher.fullName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="font-display font-bold text-sm md:text-base leading-tight truncate text-white">{teacher.fullName}</h3>
          <div className="flex items-center gap-1 text-white/90 text-[10px] md:text-xs mt-0.5">
            <Building2 className="h-3 w-3 shrink-0" />
            <span className="truncate text-white/90">{teacher.department}</span>
          </div>
        </div>
      </div>

      <CardContent className="flex-grow p-2 md:p-3 space-y-2 md:space-y-3">
        <div className="flex items-start justify-between gap-1">
          <div className="space-y-0.5 md:space-y-1 min-w-0">
            <div className="flex items-center text-[10px] md:text-xs text-muted-foreground gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{teacher.university}</span>
            </div>
            <div className="flex items-center text-[10px] md:text-xs font-medium text-primary gap-1">
              <Star className="h-3 w-3 fill-current shrink-0" />
              {teacher.reviewCount} Reviews
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Courses</p>
          <div className="flex flex-wrap gap-1">
            {teacher.coursesTaught.slice(0, 2).map((course, i) => (
              <Badge key={i} variant="secondary" className="font-normal text-[10px] px-1.5 py-0 h-4">
                {course}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-2 md:p-3 pt-0">
        <Link href={`/teacher/${teacher.id}`} className="w-full">
          <Button size="sm" className="w-full gap-1.5 text-xs h-8">
            <BookOpen className="h-3.5 w-3.5" />
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
