import React, { useState, useEffect } from "react";
import apiService from "../../services/api";
import { VIEWS } from "../../utils/constants";
import ErrorAlert from "../Common/ErrorAlert";

const CreateBlog = ({
  setCurrentView,
  onBlogCreated,
  editBlog = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editBlog) {
      setFormData({
        title: editBlog.title || "",
        content: editBlog.content || "",
        summary: editBlog.summary || "",
        tags: (editBlog.tags || []).join(", "),
      });
    }
  }, [editBlog]);

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const blogData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editBlog) {
        await apiService.updateBlog(editBlog._id, blogData);
      } else {
        await apiService.createBlog(blogData);
      }

      onBlogCreated?.();
      setCurrentView(VIEWS.BLOGS);
    } catch (error) {
      setError(error.message || "Failed to save blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">
              {editBlog ? "Edit Blog" : "Write New Blog"}
            </h3>

            {error && (
              <ErrorAlert
                message={error}
                onDismiss={() => setError("")}
              />
            )}

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Blog Title"
                value={formData.title}
                onChange={(e) =>
                  handleInputChange("title", e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Summary (optional)"
                value={formData.summary}
                onChange={(e) =>
                  handleInputChange("summary", e.target.value)
                }
                rows="3"
              />
            </div>

            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Write your blog content here..."
                value={formData.content}
                onChange={(e) =>
                  handleInputChange("content", e.target.value)
                }
                rows="10"
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={(e) =>
                  handleInputChange("tags", e.target.value)
                }
              />
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editBlog
                  ? "Update Blog"
                  : "Publish Blog"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setCurrentView(VIEWS.BLOGS)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;