import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap } from "lucide-react";

export default function AuthPage() {
  const { user, login, register, isLoggingIn, isRegistering } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 p-3 rounded-xl w-fit mb-2">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display">Welcome to UniReviews</CardTitle>
          <CardDescription>
            Join your campus community to review teachers and share resources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onSubmit={login} isLoading={isLoggingIn} />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm onSubmit={register} isLoading={isRegistering} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6 text-sm text-muted-foreground">
          <p>By continuing, you agree to our Terms of Service.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

function LoginForm({ onSubmit, isLoading }: { onSubmit: any, isLoading: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}

function RegisterForm({ onSubmit, isLoading }: { onSubmit: any, isLoading: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-username">Username</Label>
        <Input 
          id="reg-username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          minLength={3}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">Password</Label>
        <Input 
          id="reg-password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          minLength={6}
          required 
        />
      </div>
      {/* 
        Ideally admin role is protected or invited, but for this demo 
        we'll allow selecting it or default to student. 
        Hidden for now to force student, unless you uncomment.
      */}
      {/* 
      <div className="space-y-2">
        <Label>Role</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" checked={role === 'student'} onChange={() => setRole('student')} />
            Student
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" checked={role === 'admin'} onChange={() => setRole('admin')} />
            Admin (Demo)
          </label>
        </div>
      </div> 
      */}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
