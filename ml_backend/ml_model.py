import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import os
from datetime import datetime, timedelta

class BitcoinPredictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.feature_columns = []
        self.target_columns = []
        self.data = None
        
    def create_features(self, df, max_lag=30):
        """Create lag features and technical indicators"""
        df = df.copy()
        
        # Create lag features (past N days of price)
        for i in range(1, max_lag + 1):
            df[f'price_lag_{i}'] = df['price'].shift(i)
        
        # Create moving averages
        df['ma_7'] = df['price'].rolling(window=7).mean()
        df['ma_14'] = df['price'].rolling(window=14).mean()
        df['ma_30'] = df['price'].rolling(window=30).mean()
        
        # Create price changes
        df['price_change_1d'] = df['price'].pct_change(1)
        df['price_change_7d'] = df['price'].pct_change(7)
        df['price_change_30d'] = df['price'].pct_change(30)
        
        # Create volatility features
        df['volatility_7d'] = df['price_change_1d'].rolling(window=7).std()
        df['volatility_30d'] = df['price_change_1d'].rolling(window=30).std()
        
        # Create target variables for different timeframes
        df['target_1d'] = df['price'].shift(-1)  # Tomorrow's price
        df['target_7d'] = df['price'].shift(-7)  # 1 week ahead
        df['target_30d'] = df['price'].shift(-30)  # 1 month ahead
        df['target_90d'] = df['price'].shift(-90)  # 3 months ahead (instead of 1 year)
        
        # Drop rows with NaN values
        df = df.dropna()
        
        return df
    
    def prepare_data(self, csv_path):
        """Load and prepare the data"""
        print("Loading data...")
        self.data = pd.read_csv(csv_path)
        self.data['date'] = pd.to_datetime(self.data['date'])
        
        print("Creating features...")
        self.data = self.create_features(self.data)
        
        # Define feature columns
        self.feature_columns = [col for col in self.data.columns 
                              if col.startswith(('price_lag_', 'ma_', 'price_change_', 'volatility_'))]
        
        # Define target columns
        self.target_columns = ['target_1d', 'target_7d', 'target_30d', 'target_90d']
        
        print(f"Features: {len(self.feature_columns)}")
        print(f"Targets: {len(self.target_columns)}")
        print(f"Total samples: {len(self.data)}")
        
        return self.data
    
    def train_models(self, test_size=0.2):
        """Train models for each timeframe"""
        print("Training models...")
        
        for target in self.target_columns:
            print(f"\nTraining model for {target}...")
            
            # Prepare features and target
            X = self.data[self.feature_columns]
            y = self.data[target].dropna()
            
            # Align X and y
            X = X.iloc[:len(y)]
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=42, shuffle=False
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Train multiple models
            models = {
                'linear': LinearRegression(),
                'random_forest': RandomForestRegressor(n_estimators=100, random_state=42)
            }
            
            best_model = None
            best_score = -np.inf
            
            for name, model in models.items():
                model.fit(X_train_scaled, y_train)
                y_pred = model.predict(X_test_scaled)
                score = r2_score(y_test, y_pred)
                
                print(f"  {name}: R² = {score:.4f}")
                
                if score > best_score:
                    best_score = score
                    best_model = model
            
            # Store best model and scaler
            self.models[target] = best_model
            self.scalers[target] = scaler
            
            print(f"  Best model: R² = {best_score:.4f}")
    
    def predict(self, timeframe):
        """Make prediction for given timeframe"""
        timeframe_map = {
            '1d': 'target_1d',
            '1w': 'target_7d', 
            '1m': 'target_30d',
            '3m': 'target_90d'  # Changed from 1y to 3m
        }
        
        if timeframe not in timeframe_map:
            raise ValueError(f"Invalid timeframe: {timeframe}")
        
        target = timeframe_map[timeframe]
        
        if target not in self.models:
            raise ValueError(f"Model not trained for {timeframe}")
        
        if self.data is None or len(self.data) == 0:
            raise ValueError("No data available for prediction")
        
        # Get latest data
        latest_data = self.data[self.feature_columns].iloc[-1:].values
        
        # Scale features
        latest_data_scaled = self.scalers[target].transform(latest_data)
        
        # Make prediction
        prediction = self.models[target].predict(latest_data_scaled)[0]
        
        # Calculate confidence (R² score from training)
        try:
            confidence = self.models[target].score(
                self.scalers[target].transform(self.data[self.feature_columns].iloc[-100:]), 
                self.data[target].iloc[-100:]
            )
        except:
            confidence = 0.5  # Default confidence if calculation fails
        
        return {
            'predicted_price': float(prediction),
            'confidence': float(confidence),
            'current_price': float(self.data['price'].iloc[-1]),
            'timeframe': timeframe
        }
    
    def save_models(self, directory="models"):
        """Save trained models and scalers"""
        os.makedirs(directory, exist_ok=True)
        
        for target, model in self.models.items():
            model_path = os.path.join(directory, f"{target}_model.joblib")
            joblib.dump(model, model_path)
            print(f"Saved model: {model_path}")
        
        for target, scaler in self.scalers.items():
            scaler_path = os.path.join(directory, f"{target}_scaler.joblib")
            joblib.dump(scaler, scaler_path)
            print(f"Saved scaler: {scaler_path}")
    
    def load_models(self, directory="models"):
        """Load trained models and scalers"""
        for target in ['target_1d', 'target_7d', 'target_30d', 'target_90d']:
            model_path = os.path.join(directory, f"{target}_model.joblib")
            scaler_path = os.path.join(directory, f"{target}_scaler.joblib")
            
            if os.path.exists(model_path) and os.path.exists(scaler_path):
                self.models[target] = joblib.load(model_path)
                self.scalers[target] = joblib.load(scaler_path)
                print(f"Loaded model and scaler for {target}")

def main():
    # Initialize predictor
    predictor = BitcoinPredictor()
    
    # Prepare data
    data_path = "data/bitcoin_2y.csv"
    if os.path.exists(data_path):
        predictor.prepare_data(data_path)
        
        # Train models
        predictor.train_models()
        
        # Save models
        predictor.save_models()
        
        # Test predictions
        print("\nTesting predictions:")
        for timeframe in ['1d', '1w', '1m', '3m']:
            try:
                result = predictor.predict(timeframe)
                print(f"{timeframe}: ${result['predicted_price']:.2f} (confidence: {result['confidence']:.2f})")
            except Exception as e:
                print(f"Error predicting {timeframe}: {e}")
    else:
        print(f"Data file not found: {data_path}")
        print("Please run data_collector.py first")

if __name__ == "__main__":
    main()
