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
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-base md:text-lg leading-tight truncate text-white">{teacher.fullName}</h3>
          <div className="flex items-center gap-1.5 text-white/90 text-xs md:text-sm mt-1">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate text-white/90">{teacher.department}</span>
          </div>
        </div>
      </div>

      <CardContent className="flex-grow p-3 md:p-4 space-y-3 md:space-y-4">
        <div className="flex items-start justify-between gap-1.5">
          <div className="space-y-1 md:space-y-1.5 min-w-0">
            <div className="flex items-center text-xs md:text-sm text-muted-foreground gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{teacher.university}</span>
            </div>
            <div className="flex items-center text-xs md:text-sm font-medium text-primary gap-1.5">
              <Star className="h-3.5 w-3.5 fill-current shrink-0" />
              {teacher.reviewCount} Reviews
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Courses</p>
          <div className="flex flex-wrap gap-1.5">
            {teacher.coursesTaught.slice(0, 2).map((course, i) => (
              <Badge key={i} variant="secondary" className="font-normal text-xs px-2 py-0.5 h-5">
                {course}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 md:p-4 pt-0">
        <Link href={`/teacher/${teacher.id}`} className="w-full">
          <Button size="default" className="w-full gap-2 text-sm h-9">
            <BookOpen className="h-4 w-4" />
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
