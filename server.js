const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dialogflow = require("@google-cloud/dialogflow");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

const sessionClient = new dialogflow.SessionsClient({
    keyFilename: path.join(__dirname, "dialogflow-key.json"),
});

const projectId = "erudite-wind-454317-t6"; // replace with your project ID

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
    } catch (error) {
        console.error("Dialogflow Error:", error);
        res.status(500).json({ reply: "Something went wrong!" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
