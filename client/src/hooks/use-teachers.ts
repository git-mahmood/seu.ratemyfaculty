import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertTeacher } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useTeachers() {
  return useQuery({
    queryKey: [api.teachers.list.path],
    queryFn: async () => {
      const res = await fetch(api.teachers.list.path);
      if (!res.ok) throw new Error("Failed to fetch teachers");
      return api.teachers.list.responses[200].parse(await res.json());
    },
  });
}

export function useTeacher(id: number) {
  return useQuery({
    queryKey: [api.teachers.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.teachers.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch teacher details");
      return api.teachers.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertTeacher) => {
      const res = await fetch(api.teachers.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create teacher");
      return api.teachers.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.teachers.list.path] });
      toast({ title: "Success", description: "Teacher profile created" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertTeacher>) => {
      const url = buildUrl(api.teachers.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update teacher");
      return api.teachers.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.teachers.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.teachers.get.path, data.id] });
      toast({ title: "Success", description: "Teacher profile updated" });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
