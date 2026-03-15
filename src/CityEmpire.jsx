import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// GAME DATA
// ═══════════════════════════════════════════════════════════════
const TILES = [
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
  { id:19, name:"Bhopal",         type:"property", group:"orange",   price:200, rent:[16,80,220,600,800,1000],houseCost:100,mortgage:100 },
  { id:20, name:"Free Parking",   type:"freeparking"                                                                                  },
  { id:21, name:"Chennai",        type:"property", group:"red",      price:220, rent:[18,90,250,700,875,1050],houseCost:150,mortgage:110 },
  { id:22, name:"Chance",         type:"chance"                                                                                       },
  { id:23, name:"Hyderabad",      type:"property", group:"red",      price:220, rent:[18,90,250,700,875,1050],houseCost:150,mortgage:110 },
  { id:24, name:"Bengaluru",      type:"property", group:"red",      price:240, rent:[20,100,300,750,925,1100],houseCost:150,mortgage:120 },
  { id:25, name:"Chennai Central",type:"railroad", price:200,                                               mortgage:100              },
  { id:26, name:"Patna",          type:"property", group:"yellow",   price:260, rent:[22,110,330,800,975,1150],houseCost:150,mortgage:130 },
  { id:27, name:"Bhubaneswar",    type:"property", group:"yellow",   price:260, rent:[22,110,330,800,975,1150],houseCost:150,mortgage:130 },
  { id:28, name:"Water Works",    type:"utility",  price:150,                                               mortgage:75               },
  { id:29, name:"Kolkata",        type:"property", group:"yellow",   price:280, rent:[24,120,360,850,1025,1200],houseCost:150,mortgage:140 },
  { id:30, name:"Go To Jail",     type:"gotojail"                                                                                     },
  { id:31, name:"Mumbai",         type:"property", group:"green",    price:300, rent:[26,130,390,900,1100,1275],houseCost:200,mortgage:150 },
  { id:32, name:"Delhi",          type:"property", group:"green",    price:300, rent:[26,130,390,900,1100,1275],houseCost:200,mortgage:150 },
  { id:33, name:"Community Chest",type:"community"                                                                                    },
  { id:34, name:"Noida",          type:"property", group:"green",    price:320, rent:[28,150,450,1000,1200,1400],houseCost:200,mortgage:160 },
  { id:35, name:"New Delhi Stn.", type:"railroad", price:200,                                               mortgage:100              },
  { id:36, name:"Chance",         type:"chance"                                                                                       },
  { id:37, name:"Gurgaon",        type:"property", group:"darkblue", price:350, rent:[35,175,500,1100,1300,1500],houseCost:200,mortgage:175 },
  { id:38, name:"Luxury Tax",     type:"tax",      amount:100                                                                         },
  { id:39, name:"Navi Mumbai",    type:"property", group:"darkblue", price:400, rent:[50,200,600,1400,1700,2000],houseCost:200,mortgage:200 },
];

const GROUP_COLORS = {
  brown:"#8B4513", lightblue:"#4FC3F7", pink:"#F06292",
  orange:"#FF8C00", red:"#E53935",      yellow:"#FDD835",
  green:"#43A047",  darkblue:"#1565C0"
};
const GROUP_TEXT = {
  brown:"#fff", lightblue:"#003", pink:"#fff",
  orange:"#fff", red:"#fff",      yellow:"#333",
  green:"#fff",  darkblue:"#fff"
};

const GRID_POS = [
  [11,11],[10,11],[9,11],[8,11],[7,11],[6,11],[5,11],[4,11],[3,11],[2,11],[1,11],
  [1,10],[1,9],[1,8],[1,7],[1,6],[1,5],[1,4],[1,3],[1,2],
  [1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],
  [11,2],[11,3],[11,4],[11,5],[11,6],[11,7],[11,8],[11,9],[11,10]
];
const getBandSide = (id) => {
  if(id>=1  && id<=9)  return 0;
  if(id>=11 && id<=19) return 3;
  if(id>=21 && id<=29) return 2;
  if(id>=31 && id<=39) return 1;
  return -1;
};

const PLAYER_COLORS = ["#E53935","#1976D2","#388E3C","#F57C00"];
const PLAYER_NAMES_DEF = ["Player 1","Player 2","Player 3","Player 4"];

