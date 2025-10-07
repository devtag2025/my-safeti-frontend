import { useState } from "react";
import { MapPinIcon } from "lucide-react";
import DownIcon from "../../assets/svgs/ChevronDown";
import { createReport } from "../../api/reportService";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import useAuthStore from "../../store/authStore";

export default function IncidentReportForm() {
  const CRIMSON = "#6e0001";
  const CRIMSON_LIGHT = "#8a0000";

  const [activeVehicle, setActiveVehicle] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Define form with react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      // Personal information
      name: user?.fullName || "",
      email: user?.email || "",
      phone: "",

      // Incident details
      date: new Date().toISOString().split("T")[0],
      time: "",
      location: "",
      streetNumber: "",
      crossStreet: "",
      suburb: "",
      state: "NSW",
      incidentType: "Collision",
      vehicleType: "Car",
      description: "",

      // Dashcam information
      hasDashcam: false,
      hasAudio: false,
      canProvideFootage: false,
      acceptTerms: false,

      // Vehicles array
      vehicles: [
        {
          registration: "",
          registrationState: "NSW",
          make: "",
          model: "",
          vehicleColour: "",
          bodyType: "Sedan",
          identifyingFeatures: "",
          isRegistrationVisible: "Unknown",
        },
      ],
    },
  });

  // Use fieldArray to handle dynamic vehicles
  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicles",
  });

  const acceptTerms = watch("acceptTerms");

  const addVehicle = () => {
    append({
      registration: "",
      registrationState: "NSW",
      make: "",
      model: "",
      bodyType: "Sedan",
      identifyingFeatures: "",
      isRegistrationVisible: "Unknown",
    });
    setActiveVehicle(fields.length); // Set active to newly added vehicle
  };

  const removeVehicle = (index) => {
    if (fields.length > 1) {
      remove(index);
      // Adjust active vehicle if needed
      if (activeVehicle >= fields.length - 1) {
        setActiveVehicle(fields.length - 2);
      }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createReport(data);
      setSuccess(true);
      // Reset form after successful submission
      reset();
    } catch (err) {
      console.error("Error submitting report:", err);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const registrationStates = [
    "ACT",
    "NSW",
    "NT",
    "QLD",
    "SA",
    "TAS",
    "VIC",
    "WA",
    "HEAVY VEHICLE",
    "OTHER",
  ];

  const bodyTypes = [
    "Sedan",
    "Utility",
    "Wagon",
    "Motorcycle",
    "Hatchback",
    "Coupe",
    "Trailer",
    "Other",
  ];

  const visibilityOptions = ["Yes", "No", "Unknown"];

  const incidentTypes = [
    "Collision",
    "Excessive Speed",
    "Road Rage",
    "Hoon Driving (Including burnouts, racing)",
    "Tailgating",
    "Dangerous/Reckless Driving",
    "Request For Information",
    "Other",
  ];

  const vehicleTypes = ["Car", "Truck", "Motorcycle", "Bus", "Other"];

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
      style={{
        border: "1px solid rgba(110,0,1,0.06)",
        boxShadow: "0 8px 30px rgba(110,0,1,0.04)",
      }}
    >
      {/* Header */}
      <div className="bg-gray-50 border-b px-6 py-4" style={{ borderColor: "rgba(110,0,1,0.06)" }}>
        <h2
          className="text-2xl font-bold text-gray-900"
          style={{
            background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          My Safeti Incident Report
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Please provide accurate information about the incident to help keep our streets safe.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Your Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2`}
                  {...register("name", { required: "Name is required" })}
                  style={{
                    outlineColor: CRIMSON,
                  }}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2`}
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9+ -]+$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  style={{ outlineColor: CRIMSON }}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-900">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  style={{ outlineColor: CRIMSON }}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* Incident Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Incident Details</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Incident Type</label>
                <div className="relative">
                  <Controller
                    name="incidentType"
                    control={control}
                    rules={{ required: "Incident type is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`block w-full appearance-none rounded-md bg-white px-3 py-1.5 text-gray-900 border ${
                          errors.incidentType ? "border-red-500" : "border-gray-300"
                        } placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2`}
                        style={{ outlineColor: CRIMSON }}
                      >
                        {incidentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <DownIcon className="absolute right-2 top-2.5 size-4 text-gray-500" />
                </div>
                {errors.incidentType && <p className="text-red-500 text-xs mt-1">{errors.incidentType.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Vehicle Type</label>
                <div className="relative">
                  <Controller
                    name="vehicleType"
                    control={control}
                    rules={{ required: "Vehicle type is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`block w-full appearance-none rounded-md bg-white px-3 py-1.5 text-gray-900 border ${
                          errors.vehicleType ? "border-red-500" : "border-gray-300"
                        } placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2`}
                        style={{ outlineColor: CRIMSON }}
                      >
                        {vehicleTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <DownIcon className="absolute right-2 top-2.5 size-4 text-gray-500" />
                </div>
                {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Incident Date</label>
                <input
                  type="date"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  } sm:text-sm focus:outline-none focus:ring-2`}
                  {...register("date", { required: "Date is required" })}
                  style={{ outlineColor: CRIMSON }}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Incident Time</label>
                <input
                  type="time"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border ${
                    errors.time ? "border-red-500" : "border-gray-300"
                  } sm:text-sm focus:outline-none focus:ring-2`}
                  {...register("time", { required: "Time is required" })}
                  style={{ outlineColor: CRIMSON }}
                />
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-900">Street Name and Number</label>
                <div className="flex">
                  <MapPinIcon className="mr-2 h-4 w-4 opacity-50 mt-2" style={{ color: CRIMSON }} />
                  <input
                    type="text"
                    placeholder="Enter street name and number"
                    className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    } placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2`}
                    {...register("location", {
                      required: "Location is required",
                    })}
                    style={{ outlineColor: CRIMSON }}
                  />
                </div>
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Nearest Cross Street</label>
                <input
                  type="text"
                  placeholder="Enter nearest cross street"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                  {...register("crossStreet")}
                  style={{ outlineColor: CRIMSON }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Suburb</label>
                <input
                  type="text"
                  placeholder="Enter suburb"
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border ${
                    errors.suburb ? "border-red-500" : "border-gray-300"
                  } placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2`}
                  {...register("suburb", { required: "Suburb is required" })}
                  style={{ outlineColor: CRIMSON }}
                />
                {errors.suburb && <p className="text-red-500 text-xs mt-1">{errors.suburb.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">State</label>
                <div className="relative">
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="block w-full appearance-none rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                        style={{ outlineColor: CRIMSON }}
                      >
                        {registrationStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <DownIcon className="absolute right-2 top-2.5 size-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-medium text-gray-900">Vehicle Information</h3>
              {fields.length < 5 && (
                <button
                  type="button"
                  className="px-3 py-1 text-sm font-medium rounded border"
                  onClick={addVehicle}
                  style={{
                    color: CRIMSON,
                    borderColor: `rgba(110,0,1,0.12)`,
                    background: "transparent",
                  }}
                >
                  Add Another Vehicle
                </button>
              )}
            </div>

            {/* Vehicle Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-2 overflow-x-auto">
                {fields.map((field, index) => (
                  <button
                    key={field.id}
                    type="button"
                    className={`py-2 px-4 text-sm font-medium ${
                      activeVehicle === index
                        ? "border-b-2 text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveVehicle(index)}
                    style={
                      activeVehicle === index
                        ? {
                            background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                            borderBottom: `2px solid ${CRIMSON}`,
                            borderRadius: 6,
                          }
                        : {}
                    }
                  >
                    Vehicle {index + 1}
                    {watch(`vehicles.${index}.registration`) && ` - ${watch(`vehicles.${index}.registration`)}`}
                  </button>
                ))}
              </nav>
            </div>

            <div key={fields[activeVehicle]?.id} className="bg-white p-4 border border-gray-200 rounded-md">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Registration Number</label>
                  <input
                    type="text"
                    placeholder="Enter registration"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                    {...register(`vehicles.${activeVehicle}.registration`)}
                    style={{ outlineColor: CRIMSON }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Registration State</label>
                  <div className="relative">
                    <Controller
                      name={`vehicles.${activeVehicle}.registrationState`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="block w-full appearance-none rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                          style={{ outlineColor: CRIMSON }}
                        >
                          {registrationStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    <DownIcon className="absolute right-2 top-2.5 size-4 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Vehicle Make</label>
                  <input
                    type="text"
                    placeholder="E.g., Toyota, Honda"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                    {...register(`vehicles.${activeVehicle}.make`)}
                    style={{ outlineColor: CRIMSON }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Vehicle Model</label>
                  <input
                    type="text"
                    placeholder="E.g., Corolla, Civic"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                    {...register(`vehicles.${activeVehicle}.model`)}
                    style={{ outlineColor: CRIMSON }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Body Type</label>
                  <div className="relative">
                    <Controller
                      name={`vehicles.${activeVehicle}.bodyType`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="block w-full appearance-none rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                          style={{ outlineColor: CRIMSON }}
                        >
                          {bodyTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    <DownIcon className="absolute right-2 top-2.5 size-4 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Is registration visible on dashcam?</label>
                  <div className="relative">
                    <Controller
                      name={`vehicles.${activeVehicle}.isRegistrationVisible`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="block w-full appearance-none rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                          style={{ outlineColor: CRIMSON }}
                        >
                          {visibilityOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    <DownIcon className="absolute right-2 top-2.5 size-4 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Vehicle Identifying Features</label>
                  <textarea
                    placeholder="E.g., Sign writing, damage, accessories"
                    rows={2}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                    {...register(`vehicles.${activeVehicle}.identifyingFeatures`)}
                    style={{ outlineColor: CRIMSON }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Vehicle Colour</label>
                  <input
                    type="text"
                    placeholder="E.g., Orange, Green etc"
                    className="block w-full rounded-md bg-white px-3 py-4 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                    {...register(`vehicles.${activeVehicle}.vehicleColour`)}
                    style={{ outlineColor: CRIMSON }}
                  />
                </div>
              </div>

              {fields.length > 1 && (
                <div className="mt-4">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm font-medium rounded border"
                    onClick={() => removeVehicle(activeVehicle)}
                    style={{
                      color: "#b91c1c",
                      borderColor: "rgba(185,28,28,0.12)",
                      background: "transparent",
                    }}
                  >
                    Remove Vehicle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Incident Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Incident Description</h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Please provide as much detail as possible to describe the incident captured.
              </label>
              <p className="text-sm text-gray-500">
                By providing accurate information on the circumstances of the incident, you will increase the likelihood of a successful match to a request to obtain the footage.
              </p>
              <textarea
                placeholder="Describe what happened in detail..."
                rows={5}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                {...register("description")}
                style={{ outlineColor: CRIMSON }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Dashcam Information</h3>
            <p className="text-sm text-gray-500">Provide information about dashcam evidence</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Dash cam footage has been saved</label>
                <div className="relative">
                  <Controller
                    name="hasDashcam"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <select
                        value={value ? "Yes" : "No"}
                        onChange={(e) => onChange(e.target.value === "Yes")}
                        className="block w-full appearance-none rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                        style={{ outlineColor: CRIMSON }}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    )}
                  />
                  <DownIcon className="absolute right-2 top-2.5 size-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Audio</label>
                <div className="relative">
                  <Controller
                    name="hasAudio"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <select
                        value={value ? "Yes" : "No"}
                        onChange={(e) => onChange(e.target.value === "Yes")}
                        className="block w-full appearance-none rounded-md bg-white px-3 py-1.5 text-gray-900 border border-gray-300 placeholder:text-gray-400 sm:text-sm focus:outline-none focus:ring-2"
                        style={{ outlineColor: CRIMSON }}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    )}
                  />
                  <DownIcon className="absolute right-2 top-2.5 size-4 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="canProvideFootage"
                  className="h-4 w-4 rounded border-gray-300 mt-1"
                  {...register("canProvideFootage")}
                  style={{ accentColor: CRIMSON }}
                />
                <label htmlFor="canProvideFootage" className="ml-2 block text-sm font-medium text-gray-900">
                  I confirm I can provide the footage via the upload section if requested by My Safeti
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  className={`h-4 w-4 rounded border-gray-300 mt-1 ${errors.acceptTerms ? "border-red-500" : ""}`}
                  {...register("acceptTerms", {
                    required: "You must accept the terms and conditions",
                  })}
                  style={{ accentColor: CRIMSON }}
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm font-medium text-gray-900">
                  I confirm I accept the terms and conditions of My Safeti and understand that my name, phone number and email may be provided to external companies and/or law enforcement agencies if the footage is requested.
                </label>
              </div>
              {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms.message}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-between p-6 bg-gray-50 border-t" style={{ borderColor: "rgba(110,0,1,0.03)" }}>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              onClick={() => reset()}
            >
              Cancel
            </button>

            {error && (
              <div className="p-3 border border-red-200 bg-red-50 text-red-700 rounded-md">
                <strong>Error:</strong> {error}
              </div>
            )}

            {success && (
              <div className="p-3 border border-green-200 bg-green-50 text-green-700 rounded-md">
                <strong>Success!</strong> Your report has been submitted successfully!
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !acceptTerms}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              !acceptTerms ? "bg-gray-300 cursor-not-allowed" : ""
            }`}
            style={
              !acceptTerms
                ? {}
                : {
                    background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                    boxShadow: "0 8px 24px rgba(110,0,1,0.12)",
                  }
            }
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}
