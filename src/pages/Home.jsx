import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeroVideo from "../../public/images/homePageVideo.mp4";
import HomeNavbar from "../components/layout/HomeNavbar";
import RoadSafetyHome from "../components/Home/RoadSafetyHome";

const Homepage = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);

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
                <p className="text-xl mb-8 text-indigo-100">
                  SafeStreet empowers everyday Australians to report at-risk
                  driving behaviors and contribute to safer roads for everyone.
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
                Our platform enables you to report dangerous driving behaviors
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
                  Witness unsafe driving behavior or an at-risk situation on
                  Australian roads.
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
                  Reports are verified and analyzed to identify patterns and
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
          <RoadSafetyHome />
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
                      - Access real-world driver behavior data.
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
                      <span className="font-medium">Optimized premiums</span> -
                      Adjust pricing based on actual driving behaviors.
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
                      - Detailed reports and visualizations.
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
                      <span className="font-medium">Media evidence</span> -
                      Access to verified incident media for $139 AUD.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  10,000+
                </div>
                <div className="text-indigo-200">Reports Submitted</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  2,500+
                </div>
                <div className="text-indigo-200">
                  High-Risk Drivers Identified
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
                <div className="text-indigo-200">Insurance Partners</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">8%</div>
                <div className="text-indigo-200">Road Incident Reduction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                What People Are Saying
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hear from our users and insurance partners about the impact of
                SafeStreet.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-indigo-600 font-bold">JS</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">John Smith</h4>
                    <p className="text-gray-500 text-sm">Sydney, NSW</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "I witnessed a driver weaving dangerously through traffic and
                  was able to report it through SafeStreet. The process was
                  incredibly easy, and I felt like I was really making a
                  difference."
                </p>
                <div className="flex text-yellow-400 mt-4">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-indigo-600 font-bold">MJ</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Mark Johnson</h4>
                    <p className="text-gray-500 text-sm">Insurance Partner</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The data provided by SafeStreet has transformed our risk
                  assessment process. We're now able to set premiums based on
                  actual driver behavior rather than just demographics and
                  claims history."
                </p>
                <div className="flex text-yellow-400 mt-4">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <span className="text-indigo-600 font-bold">SW</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Wilson</h4>
                    <p className="text-gray-500 text-sm">Melbourne, VIC</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "I reported a driver who ran a red light, and the process was
                  so straightforward. I even received a reward when my dashcam
                  footage was approved. It feels good to contribute to safer
                  roads."
                </p>
                <div className="flex text-yellow-400 mt-4">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="py-16 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to make Australian roads safer?
            </h2>
            <p className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
              Join thousands of Australians who are already contributing to
              safer roads. Sign up today or report an incident.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/report"
                className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-3 rounded-md font-semibold shadow-md transition"
              >
                Report an Incident
              </Link>
              <Link
                to="/signup"
                className="bg-transparent hover:bg-indigo-600 border-2 border-white px-8 py-3 rounded-md font-semibold transition"
              >
                Create an Account
              </Link>
            </div>
          </div>
        </section> */}

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
                      identify consistent behaviors across multiple reports for
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
                      behaviors such as speeding, running red lights, reckless
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
                      vehicle registrations, view report histories, analyze risk
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
