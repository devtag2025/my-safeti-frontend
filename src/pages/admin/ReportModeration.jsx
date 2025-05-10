import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  Car,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  File,
  AlertTriangle,
  Info,
  Search,
  Clipboard,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Download,
  ClipboardCopy,
  MessagesSquare,
} from "lucide-react";
import { getAllReports, updateReport } from "../../api/reportService";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import axios from "axios";
import API from "../../api/axiosConfig";

const ReportModeration = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    incidentType: "",
    dateFrom: "",
    dateTo: "",
    vehicleReg: "",
    state: "",
  });
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentReport, setCommentReport] = useState(null);

  const openCommentModal = (report) => {
    setCommentReport(report);
    setCommentText(report.adminComments);

    setIsCommentModalOpen(true);
  };

  const formatActionType = (actionType) => {
    switch (actionType) {
      case "comment":
        return "Comment";
      case "footage_request":
        return "Footage Request";
      case "contact":
        return "User Contact";
      case "status_change":
        return "Status Changed";
      default:
        return (
          actionType.charAt(0).toUpperCase() +
          actionType.slice(1).replace("_", " ")
        );
    }
  };

  const handleAddComment = async (reportId, comment) => {
    try {
      await API.post(`/report/comments/${reportId}`, {
        adminComments: comment,
      });

      const updatedReports = reports.map((report) =>
        report._id === reportId
          ? {
              ...report,
              adminComments: comment,
            }
          : report
      );

      setReports(updatedReports);

      if (selectedReport && selectedReport._id === reportId) {
        setSelectedReport({
          ...selectedReport,
          adminComments: comment,
        });
      }

      setIsCommentModalOpen(false);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const reportsData = await getAllReports();
        setReports(reportsData);
        setFilteredReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Failed to load reports. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Apply filters and search
  useEffect(() => {
    if (!reports.length) return;

    let result = [...reports];

    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((report) => {
        const reportFields = [
          report.customId?.toString(),
          report.incidentType?.toLowerCase(),
          report.location?.toLowerCase(),
          report.suburb?.toLowerCase(),
          report.state?.toLowerCase(),
          report.userId.customId.toString(),
          report.vehicleType?.toLowerCase(),
          report.description?.toLowerCase(),
          report.date
            ? new Date(report.date).toISOString().split("T")[0]
            : null,
        ];

        const vehicleFields = (report.vehicles || []).flatMap((v) => [
          v.registration?.toLowerCase(),
          v.registrationState?.toLowerCase(),
          v.make?.toLowerCase(),
          v.model?.toLowerCase(),
          v.bodyType?.toLowerCase(),
          v.identifyingFeatures?.toLowerCase(),
        ]);

        const allFields = [...reportFields, ...vehicleFields];

        return allFields.some((field) => field.includes(term));
      });
    }

    // Apply filters
    if (filters.status) {
      result = result.filter((report) => report.status === filters.status);
    }

    if (filters.incidentType) {
      result = result.filter(
        (report) => report.incidentType === filters.incidentType
      );
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(
        (report) => new Date(report.createdAt) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Set to end of day
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((report) => new Date(report.createdAt) <= toDate);
    }

    if (filters.vehicleReg) {
      result = result.filter(
        (report) =>
          report.vehicles &&
          report.vehicles.some(
            (v) =>
              v.registration &&
              v.registration
                .toLowerCase()
                .includes(filters.vehicleReg.toLowerCase())
          )
      );
    }

    if (filters.state) {
      result = result.filter((report) => report.state === filters.state);
    }

    setFilteredReports(result);
  }, [reports, searchTerm, filters]);

  // Handle report approval
  const handleApproveReport = async (reportId, userId) => {
    try {
      // Call API to update report status
      await updateReport(reportId, userId, {
        status: "approved",
      });

      // Update local state
      const updatedReports = reports.map((report) =>
        report._id === reportId ? { ...report, status: "approved" } : report
      );
      setReports(updatedReports);
    } catch (err) {
      console.error("Error approving report:", err);
    }
  };

  const handleRejectReport = async (reportId, userId) => {
    try {
      await updateReport(reportId, userId, {
        status: "rejected",
      });

      // Update local state
      const updatedReports = reports.map((report) =>
        report._id === reportId ? { ...report, status: "rejected" } : report
      );
      setReports(updatedReports);
    } catch (err) {
      console.error("Error rejecting report:", err);
    }
  };

  // Open modal to view report details
  const openViewModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
    setActiveTab("details");
  };

  const downloadAllReportsAsExcel = () => {
    try {
      if (!reports || reports.length === 0) {
        alert("No reports available to export");
        return;
      }

      const transformedData = transformReportsForExcel(reports); // Pass the state variable

      const ws = XLSX.utils.json_to_sheet(transformedData);
      const columnWidths = calculateColumnWidths(transformedData);
      ws["!cols"] = columnWidths;
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "All Reports");
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const fileName = `All_Reports_Export_${dateStr}.xlsx`;
      XLSX.writeFile(wb, fileName);

      console.log(
        `Successfully exported ${reports.length} reports with ${transformedData.length} vehicle entries to Excel`
      );
    } catch (error) {
      console.error("Error exporting reports to Excel:", error);
      alert("Failed to export reports to Excel");
    }
  };

  function transformReportsForExcel(reports) {
    const rows = [];

    reports.forEach((report) => {
      if (report.vehicles && report.vehicles.length > 0) {
        report.vehicles.forEach((vehicle, index) => {
          rows.push(createReportRow(report, vehicle, index + 1));
        });
      } else {
        rows.push(createReportRow(report, null, 0));
      }
    });

    return rows;
  }

  function createReportRow(report, vehicle, vehicleIndex) {
    const formatBoolean = (value) => (value ? "Yes" : "No");

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleString();
    };

    const row = {
      "Report ID": report.customId || "N/A",
      "Incident Type": report.incidentType || "N/A",
      "Vehicle Type": report.vehicleType || "N/A",
      Status: report.status || "N/A",
      Date: formatDate(report.date),
      "Created At": formatDate(report.createdAt),
      "Updated At": formatDate(report.updatedAt),

      Location: report.location || "N/A",
      "Street Number": report.streetNumber || "N/A",
      "Cross Street": report.crossStreet || "N/A",
      Suburb: report.suburb || "N/A",
      State: report.state || "N/A",

      "Reporter Name": report.name || "N/A",
      "Reporter Email": report.email || "N/A",
      "Reporter Phone": report.phone || "N/A",
      "Reporter User ID": report.userId.customId || "N/A",

      "Has Dashcam": formatBoolean(report.hasDashcam),
      "Has Audio": formatBoolean(report.hasAudio),
      "Can Provide Footage": formatBoolean(report.canProvideFootage),
      "Accept Terms": formatBoolean(report.acceptTerms),

      Description: report.description || "N/A",

      "Vehicle Count": report.vehicles ? report.vehicles.length : 0,
      "Vehicle Index": vehicleIndex,
    };

    if (vehicle) {
      Object.assign(row, {
        "Vehicle Registration": vehicle.registration || "N/A",
        "Vehicle Reg State": vehicle.registrationState || "N/A",
        "Vehicle Make": vehicle.make || "N/A",
        "Vehicle Model": vehicle.model || "N/A",
        "Vehicle Body Type": vehicle.bodyType || "N/A",
        "Vehicle Identifying Features": vehicle.identifyingFeatures || "N/A",
        "Vehicle Registration Visible": vehicle.isRegistrationVisible || "N/A",
        "Vehicle ID": vehicle._id || "N/A",
      });
    } else {
      Object.assign(row, {
        "Vehicle Registration": "N/A",
        "Vehicle Reg State": "N/A",
        "Vehicle Make": "N/A",
        "Vehicle Model": "N/A",
        "Vehicle Body Type": "N/A",
        "Vehicle Identifying Features": "N/A",
        "Vehicle Registration Visible": "N/A",
        "Vehicle ID": "N/A",
      });
    }

    return row;
  }

  const calculateColumnWidths = (data) => {
    if (!data || data.length === 0) return [];

    const columns = Object.keys(data[0]);
    const widths = columns.map((col) => ({ wch: col.length }));

    data.forEach((row) => {
      columns.forEach((col, i) => {
        if (row[col]) {
          const value = String(row[col] || "");
          const valueWidth = Math.min(value.length, 50);
          widths[i].wch = Math.max(widths[i].wch, valueWidth);
        }
      });
    });

    return widths.map((w) => ({ wch: w.wch + 2 }));
  };

  // Format date in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get user info (if available)
  const getUserInfo = (userId) => {
    return userId || "Anonymous";
  };

  // Get media URLs or placeholders
  const getMediaUrls = (report) => {
    if (report.mediaUrls && report.mediaUrls.length > 0) {
      return report.mediaUrls;
    }

    if (report.mediaFlag) {
      return ["/api/placeholder/400/300"];
    }

    return [];
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: "",
      incidentType: "",
      dateFrom: "",
      dateTo: "",
      vehicleReg: "",
      state: "",
    });
    setSearchTerm("");
  };

  // Get unique incident types from reports
  const getIncidentTypes = () => {
    const types = new Set();
    reports.forEach((report) => {
      if (report.incidentType) types.add(report.incidentType);
    });
    return Array.from(types);
  };

  // Get unique states from reports
  const getStates = () => {
    const states = new Set();
    reports.forEach((report) => {
      if (report.state) states.add(report.state);
    });
    return Array.from(states);
  };

  // Function to download report data as Excel
  const downloadReportAsExcel = (report) => {
    try {
      // Create a structured data object for Excel
      const reportData = [
        // General Info
        { Category: "Report ID", Value: report.customId },
        { Category: "Status", Value: report.status },
        { Category: "Incident Type", Value: report.incidentType },
        { Category: "Vehicle Type", Value: report.vehicleType },
        { Category: "Date", Value: formatDate(report.date) },
        { Category: "Created At", Value: formatDate(report.createdAt) },
        { Category: "Updated At", Value: formatDate(report.updatedAt) },
        { Category: "", Value: "" }, // Empty row as separator

        // Location Info
        { Category: "Location", Value: report.location },
        { Category: "Cross Street", Value: report.crossStreet || "N/A" },
        { Category: "Suburb", Value: report.suburb },
        { Category: "State", Value: report.state },
        { Category: "", Value: "" }, // Empty row as separator

        // Reporter Info
        { Category: "Reporter Name", Value: report.name },
        { Category: "Reporter Email", Value: report.email },
        { Category: "Reporter Phone", Value: report.phone },
        {
          Category: "Reporter User ID",
          Value: report.userId.customId || "N/A",
        },
        { Category: "", Value: "" }, // Empty row as separator

        // Evidence Info
        { Category: "Has Dashcam", Value: report.hasDashcam ? "Yes" : "No" },
        { Category: "Has Audio", Value: report.hasAudio ? "Yes" : "No" },
        {
          Category: "Can Provide Footage",
          Value: report.canProvideFootage ? "Yes" : "No",
        },
        {
          Category: "Terms Accepted",
          Value: report.acceptTerms ? "Yes" : "No",
        },
        { Category: "", Value: "" }, // Empty row as separator

        // Description
        {
          Category: "Description",
          Value: report.description || "No description provided",
        },
      ];

      // Add vehicle information
      if (report.vehicles && report.vehicles.length > 0) {
        reportData.push({ Category: "", Value: "" });
        reportData.push({ Category: "VEHICLE DETAILS", Value: "" });

        report.vehicles.forEach((vehicle, index) => {
          reportData.push({
            Category: `Vehicle ${index + 1} Registration`,
            Value: vehicle.registration,
          });
          reportData.push({
            Category: `Vehicle ${index + 1} Reg State`,
            Value: vehicle.registrationState,
          });
          reportData.push({
            Category: `Vehicle ${index + 1} Make`,
            Value: vehicle.make,
          });
          reportData.push({
            Category: `Vehicle ${index + 1} Model`,
            Value: vehicle.model,
          });
          reportData.push({
            Category: `Vehicle ${index + 1} Body Type`,
            Value: vehicle.bodyType,
          });
          reportData.push({
            Category: `Vehicle ${index + 1} Visible on Dashcam`,
            Value: vehicle.isRegistrationVisible,
          });
          reportData.push({
            Category: `Vehicle ${index + 1} Features`,
            Value: vehicle.identifyingFeatures || "N/A",
          });

          if (index < report.vehicles.length - 1) {
            reportData.push({ Category: "", Value: "" });
          }
        });
      }

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(reportData);

      // Auto-size columns
      const colWidths = reportData.reduce(
        (width, row) => {
          const categoryWidth = row.Category
            ? row.Category.toString().length
            : 0;
          const valueWidth = row.Value ? row.Value.toString().length : 0;
          return {
            category: Math.max(width.category, categoryWidth),
            value: Math.max(width.value, valueWidth),
          };
        },
        { category: 10, value: 10 }
      );

      ws["!cols"] = [
        { wch: colWidths.category + 2 },
        { wch: colWidths.value + 2 },
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report Details");

      // Generate filename
      const fileName = `Report_${report._id}_${report.incidentType.replace(
        /\s+/g,
        "_"
      )}.xlsx`;

      // Write and download file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report data");
    }
  };

  const downloadReportAsPDF = (report) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Define colors
      const primaryColor = [41, 65, 148]; // Indigo
      const secondaryColor = [100, 116, 139]; // Slate gray
      const headerBgColor = [241, 245, 249]; // Light gray bg
      const approvedColor = [34, 197, 94]; // Green
      const rejectedColor = [239, 68, 68]; // Red
      const pendingColor = [234, 179, 8]; // Yellow

      // Set initial position
      let y = 15;
      const margin = 15;
      const pageWidth = doc.internal.pageSize.width;
      const contentWidth = pageWidth - margin * 2;

      // Add header with logo/branding
      doc.setFillColor(...headerBgColor);
      doc.rect(0, 0, pageWidth, 25, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(...primaryColor);
      doc.text("Incident Report", margin, y);

      // Add report reference info in top right
      doc.setFontSize(8);
      doc.setTextColor(...secondaryColor);
      doc.text(`Report ID: ${report.customId}`, pageWidth - margin, y - 5, {
        align: "right",
      });

      // Add status with colored badge - fixed positioning
      const statusText = report.status.toUpperCase();
      let statusColor;
      if (report.status === "approved") {
        statusColor = approvedColor;
      } else if (report.status === "rejected") {
        statusColor = rejectedColor;
      } else {
        statusColor = pendingColor;
      }

      // Better status badge calculation
      const statusWidth =
        (doc.getStringUnitWidth(statusText) * 8) / doc.internal.scaleFactor;
      doc.setFillColor(...statusColor);
      doc.roundedRect(
        pageWidth - margin - statusWidth - 8,
        y - 2,
        statusWidth + 8,
        9,
        2,
        2,
        "F"
      );
      doc.setTextColor(255, 255, 255); // White text
      doc.text(statusText, pageWidth - margin - 4, y, { align: "right" });

      y += 15;

      // Add report title
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text(`${report.incidentType}`, margin, y);

      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.2);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);

      y += 10;

      // Function to add section with header - improved spacing
      const addSection = (title, data) => {
        // Section header with background
        doc.setFillColor(...headerBgColor);
        doc.rect(margin, y - 4, contentWidth, 8, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...primaryColor);
        doc.text(title, margin, y);
        y += 8; // Increased spacing after section header

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);

        // Create a two-column layout for data
        const entries = Object.entries(data).filter(([_, value]) => value);

        // Only create two columns if we have more than 3 entries
        const useColumns = entries.length > 3;
        const midPoint = Math.ceil(entries.length / (useColumns ? 2 : 1));

        const originalY = y;
        let maxY = y;

        // First column (or only column if not using two columns)
        entries.slice(0, midPoint).forEach(([key, value]) => {
          // Check if we need a new page
          if (y > 270) {
            doc.addPage();
            y = 20;
          }

          doc.setFont("helvetica", "bold");
          doc.text(`${key}:`, margin, y);

          doc.setFont("helvetica", "normal");
          // Increased label width for better alignment
          doc.text(`${value}`, margin + 40, y);
          y += 7; // Increased spacing between rows
        });

        maxY = Math.max(maxY, y);

        // Reset y to original position for second column if we're using columns
        if (useColumns && entries.length > 1) {
          y = originalY;

          // Second column
          entries.slice(midPoint).forEach(([key, value]) => {
            // Check if we need a new page
            if (y > 270) {
              doc.addPage();
              y = 20;
            }

            doc.setFont("helvetica", "bold");
            doc.text(`${key}:`, margin + contentWidth / 2, y);

            doc.setFont("helvetica", "normal");
            doc.text(`${value}`, margin + contentWidth / 2 + 40, y);
            y += 7; // Increased spacing between rows
          });
        }

        // Use the maximum y value of the two columns
        y = Math.max(maxY, y);
        y += 3; // Space after the section
      };

      // Add report sections
      addSection("General Information", {
        "Incident Type": report.incidentType,
        "Vehicle Type": report.vehicleType,
        Date: formatDate(report.date),
        "Created At": formatDate(report.createdAt),
        "Updated At": formatDate(report.updatedAt),
      });

      addSection("Location Details", {
        Location: report.location,
        "Street Number": report.streetNumber || "N/A",
        "Cross Street": report.crossStreet || "N/A",
        Suburb: report.suburb,
        State: report.state,
      });

      addSection("Reporter Details", {
        Name: report.name,
        Email: report.email,
        Phone: report.phone,
        "User ID": report.userId.customId || "N/A",
      });

      // Format boolean values with proper checkmarks/x - fixed spacing
      const formatBoolean = (value) => {
        return value ? "✓  Yes" : "✗  No";
      };

      addSection("Evidence Information", {
        "Has Dashcam": formatBoolean(report.hasDashcam),
        "Has Audio": formatBoolean(report.hasAudio),
        "Can Provide Footage": formatBoolean(report.canProvideFootage),
        "Terms Accepted": formatBoolean(report.acceptTerms),
      });

      // Add description with better padding
      if (report.description) {
        // Description section header
        doc.setFillColor(...headerBgColor);
        doc.rect(margin, y - 4, contentWidth, 8, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...primaryColor);
        doc.text("Description", margin, y);
        y += 8; // Increased spacing

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);

        // Add a box around the description with better padding
        doc.setDrawColor(...secondaryColor);
        doc.setFillColor(252, 252, 252);

        // Calculate height needed for description with added padding
        const splitDescription = doc.splitTextToSize(
          report.description,
          contentWidth - 10
        ); // Reduced width for better text wrapping
        const descriptionHeight = splitDescription.length * 5 + 10; // Added padding

        // Check if we need a new page
        if (y + descriptionHeight > 270) {
          doc.addPage();
          y = 20;
        }

        // Draw background and border for description
        doc.rect(margin, y, contentWidth, descriptionHeight, "FD");

        // Add description text with proper padding
        doc.text(splitDescription, margin + 5, y + 7);
        y += descriptionHeight + 8; // Added spacing after description
      }

      // Add vehicle information with better spacing and formatting
      if (report.vehicles && report.vehicles.length > 0) {
        report.vehicles.forEach((vehicle, index) => {
          // Vehicle section header
          doc.setFillColor(...headerBgColor);
          doc.rect(margin, y - 4, contentWidth, 8, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(...primaryColor);
          doc.text(`Vehicle ${index + 1} Details`, margin, y);
          y += 8; // Increased spacing

          // Highlight registration in a special box with better padding
          if (vehicle.registration) {
            doc.setFillColor(...primaryColor);
            const regText = `${vehicle.registration} (${vehicle.registrationState})`;
            const regWidth =
              (doc.getStringUnitWidth(regText) * 11) / doc.internal.scaleFactor; // Increased size factor

            // Better positioned registration box
            doc.roundedRect(margin, y - 5, regWidth + 10, 12, 2, 2, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.text(regText, margin + 5, y);

            y += 12; // Adjusted spacing after registration
          }

          // Back to normal formatting
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);

          // Check if we need a new page
          if (y > 250) {
            doc.addPage();
            y = 20;
          }

          // Create two-column layout for vehicle details - simplified and better spacing
          const vehicleData = {
            Make: vehicle.make || "N/A",
            Model: vehicle.model || "N/A",
            "Body Type": vehicle.bodyType || "N/A",
            "Registration Visible": vehicle.isRegistrationVisible || "N/A",
          };

          const entries = Object.entries(vehicleData).filter(
            ([_, value]) => value
          );
          const midPoint = Math.ceil(entries.length / 2);

          const originalY = y;
          let maxY = y;

          // First column
          entries.slice(0, midPoint).forEach(([key, value]) => {
            doc.setFont("helvetica", "bold");
            doc.text(`${key}:`, margin, y);

            doc.setFont("helvetica", "normal");
            doc.text(`${value}`, margin + 40, y); // Increased spacing
            y += 7; // Increased row spacing
          });

          maxY = Math.max(maxY, y);

          // Reset y for second column
          if (entries.length > 2) {
            y = originalY;

            // Second column
            entries.slice(midPoint).forEach(([key, value]) => {
              doc.setFont("helvetica", "bold");
              doc.text(`${key}:`, margin + contentWidth / 2, y);

              doc.setFont("helvetica", "normal");
              doc.text(`${value}`, margin + contentWidth / 2 + 40, y); // Increased spacing
              y += 7; // Increased row spacing
            });
          }

          // Use the maximum y value of the two columns
          y = Math.max(maxY, y);

          // Add identifying features in a box if available - fixed padding issues
          if (vehicle.identifyingFeatures) {
            doc.setFont("helvetica", "bold");
            doc.text("Identifying Features:", margin, y);
            y += 6; // Fixed spacing

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);

            // Create a box for the features with better padding
            doc.setDrawColor(...secondaryColor);
            doc.setFillColor(252, 252, 252);

            const splitFeatures = doc.splitTextToSize(
              vehicle.identifyingFeatures,
              contentWidth - 10
            ); // Reduced width for better text wrapping
            const featuresHeight = splitFeatures.length * 5 + 10; // Added padding

            // Draw box with better positioning
            doc.rect(margin, y, contentWidth, featuresHeight, "FD");

            // Add features text with proper padding
            doc.text(splitFeatures, margin + 5, y + 7);

            y += featuresHeight + 8; // Added spacing
          } else {
            y += 5;
          }
        });
      }

      // Add footer with fixed positioning
      const footerY = doc.internal.pageSize.height - 10;
      doc.setFontSize(8);
      doc.setTextColor(...secondaryColor);
      doc.text(
        `Generated on ${new Date().toLocaleString()}`,
        pageWidth / 2,
        footerY,
        { align: "center" }
      );

      // Add page numbers to all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, footerY, {
          align: "right",
        });
      }

      // Generate filename
      const fileName = `Report_${report._id}_${report.incidentType.replace(
        /\s+/g,
        "_"
      )}.pdf`;

      // Save the PDF
      doc.save(fileName);
    } catch (error) {
      console.error("Error creating PDF:", error);
      alert("Failed to create PDF report");
    }
  };

  const generateEmailTemplate = (report) => {
    const subject = `Request for Dashcam Footage: Incident ${report.customId}`;

    const template = `
  To: ${report.email}
  Subject: ${subject}
  
  Dear ${report.name},
  
  Thank you for submitting your incident report (ID: ${
    report.customId
  }) regarding a ${report.incidentType.toLowerCase()} incident that occurred on ${formatDate(
      report.date
    )}.
  
  As you indicated that you have dashcam footage available, we would greatly appreciate if you could provide this evidence to help us process your report. Please upload your footage to the following secure OneDrive link:
  
  [ONEDRIVE_LINK]
  
  Important information to include with your upload:
  - Your Report ID: ${report.customId}
  - Date of Incident: ${formatDate(report.date)}
  - Location: ${report.location}, ${report.suburb}, ${report.state}
  - Vehicle Registration: ${
    report.vehicles && report.vehicles.length > 0
      ? report.vehicles[0].registration
      : "N/A"
  }
  
  Please ensure the footage clearly shows the incident described in your report. If possible, include a timestamp or other identifying information to help us verify the date and time.
  
  If you have any questions or need assistance with uploading your footage, please don't hesitate to reply to this email or contact our support team.
  
  Thank you for your cooperation.
  
  Best regards,
  The Incident Reporting Team
    `;

    return {
      email: report.email,
      subject,
      body: template,
    };
  };

  const openEmailTemplate = (template) => {
    // No need to regenerate the template, just use what's passed in
    const mailtoLink = `mailto:${encodeURIComponent(
      template.email
    )}?subject=${encodeURIComponent(
      template.subject
    )}&body=${encodeURIComponent(template.body)}`;

    window.location.href = mailtoLink;
  };

  const copyEmailTemplateToClipboard = (template) => {
    // Use the template directly
    const emailContent = `To: ${template.email}
  Subject: ${template.subject}
  
  ${template.body}`;

    navigator.clipboard
      .writeText(emailContent)
      .then(() => {
        alert("Email template copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy email template: ", err);
        alert("Failed to copy email template to clipboard");
      });
  };

  const showEmailTemplateModal = (report) => {
    const template = generateEmailTemplate(report);
    setEmailTemplate(template);
    setIsEmailModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Search and filter bar */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by ID, vehicle registration, incident type..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
            {isFilterOpen ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
          <button
            onClick={downloadAllReportsAsExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export All Reports
          </button>
        </div>

        {/* Advanced filters */}
        {isFilterOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="incidentType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Incident Type
                </label>
                <select
                  id="incidentType"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.incidentType}
                  onChange={(e) =>
                    handleFilterChange("incidentType", e.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="Collision">Collision</option>
                  <option value="Excessive Speed">Excessive Speed</option>
                  <option value="Road Rage">Road Rage</option>
                  <option value="Hoon Driving (Including burnouts, racing)">
                    Hoon Driving (Including burnouts, racing)
                  </option>
                  <option value="Tailgating">Tailgating</option>
                  <option value="Dangerous/Reckless Driving">
                    Dangerous/Reckless Driving
                  </option>
                  <option value="Other">Other</option>
                  {/* {getIncidentTypes().map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))} */}
                </select>
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State
                </label>
                <select
                  id="state"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.state}
                  onChange={(e) => handleFilterChange("state", e.target.value)}
                >
                  <option value="">All</option>
                  {getStates().map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="vehicleReg"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vehicle Registration
                </label>
                <input
                  type="text"
                  id="vehicleReg"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter registration"
                  value={filters.vehicleReg}
                  onChange={(e) =>
                    handleFilterChange("vehicleReg", e.target.value)
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="dateFrom"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  From Date
                </label>
                <input
                  type="date"
                  id="dateFrom"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="dateTo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  To Date
                </label>
                <input
                  type="date"
                  id="dateTo"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-1 mt-0.5" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Filter results summary */}
        {(searchTerm || Object.values(filters).some((val) => val !== "")) && (
          <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-md p-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{filteredReports.length}</span>{" "}
              report{filteredReports.length !== 1 && "s"} found
            </div>
            {/* {(searchTerm ||
              Object.values(filters).some((val) => val !== "")) && (
              <button
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                onClick={clearFilters}
              >
                <X className="h-3 w-3 mr-1" />
                Clear all filters
              </button>
            )} */}
          </div>
        )}
      </div>

      {/* Reports Queue */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Reports Queue</h3>
          <p className="text-sm text-gray-500">
            Pending reports awaiting moderation
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="h-10 w-10 mx-auto mb-4 animate-pulse" />
            <p>Loading reports...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <AlertCircle className="h-10 w-10 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        ) : filteredReports.filter((r) => r.status === "pending").length ===
          0 ? (
          <div className="p-8 text-center text-gray-500">
            <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-500" />
            <p>No pending reports to review.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReports
              .filter((report) => report.status === "pending")
              .map((report) => (
                <div key={report._id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">
                          {report.incidentType}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <p>
                          <span className="font-medium">ID:</span>{" "}
                          {report.customId}
                        </p>
                        <p>
                          <span className="font-medium">Vehicle:</span>{" "}
                          {report.vehicles && report.vehicles[0]
                            ? report.vehicles[0].registration
                            : "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          {report.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <button
                        onClick={() => openViewModal(report)}
                        className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleApproveReport(report._id, report.userId)
                        }
                        className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleRejectReport(report._id, report.userId)
                        }
                        className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Recently Moderated Reports */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">
            Recently Moderated
          </h3>
          <p className="text-sm text-gray-500">
            Reports that have been reviewed
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="h-10 w-10 mx-auto mb-4 animate-pulse" />
            <p>Loading reports...</p>
          </div>
        ) : filteredReports.filter((r) => r.status !== "pending").length ===
          0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertCircle className="h-10 w-10 mx-auto mb-4 text-blue-500" />
            <p>No reports have been moderated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Incident Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vehicle
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Moderated
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports
                  .filter((report) => report.status !== "pending")
                  .map((report) => (
                    <tr key={report._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.customId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.incidentType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.vehicles && report.vehicles[0]
                          ? report.vehicles[0].registration
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${
                          report.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        >
                          {report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(report.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex justify-center items-center">
                        <button
                          onClick={() => openViewModal(report)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {/* <button
                          onClick={() => downloadReportAsExcel(report)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer ml-2"
                        >
                          <Download className="h-3 w-3 mr-1" />
                        </button> */}
                        <button
                          onClick={() => downloadReportAsPDF(report)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer ml-2"
                          title="Download PDF"
                        >
                          <FileText className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() =>
                            showEmailTemplateModal(
                              report,
                              setIsEmailModalOpen,
                              setEmailTemplate
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer ml-2"
                          title="Request Footage via Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCommentModal(report);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer ml-2"
                          title="Add Comment"
                        >
                          <MessagesSquare className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCommentModalOpen && commentReport && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="comment-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsCommentModalOpen(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3
                  className="text-lg leading-6 font-bold text-gray-900 mb-4"
                  id="comment-modal-title"
                >
                  Add Comments
                </h3>

                <div>
                  <div className="mb-4">
                    <label
                      htmlFor="comment-text"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Comment Text
                    </label>
                    <textarea
                      id="comment-text"
                      rows={5}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Enter your comment or action details..."
                    ></textarea>
                  </div>

                  <div className="text-xs text-gray-500 mb-2">
                    Report ID: {commentReport.customId}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm"
                  onClick={() => {
                    handleAddComment(commentReport._id, commentText);
                  }}
                >
                  Save Comment
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsCommentModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEmailModalOpen && emailTemplate && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="email-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsEmailModalOpen(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div>
                  <h3
                    className="text-lg leading-6 font-bold text-gray-900 flex items-center"
                    id="email-modal-title"
                  >
                    <Mail className="mr-2 h-5 w-5 text-gray-500" />
                    Email Template: Request for Footage
                  </h3>

                  <div className="mt-4">
                    <div className="mb-2">
                      <p className="text-sm text-gray-700 font-medium">To:</p>
                      <p className="text-sm">{emailTemplate.email}</p>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-gray-700 font-medium">
                        Subject:
                      </p>
                      <p className="text-sm">{emailTemplate.subject}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-700 font-medium">Body:</p>
                      <div className="mt-2 bg-gray-50 p-3 rounded-md whitespace-pre-wrap text-sm">
                        {emailTemplate.body}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-700 font-medium">
                        OneDrive Link:
                      </p>
                      <input
                        type="text"
                        className="mt-1 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Paste OneDrive link here"
                        onChange={(e) => {
                          const updatedTemplate = {
                            ...emailTemplate,
                            body: emailTemplate.body.replace(
                              "[ONEDRIVE_LINK]",
                              e.target.value
                            ),
                          };
                          setEmailTemplate(updatedTemplate);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm"
                  onClick={() => openEmailTemplate({ ...emailTemplate })}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Open in Email Client
                </button>
                <button
                  type="button"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:text-sm"
                  onClick={() =>
                    copyEmailTemplateToClipboard({ ...emailTemplate })
                  }
                >
                  <ClipboardCopy className="h-4 w-4 mr-1" /> Copy to Clipboard
                </button>

                {/* <button
                  onClick={() => showEmailTemplateModal(report)}
                  className="text-indigo-600 hover:text-indigo-900 cursor-pointer ml-2"
                  title="Request Footage via Email"
                >
                  <Mail className="h-4 w-4" />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Modal for viewing details */}
      {isModalOpen && selectedReport && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div>
                  {/* <div className="flex justify-between items-center">
                    <h3
                      className="text-lg leading-6 font-bold text-gray-900 flex items-center"
                      id="modal-title"
                    >
                      <FileText className="mr-2 h-5 w-5 text-gray-500" />
                      Report Details
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${
                        selectedReport.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : selectedReport.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedReport.status.charAt(0).toUpperCase() +
                        selectedReport.status.slice(1)}
                    </span>
                  </div> */}
                  <div className="flex justify-between items-center">
                    <h3
                      className="text-lg leading-6 font-bold text-gray-900 flex items-center"
                      id="modal-title"
                    >
                      <FileText className="mr-2 h-5 w-5 text-gray-500" />
                      Report Details
                    </h3>
                    <div className="flex items-center space-x-2">
                      {/* <button
                        onClick={() => downloadReportAsExcel(selectedReport)}
                        className="mr-2 inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-100"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Download Excel
                      </button> */}
                      <button
                        onClick={() => downloadReportAsPDF(selectedReport)}
                        className="mr-2 inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-100"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Download PDF
                      </button>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${
                            selectedReport.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : selectedReport.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {selectedReport.status.charAt(0).toUpperCase() +
                          selectedReport.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="mt-4 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6">
                      <button
                        className={`pb-4 px-1 ${
                          activeTab === "details"
                            ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setActiveTab("details")}
                      >
                        Details
                      </button>
                      <button
                        className={`pb-4 px-1 ${
                          activeTab === "reporter"
                            ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setActiveTab("reporter")}
                      >
                        Reporter Info
                      </button>
                      <button
                        className={`pb-4 px-1 ${
                          activeTab === "vehicle"
                            ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setActiveTab("vehicle")}
                      >
                        Vehicle
                      </button>
                      <button
                        className={`pb-4 px-1 ${
                          activeTab === "evidence"
                            ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setActiveTab("evidence")}
                      >
                        Evidence
                      </button>
                      <button
                        className={`pb-4 px-1 ${
                          activeTab === "comments"
                            ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
                            : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setActiveTab("comments")}
                      >
                        Admin Comments
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-4">
                    {/* Details Tab */}
                    {activeTab === "details" && (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 flex items-center">
                                <Info className="h-4 w-4 mr-1 text-gray-400" />
                                Report ID
                              </p>
                              <p className="font-medium">
                                {selectedReport.customId}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                Submitted At
                              </p>
                              <p className="font-medium">
                                {formatDate(selectedReport.createdAt)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-1 text-gray-400" />
                                Incident Type
                              </p>
                              <p className="font-medium">
                                {selectedReport.incidentType}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 flex items-center">
                                <Car className="h-4 w-4 mr-1 text-gray-400" />
                                Vehicle Type
                              </p>
                              <p className="font-medium">
                                {selectedReport.vehicleType}
                              </p>
                            </div>
                            {selectedReport.date && (
                              <div>
                                <p className="text-gray-500 flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                  Incident Date
                                </p>
                                <p className="font-medium">
                                  {formatDate(selectedReport.date)}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-gray-500 flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                Updated At
                              </p>
                              <p className="font-medium">
                                {formatDate(selectedReport.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                            Location Details
                          </h4>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Street Address</p>
                                <p className="font-medium">
                                  {selectedReport.location}
                                </p>
                              </div>
                              {selectedReport.crossStreet && (
                                <div>
                                  <p className="text-gray-500">Cross Street</p>
                                  <p className="font-medium">
                                    {selectedReport.crossStreet}
                                  </p>
                                </div>
                              )}
                              <div>
                                <p className="text-gray-500">Suburb</p>
                                <p className="font-medium">
                                  {selectedReport.suburb}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">State</p>
                                <p className="font-medium">
                                  {selectedReport.state}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {selectedReport.description && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-700 flex items-center">
                              <FileText className="h-4 w-4 mr-1 text-gray-500" />
                              Incident Description
                            </h4>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-sm">
                                {selectedReport.description ||
                                  "No description provided."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reporter Tab */}
                    {activeTab === "reporter" && (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h4 className="font-medium text-gray-700 flex items-center mb-3">
                            <User className="h-4 w-4 mr-1 text-gray-500" />
                            Reporter Information
                          </h4>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 flex items-center">
                                <User className="h-4 w-4 mr-1 text-gray-400" />
                                Name
                              </p>
                              <p className="font-medium">
                                {selectedReport.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 flex items-center">
                                <Mail className="h-4 w-4 mr-1 text-gray-400" />
                                Email
                              </p>
                              <p className="font-medium">
                                {selectedReport.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 flex items-center">
                                <Phone className="h-4 w-4 mr-1 text-gray-400" />
                                Phone
                              </p>
                              <p className="font-medium">
                                {selectedReport.phone}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 flex items-center">
                                <Info className="h-4 w-4 mr-1 text-gray-400" />
                                User ID
                              </p>
                              <p className="font-medium">
                                {selectedReport.customId || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Vehicle Tab */}
                    {activeTab === "vehicle" && (
                      <div className="space-y-4">
                        {selectedReport.vehicles &&
                          selectedReport.vehicles.map((vehicle, index) => (
                            <div
                              key={vehicle._id || index}
                              className="bg-gray-50 p-3 rounded-md"
                            >
                              <h4 className="font-medium text-gray-700 flex items-center mb-3">
                                <Car className="h-4 w-4 mr-1 text-gray-500" />
                                Vehicle {index + 1} Details
                              </h4>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Registration</p>
                                  <p className="font-medium text-indigo-600">
                                    {vehicle.registration}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">
                                    Registration State
                                  </p>
                                  <p className="font-medium">
                                    {vehicle.registrationState}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Make</p>
                                  <p className="font-medium">{vehicle.make}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Model</p>
                                  <p className="font-medium">{vehicle.model}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Body Type</p>
                                  <p className="font-medium">
                                    {vehicle.bodyType}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">
                                    Reg. Visible on Dashcam
                                  </p>
                                  <p className="font-medium">
                                    {vehicle.isRegistrationVisible}
                                  </p>
                                </div>
                              </div>

                              {vehicle.identifyingFeatures && (
                                <div className="mt-3">
                                  <p className="text-gray-500">
                                    Identifying Features
                                  </p>
                                  <p className="text-sm mt-1 bg-white p-2 rounded">
                                    {vehicle.identifyingFeatures}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Evidence Tab */}
                    {activeTab === "evidence" && (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h4 className="font-medium text-gray-700 flex items-center mb-3">
                            <File className="h-4 w-4 mr-1 text-gray-500" />
                            Dashcam Evidence
                          </h4>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">
                                Dashcam Footage Saved
                              </p>
                              <p className="font-medium flex items-center">
                                {selectedReport.hasDashcam ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                    Yes
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                    No
                                  </>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Audio Available</p>
                              <p className="font-medium flex items-center">
                                {selectedReport.hasAudio ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                    Yes
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                    No
                                  </>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">
                                Can Provide Footage
                              </p>
                              <p className="font-medium flex items-center">
                                {selectedReport.canProvideFootage ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                    Yes
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                    No
                                  </>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Terms Accepted</p>
                              <p className="font-medium flex items-center">
                                {selectedReport.acceptTerms ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                    Yes
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                    No
                                  </>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Media Flag</p>
                              <p className="font-medium flex items-center">
                                {selectedReport.mediaFlag ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                    Yes
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                    No
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {selectedReport.mediaFlag && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-700">
                              Media Files
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {getMediaUrls(selectedReport).map(
                                (url, index) => (
                                  <img
                                    key={index}
                                    src={url}
                                    alt={`Report media ${index + 1}`}
                                    className="rounded-md w-full h-auto"
                                  />
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "comments" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-700 flex items-center">
                            <FileText className="h-4 w-4 mr-1 text-gray-500" />
                            Admin Comments
                          </h4>
                        </div>

                        {!selectedReport.adminComments ||
                        selectedReport.adminComments.length === 0 ? (
                          <div className="bg-gray-50 p-6 text-center rounded-md">
                            <p className="text-gray-500">
                              No comments recorded yet.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-800">
                              {selectedReport.adminComments}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedReport.status === "pending" && (
                  <>
                    <button
                      type="button"
                      className="ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                      onClick={() => {
                        handleApproveReport(
                          selectedReport._id,
                          selectedReport.userId
                        );
                        setIsModalOpen(false);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button
                      type="button"
                      className="ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                      onClick={() => {
                        handleRejectReport(
                          selectedReport._id,
                          selectedReport.userId
                        );
                        setIsModalOpen(false);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportModeration;
