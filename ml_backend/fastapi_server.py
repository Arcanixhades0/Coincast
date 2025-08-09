from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ml_model import BitcoinPredictor

# Initialize FastAPI app
app = FastAPI(
    title="Bitcoin Price Prediction API",
    description="ML-powered Bitcoin price predictions for different timeframes",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the predictor
predictor = BitcoinPredictor()

# Pydantic models for request/response
class PredictionRequest(BaseModel):
    timeframe: str  # '1d', '1w', '1m', '1y'

class PredictionResponse(BaseModel):
    predicted_price: float
    confidence: float
    current_price: float
    timeframe: str
    status: str
    message: str

@app.on_event("startup")
async def startup_event():
    """Initialize the ML model on startup"""
    try:
        # Load pre-trained models
        predictor.load_models()
        
        # If models don't exist, train them
        if not predictor.models:
            print("No pre-trained models found. Training new models...")
            data_path = "data/bitcoin_2y.csv"
            if os.path.exists(data_path):
                predictor.prepare_data(data_path)
                predictor.train_models()
                predictor.save_models()
            else:
                print("Warning: No data file found. Please run data_collector.py first")
        else:
            # Load data for predictions
            data_path = "data/bitcoin_2y.csv"
            if os.path.exists(data_path):
                predictor.prepare_data(data_path)
                print("Data loaded for predictions")
            else:
                print("Warning: No data file found for predictions")
        
        print("ML models loaded successfully!")
    except Exception as e:
        print(f"Error loading models: {e}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Bitcoin Price Prediction API",
        "version": "1.0.0",
        "endpoints": {
            "predict": "/predict",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": len(predictor.models) > 0,
        "available_timeframes": ["1d", "1w", "1m", "3m"]
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_price(request: PredictionRequest):
    """Make a price prediction for the specified timeframe"""
    try:
        # Validate timeframe
        valid_timeframes = ['1d', '1w', '1m', '3m']
        if request.timeframe not in valid_timeframes:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid timeframe. Must be one of: {valid_timeframes}"
            )
        
        # Check if models are loaded
        if not predictor.models:
            raise HTTPException(
                status_code=503,
                detail="ML models not loaded. Please try again later."
            )
        
        # Make prediction
        result = predictor.predict(request.timeframe)
        
        return PredictionResponse(
            predicted_price=result['predicted_price'],
            confidence=result['confidence'],
            current_price=result['current_price'],
            timeframe=result['timeframe'],
            status="success",
            message="Prediction completed successfully"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/predict/{timeframe}")
async def predict_price_get(timeframe: str):
    """Alternative GET endpoint for predictions"""
    request = PredictionRequest(timeframe=timeframe)
    return await predict_price(request)

if __name__ == "__main__":
    uvicorn.run(
        "fastapi_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
