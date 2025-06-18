import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginsvg from "../assets/171039916_10662446-removebg-preview.png";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import apiClient, { fetchAndSavePortfolioData, fetchAndSaveUserData } from "@/lib/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Client", // default to Client
  });

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ ...formData, role: "Client" }); // reset role on toggle
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/Auth/login", {
        emailAddress: formData.email,
        password: formData.password,
      });
      console.log("Login successful:", res.data);
  
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("role", res.data.user.role);
  
      // Fetch and save full user data
      await fetchAndSaveUserData();
  
      // If user is a Tailor, fetch and save portfolio data
      if (res.data.user.role === "Tailor") {
        await fetchAndSavePortfolioData();
      }
  
      alert("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const validRoles = ["Tailor", "Client"];
    const selectedRole = formData.role;

    if (!validRoles.includes(selectedRole)) {
      alert("Please select a valid role.");
      return;
    }

    try {
      const res = await apiClient.post("/Auth/register", {
        firstName: formData.firstName.trim() || "User",
        lastName: formData.lastName.trim() || "Default",
        emailAddress: formData.email,
        password: formData.password,
        role: selectedRole,
      });
      console.log("Registration successful:", res.data);
      alert("Registration successful!");
      toggleForm(); // switch back to login
    } catch (error: any) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 border-0 items-center", className)} {...props}>
      <Card className="overflow-hidden p-0 border-0 w-full">
        <CardContent className="grid w-[50rem] mr-16 p-0 md:grid-cols-2">
          {/* Login or Signup Form */}
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="p-6 w-full md:p-8"
          >
            <div className="flex flex-col gap-6">
              {/* Title */}
              {isLogin ? (
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your Acme Inc account
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Create your account</h1>
                  <p className="text-muted-foreground text-balance">
                    Sign up to get started with Acme Inc
                  </p>
                </div>
              )}

              {/* Email Field */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required onChange={handleChange} />
              </div>

              {/* Password Field */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required onChange={handleChange} />
              </div>

              {/* Role, First Name & Last Name (only in signup) */}
              {!isLogin && (
                <>
                  {/* First Name */}
                  <div className="grid gap-3">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" type="text" placeholder="John" required onChange={handleChange} />
                  </div>

                  {/* Last Name */}
                  <div className="grid gap-3">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" type="text" placeholder="Doe" required onChange={handleChange} />
                  </div>

                  {/* Role Selection */}
                  <div className="grid gap-3">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={handleRoleChange}
                      className="border border-input bg-background px-3 py-2 rounded-md text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Tailor">Tailor</option>
                      <option value="Client">Client</option>
                    </select>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                {isLogin ? "Login" : "Sign up"}
              </Button>

              {/* Social Buttons */}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" className="w-full flex justify-center items-center">
                  <FaApple size={20} />
                </Button>
                <Button variant="outline" type="button" className="w-full flex justify-center items-center">
                  <FaGoogle size={20} />
                </Button>
                <Button variant="outline" type="button" className="w-full flex justify-center items-center">
                  <FaFacebookF size={20} />
                </Button>
              </div>

              {/* Toggle Link */}
              <div className="text-center text-sm">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="underline underline-offset-4 text-blue-600 hover:text-blue-800"
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.form>

          {/* Background Image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src={loginsvg}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer Text */}
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}