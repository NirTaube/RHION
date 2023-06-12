// Function to read API key from file
function readAPIKeyFromFile(callback) {
    // Fetch API key from file
    fetch('api.txt')
      .then(response => response.text())
      .then(apiKey => {
        callback(apiKey.trim());
      })
      .catch(error => {
        console.error('Error reading API key:', error);
      });
  }
  
  // Function to fetch data from the API
  function fetchData(symbol, apiKey) {
    // API parameters
    const functionParam = 'TIME_SERIES_INTRADAY';
    const intervalParam = '5min';
  
    const apiUrl = `https://www.alphavantage.co/query?function=${functionParam}&symbol=${symbol}&interval=${intervalParam}&apikey=${apiKey}&datatype=csv`;
  
    // Fetch data from API
    fetch(apiUrl)
      .then(response => response.text())
      .then(data => {
        // Parse CSV data
        const parsedData = parseCSVData(data);
  
        // Create the chart
        createCandlestickChart(parsedData, symbol);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  
  // Function to parse CSV data
  function parseCSVData(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));
  
    return rows.map(row => {
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = row[index];
      });
      return entry;
    });
  }
  
  // Function to create the candlestick chart
  function createCandlestickChart(data, symbol) {
    const dates = data.map(entry => entry.timestamp);
    const opens = data.map(entry => parseFloat(entry.open));
    const highs = data.map(entry => parseFloat(entry.high));
    const lows = data.map(entry => parseFloat(entry.low));
    const closes = data.map(entry => parseFloat(entry.close));
  
    const ctx = document.getElementById('candlestickChart').getContext('2d');
    new Chart(ctx, {
      type: 'candlestick',
      data: {
        labels: dates,
        datasets: [
          {
            label: symbol,
            data: [],
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1,
            yAxisID: 'price-axis'
          }
        ]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          },
          y: {
            id: 'price-axis',
            position: 'left'
          }
        }
      }
    });
  }
  
  // Read API key from file and fetch data for each symbol
  const symbols = ['IBM', 'AAPL', 'GOOGL'];
  readAPIKeyFromFile(apiKey => {
    symbols.forEach(symbol => {
      fetchData(symbol, apiKey);
    });
  });
  