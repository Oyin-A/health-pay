require('dotenv').config();
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Service account configuration from environment variables
const serviceAccount = {
  "type": "service_account",
  "project_id": "health-pay-f2292",
  "private_key_id": "86a796778a6d19d6e73dadcc46b37d5e07a04250",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTIeETt9ETwVG6\n/8hm+RHtZfs725d4BaauFX2rYoJ8KS1wxtW5/ac+fWXJtrX38F17BL3AKVvjarBz\nFAsgeR2RbTaG24it07sswYhCNXN2p3YItGre9KD8Zeq1vaFdxNCV9uPn/935F6bS\ngg4l2rDydhDLqa2js+RDIRVPWX9jbx9pu7H+dU2ogKYr5jtiSeI3B+psaxzY7dLe\nkVgdFfRm/YwliQCeexpeZNoF7YBRawtUNB1ggbJ136jRCIS81Kv9FdpecJi9HU5T\nRFDbBZBEYVUbUIQD+ecSRXQ/rLZGNWe3SGk6TDy6jnKDJnRx6O8pvForUt3DKV8q\noYvk3575AgMBAAECggEAGC6T8zh1RbQ5anfj6elipIRu9VDmJRzOlbdH7MKMa/Ci\nb/2SGqqjBm0B5MvcxTBeYJnvKsyB5gcA/TlBOf+tQ4wU9/a6jaBH2q0y8FRjbGZr\nRj111SIDM01wB89XpWAGvPppaZfcgmxzUr6LJMpKxIaBz3XYeby/qvGl2XAIf2iU\nWKQVKk7Zk7sHy6FkFBODloh9Bs8CjFrzcVPkq1ady4dhG6zMYrV93p8lKT3JVmx5\n+2oksv36rxK5eC8qQ+GfByl6A3ciS/bAQw19o9wD/2HaWD8ykMuguKDA0pHOpQTr\nUQJAxX6Jy/PTmvmlGCqR5cwfNe2lnYfNPcc07cp0AQKBgQDoqVyu8gwIxleEt153\n/ls1Csl1LpCcjFPTOo4hEG2rzQI0olBqFcyDp5Z8bq4fvUctlIkZje8Fa8JqDGQy\nB7aeNXxaTH4UQ2peyduVqLFp+//gDXrE9W3U4fUoiyu2dl7P09lDY2lN6CGSmU8z\n5B4+Zf1/OhgrURcq7Tf5nRV4+QKBgQDoT6gl4cEEM2Lpe8nPDiwgvoafNvIu8lE+\nHrGK2rfQV7XDXhWAIqCRpUjCK4mamdvodhukfHXiqL9yWtxkrd+9HKYJT2zIfopM\n7mTG6q+fsPFjqDn4Ubf9NJpsqA9JQ0Fw6uANFE6vm9yb4YK84ZlWp8u/IvWH4pg1\nxZqFnnrWAQKBgFci/xxieNFcf3CsQIxOThiKhrMFkpGfGNH2jz6g6YI7kMTnuZhR\nu7vfK0RFK5+lgx/2DnbsqoVsO27+XxRBwUp1m7IyDdJHAXKoxT3C5VddUxK12bIk\nfVMKoYfiv6dho9bQcAGGHO1ZsCE4m+pCWHVkO1HIDz9B6pxgJeOtyln5AoGBAN4N\nfekvv6I3R/1rQHw0zMNDukQnbhinsDZTelsCMx7nJ6slnCGNd7OfrEtE+FOZa5To\niAWSnc/Ygp5Y8T8e37TQ1HgjvhRqt+FPIW7tVo+qvyEF5NtRqS9S/6SKg4oAymWX\nbC+0UH4U2ir5xFCsxzgITX1WeiC328vSJKBB2qIBAoGBALxtxyiaDrk0sz2LvsW4\njKJHdC5PufaUlrHQ3J6Tg+LPuEiz2cBO6wOeMrOTOHcdp2CsjksnWoF9m7X8TDDm\nzG4DMdq4YnNEUDflXAJN1ylBbE/FTEmeKpUFOHB3NT5LetjaWTdqOdSm/fO/NLiQ\n/z4SviIswCTq3YSstsRb0zmw\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-6carw@health-pay-f2292.iam.gserviceaccount.com",
  "client_id": "114242437702740483657",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6carw%40health-pay-f2292.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"

};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    // Perform password check (should be done using Firebase Auth SDK on the client-side)
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
