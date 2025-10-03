# Cinema Poster Creator

A Flask web application that allows users to create personalized cinema posters with their names on pre-existing movie templates.

## Features

- **Interactive Poster Creation**: Type your name and see it rendered on classic movie poster templates
- **Multiple Templates**: Choose from Inception, The Matrix, and Star Wars themed posters
- **3D Parallax Effect**: Mouse-tracking parallax animation for an immersive experience
- **Cursor Glow Effect**: Dynamic cursor-following glow effect
- **Auto Font Sizing**: Automatically adjusts font size based on name length while maintaining design balance
- **Download Options**: Save posters as PNG or JPG
- **Server Storage**: Save generated posters to the server
- **Responsive Design**: Built with Bootstrap 5 for mobile and desktop compatibility

## Tech Stack

- **Backend**: Flask 3.0
- **Frontend**: HTML5, Bootstrap 5, jQuery
- **Canvas API**: For dynamic poster rendering
- **CSS3**: Minimal styling with parallax and glow effects

## Project Structure

```
project/
├── app.py                      # Flask backend with routes
├── requirements.txt            # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css          # Cinematic styling
│   ├── js/
│   │   └── script.js          # Canvas rendering & interactions
│   ├── images/
│   │   ├── inception.svg      # Inception template
│   │   ├── matrix.svg         # Matrix template
│   │   └── starwars.svg       # Star Wars template
│   └── generated/             # Saved poster images
└── templates/
    ├── index.html             # Main page
    └── success.html           # Success confirmation page
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/RamNag-777/Cinema-Poster-Project-Full-Stack-.git
cd Cinema-Poster-Project-Full-Stack-
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

4. Open your browser and navigate to:
```
http://127.0.0.1:5000
```

## Usage

1. Enter your name in the input field
2. Select a movie poster template from the dropdown
3. Move your mouse over the poster to see the parallax effect
4. Click **Download PNG** or **Download JPG** to save locally
5. Click **Save to Server** to upload and view the confirmation page

## Routes

- `/` - Home page with poster creator form
- `/submit` - POST endpoint for saving posters (accepts JSON with name, template, and imageData)
- `/success` - Confirmation page showing the saved poster

## Features in Detail

### Auto Font Sizing
Uses binary search algorithm to fit text within a fixed area while maintaining visual balance, regardless of name length.

### Parallax Effect
Three-layer depth effect that responds to mouse movement:
- Background layer (furthest)
- Mid layer
- Front layer with poster (closest)

### Canvas Rendering
- Loads SVG templates as backgrounds
- Applies cinematic vignette overlay
- Renders text with glow and stroke effects
- Exports to PNG/JPG formats

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## License

This project is created for educational purposes.

## Author

RamNag-777

## Date

September - October 2025
