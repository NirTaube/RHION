import requests
import pandas as pd
import io
import mplfinance as mpf
# Read API key from file
with open('api.txt', 'r') as file:
    api_key = file.read().strip()
    # API endpoint URL
api_url = 'https://www.alphavantage.co/query'
# API parameters
params = {
    'function': 'TIME_SERIES_INTRADAY',
    'symbol': 'IBM',
    'interval': '5min',
    'apikey': api_key,
    'datatype': 'json'
}
# Make a GET request to the Alpha Vantage API
response = requests.get(api_url, params=params)
# Check if the request was successful (status code 200)
if response.status_code == 200:
    data = response.text  # Get the response content as text
    print(data)  # Print the CSV data
else:
    print(f"Request failed with status code {response.status_code}")

    # Multiple Symbol Request
#step 1: Store Company ticker names.

symbols = ['IBM', 'AAPL', 'GOOGL']

for symbol in symbols:
    # API parameters
    params = {
        'function': 'TIME_SERIES_INTRADAY',
        'symbol': symbol,
        'interval': '5min',
        'apikey': api_key,
        'datatype': 'csv'  # Use CSV format for easier DataFrame creation
    }

    # Make a GET request to the Alpha Vantage API
    response = requests.get(api_url, params=params)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        data = response.text  # Get the response content as text

        # Create DataFrame from CSV data
        df = pd.read_csv(io.StringIO(data))

        # Format the DataFrame
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df.set_index('timestamp', inplace=True)

        # Plot candlestick chart on a ticker
        mpf.plot(df, type='candle', title=f"Candlestick Chart for {symbol}", show_nontrading=True, style='yahoo')

    else:
        print(f"Request failed with status code {response.status_code}")