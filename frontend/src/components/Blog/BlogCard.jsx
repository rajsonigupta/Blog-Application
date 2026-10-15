import React from "react";

const BlogCard = ({
  blog,
  user,
  onToggleLike,
  onDeleteBlog,
  onEditBlog,
}) => {
  const isLiked = blog.likes?.some(
    (like) =>
      (typeof like === "string" ? like : like.user?._id || like.user) ===
      user?._id
  );

  const isOwner =
    user?._id &&
    (blog.author?._id || blog.author) === user._id;

  return (
    <div className="col-md-6 mb-4">
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{blog.title}</h5>

          <p className="card-text">
            {blog.summary || blog.content?.substring(0, 150)}...
          </p>

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              By {blog.author?.username} • {blog.readTime} min read
            </small>

            {user && (
              <button
                className={`btn btn-sm ${
                  isLiked ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => onToggleLike(blog._id)}
              >
                ♥ {blog.likesCount || blog.likes?.length || 0}
              </button>
            )}
          </div>

          {blog.tags && (
            <div className="mt-2">
              {blog.tags.map((tag) => (
                <span key={tag} className="badge bg-secondary me-1">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isOwner && (
            <div className="mt-3 d-flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onEditBlog(blog)}
              >
                Edit
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDeleteBlog(blog._id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;