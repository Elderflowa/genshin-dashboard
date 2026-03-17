// All images served from paimon.moe - updated regularly, covers all current characters
const PM = 'https://paimon.moe/images'

// ELEMENT ICONS - paimon.moe element PNGs
export const ELEMENTS = {
  Pyro:    { color:'#ff6432', rgb:'255,100,50',   icon:`${PM}/elements/pyro.png`    },
  Hydro:   { color:'#46b4f5', rgb:'70,180,245',   icon:`${PM}/elements/hydro.png`   },
  Anemo:   { color:'#64c8b9', rgb:'100,200,185',  icon:`${PM}/elements/anemo.png`   },
  Electro: { color:'#c382dc', rgb:'195,130,220',  icon:`${PM}/elements/electro.png` },
  Dendro:  { color:'#8cc864', rgb:'140,200,100',  icon:`${PM}/elements/dendro.png`  },
  Cryo:    { color:'#a0dcfa', rgb:'160,220,250',  icon:`${PM}/elements/cryo.png`    },
  Geo:     { color:'#f5c83c', rgb:'245,200,60',   icon:`${PM}/elements/geo.png`     },
}

// CHARACTER ICONS - paimon.moe uses snake_case, mostly matching our IDs
// Only exceptions need explicit mapping:
const PAIMON_CHAR_IDS = {
  kazuha:         'kaedehara_kazuha',
  ayaka:          'kamisato_ayaka',
  ayato:          'kamisato_ayato',
  kokomi:         'sangonomiya_kokomi',
  heizou:         'shikanoin_heizou',
  kuki_shinobu:   'kuki_shinobu',
  mizuki:         'yumemizuki_mizuki',
  hu_tao:         'hu_tao',
  arataki_itto:   'arataki_itto',
  kujou_sara:     'kujou_sara',
  raiden_shogun:  'raiden_shogun',
  yae_miko:       'yae_miko',
  yun_jin:        'yun_jin',
  lan_yan:        'lan_yan',
  traveler_anemo: 'traveler',
  traveler_geo:   'traveler',
  traveler_electro:'traveler',
  traveler_dendro:'traveler',
  traveler_hydro: 'traveler',
  traveler_pyro:  'traveler',
  traveler_cryo:  'traveler',
}
export const charIcon = (id) => {
  const pid = PAIMON_CHAR_IDS[id] || id
  return `${PM}/characters/${pid}.png`
}

// WEAPON ICONS - paimon.moe snake_case weapon IDs
const WEAPON_ICON_OVERRIDES = {
  'prospectors_shovel': "https://static.wikia.nocookie.net/gensin-impact/images/f/fc/Weapon_Prospector%27s_Shovel.png",
}
export const weaponIcon     = (id) => WEAPON_ICON_OVERRIDES[id] || `${PM}/weapons/${id}.png`
export const weaponTypeIcon = (t)  => `${PM}/weapons/${t.toLowerCase()}.png`

// ─── TALENT BOOKS ─────────────────────────────────────────────────────────────
export const TALENT_BOOKS = {
  freedom:    {name:'Freedom',    color:'#4a9eff'},
  resistance: {name:'Resistance', color:'#4a9eff'},
  ballad:     {name:'Ballad',     color:'#4a9eff'},
  prosperity: {name:'Prosperity', color:'#f5a623'},
  diligence:  {name:'Diligence',  color:'#f5a623'},
  gold:       {name:'Gold',       color:'#f5a623'},
  transience: {name:'Transience', color:'#c678dd'},
  elegance:   {name:'Elegance',   color:'#c678dd'},
  light:      {name:'Light',      color:'#c678dd'},
  admonition: {name:'Admonition', color:'#98c379'},
  ingenuity:  {name:'Ingenuity',  color:'#98c379'},
  praxis:     {name:'Praxis',     color:'#98c379'},
  equity:     {name:'Equity',     color:'#56b6c2'},
  justice:    {name:'Justice',    color:'#56b6c2'},
  order:      {name:'Order',      color:'#56b6c2'},
  conflict:   {name:'Conflict',   color:'#e06c75'},
  contention: {name:'Contention', color:'#e06c75'},
  kindling:   {name:'Kindling',   color:'#e06c75'},
  elysium:    {name:'Elysium',    color:'#9e8cdb'},
  moonlight:  {name:'Moonlight',  color:'#9e8cdb'},
  vagrancy:   {name:'Vagrancy',   color:'#9e8cdb'},
}

// ─── WEAPON MATS ──────────────────────────────────────────────────────────────
export const WEAPON_MATS = {
  decarabian:       {name:'Decarabian',          color:'#4a9eff'},
  boreal_wolf:      {name:'Boreal Wolf',          color:'#4a9eff'},
  dandelion_gladiator:{name:'Dandelion Gladiator',color:'#4a9eff'},
  guyun:            {name:'Guyun',               color:'#f5a623'},
  mist_veiled:      {name:'Mist Veiled',          color:'#f5a623'},
  aerosiderite:     {name:'Aerosiderite',         color:'#f5a623'},
  distant_sea:      {name:'Distant Sea',          color:'#c678dd'},
  narukami:         {name:'Narukami',             color:'#c678dd'},
  kijin:            {name:'Kijin',                color:'#c678dd'},
  copper_talisman:  {name:'Copper Talisman',      color:'#98c379'},
  forest_dew:       {name:'Forest Dew',           color:'#98c379'},
  oasis_garden:     {name:'Oasis Garden',         color:'#98c379'},
  talisman_soldier: {name:'Talisman of Soldier',  color:'#56b6c2'},
  broken_goblet:    {name:'Broken Goblet',        color:'#56b6c2'},
  ancient_chord:    {name:'Ancient Chord',        color:'#56b6c2'},
  scorching_might:  {name:'Scorching Might',      color:'#e06c75'},
  night_wind:       {name:"Night Wind's Mystic",  color:'#e06c75'},
  blazing_heart:    {name:'Blazing Sacrificial Heart',color:'#e06c75'},
  artful_device:    {name:'Artful Device',        color:'#9e8cdb'},
  far_north:        {name:'Far-North Scions',     color:'#9e8cdb'},
  long_night:       {name:'Long Night Flint',     color:'#9e8cdb'},
}

// ─── TALENT DOMAINS ───────────────────────────────────────────────────────────
export const TALENT_DOMAINS = [
  // Mon/Thu [1,4]: admonition, contention, equity, freedom, order, prosperity, transience
  {id:'domain_mon_a', name:'Forsaken Rift',        region:'Mondstadt', days:[1,4], drops:['freedom','prosperity','transience']},
  {id:'domain_mon_b', name:'Pale Forgotten Glory', region:'Fontaine',  days:[1,4], drops:['admonition','contention','equity']},
  // Tue/Fri [2,5]: diligence, elegance, ingenuity, justice, kindling, resistance
  {id:'domain_tue_a', name:'Violet Court',          region:'Inazuma',  days:[2,5], drops:['elegance','ingenuity','resistance']},
  {id:'domain_tue_b', name:'Steeple of Ignorance',  region:'Sumeru',   days:[2,5], drops:['diligence','justice','kindling']},
  // Wed/Sat [3,6]: ballad, conflict, gold, light, praxis, order
  {id:'domain_wed_a', name:'Forsaken Rift',          region:'Mondstadt', days:[3,6], drops:['ballad','gold','light']},
  {id:'domain_wed_b', name:'Blazing Ruins',           region:'Natlan',   days:[3,6], drops:['conflict','praxis','order']},
  // Nod-Krai
  {id:'lightless_capital_a', name:'Lightless Capital', region:'Nod-Krai', days:[1,4], drops:['moonlight']},
  {id:'lightless_capital_b', name:'Lightless Capital', region:'Nod-Krai', days:[2,5], drops:['elysium']},
  {id:'lightless_capital_c', name:'Lightless Capital', region:'Nod-Krai', days:[3,6], drops:['vagrancy']},
]
export const WEAPON_DOMAINS = [
  // Monday / Thursday
  {id:'cecilia_garden',       name:'Cecilia Garden',             region:'Mondstadt', days:[1,4], drops:['decarabian','guyun','forest_dew']},
  // Tuesday / Friday
  {id:'hidden_palace',        name:'Hidden Palace of Lianshan',  region:'Liyue',     days:[2,5], drops:['boreal_wolf','mist_veiled','narukami','oasis_garden']},
  // Wednesday / Saturday
  {id:'court_flowing_sand',   name:'Court of Flowing Sand',      region:'Inazuma',   days:[3,6], drops:['aerosiderite','dandelion_gladiator','kijin','scorching_might']},
  // Tuesday / Friday
  {id:'tower_abject_pride',   name:'Tower of Abject Pride',      region:'Sumeru',    days:[2,5], drops:['copper_talisman','distant_sea']},
  // Wednesday / Saturday
  {id:'echoes_deep_tides',    name:'Echoes of the Deep Tides',   region:'Fontaine',  days:[3,6], drops:['talisman_soldier','broken_goblet','ancient_chord']},
  // Monday / Thursday
  {id:'ancient_watchtower',   name:'Ancient Watchtower',         region:'Natlan',    days:[1,4], drops:['night_wind','blazing_heart']},
  // Tuesday / Friday
  {id:'lost_mooncourt',       name:'Lost Mooncourt',             region:'Nod-Krai',  days:[2,5], drops:['artful_device','far_north','long_night']},
]

