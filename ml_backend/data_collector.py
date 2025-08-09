import pandas as pd
import requests
from datetime import datetime, timedelta
import time
import os

class BitcoinDataCollector:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.coingecko.com/api/v3"
        # Support both header and query parameter formats
        self.headers = {
            "x-cg-demo-api-key": api_key,
            "Content-Type": "application/json"
        }
    
    def fetch_bitcoin_data(self, days=730):  # 2 years = 730 days
        """Fetch Bitcoin price data for the specified number of days"""
        try:
            # CoinGecko API endpoint for historical data
            url = f"{self.base_url}/coins/bitcoin/market_chart"
            params = {
                "vs_currency": "usd",
                "days": days,
                "interval": "daily",
                "x_cg_demo_api_key": self.api_key  # Add API key as query parameter
            }
            
            print(f"Fetching {days} days of Bitcoin price data...")
            print(f"Using API key: {self.api_key[:8]}...{self.api_key[-4:]}")
            
            response = requests.get(url, headers=self.headers, params=params)
            
            if response.status_code == 200:
                data = response.json()
                
                # Extract prices and convert to DataFrame
                prices = data['prices']
                df = pd.DataFrame(prices, columns=['timestamp', 'price'])
                
                # Convert timestamp to datetime
                df['date'] = pd.to_datetime(df['timestamp'], unit='ms')
                df = df.drop('timestamp', axis=1)
                
                # Sort by date
                df = df.sort_values('date').reset_index(drop=True)
                
                print(f"Successfully fetched {len(df)} data points")
                return df
            else:
                print(f"Error fetching data: {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    def test_api_connection(self):
        """Test the API connection with a simple ping"""
        try:
            url = f"{self.base_url}/ping"
            params = {"x_cg_demo_api_key": self.api_key}
            
            print("Testing API connection...")
            response = requests.get(url, headers=self.headers, params=params)
            
            if response.status_code == 200:
                print("✅ API connection successful!")
                return True
            else:
                print(f"❌ API connection failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ API connection error: {e}")
            return False
    
    def save_to_csv(self, df, filename="bitcoin_2y.csv"):
        """Save the data to CSV file"""
        try:
            # Create data directory if it doesn't exist
            os.makedirs("data", exist_ok=True)
            
            filepath = os.path.join("data", filename)
            df.to_csv(filepath, index=False)
            print(f"Data saved to {filepath}")
            return filepath
        except Exception as e:
            print(f"Error saving data: {e}")
            return None

def main():
    # Replace this with your new API key
    api_key = "CG-AroJeoQqWVAv3u7iBVZzdL6K"  # Your actual API key
    
    if api_key == "YOUR_NEW_API_KEY_HERE":
        print("❌ Please update the API key in data_collector.py")
        print("1. Get your API key from: https://www.coingecko.com/en/api/pricing")
        print("2. Replace 'YOUR_NEW_API_KEY_HERE' with your actual API key")
        return
    
    # Initialize collector
    collector = BitcoinDataCollector(api_key)
    
    # Test API connection first
    if not collector.test_api_connection():
        print("❌ API connection failed. Please check your API key.")
        return
    
    # Fetch 1 year of data (demo API limitation)
    df = collector.fetch_bitcoin_data(days=365)
    
    if df is not None:
        # Save to CSV
        collector.save_to_csv(df)
        
        # Display basic info
        print("\nData Summary:")
        print(f"Date range: {df['date'].min()} to {df['date'].max()}")
        print(f"Total records: {len(df)}")
        print(f"Price range: ${df['price'].min():.2f} - ${df['price'].max():.2f}")
        print(f"Current price: ${df['price'].iloc[-1]:.2f}")
    else:
        print("Failed to fetch data")

if __name__ == "__main__":
    main()
