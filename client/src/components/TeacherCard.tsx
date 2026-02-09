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
        <div className="absolute bottom-1.5 left-1.5 right-1.5">
          <h3 className="font-display font-bold text-xs md:text-sm leading-tight truncate text-white">{teacher.fullName}</h3>
          <div className="flex items-center gap-1 text-white/90 text-[9px] md:text-[10px] mt-0.5">
            <Building2 className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate text-white/90">{teacher.department}</span>
          </div>
        </div>
      </div>

      <CardContent className="flex-grow p-1.5 md:p-2 space-y-1.5 md:space-y-2">
        <div className="flex items-start justify-between gap-1">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center text-[9px] md:text-[10px] text-muted-foreground gap-1">
              <MapPin className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate">{teacher.university}</span>
            </div>
            <div className="flex items-center text-[9px] md:text-[10px] font-medium text-primary gap-1">
              <Star className="h-2.5 w-2.5 fill-current shrink-0" />
              {teacher.reviewCount} Reviews
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <div className="flex flex-wrap gap-0.5">
            {teacher.coursesTaught.slice(0, 1).map((course, i) => (
              <Badge key={i} variant="secondary" className="font-normal text-[8px] px-1 py-0 h-3.5">
                {course}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-1.5 md:p-2 pt-0">
        <Link href={`/teacher/${teacher.id}`} className="w-full">
          <Button size="sm" className="w-full gap-1 text-[10px] h-7 px-2">
            <BookOpen className="h-3 w-3" />
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
