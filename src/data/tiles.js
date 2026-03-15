// ═══════════════════════════════════════════════════════════
// BOARD TILES DATA
// ═══════════════════════════════════════════════════════════
export const TILES = [
  { id:0,  name:"GO",             type:"go"                                                                                          },
  { id:1,  name:"Rajkot",         type:"property", group:"brown",    price:60,  rent:[2,10,30,90,160,250],  houseCost:50,  mortgage:30  },
  { id:2,  name:"Community Chest",type:"community"                                                                                    },
  { id:3,  name:"Surat",          type:"property", group:"brown",    price:60,  rent:[4,20,60,180,320,450], houseCost:50,  mortgage:30  },
  { id:4,  name:"Income Tax",     type:"tax",      amount:200                                                                         },
  { id:5,  name:"Mumbai Central", type:"railroad", price:200,                                               mortgage:100              },
  { id:6,  name:"Ahmedabad",      type:"property", group:"lightblue",price:100, rent:[6,30,90,270,400,550], houseCost:50,  mortgage:50  },
  { id:7,  name:"Chance",         type:"chance"                                                                                       },
  { id:8,  name:"Vadodara",       type:"property", group:"lightblue",price:100, rent:[6,30,90,270,400,550], houseCost:50,  mortgage:50  },
  { id:9,  name:"Pune",           type:"property", group:"lightblue",price:120, rent:[8,40,100,300,450,600],houseCost:50,  mortgage:60  },
  { id:10, name:"Jail",           type:"jail"                                                                                         },
  { id:11, name:"Jaipur",         type:"property", group:"pink",     price:140, rent:[10,50,150,450,625,750],houseCost:100,mortgage:70  },
  { id:12, name:"Electric Co.",   type:"utility",  price:150,                                               mortgage:75               },
  { id:13, name:"Lucknow",        type:"property", group:"pink",     price:140, rent:[10,50,150,450,625,750],houseCost:100,mortgage:70  },
  { id:14, name:"Chandigarh",     type:"property", group:"pink",     price:160, rent:[12,60,180,500,700,900],houseCost:100,mortgage:80  },
  { id:15, name:"Howrah Stn.",    type:"railroad", price:200,                                               mortgage:100              },
  { id:16, name:"Indore",         type:"property", group:"orange",   price:180, rent:[14,70,200,550,750,950],houseCost:100,mortgage:90  },
  { id:17, name:"Community Chest",type:"community"                                                                                    },
  { id:18, name:"Nagpur",         type:"property", group:"orange",   price:180, rent:[14,70,200,550,750,950],houseCost:100,mortgage:90  },
  { id:19, name:"Bhopal",         type:"property", group:"orange",   price:200, rent:[16,80,220,600,800,1000],houseCost:100,mortgage:100},
  { id:20, name:"Free Parking",   type:"freeparking"                                                                                  },
  { id:21, name:"Chennai",        type:"property", group:"red",      price:220, rent:[18,90,250,700,875,1050],houseCost:150,mortgage:110},
  { id:22, name:"Chance",         type:"chance"                                                                                       },
  { id:23, name:"Hyderabad",      type:"property", group:"red",      price:220, rent:[18,90,250,700,875,1050],houseCost:150,mortgage:110},
  { id:24, name:"Bengaluru",      type:"property", group:"red",      price:240, rent:[20,100,300,750,925,1100],houseCost:150,mortgage:120},
  { id:25, name:"Chennai Central",type:"railroad", price:200,                                               mortgage:100              },
  { id:26, name:"Patna",          type:"property", group:"yellow",   price:260, rent:[22,110,330,800,975,1150],houseCost:150,mortgage:130},
  { id:27, name:"Bhubaneswar",    type:"property", group:"yellow",   price:260, rent:[22,110,330,800,975,1150],houseCost:150,mortgage:130},
  { id:28, name:"Water Works",    type:"utility",  price:150,                                               mortgage:75               },
  { id:29, name:"Kolkata",        type:"property", group:"yellow",   price:280, rent:[24,120,360,850,1025,1200],houseCost:150,mortgage:140},
  { id:30, name:"Go To Jail",     type:"gotojail"                                                                                     },
  { id:31, name:"Mumbai",         type:"property", group:"green",    price:300, rent:[26,130,390,900,1100,1275],houseCost:200,mortgage:150},
  { id:32, name:"Delhi",          type:"property", group:"green",    price:300, rent:[26,130,390,900,1100,1275],houseCost:200,mortgage:150},
  { id:33, name:"Community Chest",type:"community"                                                                                    },
  { id:34, name:"Noida",          type:"property", group:"green",    price:320, rent:[28,150,450,1000,1200,1400],houseCost:200,mortgage:160},
  { id:35, name:"New Delhi Stn.", type:"railroad", price:200,                                               mortgage:100              },
  { id:36, name:"Chance",         type:"chance"                                                                                       },
  { id:37, name:"Gurgaon",        type:"property", group:"darkblue", price:350, rent:[35,175,500,1100,1300,1500],houseCost:200,mortgage:175},
  { id:38, name:"Luxury Tax",     type:"tax",      amount:100                                                                         },
  { id:39, name:"Navi Mumbai",    type:"property", group:"darkblue", price:400, rent:[50,200,600,1400,1700,2000],houseCost:200,mortgage:200},
];

export const GROUP_COLORS = {
  brown:"#8B4513", lightblue:"#4FC3F7", pink:"#F06292",
  orange:"#FF8C00", red:"#E53935",      yellow:"#FDD835",
  green:"#43A047",  darkblue:"#1565C0",
};

export const GROUP_TEXT = {
  brown:"#fff", lightblue:"#003", pink:"#fff",
  orange:"#fff", red:"#fff",      yellow:"#333",
  green:"#fff",  darkblue:"#fff",
};

export const GRID_POS = [
  [11,11],[10,11],[9,11],[8,11],[7,11],[6,11],[5,11],[4,11],[3,11],[2,11],[1,11],
  [1,10],[1,9],[1,8],[1,7],[1,6],[1,5],[1,4],[1,3],[1,2],
  [1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],
  [11,2],[11,3],[11,4],[11,5],[11,6],[11,7],[11,8],[11,9],[11,10],
];

export const PLAYER_COLORS = ["#E53935","#1976D2","#388E3C","#F57C00"];
export const PLAYER_NAMES_DEF = ["Player 1","Player 2","Player 3","Player 4"];

export const CORNER_ICONS  = { go:"🚀", jail:"⛓️", freeparking:"🅿️", gotojail:"👮" };
export const SPECIAL_ICONS = { tax:"💸", chance:"❓", community:"📦", railroad:"🚂", utility:"⚡" };
