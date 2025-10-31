"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { requestOTP, verifyOTP } from "@/services/authService";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import apiClient from "@/services/apiClient";
// import Link from "next/link";

const Login = () => {
    const [email, setemail] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState("request");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [mailExists, setMailExists] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    useEffect(() => {
        // Redirect if already logged in
        if (localStorage.getItem("token")) {
            navigate("/profile");
        }
    }, [navigate]);

    useEffect(() => {
        const checkMail = async () => {
            const response = await apiClient.post(`/auth/exists`, {
                email: email,
            });
            console.log("checkmail exists ==> ", response);
            setMailExists(response.data.exists);
            // setAgreedToTerms();
        };
        checkMail();
    }, [step]);
    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const sendEmail = await requestOTP({ email });
            console.log("email response ==> ", sendEmail);
            setStep("verify");
            toast.success("OTP sent successfully!");
        } catch (err) {
            toast.error("Failed to request OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("code ==> ", code, " email ==> ", email);
        try {
            await verifyOTP({ email, code });
            toast.success("Login successful!");
            navigate("/profile");
        } catch (err) {
            toast.error("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    console.log("mail exists ==> ", mailExists);

    return (
        <div className="min-h-screen bg-off-white">
            <nav className="bg-[#F4F2EF] backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto  sm:px-6 lg:px-1">
                    <div className="flex justify-between items-center h-16">
                        <Link to={`/`} className="flex items-center space-x-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                                    <span className="text-secondary-foreground font-bold text-sm">
                                        W
                                    </span>
                                </div>
                                <span className="text-xl font-bold">
                                    WeWear
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex min-h-[calc(100vh-4rem)]">
                <div className="hidden lg:flex lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-bamboo/20 to-bamboo/5"></div>
                    <img
                        src="https://www.europeanbusinessreview.com/wp-content/uploads/2018/03/iStock-477420100web.jpg"
                        alt="WeWear Fashion Platform"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                        <h2 className="text-3xl font-bold mb-2">
                            Join the Fashion Revolution
                        </h2>
                        <p className="text-lg opacity-90">
                            Connect, share, and discover amazing fashion content
                        </p>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome to WeWear
                            </h1>
                            <p className="text-gray-600">
                                {step === "request"
                                    ? "Enter your email to get started"
                                    : "Check your email for the verification code"}
                            </p>
                        </div>

                        {step === "request" ? (
                            <form
                                onSubmit={handleRequestOTP}
                                className="space-y-6"
                            >
                                <div className="">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setemail(e.target.value)
                                        }
                                        placeholder="e.g., abcd@gmail.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bamboo focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                                        required
                                    />
                                </div>
                                <div className="">
                                    <Button
                                        variant="outline"
                                        type="submit"
                                        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground cursor-pointer"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Sending...
                                            </span>
                                        ) : (
                                            "Send Verification Code"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <form
                                    onSubmit={handleVerifyOTP}
                                    className="space-y-6"
                                >
                                    <div className="">
                                        <label
                                            htmlFor="code"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Verification Code
                                        </label>
                                        <p className="text-sm text-gray-600 mb-3">
                                            We sent a code to{" "}
                                            <span className="font-medium text-bamboo">
                                                {email}
                                            </span>
                                        </p>
                                        <input
                                            id="code"
                                            type="text"
                                            value={code}
                                            onChange={(e) =>
                                                setCode(e.target.value)
                                            }
                                            placeholder="Enter 6-digit code"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bamboo focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-center text-lg tracking-widest"
                                            required
                                            maxLength={7}
                                        />
                                    </div>

                                    {/* Terms and Conditions Checkbox */}
                                    {mailExists ? (
                                        <></>
                                    ) : (
                                        <>
                                            <div className="flex items-start space-x-3">
                                                <input
                                                    id="terms"
                                                    type="checkbox"
                                                    checked={agreedToTerms}
                                                    onChange={(e) =>
                                                        setAgreedToTerms(
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="mt-1 h-4 w-4 text-bamboo focus:ring-bamboo border-gray-300 rounded cursor-pointer"
                                                    required
                                                />
                                                <label
                                                    htmlFor="terms"
                                                    className="text-sm text-gray-700 cursor-pointer"
                                                >
                                                    I agree to the{" "}
                                                    <a
                                                        href="/terms"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-bamboo hover:text-bamboo/80 underline font-medium"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        Terms and Conditions
                                                    </a>
                                                </label>
                                            </div>
                                        </>
                                    )}

                                    <Button
                                        type="submit"
                                        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground cursor-pointer"
                                        disabled={
                                            loading ||
                                            (!mailExists && !agreedToTerms)
                                        }
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Verifying...
                                            </span>
                                        ) : (
                                            "Verify & Login"
                                        )}
                                    </Button>
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            className=" text-bamboo hover:text-bamboo/80 font-medium transition-colors duration-200 hover:border-b-2 border-b-black cursor-pointer"
                                            onClick={() => setStep("request")}
                                        >
                                            Use a different email
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    to={`/`}
                                    className="text-bamboo hover:text-bamboo/80 font-medium transition-colors duration-200"
                                >
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
