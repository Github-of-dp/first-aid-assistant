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

// 🔐 Rebuild the key file from the environment variable
fs.writeFileSync("key.json", process.env.DIALOGFLOW_KEY_JSON);

// ✅ Dialogflow session client
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "key.json"
});

// ✅ Correct project ID
const projectId = "first-aid-assistant-dciq";

app.post("/chatbot", async (req, res) => {
  const userMessage = req.body.message;
  const sessionId = "online-session";

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
  console.error("🔥 Dialogflow Error:\n", err); // Log full error object
  res.status(500).json({ reply: `Dialogflow error: ${err.message || "Unknown error"}` });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
