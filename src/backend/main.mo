actor {
  let name = "Trinity Polymer";
  let phone = "+49 170 4174039";
  let services = [
    "PVC Processing",
    "Thermoplastics",
    "Extrusion",
    "Custom Plastic Parts",
    "Injection Molding",
    "Material Consulting",
    "Material Selection",
    "Plastic Solutions",
    "3D Printing",
  ];

  public query func getCompanyName() : async Text {
    name;
  };

  public query func getContactNumber() : async Text {
    phone;
  };

  public query func getServices() : async [Text] {
    services;
  };
};
