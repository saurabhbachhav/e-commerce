"use client";
import { useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult extends Array<SpeechRecognitionAlternative> {}

interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

const VoiceSearch = () => {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const voiceText = event.results[0][0].transcript;
      setQuery(voiceText);
      console.log("Voice query:", voiceText);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleVoiceSearch}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow transition"
        aria-label="Voice search"
      >
        {listening ? "🎤 Listening..." : "🎤 Tap to Speak"}
      </button>
      {query && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          You said: <strong>{query}</strong>
        </p>
      )}
    </div>
  );
};

export default VoiceSearch;
