import { useState } from "react";
import { login, loginSchema } from "@/lib/api/auth.ts";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useAuth } from "@/context/AuthContext.tsx";

const Login = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      const user = await login(data);
      toast.success(`Welcome back, ${user.knownAs}!`);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1B4332] text-center mb-1">
        Welcome Back
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Sign in to start chatting and connecting.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    className="rounded-lg bg-blue-50 border border-blue-100  text-gray-900 focus:border-[#1B4332] focus:ring-[#1B4332]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="rounded-lg bg-blue-50 border border-blue-100  text-gray-900 focus:border-[#1B4332] focus:ring-[#1B4332]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-[#1B4332] hover:bg-[#163D2B] text-white rounded-lg transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
