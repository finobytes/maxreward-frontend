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