const CHANCE_CARDS = [
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
const COMMUNITY_CARDS = [
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
  { text:"Street repairs! Pay ₹40/house, ₹115/hotel.",                  action:"repairs", house:40, hotel:115 },
];

// ═══════════════════════════════════════════════════════════════
// PURE HELPERS
// ═══════════════════════════════════════════════════════════════
const rnd  = (n) => Math.ceil(Math.random() * n);
const shuf = (a) => [...a].sort(() => Math.random() - 0.5);

const calcNetWorth = (G, pid) => {
  const p = G.players[pid];
  let w = p.money;
  TILES.forEach(t => {
    if(G.owned[t.id] === pid) {
      w += t.mortgage || Math.floor((t.price||0)/2); // mortgage = printed mortgage value
      if(!G.mortgaged[t.id] && t.price) w += t.mortgage || 0; // add other half if not mortgaged
    }
  });
  Object.entries(G.houses||{}).forEach(([tid,h]) => {
    if(G.owned[tid]===pid && h>0) {
      w += h * (TILES[tid].houseCost||0);
    }
  });
  return w;
};

// Can build a house on this tile?
const canBuildHouse = (G, tid, pid) => {
  const t = TILES[tid];
  if(!t.group || t.type!=="property") return false;
  const grp = TILES.filter(x=>x.group===t.group && x.type==="property");
  if(!grp.every(x => G.owned[x.id]===pid && !G.mortgaged[x.id])) return false;
  const h = G.houses[tid]||0;
  if(h>=5) return false;
  const minH = Math.min(...grp.map(x=>G.houses[x.id]||0));
  if(h > minH) return false; // must build on minimum first (even building)
  return G.players[pid].money >= t.houseCost;
};

// Can sell a house from this tile?
const canSellHouse = (G, tid, pid) => {
  const t = TILES[tid];
  if(!t.group || t.type!=="property") return false;
  if(G.owned[tid]!==pid) return false;
  const h = G.houses[tid]||0;
  if(h<=0) return false;
  // Even selling: can only sell from property with max houses in group
  const grp = TILES.filter(x=>x.group===t.group && x.type==="property");
  const maxH = Math.max(...grp.map(x=>G.houses[x.id]||0));
  return h === maxH;
};

// Can mortgage this tile?
const canMortgage = (G, tid, pid) => {
  if(G.owned[tid]!==pid) return false;
  if(G.mortgaged[tid]) return false;
  const t = TILES[tid];
  if(!t.mortgage) return false;
  // No houses on any property in color group
  if(t.group) {
    const grp = TILES.filter(x=>x.group===t.group && x.type==="property");
    if(grp.some(x=>(G.houses[x.id]||0)>0)) return false;
  }
  return true;
};

// Can unmortgage this tile?
const canUnmortgage = (G, tid, pid) => {
  if(G.owned[tid]!==pid) return false;
  if(!G.mortgaged[tid]) return false;
  const t = TILES[tid];
  const cost = Math.floor((t.mortgage||0)*1.1);
  return G.players[pid].money >= cost;
};

const getRent = (G, tid, diceSum) => {
  const t = TILES[tid];
  if(G.mortgaged[tid]) return 0; // no rent on mortgaged
  if(t.type==="railroad"){
    const n = TILES.filter(x=>x.type==="railroad" && G.owned[x.id]===G.owned[tid]).length;
    return [25,50,100,200][Math.min(n-1,3)];
  }
  if(t.type==="utility"){
    const n = TILES.filter(x=>x.type==="utility" && G.owned[x.id]===G.owned[tid]).length;
    return diceSum*(n===2?10:4);
  }
  const h = G.houses[tid]||0;
  let r = t.rent[h];
  if(h===0){
    const grp = TILES.filter(x=>x.group===t.group && x.type==="property");
    if(grp.every(x=>G.owned[x.id]===G.owned[tid] && !G.mortgaged[x.id])) r*=2;
  }
  return r;
};

const initGame = (n, names, aiFlags=[]) => ({
  players: Array.from({length:n}, (_,i) => ({
    id:i, name:names[i]||PLAYER_NAMES_DEF[i], color:PLAYER_COLORS[i],
    pos:0, money:1500, inJail:false, jailTurns:0, jailFreeCards:0, bankrupt:false,
    isAI: aiFlags[i]||false,
  })),
  owned:{}, houses:{}, mortgaged:{},
  turn:0, phase:"roll", dice:null, doublesCount:0,
  log:["🏙️ City Empire started! Player 1 goes first."],
  chanceDeck:shuf([...Array(CHANCE_CARDS.length).keys()]),
  communityDeck:shuf([...Array(COMMUNITY_CARDS.length).keys()]),
  chanceIdx:0, commIdx:0,
  activeCard:null, pendingBuy:null,
  auction:null,    // { tileId, order:[pids], idx, topBid, topBidder, passCount }
  taxChoice:null,  // { pid, netWorth }
  winner:null,
});

const checkWinner = (G) => {
  const alive = G.players.filter(p=>!p.bankrupt);
  return alive.length===1 && G.players.length>1 ? alive[0] : null;
};

// Liquidate a bankrupt player's assets
const liquidate = (G, pid, creditorPid) => {
  let nG = {...G};
  // Sell all houses at half price (to bank)
  let refund = 0;
  const nh = {...nG.houses};
  Object.entries(nh).forEach(([tid,h])=>{
    if(nG.owned[tid]===pid && h>0){
      refund += h * Math.floor((TILES[tid].houseCost||0)/2);
      nh[tid]=0;
    }
  });
  nG.houses = nh;
  // Transfer cash to creditor
  const np = [...nG.players];
  const totalCash = np[pid].money + refund;
  if(creditorPid!==null && creditorPid!==undefined){
    np[creditorPid] = {...np[creditorPid], money:np[creditorPid].money+totalCash};
    // Transfer all properties to creditor
    const no = {...nG.owned};
    Object.keys(no).forEach(k=>{ if(no[k]===pid) no[k]=creditorPid; });
    nG.owned = no;
  } else {
    // Bankrupt to bank: auction handled separately (simplify: just remove properties)
    const no = {...nG.owned};
    const nm = {...nG.mortgaged};
    Object.keys(no).forEach(k=>{ if(no[k]===pid){delete no[k]; delete nm[k];} });
    nG.owned=no; nG.mortgaged=nm;
  }
  np[pid]={...np[pid], money:0, bankrupt:true};
  nG.players=np;
  return nG;
};

const moveTo = (G, pid, newPos, collectGo=true) => {
  const p = G.players[pid];
  let addMoney=0; let logs=[];
  if(collectGo && newPos < p.pos && p.pos!==30){
    addMoney=200; logs.push(`✈️ ${p.name} passed GO! +₹200`);
  }
  const np = G.players.map((x,i)=>i===pid?{...x,pos:newPos,money:x.money+addMoney}:x);
  return {...G,players:np,log:[...G.log,...logs]};
};

const startAuction = (G, tileId) => {
  const order = G.players
    .filter(p=>!p.bankrupt)
    .map(p=>p.id);
  // Start from player after current turn
  const rotated = [...order.slice(G.turn+1), ...order.slice(0,G.turn+1)]
    .filter(id=>!G.players[id].bankrupt);
  return {
    ...G,
    phase:"auction",
    auction:{ tileId, order:rotated, idx:0, topBid:0, topBidder:null, passCount:0 },
    log:[...G.log,`🔨 ${TILES[tileId].name} goes to AUCTION! Starting bid: ₹0`],
  };
};

const processLanding = (G, pid, tid) => {
  const t=TILES[tid], p=G.players[pid];
  if(t.type==="go")        return {...G,phase:"endturn",log:[...G.log,`✅ ${p.name} landed on GO! +₹200`]};
  if(t.type==="jail")      return {...G,phase:"endturn",log:[...G.log,`👀 ${p.name} just visiting Jail.`]};
  if(t.type==="freeparking")return {...G,phase:"endturn",log:[...G.log,`🅿️ ${p.name} on Free Parking. No reward.`]};

  if(t.type==="gotojail"){
    const np=G.players.map((x,i)=>i===pid?{...x,inJail:true,jailTurns:0,pos:10}:x);
    return {...G,players:np,phase:"endturn",log:[...G.log,`🚔 ${p.name} sent to Jail!`]};
  }

  if(t.type==="tax"){
    // Income tax: offer choice
    if(tid===4){
      const nw = calcNetWorth(G,pid);
      return {...G,phase:"incometax",taxChoice:{pid,netWorth:nw},
        log:[...G.log,`💸 ${p.name} landed on Income Tax. Choose payment option.`]};
    }
    // Luxury tax: flat
    const amt=Math.min(t.amount,p.money);
    const np=G.players.map((x,i)=>i!==pid?x:{...x,money:x.money-amt,bankrupt:x.money-amt<=0});
    let logs=[`💸 ${p.name} paid ₹${amt} ${t.name}.`];
    if(np[pid].bankrupt){
      logs.push(`💥 ${p.name} went bankrupt!`);
      const nG=liquidate({...G,players:np,log:[...G.log,...logs]},pid,null);
      const w=checkWinner(nG); return w?{...nG,phase:"gameover",winner:w}:{...nG,phase:"endturn"};
    }
    return {...G,players:np,log:[...G.log,...logs],phase:"endturn"};
  }

  if(t.type==="chance"){
    const ci=G.chanceDeck[G.chanceIdx%G.chanceDeck.length];
    const card=CHANCE_CARDS[ci];
    return {...G,phase:"card",activeCard:{type:"chance",card,pid},chanceIdx:G.chanceIdx+1,
      log:[...G.log,`🃏 ${p.name}: "${card.text}"`]};
  }
  if(t.type==="community"){
    const ci=G.communityDeck[G.commIdx%G.communityDeck.length];
    const card=COMMUNITY_CARDS[ci];
    return {...G,phase:"card",activeCard:{type:"community",card,pid},commIdx:G.commIdx+1,
      log:[...G.log,`📦 ${p.name}: "${card.text}"`]};
  }

  if(t.type==="property"||t.type==="railroad"||t.type==="utility"){
    const oid=G.owned[tid];
    if(oid===undefined){
      if(p.money>=t.price)
        return {...G,phase:"buy",pendingBuy:tid,
          log:[...G.log,`🏙️ ${p.name} on ${t.name} (₹${t.price}). Buy or Auction?`]};
      // Can't afford: goes to auction
      return startAuction(G,tid);
    }
    if(oid===pid) return {...G,phase:"endturn",log:[...G.log,`🏠 ${p.name} owns ${t.name}.`]};
    if(G.mortgaged[tid]) return {...G,phase:"endturn",log:[...G.log,`🔒 ${TILES[tid].name} is mortgaged — no rent.`]};
    const rent=getRent(G,tid,G.dice?G.dice[0]+G.dice[1]:7);
    const paid=Math.min(rent,p.money);
    let np=G.players.map((x,i)=>{
      if(i===pid) return {...x,money:x.money-paid,bankrupt:x.money-paid<=0};
      if(i===oid) return {...x,money:x.money+paid};
      return x;
    });
    let logs=[`💰 ${p.name} paid ₹${paid} rent to ${G.players[oid].name}.`];
    if(np[pid].bankrupt){
      logs.push(`💥 ${p.name} bankrupt! Assets → ${G.players[oid].name}.`);
      const nG=liquidate({...G,players:np,log:[...G.log,...logs]},pid,oid);
      const w=checkWinner(nG); return w?{...nG,phase:"gameover",winner:w}:{...nG,phase:"endturn"};
    }
    return {...G,players:np,log:[...G.log,...logs],phase:"endturn"};
  }
  return {...G,phase:"endturn"};
};

const processCard = (G) => {
  const {activeCard}=G; if(!activeCard) return {...G,phase:"endturn"};
  const {card,pid}=activeCard; const p=G.players[pid];
  let nG={...G,activeCard:null};
  if(card.action==="goto"){
    nG=moveTo(nG,pid,card.value,card.value<=p.pos);
    return processLanding(nG,pid,card.value);
  }
  if(card.action==="money"){
    const v=card.value;
    const np=nG.players.map((x,i)=>i!==pid?x:{...x,money:x.money+v,bankrupt:x.money+v<=0});
    nG={...nG,players:np,log:[...nG.log,v>0?`💵 ${p.name} +₹${v}.`:`💸 ${p.name} -₹${-v}.`]};
    if(np[pid].bankrupt){
      const lg={...nG,log:[...nG.log,`💥 ${p.name} bankrupt!`]};
      const liq=liquidate(lg,pid,null); const w=checkWinner(liq);
      return w?{...liq,phase:"gameover",winner:w}:{...liq,phase:"endturn"};
    }
    return {...nG,phase:"endturn"};
  }
  if(card.action==="jail"){
    const np=nG.players.map((x,i)=>i===pid?{...x,inJail:true,jailTurns:0,pos:10}:x);
    return {...nG,players:np,phase:"endturn",log:[...nG.log,`🚔 ${p.name} sent to Jail!`]};
  }
  if(card.action==="jailcard"){
    const np=nG.players.map((x,i)=>i===pid?{...x,jailFreeCards:x.jailFreeCards+1}:x);
    return {...nG,players:np,phase:"endturn",log:[...nG.log,`🎫 ${p.name} got Jail-Free card!`]};
  }
  if(card.action==="back"){
    const np2=(p.pos-(card.value||3)+40)%40;
    nG=moveTo(nG,pid,np2,false);
    return processLanding(nG,pid,np2);
  }
  if(card.action==="collect"){
    const amt=card.value;
    const others=nG.players.filter((_,i)=>i!==pid&&!nG.players[i].bankrupt);
    let total=0;
    const np=[...nG.players.map(x=>({...x}))];
    others.forEach(o=>{const paid=Math.min(amt,np[o.id].money);np[o.id].money-=paid;total+=paid;});
    np[pid].money+=total;
    return {...nG,players:np,phase:"endturn",log:[...nG.log,`🎂 ${p.name} collected ₹${total}.`]};
  }
  if(card.action==="repairs"){
    const hc=Object.entries(nG.houses||{}).filter(([k,v])=>nG.owned[k]===pid&&v<5).reduce((s,[,v])=>s+v,0);
    const htc=Object.entries(nG.houses||{}).filter(([k,v])=>nG.owned[k]===pid&&v===5).length;
    const fee=hc*(card.house||40)+htc*(card.hotel||115);
    const np=nG.players.map((x,i)=>i!==pid?x:{...x,money:x.money-Math.min(fee,x.money),bankrupt:x.money-fee<=0});
    return {...nG,players:np,phase:"endturn",log:[...nG.log,`🔧 ${p.name} paid ₹${Math.min(fee,p.money)} repairs.`]};
  }
  if(card.action==="nearestRR"){
    const rrs=[5,15,25,35];
    const nearest=rrs.reduce((a,b)=>((b-p.pos+40)%40)<((a-p.pos+40)%40)?b:a);
    nG=moveTo(nG,pid,nearest,nearest<p.pos);
    return processLanding(nG,pid,nearest);
  }
  if(card.action==="nearestUtil"){
    const utils=[12,28];
    const nearest=utils.reduce((a,b)=>((b-p.pos+40)%40)<((a-p.pos+40)%40)?b:a);
    nG=moveTo(nG,pid,nearest,nearest<p.pos);
    return processLanding(nG,pid,nearest);
  }
  return {...nG,phase:"endturn"};
};

// ═══════════════════════════════════════════════════════════════
// BOARD COMPONENTS
// ═══════════════════════════════════════════════════════════════
const CORNER_ICONS = { go:"🚀", jail:"⛓️", freeparking:"🅿️", gotojail:"👮" };
const SPECIAL_ICONS = { tax:"💸", chance:"❓", community:"📦", railroad:"🚂", utility:"⚡" };

function BoardTile({ tile, G, isActive }) {
  const [col,row] = GRID_POS[tile.id];
  const isCorner = [0,10,20,30].includes(tile.id);
  const bandSide = getBandSide(tile.id);
  const bandColor = tile.group ? GROUP_COLORS[tile.group] : null;
  const playersHere = G.players.filter(p=>!p.bankrupt && p.pos===tile.id);
  const ownerId = G.owned[tile.id];
  const houses = G.houses[tile.id]||0;
  const isMortgaged = G.mortgaged[tile.id];

  const bandStyle={};
  if(bandColor){
    const sides=["borderTop","borderRight","borderBottom","borderLeft"];
    if(bandSide>=0) bandStyle[sides[bandSide]]=`7px solid ${bandColor}`;
  }

  return (
    <div style={{
      gridColumn:col,gridRow:row,
      background:isActive?"#FFFDE7":isMortgaged?"#f5e6e6":isCorner?"#F0F4F8":"white",
      border:"1px solid #9E9E9E",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      position:"relative",overflow:"hidden",boxSizing:"border-box",
      ...bandStyle,
      outline:isActive?"2px solid #FFC107":"none",
    }}>
      {isCorner && <div style={{fontSize:20}}>{CORNER_ICONS[tile.type]||""}</div>}
      {!isCorner && SPECIAL_ICONS[tile.type] && <div style={{fontSize:11}}>{SPECIAL_ICONS[tile.type]}</div>}
      <div style={{
        fontSize:tile.name.length>9?5.5:tile.name.length>6?6.5:7.5,
        fontWeight:"700",textAlign:"center",lineHeight:1.1,
        color:isMortgaged?"#999":"#1a1a1a",padding:"0 2px",fontFamily:"'Georgia',serif",
        maxWidth:"100%",textDecoration:isMortgaged?"line-through":"none",
      }}>
        {isCorner?tile.name.toUpperCase():tile.name}
      </div>
      {tile.price&&!isCorner&&<div style={{fontSize:6,color:"#555",fontWeight:600}}>₹{tile.price}</div>}
      {tile.amount&&!isCorner&&<div style={{fontSize:6,color:"#C62828",fontWeight:600}}>₹{tile.amount}</div>}
      {ownerId!==undefined&&(
        <div style={{position:"absolute",top:2,right:2,width:6,height:6,borderRadius:"50%",
          background:G.players[ownerId]?.color||"gray",border:"1px solid white",
          opacity:isMortgaged?0.4:1}}/>
      )}
      {houses>0&&<div style={{position:"absolute",bottom:2,left:2,fontSize:7}}>
        {houses===5?"🏨":"🏠".repeat(houses)}
      </div>}
      {playersHere.length>0&&(
        <div style={{position:"absolute",bottom:isCorner?8:3,display:"flex",gap:2,zIndex:5,flexWrap:"wrap",justifyContent:"center"}}>
          {playersHere.map(p=>(
            <div key={p.id} style={{width:10,height:10,borderRadius:"50%",background:p.color,
              border:"1.5px solid white",boxShadow:"0 1px 3px rgba(0,0,0,0.5)"}}/>
          ))}
        </div>
      )}
    </div>
  );
}

function Board({ G, highlightTile }) {
  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:"80px repeat(9,50px) 80px",
      gridTemplateRows:"80px repeat(9,50px) 80px",
      width:610,height:610,flexShrink:0,
      border:"3px solid #2E7D32",background:"#2E7D32",
      boxShadow:"0 8px 40px rgba(0,0,0,0.6)",borderRadius:4,
    }}>
      <div style={{gridColumn:"2/11",gridRow:"2/11",
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        background:"linear-gradient(135deg,#1B5E20,#2E7D32,#1B5E20)",userSelect:"none"}}>
        <div style={{fontSize:40,marginBottom:4}}>🏙️</div>
        <div style={{fontSize:24,fontWeight:900,color:"#FDD835",letterSpacing:4,
          fontFamily:"'Georgia',serif",textShadow:"2px 2px 8px rgba(0,0,0,0.7)"}}>CITY</div>
        <div style={{fontSize:24,fontWeight:900,color:"#FDD835",letterSpacing:4,
          fontFamily:"'Georgia',serif",textShadow:"2px 2px 8px rgba(0,0,0,0.7)"}}>EMPIRE</div>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",letterSpacing:2,marginTop:4}}>INDIA EDITION</div>
        <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center",maxWidth:220}}>
          {Object.entries(GROUP_COLORS).map(([g,c])=>(
            <div key={g} style={{width:16,height:16,borderRadius:3,background:c,
              border:"1px solid rgba(255,255,255,0.3)"}}/>
          ))}
        </div>
      </div>
      {TILES.map(tile=><BoardTile key={tile.id} tile={tile} G={G} isActive={highlightTile===tile.id}/>)}
    </div>
  );
}

