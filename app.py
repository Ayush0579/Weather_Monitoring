from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the models
condition_model = joblib.load('condition_model.pkl')
crop_model = joblib.load('crop_prediction_model.pkl')

# Define all conditions and crops
all_conditions = [
    "DEPRESSION/CYCLONE", "DROUGHT", "THUNDERSTORM", "FROST", "DRY WAVE",
    "POLLUTION/ASPHYXIATION", "HYPOXIA/HACE", "HAZE/FOG", "HEATWAVE",
    "DOWNPOURS", "NARCOSIS/DECOMPRESSION", "SUNBURN/DEHYDRATION", "UNKNOWN"
]

all_crops = ["Rice", "Wheat", "Corn", "Soybean", "Barley", "Sugarcane", "Cotton", "Potato", "Tomato", "Onion"]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        df = pd.DataFrame([data])
        
        # Predict conditions
        condition_preds = condition_model.predict(df)
        condition_results = {cond: int(pred) for cond, pred in zip(all_conditions, condition_preds[0])}
        
        # Predict crops
        crop_preds = crop_model.predict(df)
        crop_results = {crop: int(pred) for crop, pred in zip(all_crops, crop_preds[0])}
        
        return jsonify({
            'conditions': condition_results,
            'crops': crop_results
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
