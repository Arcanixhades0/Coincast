# CoinCast

AI-powered cryptocurrency analytics and price prediction platform. This monorepo contains a React (Vite + TypeScript) frontend and a FastAPI-based ML backend.

## Repository

- GitHub: https://github.com/Arcanixhades0/Coincast

## Project Structure

`
CoinCast/
 coincast-pulse/      # React + Vite + TS frontend (UI, charts, news)
 ml_backend/          # FastAPI ML backend (data, models, API)
 dither-waves/        # (Optional) small CRA demo
`

## Quick Start

### 1) Backend (FastAPI + ML)

Requirements: Python 3.10+ and pip

`powershell
cd ml_backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt

# One-shot setup: collect data, train models, and start API
python run_setup.py
# API runs at http://localhost:8000 (Docs: http://localhost:8000/docs)
`

Manual alternative:
`powershell
# From ml_backend directory, with venv activated
python data_collector.py   # collect ~2 years BTC data -> data/bitcoin_2y.csv
python ml_model.py         # train and save models -> models/
python fastapi_server.py   # start API on http://localhost:8000
`

### 2) Frontend (React + Vite + TS)

Requirements: Node.js 18+

`powershell
cd coincast-pulse
npm install
npm run dev
# App: http://localhost:5173
`

The frontend is configured to call the backend at http://localhost:8000 (see src/services/mlApi.ts). Ensure the backend is running first.

## Configuration

- Backend CORS currently allows all origins for local dev. Restrict it before production (ml_backend/fastapi_server.py).
- CryptoPanic API for news is configured in coincast-pulse/src/services/cryptoPanicApi.ts. Replace the API key there if needed.
- If you want to change the ML API base URL, update coincast-pulse/src/services/mlApi.ts.

## Frontend Scripts

From coincast-pulse:
- 
pm run dev – start dev server
- 
pm run build – build for production (outputs to dist/)
- 
pm run preview – preview production build

## API Overview (Backend)

- GET /health – service status and available timeframes
- POST /predict – body: { "timeframe": "1d" | "1w" | "1m" | "3m" }
- GET /predict/{timeframe} – alternative GET endpoint

Typical response:
`json
{
  "predicted_price": 45280.5,
  "confidence": 0.87,
  "current_price": 44120.3,
  "timeframe": "1d",
  "status": "success",
  "message": "Prediction completed successfully"
}
`

## Notes

- Large artifacts (trained models under ml_backend/models/ and data under ml_backend/data/) are committed for convenience. Consider Git LFS if the repo grows.
- 
ode_modules/ and build outputs are ignored via .gitignore.

## Troubleshooting

- Frontend cannot reach API: Ensure backend is running at http://localhost:8000 and no firewall is blocking.
- Missing models: Run python run_setup.py or the manual steps to regenerate.
- Port conflicts: Change Vite port via ite config or run with --port, and adjust API base URL in the frontend if needed.

## License

MIT
