const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
dotenv.config();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('DATABASE CONNECTED');
})
.catch((error) => {
  console.error('Error connecting to the database:', error);
});
app.options('/', (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200); // Send a 200 OK response for the OPTIONS request
});

// Define a Mongoose model
const Data = mongoose.model('Data', {
  name: String,
  email: String,
  password: String
});

// POST method
app.post('/create', (req, res) => {
  const data = new Data({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  data.save()
    .then((result) => {
      console.log('Data inserted successfully');
      res.send({ message: 'Data inserted successfully', id: result._id });
    })
    .catch((err) => {
      console.error('Error inserting data:', err);
      res.status(500).send({ message: 'Error inserting data' });
    });
});

// GET method
app.get('/data/:id', (req, res) => {
  const id = req.params.id;

  Data.findById(id)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'Data not found' });
      }
      res.send(result);
    })
    .catch((err) => {
      console.error('Error fetching data:', err);
      res.status(500).send({ message: 'Error fetching data' });
    });
});

// DELETE method
app.delete('/data/:id', (req, res) => {
  const id = req.params.id;

  Data.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'Data not found' });
      }
      res.send({ message: 'Data deleted successfully' });
    })
    .catch((err) => {
      console.error('Error deleting data:', err);
      res.status(500).send({ message: 'Error deleting data' });
    });
});

// PUT method
app.put('/data/:id', (req, res) => {
  const id = req.params.id;
  const newData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  Data.findByIdAndUpdate(id, newData, { new: true }) // Add { new: true }
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'Data not found' });
      }
      res.send({ message: 'Data updated successfully', updatedData: result });
    })
    .catch((err) => {
      console.error('Error updating data:', err);
      res.status(500).send({ message: 'Error updating data' });
    });
});


app.listen(4000, () => {
  console.log('Server started on port 4000');
});
