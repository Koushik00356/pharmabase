const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const medicineRoutes = require('./routes/medicine');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/medicine', medicineRoutes);

app.listen(4000, () => {
    console.log("Server running on port 4000");
});