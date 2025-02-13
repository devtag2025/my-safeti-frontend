import { MapPinIcon, CameraIcon } from "lucide-react";
import DownIcon from "../../assets/svgs/ChevronDown";

export default function IncidentReportForm() {
  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Incident Report
          </h2>
          <p className="mt-1 text-sm text-gray-600 text-center">
            Please provide accurate information about the incident. All reports
            are kept confidential.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="rego"
                className="block text-sm font-medium text-gray-900"
              >
                Vehicle Registration Number
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="rego"
                  id="rego"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  placeholder="ABC123"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="incident-type"
                className="block text-sm font-medium text-gray-900"
              >
                Incident Type
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="incident-type"
                  name="incident-type"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                >
                  <option>Speeding</option>
                  <option>Reckless Driving</option>
                  <option>Running Red Light</option>
                  <option>Tailgating</option>
                  <option>Other</option>
                </select>
                <DownIcon className="pointer-events-none col-start-1 row-start-1 mr-2 size-4 self-center justify-self-end text-gray-500" />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-900"
              >
                Incident Location
              </label>
              <div className="mt-2">
                <div className="flex rounded-md">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    placeholder="Enter location or use current location"
                  />
                  <button
                    type="button"
                    className="ml-2 rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500"
                  >
                    <MapPinIcon className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-900"
              >
                Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="date"
                  id="date"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-900"
              >
                Time
              </label>
              <div className="mt-2">
                <input
                  type="time"
                  name="time"
                  id="time"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-900"
              >
                Incident Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  placeholder="Describe what happened..."
                />
              </div>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-900">
                Media Availability
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    id="has-media"
                    name="has-media"
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="text-sm leading-6">
                  <label
                    htmlFor="has-media"
                    className="font-medium text-gray-900"
                  >
                    I have photos/videos of this incident
                  </label>
                  <p className="text-gray-500">
                    Check this if you have media evidence (do not upload now)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit Report
        </button>
      </div>
    </form>
  );
}
