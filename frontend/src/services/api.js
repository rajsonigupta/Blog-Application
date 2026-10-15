import { API_BASE } from "../utils/constants";

class ApiService {
  async call(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body !== "string") {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  // Auth methods
  async login(credentials) {
    return this.call("/auth/login", {
      method: "POST",
      body: credentials,
    });
  }

  async register(userData) {
    return this.call("/auth/register", {
      method: "POST",
      body: userData,
    });
  }

  async getMe() {
    return this.call("/auth/me");
  }

  async updateProfile(profileData) {
    return this.call("/auth/profile", {
      method: "PUT",
      body: profileData,
    });
  }

  // Blog methods
  async getBlogs(params = "") {
    return this.call(`/blogs${params}`);
  }

  async createBlog(blogData) {
    return this.call("/blogs", {
      method: "POST",
      body: blogData,
    });
  }

  async toggleLike(blogId) {
    return this.call(`/blogs/${blogId}/like`, {
      method: "POST",
    });
  }

  // Edit blog
  async updateBlog(blogId, blogData) {
    return this.call(`/blogs/${blogId}`, {
      method: "PUT",
      body: blogData,
    });
  }

  // Delete blog
  async deleteBlog(blogId) {
    return this.call(`/blogs/${blogId}`, {
      method: "DELETE",
    });
  }
}

export default new ApiService();