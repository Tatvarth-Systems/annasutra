"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Search } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type ComboboxOption = {
  id: string;
  label: string;
  pinned?: boolean;
};

type ComboboxProps = {
  id: string;
  options: ComboboxOption[];
  value: string | null;
  onChange: (id: string) => void;
  placeholder?: string;
  invalid?: boolean;
  emptyText?: string;
};

/** Searchable dropdown combobox component. */
export const Combobox = ({
  id,
  options,
  value,
  onChange,
  placeholder,
  invalid,
  emptyText = "No matches",
}: ComboboxProps) => {
  const selected = useMemo(
    () => options.find((option) => option.id === value) ?? null,
    [options, value],
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(selected?.label ?? "");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const [prevSelected, setPrevSelected] = useState(selected);
  if (selected !== prevSelected) {
    setPrevSelected(selected);
    setQuery(selected?.label ?? "");
  }

  useEffect(() => {
    /** Closes combobox when clicking outside. */
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery(selected?.label ?? "");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selected]);

  const filtered = useMemo(() => {
    const pinned = options.filter((option) => option.pinned);
    const rest = options.filter((option) => !option.pinned);
    const q = query.trim().toLowerCase();
    const matches = q
      ? rest.filter((option) => option.label.toLowerCase().includes(q))
      : rest;
    return [...pinned, ...matches];
  }, [options, query]);

  /** Selects an option, updates query, and closes dropdown. */
  const selectOption = (option: ComboboxOption) => {
    onChange(option.id);
    setQuery(option.label);
    setOpen(false);
  };

  /** Handles keyboard navigation and selection. */
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter")) {
      setOpen(true);
      setActiveIndex(0);
      return;
    }
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) selectOption(option);
    } else if (event.key === "Escape") {
      setOpen(false);
      setQuery(selected?.label ?? "");
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-activedescendant={
          open && filtered[activeIndex]
            ? `${id}-option-${filtered[activeIndex].id}`
            : undefined
        }
        autoComplete="off"
        className={cn(
          "w-full rounded-md border bg-white py-2 pr-3 pl-9 text-sm text-ink placeholder:text-muted focus:ring-2 focus:ring-brand/40 focus:outline-none",
          invalid ? "border-danger" : "border-line",
        )}
        placeholder={placeholder}
        value={query}
        onFocus={() => {
          setOpen(true);
          setActiveIndex(0);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
      />
      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-line bg-white py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="flex items-center gap-2 px-3 py-2 text-sm text-muted">
              <Search className="h-4 w-4" />
              {emptyText}
            </li>
          ) : (
            filtered.map((option, index) => (
              <li
                key={option.id}
                id={`${id}-option-${option.id}`}
                role="option"
                aria-selected={option.id === value}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm",
                  index === activeIndex
                    ? "bg-brand-soft text-brand"
                    : "text-ink",
                  option.pinned && "border-b border-line font-medium",
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectOption(option);
                }}
              >
                {option.label}
                {option.id === value && <Check className="h-4 w-4 shrink-0" />}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
