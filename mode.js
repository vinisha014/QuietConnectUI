import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function QuietConnect() {
  const [darkMode, setDarkMode] = useState(false);
  const [prompts, setPrompts] = useState(["What is something you appreciate today?", "If you could learn a new skill instantly, what would it be?", "Describe your ideal quiet moment."]);
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
  const [responses, setResponses] = useState([]);
  const [newResponse, setNewResponse] = useState("");

  const handleResponseSubmit = () => {
    if (newResponse.trim() !== "") {
      setResponses([...responses, newResponse]);
      setNewResponse("");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <Button onClick={() => setDarkMode(!darkMode)} className="absolute top-4 right-4">
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </Button>

      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-2xl font-bold mb-4">
        Quiet Connect 🌿
      </motion.h1>

      <Card className="w-full max-w-lg p-4 mb-4 shadow-md rounded-2xl">
        <CardContent>
          <p className="text-lg italic">{selectedPrompt}</p>
        </CardContent>
      </Card>

      <textarea
        className="w-full max-w-lg p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        rows="3"
        placeholder="Write your response..."
        value={newResponse}
        onChange={(e) => setNewResponse(e.target.value)}
      />

      <Button className="mt-2" onClick={handleResponseSubmit}>
        Submit Response
      </Button>

      <div className="w-full max-w-lg mt-6">
        <h2 className="text-lg font-semibold mb-2">Responses:</h2>
        {responses.length === 0 ? (
          <p className="text-gray-500">No responses yet.</p>
        ) : (
          responses.map((response, index) => (
            <Card key={index} className="mb-2 p-3 shadow-sm rounded-lg">
              <CardContent>{response}</CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
