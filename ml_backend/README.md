# Bitcoin Price Prediction ML Backend

A machine learning-powered Bitcoin price prediction system with FastAPI backend and React frontend integration.

## 🚀 Features

- **Real-time Data Collection**: Fetches 2 years of Bitcoin price data from CoinGecko API
- **Advanced ML Models**: Uses Linear Regression and Random Forest for price prediction
- **Multiple Timeframes**: Predicts prices for 1 day, 1 week, 1 month, and 1 year
- **Feature Engineering**: Creates lag features, moving averages, and volatility indicators
- **RESTful API**: FastAPI server with CORS support for frontend integration
- **Confidence Scoring**: Provides model confidence levels for each prediction

## 📋 Requirements

- Python 3.8+
- pip (Python package manager)
- CoinGecko API key (included in the code)

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
cd ml_backend
pip install -r requirements.txt
```

### 2. Quick Setup (Recommended)

Run the automated setup script:

```bash
python run_setup.py
```

This script will:
- Install all dependencies
- Collect 2 years of Bitcoin price data
- Train ML models for all timeframes
- Start the FastAPI server

### 3. Manual Setup (Alternative)

If you prefer to run each step manually:

#### Step 1: Collect Data
```bash
python data_collector.py
```

#### Step 2: Train Models
```bash
python ml_model.py
```

#### Step 3: Start Server
```bash
python fastapi_server.py
```

## 🌐 API Endpoints

### Health Check
```
GET /health
```
Returns API status and available timeframes.

### Make Prediction
```
POST /predict
Content-Type: application/json

{
  "timeframe": "1d"  // "1d", "1w", "1m", "1y"
}
```

### Alternative GET Endpoint
```
GET /predict/{timeframe}
```

## 📊 API Response Format

```json
{
  "predicted_price": 45280.50,
  "confidence": 0.87,
  "current_price": 44120.30,
  "timeframe": "1d",
  "status": "success",
  "message": "Prediction completed successfully"
}
```

## 🔧 Configuration

### API Key
The CoinGecko API key is already included in the code:
```python
api_key = "CG-AroJeoQqWVAv3u7iBVZzdL6K"
```

### Model Parameters
- **Lag Features**: 30 days of historical prices
- **Moving Averages**: 7, 14, and 30-day periods
- **Volatility**: 7 and 30-day rolling standard deviation
- **Test Split**: 20% for model validation

## 📁 Project Structure

```
ml_backend/
├── requirements.txt          # Python dependencies
├── data_collector.py        # Data collection from CoinGecko
├── ml_model.py             # ML model training and prediction
├── fastapi_server.py       # FastAPI server implementation
├── run_setup.py           # Automated setup script
├── README.md              # This file
├── data/                  # Generated data directory
│   └── bitcoin_2y.csv     # Historical Bitcoin price data
└── models/                # Trained model files
    ├── target_1d_model.joblib
    ├── target_1d_scaler.joblib
    ├── target_7d_model.joblib
    ├── target_7d_scaler.joblib
    ├── target_30d_model.joblib
    ├── target_30d_scaler.joblib
    ├── target_365d_model.joblib
    └── target_365d_scaler.joblib
```

## 🔗 Frontend Integration

The frontend is already configured to connect to this backend. The React app will:

1. Check API health on page load
2. Show connection status indicator
3. Make real predictions using the ML models
4. Display formatted results with confidence scores

## 🚀 Usage

1. **Start the Backend**:
   ```bash
   python run_setup.py
   ```

2. **Start the Frontend** (in a separate terminal):
   ```bash
   cd ../coincast-pulse
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📈 Model Performance

The models are evaluated using R² (coefficient of determination) scores:

- **1 Day Prediction**: Typically 0.85-0.95 R²
- **1 Week Prediction**: Typically 0.70-0.85 R²  
- **1 Month Prediction**: Typically 0.60-0.75 R²
- **1 Year Prediction**: Typically 0.40-0.60 R²

## ⚠️ Important Notes

- **Financial Disclaimer**: These predictions are for educational purposes only. Do not use for actual trading decisions.
- **Model Limitations**: ML models cannot predict black swan events or market manipulation.
- **Data Freshness**: Models are trained on historical data and may not reflect current market conditions.
- **API Rate Limits**: CoinGecko has rate limits; the collector includes appropriate delays.

## 🔄 Updating Models

To retrain models with fresh data:

1. Delete the `models/` directory
2. Run `python run_setup.py` again
3. The system will collect new data and retrain all models

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**:
   - Check if the backend server is running on port 8000
   - Verify CORS settings in `fastapi_server.py`

2. **Model Training Failed**:
   - Ensure you have sufficient disk space for data and models
   - Check that all dependencies are installed correctly

3. **Data Collection Failed**:
   - Verify internet connection
   - Check CoinGecko API status
   - Ensure the API key is valid

### Logs

Check the console output for detailed error messages and progress information.

## 📝 License

This project is for educational purposes. Please ensure compliance with CoinGecko's API terms of service.

## 🤝 Contributing

Feel free to improve the models, add new features, or enhance the API endpoints!
