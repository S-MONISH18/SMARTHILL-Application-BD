import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb
import joblib
import os

print("🌱 Starting Crop Prediction Model Training...")
print("=" * 60)

# ============================================================
# 1. GENERATE / LOAD DATASET
# ============================================================
# Standard crop recommendation dataset (2200 samples, 22 crops)
# Fields: N, P, K, temperature, humidity, ph, rainfall, label
#
# This mirrors the well-known Kaggle Crop Recommendation Dataset.
# If you have the downloaded CSV, replace this block with:
#   df = pd.read_csv('your_dataset.csv')

np.random.seed(42)

crops = {
    'rice':       {'N': (60, 100), 'P': (40, 60),  'K': (35, 50),  'temp': (20, 27), 'hum': (80, 90), 'ph': (5.5, 6.5), 'rain': (150, 250)},
    'maize':      {'N': (75, 110), 'P': (45, 70),  'K': (35, 50),  'temp': (18, 27), 'hum': (55, 75), 'ph': (5.5, 7.0), 'rain': (60, 120)},
    'chickpea':   {'N': (35, 65),  'P': (55, 80),  'K': (70, 100), 'temp': (15, 23), 'hum': (14, 25), 'ph': (6.0, 7.5), 'rain': (50, 90)},
    'kidneybeans':{'N': (15, 35),  'P': (55, 80),  'K': (15, 30),  'temp': (15, 22), 'hum': (18, 25), 'ph': (5.5, 6.5), 'rain': (90, 130)},
    'pigeonpeas': {'N': (15, 35),  'P': (55, 80),  'K': (55, 80),  'temp': (22, 30), 'hum': (40, 65), 'ph': (5.5, 6.5), 'rain': (90, 140)},
    'mothbeans':  {'N': (15, 35),  'P': (40, 60),  'K': (15, 30),  'temp': (24, 32), 'hum': (40, 55), 'ph': (3.5, 5.5), 'rain': (30, 65)},
    'mungbean':   {'N': (15, 35),  'P': (40, 60),  'K': (15, 30),  'temp': (25, 35), 'hum': (75, 90), 'ph': (6.0, 7.5), 'rain': (40, 80)},
    'blackgram':  {'N': (35, 55),  'P': (55, 75),  'K': (15, 30),  'temp': (25, 35), 'hum': (60, 75), 'ph': (5.5, 7.5), 'rain': (55, 80)},
    'lentil':     {'N': (15, 35),  'P': (55, 75),  'K': (15, 25),  'temp': (15, 25), 'hum': (55, 70), 'ph': (6.0, 7.5), 'rain': (20, 55)},
    'pomegranate':{'N': (15, 35),  'P': (40, 55),  'K': (35, 50),  'temp': (18, 25), 'hum': (85, 95), 'ph': (5.5, 7.5), 'rain': (60, 100)},
    'banana':     {'N': (95, 120), 'P': (70, 100), 'K': (45, 60),  'temp': (25, 35), 'hum': (75, 90), 'ph': (5.5, 6.5), 'rain': (100, 200)},
    'mango':      {'N': (15, 35),  'P': (15, 35),  'K': (15, 35),  'temp': (25, 35), 'hum': (45, 55), 'ph': (5.5, 7.5), 'rain': (85, 110)},
    'grapes':     {'N': (20, 40),  'P': (120, 145),'K': (195, 230),'temp': (8, 17),  'hum': (80, 95), 'ph': (5.5, 6.5), 'rain': (60, 75)},
    'watermelon': {'N': (95, 115), 'P': (10, 20),  'K': (45, 55),  'temp': (24, 30), 'hum': (80, 95), 'ph': (6.0, 7.0), 'rain': (40, 60)},
    'muskmelon':  {'N': (95, 115), 'P': (10, 20),  'K': (45, 55),  'temp': (25, 35), 'hum': (90, 100),'ph': (6.5, 7.5), 'rain': (20, 35)},
    'apple':      {'N': (0,  20),  'P': (120, 145),'K': (195, 230),'temp': (20, 28), 'hum': (88, 100),'ph': (5.5, 6.5), 'rain': (55, 70)},
    'orange':     {'N': (0,  20),  'P': (5,  20),  'K': (5,  15),  'temp': (10, 20), 'hum': (90, 100),'ph': (6.0, 7.5), 'rain': (50, 65)},
    'papaya':     {'N': (45, 65),  'P': (40, 65),  'K': (40, 55),  'temp': (32, 44), 'hum': (88, 100),'ph': (6.5, 7.5), 'rain': (130, 180)},
    'coconut':    {'N': (18, 35),  'P': (5,  25),  'K': (25, 45),  'temp': (25, 35), 'hum': (82, 100),'ph': (5.0, 6.5), 'rain': (130, 230)},
    'cotton':     {'N': (108, 140),'P': (35, 55),  'K': (165, 200),'temp': (23, 30), 'hum': (75, 85), 'ph': (6.0, 7.5), 'rain': (55, 85)},
    'jute':       {'N': (68, 95),  'P': (40, 65),  'K': (35, 55),  'temp': (22, 30), 'hum': (65, 90), 'ph': (6.5, 7.5), 'rain': (140, 190)},
    'coffee':     {'N': (95, 115), 'P': (15, 35),  'K': (25, 40),  'temp': (22, 29), 'hum': (52, 70), 'ph': (6.0, 6.9), 'rain': (145, 200)},
}

