#!/usr/bin/env python3
"""
Setup script for Bitcoin Price Prediction ML Backend
This script will:
1. Collect 2 years of Bitcoin price data
2. Train ML models for different timeframes
3. Start the FastAPI server
"""

import os
import sys
import subprocess
import time

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{'='*50}")
    print(f"🔄 {description}")
    print(f"{'='*50}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print("✅ Success!")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        if e.stdout:
            print("STDOUT:", e.stdout)
        if e.stderr:
            print("STDERR:", e.stderr)
        return False

def main():
    print("🚀 Bitcoin Price Prediction ML Backend Setup")
    print("=" * 50)
    
    # Check if Python is available
    if not run_command("python --version", "Checking Python installation"):
        print("❌ Python is not installed or not in PATH")
        return
    
    # Install requirements
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        print("❌ Failed to install dependencies")
        return
    
    # Step 1: Collect data
    print("\n📊 Step 1: Collecting Bitcoin price data...")
    if not run_command("python data_collector.py", "Collecting 2 years of Bitcoin price data"):
        print("❌ Failed to collect data")
        return
    
    # Step 2: Train models
    print("\n🤖 Step 2: Training ML models...")
    if not run_command("python ml_model.py", "Training prediction models"):
        print("❌ Failed to train models")
        return
    
    # Step 3: Start server
    print("\n🌐 Step 3: Starting FastAPI server...")
    print("The server will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    
    # Start the server
    try:
        subprocess.run("python fastapi_server.py", shell=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    main()
