import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeacherSchema } from "@shared/schema";
import { type InsertTeacher } from "@shared/routes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BadgeInput } from "./BadgeInput";
import { useCreateTeacher, useUpdateTeacher } from "@/hooks/use-teachers";
import { useState } from "react";
import { PlusCircle, Pencil } from "lucide-react";

interface TeacherFormProps {
  teacher?: { id: number } & InsertTeacher; // For edit mode
  trigger?: React.ReactNode;
}

export function TeacherForm({ teacher, trigger }: TeacherFormProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!teacher;

  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();

  const form = useForm<InsertTeacher>({
    resolver: zodResolver(insertTeacherSchema),
    defaultValues: teacher || {
      fullName: "",
      department: "",
      university: "",
      photoUrl: "",
      coursesTaught: [],
    },
  });

  const onSubmit = async (data: InsertTeacher) => {
    try {
      if (isEditing && teacher) {
        await updateMutation.mutateAsync({ id: teacher.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handled by hook
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Teacher
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Teacher Profile" : "Add New Teacher"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Dr. Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Stanford" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL (Square photo recommended)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input placeholder="https://..." {...field} />
                      {field.value && (
                        <div className="flex justify-center">
                          <div className="h-32 w-32 rounded-xl overflow-hidden border bg-muted">
                            <img 
                              src={field.value} 
                              alt="Preview" 
                              className="h-full w-full object-cover"
                              onError={(e) => (e.currentTarget.src = "")}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coursesTaught"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courses Taught</FormLabel>
                  <FormControl>
                    <BadgeInput 
                      value={field.value || []} 
                      onChange={field.onChange}
                      placeholder="Type course name and press Enter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : (isEditing ? "Update Profile" : "Create Profile")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
