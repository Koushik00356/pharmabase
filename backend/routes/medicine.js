const express = require('express');
const router = express.Router();
const connect = require('../connection');

router.post('/create', async (req, res) => {
    try {
        const { batchId, name, manufacturer, expiry } = req.body;

        const { contract, gateway } = await connect();
        if (!batchId || !name || !manufacturer || !expiry) {
          return res.status(400).send("❌ Missing required fields");
        }

        if (batchId.length < 3) {
          return res.status(400).send("❌ Invalid Batch ID");
        }

        if (isNaN(Date.parse(expiry))) {
          return res.status(400).send("❌ Invalid expiry date");
        }

        await contract.submitTransaction(
            'createMedicine',
            batchId,
            name,
            manufacturer,
            expiry
        );

        await gateway.disconnect();

        res.send("Medicine created successfully");
    }
    
     catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/verify/:id', async (req, res) => {
    try {
        const { contract, gateway } = await connect();
        if (!isValidString(req.params.id)) {
            return res.status(400).send("❌ Invalid ID");
        }
        const result = await contract.evaluateTransaction(
            'readMedicine',
            req.params.id
        );

        await gateway.disconnect();

        res.json(JSON.parse(result.toString()));
        
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/transfer', async (req, res) => {
    try {
        const { batchId, newOwner } = req.body;

        const { contract, gateway } = await connect();

        await contract.submitTransaction(
            'transferMedicine',
            batchId,
            newOwner
        );

        await gateway.disconnect();

        res.send("Transferred successfully");
        if (!newOwner || newOwner.trim().length < 2 || newOwner.length > 80)
            return res.status(400).json({ error: "Invalid owner name" });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
router.post('/scan', async (req, res) => {
  try {
    const { batchId, location } = req.body;

    const { contract, gateway } = await connect();
    const coordRegex = /^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/;
    if (!coordRegex.test(location))
      return res.status(400).json({ error: "Invalid location format" });
    const [lat, lng] = location.split(',').map(Number);
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180)
      return res.status(400).json({ error: "Coordinates out of range" });
  
    await contract.submitTransaction('updateScan', batchId, location);

    await gateway.disconnect();

    res.send("Scan recorded");
    
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get('/history/:id', async (req, res) => {
  try {
    const { contract, gateway } = await connect();

    const result = await contract.evaluateTransaction(
      'getHistory',
      req.params.id
    );
    if (!isValidString(req.params.id)) {
      return res.status(400).send("❌ Invalid ID");
    }
    await gateway.disconnect();

    // Convert each history item to JSON
    const history = JSON.parse(result.toString()).map(item => {
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    });

    res.json(history);

  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/all", async (req, res) => {
  try {
    const medicines = await contract.evaluateTransaction("getAllMedicines");

    // 👇 convert buffer → JSON
    const result = JSON.parse(medicines.toString());

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching medicines");
  }
});

module.exports = router;