// ─── WEAPONS LIST ─────────────────────────────────────────────────────────────
// id matches paimon.moe image filenames: paimon.moe/images/weapons/{id}.png
// type: Sword|Claymore|Polearm|Catalyst|Bow
export const WEAPONS = [
  // ── 5★ Swords ──
  {id:'mistsplitter_reforged',         name:'Mistsplitter Reforged',           type:'Sword',    rarity:5, domainMat:'narukami'},
  {id:'haran_geppaku_futsu',           name:'Haran Geppaku Futsu',             type:'Sword',    rarity:5, domainMat:'narukami'},
  {id:'key_of_khaj-nisut',             name:'Key of Khaj-Nisut',               type:'Sword',    rarity:5, domainMat:'copper_talisman'},
  {id:'light_of_foliar_incision',      name:'Light of Foliar Incision',        type:'Sword',    rarity:5, domainMat:'copper_talisman'},
  {id:'peak_patrol_song',              name:'Peak Patrol Song',                type:'Sword',    rarity:5, domainMat:'artful_device'},
  {id:'splendor_of_tranquil_waters',   name:'Splendor of Tranquil Waters',     type:'Sword',    rarity:5, domainMat:'talisman_soldier'},
  {id:'primordial_jade_cutter',        name:'Primordial Jade Cutter',          type:'Sword',    rarity:5, domainMat:'guyun'},
  {id:'aquila_favonia',                name:'Aquila Favonia',                  type:'Sword',    rarity:5, domainMat:'dandelion_gladiator'},
  {id:'freedom-sworn',                 name:'Freedom-Sworn',                   type:'Sword',    rarity:5, domainMat:'dandelion_gladiator'},
  {id:'skyward_blade',                 name:'Skyward Blade',                   type:'Sword',    rarity:5, domainMat:'decarabian'},
  {id:'summit_shaper',                 name:'Summit Shaper',                   type:'Sword',    rarity:5, domainMat:'guyun'},
  {id:'absolution',                    name:'Absolution',                      type:'Sword',    rarity:5, domainMat:'talisman_soldier'},
  {id:'nightweavers_looking_glass',    name:"Nightweaver's Looking Glass",     type:'Sword',    rarity:5, domainMat:'artful_device'},
  {id:'uraku_misugiri',                name:'Uraku Misugiri',                  type:'Sword',    rarity:5, domainMat:'kijin'},
  // ── 4★ Swords ──
  {id:'the_black_sword',               name:'The Black Sword',                 type:'Sword',    rarity:4, domainMat:'dandelion_gladiator'},
  {id:'iron_sting',                    name:'Iron Sting',                      type:'Sword',    rarity:4, domainMat:'aerosiderite'},
  {id:'amenoma_kageuchi',              name:'Amenoma Kageuchi',                type:'Sword',    rarity:4, domainMat:'narukami'},
  {id:'favonius_sword',                name:'Favonius Sword',                  type:'Sword',    rarity:4, domainMat:'dandelion_gladiator'},
  {id:'sacrificial_sword',             name:'Sacrificial Sword',               type:'Sword',    rarity:4, domainMat:'dandelion_gladiator'},
  {id:'prototype_rancour',             name:'Prototype Rancour',               type:'Sword',    rarity:4, domainMat:'aerosiderite'},
  {id:'festering_desire',              name:'Festering Desire',                type:'Sword',    rarity:4, domainMat:'decarabian'},
  {id:'lions_roar',                    name:"Lion's Roar",                     type:'Sword',    rarity:4, domainMat:'aerosiderite'},
  {id:'the_flute',                     name:'The Flute',                       type:'Sword',    rarity:4, domainMat:'dandelion_gladiator'},
  {id:'blackcliff_longsword',          name:'Blackcliff Longsword',            type:'Sword',    rarity:4, domainMat:'aerosiderite'},
  {id:'royal_longsword',               name:'Royal Longsword',                 type:'Sword',    rarity:4, domainMat:'aerosiderite'},
  {id:'xiphos_moonlight',              name:"Xiphos' Moonlight",               type:'Sword',    rarity:4, domainMat:'copper_talisman'},
  {id:'sapwood_blade',                 name:'Sapwood Blade',                   type:'Sword',    rarity:4, domainMat:'forest_dew'},
  {id:'toukabou_shigure',              name:'Toukabou Shigure',                type:'Sword',    rarity:4, domainMat:'kijin'},
  {id:'fleuve_cendre_ferryman',        name:'Fleuve Cendre Ferryman',          type:'Sword',    rarity:4, domainMat:'broken_goblet'},
  {id:'finale_of_the_deep',            name:'Finale of the Deep',              type:'Sword',    rarity:4, domainMat:'ancient_chord'},
  {id:'sword_of_narzissenkreuz',       name:'Sword of Narzissenkreuz',         type:'Sword',    rarity:4, domainMat:'broken_goblet'},
  {id:'sword_of_descension',           name:'Sword of Descension',             type:'Sword',    rarity:4, domainMat:'boreal_wolf'},

  // ── 5★ Claymores ──
  {id:'song_of_broken_pines',          name:'Song of Broken Pines',            type:'Claymore', rarity:5, domainMat:'dandelion_gladiator'},
  {id:'wolfs_gravestone',              name:"Wolf's Gravestone",               type:'Claymore', rarity:5, domainMat:'decarabian'},
  {id:'redhorn_stonethresher',         name:'Redhorn Stonethresher',           type:'Claymore', rarity:5, domainMat:'narukami'},
  {id:'beacon_of_the_reed_sea',        name:'Beacon of the Reed Sea',          type:'Claymore', rarity:5, domainMat:'oasis_garden'},
  {id:'verdict',                       name:'Verdict',                         type:'Claymore', rarity:5, domainMat:'talisman_soldier'},
  {id:'gest_of_the_mighty_wolf',       name:'Gest of the Mighty Wolf',         type:'Claymore', rarity:5, domainMat:'boreal_wolf'},
  {id:'skyward_pride',                 name:'Skyward Pride',                   type:'Claymore', rarity:5, domainMat:'decarabian'},
  {id:'the_unforged',                  name:'The Unforged',                    type:'Claymore', rarity:5, domainMat:'guyun'},
  // ── 4★ Claymores ──
  {id:'serpent_spine',                 name:'Serpent Spine',                   type:'Claymore', rarity:4, domainMat:'aerosiderite'},
  {id:'rainslasher',                   name:'Rainslasher',                     type:'Claymore', rarity:4, domainMat:'aerosiderite'},
  {id:'favonius_greatsword',           name:'Favonius Greatsword',             type:'Claymore', rarity:4, domainMat:'dandelion_gladiator'},
  {id:'sacrificial_greatsword',        name:'Sacrificial Greatsword',          type:'Claymore', rarity:4, domainMat:'dandelion_gladiator'},
  {id:'prototype_archaic',             name:'Prototype Archaic',               type:'Claymore', rarity:4, domainMat:'aerosiderite'},
  {id:'whiteblind',                    name:'Whiteblind',                      type:'Claymore', rarity:4, domainMat:'aerosiderite'},
  {id:'lithic_blade',                  name:'Lithic Blade',                    type:'Claymore', rarity:4, domainMat:'guyun'},
  {id:'makhaira_aquamarine',            name:'Makhaira Aquamarine',             type:'Claymore', rarity:4, domainMat:'copper_talisman'},
  {id:'akuoumaru',                     name:'Akuoumaru',                       type:'Claymore', rarity:4, domainMat:'distant_sea'},
  {id:'forest_regalia',                name:'Forest Regalia',                  type:'Claymore', rarity:4, domainMat:'forest_dew'},
  {id:'talking_stick',                 name:'Talking Stick',                   type:'Claymore', rarity:4, domainMat:'oasis_garden'},
  {id:'tidal_shadow',                  name:'Tidal Shadow',                    type:'Claymore', rarity:4, domainMat:'ancient_chord'},
  {id:'ultimate_overlords_mega_magic_sword', name:"Ultimate Overlord's Mega Magic Sword", type:'Claymore', rarity:4, domainMat:'broken_goblet'},
  {id:'fruitful_hook',                 name:'Fruitful Hook',                   type:'Claymore', rarity:4, domainMat:'scorching_might'},
  // ── 5★ Polearms ──
  {id:'engulfing_lightning',           name:'Engulfing Lightning',             type:'Polearm',  rarity:5, domainMat:'narukami'},
  {id:'staff_of_homa',                 name:'Staff of Homa',                   type:'Polearm',  rarity:5, domainMat:'aerosiderite'},
  {id:'primordial_jade_winged-spear',  name:'Primordial Jade Winged-Spear',    type:'Polearm',  rarity:5, domainMat:'guyun'},
  {id:'calamity_queller',              name:'Calamity Queller',                type:'Polearm',  rarity:5, domainMat:'narukami'},
  {id:'crimson_moons_semblance',       name:"Crimson Moon's Semblance",        type:'Polearm',  rarity:5, domainMat:'broken_goblet'},
  {id:'bloodsoaked_ruins',             name:'Bloodsoaked Ruins',               type:'Polearm',  rarity:5, domainMat:'artful_device'},
  {id:'staff_of_the_scarlet_sands',   name:'Staff of the Scarlet Sands',      type:'Polearm',  rarity:5, domainMat:'oasis_garden'},
  {id:'vortex_vanquisher',             name:'Vortex Vanquisher',               type:'Polearm',  rarity:5, domainMat:'guyun'},
  {id:'skyward_spine',                 name:'Skyward Spine',                   type:'Polearm',  rarity:5, domainMat:'decarabian'},
  {id:'lumidouce_elegy',               name:'Lumidouce Elegy',                 type:'Polearm',  rarity:5, domainMat:'broken_goblet'},
  {id:'sacrificers_staff',             name:"Sacrificer's Staff",              type:'Polearm',  rarity:5, domainMat:'far_north'},
  // ── 4★ Polearms ──
  {id:'the_catch',                     name:'The Catch',                       type:'Polearm',  rarity:4, domainMat:'distant_sea'},
  {id:'dragons_bane',                  name:"Dragon's Bane",                   type:'Polearm',  rarity:4, domainMat:'aerosiderite'},
  {id:'deathmatch',                    name:'Deathmatch',                      type:'Polearm',  rarity:4, domainMat:'boreal_wolf'},
  {id:'favonius_lance',                name:'Favonius Lance',                  type:'Polearm',  rarity:4, domainMat:'dandelion_gladiator'},
  {id:'blackcliff_pole',               name:'Blackcliff Pole',                 type:'Polearm',  rarity:4, domainMat:'aerosiderite'},
  {id:'lithic_spear',                  name:'Lithic Spear',                    type:'Polearm',  rarity:4, domainMat:'guyun'},
  {id:'kitain_cross_spear',            name:'Kitain Cross Spear',              type:'Polearm',  rarity:4, domainMat:'kijin'},
  {id:'wavebreakers_fin',              name:"Wavebreaker's Fin",               type:'Polearm',  rarity:4, domainMat:'distant_sea'},
  {id:'moonpiercer',                   name:'Moonpiercer',                     type:'Polearm',  rarity:4, domainMat:'forest_dew'},
  {id:'missive_windspear',             name:'Missive Windspear',               type:'Polearm',  rarity:4, domainMat:'copper_talisman'},
  {id:'ballad_of_the_fjords',          name:'Ballad of the Fjords',            type:'Polearm',  rarity:4, domainMat:'talisman_soldier'},
  {id:'rightful_reward',               name:'Rightful Reward',                 type:'Polearm',  rarity:4, domainMat:'ancient_chord'},
  {id:'dialogues_of_the_desert_sages', name:'Dialogues of the Desert Sages',  type:'Polearm',  rarity:4, domainMat:'oasis_garden'},
  {id:'footprint_of_the_rainbow',      name:'Footprint of the Rainbow',        type:'Polearm',  rarity:4, domainMat:'scorching_might'},
  {id:'prospectors_drill',              name:"Prospector's Drill",              type:'Polearm',  rarity:4, domainMat:'artful_device'},
  {id:'prospectors_shovel',            name:"Prospector's Shovel",             type:'Polearm',  rarity:4, domainMat:'artful_device'},
  // ── 5★ Catalysts ──
  {id:'lost_prayer_to_the_sacred_winds',name:'Lost Prayer to the Sacred Winds',type:'Catalyst', rarity:5, domainMat:'dandelion_gladiator'},
  {id:'memory_of_dust',                name:'Memory of Dust',                  type:'Catalyst', rarity:5, domainMat:'aerosiderite'},
  {id:'skyward_atlas',                 name:'Skyward Atlas',                   type:'Catalyst', rarity:5, domainMat:'dandelion_gladiator'},
  {id:'kaguras_verity',                name:"Kagura's Verity",                 type:'Catalyst', rarity:5, domainMat:'narukami'},
  {id:'a_thousand_floating_dreams',    name:'A Thousand Floating Dreams',      type:'Catalyst', rarity:5, domainMat:'forest_dew'},
  {id:'tome_of_the_eternal_flow',      name:'Tome of the Eternal Flow',        type:'Catalyst', rarity:5, domainMat:'ancient_chord'},
  {id:'surfs_up',                      name:"Surf's Up",                       type:'Catalyst', rarity:5, domainMat:'night_wind'},
  {id:'cashflow_supervision',          name:'Cashflow Supervision',            type:'Catalyst', rarity:5, domainMat:'talisman_soldier'},
  {id:'tulaytullahs_remembrance',      name:"Tulaytullah's Remembrance",       type:'Catalyst', rarity:5, domainMat:'copper_talisman'},
  {id:'jadefalls_splendor',            name:"Jadefall's Splendor",             type:'Catalyst', rarity:5, domainMat:'oasis_garden'},
  {id:'the_widsith',                   name:'The Widsith',                     type:'Catalyst', rarity:4, domainMat:'boreal_wolf'},
  {id:'solar_pearl',                   name:'Solar Pearl',                     type:'Catalyst', rarity:4, domainMat:'aerosiderite'},
  {id:'eye_of_perception',             name:'Eye of Perception',               type:'Catalyst', rarity:4, domainMat:'aerosiderite'},
  {id:'prototype_amber',               name:'Prototype Amber',                 type:'Catalyst', rarity:4, domainMat:'aerosiderite'},
  {id:'sacrificial_fragments',         name:'Sacrificial Fragments',           type:'Catalyst', rarity:4, domainMat:'dandelion_gladiator'},
  {id:'mappa_mare',                    name:'Mappa Mare',                      type:'Catalyst', rarity:4, domainMat:'aerosiderite'},
  {id:'oathsworn_eye',                 name:'Oathsworn Eye',                   type:'Catalyst', rarity:4, domainMat:'narukami'},
  {id:'wandering_evenstar',            name:'Wandering Evenstar',              type:'Catalyst', rarity:4, domainMat:'copper_talisman'},
  {id:'fruit_of_fulfillment',          name:'Fruit of Fulfillment',            type:'Catalyst', rarity:4, domainMat:'oasis_garden'},
  {id:'flowing_purity',                name:'Flowing Purity',                  type:'Catalyst', rarity:4, domainMat:'ancient_chord'},
  {id:'sacrificial_jade',              name:'Sacrificial Jade',                type:'Catalyst', rarity:4, domainMat:'guyun'},
  {id:'ballad_of_the_boundless_blue',  name:'Ballad of the Boundless Blue',    type:'Catalyst', rarity:4, domainMat:'talisman_soldier'},
  {id:'ring_of_yaxche',                name:'Ring of Yaxche',                  type:'Catalyst', rarity:4, domainMat:'blazing_heart'},
  {id:'chain_breaker',                 name:'Chain Breaker',                   type:'Catalyst', rarity:4, domainMat:'night_wind'},
  {id:'reliquary_of_truth',            name:'Reliquary of Truth',              type:'Catalyst', rarity:4, domainMat:'far_north'},
  {id:'dawning_frost',                 name:'Dawning Frost',                   type:'Catalyst', rarity:4, domainMat:'far_north'},
  {id:'favonius_codex',                name:'Favonius Codex',                  type:'Catalyst', rarity:4, domainMat:'dandelion_gladiator'},
  // ── 5★ Bows ──
  {id:'polar_star',                    name:'Polar Star',                      type:'Bow',      rarity:5, domainMat:'narukami'},
  {id:'thundering_pulse',              name:'Thundering Pulse',                type:'Bow',      rarity:5, domainMat:'narukami'},
  {id:'hunters_path',                  name:"Hunter's Path",                   type:'Bow',      rarity:5, domainMat:'forest_dew'},
  {id:'the_first_great_magic',         name:'The First Great Magic',           type:'Bow',      rarity:5, domainMat:'talisman_soldier'},
  {id:'silvershower_heartstrings',      name:'Silvershower Heartstrings',       type:'Bow',      rarity:5, domainMat:'scorching_might'},
  {id:'aqua_simulacra',                name:'Aqua Simulacra',                  type:'Bow',      rarity:5, domainMat:'broken_goblet'},
  {id:'elegy_for_the_end',             name:'Elegy for the End',               type:'Bow',      rarity:5, domainMat:'dandelion_gladiator'},
  {id:'skyward_harp',                  name:'Skyward Harp',                    type:'Bow',      rarity:5, domainMat:'dandelion_gladiator'},
  {id:'amos_bow',                      name:"Amos' Bow",                       type:'Bow',      rarity:5, domainMat:'dandelion_gladiator'},
  {id:'athame_artis',                  name:'Athame Artis',                    type:'Bow',      rarity:5, domainMat:'long_night'},
  // ── 4★ Bows ──
  {id:'rust',                          name:'Rust',                            type:'Bow',      rarity:4, domainMat:'aerosiderite'},
  {id:'the_stringless',                name:'The Stringless',                  type:'Bow',      rarity:4, domainMat:'dandelion_gladiator'},
  {id:'favonius_warbow',               name:'Favonius Warbow',                 type:'Bow',      rarity:4, domainMat:'dandelion_gladiator'},
  {id:'sacrificial_bow',               name:'Sacrificial Bow',                 type:'Bow',      rarity:4, domainMat:'dandelion_gladiator'},
  {id:'blackcliff_warbow',             name:'Blackcliff Warbow',               type:'Bow',      rarity:4, domainMat:'aerosiderite'},
  {id:'prototype_crescent',            name:'Prototype Crescent',              type:'Bow',      rarity:4, domainMat:'aerosiderite'},
  {id:'hamayumi',                      name:'Hamayumi',                        type:'Bow',      rarity:4, domainMat:'narukami'},
  {id:'windblume_ode',                 name:'Windblume Ode',                   type:'Bow',      rarity:4, domainMat:'dandelion_gladiator'},
  {id:'alley_hunter',                  name:'Alley Hunter',                    type:'Bow',      rarity:4, domainMat:'boreal_wolf'},
  {id:'fading_twilight',               name:'Fading Twilight',                 type:'Bow',      rarity:4, domainMat:'distant_sea'},
  {id:'scion_of_the_blazing_sun',      name:'Scion of the Blazing Sun',        type:'Bow',      rarity:4, domainMat:'oasis_garden'},
  {id:'end_of_the_line',               name:'End of the Line',                 type:'Bow',      rarity:4, domainMat:'scorching_might'},
  {id:'ibis_piercer',                  name:'Ibis Piercer',                    type:'Bow',      rarity:4, domainMat:'oasis_garden'},
  {id:'range_gauge',                   name:'Range Gauge',                     type:'Bow',      rarity:4, domainMat:'blazing_heart'},
]

