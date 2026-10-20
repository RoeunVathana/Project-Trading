export const toSpecificationRows = (specifications) => (specifications || [])
  .map((specification) => ({
    frameVariation: specification.frameVariation || specification.specName || "",
    ratedCurrent: specification.ratedCurrent || (specification.specName ? specification.specValue : ""),
    voltage: specification.voltage || "",
    icuIcs: specification.icuIcs || "",
    poles: specification.poles || "",
    mounting: specification.mounting || "",
    tripUnit: specification.tripUnit || "",
  }))
  .filter((row) => Object.values(row).some(Boolean));

const LEGACY_SPEC_FIELDS = [
  { key: "frameVariation", section: "Electrical and Control Characteristics", label: "Frame variation" },
  { key: "ratedCurrent", section: "Electrical and Control Characteristics", label: "Rated current (In)" },
  { key: "voltage", section: "Electrical and Control Characteristics", label: "Rated operational voltage Ue (VAC)" },
  { key: "icuIcs", section: "Electrical and Control Characteristics", label: "ICU / ICS (kA)" },
  { key: "tripUnit", section: "Electrical and Control Characteristics", label: "Trip unit" },
  { key: "poles", section: "Mounting", label: "Number of poles" },
  { key: "mounting", section: "Mounting", label: "Installation method" },
];

export const splitSpecificationValue = (value) => String(value || "")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const SMALL_SECTION_WORDS = new Set(["a", "an", "and", "for", "in", "of", "on", "or", "the", "to", "with"]);

export const formatSpecificationSection = (section) => {
  const value = String(section || "General").trim() || "General";
  if (value !== value.toLocaleLowerCase()) return value;

  return value.split(/\s+/).map((word, index) => {
    if (index > 0 && SMALL_SECTION_WORDS.has(word)) return word;
    return word.charAt(0).toLocaleUpperCase() + word.slice(1);
  }).join(" ");
};

export const toSpecificationEntries = (specifications) => (specifications || [])
  .flatMap((specification, specificationIndex) => {
    const structuredValue = specification.value || specification.specValue || "";
    const hasContentFields = specification.section || specification.label || specification.value;

    if (hasContentFields) {
      return structuredValue
        ? [{
            id: specification.id,
            section: specification.section || "General",
            label: specification.label || specification.specName || "",
            value: structuredValue,
            sortOrder: Number(specification.sortOrder) || specificationIndex,
          }]
        : [];
    }

    const legacyEntries = LEGACY_SPEC_FIELDS
      .filter(({ key }) => specification[key])
      .map(({ key, section, label }, fieldIndex) => ({
        id: `${specification.id || specificationIndex}-${key}`,
        section,
        label,
        value: specification[key],
        sortOrder: specificationIndex * LEGACY_SPEC_FIELDS.length + fieldIndex,
      }));

    if (legacyEntries.length) return legacyEntries;
    return specification.specName || specification.specValue
      ? [{
          id: specification.id || specificationIndex,
          section: "General",
          label: specification.specName || "",
          value: specification.specValue || "",
          sortOrder: specificationIndex,
        }]
      : [];
  })
  .sort((left, right) => left.sortOrder - right.sortOrder);

export const groupSpecificationEntries = (entries) => {
  const groups = [];
  const groupMap = new Map();

  (entries || []).forEach((entry) => {
    const section = String(entry.section || "General").trim() || "General";
    const sectionKey = section.toLocaleLowerCase();
    let group = groupMap.get(sectionKey);
    if (!group) {
      group = { title: formatSpecificationSection(section), items: [] };
      groupMap.set(sectionKey, group);
      groups.push(group);
    }
    group.items.push(entry);
  });

  return groups;
};
