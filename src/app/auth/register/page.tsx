"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "FR" },
  { code: "+49", country: "DE" },
  { code: "+34", country: "ES" },
  { code: "+39", country: "IT" },
  { code: "+81", country: "JP" },
  { code: "+86", country: "CN" },
  { code: "+91", country: "IN" },
  { code: "+55", country: "BR" },
  { code: "+52", country: "MX" },
  { code: "+61", country: "AU" },
] as const;

type FormValues = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      nationalId: "",
      password: "",
      name: "",
      email: "",
      phone: {
        prefix: "+1",
        number: "",
      },
      dateOfBirth: new Date("2000-01-01"),
      gender: "male",
      address: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          type FormFieldNames = keyof FormValues;
          type FormErrors = Partial<Record<FormFieldNames, string>>;
          const errors = data.errors as FormErrors;

          Object.entries(errors).forEach(([field, message]) => {
            if (field in values && typeof message === "string") {
              form.setError(field as FormFieldNames, {
                type: "manual",
                message,
              });
            }
          });
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Registration failed");
        }
        return;
      }

      router.push("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Disable submit button when form is invalid
  const isFormValid = form.formState.isValid && !isLoading;

  return (
    <div className="w-full flex flex-col items-center justify-center py-10">
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-2 text-sm font-medium md:left-8 md:top-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Register as a patient to book appointments with doctors
          </p>
        </div>

        <Card>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate // Prevent browser validation
            >
              <CardHeader>
                <CardTitle>Patient Registration</CardTitle>
                <CardDescription>
                  Fill in your details to create a patient account
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          aria-invalid={fieldState.invalid}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* National ID Field */}
                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>National ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456789"
                          {...field}
                          aria-invalid={fieldState.invalid}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                          aria-invalid={fieldState.invalid}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Field */}
                <div className="flex flex-col space-y-2">
                  <FormLabel>Phone Number</FormLabel>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="phone.prefix"
                      render={({ field, fieldState }) => (
                        <FormItem className="w-[120px]">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger aria-invalid={fieldState.invalid}>
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countryCodes.map((country) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.code}
                                >
                                  {country.code} {country.country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone.number"
                      render={({ field, fieldState }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="123-456-7890"
                              {...field}
                              aria-invalid={fieldState.invalid}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Date of Birth Field */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                                fieldState.invalid && "border-destructive"
                              )}
                              aria-invalid={fieldState.invalid}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            captionLayout="dropdown-buttons"
                            fromYear={1920}
                            toYear={new Date().getFullYear()}
                            classNames={{
                              day_hidden: "invisible",
                              dropdown:
                                "px-0 py-1.5 rounded-md bg-popover text-popover-foreground text-sm  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                              caption_dropdowns: "flex gap-3",
                              vhidden: "hidden",
                              caption_label: "hidden",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender Field */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address Field */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your full address"
                          className="min-h-[80px]"
                          {...field}
                          aria-invalid={fieldState.invalid}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            aria-invalid={fieldState.invalid}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                {error && (
                  <p className="text-sm font-medium text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-teal-600 hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
