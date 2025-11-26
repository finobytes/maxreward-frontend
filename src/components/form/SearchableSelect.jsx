import React, { useState, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const SearchableSelect = React.forwardRef(
  (
    {
      id,
      name,
      value,
      onChange,
      onBlur,
      options = [],
      placeholder = "Select option...",
      disabled = false,
      error = false,
      className = "",
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    // Support both {label, value} and {id, name} format
    const normalizedOptions = options.map((opt) => ({
      value: opt.value ?? opt.id,
      label: opt.label ?? opt.name ?? opt.country,
    }));

    const selected =
      normalizedOptions.find((o) => String(o.value) === String(value)) || null;

    // Filter items based on search query
    const filteredOptions = useMemo(() => {
      if (!query) return normalizedOptions;
      return normalizedOptions.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
    }, [query, normalizedOptions]);

    const handleSelect = (item) => {
      // Trigger onChange in react-hook-form compatible format
      if (onChange) {
        // Call onChange with just the value (Controller expects this)
        onChange(item.value);
      }
      setOpen(false);
      setQuery("");
    };

    const buttonClasses = cn(
      "w-full justify-between h-11 text-left font-normal border",
      disabled && "opacity-40 cursor-not-allowed bg-gray-100",
      error
        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
        : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20",
      className
    );

    return (
      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id={id}
            variant="outline"
            className={buttonClasses}
            disabled={disabled}
            type="button"
            onBlur={onBlur}
          >
            <span className={cn("truncate", !selected && "text-gray-400")}>
              {selected ? selected.label : placeholder}
            </span>
            <span className="text-gray-500 text-xs ml-2">▼</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search..."
            />

            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup>
                {filteredOptions.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => handleSelect(item)}
                    className="cursor-pointer"
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";
export default SearchableSelect;
