import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function usePyqs(teacherId: number) {
  return useQuery({
    queryKey: [api.pyqs.list.path, teacherId],
    queryFn: async () => {
      const url = buildUrl(api.pyqs.list.path, { teacherId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch PYQs");
      return api.pyqs.list.responses[200].parse(await res.json());
    },
    enabled: !!teacherId,
  });
}

export function useUploadPyq() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ teacherId, formData }: { teacherId: number; formData: FormData }) => {
      // Note: The schema for this is a bit looser because of FormData, handled by controller
      const res = await fetch(api.pyqs.create.path, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload PYQ");
      return api.pyqs.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.pyqs.list.path, data.teacherId] });
      toast({ title: "Upload complete", description: "The past year question paper has been added." });
    },
    onError: (err) => {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    },
  });
}
