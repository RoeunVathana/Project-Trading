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
