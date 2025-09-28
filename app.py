import os
import base64
import uuid
from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GENERATED_DIR = os.path.join(BASE_DIR, 'static', 'generated')
os.makedirs(GENERATED_DIR, exist_ok=True)

# Predefined templates (relative paths for Jinja)
POSTER_TEMPLATES = [
    {"key": "inception", "name": "Inception", "path": "/static/images/inception.svg"},
    {"key": "matrix", "name": "The Matrix", "path": "/static/images/matrix.svg"},
    {"key": "starwars", "name": "Star Wars", "path": "/static/images/starwars.svg"},
]

@app.route('/')
def index():
    return render_template('index.html', templates=POSTER_TEMPLATES)

@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.get_json(silent=True) or {}
        name = data.get('name', '').strip()
        template_key = data.get('template', 'inception')
        image_data_url = data.get('imageData', '')

        if not name:
            return jsonify({"ok": False, "error": "Name is required."}), 400
        if not image_data_url.startswith('data:image'):
            return jsonify({"ok": False, "error": "Invalid image data."}), 400

        # Parse data URL
        header, b64data = image_data_url.split(',', 1)
        ext = 'png' if 'image/png' in header else 'jpg'
        img_bytes = base64.b64decode(b64data)

        filename = f"poster_{uuid.uuid4().hex}.{ext}"
        file_path = os.path.join(GENERATED_DIR, filename)
        with open(file_path, 'wb') as f:
            f.write(img_bytes)

        rel_url = f"/static/generated/{filename}"
        return jsonify({"ok": True, "image_url": rel_url, "redirect": url_for('success', img=rel_url)})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route('/success')
def success():
    img = request.args.get('img', '')
    return render_template('success.html', image_url=img)

if __name__ == '__main__':
    app.run(debug=True)
