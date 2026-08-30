#!/bin/bash
# ============================================================
# 🌱 SmartHill ML Service Startup Script (venv-based)
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VENV_DIR="$SCRIPT_DIR/venv"

echo "=============================================="
echo "  🌱 SmartHill Crop Prediction ML Service"
echo "=============================================="

# ── 1. Find Python ──────────────────────────────────────────
PYTHON=""
for cmd in python3 python; do
  if command -v "$cmd" &>/dev/null; then
    PYTHON="$cmd"
    echo "✅ Using Python: $PYTHON ($($PYTHON --version 2>&1))"
    break
  fi
done

if [ -z "$PYTHON" ]; then
  echo "❌ Python not found. Install it with:  sudo apt install python3 python3-venv python3-full"
  exit 1
fi

# ── 2. Ensure python3-venv is available ────────────────────
if ! $PYTHON -c "import venv" &>/dev/null; then
  echo "⚙️  python3-venv not found, installing..."
  sudo apt install -y python3-venv python3-full
fi

# ── 3. Create virtual environment ─────────────────────────
if [ ! -d "$VENV_DIR" ]; then
  echo "🔧 Creating virtual environment at ./venv ..."
  $PYTHON -m venv "$VENV_DIR"
  echo "✅ Virtual environment created"
else
  echo "✅ Existing virtual environment found: ./venv"
fi

# ── 4. Activate venv ───────────────────────────────────────
source "$VENV_DIR/bin/activate"
echo "✅ venv activated: $(python --version)"

# ── 5. Upgrade pip inside venv ────────────────────────────
echo "📦 Upgrading pip inside venv..."
pip install --upgrade pip --quiet

# ── 6. Install ML dependencies ────────────────────────────
echo "📦 Installing ML dependencies (this takes ~2 min first time)..."
pip install \
  flask==2.3.3 \
  flask-cors==4.0.0 \
  "scikit-learn>=1.3.0" \
  "xgboost>=2.0.0" \
  pandas \
  numpy \
  joblib

if [ $? -ne 0 ]; then
  echo "❌ Dependency installation failed!"
  exit 1
fi
echo "✅ All dependencies installed"

# ── 7. Train model if not already trained ─────────────────
if [ ! -f "$SCRIPT_DIR/best_model.pkl" ]; then
  echo ""
  echo "🏋️  Training ML model (first-time setup — ~30 seconds)..."
  python "$SCRIPT_DIR/train_model.py"
  if [ $? -ne 0 ]; then
    echo "❌ Model training failed!"
    exit 1
  fi
  echo "✅ Model training complete!"
else
  echo "✅ Trained model found: best_model.pkl  (skip training)"
  echo "   Delete best_model.pkl and re-run to retrain"
fi

# ── 8. Start Flask API ─────────────────────────────────────
echo ""
echo "🚀 Starting Flask ML API on http://0.0.0.0:5001"
echo "   Press Ctrl+C to stop"
echo ""
python "$SCRIPT_DIR/app.py"
