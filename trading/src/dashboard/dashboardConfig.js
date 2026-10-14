export const RESOURCE_KEYS = ["machines", "categories", "gallery", "specs", "pdfs", "users"];
export const CATEGORY_COLORS = ["#1a788c", "#48a6a0", "#7abcb4", "#e0a05f", "#8b9bd1"];
export const UPLOAD_LIMITS = {
  image: { bytes: 100 * 1024 * 1024, label: "100 MB" },
  pdf: { bytes: 250 * 1024 * 1024, label: "250 MB" },
  video: { bytes: 250 * 1024 * 1024, label: "250 MB" },
};

export const MACHINE_TYPE_OPTIONS = [
  { value: "Main Power Distribution", label: "Main Power Distribution" },
  { value: "Sub Power Distribution", label: "Sub Power Distribution" },
  { value: "Final Power Distribution", label: "Final Power Distribution" },
  { value: "Industrial Control", label: "Industrial Control" },
  { value: "Transmission", label: "Transmission" },
  { value: "Distribution", label: "Distribution" },
  { value: "Power Quality & Automation", label: "Power Quality & Automation" },
  { value: "Electricity Meter", label: "Electricity Meter" },
];

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
      { name: "machineType", label: "Machine type", type: "select", options: MACHINE_TYPE_OPTIONS },
      { name: "power", label: "Power", placeholder: "35 kW" },
      { name: "precision", label: "Precision", placeholder: "0.001 mm" },
      { name: "availability", label: "Availability", placeholder: "In stock" },
      { name: "badge", label: "Badge", placeholder: "New arrival" },
      { name: "imageFile", label: "Machine image", type: "file", apiField: "image", accept: "image/*", maxSize: UPLOAD_LIMITS.image.bytes, maxSizeLabel: UPLOAD_LIMITS.image.label },
      { name: "videoFile", label: "Machine video", type: "file", apiField: "video", accept: "video/*", maxSize: UPLOAD_LIMITS.video.bytes, maxSizeLabel: UPLOAD_LIMITS.video.label, currentKey: "video", clearField: "removeVideo" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Describe the machine and its intended application." },
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
      { name: "imageFile", label: "Gallery image", type: "file", apiField: "image", accept: "image/*", requiredOnCreate: true, maxSize: UPLOAD_LIMITS.image.bytes, maxSizeLabel: UPLOAD_LIMITS.image.label },
    ],
  },
  specs: {
    title: "Specifications",
    singular: "specification",
    description: "Build the specification sections and bullet points shown with each machine. Add one row per bullet, or enter multiple values on separate lines.",
    endpoint: "/api/machine-specs",
    icon: "S",
    fields: [
      { name: "machineId", label: "Machine", type: "relation", resource: "machines", required: true },
      { name: "section", label: "Section", required: true, normalize: "lowercase", placeholder: "Electrical and Control Characteristics" },
      { name: "label", label: "Item label", placeholder: "Frame size (A)" },
      { name: "value", label: "Specification value", type: "textarea", required: true, placeholder: "IEC/EN 60947-1\nIEC/EN 60947-2" },
      { name: "sortOrder", label: "Display order", type: "number", min: 0, defaultValue: 0, placeholder: "0" },
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
      { name: "pdfFile", label: "PDF file", type: "file", apiField: "file", accept: ".pdf,application/pdf", requiredOnCreate: true, maxSize: UPLOAD_LIMITS.pdf.bytes, maxSizeLabel: UPLOAD_LIMITS.pdf.label },
    ],
  },
  users: {
    title: "Users",
    singular: "user",
    description: "Create, update, and remove dashboard users and their access credentials.",
    endpoint: "/api/users",
    createEndpoint: "/api/users/manage",
    icon: "U",
    fields: [
      { name: "name", label: "Name", required: true, placeholder: "Alex Morgan" },
      { name: "email", label: "Email", type: "email", required: true, placeholder: "alex@example.com" },
      { name: "password", label: "Password", type: "password", requiredOnCreate: true, placeholder: "At least 8 characters" },
      { name: "profileImageFile", label: "Profile image", type: "file", apiField: "image", accept: "image/*", maxSize: UPLOAD_LIMITS.image.bytes, maxSizeLabel: UPLOAD_LIMITS.image.label },
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
  { key: "users", label: RESOURCE_CONFIG.users.title, icon: RESOURCE_CONFIG.users.icon },
];

export const TABLE_COLUMNS = {
  machines: [
    { key: "image", label: "Image" },
    { key: "name", label: "Machine" },
    { key: "model", label: "Model" },
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    { key: "machineType", label: "Type" },
    { key: "galleryCount", label: "Gallery" },
    { key: "specCount", label: "Specs" },
    { key: "video", label: "Video" },
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
    { key: "section", label: "Section" },
    { key: "label", label: "Item" },
    { key: "value", label: "Value" },
    { key: "sortOrder", label: "Order" },
  ],
  pdfs: [
    { key: "machine", label: "Machine" },
    { key: "document", label: "Document" },
    { key: "fileSize", label: "Size" },
  ],
  users: [
    { key: "image", label: "Profile" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ],
};

export const emptyRecords = () => ({
  machines: [],
  categories: [],
  gallery: [],
  specs: [],
  pdfs: [],
  users: [],
});
