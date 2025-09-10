// Modal to allow the user to input prompts to OpenAI about their highlighted text.
"use client";

import { useState } from "react";
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

export default function PromptModal({
  open,
  selectedText,
  onSubmit,
  onClose,
}: PromptModalProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    onSubmit({ selectedText, prompt });
    setPrompt("");
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-zinc-900/95 border border-zinc-700 rounded-xl shadow-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Customize Your Chart
            </DialogTitle>
            {selectedText && (
              <p className="text-xs text-zinc-400 bg-zinc-800/60 rounded p-2 border border-zinc-700">
                <span className="font-medium text-zinc-200">Selected:</span>{" "}
                {selectedText.slice(0, 120)}
                {selectedText.length > 120 && "…"}
              </p>
            )}
          </DialogHeader>

          <Textarea
            placeholder="Add extra instructions (optional)…"
            className="min-h-[120px] bg-zinc-800 border-zinc-700 text-white focus-visible:ring-indigo-500"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <DialogFooter className="flex justify-end space-x-3 pt-2">
            <Button
              variant="secondary"
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-300"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSubmit();
                onClose();
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow hover:from-indigo-600 hover:to-purple-600"
            >
              Generate
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
