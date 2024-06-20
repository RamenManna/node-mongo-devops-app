import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

mongoose.connect(mongoUri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const schema = new mongoose.Schema({ name: String });
const Data = mongoose.model('Data', schema);

app.get('/', async (req, res) => {
  const data = await Data.find();
  res.render('index', { data });
});

app.post('/data', async (req, res) => {
  const newData = new Data({ name: req.body.name });
  await newData.save();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
