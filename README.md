# Video Annotation Tool

This is a web-based video annotation tool built with React, Vite, and Tailwind CSS. It allows users to play videos and draw annotations directly on the video canvas.

## Features

- Video playback control (play, pause, seek).
- Drawing tools for annotating videos.
- Save/load annotations (future feature).

## Installation

To get this project up and running on your local machine, follow these steps:

### Prerequisites

Make sure you have Node.js and npm (Node Package Manager) installed on your system.

-   **Node.js**: [Download & Install Node.js](https://nodejs.org/en/download/)
-   **npm**: npm is included with Node.js.

### Clone the Repository

First, clone the repository to your local machine using Git:

```bash
git clone https://github.com/Sopwit/video-annutation-tool.git
cd video-annotation-tool
```

### Install Dependencies

Navigate into the project directory and install the required Node.js packages:

```bash
npm install
```

## Usage

To start the development server and run the application in your browser:

```bash
npm run dev
```

This will typically open the application at `http://localhost:5173` (or another available port).

## Project Structure

-   `src/`: Contains the main application source code.
    -   `components/`: Reusable React components (e.g., `VideoPlayer.jsx`, `CanvasOverlay.jsx`, `Toolbar.jsx`).
    -   `hooks/`: Custom React hooks (e.g., `useRecorder.js`).
    -   `App.jsx`: Main application component.
    -   `main.jsx`: Entry point for the React application.
-   `public/`: Static assets.

## Built With

-   [React](https://react.dev/) - A JavaScript library for building user interfaces.
-   [Vite](https://vitejs.dev/) - A next-generation frontend tooling.
-   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.

## Contributing

(Optional section - if you plan to accept contributions)
Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details. (If you have a LICENSE.md file, otherwise remove or adapt)