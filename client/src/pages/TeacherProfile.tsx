import { useState } from "react";
import { useRoute } from "wouter";
import { useTeacher } from "@/hooks/use-teachers";
import { useReviews } from "@/hooks/use-reviews";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { ReviewForm } from "@/components/ReviewForm";
import { PyqList, UploadPyqDialog } from "@/components/PyqList";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  MapPin, 
  BookOpen, 
  User, 
  Smile, 
  Frown, 
  Meh,
  GraduationCap,
  Pencil,
  Trash2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function TeacherProfile() {
  const [, params] = useRoute("/teacher/:id");
  const teacherId = parseInt(params?.id || "0");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [pyqDialogOpen, setPyqDialogOpen] = useState(false);
  
  const { data: teacher, isLoading: teacherLoading, error: teacherError } = useTeacher(teacherId);
  const { data: reviews, isLoading: reviewsLoading } = useReviews(teacherId);

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(buildUrl(api.reviews.delete.path, { id }), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reviews.list.path, teacherId] });
      toast({ title: "Review deleted" });
    },
  });

  if (teacherLoading) return <ProfileSkeleton />;
  if (teacherError || !teacher) return <div className="text-center py-20">Teacher not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-primary/10 border-b relative">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden shadow-xl border-4 border-background shrink-0 aspect-square">
              <img 
                src={teacher.photoUrl} 
                alt={teacher.fullName} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-3 flex-1">
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2 drop-shadow-md">
                  {teacher.fullName}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {teacher.department}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {teacher.university}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {teacher.coursesTaught.map((course, i) => (
                  <Badge key={i} variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {course}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <ReviewForm 
                teacherId={teacherId} 
                teacherName={teacher.fullName} 
                coursesTaught={teacher.coursesTaught}
              />
              {!!user && (user.role === "admin" || user.role === "moderator" || user.email === "2025100000379@seu.edu.bd") && (
                <UploadPyqDialog 
                  teacherId={teacherId} 
                  open={pyqDialogOpen} 
                  onOpenChange={setPyqDialogOpen} 
                />
              )}
            </div>
          </div>
        </div>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40 z-0" />
      </div>

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        {/* Main Column: Reviews */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Student Reviews</h2>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              {teacher.reviewCount} Total
            </Badge>
          </div>

          {reviewsLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
            </div>
          ) : reviews?.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/30">
              <p className="text-muted-foreground mb-4">No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews?.map((review) => {
                const isAdmin = user?.email === "2025100000379@seu.edu.bd";
                const isOwner = user?.id === review.studentId;
                
                return (
                  <div key={review.id} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {isAdmin ? review.studentUsername : "Anonymous Student"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOwner && (
                          <ReviewForm 
                            teacherId={teacher.id}
                            teacherName={teacher.fullName}
                            coursesTaught={teacher.coursesTaught}
                            review={review}
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                        )}
                        {(isOwner || isAdmin) && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this review?")) {
                                deleteReviewMutation.mutate(review.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        {getPersonalityIcon(review.personality)}
                      </div>
                    </div>

                    <p className="text-foreground/90 leading-relaxed mb-6">
                      "{review.comment}"
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
                      <Metric label="Course" value={review.courseTaken} />
                      <Metric label="Personality" value={review.personality} />
                      <Metric label="Best For" value={review.bestFor} />
                      <Metric label="Marking" value={review.markingStyle} />
                      <Metric label="Difficulty" value={review.questionDifficulty} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar: PYQs */}
        <div className="space-y-6">
          <PyqList teacherId={teacher.id} />
          
          {/* Ad Placeholder or additional info could go here */}
          <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h3 className="font-bold text-primary">Pro Tip</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Always check the syllabus along with past year questions to ensure you're studying relevant topics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}

function getPersonalityIcon(type: string) {
  switch (type) {
    case 'Friendly': return <Smile className="h-5 w-5 text-green-500" />;
    case 'Strict': return <Frown className="h-5 w-5 text-red-500" />;
    default: return <Meh className="h-5 w-5 text-yellow-500" />;
  }
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex gap-8">
            <Skeleton className="h-40 w-40 rounded-2xl" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-60 w-full" />
      </div>
    </div>
  );
}
