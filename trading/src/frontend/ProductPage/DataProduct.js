const products = [
  {
    id: 1,

    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    ],

    category: "MILLING CENTER",
    model: "EFS-CNC-5000",
    name: "PRECISION PRO 5K",

    specs: [
      ["ACCURACY", "0.001mm"],
      ["SPINDLE", "24k RPM"],
    ],

    badge: "BEST SELLER",

    machineType: "milling",
    power: "highPower",
    precision: "subMicron",
    availability: "inStock",
  },

  {
    id: 2,

    image:
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
    ],

    category: "TURNING CENTER",
    model: "EFS-L-3200",
    name: "INDUSTRIAL LATHE X1",

    specs: [
      ["SWING", "650mm"],
      ["ACCURACY", "0.003mm"],
    ],

    badge: "NEW ARRIVAL",

    machineType: "turning",
    power: "highPower",
    precision: "standardPrecision",
    availability: "inStock",
  },

  {
    id: 3,

    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    ],

    category: "5-AXIS UNIVERSAL",
    model: "EFS-V5-PRO",
    name: "OMNI-AXIS PRO",

    specs: [
      ["CAPACITY", "800kg Load"],
      ["TRAVEL", "X/Y/Z 1200mm"],
    ],

    machineType: "fiveAxis",
    power: "heavyDuty",
    precision: "subMicron",
    availability: "customOrder",
  },

  {
    id: 4,

    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=900&q=80",
    ],

    category: "MILLING CENTER",
    model: "EFS-CNC-3000",
    name: "COMPACT MILL SERIES",

    specs: [
      ["ACCURACY", "0.002mm"],
      ["FOOTPRINT", "Compact"],
    ],

    machineType: "milling",
    power: "standard",
    precision: "standardPrecision",
    availability: "inStock",
  },

  {
    id: 5,

    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
    ],

    category: "HEAVY DUTY MILL",
    model: "EFS-DCM-8000",
    name: "TITAN DOUBLE COLUMN",

    specs: [
      ["POWER", "75kW Peak"],
      ["WEIGHT", "45,000 kg"],
    ],

    machineType: "milling",
    power: "heavyDuty",
    precision: "standardPrecision",
    availability: "customOrder",
  },

  {
    id: 6,

    image:
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    ],

    category: "MICRO MACHINING",
    model: "EFS-MED-X",
    name: "BIO-PRECISION X",

    specs: [
      ["TOLERANCE", "± 0.0005mm"],
      ["RPM", "60,000 Max"],
    ],

    badge: "SPECIALIZED",

    machineType: "fiveAxis",
    power: "highPower",
    precision: "subMicron",
    availability: "inStock",
  },

  {
    id: 7,

    image:
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
    ],

    category: "TURNING CENTER",
    model: "EFS-L-4200",
    name: "PRECISION LATHE X2",

    specs: [
      ["SWING", "720mm"],
      ["ACCURACY", "0.002mm"],
    ],

    machineType: "turning",
    power: "standard",
    precision: "standardPrecision",
    availability: "inStock",
  },

  {
    id: 8,

    image:
      "https://images.unsplash.com/photo-1581093458791-9d42e3c6d0f7?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1581093458791-9d42e3c6d0f7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
    ],

    category: "5-AXIS UNIVERSAL",
    model: "EFS-V5-X2",
    name: "ADVANCED AXIS PRO",

    specs: [
      ["CAPACITY", "1000kg Load"],
      ["TRAVEL", "X/Y/Z 1500mm"],
    ],

    machineType: "fiveAxis",
    power: "heavyDuty",
    precision: "subMicron",
    availability: "customOrder",
  },

  {
    id: 9,

    image:
      "https://images.unsplash.com/photo-1581091870627-3f5a5f5f5d91?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1581091870627-3f5a5f5f5d91?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    ],

    category: "MILLING CENTER",
    model: "EFS-CNC-7000",
    name: "HIGH SPEED MILL",

    specs: [
      ["ACCURACY", "0.001mm"],
      ["SPINDLE", "30k RPM"],
    ],

    machineType: "milling",
    power: "highPower",
    precision: "subMicron",
    availability: "inStock",
  },

  {
    id: 10,

    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
    ],

    category: "HEAVY DUTY MILL",
    model: "EFS-DCM-9000",
    name: "TITAN PRO MAX",

    specs: [
      ["POWER", "90kW Peak"],
      ["WEIGHT", "55,000 kg"],
    ],

    machineType: "milling",
    power: "heavyDuty",
    precision: "standardPrecision",
    availability: "customOrder",
  },
];

export default products;
