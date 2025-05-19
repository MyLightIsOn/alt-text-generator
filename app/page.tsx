"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const seededQuestions = [
  "What is the subject of the image?",
  "What is the subject doing?",
  "What is the setting or background?",
];

export default function AltTextAssistant() {
  const [mode, setMode] = useState("image");
  const [image, setImage] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [question, setQuestion] = useState(seededQuestions[0]);
  const [answer, setAnswer] = useState("");
  const [altText, setAltText] = useState("");
  const [textInput, setTextInput] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAnswerSubmit = () => {
    const updatedAltText = altText + " " + answer;
    setAltText(updatedAltText.trim());
    setAnswer("");

    if (questionIndex < seededQuestions.length - 1) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setQuestion(seededQuestions[nextIndex]);
    } else {
      // TODO: Replace with AI-generated follow-up question
      setQuestion("Is there anything else important to describe?");
    }
  };

  const handleTextSubmit = () => {
    setAltText(textInput);
    setQuestion("What is the subject of the text?");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Alt Text Assistant</h1>

      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(val) => val && setMode(val)}
        className="mb-4"
      >
        <ToggleGroupItem value="image">Upload Image</ToggleGroupItem>
        <ToggleGroupItem value="text">Paste Text</ToggleGroupItem>
      </ToggleGroup>

      {mode === "image" ? (
        <Card>
          <CardContent className="space-y-4 p-4">
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && (
              <img
                src={image}
                alt="Uploaded"
                className="max-h-64 object-contain"
              />
            )}

            <p className="font-medium">{question}</p>
            <Input
              placeholder="Your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <Button onClick={handleAnswerSubmit}>Submit Answer</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4 p-4">
            <Textarea
              placeholder="Paste your alt text here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <Button onClick={handleTextSubmit}>Submit Text</Button>
          </CardContent>
        </Card>
      )}

      <Separator />

      <Card>
        <CardContent className="space-y-2 p-4">
          <p className="font-semibold">Generated Alt Text:</p>
          <Textarea value={altText} readOnly className="h-24" />
          <div className="space-x-2">
            <Button onClick={() => {}}>Review Text</Button>
            <Button onClick={() => navigator.clipboard.writeText(altText)}>
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
