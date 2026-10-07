export const RESOURCE_KEYS = ["machines", "categories", "gallery", "specs", "pdfs"];
export const CATEGORY_COLORS = ["#1a788c", "#48a6a0", "#7abcb4", "#e0a05f", "#8b9bd1"];

export const RESOURCE_CONFIG = {
  machines: {
    title: "Machines",
    singular: "machine",
    description: "Manage machine inventory, categories, and technical details.",
    endpoint: "/api/machines",
    icon: "M",
    fields: [
      { name: "name", label: "Machine name", required: true, placeholder: "Precision Pro 5K" },
      { name: "model", label: "Model", required: true, placeholder: "EFS-CNC-5000" },
      { name: "categoryId", label: "Category", type: "relation", resource: "categories", required: true },
      { name: "machineType", label: "Machine type", placeholder: "Milling center" },
      { name: "power", label: "Power", placeholder: "35 kW" },
      { name: "precision", label: "Precision", placeholder: "0.001 mm" },
      { name: "availability", label: "Availability", placeholder: "In stock" },
      { name: "badge", label: "Badge", placeholder: "New arrival" },
      { name: "imageFile", label: "Machine image", type: "file", apiField: "image", accept: "image/*" },
    ],
  },
  categories: {
    title: "Categories",
    singular: "category",
    description: "Group machines and control which categories are active.",
    endpoint: "/api/categories",
    icon: "C",
    fields: [
      { name: "name", label: "Category name", required: true, placeholder: "Milling centers" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Category description" },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ],
      },
    ],
  },
  gallery: {
    title: "Gallery",
    singular: "gallery image",
    description: "Upload, order, and manage machine gallery images.",
    endpoint: "/api/machine-galleries",
    icon: "G",
    fields: [
      { name: "machineId", label: "Machine", type: "relation", resource: "machines", required: true },
      { name: "sortOrder", label: "Sort order", type: "number", min: 0, required: true, placeholder: "0" },
      { name: "imageFile", label: "Gallery image", type: "file", apiField: "image", accept: "image/*", requiredOnCreate: true },
    ],
  },
  specs: {
    title: "Specifications",
    singular: "specification",
    description: "Maintain the technical specifications shown with each machine.",
    endpoint: "/api/machine-specs",
    icon: "S",
    fields: [
      { name: "machineId", label: "Machine", type: "relation", resource: "machines", required: true },
      { name: "specName", label: "Specification", required: true, placeholder: "Spindle speed" },
      { name: "specValue", label: "Value", required: true, placeholder: "12,000 RPM" },
    ],
  },
  pdfs: {
    title: "PDF library",
    singular: "PDF document",
    description: "Attach product manuals, catalogs, and technical documents.",
    endpoint: "/api/machine-pdfs",
    icon: "P",
    fields: [
      { name: "machineId", label: "Machine", type: "relation", resource: "machines", required: true },
      { name: "fileName", label: "Document name", placeholder: "Service manual.pdf" },
      { name: "pdfFile", label: "PDF file", type: "file", apiField: "file", accept: ".pdf,application/pdf", requiredOnCreate: true },
    ],
  },
};

export const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: "⌂" },
  {
    key: "machines",
    label: RESOURCE_CONFIG.machines.title,
    icon: RESOURCE_CONFIG.machines.icon,
      children: ["machines", "categories", "gallery", "specs", "pdfs"].map((key) => ({
      key,
      label: RESOURCE_CONFIG[key].title,
      icon: RESOURCE_CONFIG[key].icon,
    })),
  },
];

export const TABLE_COLUMNS = {
  machines: [
    { key: "image", label: "Image" },
    { key: "name", label: "Machine" },
    { key: "model", label: "Model" },
    { key: "category", label: "Category" },
    { key: "machineType", label: "Type" },
    { key: "galleryCount", label: "Gallery" },
    { key: "specCount", label: "Specs" },
  ],
  categories: [
    { key: "name", label: "Category" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" },
  ],
  gallery: [
    { key: "image", label: "Image" },
    { key: "machine", label: "Machine" },
    { key: "sortOrder", label: "Sort order" },
  ],
  specs: [
    { key: "machine", label: "Machine" },
    { key: "specName", label: "Specification" },
    { key: "specValue", label: "Value" },
  ],
  pdfs: [
    { key: "machine", label: "Machine" },
    { key: "document", label: "Document" },
    { key: "fileSize", label: "Size" },
  ],
};

export const emptyRecords = () => ({
  machines: [],
  categories: [],
  gallery: [],
  specs: [],
  pdfs: [],
});
