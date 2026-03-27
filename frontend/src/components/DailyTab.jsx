import React, { useState, useEffect } from 'react'
import { CHARACTERS, ELEMENTS, TALENT_DOMAINS, WEAPON_DOMAINS, TALENT_BOOKS, WEAPON_MATS, WEAPONS, WEEKLY_BOSSES_INFO, charIcon } from '../data/gameData.js'
import { CharCard } from './CharactersTab.jsx'

// ── helpers ──────────────────────────────────────────────────────────────────
const ls = k => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } }
const getWeaponLevel = (weaponId) => {
  if (!weaponId) return 0
  const raw = ls('tv_weapons_owned')
  if (!raw) return 0
  if (Array.isArray(raw)) return raw.includes(weaponId) ? 1 : 0
  return raw[weaponId]?.level || 0
}
const lss = (k,v) => localStorage.setItem(k, JSON.stringify(v))
const todayKey  = () => new Date().toISOString().slice(0,10)
const weekKey   = () => { const d=new Date(); const m=new Date(d); m.setDate(d.getDate()-((d.getDay()+6)%7)); return m.toISOString().slice(0,10) }
const monthKey  = () => new Date().toISOString().slice(0,7)
const fmtTimer  = ts => { if(!ts) return null; const d=ts*1000-Date.now(); if(d<=0) return 'Ended'; const days=Math.floor(d/86400000); const h=Math.floor((d%86400000)/3600000); return days>0?`${days}d ${h}h`:`${h}h left` }
const dayOfWeek = () => new Date().getDay() // 0=Sun

const W_GI = 'https://static.wikia.nocookie.net/gensin-impact/images'
const SvgExpedition = ()=>(
  <svg viewBox="0 0 28 28" width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Map panels */}
    <path d="M3 6 L10 4 L10 22 L3 24 Z" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M10 4 L18 7 L18 25 L10 22 Z" fill="currentColor" opacity="0.55" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M18 7 L25 4 L25 22 L18 25 Z" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    {/* Fold lines */}
    <line x1="10" y1="4" x2="10" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.8"/>
    <line x1="18" y1="7" x2="18" y2="25" stroke="currentColor" strokeWidth="1.5" opacity="0.8"/>
    {/* Location pin */}
    <circle cx="14" cy="12" r="2.5" fill="currentColor"/>
    <path d="M14 14.8 C11.5 17.5 10.5 19 10.5 20.2 a3.5 3.5 0 0 0 7 0 C17.5 19 16.5 17.5 14 14.8z" fill="currentColor"/>
  </svg>
)

const DAILY_TASKS = [
  {id:'expedition',  label:'Claim Expeditions',                   svg:<SvgExpedition/>},
  {id:'bp',          label:'Battle Pass Quests',                  icon:`${W_GI}/e/e4/System_Battle_Pass.png/revision/latest?cb=20210911040750`},
  {id:'teapot_cur',  label:'Teapot: Claim Currency & Friendship', icon:`${W_GI}/e/e8/System_Serenitea_Pot.png/revision/latest?cb=20210911040805`},
  {id:'commissions', label:'Daily Commissions',                   icon:'https://static.wikia.nocookie.net/gensin-impact/images/6/62/Icon_Commission.svg/revision/latest?cb=20201127234019', badge:'×4'},
  {id:'hoyolab',     label:'Sign in to Hoyolab',                  icon:'https://static.wikia.nocookie.net/zenless-zone-zero/images/f/f4/HoYoLAB.png/revision/latest/thumbnail/width/360/height/360?cb=20220728090715'},
  {id:'groceries',   label:'Buy Milk, Wheat & Meat',              icon:`${W_GI}/3/37/Item_Milk.png/revision/latest?cb=20210109223702`},
]
const PM = 'https://paimon.moe/images'
const W  = 'https://static.wikia.nocookie.net/gensin-impact/images'
const REGION_COLORS = {
  'Mondstadt': '#7ec8e3',
  'Liyue':     '#f5c518',
  'Inazuma':   '#c084fc',
  'Sumeru':    '#4ade80',
  'Fontaine':  '#60a5fa',
  'Natlan':    '#fb923c',
  'Nod-Krai':  '#94a3b8',
}
const WEEKLY_BOSSES_FULL = [
  // ── Mondstadt ──
  {id:'w_dvalin',    label:'Stormterror',               region:'Mondstadt', sub:"Stormterror's Lair",              icon:'https://static.wikia.nocookie.net/gensin-impact/images/8/8f/Stormterror_Icon.png'},
  {id:'w_wolf',      label:'Andrius',                   region:'Mondstadt', sub:'Wolvendom',                       icon:`${W}/a/a4/Andrius_Icon.png`},
  {id:'w_nod_krai',  label:'The Game Before the Gate',  region:'Mondstadt', sub:'Falcon Coast',                    icon:'https://static.wikia.nocookie.net/gensin-impact/images/f/f1/The_Game_Before_the_Gate_Icon.png/revision/latest?cb=20250507021624'},
  // ── Liyue ──
  {id:'w_childe',    label:'Tartaglia',                 region:'Liyue',     sub:'Golden House',                    icon:`${W}/d/d9/Childe_P3_Icon.png`},
  {id:'w_azhdaha',   label:'Azhdaha',                   region:'Liyue',     sub:'Mt. Hulao',                       icon:`${W}/1/18/Enemy_Azhdaha.png`},
  // ── Inazuma ──
  {id:'w_signora',   label:'La Signora',                region:'Inazuma',   sub:'Inazuma City',                    icon:`${W}/5/57/NPC_Signora_Icon.png`},
  {id:'w_raiden',    label:'Raiden Shogun',             region:'Inazuma',   sub:'Grand Narukami Shrine',           icon:`${PM}/characters/raiden_shogun.png`},
  // ── Sumeru ──
  {id:'w_scaramouche',label:'Scaramouche',              region:'Sumeru',    sub:'Chinvat Ravine',                  icon:`${PM}/characters/wanderer.png`},
  {id:'w_apep',      label:"Guardian of Apep's Oasis", region:'Sumeru',    sub:'Desert of Hadramaveth',           icon:'https://static.wikia.nocookie.net/gensin-impact/images/e/e2/Guardian_of_Apep%27s_Oasis_Icon.png/revision/latest?cb=20230412020920'},
  // ── Fontaine ──
  {id:'w_narwhal',   label:'All-Devouring Narwhal',     region:'Fontaine',  sub:'Salacia Plain',                   icon:'https://static.wikia.nocookie.net/gensin-impact/images/4/47/All-Devouring_Narwhal_Icon.png/revision/latest?cb=20231108024357'},
  {id:'w_knave',     label:'The Knave',                 region:'Fontaine',  sub:'Mont Esus East',                  icon:`${PM}/characters/arlecchino.png`},
  // ── Natlan ──
  {id:'w_natlan',    label:'Lord of Eroded Primal Fire', region:'Natlan',   sub:'Stadium of the Sacred Flame',     icon:'https://static.wikia.nocookie.net/gensin-impact/images/7/7e/Lord_of_Eroded_Primal_Fire_Icon.png/revision/latest?cb=20250101020418'},
  // ── Nod-Krai ──
  {id:'w_heretic',   label:'Heretic of the False Moon', region:'Nod-Krai',  sub:'Special Territory Research Institute', icon:'https://static.wikia.nocookie.net/gensin-impact/images/e/ee/Heretic_of_the_False_Moon_Icon.png'},
]
const WEEKLY_NON_BOSS = [
  {id:'w_rep',       label:'Reputation Quests',    icon:'https://static.wikia.nocookie.net/gensin-impact/images/8/8e/System_City_Reputation.png'},
  {id:'w_bounty',    label:'Reputation Bounties',  icon:'https://static.wikia.nocookie.net/gensin-impact/images/8/8e/System_City_Reputation.png'},
  {id:'w_teapot',    label:'Teapot: Transient Resin', icon:'https://static.wikia.nocookie.net/gensin-impact/images/f/f6/Item_Transient_Resin.png'},
  {id:'w_parametric',label:'Parametric Transformer', icon:'https://static.wikia.nocookie.net/gensin-impact/images/f/f1/Item_Parametric_Transformer.png'},
]
// Keep WEEKLY_TASKS for backward compat with storage key
const WEEKLY_TASKS = [
  ...WEEKLY_BOSSES_FULL.map(b=>({id:b.id, label:b.label})),
  ...WEEKLY_NON_BOSS.map(b=>({id:b.id, label:b.label})),
  {id:'w_crystal', label:'Crystal Fly Traps'},
]
const MONTHLY_TASKS = [
  {id:'m_stygian',  label:'Stygian Onslaught',          icon:'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2025/07/14/41133912/b6287b34deb1f4d12e0be0599584cc70_855379148837321239.png'},
  {id:'m_abyss',    label:'Spiral Abyss',               icon:'https://static.wikia.nocookie.net/gensin-impact/images/7/79/Achievement_Domains_and_Spiral_Abyss_Series_I.png'},
  {id:'m_transmute',label:'Artifact Transmutation',     icon:'https://static.wikia.nocookie.net/gensin-impact/images/1/12/Item_Artifact_Transmuter.png'},
]

