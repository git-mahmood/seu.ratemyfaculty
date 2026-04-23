import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Card, CardContent } from "@/components/ui/card";
import { Terminal } from "lucide-react";

export default function AuthPage() {
  const { user, googleLoginMutation } = useAuth();

  if (user) return <Redirect to="/" />;

  return (
    <GoogleOAuthProvider clientId="1016292843361-dfg016gmdq929kaksd71o7pqkv39hlen.apps.googleusercontent.com">
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-zinc-950 text-zinc-100 font-mono">
        <div className="flex flex-col justify-center items-center p-8 border-r border-zinc-800">
          <div className="w-full max-w-md space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <Terminal className="h-8 w-8 text-green-500" />
              <h1 className="text-2xl font-bold tracking-tighter">KAIZEN_AUTH_v1.0</h1>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                  [SYSTEM]: Unauthorized access detected. Please verify your 
                  identity using your official SEU student credentials.
                </p>
                
                <div className="flex justify-center py-4 bg-zinc-800/50 rounded-lg border border-dashed border-zinc-700">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      googleLoginMutation.mutate(credentialResponse.credential);
                    }}
                    onError={() => console.log('Login Failed')}
                    theme="filled_black"
                    shape="square"
                    text="continue_with"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="hidden md:flex flex-col justify-center p-12 bg-zinc-900/30">
          <h2 className="text-4xl font-bold mb-4 text-green-500">Rate My Faculty</h2>
          <p className="text-zinc-400 text-lg max-w-lg">
            A secure, anonymous community for Southeast University students to share 
            feedback and improve academic quality.
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
