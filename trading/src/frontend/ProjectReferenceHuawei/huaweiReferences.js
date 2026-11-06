// Presentation data from the supplied reference design; photos use the local asset library.
export const huaweiReferences = [
  {
    id: "EG-BEN-741", title: "Benban Solar Park", country: "Egypt", region: "Africa",
    sector: "Renewables", status: "Operational", maxVoltage: 500,
    image: "list (4).jpg", alt: "Photovoltaic arrays across a desert solar park",
    specs: [["Voltage", "220kV / 500kV"], ["Architecture", "SF6 GIS"], ["Standards", "IEC 62271-203"], ["Capacity", "1.8 GW AC"]],
  },
  {
    id: "UK-NG-402", title: "National Grid Substations", country: "United Kingdom", region: "Europe",
    sector: "Substations", status: "Live", maxVoltage: 400,
    image: "residential9-item-img1.jpg", alt: "Residential neighborhood and connecting infrastructure viewed from above",
    specs: [["Voltage", "400kV UHV"], ["Architecture", "Digital Twin"], ["Standards", "IEC 61850 Ed2"], ["Compliance", "G59/3 Certified"]],
  },
  {
    id: "ID-JB-992", title: "Java-Bali Grid Extension", country: "Indonesia", region: "Asia Pacific",
    sector: "Transmission", status: "Commissioning", maxVoltage: 500,
    image: "list (2).jpg", alt: "Energy infrastructure and rooftops in a green mountain valley",
    specs: [["Voltage", "150kV / 500kV"], ["Architecture", "Liquid PCS"], ["Standards", "IEC 60076"], ["Protection", "Relay Cluster"]],
  },
  {
    id: "CN-UHV-110", title: "UHV Transmission Hub", country: "China", region: "Asia Pacific",
    sector: "Transmission", status: "Operational", maxVoltage: 1100,
    image: "list (7).jpg", alt: "Lakeside community and infrastructure at dusk",
    specs: [["Voltage", "1100kV UHVDC"], ["Architecture", "Dry-Type Insul"], ["Standards", "GB/T 18487"], ["Loss Rate", "< 1.2% / 1k km"]],
  },
  {
    id: "FR-RTE-225", title: "RTE Grid Expansion", country: "France", region: "Europe",
    sector: "Substations", status: "Operational", maxVoltage: 400,
    image: "list.jpg", alt: "Solar-equipped rooftops surrounded by green fields",
    specs: [["Voltage", "225kV / 400kV"], ["Architecture", "AIS / GIS Mix"], ["Standards", "NF C 13-200"], ["Monitoring", "Real-time RTU"]],
  },
  {
    id: "CL-ATC-088", title: "Atacama Solar Hub", country: "Chile", region: "Latin America",
    sector: "Renewables", status: "Operational", maxVoltage: 220,
    image: "list (4).jpg", alt: "Rows of solar panels in a sunlit desert", imagePosition: "70% 70%",
    specs: [["Voltage", "220kV"], ["Architecture", "High-Alt GIS"], ["Standards", "ASTM E2481"], ["Inverters", "Modular 1500V"]],
  },
  {
    id: "MX-REF-551", title: "Energy Reform Phase II", country: "Mexico", region: "Latin America",
    sector: "Substations", status: "Upgrading", maxVoltage: 230,
    image: "yoonsteel-energy-storage-list.jpg", alt: "Industrial solar and energy storage installation",
    specs: [["Voltage", "115kV / 230kV"], ["Architecture", "Hybrid PASS"], ["Standards", "NOM-001-SEDE"], ["Interface", "SCADA/EMS"]],
  },
  {
    id: "NL-WND-330", title: "North Sea Integration", country: "Netherlands", region: "Europe",
    sector: "Renewables", status: "Operational", maxVoltage: 380,
    image: "list (5).jpg", alt: "Floating solar energy infrastructure on a lake",
    specs: [["Voltage", "66kV / 380kV"], ["Architecture", "Marine GIS"], ["Standards", "DNV-ST-0145"], ["Protection", "IP67 Enclosures"]],
  },
  {
    id: "AU-REZ-104", title: "Renewable Energy Zone", country: "Australia", region: "Asia Pacific",
    sector: "Renewables", status: "Planning", maxVoltage: 500,
    image: "list (1).jpg", alt: "Solar panels and commercial battery energy storage cabinets",
    specs: [["Voltage", "330kV / 500kV"], ["Architecture", "BESS Synch"], ["Standards", "AS/NZS 3000"], ["Freq Cont", "Fast FCAS"]],
  },
];
