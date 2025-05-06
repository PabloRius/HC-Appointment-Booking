"use client";

import { ArrowLeft, CalendarIcon, Eye, EyeOff, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useProfile";
import { format } from "date-fns";

export default function ProfileSettingsPage() {
  const { profile, refetch } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const [oldPassword, setOldPassword] = useState<string>("");
  const [seeOldPassword, setSeeOldPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [seeNewPassword, setSeeNewPassword] = useState<boolean>(false);

  const [userData, setUserData] = useState({
    id: profile?.id,
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    address: profile?.role === "patient" ? profile?.address || "" : undefined,
    dateOfBirth:
      profile?.role === "patient" ? profile?.dateOfBirth || "" : undefined,
    gender: profile?.gender,
    specialty:
      profile?.role === "doctor" ? profile?.specialty || "" : undefined,
  });

  const handleSave = async () => {
    setIsEditing(false);

    try {
      await fetch("/api/register", {
        method: "PUT",
        body: JSON.stringify(userData),
      });
    } catch {
      console.error("Error updating profile");
    }

    refetch();
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setUserData({
      id: profile?.id,
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.role === "patient" ? profile?.address || "" : undefined,
      dateOfBirth:
        profile?.role === "patient" ? profile?.dateOfBirth || "" : undefined,
      gender: profile?.gender,
      specialty:
        profile?.role === "doctor" ? profile?.specialty || "" : undefined,
    });
  };

  const handleChangePassword = async () => {
    try {
      await fetch("/api/profile/password", {
        method: "PUT",
        body: JSON.stringify({
          id: profile?.id,
          role: profile?.role,
          oldPassword,
          newPassword,
        }),
      });
      setOldPassword("");
      setNewPassword("");
    } catch {
      console.error("Error updating password");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/patient/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="flex w-full flex-row flex-wrap">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details</CardDescription>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={toggleEditMode}
                className={isEditing ? "bg-teal-600 hover:bg-teal-700" : ""}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData({ ...userData, name: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData({ ...userData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    {profile?.role === "patient"
                      ? "Date of Birth"
                      : "Specialty"}
                  </Label>
                  {profile?.role === "patient" ? (
                    <Popover>
                      <PopoverTrigger asChild disabled={!isEditing}>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal"
                        >
                          {userData.dateOfBirth ? (
                            format(userData.dateOfBirth, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={userData.dateOfBirth}
                          onSelect={(e) =>
                            setUserData({ ...userData, dateOfBirth: e })
                          }
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
                  ) : (
                    <Input value={userData.specialty} disabled={true} />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  {isEditing ? (
                    <Select
                      disabled={!isEditing}
                      value={userData.gender}
                      onValueChange={(value) =>
                        setUserData({ ...userData, gender: value })
                      }
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="gender"
                      value={userData.gender}
                      disabled={true}
                    />
                  )}
                </div>

                {profile?.role === "patient" && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={userData.address}
                      onChange={(e) =>
                        setUserData({ ...userData, address: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter>
                <Button
                  onClick={handleSave}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="old-password" className="my-1">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="old-password"
                  type={seeOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setSeeOldPassword(!seeOldPassword)}
                >
                  {seeOldPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {seeOldPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              <Label htmlFor="new-password" className="my-1">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={seeNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setSeeNewPassword(!seeNewPassword)}
                >
                  {seeNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {seeNewPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={handleChangePassword}
              >
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
