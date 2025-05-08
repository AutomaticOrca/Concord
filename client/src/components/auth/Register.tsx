import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { format } from "date-fns";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { register, registerSchema } from "@/lib/api/auth.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext.tsx";
import { cn } from "@/lib/utils.ts";

const Register = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [date, setDate] = useState<Date | undefined>();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      knownAs: "",
      gender: "male",
      dateOfBirth: "",
      city: "",
      country: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      setLoading(true);
      const user = await register(data);
      toast.success(`Welcome, ${user.knownAs}!`);
      setUser(user);
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1B4332] text-center mb-1">
        Create an Account
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Join us and meet new people.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Step 1 */}
          {step === 1 && (
            <>
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
                        placeholder="Enter your username"
                        className="rounded-lg bg-blue-50 border border-blue-100 text-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="knownAs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Known As
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your known name"
                        className="rounded-lg bg-blue-50 border border-blue-100 text-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-lg bg-blue-50 border border-blue-100 text-gray-700">
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="na">Prefer not to say</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Date of Birth
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full rounded-lg bg-blue-50 border border-blue-100 text-left font-normal text-gray-900",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(new Date(field.value), "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[270px] p-3 space-y-3">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            if (selectedDate) {
                              setDate(selectedDate);
                              field.onChange(
                                format(selectedDate, "yyyy-MM-dd")
                              );
                            }
                          }}
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          className="rounded-md border"
                          classNames={{
                            caption_label: "sr-only", // ✅ 隐藏 Month: March / Year: 2025 的文字
                          }}
                          modifiersClassNames={{
                            selected: "bg-[#1B4332] text-white",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your city"
                        className="rounded-lg bg-blue-50 border border-blue-100 text-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your country"
                        className="rounded-lg bg-blue-50 border border-blue-100 text-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="rounded-lg bg-blue-50 border border-blue-100 text-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        className="rounded-lg bg-blue-50 border border-blue-100 text-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Navigation */}
          <div className="pt-2 flex justify-between">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            )}

            {step === 1 ? (
              <Button
                type="button"
                className="ml-auto bg-[#1B4332] hover:bg-[#163D2B] text-white rounded-lg"
                onClick={async () => {
                  const valid = await form.trigger([
                    "username",
                    "knownAs",
                    "gender",
                    "dateOfBirth",
                  ]);
                  if (valid) {
                    setStep(2);
                  }
                }}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                className="ml-auto bg-[#1B4332] hover:bg-[#163D2B] text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Registering..." : "Sign Up"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Register;
