import React, { useState, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // shadcn popover
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"; // shadcn command (searchable list)

// Example: a combined Search + Select UI
// Props:
// - options: [{ id, label, sublabel? }]
// - placeholder: string
// - onSelect: (option) => void
// - className: additional wrapper classes

export default function SearchableSelect({
  options = [],
  placeholder = "Search or select...",
  onSelect = () => {},
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  // client-side filter (case-insensitive)
  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.sublabel && o.sublabel.toLowerCase().includes(q))
    );
  }, [options, query]);

  function handleSelect(item) {
    setSelected(item);
    onSelect(item);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className={`w-full max-w-md ${className}`}>
      <label className="block text-sm font-medium mb-2">Search & Select</label>

      {/* visible input + dropdown trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-11 px-3 text-left flex items-center"
          >
            <div className="flex-1">
              {selected ? (
                <div className="truncate">{selected.label}</div>
              ) : (
                <div className="text-muted-foreground">{placeholder}</div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">▼</div>
          </Button>
        </PopoverTrigger>

        <PopoverContent side="bottom" align="start" className="w-full p-0">
          {/* command is shadcn's searchable list component */}
          <Command className="rounded-md border">
            <CommandInput
              value={query}
              onValueChange={(v) => setQuery(v)}
              placeholder="Type to search..."
              className="h-11 px-3"
            />
            <CommandList className="max-h-64 overflow-auto">
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup>
                {filtered.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    onSelect={() => handleSelect(opt)}
                    className="flex flex-col px-3 py-2 hover:bg-slate-50"
                  >
                    <div className="text-sm">{opt.label}</div>
                    {opt.sublabel && (
                      <div className="text-xs text-muted-foreground">
                        {opt.sublabel}
                      </div>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* small search-only input below the control (optional) */}
      <div className="mt-3">
        <Input
          placeholder="Quick search (filters the same list)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}

// -----------------------------
// Example usage below (copy into a page/component)
// -----------------------------

export function ExamplePage() {
  const sampleOptions = [
    { id: "dhaka", label: "Dhaka", sublabel: "Capital of Bangladesh" },
    { id: "chittagong", label: "Chattogram", sublabel: "Port city" },
    { id: "sylhet", label: "Sylhet", sublabel: "Tea & hills" },
    { id: "rajshahi", label: "Rajshahi", sublabel: "Mango region" },
    { id: "khulna", label: "Khulna", sublabel: "South-west" },
  ];

  function handleSelect(opt) {
    console.log("selected: ", opt);
    // show toast / set form value / call API etc.
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Search + Select demo</h2>
      <SearchableSelect
        options={sampleOptions}
        onSelect={handleSelect}
        placeholder="Search city..."
      />
    </div>
  );
}
