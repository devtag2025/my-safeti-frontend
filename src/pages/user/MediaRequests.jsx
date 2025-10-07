import { useState, useEffect } from "react";
import useMediaRequestStore from "../../store/mediaRequestStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  X,
  User,
  MapPin,
  FileText,
  Clock,
  Image,
  Film,
  AlertCircle,
  XCircle,
  CheckCircle,
  File,
} from "lucide-react";
import PaymentDetailsDialog from "./PaymentDetailsDialog";
import {
  fetchPaymentDetails,
  savePaymentDetails,
} from "../../api/paymentDetailsService";

const CRIMSON = "#6e0001";
const CRIMSON_LIGHT = "#8a0000";

const MediaRequests = () => {
  const { mediaRequests, fetchUserRequests, uploadMedia } =
    useMediaRequestStore();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [files, setFiles] = useState([]); // Track multiple files
  const [isUploading, setIsUploading] = useState(false);
  const [fileErrors, setFileErrors] = useState([]); // To hold errors related to files
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const SUPPORTED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/mov",
    "video/avi",
    "image/webp",
  ];
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_FILES = 10;

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
    // Reset any previous upload state
    setFiles([]);
    setFileErrors([]);
    setUploadProgress(0);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const errors = [];

    // Validate the selected files
    selectedFiles.forEach((file) => {
      // Check if the file is larger than 50MB
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} is too large. Max file size is 50MB.`);
      }

      // Check if the file type is supported
      if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
        errors.push(`${file.name} has an unsupported file type.`);
      }
    });

    // Check if the number of files exceeds 10
    if (files.length + selectedFiles.length > MAX_FILES) {
      errors.push(`You can upload a maximum of ${MAX_FILES} files.`);
    }

    if (errors.length === 0) {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Add valid files to the list
    }

    setFileErrors(errors); // Set errors if any
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Remove file from the list
  };

  const handleUpload = async () => {
    if (!files.length || !selectedRequest) return;

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + Math.random() * 10;
          return next > 90 ? 90 : next;
        });
      }, 300);

      await uploadMedia(selectedRequest._id, formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Give user time to see 100% completion
      setTimeout(async () => {
        setFiles([]);
        try {
          const existingPayment = await fetchPaymentDetails();
          if (!existingPayment) {
            setShowPaymentDialog(true);
          }
        } catch (err) {
          console.error("Failed to check payment details:", err);
          setShowPaymentDialog(true);
        }
      }, 100);
    } catch (error) {
      console.error("Error uploading media:", error?.message || error);
      setFileErrors(["Failed to upload media. Please try again."]);
    } finally {
      setIsUploading(false);
      setIsDialogOpen(false);
      fetchUserRequests();
    }
  };

  const handlePaymentSubmit = async (paymentDetails) => {
    if (!selectedRequest) return;

    setIsSubmittingPayment(true);
    try {
      await savePaymentDetails(paymentDetails);
      setShowPaymentDialog(false);
      setIsDialogOpen(false);
      setSelectedRequest(null);
      fetchUserRequests();
    } catch (error) {
      console.error("Error saving payment details:", error);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, [fetchUserRequests]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "uploaded":
        return (
          <Badge
            variant="outline"
            className="bg-slate-50 text-gray-800 border-slate-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3 text-[${CRIMSON}]" />
            Submitted
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1"
            style={{
              background: "rgba(110,0,1,0.06)",
              color: CRIMSON,
              borderColor: "rgba(110,0,1,0.12)",
            }}
          >
            <XCircle className="h-3 w-3" style={{ color: CRIMSON }} />
            Rejected
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            {status}
          </Badge>
        );
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-4 w-4 text-[rgba(110,0,1,0.9)]" />;
    } else if (file.type.startsWith("video/")) {
      return <Film className="h-4 w-4 text-[rgba(110,0,1,0.9)]" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFileSize = (size) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-gray-900 min-h-screen">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{
            background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Media Requests
        </h1>
        <p className="text-gray-600 mt-2">
          Upload dashcam footage and other evidence for your reports
        </p>
      </div>

      {mediaRequests.length === 0 ? (
        <div
          className="text-center py-16 rounded-lg border"
          style={{ background: "#fff", borderColor: "rgba(15,23,42,0.04)" }}
        >
          <div className="mx-auto w-16 h-16 bg-[#fff5f5] rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8" style={{ color: CRIMSON }} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Media Requests
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            You don't have any pending media requests. When law enforcement or
            insurance companies request dashcam footage, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaRequests.map((request) => (
            <Card
              key={request._id}
              className={`overflow-hidden transition-all duration-200`}
              style={{
                background: "white",
                borderColor:
                  request.status === "rejected"
                    ? "rgba(110,0,1,0.12)"
                    : "rgba(15,23,42,0.04)",
                boxShadow: "0 8px 30px rgba(110,0,1,0.04)",
              }}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  {getStatusBadge(request.status)}
                  <p className="text-xs text-gray-500">
                    Requested on {formatDate(request.createdAt)}
                  </p>
                </div>
                <CardTitle className="text-lg mt-2 text-gray-900">
                  {request.report.incidentType} Report
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {formatDate(request.report.date)}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pb-0">
                <div className="space-y-3">
                  {request.requestedBy && (
                    <div className="flex items-start text-sm mt-3">
                      <User className="h-4 w-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">Requested By</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {request.requestedBy[0].fullName || "Unknown"}
                          <span className="font-normal text-gray-500 ml-1">
                            ({request.requestedBy[0].role})
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {request.requestedBy.email}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">
                        {request.report.location}
                      </p>
                    </div>
                  </div>
                </div>

                {request.status === "rejected" && (
                  <Alert className="mt-4" style={{ background: "rgba(110,0,1,0.06)", borderColor: "rgba(110,0,1,0.12)", color: CRIMSON }}>
                    <AlertCircle className="h-4 w-4" style={{ color: CRIMSON }} />
                    <AlertDescription>
                      Previous upload was rejected. Please upload new media.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>

              <CardFooter className="p-4 flex">
                {request.status === "approved" ? (
                  <div className="w-full bg-white rounded-md p-3 text-sm flex items-center" style={{ border: "1px solid rgba(15,23,42,0.04)" }}>
                    <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: CRIMSON }} />
                    <span>Media submitted & approved successfully</span>
                  </div>
                ) : request.mediaUrls && request.mediaUrls.length > 0 ? (
                  <Button
                    className="w-full"
                    onClick={() => handleOpenDialog(request)}
                    variant="outline"
                    style={{
                      borderColor: `rgba(110,0,1,0.12)`,
                      color: CRIMSON,
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" style={{ color: CRIMSON }} />
                    Replace Uploaded Media
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleOpenDialog(request)}
                    style={{
                      background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                      color: "#fff",
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {request.status === "rejected"
                      ? "Upload New Media"
                      : "Upload Media"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md w-[90vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" style={{ color: CRIMSON }} />
              Upload Evidence
            </DialogTitle>
            <DialogDescription>
              Upload dashcam footage or images related to the incident
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="bg-white rounded-md p-3 text-sm space-y-1 border" style={{ borderColor: "rgba(15,23,42,0.04)" }}>
              <p className="font-medium text-gray-900">
                {selectedRequest.report.incidentType} on{" "}
                {formatDate(selectedRequest.report.date)}
              </p>
              <p className="text-gray-600">
                <span className="inline-block w-20">Location:</span>
                {selectedRequest.report.location}
              </p>
              {selectedRequest.requestedBy && (
                <div className="flex items-start text-sm mt-3">
                  <User className="h-4 w-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500">Requested By</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {selectedRequest.requestedBy[0].fullName || "Unknown"}
                      <span className="font-normal text-gray-500 ml-1">
                        ({selectedRequest.requestedBy[0].role})
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedRequest.requestedBy.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload area */}
          {!isUploading ? (
            <div
              onClick={() => document.getElementById("uploadFiles").click()}
              className="bg-white border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: "rgba(110,0,1,0.08)" }}
            >
              <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: CRIMSON }} />
              <p className="text-sm font-medium text-gray-900">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Images (JPG, PNG, GIF, WEBP) or videos (MP4, MOV, AVI)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Up to {MAX_FILES} files, max 50MB each
              </p>
              <input
                type="file"
                id="uploadFiles"
                className="hidden"
                onChange={handleFileChange}
                multiple
                accept="image/jpeg,image/png,image/gif,video/mp4,video/mov,video/avi,image/webp"
              />
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Uploading files...
                </p>
                <div style={{ height: 8 }} className="w-full rounded overflow-hidden bg-gray-100">
                  <div
                    style={{
                      width: `${uploadProgress}%`,
                      background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                      height: "100%",
                      transition: "width 250ms linear",
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{Math.round(uploadProgress)}% complete</p>
              </div>
            </div>
          )}

          {/* Selected files list */}
          {files.length > 0 && !isUploading && (
            <div className="border rounded-md overflow-hidden mt-4" style={{ borderColor: "rgba(15,23,42,0.04)" }}>
              <div className="p-2 bg-white border-b text-xs font-medium text-gray-900" style={{ borderColor: "rgba(15,23,42,0.04)" }}>
                Selected Files ({files.length})
              </div>
              <div className="max-h-60 overflow-y-auto p-2 space-y-2 bg-white">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-2 rounded text-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {getFileIcon(file)}
                      <span className="truncate">{file.name}</span>
                      <span className="text-gray-500 text-xs flex-shrink-0">
                        {getFileSize(file.size)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error messages */}
          {fileErrors.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {fileErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex justify-between sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isUploading}
              style={{ borderColor: "rgba(15,23,42,0.04)" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || files.length === 0}
              style={{
                background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON_LIGHT})`,
                color: "#fff",
              }}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PaymentDetailsDialog
        isOpen={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onPaymentSubmit={handlePaymentSubmit}
        isSubmitting={isSubmittingPayment}
        // keep dialog's look separate, dialog receives isOpen/onOpenChange etc.
      />
    </div>
  );
};

export default MediaRequests;
