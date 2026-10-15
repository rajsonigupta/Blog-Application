import React from "react";
import { VIEWS } from "../../utils/constants";

const Navbar = ({ user, currentView, setCurrentView, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        <span className="navbar-brand">📝 Blog App</span>
        <div className="navbar-nav ms-auto">
          <button
            className="btn btn-link text-white me-2"
            onClick={() => setCurrentView(VIEWS.BLOGS)}
          >
            Home
          </button>
          {user ? (
            <>
              <button
                className="btn btn-link text-white me-2"
                onClick={() => setCurrentView(VIEWS.CREATE)}
              >
                Write
              </button>
              <button
                className="btn btn-link text-white me-2"
                onClick={() => setCurrentView(VIEWS.PROFILE)}
              >
                Profile
              </button>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => setCurrentView(VIEWS.AUTH)}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
