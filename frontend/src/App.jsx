
import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { VIEWS } from "./utils/constants";
import Navbar from "./components/Layout/Navbar";
import AuthForm from "./components/Auth/AuthForm";
import BlogList from "./components/Blog/BlogList";
import CreateBlog from "./components/Blog/CreateBlog";
import Profile from "./components/Profile/Profile";
import LoadingSpinner from "./components/Common/LoadingSpinner";

const App = () => {
  const { user, loading, login, register, logout, updateUser } = useAuth();

  const [currentView, setCurrentView] = useState(VIEWS.BLOGS);
  const [blogRefreshTrigger, setBlogRefreshTrigger] = useState(0);
  const [editingBlog, setEditingBlog] = useState(null);

  const handleLogout = () => {
    logout();
    setCurrentView(VIEWS.BLOGS);
    setEditingBlog(null);
  };

  const handleBlogCreated = () => {
    setBlogRefreshTrigger((prev) => prev + 1);
    setEditingBlog(null);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setCurrentView(VIEWS.CREATE);
  };

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setCurrentView(VIEWS.CREATE);
  };

  if (loading) {
    return <LoadingSpinner text="Initializing app..." />;
  }

  return (
    <div className="container-fluid">
      <Navbar
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        onCreateBlog={handleCreateBlog}
      />

      <div className="container">
        {currentView === VIEWS.AUTH && (
          <AuthForm
            onLogin={login}
            onRegister={register}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === VIEWS.BLOGS && (
          <BlogList
            user={user}
            refreshTrigger={blogRefreshTrigger}
            onEditBlog={handleEditBlog}
          />
        )}

        {currentView === VIEWS.CREATE && (
          <CreateBlog
            setCurrentView={setCurrentView}
            onBlogCreated={handleBlogCreated}
            editBlog={editingBlog}
          />
        )}

        {currentView === VIEWS.PROFILE && (
          <Profile user={user} onUserUpdate={updateUser} />
        )}
      </div>
    </div>
  );
};

export default App;
