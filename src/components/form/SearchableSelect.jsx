import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { buttonVariants } from "@/components/ui/button";
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

    const normalizedOptions = useMemo(
      () =>
        (options || [])
          .map((opt) => {
            if (opt === null || opt === undefined) return null;
            if (
              typeof opt === "string" ||
              typeof opt === "number" ||
              typeof opt === "boolean"
            ) {
              return { value: opt, label: String(opt) };
            }
            const value = opt.value ?? opt.id ?? opt.key;
            const label =
              opt.label ??
              opt.name ??
              opt.country ??
              opt.title ??
              opt.business_name ??
              opt.businessName ??
              "";
            const safeValue =
              value ?? (label !== "" ? label : undefined);
            if (safeValue === undefined || safeValue === null) return null;
            return { value: safeValue, label: String(label || safeValue) };
          })
          .filter(Boolean),
      [options]
    );

    const selected =
      normalizedOptions.find((o) => String(o.value) === String(value)) || null;

    const filteredOptions = useMemo(() => {
      if (!query) return normalizedOptions;
      const needle = query.toLowerCase();
      return normalizedOptions.filter((item) =>
        item.label.toLowerCase().includes(needle)
      );
    }, [query, normalizedOptions]);

    const handleSelect = (item) => {
      onChange?.(item.value);
      setOpen(false);
      setQuery("");
    };

    const buttonClasses = cn(
      buttonVariants({ variant: "outline" }),
      "w-full justify-between h-11 text-left font-normal border",
      disabled && "opacity-40 cursor-not-allowed bg-gray-100",
      error
        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
        : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20",
      className
    );

    useEffect(() => {
      if (!open) setQuery("");
    }, [open]);

    return (
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (disabled) return;
          setOpen(nextOpen);
        }}
      >
        <PopoverTrigger asChild>
          <button
            ref={ref}
            id={id}
            name={name}
            type="button"
            className={buttonClasses}
            disabled={disabled}
            onBlur={onBlur}
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            <span className={cn("truncate", !selected && "text-gray-400")}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
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
                    value={item.label}
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
