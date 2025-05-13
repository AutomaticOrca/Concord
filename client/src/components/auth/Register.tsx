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

// 拆分schema
const step1Schema = registerSchema.pick({
  username: true,
  knownAs: true,
  gender: true,
  dateOfBirth: true,
});
const step2Schema = registerSchema.pick({
  city: true,
  country: true,
  email: true,
  password: true,
});

type Step1Type = z.infer<typeof step1Schema>;
type Step2Type = z.infer<typeof step2Schema>;

const Register = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [date, setDate] = useState<Date | undefined>();
  const [step1Data, setStep1Data] = useState<Step1Type | null>(null);

  const form1 = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      username: "",
      knownAs: "",
      gender: "male",
      dateOfBirth: "",
    },
    mode: "onBlur",
  });
  const form2 = useForm<Step2Type>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      city: "",
      country: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  // 合并数据并提交
  const onSubmit = async (data2: Step2Type) => {
    if (!step1Data) return;
    try {
      setLoading(true);
      const allData = { ...step1Data, ...data2 };
      const user = await register(allData);
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

      {step === 1 && (
        <Form {...form1}>
          <form
            onSubmit={form1.handleSubmit((data) => {
              setStep1Data(data);
              setStep(2);
            })}
            className="space-y-4"
          >
            <FormField
              control={form1.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    Username <span className="text-red-500">*</span>
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
              control={form1.control}
              name="knownAs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    Known As <span className="text-red-500">*</span>
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
              control={form1.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    Gender <span className="text-red-500">*</span>
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
              control={form1.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
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
                            field.onChange(format(selectedDate, "yyyy-MM-dd"));
                          }
                        }}
                        captionLayout="dropdown"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        className="rounded-md border"
                        classNames={{
                          caption_label: "sr-only",
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
            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                className="ml-auto bg-[#1B4332] hover:bg-[#163D2B] text-white rounded-lg"
              >
                Next Step
              </Button>
            </div>
          </form>
        </Form>
      )}

      {step === 2 && (
        <Form {...form2}>
          <form onSubmit={form2.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form2.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    City <span className="text-red-500">*</span>
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
              control={form2.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    Country <span className="text-red-500">*</span>
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
              control={form2.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    Email <span className="text-red-500">*</span>
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
              control={form2.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-700">
                    Password <span className="text-red-500">*</span>
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
            <div className="pt-2 flex justify-between">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="ml-auto bg-[#1B4332] hover:bg-[#163D2B] text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Registering..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default Register;
