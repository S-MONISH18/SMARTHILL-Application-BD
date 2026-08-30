"""
🌱 SmartHill Crop Prediction API
Flask service that loads the best trained ML model and serves predictions.
Endpoint: POST /predict
Body:    { N, P, K, temperature, humidity, ph, rainfall }
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
import sys

app = Flask(__name__)
CORS(app)

# ============================================================
# LOAD MODELS
# ============================================================
BASE = os.path.dirname(os.path.abspath(__file__))

def load_artifacts():
    model_path = os.path.join(BASE, 'best_model.pkl')
    le_path    = os.path.join(BASE, 'label_encoder.pkl')
    meta_path  = os.path.join(BASE, 'model_meta.pkl')

    if not os.path.exists(model_path):
        print("❌ best_model.pkl not found! Run: python train_model.py", file=sys.stderr)
        return None, None, None

    model = joblib.load(model_path)
    le    = joblib.load(le_path)
    meta  = joblib.load(meta_path)
    print(f"✅ Model loaded: {meta['name']}  (accuracy: {meta['accuracy']*100:.2f}%)")
    return model, le, meta

model, le, meta = load_artifacts()

# ============================================================
# CROP INFO MAP  (emoji + tips returned to the app)
# ============================================================
CROP_INFO = {
    'rice':        {'emoji': '🌾', 'season': 'Kharif',  'tip': 'Needs flooded fields and high humidity.'},
    'maize':       {'emoji': '🌽', 'season': 'Kharif',  'tip': 'Grows best with moderate rain and warm weather.'},
    'chickpea':    {'emoji': '🫘', 'season': 'Rabi',    'tip': 'Drought tolerant, prefers cool dry climate.'},
    'kidneybeans': {'emoji': '🫘', 'season': 'Kharif',  'tip': 'Needs well-drained loamy soil.'},
    'pigeonpeas':  {'emoji': '🌿', 'season': 'Kharif',  'tip': 'Drought resistant legume.'},
    'mothbeans':   {'emoji': '🌿', 'season': 'Kharif',  'tip': 'Very drought tolerant, sandy soils.'},
    'mungbean':    {'emoji': '🌿', 'season': 'Kharif',  'tip': 'Short duration, high protein crop.'},
    'blackgram':   {'emoji': '🌿', 'season': 'Kharif',  'tip': 'Thrives in hot and humid climates.'},
    'lentil':      {'emoji': '🫘', 'season': 'Rabi',    'tip': 'Cool-season crop, shallow roots.'},
    'pomegranate': {'emoji': '🍎', 'season': 'Annual',  'tip': 'Drought tolerant once established.'},
    'banana':      {'emoji': '🍌', 'season': 'Annual',  'tip': 'High water needs, tropical crop.'},
    'mango':       {'emoji': '🥭', 'season': 'Annual',  'tip': 'Prefers hot dry weather during flowering.'},
    'grapes':      {'emoji': '🍇', 'season': 'Annual',  'tip': 'Needs well-drained soils and plenty of sun.'},
    'watermelon':  {'emoji': '🍉', 'season': 'Summer',  'tip': 'High water needs, warm sandy soil.'},
    'muskmelon':   {'emoji': '🍈', 'season': 'Summer',  'tip': 'Prefers hot dry climate with irrigation.'},
    'apple':       {'emoji': '🍎', 'season': 'Annual',  'tip': 'Requires cold winters for dormancy.'},
    'orange':      {'emoji': '🍊', 'season': 'Annual',  'tip': 'Subtropical tree, needs mild winters.'},
    'papaya':      {'emoji': '🍈', 'season': 'Annual',  'tip': 'Tropical fruit, very sensitive to frost.'},
    'coconut':     {'emoji': '🥥', 'season': 'Annual',  'tip': 'Coastal crop needing high humidity.'},
    'cotton':      {'emoji': '🪴', 'season': 'Kharif',  'tip': 'Needs warm climate and well-drained soil.'},
    'jute':        {'emoji': '🌿', 'season': 'Kharif',  'tip': 'Grows in warm and humid conditions.'},
    'coffee':      {'emoji': '☕', 'season': 'Annual',  'tip': 'Shade grown, needs high altitude.'},
    # zenodo extras
    'pepper':      {'emoji': '🌶️', 'season': 'Kharif',  'tip': 'Needs well-drained fertile soil.'},
    'soybean':     {'emoji': '🫘', 'season': 'Kharif',  'tip': 'Nitrogen-fixing legume.'},
    'beans':       {'emoji': '🫘', 'season': 'Kharif',  'tip': 'Rich in protein, needs moderate water.'},
    'guineacorn':  {'emoji': '🌾', 'season': 'Kharif',  'tip': 'Drought tolerant cereal grain.'},
    'cassava':     {'emoji': '🍠', 'season': 'Annual',  'tip': 'Drought tolerant root crop.'},
    'tomatoes':    {'emoji': '🍅', 'season': 'Annual',  'tip': 'Warm season crop, needs staking.'},
    'yam':         {'emoji': '🍠', 'season': 'Annual',  'tip': 'Tropical tuber, needs rich organic soil.'},
}

# ============================================================
# ROUTES
# ============================================================
@app.route('/health', methods=['GET'])
def health():
    if model is None:
        return jsonify({'status': 'error', 'message': 'Model not loaded. Run train_model.py first.'}), 500
    return jsonify({
        'status': 'ok',
        'model':  meta['name'],
        'accuracy': f"{meta['accuracy']*100:.2f}%",
        'crops': list(le.classes_),
    })

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'success': False, 'error': 'Model not loaded. Run train_model.py first.'}), 500

    data = request.get_json(force=True)
    print(f"📥 Prediction request: {data}")

    # Validate and parse inputs
    required = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    missing = [f for f in required if f not in data or data[f] == '' or data[f] is None]
    if missing:
        return jsonify({'success': False, 'error': f"Missing fields: {', '.join(missing)}"}), 400

    try:
        features = np.array([[
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall']),
        ]])
    except (ValueError, TypeError) as e:
        return jsonify({'success': False, 'error': f"Invalid numeric value: {e}"}), 400

    # Predict
    pred_idx   = model.predict(features)[0]
    pred_proba = model.predict_proba(features)[0]
    confidence = float(round(max(pred_proba) * 100, 2))

    crop_name = le.inverse_transform([pred_idx])[0]
    info      = CROP_INFO.get(crop_name, {'emoji': '🌱', 'season': 'N/A', 'tip': ''})

    # Top 3 alternatives
    top3_idx   = np.argsort(pred_proba)[::-1][:3]
    alternatives = [
        {'crop': le.inverse_transform([i])[0], 'confidence': round(pred_proba[i] * 100, 1)}
        for i in top3_idx
    ]

    response = {
        'success':      True,
        'crop':         crop_name,
        'emoji':        info['emoji'],
        'season':       info['season'],
        'tip':          info['tip'],
        'confidence':   confidence,
        'model_used':   meta['name'],
        'alternatives': alternatives,
    }

    print(f"✅ Prediction: {crop_name}  ({confidence}%)")
    return jsonify(response)


@app.route('/predict-all-models', methods=['POST'])
def predict_all():
    """Compare predictions across all three models."""
    data = request.get_json(force=True)
    required = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({'success': False, 'error': f"Missing: {', '.join(missing)}"}), 400

    try:
        features = np.array([[
            float(data['N']), float(data['P']), float(data['K']),
            float(data['temperature']), float(data['humidity']),
            float(data['ph']), float(data['rainfall']),
        ]])
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

    results = {}
    model_files = {
        'RandomForest': 'randomforest_model.pkl',
        'ExtraTrees':   'extratrees_model.pkl',
        'XGBoost':      'xgboost_model.pkl',
    }
    for name, fname in model_files.items():
        fpath = os.path.join(BASE, fname)
        if os.path.exists(fpath):
            m = joblib.load(fpath)
            idx  = m.predict(features)[0]
            prob = m.predict_proba(features)[0]
            results[name] = {
                'crop':       le.inverse_transform([idx])[0],
                'confidence': round(float(max(prob)) * 100, 2),
            }

    return jsonify({'success': True, 'results': results})


if __name__ == '__main__':
    print("🚀 SmartHill ML Service starting on http://0.0.0.0:5001")
    app.run(host='0.0.0.0', port=5001, debug=False)
