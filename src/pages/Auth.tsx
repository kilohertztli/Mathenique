import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GameButton } from "@/components/ui/GameButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DraftingCompass } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          toast.success("Welcome back!");
          navigate("/lessons");
        } else {
          toast.error("Invalid email or password");
        }
      } else {
        if (!name.trim()) {
          toast.error("Please enter your name");
          setIsLoading(false);
          return;
        }
        const success = await register(name, email, password);

        if (success) {
          toast.success("Account created! Log in to start your Mathenique adventure!");
          setIsLogin(true);
        } else {
          toast.error("Email already exists");
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-20">+</div>
        <div className="absolute top-40 right-20 text-6xl opacity-20">×</div>
        <div className="absolute bottom-40 left-20 text-6xl opacity-20">÷</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-20">−</div>
        <div className="absolute top-1/2 left-5 text-4xl opacity-20">π</div>
        <div className="absolute top-1/3 right-1/4 text-4xl opacity-20">∑</div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-4 float">
            <DraftingCompass className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-fredoka font-bold text-foreground">Mathenique</h1>
          <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
            Be skillful. Be Mathenique.
          </p>
        </div>

        {/* Auth Card */}
        <div className="game-card p-6 md:p-8">
          {/* Tab Switcher */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-fredoka font-semibold transition-all ${
                isLogin
                  ? "bg-card text-foreground card-shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-fredoka font-semibold transition-all ${
                !isLogin
                  ? "bg-card text-foreground card-shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold">
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-xl border-2 border-primary/20 focus:border-primary"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-2 border-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-2 border-primary/20 focus:border-primary"
                required
                minLength={6}
              />
            </div>

            <GameButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isLogin ? "Start Playing!" : "Create Account"}
            </GameButton>
          </form>

          {/* Demo Account */}
          <div className="mt-6 pt-6 border-t border-primary/10 text-center">
            <p className="text-sm text-muted-foreground">
              
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
