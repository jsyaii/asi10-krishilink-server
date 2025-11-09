const express = require('express')
const cros = require('cors')
const app = express()
const port = process.env.PORT || 3000;

// middleware
app.use(cros());
app.use(express.json())


app.get('/', (req, res) => {
  res.send('KrishiLink Server is Running')
})

app.listen(port, () => {
  console.log(`KrishiLink Server is Running on port ${port}`);
})
