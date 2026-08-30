import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

CSV = "crop_dataset.csv"

df = pd.read_csv(CSV)

features = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall"
]

X = df[features]
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("=" * 60)
print("MODEL EVALUATION")
print("=" * 60)

print(f"Total samples : {len(df)}")
print(f"Training      : {len(X_train)}")
print(f"Testing       : {len(X_test)}")

print()
print(f"Accuracy      : {accuracy_score(y_test, y_pred):.4f}")

print()
print("CLASSIFICATION REPORT")
print("=" * 60)
print(classification_report(y_test, y_pred))

print()
print("CONFUSION MATRIX")
print("=" * 60)
print(confusion_matrix(y_test, y_pred))