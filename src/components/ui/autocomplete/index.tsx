"use client";

import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";

import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Size,
} from "@/components/ui/autocomplete/command";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type IOption = {
  value: string;
  label: string;
  [key: string]: string;
};

type AutoCompleteProps = {
  options: IOption[];
  emptyMessage: string;
  value?: IOption;
  onValueChange?: (value: IOption) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: Size;
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
  size,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const selected = value;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) return;

      if (!isOpen) setOpen(true);

      if (event.key === "Enter" && input.value !== "") {
        const option = options.find((o) => o.label === input.value);
        if (option) {
          onValueChange?.(option);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onValueChange],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue("");
  }, []);

  const handleSelectOption = useCallback(
    (option: IOption) => {
      onValueChange?.(option);

      setTimeout(() => {
        inputRef.current?.blur();
      }, 0);
    },
    [onValueChange],
  );

  const displayValue = inputValue || selected?.label || "";

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={displayValue}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          className="text-base"
        />
      </div>

      <div className="relative mt-1">
        <div
          className={cn(
            "absolute top-0 z-10 w-full rounded-xl bg-stone-50",
            isOpen ? "block" : "hidden",
          )}
        >
          <CommandList className="rounded-lg ring-1 ring-slate-200">
            {isLoading && (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            )}

            {!isLoading && options.length > 0 && (
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected?.value === option.value;

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        "flex w-full items-center gap-2",
                        !isSelected && "pl-8",
                      )}
                    >
                      {isSelected && <Check className="w-4" />}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {!isLoading && (
              <CommandPrimitive.Empty className="px-2 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            )}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
