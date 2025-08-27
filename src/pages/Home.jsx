import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroVideo from "../../public/images/homePageVideo.mp4";
import HomeNavbar from "../components/layout/HomeNavbar";
import RoadSafetyHome from "../components/Home/RoadSafetyHome";
import * as HomeService from "../api/homeService";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Homepage = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [stats, setStats] = useState(null);
  const [deathStats, setDeathStats] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await HomeService.getStatsForHome();
        setStats(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchDeathStats = async () => {
      try {
        const data = await HomeService.getLatestDeathStats();
        setDeathStats(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDeathStats();
  }, []);

  const onSubmit = async (data) => {
    try {
      await HomeService.sendContactMessage(data);
      toast.success("Message sent successfully!");
      reset({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message: ");
    }
  };

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div>
      <HomeNavbar />
      <div className="font-inter text-gray-800 pt-14">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-12 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                  Report unsafe driving and make Australian roads safer
                </h1>
                <p className="text-xl mb-8 text-indigo-100 md:mr-4">
                  SafeStreet empowers everyday Australians to report at-risk
                  driving behaviours and contribute to safer roads for everyone.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    to="/report"
                    className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-md font-semibold shadow-md text-center transition"
                  >
                    Report an Incident
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-transparent hover:bg-indigo-700 border-2 border-white px-6 py-3 rounded-md font-semibold text-center transition"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <video
                  src={HeroVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg shadow-xl w-full h-full object-cover"
                >
                  <source src={HeroVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>
        {/* How it Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                How SafeStreet Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our platform enables you to report dangerous driving behaviours
                in just a few simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                  <span className="text-indigo-600 text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Observe Incident</h3>
                <p className="text-gray-600">
                  Witness unsafe driving behaviour or an at-risk situation on
                  Australian roads, and optionally capture it with dashcam
                  footage.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                  <span className="text-indigo-600 text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Submit Report</h3>
                <p className="text-gray-600">
                  Enter vehicle registration, incident details, date, time and
                  location through our secure form.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                  <span className="text-indigo-600 text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Data Analysis</h3>
                <p className="text-gray-600">
                  Reports are verified and analysed to identify patterns and
                  high-risk drivers.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                  <span className="text-indigo-600 text-2xl font-bold">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Safety Impact</h3>
                <p className="text-gray-600">
                  Insurance companies access the data for risk assessment,
                  improving road safety for all.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div>
          <RoadSafetyHome deathStats={deathStats} />
        </div>
        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Benefits for Everyone
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                SafeStreet creates value for both everyday users and our
                insurance company partners.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-center pb-4 border-b border-gray-100">
                  For Road Users
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>
                      <span className="font-medium">
                        Contribute to road safety
                      </span>{" "}
                      - Help create safer roads for everyone.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>
                      <span className="font-medium">Earn rewards</span> -
                      Receive $100 AUD for approved media submissions.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>
                      <span className="font-medium">Easy reporting</span> -
                      Simple, user-friendly interface for quick submissions.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>
                      <span className="font-medium">Anonymous reporting</span> -
                      Your personal information remains private.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-center pb-4 border-b border-gray-100">
                  For Insurance Companies
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>
                      <span className="font-medium">
                        Enhanced risk assessment
                      </span>{" "}
                      - Access real-world driver behaviour data.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>
                      <span className="font-medium">Optimised premiums</span> -
                      Adjust pricing based on actual driving behaviours.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>
                      <span className="font-medium">
                        Comprehensive analytics
                      </span>{" "}
                      - Detailed reports and visualisations.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>
                      <span className="font-medium">
                        Streamlined claims processing
                      </span>{" "}
                      – Quickly evaluate reports to support fair and efficient
                      claims decisions.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* Statistics Section */}
        {stats && (
          <section className="py-20 bg-indigo-900 text-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Making Australian Roads Safer
                </h2>
                <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
                  Our platform is driving meaningful change for road safety in
                  Australia.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stats.totalApprovedReports}
                  </div>
                  <div className="text-indigo-200">Reports Submitted</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stats.highRiskDrivers.toLocaleString()}
                  </div>
                  <div className="text-indigo-200">
                    High-Risk Drivers Identified
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stats.insurancePartner}
                  </div>
                  <div className="text-indigo-200">Insurance Partner</div>
                </div>
              </div>
            </div>
          </section>
        )}
        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about SafeStreet.
              </p>
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              <div className="py-6">
                <button
                  onClick={() => toggleQuestion(0)}
                  className="flex justify-between items-center w-full text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    How does SafeStreet verify reports?
                  </h3>
                  <span className="ml-6 flex-shrink-0">
                    {activeQuestion === 0 ? (
                      <svg
                        className="h-6 w-6 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                {activeQuestion === 0 && (
                  <div className="mt-3 text-gray-600">
                    <p>
                      SafeStreet employs a multi-step verification process.
                      First, all reports are reviewed by our team to ensure they
                      contain accurate and complete information. Reports with
                      submitted media undergo an additional review to verify the
                      incident. We also use pattern recognition algorithms to
                      identify consistent behaviours across multiple reports for
                      the same vehicle registration.
                    </p>
                  </div>
                )}
              </div>

              <div className="py-6">
                <button
                  onClick={() => toggleQuestion(1)}
                  className="flex justify-between items-center w-full text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    Is my personal information kept private?
                  </h3>
                  <span className="ml-6 flex-shrink-0">
                    {activeQuestion === 1 ? (
                      <svg
                        className="h-6 w-6 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                {activeQuestion === 1 && (
                  <div className="mt-3 text-gray-600">
                    <p>
                      Yes, SafeStreet takes privacy very seriously. Your
                      personal information is never shared with the reported
                      drivers or made public. When insurance companies access
                      our data, they can only see anonymized report information.
                      All data is handled in accordance with Australian privacy
                      laws and our comprehensive privacy policy.
                    </p>
                  </div>
                )}
              </div>

              <div className="py-6">
                <button
                  onClick={() => toggleQuestion(2)}
                  className="flex justify-between items-center w-full text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    How do I receive payment for my media submissions?
                  </h3>
                  <span className="ml-6 flex-shrink-0">
                    {activeQuestion === 2 ? (
                      <svg
                        className="h-6 w-6 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                {activeQuestion === 2 && (
                  <div className="mt-3 text-gray-600">
                    <p>
                      When an insurance company requests access to your media,
                      you'll receive a notification. Once you approve the
                      request, the $100 AUD payment will be processed through
                      your chosen payment method (PayPal or direct deposit).
                      Payments are typically processed within 3-5 business days
                      after approval.
                    </p>
                  </div>
                )}
              </div>

              <div className="py-6">
                <button
                  onClick={() => toggleQuestion(3)}
                  className="flex justify-between items-center w-full text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    What types of incidents should I report?
                  </h3>
                  <span className="ml-6 flex-shrink-0">
                    {activeQuestion === 3 ? (
                      <svg
                        className="h-6 w-6 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                {activeQuestion === 3 && (
                  <div className="mt-3 text-gray-600">
                    <p>
                      SafeStreet is designed for reporting unsafe driving
                      behaviours such as speeding, running red lights, reckless
                      driving, tailgating, and other dangerous actions. For
                      emergencies or serious traffic incidents, always contact
                      emergency services (000) first. Our platform is not
                      intended for reporting parking violations or minor
                      infractions.
                    </p>
                  </div>
                )}
              </div>

              <div className="py-6">
                <button
                  onClick={() => toggleQuestion(4)}
                  className="flex justify-between items-center w-full text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    How can insurance companies access SafeStreet data?
                  </h3>
                  <span className="ml-6 flex-shrink-0">
                    {activeQuestion === 4 ? (
                      <svg
                        className="h-6 w-6 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-6 w-6 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                {activeQuestion === 4 && (
                  <div className="mt-3 text-gray-600">
                    <p>
                      Insurance companies can sign up for client accounts
                      through our website. After verification, they gain access
                      to our client portal where they can search for specific
                      vehicle registrations, view report histories, analyse risk
                      patterns, and request access to media evidence. Different
                      subscription levels are available based on data access
                      needs.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Contact Us
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Have questions about SafeStreet? We're here to help.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-indigo-100 w-10 h-10 flex items-center justify-center rounded-lg">
                      <svg
                        className="w-5 h-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name and Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Smith"
                          {...register("name", {
                            required: "Name is required",
                          })}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <Alert variant="destructive">
                            <AlertDescription className="text-sm">
                              {errors.name.message}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Invalid email format",
                            },
                          })}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <Alert variant="destructive">
                            <AlertDescription className="text-sm">
                              {errors.email.message}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Controller
                        name="subject"
                        control={control}
                        rules={{ required: "Subject is required" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              className={errors.subject ? "border-red-500" : ""}
                            >
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">
                                General Inquiry
                              </SelectItem>
                              <SelectItem value="support">
                                Technical Support
                              </SelectItem>
                              <SelectItem value="partnership">
                                Insurance Partnership
                              </SelectItem>
                              <SelectItem value="media">
                                Media & Press
                              </SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.subject && (
                        <Alert variant="destructive">
                          <AlertDescription className="text-sm">
                            {errors.subject.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder="Tell us how we can help you..."
                        {...register("message", {
                          required: "Message is required",
                        })}
                        className={errors.message ? "border-red-500" : ""}
                      />
                      {errors.message && (
                        <Alert variant="destructive">
                          <AlertDescription className="text-sm">
                            {errors.message.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                        size="lg"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <p className="text-gray-400 text-sm text-center">
            © 2025 SafeStreet.com.au. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Homepage;
