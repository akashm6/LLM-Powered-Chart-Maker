// Modal to allow the user to input prompts to OpenAI about their highlighted text.
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { motion } from "framer-motion";

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle>Customize your chart prompt</DialogTitle>
          </DialogHeader>
          <Textarea
            className="min-h-[120px] mt-4"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSubmit({selectedText: selectedText, prompt: prompt})}>Submit</Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