// ── sub-components ────────────────────────────────────────────────────────────

function Checklist({ title, items, storageKey, periodKey, resetLabel, onChange }) {
  const [checks, setChecks] = useState(() => { const d=ls(storageKey); return (d&&d.key===periodKey)?d.checks||{}:{} })
  const toggle = id => {
    const n={...checks,[id]:!checks[id]}; setChecks(n); lss(storageKey,{key:periodKey,checks:n})
    onChange?.()
  }
  const done = items.filter(t=>checks[t.id]).length
  return (
    <div className="card">
      <div className="stitle" style={{display:'flex',justifyContent:'space-between'}}>
        <span>{title}</span>
        <span style={{color:done===items.length?'rgba(var(--ok),0.9)':'var(--text3)'}}>{done}/{items.length}</span>
      </div>
      <div className="checklist">
        {items.map(t=>(
          <div key={t.id} className={`crow${checks[t.id]?' done':''}`} onClick={()=>toggle(t.id)}>
            <div className="cbox">{checks[t.id]&&'✓'}</div>
            <span className="clabel">{t.label}</span>
            {t.badge&&<span className="cbadge">{t.badge}</span>}
          </div>
        ))}
      </div>
      <div className="reset-note">{resetLabel}</div>
    </div>
  )
}

const PM_FULL = 'https://cdn.jsdelivr.net/gh/MadeBaruna/paimon-moe@main/static/images/characters/full'
const FULL_ART_IDS = {
  kazuha: 'kaedehara_kazuha', ayaka: 'kamisato_ayaka', ayato: 'kamisato_ayato',
  kokomi: 'sangonomiya_kokomi', heizou: 'shikanoin_heizou', mizuki: 'yumemizuki_mizuki',
}
const charFullArt = (rawId) => {
  if (!rawId || typeof rawId !== 'string') return null
  const id = rawId.toLowerCase().replace(/\s+/g,'_')
  if (id.startsWith('traveler')) return `${PM_FULL}/traveler.png`
  return `${PM_FULL}/${FULL_ART_IDS[id] || id}.png`
}

