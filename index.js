const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/convert", async (req, res) => {
  var { from, to, amount } = req.body;

  if (!from || !to || !amount) {
    var message = "";
    if (!from) {
      message += "'from'\t";
     
    }
    if (!to) {
      message += "'to'\t";
      
    }
    if (!amount) {
      message += "'amount'\t";
      
    }
    return res.status(400).send("Missing required parameters: " + message);
    
  }

  try {
    // Convert from and to to lowercase
    from = from.toLowerCase();
    to = to.toLowerCase();

    // Construct the API endpoint dynamically based on the 'from' currency
    const apiEndpoint = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`;

    // Fetch exchange rates from the API
    const response = await axios.get(apiEndpoint);
    const rates = response.data[from];

    if (!rates[to]) {
      return res.status(400).send("Invalid currency code 'to' provided");
    }

    // Convert the amount using the exchange rate
    const convertedAmount = amount * rates[to];

    res.json({
      convertedAmount,
      //rate: rates[to],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while converting currency, verify source currency");
  }
});

app.get("/convert", async (req, res) => {
  
    return res.status(400).send("Please call this API using POST method");
  
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
