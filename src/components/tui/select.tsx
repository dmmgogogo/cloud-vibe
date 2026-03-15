"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface TuiSelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TuiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "select...",
  className,
}: TuiSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [filter, setFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(filter.toLowerCase())
  );

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && filtered[highlighted]) {
      onChange(filtered[highlighted].value);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function openSelect() {
    setHighlighted(0);
    setFilter("");
    setOpen(true);
  }

  return (
    <div ref={containerRef} className={cn("font-mono text-sm relative", className)}>
      <div className="flex items-center gap-1">
        {label && <span className="text-white/50 whitespace-nowrap">$ {label}&gt;</span>}
        <button
          type="button"
          onClick={() => {
            if (open) {
              setOpen(false);
              return;
            }
            openSelect();
          }}
          className="flex-1 text-left text-sm border-b border-white/20 hover:border-white/60 py-0.5 text-white/80"
        >
          {selected ? selected.label : <span className="text-white/30">{placeholder}</span>}
          <span className="text-white/30 ml-2">↕</span>
        </button>
      </div>

      {open && (
        <div className="absolute z-50 left-0 top-full mt-0.5 w-full bg-black border border-white/30 max-h-48 overflow-y-auto">
          <div className="p-1 border-b border-white/20">
            <input
              ref={inputRef}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setHighlighted(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="filter..."
              className="w-full bg-transparent text-white text-xs outline-none placeholder:text-white/30 font-mono"
            />
          </div>
          {filtered.length === 0 ? (
            <div className="px-2 py-1 text-white/30 text-xs">no results</div>
          ) : (
            filtered.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-2 py-0.5 text-xs font-mono",
                  i === highlighted ? "bg-white text-black" : "text-white/80 hover:bg-white/10"
                )}
              >
                {i === highlighted ? "> " : "  "}
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
