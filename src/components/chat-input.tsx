"use client";

import { useState, useRef, useCallback } from "react";
import { TuiTextarea } from "@/components/tui/textarea";
import { TuiButton } from "@/components/tui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit: (text: string, images?: File[]) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function ChatInput({
  onSubmit,
  placeholder = "Type your message...",
  disabled = false,
  loading = false,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自动调整 textarea 高度
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustTextareaHeight();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = [...images, ...files].slice(0, 5); // 最多 5 张图片
    setImages(newImages);

    // 生成预览
    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);

    // 重置 input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // 释放预览 URL
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!text.trim() && images.length === 0) || disabled || loading) return;

    await onSubmit(text, images.length > 0 ? images : undefined);
    
    // 清空输入
    setText("");
    setImages([]);
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews([]);
    
    // 重置 textarea 高度
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 发送，Shift+Enter 换行
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/20 bg-black">
      {/* 图片预览区域 */}
      {imagePreviews.length > 0 && (
        <div className="p-2 border-b border-white/10 flex gap-2 flex-wrap">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-20 h-20 object-cover border border-white/20 rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-3 flex gap-2 items-end">
        {/* 图片上传按钮 */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || loading || images.length >= 5}
          className={cn(
            "px-3 py-2 border border-white/20 text-white/70 text-xs",
            "hover:border-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed",
            "font-mono transition-colors"
          )}
          title="Upload image (max 5)"
        >
          📷
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
          disabled={disabled || loading}
        />

        {/* 文本输入框 */}
        <div className="flex-1">
          <TuiTextarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || loading}
            rows={1}
            className="min-h-[40px] max-h-[200px] resize-none"
          />
        </div>

        {/* 发送按钮 */}
        <TuiButton
          type="submit"
          disabled={(!text.trim() && images.length === 0) || disabled || loading}
          className="shrink-0"
        >
          {loading ? "..." : "SEND"}
        </TuiButton>
      </div>

      {/* 提示信息 */}
      <div className="px-3 pb-2 text-xs text-white/30 font-mono">
        Press <kbd className="px-1 py-0.5 bg-white/10 rounded">Enter</kbd> to send,{" "}
        <kbd className="px-1 py-0.5 bg-white/10 rounded">Shift+Enter</kbd> for new line
        {images.length > 0 && ` • ${images.length} image${images.length > 1 ? "s" : ""} attached`}
      </div>
    </form>
  );
}
