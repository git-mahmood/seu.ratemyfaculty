import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertReview } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useReviews(teacherId: number) {
  return useQuery({
    queryKey: [api.reviews.list.path, teacherId],
    queryFn: async () => {
      const url = buildUrl(api.reviews.list.path, { teacherId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return api.reviews.list.responses[200].parse(await res.json());
    },
    enabled: !!teacherId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertReview, "studentId">) => {
      const res = await fetch(api.reviews.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 409) throw new Error("You have already reviewed this teacher");
        const error = await res.json();
        throw new Error(error.message || "Failed to submit review");
      }
      return api.reviews.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.reviews.list.path, data.teacherId] });
      queryClient.invalidateQueries({ queryKey: [api.teachers.get.path, data.teacherId] }); // Refresh avg/count
      toast({ title: "Review submitted", description: "Thank you for your feedback!" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
