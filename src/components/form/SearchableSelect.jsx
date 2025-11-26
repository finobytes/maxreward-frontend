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

export default function SearchableSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select option...",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.id === value) || null;

  // Filter items based on search query
  const filteredOptions = useMemo(() => {
    if (!query) return options;
    return options.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, options]);

  const handleSelect = (item) => {
    onChange(item.id); // store only the id
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-11">
          {selected ? selected.name : placeholder}
          <span className="text-gray-500 text-xs">▼</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
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
                <CommandItem key={item.id} onSelect={() => handleSelect(item)}>
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
