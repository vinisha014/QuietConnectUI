import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve HTML and assets

// 🔹 AWS SDK v3 Configuration
const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);
const TABLE_NAME = "QuietConnectChats";

// 🔹 Serve the HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "samplesample.html", "Main.html"));
});

// 🔹 AI Chatbot Route (Existing Code)
app.post("/ask", async (req, res) => {
    const userInput = req.body.input;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "API key is missing!" });
    }

    try {
        const apiResponse = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: userInput }],
                max_tokens: 5000
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const aiResponse = apiResponse.data.choices[0].message.content.trim();

        // 🔹 Save chat history to AWS after response is generated
        await saveChatToAWS(userInput, aiResponse);

        res.json({ response: aiResponse });
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Error generating response." });
    }
});

// 🔹 Function to Save Chat Messages to DynamoDB (AWS SDK v3)
async function saveChatToAWS(userMessage, aiMessage) {
    console.log("📝 Saving to DynamoDB:", userMessage, aiMessage); // Debugging logs
    const params = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            chatId: "global-chat",
            timestamp: Date.now(),
            messages: { user: userMessage, ai: aiMessage }
        }
    });

    try {
        await dynamoDB.send(params);
        console.log("✅ Chat saved to DynamoDB");
    } catch (error) {
        console.error("❌ DynamoDB Save Error:", error);
    }
}

// 🔹 Retrieve Chat History from DynamoDB (AWS SDK v3)
app.get("/api/getChat", async (req, res) => {
    console.log("🔍 Fetching chat history from DynamoDB..."); // Debugging
    const params = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "chatId = :chatId",
        ExpressionAttributeValues: {
            ":chatId": "global-chat"
        },
        ScanIndexForward: false,
        Limit: 10
    });

    try {
        const data = await dynamoDB.send(params);
        if (!data.Items || data.Items.length === 0) {
            console.log("⚠️ No chat history found in DynamoDB.");
            return res.json({ chatHistory: "No chat history found." });
        }

        console.log("📜 Chat History from DynamoDB:", JSON.stringify(data.Items, null, 2)); // ✅ Logs chat history
        const chatHistory = data.Items.map(
            (item) => `👤 ${item.messages.user} <br> 🤖 ${item.messages.ai}`
        ).join("<br><br>");
        res.json({ chatHistory });
    } catch (error) {
        console.error("❌ DynamoDB Load Error:", error);
        res.status(500).json({ error: "Failed to retrieve chat history" });
    }
});

// 🔹 Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
