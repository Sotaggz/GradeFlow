# How to Run This Project Locally

This project is a React application built with Vite. Follow these steps to run it on your own computer.

## Prerequisites

1.  **Install Node.js**: Download and install the latest "LTS" version from [nodejs.org](https://nodejs.org/).

## Installation

1.  Open your terminal (Command Prompt, PowerShell, or Terminal).
2.  Navigate to the folder where you extracted this project.
3.  Run the following command to install dependencies:

    ```bash
    npm install
    ```

## Running the App

To start the application in development mode:

```bash
npm run dev:client
```

> **Note**: Do not run `npm run dev`, as that attempts to start a backend server which is not configured for your local environment.

Open your browser and navigate to `http://localhost:5000`.

## Building for Production

To create a production build (static files):

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
