
require('dotenv').config();
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripeRoutes = require('./stripe'); // Adjust the path if necessary


const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());
app.use('/api/stripe', stripeRoutes);

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    res.status(200).send({ message: 'User authenticated successfully', user: userRecord });
  } catch (error) {
    res.status(400).send({ error: 'Authentication failed', details: error.message });
  }
});

app.post('/signup', async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    res.status(201).send({ message: 'User created successfully', user: userRecord });
  } catch (error) {
    res.status(400).send({ error: 'Error creating user', details: error.message });
  }
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    await admin.auth().generatePasswordResetLink(email);
    res.status(200).send({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(400).send({ error: 'Error sending password reset link', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
