
import React, { useState, useEffect } from "react";
import apiService from "../../services/api";
import BlogCard from "./BlogCard";
import LoadingSpinner from "../Common/LoadingSpinner";

const BlogList = ({ user, refreshTrigger, onEditBlog }) => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [refreshTrigger]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const result = await apiService.getBlogs("?limit=20");

      if (result.success) {
        setBlogs(result.data.blogs || []);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (blogId) => {
    if (!user) return;

    try {
      await apiService.toggleLike(blogId);
      await fetchBlogs();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      await apiService.deleteBlog(blogId);
      alert("Blog deleted successfully!");
      await fetchBlogs();
    } catch (error) {
      alert(error.message || "Failed to delete blog");
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      (blog.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.content || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Loading blogs..." />;
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row">
        {filteredBlogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            user={user}
            onToggleLike={handleToggleLike}
            onDeleteBlog={handleDeleteBlog}
            onEditBlog={onEditBlog}
          />
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No blogs found</p>
        </div>
      )}
    </div>
  );
};

export default BlogList;