function TeamQuickPicker({ activeTeamId, onTeamSelect }) {
  const teams = ls('tv_teams')||[]
  if(!teams.length) return null
  const activeTeam = (activeTeamId && teams.find(t=>String(t.id)===String(activeTeamId))) || teams[0]
  const trackedChars = ls('tv_chars')||{}
  // First character of active team for the avatar
  const firstCharId = activeTeam?.slots?.find(Boolean)
  const firstCharDef = firstCharId ? CHARACTERS.find(c=>c.id===firstCharId) : null
  const firstCharEl = firstCharDef ? ELEMENTS[firstCharDef.element] : null
  const firstCharIc = firstCharDef ? charIcon(firstCharDef.id) : null

  return (
    <div className="card" style={{marginBottom:12,padding:'10px 12px'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
        <div className="stitle" style={{marginBottom:0,fontSize:'.7rem'}}>Active Team</div>
        <select className="input" value={String(activeTeam?.id||'')} onChange={e=>onTeamSelect(e.target.value)}
          style={{flex:1,fontSize:'.72rem',padding:'2px 6px'}}>
          {teams.map(t=><option key={t.id} value={String(t.id)}>{t.name}</option>)}
        </select>
      </div>
      {firstCharDef && (
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{position:'relative',flexShrink:0}}>
            {firstCharIc
              ? <img src={firstCharIc} alt={firstCharDef.name}
                  style={{width:40,height:40,borderRadius:'50%',objectFit:'cover',
                    border:`2px solid rgba(${firstCharEl?.rgb||'200,169,110'},0.5)`}}
                  onError={e=>{e.target.style.opacity=0}}/>
              : <div style={{width:40,height:40,borderRadius:'50%',background:`rgba(${firstCharEl?.rgb||'200,169,110'},.15)`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {firstCharEl&&<img src={firstCharEl.icon} style={{width:18,height:18}} alt={firstCharDef.element} onError={e=>{e.target.style.display='none'}}/>}
                </div>
            }
          </div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:'.78rem',fontWeight:600,color:'var(--text)',lineHeight:1.2}}>{firstCharDef.name}</div>
            <div style={{display:'flex',alignItems:'center',gap:3,marginTop:2}}>
              {firstCharEl&&<img src={firstCharEl.icon} style={{width:11,height:11}} alt={firstCharDef.element} onError={e=>{e.target.style.display='none'}}/>}
              <span style={{fontSize:'.65rem',color:`rgba(${firstCharEl?.rgb||'200,169,110'},0.85)`}}>{firstCharDef.element}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BannerSidebar({ data }) {
  const [expandedId, setExpandedId] = useState(null)
  if (!data) return <div className="api-load"><div className="spin"/> Loading…</div>
  const banners = (data.banners||[]).filter(b=>b.characters?.length||b.weapons?.length)
  return (
    <div className="banners-sidebar">
      <div className="stitle">Current Banners</div>
      {banners.map(b => {
        const chars = b.characters || []
        const fiveStarWeapons = (b.weapons||[]).filter(w=>w.rarity===5)
        const allItems = [
          ...chars.map(c=>({...c, _type:'char'})),
          ...fiveStarWeapons.map(w=>({...w, _type:'weapon'}))
        ]
        const isExpanded = expandedId === b.id
        const shown = isExpanded ? allItems : allItems.slice(0,4)
        const extra = allItems.length - 4

        const fiveStarChar = chars.find(c=>c.rarity===5)
        const bgChar = fiveStarChar || chars[0]
        const bgSlug = bgChar
          ? (typeof bgChar.id === 'string' && bgChar.id
              ? bgChar.id
              : bgChar.name?.toLowerCase().replace(/[^a-z0-9]+/g,'_'))
          : null
        const bgUrl = bgSlug ? charFullArt(bgSlug) : null

        return (
          <div className="banner-card" key={b.id}>
            {bgUrl && (
              <>
                <div className="banner-card-bg" style={{backgroundImage:`url(${bgUrl})`}}/>
                <div className="banner-card-overlay"/>
              </>
            )}
            <div className="banner-card-content">
              <div className="banner-nm">{b.name}</div>
              <div className="banner-chars">
                {shown.map((item,i)=>{
                  const is5 = item.rarity===5
                  const pillColor = is5 ? 'var(--banner-pill-strong)' : 'var(--banner-pill)'
                  const borderColor = is5 ? 'rgba(var(--five),0.35)' : 'rgba(var(--four),0.3)'
                  return (
                    <div className="banner-row" key={String(item.id??i)}
                      style={{background:pillColor,border:`1px solid ${borderColor}`,borderRadius:8,padding:'4px 8px 4px 4px'}}>
                      <img className={`bicon ${is5?'r5':'r4'}`} src={item.icon} alt={item.name} onError={e=>{e.target.style.display='none'}}/>
                      <div style={{minWidth:0}}>
                        <div className="b-name" style={{color:is5?`rgba(var(--five),1)`:`rgba(var(--four),1)`,textShadow:'0 1px 2px rgba(0,0,0,0.4)'}}>{item.name}</div>
                        <div className="b-el" style={{color:'var(--text3)'}}>{item._type==='weapon' ? '★★★★★ Weapon' : item.element}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {extra > 0 && (
                <span className="banner-expand" onClick={()=>setExpandedId(isExpanded?null:b.id)}>
                  {isExpanded ? '▲ collapse' : `+ ${extra} more`}
                </span>
              )}
              {b.end_time>0 && <div className="b-timer">{fmtTimer(b.end_time)}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Derive paimon-moe event image slug from event name
const PM_EVENTS = 'https://paimon.moe/images/events'
const evImgSlug = (name) => name?.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

// Special image overrides by name pattern
const SPECIAL_ICONS = [
  {
    test: (name) => /abyss/i.test(name),
    img:  'https://static.wikia.nocookie.net/gensin-impact/images/c/ca/Domain_Spiral_Abyss_Abyssal_Moon_Spire.png',
    rename: 'Spiral Abyss',
  },
  {
    test: (name) => /imaginarium\s*the?a?t[eo]r/i.test(name),
    img:  'https://img.game8.co/3921410/51f18f583735fcc5141e83d3f59b9ce1.png/show',
  },
]

function normalizeEvent(ev) {
  let name = ev.name
  let overrideImg = null
  for (const rule of SPECIAL_ICONS) {
    if (rule.test(name)) {
      if (rule.rename) name = rule.rename
      overrideImg = rule.img
      break
    }
  }
  // dismissKey always = original name before any rename, so renames never cause collisions
  const dismissKey = ev._origName || ev.name
  return { ...ev, name, overrideImg, dismissKey }
}

function EventsStrip({ data }) {
  const [dismissed, setDismissed] = useState(()=>ls('tv_ev_dismissed')||[])
  if (!data) return null

  const events     = (data.events||[]).filter(e=>e.name&&e.start_time>0)
  const challenges = data.challenges||[]
  const raw = [...events, ...challenges.map(c=>({...c,_challenge:true}))]
             .map(ev => ({...ev, _origName: ev.name}))

  const normalized = raw.map(normalizeEvent)

  // Deduplicate by normalized name
  const seen = new Set()
  const deduped = normalized.filter(ev => {
    if (seen.has(ev.name)) return false
    seen.add(ev.name)
    return true
  })

  // Only show events that have an image (or special override)
  const withImages = deduped.filter(ev => ev.overrideImg || ev.image_url)

  // User-dismissed filter
  const visible = withImages.filter(ev => !dismissed.includes(ev.dismissKey))

  const dismiss = (ev) => {
    const next = [...dismissed, ev.dismissKey]
    setDismissed(next)
    lss('tv_ev_dismissed', next)
  }
  const restore = () => { setDismissed([]); lss('tv_ev_dismissed', []) }

  // Always render header (even when all dismissed) so Restore button stays accessible
  if (!withImages.length) return null

  return (
    <div style={{overflow:'hidden',width:'100%'}}>
      <div className="stitle" style={{display:'flex',alignItems:'center',gap:8}}>
        Active Events & Challenges
        {dismissed.length > 0 && (
          <button style={{fontSize:'.62rem',color:'var(--text3)',padding:'1px 6px',border:'1px solid var(--border)',borderRadius:4,background:'transparent',cursor:'pointer'}}
            onClick={restore}>
            Restore {dismissed.length} hidden
          </button>
        )}
      </div>
      {visible.length > 0 && (
        <div className="events-strip">
          {visible.map((ev,i)=>{
            const apiImg = ev.overrideImg || ev.image_url || null
            const pmImg  = `${PM_EVENTS}/${evImgSlug(ev.name)}.png`
            return (
              <div className="ev-card" key={ev.dismissKey} style={{position:'relative'}}>
                <button
                  onClick={()=>dismiss(ev)}
                  title="Mark as done / hide"
                  style={{position:'absolute',top:4,right:4,zIndex:2,background:'var(--hover)',border:'none',borderRadius:'50%',
                    width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',
                    cursor:'pointer',color:'var(--text2)',fontSize:'.6rem',lineHeight:1,padding:0}}>
                  ✕
                </button>
                <EvImage apiUrl={apiImg} pmUrl={pmImg} name={ev.name}/>
                <div className="ev-body">
                  <div className="ev-name">{ev.name}</div>
                  {ev.end_time>0 && <div className="ev-timer">{fmtTimer(ev.end_time)}</div>}
                  {ev.special_reward?.name==='Primogem'&&ev.special_reward.amount>0&&(
                    <div className="ev-primos">✦ {ev.special_reward.amount} Primogems</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
function EvImage({ apiUrl, pmUrl, name }) {
  const [stage, setStage] = useState(0) // 0=api, 1=paimon, 2=fallback
  const src = stage===0 ? apiUrl : stage===1 ? pmUrl : null
  if (!src) return (
    <div className="ev-img-ph">
      <span style={{fontSize:'.7rem',fontWeight:600,color:'var(--text2)',textAlign:'center',padding:'0 6px',lineHeight:1.3}}>{name}</span>
    </div>
  )
  return (
    <div className="ev-img-wrap">
      <img className="ev-img" src={src} alt={name}
        onError={()=>setStage(s=>s+1)}/>
    </div>
  )
}


// ── Crystal Fly Timer ────────────────────────────────────────────────────────
const CRYSTAL_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000  // 7 days

function CrystalFlyRow({ checks, toggle, onChange }) {
  const [doneAt, setDoneAt] = useState(()=>{ const v=ls('tv_crystal_ts'); return v?Number(v):null })
  const [now, setNow] = useState(Date.now())
  useEffect(()=>{ const t=setInterval(()=>setNow(Date.now()),60000); return ()=>clearInterval(t) },[])

  const cooldownActive = doneAt ? (now - doneAt) < CRYSTAL_COOLDOWN_MS : false
  const remaining      = doneAt ? Math.max(0, (doneAt + CRYSTAL_COOLDOWN_MS) - now) : 0
  const fmtR = ms => {
    const days = Math.floor(ms/86400000)
    const h    = Math.floor((ms%86400000)/3600000)
    return days>0 ? `${days}d ${h}h` : `${h}h`
  }

  const markDone = () => {
    const ts = Date.now()
    setDoneAt(ts)
    lss('tv_crystal_ts', ts)
    // also tick the checklist
    const pk = weekKey()
    const d  = ls('tv_weekly')
    const c  = (d&&d.key===pk) ? d.checks||{} : {}
    const n  = {...c, w_crystal: true}
    lss('tv_weekly', {key:pk, checks:n})
    onChange?.()
  }
  const resetCrystal = () => {
    setDoneAt(null)
    localStorage.removeItem('tv_crystal_ts')
    onChange?.()
  }

  const isDone = checks['w_crystal']

  return (
    <div onClick={!cooldownActive && !isDone ? markDone : undefined} style={{
      display:'flex',alignItems:'center',gap:10,padding:'6px 8px',borderRadius:8,overflow:'hidden',
      cursor:cooldownActive||isDone?'default':'pointer',
      background:isDone||cooldownActive?'rgba(var(--ok),0.07)':'var(--card)',
      border:`1px solid ${isDone||cooldownActive?'rgba(var(--ok),0.25)':'var(--border)'}`,
      opacity:isDone&&!cooldownActive?0.65:1,transition:'all .13s',
    }}>
      <div style={{position:'relative',flexShrink:0,width:40,height:40}}>
        <img src="https://hutaobot.moe/img/material/Crystalfly_Trap.png" alt="Crystal Fly"
          style={{width:40,height:40,objectFit:'contain',borderRadius:8,background:'transparent',padding:6,display:'block'}}
          onError={e=>{e.target.style.display='none'}}/>
        {(isDone||cooldownActive)&&<div style={{position:'absolute',inset:0,borderRadius:8,background:'rgba(var(--ok),0.55)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',color:'#fff',fontWeight:700}}>✓</div>}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:'.78rem',fontWeight:600,color:isDone||cooldownActive?'rgba(var(--ok),0.8)':'var(--text)'}}>Crystal Fly Traps (×3)</div>
        {cooldownActive&&(
          <div style={{fontSize:'.62rem',color:'var(--text3)',marginTop:1,display:'flex',alignItems:'center',gap:6}}>
            <span style={{color:'rgba(var(--accent),0.8)',fontWeight:600}}>⏱ {fmtR(remaining)}</span>
            <button onClick={e=>{e.stopPropagation();resetCrystal()}}
              style={{fontSize:'.6rem',color:'var(--text3)',background:'transparent',border:'none',cursor:'pointer',padding:0}}>✕</button>
          </div>
        )}
        {!cooldownActive&&!isDone&&<div style={{fontSize:'.62rem',color:'var(--text3)',marginTop:1}}>7d cooldown</div>}
      </div>
    </div>
  )
}

// ── WeeklyCard ────────────────────────────────────────────────────────────────
function WeeklyCard({ onChange }) {
  const pk = weekKey()
  const [checks, setChecks] = useState(()=>{ const d=ls('tv_weekly'); return (d&&d.key===pk)?d.checks||{}:{} })
  const done = WEEKLY_TASKS.filter(t=>checks[t.id]).length

  const toggle = id => {
    const n={...checks,[id]:!checks[id]}; setChecks(n); lss('tv_weekly',{key:pk,checks:n})
    onChange?.()
  }

  const bossesDone = WEEKLY_BOSSES_FULL.filter(b=>checks[b.id]).length
  const nonBossDone = WEEKLY_NON_BOSS.filter(b=>checks[b.id]).length

  return (
    <div className="card">
      <div className="stitle" style={{display:'flex',justifyContent:'space-between'}}>
        <span>Weekly</span>
        <span style={{color:done===WEEKLY_TASKS.length?'rgba(var(--ok),0.9)':'var(--text3)'}}>{done}/{WEEKLY_TASKS.length}</span>
      </div>

      {/* Weekly Bosses */}
      <div style={{fontSize:'.62rem',fontWeight:700,color:'var(--text3)',letterSpacing:'.07em',textTransform:'uppercase',marginBottom:6}}>
        Bosses ({bossesDone}/{WEEKLY_BOSSES_FULL.length})
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4,marginBottom:12}}>
        {WEEKLY_BOSSES_FULL.map(b=>(
          <div key={b.id} onClick={()=>toggle(b.id)} style={{
            display:'flex',alignItems:'center',gap:10,padding:'6px 8px',borderRadius:8,cursor:'pointer',overflow:'hidden',
            background:checks[b.id]?'rgba(var(--ok),0.07)':'var(--card)',
            border:`1px solid ${checks[b.id]?'rgba(var(--ok),0.25)':'var(--border)'}`,
            opacity:checks[b.id]?0.65:1,transition:'all .13s',
          }}>
            <div style={{position:'relative',flexShrink:0,width:40,height:40}}>
              <img src={b.icon} alt={b.label}
                style={{width:40,height:40,objectFit:'contain',borderRadius:8,background:'transparent',display:'block'}}
                onError={e=>{e.target.style.display='none'}}/>
              {checks[b.id]&&<div style={{position:'absolute',inset:0,borderRadius:8,background:'rgba(var(--ok),0.55)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',color:'#fff',fontWeight:700}}>✓</div>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'.78rem',fontWeight:600,color:checks[b.id]?'rgba(var(--ok),0.8)':'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.label}</div>
              <div style={{fontSize:'.62rem',color:'var(--text3)',marginTop:2,display:'flex',alignItems:'center',gap:5,flexWrap:'wrap'}}>
                <span style={{
                  color: REGION_COLORS[b.region]||'#aaa',
                  background: (REGION_COLORS[b.region]||'#aaa')+'22',
                  border: `1px solid ${(REGION_COLORS[b.region]||'#aaa')}55`,
                  borderRadius:4, padding:'1px 5px', fontSize:'.58rem', fontWeight:700,
                  letterSpacing:'.03em', whiteSpace:'nowrap',
                }}>{b.region}</span>
                <span>{b.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Non-boss weekly tasks */}
      <div style={{fontSize:'.62rem',fontWeight:700,color:'var(--text3)',letterSpacing:'.07em',textTransform:'uppercase',marginBottom:6}}>
        Other ({nonBossDone}/{WEEKLY_NON_BOSS.length + 1})
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        {WEEKLY_NON_BOSS.map(t=>(
          <div key={t.id} onClick={()=>toggle(t.id)} style={{
            display:'flex',alignItems:'center',gap:10,padding:'6px 8px',borderRadius:8,cursor:'pointer',overflow:'hidden',
            background:checks[t.id]?'rgba(var(--ok),0.07)':'var(--card)',
            border:`1px solid ${checks[t.id]?'rgba(var(--ok),0.25)':'var(--border)'}`,
            opacity:checks[t.id]?0.65:1,transition:'all .13s',
          }}>
            <div style={{position:'relative',flexShrink:0,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center'}}>
              {t.svg
                ? <div style={{width:28,height:28,color:checks[t.id]?'rgba(var(--ok),0.8)':'var(--text2)',display:'flex',alignItems:'center',justifyContent:'center'}}>{t.svg}</div>
                : <img src={t.icon} alt={t.label}
                    style={{width:40,height:40,objectFit:'contain',borderRadius:8,background:'transparent',padding:6,display:'block'}}
                    onError={e=>{e.target.style.display='none'}}/>
              }
              {checks[t.id]&&<div style={{position:'absolute',inset:0,borderRadius:8,background:'rgba(var(--ok),0.55)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',color:'#fff',fontWeight:700}}>✓</div>}
            </div>
            <div style={{fontSize:'.78rem',fontWeight:600,color:checks[t.id]?'rgba(var(--ok),0.8)':'var(--text)'}}>{t.label}</div>
          </div>
        ))}
        <CrystalFlyRow checks={checks} toggle={toggle} onChange={onChange}/>
      </div>

      <div className="reset-note">Resets Monday at server reset</div>
    </div>
  )
}

// ── MonthlyCard ───────────────────────────────────────────────────────────────
function MonthlyCard({ onChange }) {
  const pk = monthKey()
  const [checks, setChecks] = useState(()=>{ const d=ls('tv_monthly'); return (d&&d.key===pk)?d.checks||{}:{} })
  const done = MONTHLY_TASKS.filter(t=>checks[t.id]).length
  const toggle = id => {
    const n={...checks,[id]:!checks[id]}; setChecks(n); lss('tv_monthly',{key:pk,checks:n})
    onChange?.()
  }
  return (
    <div className="card">
      <div className="stitle" style={{display:'flex',justifyContent:'space-between'}}>
        <span>Monthly</span>
        <span style={{color:done===MONTHLY_TASKS.length?'rgba(var(--ok),0.9)':'var(--text3)'}}>{done}/{MONTHLY_TASKS.length}</span>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        {MONTHLY_TASKS.map(t=>(
          <div key={t.id} onClick={()=>toggle(t.id)} style={{
            display:'flex',alignItems:'center',gap:10,padding:'6px 8px',borderRadius:8,cursor:'pointer',overflow:'hidden',
            background:checks[t.id]?'rgba(var(--ok),0.07)':'var(--card)',
            border:`1px solid ${checks[t.id]?'rgba(var(--ok),0.25)':'var(--border)'}`,
            opacity:checks[t.id]?0.65:1,transition:'all .13s',
          }}>
            <div style={{position:'relative',flexShrink:0,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center'}}>
              {t.svg
                ? <div style={{width:28,height:28,color:checks[t.id]?'rgba(var(--ok),0.8)':'var(--text2)',display:'flex',alignItems:'center',justifyContent:'center'}}>{t.svg}</div>
                : <img src={t.icon} alt={t.label}
                    style={{width:40,height:40,objectFit:'contain',borderRadius:8,background:'transparent',padding:6,display:'block'}}
                    onError={e=>{e.target.style.display='none'}}/>
              }
              {checks[t.id]&&<div style={{position:'absolute',inset:0,borderRadius:8,background:'rgba(var(--ok),0.55)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',color:'#fff',fontWeight:700}}>✓</div>}
            </div>
            <div style={{fontSize:'.78rem',fontWeight:600,color:checks[t.id]?'rgba(var(--ok),0.8)':'var(--text)'}}>{t.label}</div>
          </div>
        ))}
      </div>
      <div className="reset-note">Resets 1st of each month</div>
    </div>
  )
}

// ── Farm Alert Banner ────────────────────────────────────────────────────────
function FarmAlertBanner({ activeTeamId }) {
  const teams        = ls('tv_teams')||[]
  const trackedChars = ls('tv_chars')||{}
  const activeTeam   = (activeTeamId&&teams.find(t=>String(t.id)===String(activeTeamId)))||teams[0]
  if(!activeTeam) return null
  const memberIds = activeTeam.slots.filter(Boolean)
  const today = dayOfWeek()
  const activeTalentDomains = today===0?TALENT_DOMAINS:TALENT_DOMAINS.filter(d=>d.days.includes(today))
  const activeWeaponDomains = today===0?WEAPON_DOMAINS:WEAPON_DOMAINS.filter(d=>d.days.includes(today))

  const allBuilt = memberIds.length>0 && memberIds.every(charId=>{
    const data=trackedChars[charId]; if(!data) return false
    const t=data.talents||{}
    return data.level>=90 && (t.aa||1)>=9 && (t.e||1)>=9 && (t.q||1)>=9
  })
  if(allBuilt) return (
    <div className="domain-alert" style={{marginBottom:14,background:'rgba(var(--ok),0.12)',borderColor:'rgba(var(--ok),0.3)'}}>
      <span className="domain-alert-icon">✦</span>
      <div style={{minWidth:0}}>
        <div className="domain-alert-text" style={{color:'rgba(var(--ok),0.9)'}}>All characters built — {activeTeam.name}</div>
        <div className="domain-alert-names">Switch your focused team to keep progressing!</div>
      </div>
    </div>
  )

  // Build alert entries: {name, bookIcon} per unfinished char with a farmable book today
  const alertEntries = []
  memberIds.forEach(charId=>{
    const def=CHARACTERS.find(c=>c.id===charId); if(!def) return
    const talents = trackedChars[charId]?.talents||{}
    const maxTalent = Math.max(talents.aa||1, talents.e||1, talents.q||1)
    if(maxTalent < 9) activeTalentDomains.forEach(dom=>{
      if(dom.drops.includes(def.talentBook) && !alertEntries.find(a=>a.charId===charId))
        alertEntries.push({charId, name:def.name, bookIcon:TALENT_BOOKS[def.talentBook]?.icon, bookColor:TALENT_BOOKS[def.talentBook]?.color})
    })
  })
  if(!alertEntries.length) return null
  const shown = alertEntries.slice(0,4)
  const extra = alertEntries.length - shown.length
  return (
    <div className="domain-alert" style={{marginBottom:14,background:'rgba(var(--accent),0.12)',borderColor:'rgba(var(--accent),0.3)'}}>
      <span className="domain-alert-icon" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <svg viewBox="0 0 20 20" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{color:'rgba(var(--accent),0.9)'}}><rect x="2" y="4" width="16" height="14" rx="2"/><line x1="2" y1="8" x2="18" y2="8"/><line x1="6" y1="2" x2="6" y2="6"/><line x1="14" y1="2" x2="14" y2="6"/></svg>
      </span>
      <div style={{minWidth:0}}>
        <div className="domain-alert-text" style={{color:'rgba(var(--accent),0.9)'}}>Talents available today</div>
        <div className="domain-alert-names" style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'2px 6px'}}>
          {shown.map((a,i)=>(
            <span key={a.charId} style={{display:'inline-flex',alignItems:'center',gap:3}}>
              {i>0&&<span style={{color:'var(--text3)',margin:'0 1px'}}>·</span>}
              <span>{a.name}</span>
              {a.bookIcon&&<img src={a.bookIcon} alt="" style={{width:14,height:14,objectFit:'contain',flexShrink:0}} onError={e=>{e.target.style.display='none'}}/>}
            </span>
          ))}
          {extra>0&&<span style={{color:'var(--text3)'}}>+{extra} more</span>}
        </div>
      </div>
    </div>
  )
}

// ── Weekly boss list ─────────────────────────────────────────────────────────
const WEEKLY_BOSSES = [
  {id:'w_dvalin',      label:'Stormterror',                resin:30},
  {id:'w_wolf',        label:'Andrius',                    resin:30},
  {id:'w_nod_krai',    label:'The Game Before the Gate',   resin:60},
  {id:'w_childe',      label:'Tartaglia',                  resin:30},
  {id:'w_azhdaha',     label:'Azhdaha',                    resin:30},
  {id:'w_signora',     label:'La Signora',                 resin:60},
  {id:'w_raiden',      label:'Raiden Shogun',              resin:60},
  {id:'w_scaramouche', label:'Scaramouche',                resin:60},
  {id:'w_apep',        label:"Guardian of Apep's Oasis",   resin:60},
  {id:'w_narwhal',     label:'All-Devouring Narwhal',      resin:60},
  {id:'w_knave',       label:'The Knave',                  resin:60},
  {id:'w_natlan',      label:'Lord of Eroded Primal Fire', resin:60},
  {id:'w_heretic',     label:'Heretic of the False Moon',  resin:60},
]

// ── Dynamic suggestion engine ─────────────────────────────────────────────────
function buildSuggestion(activeTeamId) {
  const teams        = ls('tv_teams')||[]
  const trackedChars = ls('tv_chars')||{}
  const weeklyChecks = ls('tv_weekly')
  const wChecks      = (weeklyChecks&&weeklyChecks.key===weekKey())?weeklyChecks.checks||{}:{}
  const today        = dayOfWeek()
  const activeTeam   = (activeTeamId&&teams.find(t=>String(t.id)===String(activeTeamId)))||teams[0]
  const memberIds    = activeTeam ? activeTeam.slots.filter(Boolean) : []

  const activeTalentDomains = today===0 ? TALENT_DOMAINS : TALENT_DOMAINS.filter(d=>d.days.includes(today))
  const activeWeaponDomains = today===0 ? WEAPON_DOMAINS : WEAPON_DOMAINS.filter(d=>d.days.includes(today))

  const farmAlerts = []
  memberIds.forEach(charId=>{
    const def = CHARACTERS.find(c=>c.id===charId)
    if(!def) return
    const charData = trackedChars[charId]
    const talents = charData?.talents||{}
    const maxTalent = Math.max(talents.aa||1, talents.e||1, talents.q||1)
    if(maxTalent < 9) {
      activeTalentDomains.forEach(dom=>{
        if(dom.drops.includes(def.talentBook))
          farmAlerts.push({char:def.name})
      })
    }
    const weapon = WEAPONS.find(w=>w.id===charData?.weapon)
    const weaponLvl = getWeaponLevel(charData?.weapon)
    if(weapon && weaponLvl < 90) {
      activeWeaponDomains.forEach(dom=>{
        if(dom.drops.includes(weapon.domainMat))
          farmAlerts.push({char:def.name})
      })
    }
  })

  // Dynamic boss priority from team members who still need boss mats
  const teamBossPriority = (() => {
    const needed = new Set()
    memberIds.forEach(charId => {
      const def = CHARACTERS.find(c=>c.id===charId)
      if(!def || !def.weeklyBoss) return
      const cd = trackedChars[charId]
      const talents = cd?.talents||{}
      const lvl = cd?.level||1
      const weaponLvl = getWeaponLevel(cd?.weapon)
      const isMaxed = lvl>=90 && Math.min(talents.aa||1,talents.e||1,talents.q||1)>=9 && weaponLvl>=90
      if(!isMaxed) needed.add(def.weeklyBoss)
    })
    return [...needed]
  })()
  const pendingBosses  = WEEKLY_BOSSES
    .filter(b=>!wChecks[b.id])
    .sort((a,b)=>{
      const ai=teamBossPriority.indexOf(a.id), bi=teamBossPriority.indexOf(b.id)
      if(ai>=0&&bi>=0) return ai-bi
      if(ai>=0) return -1
      if(bi>=0) return 1
      return 0
    })
  const daysUntilReset = today===0 ? 0 : 7-today
  const suggestions    = []

  if(farmAlerts.length > 0) {
    const chars = [...new Set(farmAlerts.map(a=>a.char))]
    suggestions.push({
      icon:'🗺', urgency:2,
      title:'Farm domains today',
      detail: chars.slice(0,3).join(', ')+(chars.length>3?` +${chars.length-3} more`:''),
      tag:'Talent / Weapon books',
    })
  }
  if(pendingBosses.length > 0) {
    const urgent = daysUntilReset <= 2
    suggestions.push({
      icon:'⚔', urgency: urgent ? 3 : 1,
      title:`Weekly boss${urgent?' — '+daysUntilReset+'d left':''}`,
      detail: pendingBosses[0].label+(pendingBosses.length>1?` (+${pendingBosses.length-1} pending)`:''),
      tag: pendingBosses[0].resin+'⟡ resin',
    })
  }
  return suggestions.sort((a,b)=>b.urgency-a.urgency)
}

// ── Resin Card ────────────────────────────────────────────────────────────────
// First 3 weekly boss claims per week = 30 resin, rest = 60
function ResinCard({ activeTeamId, onChange }) {
  const today        = dayOfWeek()
  const weeklyChecks = ls('tv_weekly')
  const wChecks      = (weeklyChecks&&weeklyChecks.key===weekKey())?weeklyChecks.checks||{}:{}

  // Active team + tracked chars (must be declared before priority logic)
  const teams        = ls('tv_teams')||[]
  const trackedChars = ls('tv_chars')||{}
  const activeTeam   = (activeTeamId&&teams.find(t=>String(t.id)===String(activeTeamId)))||teams[0]
  const memberIds    = activeTeam ? activeTeam.slots.filter(Boolean) : []

  // How many weekly bosses already claimed this week?
  const claimedCount   = WEEKLY_BOSSES.filter(b=>wChecks[b.id]).length

  // Dynamic boss priority: bosses needed by unfinished active team members first
  const teamBossPriority = (() => {
    const needed = new Set()
    memberIds.forEach(charId => {
      const def = CHARACTERS.find(c=>c.id===charId)
      if(!def || !def.weeklyBoss) return
      const cd = trackedChars[charId]
      const talents = cd?.talents||{}
      const lvl = cd?.level||1
      const weaponLvl = getWeaponLevel(cd?.weapon)
      const isMaxed = lvl>=90 && Math.min(talents.aa||1,talents.e||1,talents.q||1)>=9 && weaponLvl>=90
      if(!isMaxed) needed.add(def.weeklyBoss)
    })
    return [...needed]
  })()

  const pendingBosses  = WEEKLY_BOSSES
    .filter(b=>!wChecks[b.id])
    .sort((a,b)=>{
      const ai=teamBossPriority.indexOf(a.id), bi=teamBossPriority.indexOf(b.id)
      if(ai>=0&&bi>=0) return ai-bi
      if(ai>=0) return -1
      if(bi>=0) return 1
      return 0
    })
  const daysUntilReset = today===0 ? 0 : 7-today

  // Next boss resin cost: first 3 claims = 30, after = 60
  const nextBossResin = claimedCount < 3 ? 30 : 60
  const discountLeft  = Math.max(0, 3 - claimedCount)
  const activeTalentDomains = today===0?TALENT_DOMAINS:TALENT_DOMAINS.filter(d=>d.days.includes(today))
  const activeWeaponDomains = today===0?WEAPON_DOMAINS:WEAPON_DOMAINS.filter(d=>d.days.includes(today))

  const domainFarmable = memberIds.some(charId=>{
    const def=CHARACTERS.find(c=>c.id===charId); if(!def) return false
    const cd=trackedChars[charId]; const talents=cd?.talents||{}
    return Math.max(talents.aa||1,talents.e||1,talents.q||1)<9 && activeTalentDomains.some(d=>d.drops.includes(def.talentBook))
  })

  // Helpers
  const formatList = (arr, suffix) => {
    if(!arr.length) return null
    if(arr.length===1) return `${arr[0]} (${suffix})`
    if(arr.length===2) return `${arr[0]} and ${arr[1]} (${suffix})`
    return `${arr.slice(0,-1).join(', ')} and ${arr[arr.length-1]} (${suffix})`
  }
  const dayMod2 = Math.floor(Date.now()/86400000) % 2
  const filler = dayMod2 === 0
    ? {label:'XP',   cost:20, tag:'Ley Line — Blossom of Revelation', urgent:false, icon:'https://static.wikia.nocookie.net/gensin-impact/images/0/07/Item_Adventurer%27s_Experience.png/revision/latest?cb=20201116222310'}
    : {label:'Mora', cost:20, tag:'Ley Line — Blossom of Wealth',     urgent:false, icon:'https://static.wikia.nocookie.net/gensin-impact/images/8/84/Item_Mora.png/revision/latest?cb=20210106073715'}

  const artifactEntry = {label:'Artifacts', cost:20, tag:'Artifact domain run', urgent:false, icon:'https://paimon.moe/images/artifacts/gladiators_finale_flower.png'}

  const makeBossEntry = () => {
    if(!pendingBosses.length) return null
    const boss = pendingBosses[0]
    const bossData = WEEKLY_BOSSES_FULL.find(b=>b.id===boss.id)
    const urgent = daysUntilReset<=2
    return {
      label: boss.label,
      cost: nextBossResin,
      icon: bossData?.icon,
      tag: urgent
        ? `Weekly boss — ${daysUntilReset}d left!`
        : discountLeft>0
          ? `Weekly boss · ${discountLeft} discounted run${discountLeft>1?'s':''} left`
          : 'Weekly boss · full cost',
      urgent,
    }
  }

  // Build plan — always exactly 2 slots
  // Slot 1: talent domain if farmable today, otherwise weekly boss
  // Slot 2: always XP/Mora/Artifacts rotation
  const plan = []

  if(domainFarmable) {
    // Slot 1: talents
    const relevantTalents = new Set()
    const relevantBookIds = new Set()
    memberIds.forEach(charId => {
      const def = CHARACTERS.find(c=>c.id===charId); if(!def) return
      const cd  = trackedChars[charId]; const talents = cd?.talents||{}
      if(Math.max(talents.aa||1,talents.e||1,talents.q||1)<9)
        activeTalentDomains.forEach(d=>{ if(d.drops.includes(def.talentBook)) { relevantTalents.add(TALENT_BOOKS[def.talentBook]?.name||def.talentBook); relevantBookIds.add(def.talentBook) } })
    })
    const firstBookIcon = [...relevantBookIds].map(id=>TALENT_BOOKS[id]?.icon).find(Boolean)
    plan.push({
      label: formatList([...relevantTalents],'Talents') || 'Farm today',
      cost: 20,
      tag: `Talent domain — ${activeTeam?.name||'active team'}`,
      urgent: false,
      icon: firstBookIcon || 'https://static.wikia.nocookie.net/gensin-impact/images/3/33/Item_Teachings_of_Resistance.png',
    })
  } else if(claimedCount < 3) {
    // No talents + <3 bosses done — slot 1 is weekly boss
    const bossEntry = makeBossEntry()
    if(bossEntry) plan.push(bossEntry)
  } else {
    // No talents + 3 bosses done — slot 1 is artifacts
    plan.push(artifactEntry)
  }

  // Slot 2: always XP/Mora rotation
  plan.push(filler)

  return (
    <div className="card">
      <div className="stitle" style={{marginBottom:8}}>Resin</div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
      {plan.map((item,i)=>(
        <div key={i} style={{
          display:'flex',alignItems:'center',gap:10,padding:'6px 8px',borderRadius:8,overflow:'hidden',
          background:'var(--card)',border:'1px solid var(--border)',
        }}>
          {item.icon&&(
            <div style={{flexShrink:0,width:40,height:40}}>
              <img src={item.icon} alt={item.label}
                style={{width:40,height:40,objectFit:'contain',borderRadius:8,background:'transparent',padding:6,display:'block'}}
                onError={e=>{e.target.style.display='none'}}/>
            </div>
          )}
          <div style={{flex:1,minWidth:0,overflow:'hidden'}}>
            <div style={{fontSize:'.78rem',fontWeight:600,color:item.urgent?'rgba(var(--five),0.95)':'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</div>
            <div style={{fontSize:'.65rem',color:'var(--text3)',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.tag}</div>
          </div>
          <div style={{
            fontSize:'.7rem',fontWeight:700,flexShrink:0,
            color:item.urgent?'rgba(var(--five),0.9)':item.cost===30?'rgba(var(--ok),0.85)':'rgba(var(--accent),0.8)',
            background:item.urgent?'rgba(var(--five),0.08)':item.cost===30?'rgba(var(--ok),0.08)':'rgba(var(--accent),0.08)',
            border:`1px solid ${item.urgent?'rgba(var(--five),0.25)':item.cost===30?'rgba(var(--ok),0.3)':'rgba(var(--accent),0.2)'}`,
            borderRadius:5,padding:'2px 8px',minWidth:36,textAlign:'center'
          }}>{item.cost}⟡</div>
        </div>
      ))}
      </div>
    </div>
  )
}

// ── Serenitea plant row ───────────────────────────────────────────────────────
const PLANT_DURATION_MS = (2*24+22)*60*60*1000

function SereniTeaPlantRow({ onChange }) {
  const [plantedAt, setPlantedAt] = useState(()=>{ const v=ls('tv_plants_ts'); return v?Number(v):null })
  const [now, setNow] = useState(Date.now())
  useEffect(()=>{ const t=setInterval(()=>setNow(Date.now()),60000); return ()=>clearInterval(t) },[])

  const ready     = plantedAt ? (now-plantedAt)>=PLANT_DURATION_MS : true
  const remaining = plantedAt ? Math.max(0,(plantedAt+PLANT_DURATION_MS)-now) : 0
  const fmtR = ms=>{ const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000); return h>=24?`${Math.floor(h/24)}d ${h%24}h`:`${h}h ${m}m` }
  const plant = ()=>{ const ts=Date.now(); setPlantedAt(ts); lss('tv_plants_ts',ts); onChange?.() }
  const reset = ()=>{ setPlantedAt(null); localStorage.removeItem('tv_plants_ts'); onChange?.() }

  return (
    <div style={{
      display:'flex',alignItems:'center',gap:10,padding:'7px 10px',marginBottom:6,
      background: ready?'rgba(var(--ok),0.05)':'rgba(var(--ok),0.08)',
      borderRadius:6, border:`1px ${ready?'dashed':'solid'} rgba(var(--ok),${ready?'0.2':'0.3'})`,
    }}>
      <img src="https://static.wikia.nocookie.net/gensin-impact/images/4/44/Icon_Housing_Landform_Field.png/revision/latest?cb=20210911040753"
        alt="Plants" style={{width:24,height:24,objectFit:'contain',flexShrink:0}}
        onError={e=>{e.target.style.display='none'}}/>
      <span style={{flex:1,fontSize:'.8rem',color:ready?'rgba(var(--ok),0.75)':'rgba(var(--ok),0.9)',fontWeight:500}}>
        Serenitea Pot Plants
      </span>
      {ready ? (
        <button onClick={plant} style={{
          fontSize:'.68rem',padding:'2px 10px',background:'rgba(var(--ok),0.15)',
          border:'1px solid rgba(var(--ok),0.35)',borderRadius:5,color:'rgba(var(--ok),0.9)',cursor:'pointer',flexShrink:0
        }}>Plant now</button>
      ) : (
        <div style={{display:'flex',alignItems:'center',gap:7,flexShrink:0}}>
          <span style={{fontSize:'.7rem',fontWeight:600,color:'rgba(var(--ok),0.85)'}}>⏱ {fmtR(remaining)}</span>
          <button onClick={reset} style={{fontSize:'.6rem',color:'var(--text3)',background:'transparent',border:'none',cursor:'pointer',padding:'0 2px'}}>✕</button>
        </div>
      )}
    </div>
  )
}

// ── DailyCard: plant timer + regular tasks ────────────────────────────────────
function DailyCard({ onChange }) {
  const periodKey = todayKey()
  const [checks, setChecks] = useState(()=>{ const d=ls('tv_daily'); return (d&&d.key===periodKey)?d.checks||{}:{} })
  const done = DAILY_TASKS.filter(t=>checks[t.id]).length

  const toggle = id => {
    const n={...checks,[id]:!checks[id]}; setChecks(n); lss('tv_daily',{key:periodKey,checks:n})
    onChange?.()
  }

  return (
    <div className="card">
      <div className="stitle" style={{display:'flex',justifyContent:'space-between'}}>
        <span>Daily</span>
        <span style={{color:done===DAILY_TASKS.length?'rgba(var(--ok),0.9)':'var(--text3)'}}>{done}/{DAILY_TASKS.length}</span>
      </div>
      <SereniTeaPlantRow onChange={onChange}/>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        {DAILY_TASKS.map(t=>(
          <div key={t.id} onClick={()=>toggle(t.id)} style={{
            display:'flex',alignItems:'center',gap:10,padding:'6px 8px',borderRadius:8,cursor:'pointer',overflow:'hidden',
            background:checks[t.id]?'rgba(var(--ok),0.07)':'var(--card)',
            border:`1px solid ${checks[t.id]?'rgba(var(--ok),0.25)':'var(--border)'}`,
            opacity:checks[t.id]?0.65:1,transition:'all .13s',
          }}>
            <div style={{position:'relative',flexShrink:0,width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center'}}>
              {t.svg
                ? <div style={{width:28,height:28,color:checks[t.id]?'rgba(var(--ok),0.8)':'var(--text2)',display:'flex',alignItems:'center',justifyContent:'center'}}>{t.svg}</div>
                : <img src={t.icon} alt={t.label}
                    style={{width:40,height:40,objectFit:'contain',borderRadius:8,background:'transparent',padding:6,display:'block'}}
                    onError={e=>{e.target.style.display='none'}}/>
              }
              {checks[t.id]&&<div style={{position:'absolute',inset:0,borderRadius:8,background:'rgba(var(--ok),0.55)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',color:'#fff',fontWeight:700}}>✓</div>}
            </div>
            <div style={{flex:1,minWidth:0,overflow:'hidden'}}>
              <div style={{fontSize:'.78rem',fontWeight:600,color:checks[t.id]?'rgba(var(--ok),0.8)':'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.label}</div>
            </div>
            {t.badge&&<span className="cbadge" style={{flexShrink:0}}>{t.badge}</span>}
          </div>
        ))}
      </div>
      <div className="reset-note">Resets daily at server reset (UTC+8 04:00)</div>
    </div>
  )
}

// ── Char Edit Modal (from Daily tab) ─────────────────────────────────────────
function CharEditModal({ charId, onChange, onClose }) {
  const def = CHARACTERS.find(c=>c.id===charId)
  if(!def) return null
  const [charData, setCharData] = useState(()=>{
    const raw = ls('tv_chars')||{}
    return raw[charId] || {id:charId,talents:{aa:1,e:1,q:1},ascension:0,level:1,artifactSet:'none',weapon:'',notes:''}
  })
  const handleUpdate = (d) => {
    setCharData(d)
    const raw = ls('tv_chars')||{}
    raw[charId] = d
    lss('tv_chars', raw)
    onChange?.()
  }
  return (
    <div className="char-edit-modal-wrap" style={{position:'fixed',inset:0,zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.5)'}}
      onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="char-edit-modal-inner" style={{width:'100%',maxWidth:480,maxHeight:'90vh',overflowY:'auto',borderRadius:16,background:'var(--panel)',padding:20,margin:16,boxShadow:'0 8px 40px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <span style={{fontWeight:600,fontSize:'.85rem',color:'var(--text)'}}>Edit Character</span>
          <button onClick={onClose} style={{fontSize:'1rem',color:'var(--text3)',padding:'2px 8px'}}>✕</button>
        </div>
        <CharCard charDef={def} charData={charData} onUpdate={handleUpdate} onRemove={onClose}/>
      </div>
    </div>
  )
}

function BuildingSection({ activeTeamId, onTeamSelect, onCharEdit }) {
  const [teams, setTeams] = useState(()=>ls('tv_teams')||[])

  useEffect(()=>{
    const id = setInterval(()=>{
      const fresh = ls('tv_teams')||[]
      setTeams(prev => JSON.stringify(prev)===JSON.stringify(fresh) ? prev : fresh)
    }, 2000)
    return ()=>clearInterval(id)
  },[])

  // If no selection yet, default to first team
  useEffect(()=>{
    if(teams.length && !activeTeamId) {
      onTeamSelect(String(teams[0].id))
    }
  },[teams])

  const activeTeam = teams.find(t=>String(t.id)===String(activeTeamId)) || teams[0]
  const memberIds  = activeTeam ? activeTeam.slots.filter(Boolean) : []
  const trackedChars = ls('tv_chars')||{}

  const today = dayOfWeek()
  const activeTalentDomains = today===0 ? TALENT_DOMAINS : TALENT_DOMAINS.filter(d=>d.days.includes(today))
  const activeWeaponDomains = today===0 ? WEAPON_DOMAINS : WEAPON_DOMAINS.filter(d=>d.days.includes(today))

  if(!teams.length) return (
    <div className="building-section">
      <div className="stitle">Currently Building</div>
      <div style={{color:'var(--text3)',fontSize:'.78rem',padding:'8px 0'}}>
        No teams yet — create one in the Team Builder tab.
      </div>
    </div>
  )

  return (
    <div className="building-section">
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
        <div className="stitle" style={{marginBottom:0}}>Currently Building</div>
        <select className="input" value={String(activeTeam?.id||'')} onChange={e=>onTeamSelect(e.target.value)}
          style={{flex:1,fontSize:'.75rem',padding:'3px 8px'}}>
          {teams.map(t=><option key={t.id} value={String(t.id)}>{t.name}</option>)}
        </select>
      </div>

      {memberIds.length===0 ? (
        <div style={{color:'var(--text3)',fontSize:'.78rem',padding:'4px 0'}}>
          This team has no characters — add some in the Team Builder tab.
        </div>
      ) : (
        <div className="build-team-grid">
          {memberIds.map(charId=>{
            const def=CHARACTERS.find(c=>c.id===charId)
            if(!def) return null
            const el=ELEMENTS[def.element]
            const ic=charIcon(def.id)
            const cd=trackedChars[charId]
            const talents=cd?.talents||{}
            const weaponLvl=getWeaponLevel(cd?.weapon)
            const fullyBuilt = Math.min(talents.aa||1,talents.e||1,talents.q||1)>=9 && weaponLvl>=90 && (cd?.level||1)>=90
            return (
              <div className={`build-char-card${fullyBuilt?' built':''}`} key={charId} onClick={()=>onCharEdit&&onCharEdit(charId)} style={{cursor:'pointer'}}>
                <div className="build-char-av-wrap">
                  {ic
                    ? <img className="build-char-av" src={ic} alt={def.name} onError={e=>{e.target.style.opacity=0}}/>
                    : <div className="build-char-av" style={{display:'flex',alignItems:'center',justifyContent:'center',background:`rgba(${el?.rgb||'200,169,110'},.15)`}}>
                        {el&&<img src={el.icon} style={{width:18,height:18}} alt={def.element} onError={e=>{e.target.style.display='none'}}/>}
                      </div>
                  }
                  {fullyBuilt && (
                    <div className="built-check">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="build-char-name">{def.name}</div>
                <div className="build-char-el" style={{color:`rgba(${el?.rgb||'200,169,110'},0.85)`}}>
                  {el&&<img src={el.icon} style={{width:10,height:10,marginRight:2}} alt={def.element} onError={e=>{e.target.style.display='none'}}/>}
                  {def.element}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DailyTab({ onChange }) {
  const [calData, setCalData] = useState(null)
  const [editingCharId, setEditingCharId] = useState(null)
  const [activeTeamId, setActiveTeamId] = useState(()=>{
    const saved = ls('tv_active_team')
    const allTeams = ls('tv_teams')||[]
    if(saved && allTeams.find(t=>String(t.id)===String(saved))) return String(saved)
    return allTeams[0] ? String(allTeams[0].id) : null
  })

  const handleTeamSelect = (id) => {
    setActiveTeamId(id)
    lss('tv_active_team', id)
  }

  useEffect(()=>{
    const cached=ls('tv_cal')
    if(cached&&Date.now()-cached.ts<15*60*1000){setCalData(cached.data);return}
    fetch('https://api.ennead.cc/mihoyo/genshin/calendar')
      .then(r=>r.json())
      .then(d=>{lss('tv_cal',{ts:Date.now(),data:d});setCalData(d)})
      .catch(()=>setCalData({}))
  },[])

  return (
    <div>
      <FarmAlertBanner activeTeamId={activeTeamId}/>
      <div className="daily-layout">
        <div>
          <EventsStrip data={calData}/>
          <div className="daily-checklists">
            <ResinCard activeTeamId={activeTeamId} onChange={onChange}/>
            <DailyCard onChange={onChange}/>
            <WeeklyCard onChange={onChange}/>
            <MonthlyCard onChange={onChange}/>
          </div>
          <BuildingSection activeTeamId={activeTeamId} onTeamSelect={handleTeamSelect} onCharEdit={setEditingCharId}/>
        </div>
        <div>
    <div className="hide-mobile">
          <TeamQuickPicker activeTeamId={activeTeamId} onTeamSelect={handleTeamSelect}/>
        </div>
          <BannerSidebar data={calData}/>
        </div>
      </div>
      {editingCharId && <CharEditModal charId={editingCharId} onChange={onChange} onClose={()=>setEditingCharId(null)}/>}
    </div>
  )
}
