// Modal to allow the user to input prompts to OpenAI about their highlighted text.
import { useEffect, useState } from "react";

interface SubmitData {
  selectedText: string;
  prompt: string;
}

export interface PromptModalProps {
  open: boolean;
  selectedText: string;
  onSubmit: (data: SubmitData) => void;
  onClose: () => void;
}

// todo: write onSubmit to send prompt data to backend
export default function PromptModal(props: PromptModalProps) {
  const { open, selectedText, onSubmit, onClose } = props;
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    const submission: SubmitData = {
      selectedText: selectedText,
      prompt: prompt,
    };

    onSubmit(submission);
    setPrompt("");
  };

  if (!open) {
    return null;
  }

  return <div>PromptModal UI goes here.</div>;
}
