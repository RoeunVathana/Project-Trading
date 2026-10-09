export const RESOURCE_KEYS = ["machines", "categories", "gallery", "specs", "pdfs", "users"];
export const CATEGORY_COLORS = ["#1a788c", "#48a6a0", "#7abcb4", "#e0a05f", "#8b9bd1"];
export const UPLOAD_LIMITS = {
  image: { bytes: 100 * 1024 * 1024, label: "100 MB" },
  pdf: { bytes: 250 * 1024 * 1024, label: "250 MB" },
  video: { bytes: 250 * 1024 * 1024, label: "250 MB" },
};

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
      { name: "imageFile", label: "Machine image", type: "file", apiField: "image", accept: "image/*", maxSize: UPLOAD_LIMITS.image.bytes, maxSizeLabel: UPLOAD_LIMITS.image.label },
      { name: "videoFile", label: "Machine video", type: "file", apiField: "video", accept: "video/*", maxSize: UPLOAD_LIMITS.video.bytes, maxSizeLabel: UPLOAD_LIMITS.video.label, currentKey: "video", clearField: "removeVideo" },
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
    description: "Maintain the structured specification matrix shown with each machine.",
    endpoint: "/api/machine-specs",
    icon: "S",
    fields: [
      { name: "machineId", label: "Machine", type: "relation", resource: "machines", required: true },
      { name: "frameVariation", label: "Frame variation", required: true, placeholder: "NXA16" },
      { name: "ratedCurrent", label: "Rated current (In)", required: true, placeholder: "630A - 1600A" },
      { name: "voltage", label: "Voltage (Ue)", required: true, placeholder: "AC380/400/415V" },
      { name: "icuIcs", label: "ICU / ICS (kA)", required: true, placeholder: "50 / 50" },
      { name: "poles", label: "Poles", required: true, placeholder: "3P / 4P" },
      { name: "mounting", label: "Mounting", required: true, placeholder: "Fixed / Draw-out" },
      { name: "tripUnit", label: "Trip unit", required: true, placeholder: "2.0 / 3.0 / 5.0 (LSIG)" },
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
    { key: "frameVariation", label: "Frame variation" },
    { key: "ratedCurrent", label: "Rated current" },
    { key: "voltage", label: "Voltage" },
    { key: "icuIcs", label: "ICU / ICS" },
    { key: "poles", label: "Poles" },
    { key: "mounting", label: "Mounting" },
    { key: "tripUnit", label: "Trip unit" },
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
