import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <AlertCircle className="h-16 w-16 text-destructive" />
      </div>
      <h1 className="text-4xl font-display font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <Button size="lg">Return Home</Button>
      </Link>
    </div>
  );
}