SAMPLES_PER_CROP = 100  # 100 × 22 = 2200 total (matches Kaggle dataset size)

rows = []
for crop, ranges in crops.items():
    for _ in range(SAMPLES_PER_CROP):
        row = {
            'N':           round(np.random.uniform(*ranges['N']), 2),
            'P':           round(np.random.uniform(*ranges['P']), 2),
            'K':           round(np.random.uniform(*ranges['K']), 2),
            'temperature': round(np.random.uniform(*ranges['temp']), 2),
            'humidity':    round(np.random.uniform(*ranges['hum']), 2),
            'ph':          round(np.random.uniform(*ranges['ph']), 2),
            'rainfall':    round(np.random.uniform(*ranges['rain']), 2),
            'label':       crop,
        }
        rows.append(row)

df = pd.DataFrame(rows)
df = df.sample(frac=1, random_state=42).reset_index(drop=True)  # shuffle

print(f"📊 Dataset shape: {df.shape}")
print(f"🌾 Crops ({len(df['label'].unique())}): {', '.join(sorted(df['label'].unique()))}")
print(f"\n{df.head()}\n")

# Save dataset for reference
df.to_csv('crop_dataset.csv', index=False)
print("✅ Dataset saved: crop_dataset.csv")

# ============================================================
# 2. ENCODE LABELS
# ============================================================
le = LabelEncoder()
y = le.fit_transform(df['label'])
X = df.drop('label', axis=1)

# Save label encoder classes
joblib.dump(le, 'label_encoder.pkl')
print(f"✅ Label Encoder saved: label_encoder.pkl")
print(f"   Classes: {list(le.classes_)}")

# ============================================================
# 3. TRAIN / TEST SPLIT
# ============================================================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\n📦 Train size: {X_train.shape[0]}  |  Test size: {X_test.shape[0]}")

# ============================================================
# 4. TRAIN ALL THREE ALGORITHMS
# ============================================================
models = {
    'RandomForest': RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        min_samples_split=2,
        random_state=42,
        n_jobs=-1
    ),
    'ExtraTrees': ExtraTreesClassifier(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    ),
    'XGBoost': xgb.XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        use_label_encoder=False,
        eval_metric='mlogloss',
        random_state=42,
        n_jobs=-1
    ),
}

results = {}
print("\n🏋️  Training models...")

for name, model in models.items():
    print(f"\n   ▶ Training {name}...")
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    results[name] = {'model': model, 'accuracy': acc}
    print(f"   ✅ {name} Accuracy: {acc * 100:.2f}%")

# ============================================================
# 5. SELECT BEST MODEL & SAVE
# ============================================================
best_name = max(results, key=lambda k: results[k]['accuracy'])
best_model = results[best_name]['model']
best_acc = results[best_name]['accuracy']

print(f"\n🏆 Best Model: {best_name}  →  {best_acc * 100:.2f}%")
print(f"\n📋 Classification Report for {best_name}:")
y_pred_best = best_model.predict(X_test)
print(classification_report(y_test, y_pred_best, target_names=le.classes_))

# Save BEST model
joblib.dump(best_model, 'best_model.pkl')
joblib.dump({'name': best_name, 'accuracy': best_acc}, 'model_meta.pkl')
print(f"\n✅ Best model saved: best_model.pkl  ({best_name})")

# Also save all models individually
for name, res in results.items():
    fname = f"{name.lower()}_model.pkl"
    joblib.dump(res['model'], fname)
    print(f"✅ Saved {fname}  (acc: {res['accuracy']*100:.2f}%)")

# Feature importance
print("\n📊 Feature Importances (best model):")
if hasattr(best_model, 'feature_importances_'):
    for feat, imp in sorted(zip(X.columns, best_model.feature_importances_), key=lambda x: -x[1]):
        print(f"   {feat}: {imp:.4f}")

print("\n🎉 Training Complete! All models saved.")
print("   Run  python app.py  to start the prediction API.")
