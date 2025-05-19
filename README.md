# Alt Text Assistant (Proof of Concept)

A simple, AI-powered tool to help developers and content creators generate effective and accessible alt text for images. The assistant guides users through a question-and-answer flow, generates alt text from the responses, and provides a score and issue list to improve accessibility.

---

## Features

- Upload image or paste alt text directly
- AI-guided Q&A flow to describe image content
- Live alt text generation after each answer
- Automatic scoring of alt text (0.0 to 5.0 scale)
- Issue severity tagging: Blocker, Major, Minor, Enhancement
- Editable final text area with re-grading option
- Copy alt text for use in your HTML, ARIA, etc.

---

## User Flow

1. **Upload an Image** or choose **Paste Text** mode
2. **Answer guided questions** about the image (e.g., subject, action, setting)
3. After each response, AI generates an **updated alt text**
4. Alt text is **scored and analyzed**, issues are displayed
5. Users can **manually edit** and re-review their alt text
6. Copy or export the finalized description

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Component UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Language:** TypeScript
- **AI Services:** OpenAI `gpt-4` via `openai` npm package

---

## Alt Text Grading Criteria

| Criterion                | Description                                         |
|--------------------------|-----------------------------------------------------|
| **Completeness**         | Does it mention all key elements?                  |
| **Clarity & Specificity**| Is it too vague or overly general?                 |
| **Conciseness**          | Preferably under 150 characters                    |
| **Avoids Redundancy**    | Avoid phrases like "Image of"                      |
| **Context & Emotion**    | Includes tone, emotion, or purpose when relevant   |

### Issue Severity Levels

| Severity     | Description                                  |
|--------------|----------------------------------------------|
| **Blocker**  | Missing key information or accessibility risk |
| **Major**    | Lacks important detail or action              |
| **Minor**    | Minor style/tone clarity issue                |
| **Enhancement** | Optional polish or refinement suggestion   |

---

## API Endpoints

### `/api/generate-alt-text`
Generates alt text from current description.

- **Method:** POST  
- **Body:** `{ description: string }`  
- **Returns:** `{ altText: string }`

### `/api/next-question`
Suggests the next most relevant follow-up question.

- **Method:** POST  
- **Body:** `{ altTextSoFar: string }`  
- **Returns:** `{ question: string }`

### `/api/grade-alt-text`
Scores and critiques the alt text.

- **Method:** POST  
- **Body:** `{ text: string }`  
- **Returns:** `{ score: number, issues: { severity: string, message: string }[] }`

---

## Environment Setup

Create a `.env.local` file with your OpenAI key:

```bash
OPENAI_API_KEY=your_openai_key_here
```

Then install dependencies and run the dev server:

```bash
npm install
npm run dev
```

---

## Notes

- This is a **proof-of-concept** and does not persist data.
- Additional validation, logging, and auth should be added for production use.
- The alt text logic can be expanded to handle specific image types (e.g., charts, memes, screenshots).

---
