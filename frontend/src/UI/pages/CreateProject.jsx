import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createProject,
  fetchMyProjects,
} from "../../store/slices/projectSlice";
import toast from "react-hot-toast";

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    capital: "",
    maxInvestmentPercent: "30",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    const capital = parseFloat(formData.capital);
    if (!formData.capital || isNaN(capital) || capital < 1000) {
      newErrors.capital = "Target capital must be at least 1,000 DH";
    }

    const maxPercent = parseFloat(formData.maxInvestmentPercent);
    if (
      !formData.maxInvestmentPercent ||
      isNaN(maxPercent) ||
      maxPercent < 1 ||
      maxPercent > 100
    ) {
      newErrors.maxInvestmentPercent =
        "Max percentage must be between 1 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Préparer les données exactement comme le backend les attend
    const projectData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      capital: parseFloat(formData.capital),
      maxInvestmentPercent: parseFloat(formData.maxInvestmentPercent),
    };

    console.log("Données envoyées:", projectData);

    try {
      const result = await dispatch(createProject(projectData)).unwrap();
      console.log("Réponse backend:", result);
      toast.success("Project created successfully!");
      await dispatch(fetchMyProjects());
      navigate("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      if (typeof error === "string") {
        toast.error(error);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create project");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h1
          style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}
        >
          Create New Project
        </h1>
        <p style={{ color: "#6b7280" }}>
          Launch your next campaign with investment from our community
        </p>
      </div>

      <div style={{ maxWidth: "800px", width: "100%" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {/* Title */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Project Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${errors.title ? "#ef4444" : "#e5e7eb"}`,
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            {errors.title && (
              <p
                style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe your project in detail..."
              style={{
                width: "100%",
                padding: "12px",
                border: `1px solid ${errors.description ? "#ef4444" : "#e5e7eb"}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
            {errors.description && (
              <p
                style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}
              >
                {errors.description}
              </p>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            {/* Target Capital */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Target Capital (DH) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="number"
                name="capital"
                value={formData.capital}
                onChange={handleChange}
                min="1000"
                step="1000"
                placeholder="e.g., 100000"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `1px solid ${errors.capital ? "#ef4444" : "#e5e7eb"}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              {errors.capital && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.capital}
                </p>
              )}
              <p
                style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}
              >
                Minimum: 1,000 DH
              </p>
            </div>

            {/* Max Investment Percent */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Max % per Investor
              </label>
              <input
                type="number"
                name="maxInvestmentPercent"
                value={formData.maxInvestmentPercent}
                onChange={handleChange}
                min="1"
                max="100"
                step="1"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `1px solid ${errors.maxInvestmentPercent ? "#ef4444" : "#e5e7eb"}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              {errors.maxInvestmentPercent && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.maxInvestmentPercent}
                </p>
              )}
              <p
                style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}
              >
                Maximum percentage of capital one investor can own (1-100%)
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div
            style={{
              background: "#eff6ff",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <p
              style={{
                fontWeight: "500",
                marginBottom: "8px",
                color: "#1e40af",
              }}
            >
              📋 Budget Information:
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                color: "#1e40af",
                fontSize: "14px",
              }}
            >
              <li>
                Target Capital:{" "}
                {parseFloat(formData.capital || 0).toLocaleString()} DH
              </li>
              <li>
                Max per investor: {formData.maxInvestmentPercent}% of total
                capital
              </li>
              <li>Project will close automatically when target is reached</li>
            </ul>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "16px" }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "12px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Creating..." : "Launch Campaign"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/projects")}
              style={{
                padding: "12px 24px",
                background: "#f3f4f6",
                color: "#374151",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