function Dice({ values, rolling }) {
  const faces = ["","⚀","⚁","⚂","⚃","⚄","⚅"];
  return (
    <div style={{display:"flex",gap:12,justifyContent:"center",alignItems:"center"}}>
      {[0,1].map(i=>(
        <div key={i} style={{
          width:50,height:50,borderRadius:10,background:"white",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,
          boxShadow:"0 4px 12px rgba(0,0,0,0.3)",
          transform:rolling?"rotate(720deg)":"none",
          transition:rolling?"transform 0.5s ease":"none",
          border:"2px solid #E0E0E0",
        }}>
          {values?faces[values[i]]:"🎲"}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AUCTION PANEL
// ═══════════════════════════════════════════════════════════════
function AuctionPanel({ G, onBid, onPass }) {
  const [bidInput, setBidInput] = useState("");
  const { auction } = G;
  if(!auction) return null;
  const t = TILES[auction.tileId];
  const currBidder = G.players[auction.order[auction.idx]];
  const minBid = auction.topBid + 10;

  return (
    <div style={{
      background:"linear-gradient(135deg,#B8860B22,#DAA52022)",
      border:"2px solid #DAA520",borderRadius:16,padding:16,
    }}>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:22,marginBottom:4}}>🔨</div>
        <div style={{fontWeight:900,fontSize:16,color:"#FDD835"}}>AUCTION</div>
        <div style={{fontWeight:700,fontSize:14,marginTop:2}}>{t.name}</div>
        {t.group&&<span style={{padding:"2px 8px",borderRadius:6,fontSize:10,fontWeight:700,
          background:GROUP_COLORS[t.group],color:GROUP_TEXT[t.group]}}>{t.group.toUpperCase()}</span>}
        <div style={{marginTop:8,fontSize:13}}>
          {auction.topBidder!==null
            ? <span>Top Bid: <span style={{color:"#FDD835",fontWeight:700}}>₹{auction.topBid}</span> by <span style={{color:G.players[auction.topBidder].color,fontWeight:700}}>{G.players[auction.topBidder].name}</span></span>
            : <span style={{opacity:0.6}}>No bids yet</span>
          }
        </div>
      </div>
      <div style={{
        display:"flex",alignItems:"center",gap:6,marginBottom:12,
        padding:"8px 10px",borderRadius:10,background:"rgba(255,255,255,0.06)",
      }}>
        <div style={{width:10,height:10,borderRadius:"50%",background:currBidder.color}}/>
        <span style={{fontWeight:700,fontSize:13}}>{currBidder.name}'s bid</span>
        <span style={{fontSize:11,opacity:0.5,marginLeft:"auto"}}>₹{currBidder.money} available</span>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <input
          type="number" value={bidInput}
          onChange={e=>setBidInput(e.target.value)}
          placeholder={`Min ₹${minBid}`}
          style={{flex:1,padding:"9px 12px",borderRadius:10,
            border:"1.5px solid rgba(255,255,255,0.2)",
            background:"rgba(255,255,255,0.08)",color:"white",fontSize:14,
            fontFamily:"'Georgia',serif",boxSizing:"border-box",outline:"none"}}
        />
        <button onClick={()=>{
          const b=parseInt(bidInput)||0;
          if(b>=minBid && b<=currBidder.money){onBid(b);setBidInput("");}
        }} style={{
          padding:"9px 16px",borderRadius:10,
          background:"linear-gradient(135deg,#43A047,#1B5E20)",
          color:"white",border:"none",fontWeight:700,cursor:"pointer",fontSize:13,
        }}>Bid</button>
      </div>
      <button onClick={()=>onPass()} style={{
        width:"100%",padding:9,borderRadius:10,
        background:"rgba(255,255,255,0.07)",
        color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.15)",
        fontSize:13,cursor:"pointer",fontWeight:600,
      }}>Pass (Skip)</button>
      {auction.order.length>1&&(
        <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center"}}>
          {auction.order.map((pid,i)=>(
            <div key={pid} style={{
              fontSize:9,padding:"2px 6px",borderRadius:5,
              background:i===auction.idx?"rgba(253,216,53,0.2)":"rgba(255,255,255,0.05)",
              border:i===auction.idx?"1px solid #FDD835":"1px solid rgba(255,255,255,0.1)",
              color:i===auction.idx?"#FDD835":"rgba(255,255,255,0.4)",
            }}>{G.players[pid].name}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INCOME TAX PANEL
// ═══════════════════════════════════════════════════════════════
function TaxChoicePanel({ G, onFlat, onPercent }) {
  const { taxChoice } = G;
  if(!taxChoice) return null;
  const p = G.players[taxChoice.pid];
  const tenPercent = Math.floor(taxChoice.netWorth * 0.1);
  return (
    <div style={{
      background:"rgba(198,40,40,0.15)",border:"2px solid #E53935",
      borderRadius:16,padding:16,textAlign:"center",
    }}>
      <div style={{fontSize:24,marginBottom:8}}>💸</div>
      <div style={{fontWeight:900,color:"#E57373",fontSize:15,marginBottom:4}}>INCOME TAX</div>
      <div style={{fontSize:12,opacity:0.7,marginBottom:12}}>
        {p.name}, choose your payment option.<br/>
        Net Worth: <span style={{color:"#FDD835",fontWeight:700}}>₹{taxChoice.netWorth.toLocaleString()}</span>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onFlat} style={{
          flex:1,padding:12,borderRadius:10,
          background:"linear-gradient(135deg,#E53935,#B71C1C)",
          color:"white",border:"none",fontWeight:700,cursor:"pointer",fontSize:13,
        }}>
          Pay Flat<br/>
          <span style={{fontSize:18,fontWeight:900}}>₹200</span>
        </button>
        <button onClick={onPercent} style={{
          flex:1,padding:12,borderRadius:10,
          background:`linear-gradient(135deg,${tenPercent>200?"#E53935":"#43A047"},${tenPercent>200?"#B71C1C":"#1B5E20"})`,
          color:"white",border:"none",fontWeight:700,cursor:"pointer",fontSize:13,
        }}>
          Pay 10%<br/>
          <span style={{fontSize:18,fontWeight:900}}>₹{tenPercent}</span>
        </button>
      </div>
      <div style={{marginTop:8,fontSize:10,opacity:0.5}}>
        {tenPercent<200?"💡 10% is cheaper for you!":"💡 Flat ₹200 is cheaper!"}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROPERTY MANAGER (Mortgage / Sell Houses)
// ═══════════════════════════════════════════════════════════════
function PropertyManager({ G, onMortgage, onUnmortgage, onBuildHouse, onSellHouse }) {
  const pid = G.turn;
  const owned = TILES.filter(t=>G.owned[t.id]===pid);
  if(owned.length===0) return (
    <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:12,
      border:"1px solid rgba(255,255,255,0.07)"}}>
      <div style={{fontSize:10,letterSpacing:2,opacity:0.5,marginBottom:6,fontWeight:700}}>MY PROPERTIES</div>
      <div style={{fontSize:11,opacity:0.35}}>No properties owned.</div>
    </div>
  );

  // Group by color
  const groups = {};
  owned.forEach(t=>{
    const key = t.group||t.type;
    if(!groups[key]) groups[key]=[];
    groups[key].push(t);
  });

  return (
    <div style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:12,
      border:"1px solid rgba(255,255,255,0.07)"}}>
      <div style={{fontSize:10,letterSpacing:2,opacity:0.5,marginBottom:10,fontWeight:700}}>
        MY PROPERTIES & MANAGEMENT
      </div>
      {Object.entries(groups).map(([grp, tiles])=>(
        <div key={grp} style={{marginBottom:10}}>
          {tiles.map(t=>{
            const h = G.houses[t.id]||0;
            const mortgaged = G.mortgaged[t.id];
            const canBuild = canBuildHouse(G,t.id,pid);
            const canSell = canSellHouse(G,t.id,pid);
            const canMort = canMortgage(G,t.id,pid);
            const canUnmort = canUnmortgage(G,t.id,pid);
            const unmortgageCost = Math.floor((t.mortgage||0)*1.1);
            return (
              <div key={t.id} style={{
                display:"flex",alignItems:"center",gap:6,marginBottom:6,
                padding:"6px 8px",borderRadius:8,
                background:mortgaged?"rgba(198,40,40,0.1)":"rgba(255,255,255,0.04)",
                border:`1px solid ${t.group?GROUP_COLORS[t.group]+"44":"rgba(255,255,255,0.08)"}`,
              }}>
                {t.group&&<div style={{width:8,height:20,borderRadius:2,
                  background:GROUP_COLORS[t.group],flexShrink:0}}/>}
                {!t.group&&<span style={{fontSize:12}}>{t.type==="railroad"?"🚂":"⚡"}</span>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:10,fontWeight:700,
                    textDecoration:mortgaged?"line-through":"none",
                    opacity:mortgaged?0.5:1,lineHeight:1.2}}>
                    {t.name}
                    {h>0&&<span style={{marginLeft:4,fontSize:9}}>{h===5?"🏨":"🏠".repeat(h)}</span>}
                  </div>
                  {mortgaged&&<div style={{fontSize:8,color:"#E57373"}}>Mortgaged — unmortgage: ₹{unmortgageCost}</div>}
                  {!mortgaged&&t.mortgage&&<div style={{fontSize:8,opacity:0.4}}>Mortgage: ₹{t.mortgage}</div>}
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  {canBuild&&<button onClick={()=>onBuildHouse(t.id)} title={`Build (₹${t.houseCost})`} style={{
                    padding:"3px 7px",borderRadius:6,background:"#388E3C",border:"none",
                    color:"white",fontSize:10,cursor:"pointer",fontWeight:700,
                  }}>+🏠 ₹{t.houseCost}</button>}
                  {canSell&&<button onClick={()=>onSellHouse(t.id)} title={`Sell (₹${Math.floor(t.houseCost/2)})`} style={{
                    padding:"3px 7px",borderRadius:6,background:"#F57C00",border:"none",
                    color:"white",fontSize:10,cursor:"pointer",fontWeight:700,
                  }}>-🏠 ₹{Math.floor(t.houseCost/2)}</button>}
                  {canMort&&<button onClick={()=>onMortgage(t.id)} style={{
                    padding:"3px 7px",borderRadius:6,background:"#616161",border:"none",
                    color:"white",fontSize:10,cursor:"pointer",fontWeight:700,
                  }}>Mort ₹{t.mortgage}</button>}
                  {canUnmort&&<button onClick={()=>onUnmortgage(t.id)} style={{
                    padding:"3px 7px",borderRadius:6,background:"#1565C0",border:"none",
                    color:"white",fontSize:10,cursor:"pointer",fontWeight:700,
                  }}>Lift ₹{unmortgageCost}</button>}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN GAME COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CityEmpire() {
  const [screen, setScreen]   = useState("setup");
  const [numPlayers, setNum]  = useState(2);
  const [names, setNames]     = useState(["Player 1","Player 2","Player 3","Player 4"]);
  const [aiFlags, setAiFlags] = useState([false, true, true, true]);
  const [G, setG]             = useState(null);
  const [rolling, setRolling] = useState(false);
  const logRef = useRef(null);

  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight; },[G?.log?.length]);

  // ── AI AUTO-PLAY ──────────────────────────────────
  useEffect(()=>{
    if(!G||G.phase==="gameover") return;

    // Auction: check if current auction bidder is AI
    if(G.phase==="auction" && G.auction){
      const bidderPid = G.auction.order[G.auction.idx];
      if(bidderPid!==undefined && G.players[bidderPid]?.isAI){
        const t = setTimeout(()=>{
          const auction = G.auction;
          const bidder = G.players[bidderPid];
          const tile = TILES[auction.tileId];
          const maxWilling = Math.min((tile.price||200)*0.85, bidder.money*0.45);
          const minBid = auction.topBid + 10;
          if(minBid <= maxWilling && minBid <= bidder.money){
            // Bid at min to keep it moving
            const bidAmt = Math.min(minBid + Math.floor(Math.random()*20), Math.floor(maxWilling));
            if(bidAmt >= minBid) handleAuctionBid(bidAmt);
            else handleAuctionPass();
          } else {
            handleAuctionPass();
          }
        }, 900);
        return ()=>clearTimeout(t);
      }
      return;
    }

    const cp = G.players[G.turn];
    if(!cp||!cp.isAI||cp.bankrupt) return;

    const t = setTimeout(()=>{
      if(G.phase==="roll"){
        if(cp.inJail){
          if(cp.jailFreeCards>0) handleJailCard();
          else if(cp.money>=50 && cp.jailTurns<2) handleJailPay();
          else handleRoll();
        } else {
          handleRoll();
        }
      } else if(G.phase==="buy"){
        // AI buys if affordable (always buys — greedy AI)
        handleBuy(true);
      } else if(G.phase==="incometax"){
        const {netWorth}=G.taxChoice;
        if(Math.floor(netWorth*0.1)<200) handleTaxPercent();
        else handleTaxFlat();
      } else if(G.phase==="card"){
        handleCard();
      } else if(G.phase==="endturn"){
        handleEndTurn();
      }
    }, 1000);
    return ()=>clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[G?.phase, G?.turn, G?.auction?.idx, rolling]);

  const upd = (nG) => {
    const w = checkWinner(nG);
    setG(w ? {...nG,phase:"gameover",winner:w} : nG);
  };

  // ── ROLL ──────────────────────────────────────────
  const handleRoll = () => {
    if(!G||G.phase!=="roll"||rolling) return;
    const player = G.players[G.turn];
    setRolling(true);
    setTimeout(()=>{
      setRolling(false);
      const d1=rnd(6),d2=rnd(6),total=d1+d2,doubles=d1===d2;
      let nG={...G,dice:[d1,d2]};

      // Jail handling
      if(player.inJail){
        if(doubles){
          nG.players=nG.players.map((p,i)=>i===G.turn?{...p,inJail:false,jailTurns:0}:p);
          nG.log=[...nG.log,`🔓 ${player.name} rolled doubles & escaped Jail!`];
        } else {
          const jt=player.jailTurns+1;
          if(jt>=3){
            // 3rd turn: must pay $50 fine and move
            const fine=Math.min(50,nG.players[G.turn].money);
            nG.players=nG.players.map((p,i)=>i===G.turn?{...p,inJail:false,jailTurns:0,money:p.money-fine}:p);
            nG.log=[...nG.log,`🔓 ${player.name} forced out of Jail (paid ₹${fine} fine). Rolling ${d1}+${d2}=${total}.`];
          } else {
            nG.players=nG.players.map((p,i)=>i===G.turn?{...p,jailTurns:jt}:p);
            nG.log=[...nG.log,`🔒 ${player.name} still in Jail (turn ${jt}/3). Rolled ${d1}+${d2} — no doubles.`];
            upd({...nG,phase:"endturn"}); return;
          }
        }
      }

      const oldPos = nG.players[G.turn].pos;
      const newPos = (oldPos+total)%40;
      nG = moveTo(nG,G.turn,newPos,newPos<oldPos);
      nG.log = [...nG.log,`🎲 ${player.name} rolled ${d1}+${d2}=${total} → ${TILES[newPos].name}`];

      if(doubles&&!player.inJail){
        const dc=(G.doublesCount||0)+1;
        if(dc>=3){
          nG.players=nG.players.map((p,i)=>i===G.turn?{...p,inJail:true,jailTurns:0,pos:10}:p);
          nG.log=[...nG.log,`🚔 ${player.name} rolled 3 doubles in a row! Sent to Jail!`];
          upd({...nG,doublesCount:0,phase:"endturn"}); return;
        }
        nG.doublesCount=dc;
      } else { nG.doublesCount=0; }

      const landed = processLanding(nG,G.turn,newPos);
      // If doubles and not in jail and simple endturn: roll again
      if(doubles&&!landed.players[G.turn].inJail&&landed.phase==="endturn"){
        upd({...landed,phase:"roll"});
      } else { upd(landed); }
    },600);
  };

  // ── BUY ──────────────────────────────────────────
  const handleBuy = (buy) => {
    if(!G||G.phase!=="buy") return;
    const t=TILES[G.pendingBuy], pid=G.turn;
    if(buy){
      const no={...G.owned,[G.pendingBuy]:pid};
      const np=G.players.map((p,i)=>i===pid?{...p,money:p.money-t.price}:p);
      upd({...G,owned:no,players:np,pendingBuy:null,phase:"endturn",
        log:[...G.log,`✅ ${G.players[pid].name} bought ${t.name} for ₹${t.price}!`]});
    } else {
      // Goes to auction
      upd(startAuction({...G,pendingBuy:null},G.pendingBuy));
    }
  };

  // ── AUCTION ──────────────────────────────────────
  const handleAuctionBid = (amount) => {
    if(!G||G.phase!=="auction") return;
    const {auction} = G;
    const bidder = auction.order[auction.idx];
    if(amount<=auction.topBid||amount>G.players[bidder].money) return;
    const nextIdx = (auction.idx+1)%auction.order.length;
    const nA={...auction,topBid:amount,topBidder:bidder,passCount:0,idx:nextIdx};
    upd({...G,auction:nA,log:[...G.log,`💰 ${G.players[bidder].name} bids ₹${amount}!`]});
  };

  const handleAuctionPass = () => {
    if(!G||G.phase!=="auction") return;
    const {auction} = G;
    const bidder=auction.order[auction.idx];
    let newOrder=[...auction.order];
    let newIdx=auction.idx;
    // Remove this player from order (they passed)
    newOrder.splice(newIdx,1);
    if(newOrder.length===0||(newOrder.length===1&&auction.topBidder!==null)){
      // Auction over
      const winner=auction.topBidder;
      if(winner!==null&&auction.topBid>0){
        const no={...G.owned,[auction.tileId]:winner};
        const np=G.players.map((p,i)=>i!==winner?p:{...p,money:p.money-auction.topBid});
        upd({...G,owned:no,players:np,auction:null,phase:"endturn",
          log:[...G.log,`🔨 ${G.players[winner].name} won auction for ${TILES[auction.tileId].name} at ₹${auction.topBid}!`]});
      } else {
        // No bidders: stays with bank
        upd({...G,auction:null,phase:"endturn",
          log:[...G.log,`🔨 No bids — ${TILES[auction.tileId].name} remains with bank.`]});
      }
      return;
    }
    if(newOrder.length===1&&auction.topBidder===newOrder[0]){
      // Only one bidder left who is also top bidder
      const w=newOrder[0];
      const no={...G.owned,[auction.tileId]:w};
      const np=G.players.map((p,i)=>i!==w?p:{...p,money:p.money-auction.topBid});
      upd({...G,owned:no,players:np,auction:null,phase:"endturn",
        log:[...G.log,`🔨 ${G.players[w].name} won auction for ${TILES[auction.tileId].name} at ₹${auction.topBid}!`]});
      return;
    }
    newIdx = newIdx%newOrder.length;
    upd({...G,
      auction:{...auction,order:newOrder,idx:newIdx,passCount:(auction.passCount||0)+1},
      log:[...G.log,`⏭️ ${G.players[bidder].name} passed.`],
    });
  };

  // ── INCOME TAX ────────────────────────────────────
  const handleTaxFlat = () => {
    if(!G||G.phase!=="incometax") return;
    const {pid}=G.taxChoice; const p=G.players[pid];
    const amt=Math.min(200,p.money);
    const np=G.players.map((x,i)=>i!==pid?x:{...x,money:x.money-amt,bankrupt:x.money-amt<=0});
    let nG={...G,players:np,taxChoice:null,log:[...G.log,`💸 ${p.name} paid flat ₹${amt} Income Tax.`]};
    if(np[pid].bankrupt){nG=liquidate(nG,pid,null);}
    upd({...nG,phase:"endturn"});
  };
  const handleTaxPercent = () => {
    if(!G||G.phase!=="incometax") return;
    const {pid,netWorth}=G.taxChoice; const p=G.players[pid];
    const amt=Math.min(Math.floor(netWorth*0.1),p.money);
    const np=G.players.map((x,i)=>i!==pid?x:{...x,money:x.money-amt,bankrupt:x.money-amt<=0});
    let nG={...G,players:np,taxChoice:null,log:[...G.log,`💸 ${p.name} paid 10% = ₹${amt} Income Tax.`]};
    if(np[pid].bankrupt){nG=liquidate(nG,pid,null);}
    upd({...nG,phase:"endturn"});
  };

  // ── CARD ─────────────────────────────────────────
  const handleCard = () => { if(G&&G.phase==="card") upd(processCard(G)); };

  // ── END TURN ─────────────────────────────────────
  const handleEndTurn = () => {
    if(!G||G.phase!=="endturn") return;
    let next=(G.turn+1)%G.players.length, iter=0;
    while(G.players[next].bankrupt&&iter<G.players.length){next=(next+1)%G.players.length;iter++;}
    upd({...G,turn:next,phase:"roll",dice:null,doublesCount:0,
      log:[...G.log,`🔄 ${G.players[next].name}'s turn.`]});
  };

  // ── JAIL ACTIONS ─────────────────────────────────
  const handleJailPay = () => {
    if(!G) return;
    const p=G.players[G.turn];
    const fine=Math.min(50,p.money);
    const np=G.players.map((x,i)=>i!==G.turn?x:{...x,inJail:false,jailTurns:0,money:x.money-fine});
    upd({...G,players:np,log:[...G.log,`💸 ${p.name} paid ₹${fine} fine — out of Jail!`]});
  };
  const handleJailCard = () => {
    if(!G) return;
    const p=G.players[G.turn];
    if(p.jailFreeCards<1) return;
    const np=G.players.map((x,i)=>i!==G.turn?x:{...x,inJail:false,jailTurns:0,jailFreeCards:x.jailFreeCards-1});
    upd({...G,players:np,log:[...G.log,`🎫 ${p.name} used Jail-Free card!`]});
  };

  // ── PROPERTY MANAGEMENT ──────────────────────────
  const handleBuildHouse = (tid) => {
    if(!G) return;
    const t=TILES[tid]; const pid=G.turn; const p=G.players[pid];
    if(!canBuildHouse(G,tid,pid)) return;
    const nh={...G.houses,[tid]:(G.houses[tid]||0)+1};
    const np=G.players.map((x,i)=>i!==pid?x:{...x,money:x.money-t.houseCost});
    const what=(nh[tid]===5)?"🏨 hotel":`🏠 house #${nh[tid]}`;
    upd({...G,houses:nh,players:np,
      log:[...G.log,`🏠 ${p.name} built ${what} on ${t.name} (₹${t.houseCost}).`]});
  };
  const handleSellHouse = (tid) => {
    if(!G) return;
    const t=TILES[tid]; const pid=G.turn; const p=G.players[pid];
    if(!canSellHouse(G,tid,pid)) return;
    const refund=Math.floor(t.houseCost/2);
    const nh={...G.houses,[tid]:(G.houses[tid]||1)-1};
    const np=G.players.map((x,i)=>i!==pid?x:{...x,money:x.money+refund});
    const was=(G.houses[tid]||1)===5?"🏨 hotel":"🏠 house";
    upd({...G,houses:nh,players:np,
      log:[...G.log,`🏚️ ${p.name} sold ${was} from ${t.name} (+₹${refund}).`]});
  };
  const handleMortgage = (tid) => {
    if(!G||!canMortgage(G,tid,G.turn)) return;
    const t=TILES[tid]; const pid=G.turn;
    const np=G.players.map((x,i)=>i!==pid?x:{...x,money:x.money+(t.mortgage||0)});
    const nm={...G.mortgaged,[tid]:true};
    upd({...G,mortgaged:nm,players:np,
      log:[...G.log,`🔒 ${G.players[pid].name} mortgaged ${t.name} (+₹${t.mortgage}).`]});
  };
  const handleUnmortgage = (tid) => {
    if(!G||!canUnmortgage(G,tid,G.turn)) return;
    const t=TILES[tid]; const pid=G.turn;
    const cost=Math.floor((t.mortgage||0)*1.1);
    const np=G.players.map((x,i)=>i!==pid?x:{...x,money:x.money-cost});
    const nm={...G.mortgaged}; delete nm[tid];
    upd({...G,mortgaged:nm,players:np,
      log:[...G.log,`🔓 ${G.players[pid].name} lifted mortgage on ${t.name} (₹${cost}).`]});
  };

  // ══════════════════════════════════════════════════
  // SETUP SCREEN
  // ══════════════════════════════════════════════════
  if(screen==="setup") return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#0d2b1a 0%,#1B5E20 50%,#0d2b1a 100%)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      fontFamily:"'Georgia',serif",color:"white",padding:20,
    }}>
      <style>{`
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .sbtn:hover{transform:scale(1.03)!important;}
        .nbtn:hover{background:rgba(253,216,53,0.2)!important;}
        input:focus{outline:none!important;border-color:#FDD835!important;}
      `}</style>
      <div style={{animation:"fadeIn 0.6s ease",textAlign:"center",maxWidth:440}}>
        <div style={{fontSize:70,animation:"pulse 2s infinite",marginBottom:6}}>🏙️</div>
        <h1 style={{fontSize:50,fontWeight:900,margin:"0 0 2px",letterSpacing:6,
          color:"#FDD835",textShadow:"0 0 30px rgba(253,216,53,0.5),2px 3px 0 rgba(0,0,0,0.5)"}}>
          CITY EMPIRE
        </h1>
        <p style={{fontSize:12,letterSpacing:4,opacity:0.5,margin:"0 0 32px"}}>
          INDIA EDITION — OFFICIAL MONOPOLY RULES
        </p>
        <div style={{
          background:"rgba(255,255,255,0.07)",backdropFilter:"blur(16px)",
          borderRadius:20,padding:"28px 32px",border:"1px solid rgba(255,255,255,0.12)",
          boxShadow:"0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <div style={{marginBottom:24}}>
            <div style={{fontSize:11,letterSpacing:2,opacity:0.6,marginBottom:10}}>NUMBER OF PLAYERS</div>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              {[2,3,4].map(n=>(
                <button key={n} className="nbtn" onClick={()=>setNum(n)} style={{
                  width:64,height:64,borderRadius:14,cursor:"pointer",
                  border:numPlayers===n?"2.5px solid #FDD835":"1.5px solid rgba(255,255,255,0.2)",
                  background:numPlayers===n?"rgba(253,216,53,0.15)":"rgba(255,255,255,0.05)",
                  color:numPlayers===n?"#FDD835":"rgba(255,255,255,0.7)",
                  fontSize:26,fontWeight:"bold",transition:"all 0.2s",
                }}>{n}</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:24}}>
            {Array.from({length:numPlayers},(_,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:14,height:14,borderRadius:"50%",background:PLAYER_COLORS[i],flexShrink:0}}/>
                <input value={names[i]} onChange={e=>{const n=[...names];n[i]=e.target.value;setNames(n);}}
                  placeholder={`Player ${i+1}`}
                  style={{flex:1,padding:"9px 14px",borderRadius:10,
                    border:"1.5px solid rgba(255,255,255,0.2)",
                    background:"rgba(255,255,255,0.08)",color:"white",
                    fontSize:14,fontFamily:"'Georgia',serif",transition:"border-color 0.2s"}}
                />
                <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:"1.5px solid rgba(255,255,255,0.2)",flexShrink:0}}>
                  <button onClick={()=>{const f=[...aiFlags];f[i]=false;setAiFlags(f);}} style={{
                    padding:"7px 10px",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
                    background:!aiFlags[i]?"rgba(253,216,53,0.3)":"rgba(255,255,255,0.05)",
                    color:!aiFlags[i]?"#FDD835":"rgba(255,255,255,0.4)",transition:"all 0.15s",
                  }}>👤</button>
                  <button onClick={()=>{const f=[...aiFlags];f[i]=true;setAiFlags(f);}} style={{
                    padding:"7px 10px",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,
                    background:aiFlags[i]?"rgba(100,200,255,0.25)":"rgba(255,255,255,0.05)",
                    color:aiFlags[i]?"#64C8FF":"rgba(255,255,255,0.4)",transition:"all 0.15s",
                  }}>🤖</button>
                </div>
              </div>
            ))}
          </div>
          {/* Rules summary */}
          <div style={{
            background:"rgba(0,0,0,0.2)",borderRadius:10,padding:"10px 14px",
            marginBottom:20,textAlign:"left",fontSize:10,lineHeight:1.8,opacity:0.7,
          }}>
            ✅ Auction when property declined &nbsp; ✅ Mortgage system (+10% interest)<br/>
            ✅ Even building rule &nbsp; ✅ Income Tax: ₹200 flat or 10% net worth<br/>
            ✅ Houses/Hotels sell at half price &nbsp; ✅ Mortgaged = no rent collected<br/>
            ✅ 3-turn jail system &nbsp; ✅ Bankruptcy liquidation<br/>
            🤖 AI players auto-play &nbsp; 🏆 Last player standing wins
          </div>
          <button className="sbtn" onClick={()=>{setG(initGame(numPlayers,names,aiFlags));setScreen("game");}} style={{
            width:"100%",padding:16,borderRadius:14,
            background:"linear-gradient(135deg,#FDD835,#F57F17)",
            color:"#1B2820",border:"none",fontSize:18,fontWeight:900,
            cursor:"pointer",letterSpacing:3,transition:"all 0.2s",
            boxShadow:"0 4px 20px rgba(253,216,53,0.35)",
          }}>🎲 START GAME</button>
        </div>
        <div style={{marginTop:18,display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>
          {Object.entries(GROUP_COLORS).map(([g,c])=>(
            <div key={g} style={{padding:"3px 8px",borderRadius:6,background:c,
              color:GROUP_TEXT[g],fontSize:10,fontWeight:700,letterSpacing:1}}>
              {g.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════
  // GAME SCREEN
  // ══════════════════════════════════════════════════
  if(!G) return null;
  const cp = G.players[G.turn];
  const highlightTile = G.phase==="buy"?G.pendingBuy
    : G.phase==="auction"?G.auction?.tileId
    : null;
  const manageVisible = (G.phase==="roll"||G.phase==="endturn") && !cp.bankrupt;
  const nw = G.phase!=="gameover" ? calcNetWorth(G,G.turn) : 0;

  return (
    <div style={{
      display:"flex",flexWrap:"wrap",gap:12,padding:12,
      background:"#0d1f14",minHeight:"100vh",
      fontFamily:"'Georgia',serif",color:"white",
      justifyContent:"center",alignItems:"flex-start",
    }}>
      <style>{`
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:rgba(255,255,255,0.05)}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:3px}
        .abtn:hover{filter:brightness(1.12);transform:translateY(-1px);}
        .abtn:active{transform:translateY(0);}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
      `}</style>

      {/* ── BOARD ── */}
      <Board G={G} highlightTile={highlightTile}/>

      {/* ── SIDEBAR ── */}
      <div style={{flex:1,minWidth:280,maxWidth:420,display:"flex",flexDirection:"column",gap:10}}>

        {/* GAME OVER */}
        {G.phase==="gameover"&&(
          <div style={{
            background:"linear-gradient(135deg,#B8860B,#DAA520,#FFD700)",
            borderRadius:18,padding:28,textAlign:"center",color:"#1a1a1a",
            boxShadow:"0 8px 40px rgba(218,165,32,0.5)",
          }}>
            <style>{`
              @keyframes trophy{0%,100%{transform:scale(1) rotate(-5deg)}50%{transform:scale(1.2) rotate(5deg)}}
              @keyframes confetti{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:0;transform:translateY(60px) rotate(720deg)}}
            `}</style>
            <div style={{fontSize:64,marginBottom:8,display:"inline-block",animation:"trophy 1.2s ease-in-out infinite"}}>🏆</div>
            <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:8,fontSize:22}}>
              {"🎉🥳🎊🎈".split("").map((e,i)=>(
                <span key={i} style={{display:"inline-block",animation:`confetti ${0.8+i*0.2}s ease-out ${i*0.1}s infinite`}}>{e}</span>
              ))}
            </div>
            <h2 style={{margin:"0 0 4px",fontSize:28,fontWeight:900,letterSpacing:2}}>
              {G.winner?.isAI?"🤖":"👤"} {G.winner?`${G.winner.name} Wins!`:"Game Over!"}
            </h2>
            <p style={{margin:"0 0 6px",fontSize:15,fontWeight:700,opacity:0.8}}>
              {G.winner?.isAI?"The AI dominated the board!":"A human champion prevails!"}
            </p>
            {G.winner&&<p style={{margin:"0 0 16px",fontSize:13,opacity:0.75}}>
              Final balance: ₹{G.winner.money.toLocaleString()} &nbsp;|&nbsp;
              Net worth: ₹{calcNetWorth(G, G.winner.id).toLocaleString()}
            </p>}
            <div style={{marginBottom:16,fontSize:11,opacity:0.7}}>
              {G.players.filter(p=>p.bankrupt).map(p=>(
                <div key={p.id}>💀 {p.isAI?"🤖":"👤"} {p.name} went bankrupt</div>
              ))}
            </div>
            <button onClick={()=>setScreen("setup")} style={{
              padding:"10px 28px",borderRadius:12,background:"#1B5E20",color:"white",
              border:"none",fontSize:15,cursor:"pointer",fontWeight:700,letterSpacing:1,
            }}>🔄 Play Again</button>
          </div>
        )}

        {/* CURRENT PLAYER CARD */}
        {G.phase!=="gameover"&&(
          <div style={{
            background:`linear-gradient(135deg,${cp.color}22,${cp.color}11)`,
            border:`2px solid ${cp.color}88`,borderRadius:16,padding:16,
          }}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:14,height:14,borderRadius:"50%",background:cp.color,
                boxShadow:`0 0 8px ${cp.color}`}}/>
              <span style={{fontWeight:700,fontSize:17}}>{cp.isAI?"🤖 ":""}{cp.name}'s Turn</span>
              {cp.inJail&&<span style={{background:"#C62828",padding:"2px 8px",borderRadius:6,
                fontSize:10,fontWeight:700,letterSpacing:1}}>⛓️ JAIL (turn {cp.jailTurns+1}/3)</span>}
              {G.doublesCount>0&&<span style={{background:"#F57F17",padding:"2px 8px",borderRadius:6,
                fontSize:10,letterSpacing:1}}>DOUBLES! Roll again</span>}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
              <div style={{fontSize:22,fontWeight:900,color:"#FDD835",
                textShadow:"0 0 12px rgba(253,216,53,0.4)"}}>
                ₹{cp.money.toLocaleString()}
              </div>
              <div style={{fontSize:10,opacity:0.5}}>
                Net worth: ₹{nw.toLocaleString()}
                {cp.jailFreeCards>0&&` • 🎫×${cp.jailFreeCards}`}
              </div>
            </div>

            {/* Dice */}
            <div style={{marginBottom:12}}>
              <Dice values={G.dice} rolling={rolling}/>
              {G.dice&&<div style={{textAlign:"center",fontSize:11,opacity:0.5,marginTop:4}}>
                {G.dice[0]}+{G.dice[1]}={G.dice[0]+G.dice[1]}{G.dice[0]===G.dice[1]?" (Doubles!)":""}
              </div>}
            </div>

            {/* ── ACTIONS ── */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>

              {/* Roll button */}
              {G.phase==="roll"&&!cp.inJail&&(
                cp.isAI
                  ? <div style={{padding:14,borderRadius:12,background:"rgba(100,200,255,0.1)",
                      border:"1px solid rgba(100,200,255,0.3)",textAlign:"center",fontSize:14,color:"#64C8FF",fontWeight:700,
                      animation:"pulse 1s infinite"}}>🤖 AI is thinking...</div>
                  : <button className="abtn" onClick={handleRoll} disabled={rolling} style={{
                    padding:14,borderRadius:12,
                    background:rolling?"#555":"linear-gradient(135deg,#FDD835,#F9A825)",
                    color:rolling?"#aaa":"#1B2820",border:"none",fontSize:16,fontWeight:900,
                    cursor:rolling?"not-allowed":"pointer",letterSpacing:1,transition:"all 0.15s",
                    boxShadow:rolling?"none":"0 4px 16px rgba(253,216,53,0.3)",
                  }}>{rolling?"🎲 Rolling...":"🎲 Roll Dice"}</button>
              )}

              {/* Jail options */}
              {G.phase==="roll"&&cp.inJail&&(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <button className="abtn" onClick={handleRoll} disabled={rolling} style={{
                    padding:11,borderRadius:10,background:"linear-gradient(135deg,#1976D2,#0D47A1)",
                    color:"white",border:"none",fontSize:14,fontWeight:700,cursor:rolling?"not-allowed":"pointer",transition:"all 0.15s",
                  }}>{rolling?"Rolling...":"🎲 Roll for Doubles (Escape)"}</button>
                  {cp.jailTurns<2&&<button className="abtn" onClick={handleJailPay} style={{
                    padding:11,borderRadius:10,background:"linear-gradient(135deg,#E53935,#B71C1C)",
                    color:"white",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all 0.15s",
                  }}>💸 Pay ₹50 Fine (Before Rolling)</button>}
                  {cp.jailFreeCards>0&&<button className="abtn" onClick={handleJailCard} style={{
                    padding:11,borderRadius:10,background:"linear-gradient(135deg,#7B1FA2,#4A148C)",
                    color:"white",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all 0.15s",
                  }}>🎫 Use Jail-Free Card</button>}
                  {cp.jailTurns===2&&<div style={{fontSize:10,color:"#E57373",textAlign:"center",padding:"4px 0"}}>
                    ⚠️ 3rd turn — must pay ₹50 when rolling!
                  </div>}
                </div>
              )}

              {/* Buy panel */}
              {G.phase==="buy"&&G.pendingBuy!==null&&(()=>{
                const t=TILES[G.pendingBuy];
                return (
                  <>
                    <div style={{background:"rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 12px",fontSize:13,textAlign:"center"}}>
                      <span style={{color:"#FDD835",fontWeight:700}}>{t.name}</span>
                      {t.group&&<span style={{marginLeft:6,padding:"2px 8px",borderRadius:6,fontSize:11,
                        background:GROUP_COLORS[t.group],color:GROUP_TEXT[t.group],fontWeight:700}}>
                        {t.group.toUpperCase()}
                      </span>}
                      <br/>
                      <span style={{opacity:0.7}}>Price: </span>
                      <span style={{fontWeight:700,color:"#FDD835"}}>₹{t.price}</span>
                      {t.mortgage&&<span style={{opacity:0.5,fontSize:11}}> • Mortgage: ₹{t.mortgage}</span>}
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="abtn" onClick={()=>handleBuy(true)} style={{
                        flex:1,padding:12,borderRadius:10,background:"linear-gradient(135deg,#43A047,#1B5E20)",
                        color:"white",border:"none",fontSize:15,fontWeight:700,cursor:"pointer",transition:"all 0.15s",
                      }}>✅ Buy</button>
                      <button className="abtn" onClick={()=>handleBuy(false)} style={{
                        flex:1,padding:12,borderRadius:10,background:"linear-gradient(135deg,#E53935,#B71C1C)",
                        color:"white",border:"none",fontSize:15,fontWeight:700,cursor:"pointer",transition:"all 0.15s",
                      }}>🔨 Auction</button>
                    </div>
                  </>
                );
              })()}

              {/* Auction panel */}
              {G.phase==="auction"&&(
                <AuctionPanel G={G} onBid={handleAuctionBid} onPass={handleAuctionPass}/>
              )}

              {/* Income tax choice */}
              {G.phase==="incometax"&&(
                <TaxChoicePanel G={G} onFlat={handleTaxFlat} onPercent={handleTaxPercent}/>
              )}

              {/* Card panel */}
              {G.phase==="card"&&G.activeCard&&(
                <>
                  <div style={{
                    background:G.activeCard.type==="chance"?"rgba(253,216,53,0.12)":"rgba(33,150,243,0.12)",
                    border:`1px solid ${G.activeCard.type==="chance"?"#FDD835":"#42A5F5"}44`,
                    borderRadius:12,padding:"14px 16px",fontSize:13,textAlign:"center",lineHeight:1.6,
                  }}>
                    <div style={{fontSize:22,marginBottom:4}}>{G.activeCard.type==="chance"?"🃏":"📦"}</div>
                    <div style={{fontWeight:700,marginBottom:4,color:G.activeCard.type==="chance"?"#FDD835":"#42A5F5"}}>
                      {G.activeCard.type==="chance"?"CHANCE":"COMMUNITY CHEST"}
                    </div>
                    <div style={{opacity:0.9}}>{G.activeCard.card.text}</div>
                  </div>
                  <button className="abtn" onClick={handleCard} style={{
                    padding:12,borderRadius:10,
                    background:G.activeCard.type==="chance"?"linear-gradient(135deg,#F57F17,#E65100)":"linear-gradient(135deg,#1976D2,#0D47A1)",
                    color:"white",border:"none",fontSize:15,fontWeight:700,cursor:"pointer",transition:"all 0.15s",
                  }}>OK — Apply Card Effect</button>
                </>
              )}

              {/* End turn */}
              {G.phase==="endturn"&&(
                <button className="abtn" onClick={handleEndTurn} style={{
                  padding:14,borderRadius:12,background:"linear-gradient(135deg,#43A047,#1B5E20)",
                  color:"white",border:"none",fontSize:16,fontWeight:900,cursor:"pointer",
                  letterSpacing:1,transition:"all 0.15s",boxShadow:"0 4px 16px rgba(67,160,71,0.3)",
                }}>➡️ End Turn</button>
              )}
            </div>
          </div>
        )}

        {/* PROPERTY MANAGEMENT */}
        {manageVisible&&<PropertyManager
          G={G}
          onBuildHouse={handleBuildHouse}
          onSellHouse={handleSellHouse}
          onMortgage={handleMortgage}
          onUnmortgage={handleUnmortgage}
        />}

        {/* ALL PLAYERS */}
        <div style={{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:14,
          border:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontSize:10,letterSpacing:2,opacity:0.5,marginBottom:10,fontWeight:700}}>ALL PLAYERS</div>
          {G.players.map((p,i)=>{
            const pNw = calcNetWorth(G,i);
            return (
              <div key={i} style={{
                display:"flex",alignItems:"center",gap:8,marginBottom:8,
                opacity:p.bankrupt?0.3:1,
                padding:"8px 10px",borderRadius:10,
                background:G.turn===i&&!p.bankrupt?"rgba(255,255,255,0.08)":"transparent",
                border:G.turn===i&&!p.bankrupt?`1px solid ${p.color}44`:"1px solid transparent",
              }}>
                <div style={{width:12,height:12,borderRadius:"50%",background:p.color,flexShrink:0,
                  boxShadow:G.turn===i&&!p.bankrupt?`0 0 8px ${p.color}`:""}}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:G.turn===i?700:400,fontSize:13}}>{p.isAI?"🤖 ":""}{p.name}</div>
                  <div style={{fontSize:10,opacity:0.5}}>
                    {TILES[p.pos].name.slice(0,14)}
                    {p.inJail?" • ⛓️":""}{p.jailFreeCards>0?` • 🎫×${p.jailFreeCards}`:""}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700,color:"#FDD835",fontSize:13}}>₹{p.money.toLocaleString()}</div>
                  <div style={{fontSize:9,opacity:0.45}}>Net: ₹{pNw.toLocaleString()}</div>
                </div>
                {p.bankrupt&&<span style={{fontSize:14}}>💀</span>}
                {G.turn===i&&!p.bankrupt&&<span style={{fontSize:10,color:p.color}}>▶</span>}
              </div>
            );
          })}
        </div>

        {/* GAME LOG */}
        <div style={{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:14,
          border:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{fontSize:10,letterSpacing:2,opacity:0.5,marginBottom:8,fontWeight:700}}>GAME LOG</div>
          <div ref={logRef} style={{maxHeight:160,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
            {G.log.map((e,i)=>(
              <div key={i} style={{
                fontSize:11,lineHeight:1.4,padding:"2px 0",
                borderBottom:"1px solid rgba(255,255,255,0.04)",
                color:i===G.log.length-1?"white":"rgba(255,255,255,0.5)",
              }}>{e}</div>
            ))}
          </div>
        </div>

        <button onClick={()=>setScreen("setup")} style={{
          padding:9,borderRadius:10,background:"rgba(255,255,255,0.06)",
          color:"rgba(255,255,255,0.4)",border:"1px solid rgba(255,255,255,0.08)",
          fontSize:11,cursor:"pointer",letterSpacing:1,
        }}>← Main Menu</button>
      </div>
    </div>
  );
}
