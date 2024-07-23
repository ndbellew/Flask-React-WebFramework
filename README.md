
# Flask-React Template

This project is a template for creating a web application using a Flask backend and a React frontend.

## Project Structure

```
project/
│
├── backend/
│   ├── app.py               # Flask application
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico      # Favicon
│   │   └── index.html       # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── navigations/
│   │   │   │   ├── MenuBar.js
│   │   │   │   ├── Footer.js
│   │   │   │   └── NavBar.js
│   │   │   ├── pages/
│   │   │   │   ├── Home.js
│   │   │   │   ├── AboutUs.js
│   │   │   │   └── ContactUs.js
│   │   ├── App.js           # Main React application
│   │   ├── App.css          # CSS for React application
│   │   └── index.js         # Entry point for React
│   └── package.json         # JavaScript dependencies
│
└── README.md                # Project documentation
```

## Backend Setup

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2. Create a virtual environment:
    ```bash
    python3 -m venv venv
    ```

3. Activate the virtual environment:
    - On Windows:
        ```bash
        venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

4. Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5. Run the Flask application:
    ```bash
    flask run
    ```

## Frontend Setup

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the React application:
    ```bash
    npm start
    ```

## Usage

- The Flask backend will be running on `http://127.0.0.1:5000`.
- The React frontend will be running on `http://localhost:3000`.

When the application is running, you will see a navigation bar with links to the Home, About Us, and Contact Us pages. The home page includes a button that fetches and displays the current time from the Flask backend.

## Code Explanation

### Flask Backend (`app.py`)

This is a simple Flask application with an endpoint `/time` that returns the current time in JSON format.

### React Frontend (`App.js`)

The main React application (`App.js`) sets up the routing for the Home, About Us, and Contact Us pages. It also includes a button that fetches the current time from the Flask backend and displays it on the button itself.

### Navigation (`NavBar.js`)

The `NavBar.js` component creates a Bootstrap-styled navigation bar with links to the different pages.

## Dependencies

### Backend

- Flask

### Frontend

- React
- Bootstrap
- react-router-dom

## License

This project is licensed under the MIT License.
