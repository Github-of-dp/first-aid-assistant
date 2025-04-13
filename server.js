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

// Secure way to load credentials
fs.writeFileSync("key.json", process.env.DIALOGFLOW_KEY_JSON);

const sessionClient = new dialogflow.SessionsClient({
    keyFilename: "key.json",
});

const projectId = "erudite-wind-454317-t6";

app.post("/chatbot", async (req, res) => {
    const userMessage = req.body.message;
    const sessionId = "123456";
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userMessage,
                languageCode: "en",
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        res.json({ reply: result.fulfillmentText });
    } catch (err) {
        console.error("Dialogflow error:", err);
        res.status(500).json({ reply: "Something went wrong!" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
