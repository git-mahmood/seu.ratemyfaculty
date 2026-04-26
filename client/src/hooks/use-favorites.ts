import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useIsFavorite(teacherId: number) {
  return useQuery({
    queryKey: ["favorite-check", teacherId],
    queryFn: async () => {
      const res = await fetch(`/api/favorites/${teacherId}/check`);
      if (!res.ok) return { isFavorite: false };
      return res.json();
    },
    enabled: !!teacherId,
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites");
      if (!res.ok) return [];
      return res.json();
    },
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (teacherId: number) => {
      const res = await fetch(`/api/favorites/${teacherId}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to add favorite");
      return res.json();
    },
    onSuccess: (_, teacherId) => {
      queryClient.invalidateQueries({ queryKey: ["favorite-check", teacherId] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({
        title: "Added to Favorites! ❤️",
        description: "See your list in the menu → My Favorites",
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add to favorites", variant: "destructive" });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (teacherId: number) => {
      const res = await fetch(`/api/favorites/${teacherId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove favorite");
    },
    onSuccess: (_, teacherId) => {
      queryClient.invalidateQueries({ queryKey: ["favorite-check", teacherId] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({ title: "Removed from Favorites" });
    },
  });
}
