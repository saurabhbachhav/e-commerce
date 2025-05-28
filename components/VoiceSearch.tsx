"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMic } from "react-icons/fi";

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
  const [listening, setListening] = useState(false);
  const router = useRouter();

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
      const voiceText = event.results[0][0].transcript.trim();
      console.log("Voice query:", voiceText);

      
      const inputEl = document.querySelector(
        'input[aria-controls="search-list"]'
      ) as HTMLInputElement;

      if (inputEl) {
    
        let index = 0;
        const typeInterval = setInterval(() => {
          if (index <= voiceText.length) {
            const partial = voiceText.slice(0, index);
            inputEl.value = partial;
            inputEl.dispatchEvent(new Event("input", { bubbles: true }));
            index++;
          } else {
            clearInterval(typeInterval);
            router.push(`/search?query=${encodeURIComponent(voiceText)}`);
          }
        }, 80);
      } else {
        router.push(`/search?query=${encodeURIComponent(voiceText)}`);
      }
    };

    recognition.start();
  };

  return (
    <div className="absolute right-16 top-1/2 -translate-y-1/2">
      <button
        onClick={handleVoiceSearch}
        className="relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full shadow-xl transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300"
        aria-label="Voice search"
      >
        <FiMic size={15} />
        {listening && (
          <span className="absolute inset-0 rounded-full bg-white/30 animate-ping"></span>
        )}
      </button>
    </div>
  );
};

export default VoiceSearch;
