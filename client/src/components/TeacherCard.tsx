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
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 group border-border/50">
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-muted">
        <img
          src={teacher.photoUrl || "https://images.unsplash.com/photo-1544531320-9854b5098cf4?w=800&auto=format&fit=crop&q=60"} 
          /* academic placeholder image */
          alt={teacher.fullName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-display font-bold text-xl">{teacher.fullName}</h3>
          <div className="flex items-center gap-1.5 text-white/90 text-sm mt-1">
            <Building2 className="h-3.5 w-3.5" />
            <span>{teacher.department}</span>
          </div>
        </div>
      </div>

      <CardContent className="flex-grow pt-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {teacher.university}
            </div>
            <div className="flex items-center text-sm font-medium text-primary gap-1.5">
              <Star className="h-3.5 w-3.5 fill-current" />
              {teacher.reviewCount} Reviews
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Courses Taught</p>
          <div className="flex flex-wrap gap-1.5">
            {teacher.coursesTaught.slice(0, 3).map((course, i) => (
              <Badge key={i} variant="secondary" className="font-normal">
                {course}
              </Badge>
            ))}
            {teacher.coursesTaught.length > 3 && (
              <Badge variant="outline" className="font-normal text-muted-foreground">
                +{teacher.coursesTaught.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/teacher/${teacher.id}`} className="w-full">
          <Button className="w-full gap-2 group-hover:bg-primary/90">
            <BookOpen className="h-4 w-4" />
            View Profile & Reviews
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
