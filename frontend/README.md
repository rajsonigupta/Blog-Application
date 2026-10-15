# BlogApp Frontend

This is the ReactJS front-end for the BlogApp project. It provides a minimal design with Bootstrap for styling and includes essential pages for user interaction.

## Features

- **Home Page**: Welcome page for the application.
- **Login Page**: Allows users to log in to their accounts.
- **Register Page**: Enables new users to create an account.
- **Navbar**: Navigation bar for easy access to different pages.

## Technologies Used

- ReactJS
- React Router for routing
- Bootstrap for styling

## Folder Structure

```
blog-app-client/
├── public/               # Static assets
│   └── vite.svg          # Vite logo
├── src/                  # Source code
│   ├── components/       # Reusable components
│   │   ├── Navbar.jsx    # Navigation bar
│   ├── pages/            # Application pages
│   │   ├── Home.jsx      # Home page
│   │   ├── Login.jsx     # Login page
│   │   ├── Register.jsx  # Register page
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   ├── App.css           # Global styles
│   └── index.css         # Index styles
├── package.json          # Project dependencies and scripts
├── vite.config.js        # Vite configuration
└── README.md             # Project documentation
```

## Installation

1. Navigate to the `blog-app-client` directory:
   ```bash
   cd blog-app-client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build.

## API Integration

This front-end communicates with the BlogApp backend API. Ensure the backend server is running and accessible at the correct URL.

## License

This project is licensed under the MIT License.
