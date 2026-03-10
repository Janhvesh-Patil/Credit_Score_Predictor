from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# ── Load artifacts once at startup ──────────────────────────────────────────
lr_model        = joblib.load('lr_model.pkl')
scaler          = joblib.load('scaler.pkl')
feature_names   = joblib.load('feature_names.pkl')
shap_explainer  = joblib.load('shap_explainer.pkl')


# ── Helpers ──────────────────────────────────────────────────────────────────
def prepare_input(data: dict) -> np.ndarray:
    """Validate, align columns, and scale a raw input dict."""
    input_df = pd.DataFrame([data], columns=feature_names)
    return scaler.transform(input_df)


def get_rule_based_factors(data: dict) -> list:
    """
    Lightweight rule-based reasons shown alongside SHAP.
    Acts as a human-readable cross-check for the judge demo.
    """
    factors = []
    if data.get('Debt_Equity_Ratio', 0) > 2.5:
        factors.append("High Debt-to-Equity Ratio (> 2.5)")
    if data.get('Net_Income', 0) < 0:
        factors.append("Negative Net Income")
    if data.get('Cash_Flow', 0) < 0:
        factors.append("Negative Cash Flow")
    if data.get('Return_on_Assets', 0) < 0:
        factors.append("Negative Return on Assets")
    if data.get('Working_Capital_Ratio', 0) < 1.2:
        factors.append("Low Working Capital Ratio (< 1.2)")
    if data.get('Volatility_Index', 0) > 50:
        factors.append("High Market Volatility Index (> 50)")
    if data.get('Interest_Rate', 0) > 7.5:
        factors.append("High Prevailing Interest Rate (> 7.5%)")
    return factors if factors else ["No major rule-based risk flags identified"]


# ── Routes ───────────────────────────────────────────────────────────────────
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "Intelli-Credit ML API is running ✅"})


@app.route('/predict', methods=['POST'])
def predict():
    """
    Accepts a JSON body with all feature values.
    Returns prediction label, confidence scores, and rule-based risk factors.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        input_scaled = prepare_input(data)

        prediction  = lr_model.predict(input_scaled)[0]
        probability = lr_model.predict_proba(input_scaled)[0]

        return jsonify({
            "prediction": int(prediction),
            "label": "HIGH RISK" if prediction == 1 else "LOW RISK",
            "confidence": {
                "low_risk":  round(float(probability[0]) * 100, 2),
                "high_risk": round(float(probability[1]) * 100, 2)
            },
            "risk_factors": get_rule_based_factors(data)
        }), 200

    except KeyError as e:
        return jsonify({"error": f"Missing feature in input: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/explain', methods=['POST'])
def explain():
    """
    Accepts the same JSON body as /predict.
    Returns SHAP values for the top 8 most influential features,
    each tagged with direction and human-readable impact label.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        input_scaled = prepare_input(data)

        # ── SHAP values for Logistic Regression ──────────────────────────────
        # LinearExplainer returns shape (n_samples, n_features) for binary
        # classification — index [0] gives the single sample's values.
        raw = shap_explainer.shap_values(input_scaled)

        # shap_values can return a list (one array per class) or a single array
        # depending on the shap version. Handle both safely.
        if isinstance(raw, list):
            # raw[1] = SHAP values for class 1 (High Risk)
            sample_shap = np.array(raw[1][0])
        else:
            # Single 2-D array → take first row
            sample_shap = np.array(raw[0])

        # ── Pair, sort, format ────────────────────────────────────────────────
        pairs = list(zip(feature_names, sample_shap.tolist()))
        pairs_sorted = sorted(pairs, key=lambda x: abs(x[1]), reverse=True)

        top_features = [
            {
                "feature":      name,
                "shap_value":   round(value, 4),
                "direction":    "Increases Risk" if value > 0 else "Decreases Risk",
                "input_value":  round(float(data.get(name, 0)), 4),
                "impact_label": _impact_label(abs(value))
            }
            for name, value in pairs_sorted[:8]
        ]

        # base_value can also be a list in some shap versions
        base = shap_explainer.expected_value
        base_value = float(base[1]) if hasattr(base, '__len__') else float(base)

        return jsonify({
            "base_value":  round(base_value, 4),
            "explanation": top_features
        }), 200

    except KeyError as e:
        return jsonify({"error": f"Missing feature in input: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/predict_and_explain', methods=['POST'])
def predict_and_explain():
    """
    Convenience endpoint — calls both /predict and /explain logic
    in a single request. Useful for the frontend to make one call
    and populate both the result card and the SHAP chart together.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        input_scaled = prepare_input(data)

        # Prediction
        prediction  = lr_model.predict(input_scaled)[0]
        probability = lr_model.predict_proba(input_scaled)[0]

        # SHAP
        raw = shap_explainer.shap_values(input_scaled)
        if isinstance(raw, list):
            sample_shap = np.array(raw[1][0])
        else:
            sample_shap = np.array(raw[0])

        pairs = list(zip(feature_names, sample_shap.tolist()))
        pairs_sorted = sorted(pairs, key=lambda x: abs(x[1]), reverse=True)

        top_features = [
            {
                "feature":      name,
                "shap_value":   round(value, 4),
                "direction":    "Increases Risk" if value > 0 else "Decreases Risk",
                "input_value":  round(float(data.get(name, 0)), 4),
                "impact_label": _impact_label(abs(value))
            }
            for name, value in pairs_sorted[:8]
        ]

        base = shap_explainer.expected_value
        base_value = float(base[1]) if hasattr(base, '__len__') else float(base)

        return jsonify({
            "prediction": int(prediction),
            "label":      "HIGH RISK" if prediction == 1 else "LOW RISK",
            "confidence": {
                "low_risk":  round(float(probability[0]) * 100, 2),
                "high_risk": round(float(probability[1]) * 100, 2)
            },
            "risk_factors": get_rule_based_factors(data),
            "base_value":   round(base_value, 4),
            "explanation":  top_features
        }), 200

    except KeyError as e:
        return jsonify({"error": f"Missing feature in input: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/features', methods=['GET'])
def get_features():
    """
    Returns the list of expected feature names in correct order.
    Useful for the frontend to dynamically build the input form.
    """
    return jsonify({"feature_names": feature_names})


# ── Internal utility ─────────────────────────────────────────────────────────
def _impact_label(abs_val: float) -> str:
    """Converts a raw SHAP magnitude into a human-readable impact tier."""
    if abs_val >= 0.20:
        return "Strong"
    elif abs_val >= 0.10:
        return "Moderate"
    elif abs_val >= 0.03:
        return "Mild"
    else:
        return "Negligible"


if __name__ == '__main__':
    app.run(debug=True, port=5000)