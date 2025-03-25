const enTranslations = {
  app: {
    title: "BiteBack",
    description:
      "Simulation game for survival coordination in a zombie outbreak",
    loading: "Loading...",
  },
  common: {
    cancel: "Cancel",
    submit: "Submit",
    error: "An error occurred",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
  },
  header: {
    exp: "EXP",
    id: "ID",
  },
  inventory: {
    title: "Inventory",
    medkit: "Medkit",
    serum: "Serum",
    painkiller: "Painkiller",
    food: "Food",
    show: "Show Inventory",
    hide: "Hide Inventory",
  },
  map: {
    addMarker: "Add marker at this location:",
    zombie: "Zombie",
    camp: "Camp",
    traffic: "Traffic",
    zombieSighting: "Zombie Sighting",
    survivorCamp: "Survivor Camp",
    survivorMovement: "Survivor Movement",
    votes: "Votes",
    approved: "(Approved)",
    addedAt: "Added at",
    safeCampsOnly: "Safe Camps Only",
    allCamps: "All Camps",
  },
  chat: {
    title: "Survivor Network",
    room: "Room",
    sendMessage: "Type your message...",
    noMessages: "No messages in this room yet.",
    vote: "Vote",
    requestItem: "Request Item",
    cities: {
      istanbul: "Istanbul",
      ankara: "Ankara",
      izmir: "Izmir",
      antalya: "Antalya",
      bursa: "Bursa",
    },
  },
  sos: {
    button: "SOS",
    prompt: "Enter your emergency message:",
    title: "EMERGENCY BROADCAST",
    description:
      "Enter your emergency message. This will be sent to all survivors.",
    send: "Send",
    messagePlaceholder: "Describe your emergency situation in detail...",
    broadcastWarning:
      "This message will be broadcast to all survivors and may attract zombies in the area!",
    helpPrefix: "!help",
    backupNeeded: "Need backup",
    immediately: "immediately",
    near: "near",
  },
  items: {
    request: "Request an item:",
    medkit: "Medkit",
    serum: "Serum",
    painkiller: "Painkiller",
    food: "Food",
  },
  infectionMeter: {
    title: "Zombie Outbreak",
    protectionLevel: "Protection Level",
    zoneSafety: "Zone Safety",
    dailyStats: "Daily Statistics",
    newZombies: "New Zombies Spotted",
    newSafeCamps: "New Safe Camps",
    recommendations: "Recommendations",
    protection: {
      critical: "Critical",
      moderate: "Moderate",
      good: "Good",
    },
    safety: {
      safe: "Safe",
      risky: "Risky",
      dangerous: "Dangerous",
    },
    recommendationDangerous: "Urgently establish new safe camps!",
    recommendationRisky: "Propose more camps to increase zone safety.",
    recommendationSafe: "The zone is currently safe.",
    tooltip: "Environmental Threats",
  },
  help: {
    title: "BiteBack Help",
    mapUsage: {
      title: "Map Usage",
      description: "Click on the map to add markers.",
    },
    markers: {
      zombie: "Zombie - Mark zombie sightings (20 EXP)",
      camp: "Camp - Propose safe camps (30 EXP)",
      traffic: "Traffic - Mark survivor movements",
    },
    chat: {
      title: "Chat System",
      description: "Communicate with other survivors in city-based chat rooms.",
      sos: "SOS: Use in emergencies to request help (50 EXP)",
      requestItem: "Request Item: Specify items you need (10 EXP)",
      vote: "Vote for Camp: Vote to approve proposed camps (10 EXP)",
    },
    exp: {
      title: "Earning EXP",
      description:
        "You can earn experience points through the following actions:",
      zombie: "Marking zombies: 20 EXP",
      camp: "Proposing camps: 30 EXP",
      vote: "Voting for camps: 10 EXP",
      sos: "Sending SOS: 50 EXP",
      requestItem: "Requesting items: 10 EXP",
    },
    tips: {
      title: "Tips",
      emergencyMessages:
        "Red highlighted messages contain emergencies, read them carefully!",
      campApproval:
        'Camps are marked "safe" when they receive 70% approval (7 out of 10 votes)',
      citySelection:
        "You can change the city selection from the top left corner of the map",
      safeCamps: 'Use the "Safe Camps Only" button to view only approved camps',
    },
    disclaimer:
      "This is a simulation game. In case of a real zombie outbreak, please follow instructions given by official authorities.",
    understood: "Understood",
  },
  footer: {
    description: "BiteBack: Open-source survival game demo for fun and good",
    disclaimer:
      "This is a simulation game. No zombies were harmed in the making of this demo.",
    copyright: "© {year} BiteBack Project",
  },
  environment: {
    title: "Area Analysis",
    radiation: "Air Pollution",
    zombieDensity: "Zombie Density",
    activeCombat: "Active Combat",
    recommendedGear: "Recommended Gear",
    mask: "Gas Mask",
    serum: "Antidote Serum",
    armor: "Protective Armor",
  },
  chemicals: {
    title: "Chemical Threats",
    measure: "Measure",
    create: "Create",
    type: "Chemical Type",
    radius: "Radius",
    intensity: "Intensity",
    duration: "Duration",
    tearGas: "Tear Gas",
    toxin: "Toxin",
    smokeScreen: "Smoke Screen",
    radiation: "Radiation",
    noActive: "No active chemical threats detected.",
    protection: "Protective Measures",
    protectionMask: "Use gas mask",
    protectionSuit: "Wear protective clothing",
    protectionGoggles: "Use protective goggles",
    protectionRadiation: "Use radiation protective equipment",
    warning: "WARNING: Chemical threats detected in the area!",
  },
  hudPanel: {
    infection: "Infection Status",
    zombies: "Zombie Radar",
    chemicals: "Chemical Analysis",
    radar: "Navigation",
    environment: "Environment Analysis",
    toggleButton: "Tools",
  },
  notifications: {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
    chemicalDetected: "Chemical threat detected!",
    zombieHorde: "Warning! Zombie horde approaching!",
    campApproved: "New safe camp approved!",
    levelUp: "Level Up!",
    rankChanged: "New rank: {rank}",
  },
  mobileMenu: {
    map: "Map",
    chat: "Chat",
    inventory: "Inventory",
    help: "Help",
    settings: "Settings",
  },
  events: {
    newEvent: "New Event!",
    timeLeft: "Time Left",
    emergencyNotification: "Emergency Notification",
    location: "Location",
    risk: "Risk",
    messageExpire: "This message will disappear in {minutes}:{seconds}",
    zombieHorde: {
      title: "Zombie Horde Alert",
      description:
        "A large zombie horde was spotted nearby! They're approaching quickly.",
      details: "Large zombie horde",
      detailsExamined: "Large zombie horde (Examined)",
      options: {
        mark: "Mark the horde (Safe)",
        approach: "Approach the horde (Risky)",
      },
      success: "Horde Marked",
      successDesc:
        "You successfully marked the zombie horde and earned {exp} EXP.",
      exploreSuccess: "Exploration Successful",
      exploreSuccessDesc:
        "You gathered valuable information by examining the zombie horde up close and earned {exp} EXP!",
      exploreFail: "Exploration Failed",
      exploreFailDesc:
        "The zombies noticed you! You managed to escape but got injured.",
    },
    survivorFound: {
      title: "Survivor Found",
      description: "A survivor was spotted nearby. They might need help.",
      campDetails: "Rescue camp",
      options: {
        help: "Help them (Safe)",
        rescue: "Send rescue team (Risky)",
      },
      helpSuccess: "Help Provided",
      helpSuccessDesc: "You helped the survivor and earned {exp} EXP.",
      rescueSuccess: "Rescue Successful",
      rescueSuccessDesc:
        "You safely rescued the survivors and earned {exp} EXP!",
      rescueFail: "Rescue Failed",
      rescueFailDesc: "Zombie attack during rescue! The team had to retreat.",
    },
    unknown: {
      title: "Unknown Event",
      description: "A situation requiring urgent attention has been detected.",
      options: {
        investigate: "Investigate",
      },
      investigateSuccess: "Event Investigated",
      investigateSuccessDesc:
        "You investigated the event and earned {exp} EXP.",
    },
    contaminatedArea: {
      title: "Contaminated Area",
      description: "High levels of radiation detected in the area.",
    },
    suppliesDrop: {
      title: "Supplies Drop",
      description: "An emergency supply package has been dropped nearby.",
    },
    radioMessage: {
      title: "Radio Message",
      description: "A message has been detected on the emergency frequency.",
    },
    options: {
      investigate: "Investigate",
      avoid: "Avoid",
      help: "Help",
      collect: "Collect",
      listen: "Listen",
    },
  },
  ranks: {
    novice: "Novice",
    survivor: "Survivor",
    ranger: "Ranger",
    defender: "Defender",
    elite: "Elite",
  },
  settings: {
    title: "Settings",
    general: "General",
    appearance: "Appearance",
    language: "Language",
    sound: "Sound",
    soundDesc: "Enable/disable game sounds",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    notifications: "Notifications",
    notificationsDesc: "Enable/disable game notifications",
    serverRegion: "Server Region",
    account: "Account",
    rename: "Rename",
    resetToDefaults: "Reset to Defaults",
    save: "Save",
  },
  emergencyMessages: {
    zombieNearLocation:
      "!help Zombies near {location}! Need backup immediately!",
    injuredSurvivor: "!help Injured survivor at {location}! Need medkit!",
    resourceShortage:
      "!help Running low on supplies at {location}! Need food and medicine!",
    zombieHorde:
      "!help Large zombie horde approaching {location}! Evacuate immediately!",
    trapSituation:
      "!help Trapped in {location}! Zombies surrounding the building!",
  },
};

export default enTranslations;
