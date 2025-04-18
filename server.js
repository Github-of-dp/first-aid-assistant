const express = require("express");
const path = require("path");
const dialogflow = require("@google-cloud/dialogflow");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

// 🔐 Write Dialogflow key from environment variable into a file
fs.writeFileSync("key.json", process.env.DIALOGFLOW_KEY_JSON);

// ✅ Create Dialogflow client with key file
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "key.json"
});

// ✅ Correct Dialogflow project ID
const projectId = "first-aid-assistant-dciq";

app.post("/chatbot", async (req, res) => {
  const userMessage = req.body.message;
  const sessionId = "online-session"; // You can later make this unique per user

  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: userMessage,
        languageCode: "en"
      }
    }
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText });
  } catch (err) {
    console.error("🔥 Dialogflow Error:", JSON.stringify(err, null, 2));
    res.status(500).json({ reply: "Something went wrong!"
