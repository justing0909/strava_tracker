# Python Front End Server

This project sets up a Flask server to host a front-end application that interacts with the Strava API. 

## Project Structure

```
python-front-end-server
├── src
│   ├── app.py                # Main application file that sets up the Flask server
│   ├── static
│   │   └── index.html        # Main HTML page served by the application
│   ├── templates
│   │   └── layout.html       # Template for rendering dynamic content
│   └── test_strava.ipynb     # Jupyter notebook for Strava API interaction
├── requirements.txt          # Lists project dependencies
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd python-front-end-server
   ```

2. **Install dependencies**:
   Make sure you have Python and pip installed. Then run:
   ```
   pip install -r requirements.txt
   ```

3. **Run the application**:
   Start the Flask server by running:
   ```
   python src/app.py
   ```
   The server will be accessible at `http://localhost:0909`.

## Usage

- Navigate to `http://localhost:0909` in your web browser to view the front-end application.
- The application will serve the static HTML page and handle any API requests as defined in `app.py`.

## Additional Information

- The `test_strava.ipynb` file contains code for interacting with the Strava API, which can be integrated into the Flask application for backend functionality.
- Modify `layout.html` to customize the dynamic content rendering as needed.