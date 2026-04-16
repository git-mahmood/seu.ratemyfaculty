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
    mutationFn: async ({ teacherId, data }: { teacherId: number; data: any }) => {
  const res = await fetch(api.pyqs.create.path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to upload PYQ");
  }
  return api.pyqs.create.responses[201].parse(await res.json());
},
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.pyqs.list.path, data.teacherId] });
      toast({ title: "Success!", description: "PYQ has been added successfully." });
    },
    onError: (err) => {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    },
  });
}
export function useUpdatePyq() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, teacherId, data }: { id: number; teacherId: number; data: any }) => {
      const res = await fetch(`/api/pyqs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update PYQ");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.pyqs.list.path, data.teacherId] });
      toast({ title: "Updated!", description: "PYQ has been updated successfully." });
    },
    onError: (err: Error) => {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });
}

