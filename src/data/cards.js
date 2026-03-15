// ═══════════════════════════════════════════════════════════
// CHANCE & COMMUNITY CHEST CARDS
// ═══════════════════════════════════════════════════════════
export const CHANCE_CARDS = [
  { text:"Advance to GO. Collect ₹200.",                                   action:"goto",       value:0   },
  { text:"Advance to Mumbai. Collect ₹200 if you pass GO.",               action:"goto",       value:31  },
  { text:"Advance to Navi Mumbai. Collect ₹200 if you pass GO.",          action:"goto",       value:39  },
  { text:"Go directly to Jail. Do not pass GO.",                          action:"jail"                  },
  { text:"Bank pays you a dividend of ₹50.",                             action:"money",      value:50  },
  { text:"Get Out of Jail Free!",                                         action:"jailcard"              },
  { text:"Go back 3 spaces.",                                             action:"back",       value:3   },
  { text:"Pay poor tax of ₹15.",                                         action:"money",      value:-15 },
  { text:"Building loan matures. Collect ₹150.",                         action:"money",      value:150 },
  { text:"Pay school fees. ₹150.",                                       action:"money",      value:-150},
  { text:"Advance to nearest Railway Station.",                           action:"nearestRR"             },
  { text:"Advance to nearest Utility.",                                   action:"nearestUtil"           },
];

export const COMMUNITY_CARDS = [
  { text:"Advance to GO. Collect ₹200.",                                  action:"goto",    value:0    },
  { text:"Bank error in your favor. Collect ₹200.",                       action:"money",   value:200  },
  { text:"Doctor's fee. Pay ₹50.",                                        action:"money",   value:-50  },
  { text:"Sale of stock. Collect ₹50.",                                   action:"money",   value:50   },
  { text:"Get Out of Jail Free!",                                         action:"jailcard"             },
  { text:"Go to Jail!",                                                   action:"jail"                 },
  { text:"Holiday fund matures. Receive ₹100.",                          action:"money",   value:100  },
  { text:"Income tax refund. Collect ₹20.",                              action:"money",   value:20   },
  { text:"It's your birthday! Collect ₹10 from each player.",            action:"collect", value:10   },
  { text:"Life insurance matures. Collect ₹100.",                        action:"money",   value:100  },
  { text:"Pay hospital fees of ₹100.",                                   action:"money",   value:-100 },
  { text:"Street repairs! Pay ₹40/house, ₹115/hotel.",                  action:"repairs", house:40,  hotel:115 },
];
