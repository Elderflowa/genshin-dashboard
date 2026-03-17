import React, { useState } from 'react'
import { WEAPONS, WEAPON_MATS, weaponIcon, weaponTypeIcon } from '../data/gameData.js'

const ls  = k=>{ try{return JSON.parse(localStorage.getItem(k))}catch{return null} }
const lss = (k,v)=>localStorage.setItem(k,JSON.stringify(v))

const TYPES = ['All','Owned','Sword','Claymore','Polearm','Catalyst','Bow']
const STARS = ['All','5','4','3']

// Migrate old array format [id,...] → new object format {id:{level:1},...}
function loadOwned() {
  const raw = ls('tv_weapons_owned')
  if (!raw) return {}
  if (Array.isArray(raw)) {
    // old format — migrate
    const migrated = {}
    raw.forEach(id => { migrated[id] = { level: 1 } })
    lss('tv_weapons_owned', migrated)
    return migrated
  }
  return raw
}

export default function WeaponsTab({ onChange }) {
  const [typeFilter, setType]  = useState('All')
  const [starFilter, setStar]  = useState('All')
  const [search, setSearch]    = useState('')
  const [owned, setOwned]      = useState(loadOwned)

  const save = (next) => { setOwned(next); lss('tv_weapons_owned', next); onChange?.() }

  const [confirming, setConfirming] = useState(null) // id of weapon pending removal confirm

  const toggleOwned = (id) => {
    if (owned[id]) {
      // already owned → ask for confirmation before removing
      setConfirming(id)
    } else {
      // not owned → add immediately
      const next = { ...owned, [id]: { level: 1 } }
      save(next)
    }
  }

  const confirmRemove = (id) => {
    const next = { ...owned }
    delete next[id]
    save(next)
    setConfirming(null)
  }

  const setLevel = (id, level) => {
    const val = Math.max(1, Math.min(90, Number(level) || 1))
    save({ ...owned, [id]: { ...owned[id], level: val } })
  }

  const ownedIds = Object.keys(owned)

  const filtered = WEAPONS.filter(w=>{
    if(typeFilter==='Owned') return !!owned[w.id]
    if(typeFilter!=='All'&&w.type!==typeFilter) return false
    if(starFilter!=='All'&&String(w.rarity)!==starFilter) return false
    if(search&&!w.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a,b)=>b.rarity-a.rarity||a.name.localeCompare(b.name))

  return (
    <div>
      <div className="weapons-toolbar">
        <input className="input" placeholder="Search weapon..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:160}}/>
        <div className="filter-pills">
          {TYPES.map(t=>(
            <button key={t} className={'pill'+(typeFilter===t?' active':'')} onClick={()=>setType(t)}>
              {t!=='All' && t!=='Owned' && (
                <img src={weaponTypeIcon(t)} alt={t} style={{width:14,height:14,objectFit:'contain'}}
                  onError={e=>{e.target.style.display='none'}}/>
              )}
              {t}
            </button>
          ))}
        </div>
        <div className="filter-pills">
          {STARS.map(s=>(
            <button key={s} className={'pill'+(starFilter===s?' active':'')} onClick={()=>setStar(s)}>
              {s==='All'?'All Stars':s+'★'}
            </button>
          ))}
        </div>
        <span style={{marginLeft:'auto',fontSize:'.72rem',color:'var(--text3)'}}>{filtered.length} weapons · {ownedIds.length} owned</span>
      </div>

      <div className="weapon-grid">
        {filtered.map(w=>{
          const mat     = WEAPON_MATS[w.domainMat]
          const isOwned = !!owned[w.id]
          const lvl     = owned[w.id]?.level || 1
          return (
            <div key={w.id} className={'weapon-card'+(isOwned?' selected':'')}
              onClick={()=>{ if(confirming===w.id) return; toggleOwned(w.id) }}>
              <div style={{display:'flex',alignItems:'flex-start',gap:9}}>
                <img
                  src={weaponIcon(w.id)}
                  alt={w.name}
                  style={{width:44,height:44,objectFit:'contain',flexShrink:0,borderRadius:6,background:'var(--bg)',padding:2}}
                  onError={e=>{e.target.style.display='none'}}
                />
                <div style={{flex:1,minWidth:0}}>
                  <div className="wc-name">{w.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:5,marginTop:2}}>
                    <img src={weaponTypeIcon(w.type)} alt={w.type}
                      style={{width:12,height:12,objectFit:'contain'}}
                      onError={e=>{e.target.style.display='none'}}/>
                    <span className="wc-type">{w.type}</span>
                    <span className={'wc-rar '+(w.rarity>=5?'r5c':'r4c')}>{'★'.repeat(w.rarity)}</span>
                  </div>
                  {mat&&<div className="wc-mat" style={{color:mat.color}}>⦿ {mat.name}</div>}
                  {isOwned && confirming !== w.id && (
                    <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}} onClick={e=>e.stopPropagation()}>
                      <span style={{fontSize:'.62rem',color:'rgba(var(--ok),0.9)',fontWeight:600}}>✓ Owned</span>
                      <span style={{fontSize:'.62rem',color:'var(--text3)'}}>Lv.</span>
                      <input
                        type="number" min="1" max="90"
                        value={lvl}
                        onChange={e=>setLevel(w.id, e.target.value)}
                        style={{
                          width:42, fontSize:'.7rem', padding:'1px 4px',
                          background:'var(--input)', border:'1px solid var(--border)',
                          borderRadius:4, color: lvl>=90?'rgba(var(--five),0.9)':'var(--text)',
                          fontWeight: lvl>=90?700:400,
                        }}
                      />
                      {lvl>=90&&<span style={{fontSize:'.6rem',color:'rgba(var(--five),0.8)',fontWeight:700}}>MAX</span>}
                    </div>
                  )}
                  {confirming === w.id && (
                    <div style={{marginTop:6,display:'flex',alignItems:'center',gap:6}} onClick={e=>e.stopPropagation()}>
                      <span style={{fontSize:'.65rem',color:'var(--text2)'}}>Remove?</span>
                      <button onClick={()=>confirmRemove(w.id)} style={{
                        fontSize:'.62rem',padding:'1px 8px',borderRadius:4,cursor:'pointer',
                        background:'rgba(220,60,60,0.15)',border:'1px solid rgba(220,60,60,0.4)',color:'#e06060'
                      }}>Yes</button>
                      <button onClick={()=>setConfirming(null)} style={{
                        fontSize:'.62rem',padding:'1px 8px',borderRadius:4,cursor:'pointer',
                        background:'var(--hover)',border:'1px solid var(--border)',color:'var(--text2)'
                      }}>No</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{marginTop:12,fontSize:'.7rem',color:'var(--text3)'}}>
        Click any weapon to mark as owned. Set level to track upgrade progress.
      </div>
    </div>
  )
}
