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

type Grade = {
  score: number;
  issues: {
    severity: string;
    message: string;
  }[];
};

export default function AltTextAssistant() {
  const [mode, setMode] = useState("image");
  const [image, setImage] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [question, setQuestion] = useState(seededQuestions[0]);
  const [answer, setAnswer] = useState("");
  const [altText, setAltText] = useState("");
  const [textInput, setTextInput] = useState("");
  const [userEdited, setUserEdited] = useState(false);
  const [grade, setGrade] = useState<Grade | null>(null);

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

  const generateAltText = async (inputText: string) => {
    try {
      const res = await fetch("/api/generate-alt-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: inputText }),
      });
      const data = await res.json();
      setAltText(data.altText);
      handleGradeText(data.altText);
    } catch (error) {
      console.error("Failed to generate alt text", error);
    }
  };

  const handleAnswerSubmit = async () => {
    const updatedText = altText + " " + answer;
    setAnswer("");
    setUserEdited(false);

    await generateAltText(updatedText.trim());

    if (questionIndex < seededQuestions.length - 1) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      setQuestion(seededQuestions[nextIndex]);
    } else {
      try {
        const res = await fetch("/api/next-question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ altTextSoFar: updatedText.trim() }),
        });
        const data = await res.json();
        setQuestion(
          data.question || "Is there anything else important to describe?",
        );
      } catch (err) {
        console.error(err);
        setQuestion("Is there anything else important to describe?");
      }
    }
  };

  const handleTextSubmit = () => {
    setAltText(textInput);
    setQuestion("What is the subject of the text?");
    handleGradeText(textInput);
  };

  const handleGradeText = async (text: string) => {
    try {
      const res = await fetch("/api/grade-alt-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setGrade(data);
    } catch (error) {
      console.error("Failed to grade alt text", error);
    }
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
        <CardContent className="space-y-4 p-4">
          <p className="font-semibold">Generated Alt Text:</p>
          <Textarea
            value={altText}
            onChange={(e) => {
              setAltText(e.target.value);
              setUserEdited(true);
            }}
            className="h-24"
          />
          <div className="space-x-2">
            <Button onClick={() => handleGradeText(altText)}>
              Review Text
            </Button>
            <Button onClick={() => navigator.clipboard.writeText(altText)}>
              Copy
            </Button>
          </div>
          {grade && (
            <div className="mt-4">
              <p className="font-medium">Score: {grade.score} / 5.0</p>
              <ul className="list-disc list-inside">
                {grade.issues.map((issue, idx) => (
                  <li key={idx}>
                    <strong>{issue.severity}:</strong> {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