// ─── CHARACTERS ───────────────────────────────────────────────────────────────
// id, name, element, rarity, weaponType, talentBook, weaponMat, region
export const CHARACTERS = [
  // ── Mondstadt ──
  {id:'albedo',       name:'Albedo',          element:'Geo',     rarity:5, weaponType:'Sword',    talentBook:'ballad',      weaponMat:'talisman_soldier', region:'Mondstadt'},
  {id:'amber',        name:'Amber',           element:'Pyro',    rarity:4, weaponType:'Bow',      talentBook:'freedom',     weaponMat:'decarabian',       region:'Mondstadt'},
  {id:'barbara',      name:'Barbara',         element:'Hydro',   rarity:4, weaponType:'Catalyst', talentBook:'freedom',     weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'bennett',      name:'Bennett',         element:'Pyro',    rarity:4, weaponType:'Sword',    talentBook:'resistance',  weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'diluc',        name:'Diluc',           element:'Pyro',    rarity:5, weaponType:'Claymore', talentBook:'resistance',  weaponMat:'decarabian',       region:'Mondstadt'},
  {id:'diona',        name:'Diona',           element:'Cryo',    rarity:4, weaponType:'Bow',      talentBook:'freedom',     weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'eula',         name:'Eula',            element:'Cryo',    rarity:5, weaponType:'Claymore', talentBook:'resistance',  weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'fischl',       name:'Fischl',          element:'Electro', rarity:4, weaponType:'Bow',      talentBook:'ballad',      weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'jean',         name:'Jean',            element:'Anemo',   rarity:5, weaponType:'Sword',    talentBook:'resistance',  weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'kaeya',        name:'Kaeya',           element:'Cryo',    rarity:4, weaponType:'Sword',    talentBook:'ballad',      weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'klee',         name:'Klee',            element:'Pyro',    rarity:5, weaponType:'Catalyst', talentBook:'freedom',     weaponMat:'decarabian',       region:'Mondstadt'},
  {id:'lisa',         name:'Lisa',            element:'Electro', rarity:4, weaponType:'Catalyst', talentBook:'ballad',      weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'mona',         name:'Mona',            element:'Hydro',   rarity:5, weaponType:'Catalyst', talentBook:'resistance',  weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'noelle',       name:'Noelle',          element:'Geo',     rarity:4, weaponType:'Claymore', talentBook:'resistance',  weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'razor',        name:'Razor',           element:'Electro', rarity:4, weaponType:'Claymore', talentBook:'resistance',  weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'rosaria',      name:'Rosaria',         element:'Cryo',    rarity:4, weaponType:'Polearm',  talentBook:'ballad',      weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'sucrose',      name:'Sucrose',         element:'Anemo',   rarity:4, weaponType:'Catalyst', talentBook:'freedom',     weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'venti',        name:'Venti',           element:'Anemo',   rarity:5, weaponType:'Bow',      talentBook:'ballad',      weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'traveler_anemo',name:'Traveler (Anemo)',element:'Anemo',   rarity:5, weaponType:'Sword',    talentBook:'freedom',     weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  {id:'varka',         name:'Varka',           element:'Anemo',   rarity:5, weaponType:'Claymore', talentBook:'freedom',     weaponMat:'dandelion_gladiator',region:'Mondstadt'},
  // ── Liyue ──
  {id:'beidou',       name:'Beidou',          element:'Electro', rarity:4, weaponType:'Claymore', talentBook:'gold',        weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'chongyun',     name:'Chongyun',        element:'Cryo',    rarity:4, weaponType:'Claymore', talentBook:'diligence',   weaponMat:'guyun',            region:'Liyue'},
  {id:'ganyu',        name:'Ganyu',           element:'Cryo',    rarity:5, weaponType:'Bow',      talentBook:'diligence',   weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'hu_tao',       name:'Hu Tao',          element:'Pyro',    rarity:5, weaponType:'Polearm',  talentBook:'diligence',   weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'keqing',       name:'Keqing',          element:'Electro', rarity:5, weaponType:'Sword',    talentBook:'prosperity',  weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'ningguang',    name:'Ningguang',       element:'Geo',     rarity:4, weaponType:'Catalyst', talentBook:'prosperity',  weaponMat:'guyun',            region:'Liyue'},
  {id:'qiqi',         name:'Qiqi',            element:'Cryo',    rarity:5, weaponType:'Sword',    talentBook:'prosperity',  weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'shenhe',       name:'Shenhe',          element:'Cryo',    rarity:5, weaponType:'Polearm',  talentBook:'prosperity',  weaponMat:'guyun',            region:'Liyue'},
  {id:'tartaglia',    name:'Tartaglia',       element:'Hydro',   rarity:5, weaponType:'Bow',      talentBook:'freedom',  weaponMat:'dandelion_gladiator',region:'Liyue'},
  {id:'traveler_geo', name:'Traveler (Geo)',  element:'Geo',     rarity:5, weaponType:'Sword',    talentBook:'ballad',      weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'xiangling',    name:'Xiangling',       element:'Pyro',    rarity:4, weaponType:'Polearm',  talentBook:'diligence',   weaponMat:'mist_veiled',      region:'Liyue'},
  {id:'xiao',         name:'Xiao',            element:'Anemo',   rarity:5, weaponType:'Polearm',  talentBook:'prosperity',  weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'xinyan',       name:'Xinyan',          element:'Pyro',    rarity:4, weaponType:'Claymore', talentBook:'gold',        weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'xingqiu',      name:'Xingqiu',         element:'Hydro',   rarity:4, weaponType:'Sword',    talentBook:'gold',        weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'yanfei',       name:'Yanfei',          element:'Pyro',    rarity:4, weaponType:'Catalyst', talentBook:'gold',        weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'yaoyao',       name:'Yaoyao',          element:'Dendro',  rarity:4, weaponType:'Polearm',  talentBook:'diligence',   weaponMat:'mist_veiled',      region:'Liyue'},
  {id:'yelan',        name:'Yelan',           element:'Hydro',   rarity:5, weaponType:'Bow',      talentBook:'prosperity',  weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'yoimiya',      name:'Yoimiya',         element:'Pyro',    rarity:5, weaponType:'Bow',      talentBook:'diligence',   weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'yun_jin',      name:'Yun Jin',         element:'Geo',     rarity:4, weaponType:'Polearm',  talentBook:'diligence',   weaponMat:'guyun',            region:'Liyue'},
  {id:'zhongli',      name:'Zhongli',         element:'Geo',     rarity:5, weaponType:'Polearm',  talentBook:'gold',        weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'baizhu',       name:'Baizhu',          element:'Dendro',  rarity:5, weaponType:'Catalyst', talentBook:'gold',        weaponMat:'aerosiderite',     region:'Liyue'},
  {id:'gaming',       name:'Gaming',          element:'Pyro',    rarity:4, weaponType:'Claymore', talentBook:'prosperity',   weaponMat:'mist_veiled',      region:'Liyue'},
  {id:'lan_yan',      name:'Lan Yan',         element:'Anemo',   rarity:4, weaponType:'Catalyst', talentBook:'diligence',        weaponMat:'aerosiderite',     region:'Liyue'},
  // ── Inazuma ──
  {id:'arataki_itto', name:'Arataki Itto',    element:'Geo',     rarity:5, weaponType:'Claymore', talentBook:'elegance',    weaponMat:'narukami',         region:'Inazuma'},
  {id:'gorou',        name:'Gorou',           element:'Geo',     rarity:4, weaponType:'Bow',      talentBook:'light',       weaponMat:'narukami',         region:'Inazuma'},
  {id:'heizou',       name:'Heizou',          element:'Anemo',   rarity:4, weaponType:'Catalyst', talentBook:'transience',  weaponMat:'kijin',            region:'Inazuma'},
  {id:'kazuha',       name:'Kazuha',          element:'Anemo',   rarity:5, weaponType:'Sword',    talentBook:'diligence',   weaponMat:'distant_sea',      region:'Inazuma'},
  {id:'ayaka',        name:'Ayaka',           element:'Cryo',    rarity:5, weaponType:'Sword',    talentBook:'elegance',    weaponMat:'narukami',         region:'Inazuma'},
  {id:'ayato',        name:'Ayato',           element:'Hydro',   rarity:5, weaponType:'Sword',    talentBook:'elegance',    weaponMat:'narukami',         region:'Inazuma'},
  {id:'kirara',       name:'Kirara',          element:'Dendro',  rarity:4, weaponType:'Sword',    talentBook:'transience',  weaponMat:'kijin',            region:'Inazuma'},
  {id:'kujou_sara',   name:'Kujou Sara',      element:'Electro', rarity:4, weaponType:'Bow',      talentBook:'elegance',    weaponMat:'narukami',         region:'Inazuma'},
  {id:'kuki_shinobu', name:'Kuki Shinobu',    element:'Electro', rarity:4, weaponType:'Sword',    talentBook:'elegance',    weaponMat:'narukami',         region:'Inazuma'},
  {id:'kokomi',       name:'Kokomi',          element:'Hydro',   rarity:5, weaponType:'Catalyst', talentBook:'transience',  weaponMat:'narukami',         region:'Inazuma'},
  {id:'raiden_shogun',name:'Raiden Shogun',   element:'Electro', rarity:5, weaponType:'Polearm',  talentBook:'light',       weaponMat:'narukami',         region:'Inazuma'},
  {id:'sayu',         name:'Sayu',            element:'Anemo',   rarity:4, weaponType:'Claymore', talentBook:'light',       weaponMat:'narukami',         region:'Inazuma'},
  {id:'thoma',        name:'Thoma',           element:'Pyro',    rarity:4, weaponType:'Polearm',  talentBook:'transience',  weaponMat:'narukami',         region:'Inazuma'},
  {id:'traveler_electro',name:'Traveler (Electro)',element:'Electro',rarity:5,weaponType:'Sword', talentBook:'elegance',    weaponMat:'narukami',         region:'Inazuma'},
  {id:'yae_miko',     name:'Yae Miko',        element:'Electro', rarity:5, weaponType:'Catalyst', talentBook:'light',  weaponMat:'narukami',         region:'Inazuma'},
  // ── Sumeru ──
  {id:'alhaitham',    name:'Alhaitham',        element:'Dendro',  rarity:5, weaponType:'Sword',    talentBook:'ingenuity',   weaponMat:'copper_talisman',  region:'Sumeru'},
  {id:'candace',      name:'Candace',          element:'Hydro',   rarity:4, weaponType:'Polearm',  talentBook:'admonition',      weaponMat:'oasis_garden',     region:'Sumeru'},
  {id:'collei',       name:'Collei',           element:'Dendro',  rarity:4, weaponType:'Bow',      talentBook:'praxis',      weaponMat:'forest_dew',       region:'Sumeru'},
  {id:'cyno',         name:'Cyno',             element:'Electro', rarity:5, weaponType:'Polearm',  talentBook:'admonition',  weaponMat:'oasis_garden',     region:'Sumeru'},
  {id:'dehya',        name:'Dehya',            element:'Pyro',    rarity:5, weaponType:'Claymore', talentBook:'praxis',   weaponMat:'oasis_garden',     region:'Sumeru'},
  {id:'dori',         name:'Dori',             element:'Electro', rarity:4, weaponType:'Claymore', talentBook:'ingenuity',   weaponMat:'copper_talisman',  region:'Sumeru'},
  {id:'faruzan',      name:'Faruzan',          element:'Anemo',   rarity:4, weaponType:'Bow',      talentBook:'admonition',  weaponMat:'copper_talisman',  region:'Sumeru'},
  {id:'kaveh',        name:'Kaveh',            element:'Dendro',  rarity:4, weaponType:'Claymore', talentBook:'ingenuity',   weaponMat:'forest_dew',       region:'Sumeru'},
  {id:'layla',        name:'Layla',            element:'Cryo',    rarity:4, weaponType:'Sword',    talentBook:'ingenuity',   weaponMat:'forest_dew',       region:'Sumeru'},
  {id:'mika',         name:'Mika',             element:'Cryo',    rarity:4, weaponType:'Polearm',  talentBook:'ballad',      weaponMat:'dandelion_gladiator',region:'Sumeru'},
  {id:'nahida',       name:'Nahida',           element:'Dendro',  rarity:5, weaponType:'Catalyst', talentBook:'ingenuity',   weaponMat:'forest_dew',       region:'Sumeru'},
  {id:'nilou',        name:'Nilou',            element:'Hydro',   rarity:5, weaponType:'Sword',    talentBook:'praxis',      weaponMat:'copper_talisman',  region:'Sumeru'},
  {id:'sethos',       name:'Sethos',           element:'Electro', rarity:4, weaponType:'Bow',      talentBook:'praxis',  weaponMat:'oasis_garden',     region:'Sumeru'},
  {id:'tighnari',     name:'Tighnari',         element:'Dendro',  rarity:5, weaponType:'Bow',      talentBook:'admonition',  weaponMat:'copper_talisman',  region:'Sumeru'},
  {id:'traveler_dendro',name:'Traveler (Dendro)',element:'Dendro', rarity:5, weaponType:'Sword',    talentBook:'admonition',  weaponMat:'copper_talisman',  region:'Sumeru'},
  {id:'wanderer',     name:'Wanderer',         element:'Anemo',   rarity:5, weaponType:'Catalyst', talentBook:'praxis',      weaponMat:'narukami',         region:'Sumeru'},
  // ── Fontaine ──
  {id:'arlecchino',   name:'Arlecchino',       element:'Pyro',    rarity:5, weaponType:'Polearm',  talentBook:'order',       weaponMat:'talisman_soldier', region:'Fontaine'},
  {id:'charlotte',    name:'Charlotte',        element:'Cryo',    rarity:4, weaponType:'Catalyst', talentBook:'justice',       weaponMat:'talisman_soldier', region:'Fontaine'},
  {id:'chevreuse',    name:'Chevreuse',        element:'Pyro',    rarity:4, weaponType:'Polearm',  talentBook:'order',     weaponMat:'broken_goblet',    region:'Fontaine'},
  {id:'chiori',       name:'Chiori',           element:'Geo',     rarity:5, weaponType:'Sword',    talentBook:'light',       weaponMat:'talisman_soldier', region:'Fontaine'},
  {id:'clorinde',     name:'Clorinde',         element:'Electro', rarity:5, weaponType:'Sword',    talentBook:'justice',      weaponMat:'talisman_soldier', region:'Fontaine'},
  {id:'emilie',       name:'Emilie',           element:'Dendro',  rarity:5, weaponType:'Polearm',  talentBook:'order',       weaponMat:'ancient_chord',    region:'Fontaine'},
  {id:'escoffier',    name:'Escoffier',        element:'Cryo',    rarity:5, weaponType:'Polearm',  talentBook:'justice',       weaponMat:'ancient_chord',    region:'Fontaine'},

  {id:'freminet',     name:'Freminet',         element:'Cryo',    rarity:4, weaponType:'Claymore', talentBook:'justice',     weaponMat:'broken_goblet',    region:'Fontaine'},
  {id:'furina',       name:'Furina',           element:'Hydro',   rarity:5, weaponType:'Sword',    talentBook:'justice',     weaponMat:'talisman_soldier', region:'Fontaine'},
  {id:'lynette',      name:'Lynette',          element:'Anemo',   rarity:4, weaponType:'Sword',    talentBook:'order',       weaponMat:'broken_goblet',    region:'Fontaine'},
  {id:'lyney',        name:'Lyney',            element:'Pyro',    rarity:5, weaponType:'Bow',      talentBook:'equity',      weaponMat:'talisman_soldier', region:'Fontaine'},
  {id:'navia',        name:'Navia',            element:'Geo',     rarity:5, weaponType:'Claymore', talentBook:'equity',      weaponMat:'broken_goblet',    region:'Fontaine'},
  {id:'neuvillette',  name:'Neuvillette',      element:'Hydro',   rarity:5, weaponType:'Catalyst', talentBook:'equity',      weaponMat:'broken_goblet',    region:'Fontaine'},
  {id:'sigewinne',    name:'Sigewinne',        element:'Hydro',   rarity:5, weaponType:'Bow',      talentBook:'equity',     weaponMat:'talisman_soldier', region:'Fontaine'},
  {id:'traveler_hydro',name:'Traveler (Hydro)', element:'Hydro',  rarity:5, weaponType:'Sword',    talentBook:'justice',     weaponMat:'talisman_soldier', region:'Fontaine'},
  {id:'wriothesley',  name:'Wriothesley',      element:'Cryo',    rarity:5, weaponType:'Catalyst', talentBook:'order',       weaponMat:'talisman_soldier', region:'Fontaine'},
  {id:'xianyun',      name:'Xianyun',          element:'Anemo',   rarity:5, weaponType:'Catalyst', talentBook:'gold',   weaponMat:'mist_veiled',      region:'Fontaine'},
  // ── Natlan ──
  {id:'chasca',       name:'Chasca',           element:'Anemo',   rarity:5, weaponType:'Bow',      talentBook:'conflict',  weaponMat:'night_wind',       region:'Natlan'},
  {id:'citlali',      name:'Citlali',          element:'Cryo',    rarity:5, weaponType:'Catalyst', talentBook:'kindling',    weaponMat:'blazing_heart',    region:'Natlan'},
  {id:'iansan',       name:'Iansan',           element:'Electro', rarity:4, weaponType:'Polearm',  talentBook:'contention',    weaponMat:'scorching_might',  region:'Natlan'},
  {id:'ifa',          name:'Ifa',              element:'Anemo',   rarity:4, weaponType:'Catalyst', talentBook:'conflict',    weaponMat:'night_wind',       region:'Natlan'},
  {id:'kachina',      name:'Kachina',          element:'Geo',     rarity:4, weaponType:'Polearm',  talentBook:'conflict',    weaponMat:'scorching_might',  region:'Natlan'},
  {id:'kinich',       name:'Kinich',           element:'Dendro',  rarity:5, weaponType:'Claymore', talentBook:'kindling',    weaponMat:'scorching_might',  region:'Natlan'},
  {id:'mavuika',      name:'Mavuika',          element:'Pyro',    rarity:5, weaponType:'Claymore', talentBook:'contention',    weaponMat:'scorching_might',  region:'Natlan'},
  {id:'mualani',      name:'Mualani',          element:'Hydro',   rarity:5, weaponType:'Catalyst', talentBook:'contention',  weaponMat:'night_wind',       region:'Natlan'},
  {id:'ororon',       name:'Ororon',           element:'Electro', rarity:4, weaponType:'Bow',      talentBook:'kindling',  weaponMat:'night_wind',       region:'Natlan'},
  {id:'traveler_pyro',name:'Traveler (Pyro)',  element:'Pyro',    rarity:5, weaponType:'Sword',    talentBook:'conflict',    weaponMat:'scorching_might',  region:'Natlan'},
  {id:'varesa',       name:'Varesa',           element:'Electro', rarity:5, weaponType:'Catalyst', talentBook:'conflict',  weaponMat:'night_wind',       region:'Natlan'},
  {id:'xilonen',      name:'Xilonen',          element:'Geo',     rarity:5, weaponType:'Sword',    talentBook:'kindling',    weaponMat:'blazing_heart',    region:'Natlan'},
  // ── Nod-Krai ──
  {id:'mizuki',       name:'Mizuki',           element:'Anemo',   rarity:5, weaponType:'Catalyst', talentBook:'transience',   weaponMat:'artful_device',    region:'Nod-Krai'},
  {id:'columbina',    name:'Columbina',        element:'Cryo',    rarity:5, weaponType:'Bow',      talentBook:'moonlight',     weaponMat:'far_north',        region:'Nod-Krai'},
  {id:'zibai',        name:'Zibai',            element:'Cryo',    rarity:5, weaponType:'Sword',    talentBook:'vagrancy',    weaponMat:'long_night',       region:'Nod-Krai'},
  {id:'illuga',       name:'Illuga',           element:'Electro', rarity:5, weaponType:'Claymore', talentBook:'elysium',     weaponMat:'artful_device',    region:'Nod-Krai'},
  {id:'skirk',        name:'Skirk',            element:'Cryo',    rarity:5, weaponType:'Sword',    talentBook:'contention',    weaponMat:'long_night',       region:'Nod-Krai'},
  {id:'ineffa',       name:'Ineffa',           element:'Electro', rarity:5, weaponType:'Polearm',  talentBook:'conflict',    weaponMat:'scorching_might',  region:'Nod-Krai'},
  {id:'aino',         name:'Aino',             element:'Hydro',   rarity:4, weaponType:'Claymore', talentBook:'elysium',     weaponMat:'far_north',        region:'Nod-Krai'},
  {id:'flins',        name:'Flins',            element:'Electro', rarity:5, weaponType:'Polearm',  talentBook:'vagrancy',    weaponMat:'long_night',       region:'Nod-Krai'},
  {id:'lauma',        name:'Lauma',            element:'Dendro',  rarity:5, weaponType:'Catalyst', talentBook:'moonlight',   weaponMat:'artful_device',    region:'Nod-Krai'},
  {id:'nefer',        name:'Nefer',            element:'Hydro',   rarity:5, weaponType:'Catalyst', talentBook:'elysium',     weaponMat:'far_north',        region:'Nod-Krai'},
  {id:'jahoda',       name:'Jahoda',           element:'Pyro',    rarity:4, weaponType:'Sword',    talentBook:'vagrancy',    weaponMat:'long_night',       region:'Nod-Krai'},
  {id:'dahlia',       name:'Dahlia',           element:'Cryo',    rarity:5, weaponType:'Sword',    talentBook:'vagrancy',    weaponMat:'long_night',       region:'Nod-Krai'},
  // ── Special / Mondstadt (Durin) ──
  {id:'durin',        name:'Durin',            element:'Pyro',    rarity:5, weaponType:'Sword',    talentBook:'ballad',      weaponMat:'decarabian',       region:'Mondstadt'},
]

// ─── ARTIFACT SETS ────────────────────────────────────────────────────────────
// enkaId: verified game set IDs from icy-veins.com/genshin-impact/artifacts/{id}
// Image: https://enka.network/ui/UI_RelicIcon_{enkaId}_1.png  (1 = flower of life)
export const ARTIFACT_SETS = [
  {id:'none', name:'None', enkaId:null, bonus2:'', bonus4:''},

  // ── Mondstadt / World Drop ──
  {id:'gladiators_finale',     name:"Gladiator's Finale",      enkaId:15001, bonus2:'ATK +18%', bonus4:'Normal Attack DMG +35% for Sword/Claymore/Polearm users'},
  {id:'wanderers_troupe',      name:"Wanderer's Troupe",        enkaId:15002, bonus2:'Elemental Mastery +80', bonus4:'Charged Attack DMG +35% for Catalyst/Bow users'},
  {id:'thundering_fury',       name:'Thundering Fury',          enkaId:15003, bonus2:'Electro DMG +15%', bonus4:'Overloaded/Electro-Charged/Superconduct/Hyperbloom DMG +40%; Skill CD -1s on reaction'},
  {id:'thundersoother',        name:'Thundersoother',           enkaId:15004, bonus2:'Electro RES +40%', bonus4:'DMG +35% vs Electro-affected enemies'},
  {id:'lavawalker',            name:'Lavawalker',               enkaId:15005, bonus2:'Pyro RES +40%', bonus4:'DMG +35% vs Pyro-affected enemies'},
  {id:'crimson_witch_of_flames',name:'Crimson Witch of Flames', enkaId:15006, bonus2:'Pyro DMG +15%', bonus4:'Overloaded/Burning/Burgeon +40%; Vaporize/Melt +15%; Skill use stacks 2pc by 50% (max 3)'},
  {id:'maiden_beloved',        name:'Maiden Beloved',           enkaId:15007, bonus2:'Healing Effectiveness +15%', bonus4:'Skill/Burst use: all party healing received +20% for 10s'},
  {id:'viridescent_venerer',   name:'Viridescent Venerer',      enkaId:15008, bonus2:'Anemo DMG +15%', bonus4:'Swirl DMG +60%; Swirl reduces opponent RES to that element by 40% for 10s'},
  {id:'noblesse_oblige',       name:'Noblesse Oblige',          enkaId:15009, bonus2:'Elemental Burst DMG +20%', bonus4:'After Burst, party ATK +20% for 12s'},
  {id:'bloodstained_chivalry', name:'Bloodstained Chivalry',    enkaId:15010, bonus2:'Physical DMG +25%', bonus4:'After kill: Charged Attack DMG +50%, 0 Stamina cost for 10s'},
  {id:'archaic_petra',         name:'Archaic Petra',            enkaId:15011, bonus2:'Geo DMG +15%', bonus4:'Crystallize shard pickup grants party 35% DMG Bonus of that element for 10s'},
  {id:'retracing_bolide',      name:'Retracing Bolide',         enkaId:15012, bonus2:'Shield Strength +35%', bonus4:'While shielded: Normal and Charged Attack DMG +40%'},
  {id:'blizzard_strayer',      name:'Blizzard Strayer',         enkaId:15013, bonus2:'Cryo DMG +15%', bonus4:'CRIT Rate +20% vs Cryo-affected enemies; +40% if Frozen'},
  {id:'heart_of_depth',        name:'Heart of Depth',           enkaId:15014, bonus2:'Hydro DMG +15%', bonus4:'After Elemental Skill, Normal and Charged Attack DMG +30% for 15s'},
  {id:'tenacity_of_the_millelith',name:'Tenacity of the Millelith',enkaId:15015, bonus2:'HP +20%', bonus4:'Skill hit: party ATK +20% and Shield Strength +30% for 3s'},
  {id:'pale_flame',            name:'Pale Flame',               enkaId:15016, bonus2:'Physical DMG +25%', bonus4:'Skill hit: ATK +9% for 7s (max 2 stacks); at 2 stacks 2pc effect doubled'},

  // ── Inazuma ──
  {id:'shimenawas_reminiscence',name:"Shimenawa's Reminiscence",enkaId:15019, bonus2:'ATK +18%', bonus4:'Skill cast costs 15 Energy: Normal/Charged/Plunging ATK DMG +50% for 10s'},
  {id:'emblem_of_severed_fate',name:'Emblem of Severed Fate',   enkaId:15020, bonus2:'Energy Recharge +20%', bonus4:'Burst DMG +25% of Energy Recharge (max +75%)'},

  // ── Liyue (post-Inazuma) ──
  {id:'husk_of_opulent_dreams',name:'Husk of Opulent Dreams',   enkaId:15021, bonus2:'DEF +30%', bonus4:'Curiosity stacks (max 4): each gives +6% DEF and +6% Geo DMG'},
  {id:'ocean-hued_clam',       name:'Ocean-Hued Clam',          enkaId:15022, bonus2:'Healing Bonus +15%', bonus4:'Healing creates Foam that explodes for 90% of HP healed (max 30,000 HP)'},
  {id:'vermillion_hereafter',  name:'Vermillion Hereafter',      enkaId:15023, bonus2:'ATK +18%', bonus4:'After Burst: ATK +8% per second (max 4 stacks; each lasts independently)'},
  {id:'echoes_of_an_offering', name:'Echoes of an Offering',    enkaId:15024, bonus2:'ATK +18%', bonus4:'36% chance Normal Attack triggers Valley Rite (+70% ATK DMG); odds increase on miss'},

  // ── Sumeru ──
  {id:'deepwood_memories',     name:'Deepwood Memories',        enkaId:15025, bonus2:'Dendro DMG +15%', bonus4:'Skill/Burst hit: Dendro RES -30% for 8s'},
  {id:'gilded_dreams',         name:'Gilded Dreams',            enkaId:15026, bonus2:'Elemental Mastery +80', bonus4:'On reaction: ATK +14% per same-element party member; EM +50 per different element (max 3 each)'},
  {id:'desert_pavilion_chronicle',name:'Desert Pavilion Chronicle',enkaId:15027, bonus2:'Anemo DMG +15%', bonus4:'Charged Attack hit: Normal ATK speed +10%; Normal/Charged/Plunging DMG +40% for 15s'},
  {id:'flower_of_paradise_lost',name:'Flower of Paradise Lost', enkaId:15028, bonus2:'Elemental Mastery +80', bonus4:'Bloom/Hyperbloom/Burgeon DMG +40%; each trigger stacks +25% (max 4)'},
  {id:'nymphs_dream',          name:"Nymph's Dream",            enkaId:15029, bonus2:'Hydro DMG +15%', bonus4:'Mirrored Nymph stacks (1/2/3+): ATK +7/16/25% and Hydro DMG +4/9/15%'},
  {id:'vourukashas_glow',      name:"Vourukasha's Glow",        enkaId:15030, bonus2:'HP +20%', bonus4:'Skill/Burst DMG +10% per Bond of Life stack (max 5)'},

  // ── Fontaine ──
  {id:'marechaussee_hunter',   name:'Marechaussee Hunter',      enkaId:15031, bonus2:'Normal and Charged Attack DMG +15%', bonus4:'HP change: CRIT Rate +12% for 5s (max 3 stacks)'},
  {id:'golden_troupe',         name:'Golden Troupe',            enkaId:15032, bonus2:'Elemental Skill DMG +20%', bonus4:'Skill DMG +25%; when off-field Skill DMG +25% more (clears 2s after taking field)'},
  {id:'song_of_days_past',     name:'Song of Days Past',        enkaId:15033, bonus2:'Healing Bonus +15%', bonus4:'Healing creates Yearning record; on expiry, active character DMG +8% per healing (max 5 hits)'},
  {id:'nighttime_whispers_in_the_echoing_woods',name:'Nighttime Whispers in the Echoing Woods',enkaId:15034, bonus2:'ATK +18%', bonus4:'After Skill, Geo DMG +20% for 10s; with Crystallize shield effect ×2.5'},
  {id:'fragment_of_harmonic_whimsy',name:'Fragment of Harmonic Whimsy',enkaId:15035, bonus2:'ATK +18%', bonus4:'Bond of Life change: DMG +18% for 6s (max 3 stacks)'},
  {id:'unfinished_reverie',    name:'Unfinished Reverie',       enkaId:15036, bonus2:'ATK +18%', bonus4:'Out of combat: DMG +50%; in combat with no Burning nearby DMG drops; Burning nearby restores it'},

  // ── Natlan ──
  {id:'scroll_of_the_hero_of_cinder_city',name:"Scroll of the Hero of Cinder City",enkaId:15037, bonus2:'Nearby Nightsoul Burst: regenerate 6 Energy', bonus4:'Reaction trigger: party +12% Elemental DMG for 15s; in Nightsoul Blessing +28% more for 20s'},
  {id:'obsidian_codex',        name:'Obsidian Codex',           enkaId:15038, bonus2:'In Nightsoul\'s Blessing on-field: DMG +15%', bonus4:'Consuming Nightsoul point: CRIT Rate +40% for 6s (once/s)'},
  {id:'long_nights_oath',      name:"Long Night's Oath",        enkaId:15039, bonus2:'Plunging Attack DMG +25%', bonus4:'Radiance Everlasting stacks from Plunge/Charged/Skill: Plunge DMG +15% per stack (max 5)'},
  {id:'finale_of_the_deep',    name:'Finale of the Deep Galleries',enkaId:15040, bonus2:'Cryo DMG +15%', bonus4:'At 0 Energy: Normal Attack DMG +60% and Burst DMG +60% (each cancels the other for 6s)'},

  // ── Nod-Krai ──
  {id:'night_of_the_skys_unveiling',name:"Night of the Sky's Unveiling",enkaId:15041, bonus2:'Elemental Mastery +80', bonus4:'Party Lunar Reactions: CRIT Rate +15/30% based on Moonsign; Lunar DMG +10% per Gleaming Moon stack'},
  {id:'silken_moon_serenade',  name:"Silken Moon's Serenade",   enkaId:15042, bonus2:'Energy Recharge +20%', bonus4:'On Elemental DMG: party EM +60/120 based on Moonsign; Lunar DMG +10% per Gleaming Moon stack'},
  {id:'aubade_of_morningstar_and_moon',name:'Aubade of Morningstar and Moon',enkaId:15043, bonus2:'Elemental Mastery +80', bonus4:'Off-field: Lunar Reaction DMG +20%; at Ascendant Gleam +40% more; disappears 3s after taking field'},
  {id:'a_day_carved_from_rising_winds',name:'A Day Carved from Rising Winds',enkaId:15044, bonus2:'ATK +18%', bonus4:'On Normal/Charged/Skill/Burst hit: ATK +25% for 6s (upgradeable to Resolve of Pastoral Winds)'},
]
// Flower of Life piece = _1 in enka.network UI_RelicIcon naming
// paimon-moe has confirmed images for sets up through Sumeru (≤15030)
// Newer sets fall back to enka.network
const PAIMON_ARTIFACT_SLUGS = {
  15001:'gladiators_finale', 15002:'wanderers_troupe', 15003:'thundering_fury',
  15004:'thundersoother', 15005:'lavawalker', 15006:'crimson_witch_of_flames',
  15007:'maiden_beloved', 15008:'viridescent_venerer', 15009:'noblesse_oblige',
  15010:'bloodstained_chivalry', 15011:'archaic_petra', 15012:'retracing_bolide',
  15013:'blizzard_strayer', 15014:'heart_of_depth', 15015:'tenacity_of_the_millelith',
  15016:'pale_flame', 15019:'shimenawas_reminiscence', 15020:'emblem_of_severed_fate',
  15021:'husk_of_opulent_dreams', 15022:'ocean-hued_clam', 15023:'vermillion_hereafter',
  15024:'echoes_of_an_offering', 15025:'deepwood_memories', 15026:'gilded_dreams',
  15027:'desert_pavilion_chronicle', 15028:'flower_of_paradise_lost',
  15029:'nymphs_dream', 15030:'vourukashas_glow',
}
export const artifactIcon = (enkaId) => {
  if (!enkaId) return null
  const slug = PAIMON_ARTIFACT_SLUGS[enkaId]
  if (slug) return `https://paimon.moe/images/artifacts/${slug}_flower.png`
  return `https://enka.network/ui/UI_RelicIcon_${enkaId}_1.png`
}
