import React, { useState, useCallback } from 'react'
import { CHARACTERS, ELEMENTS, ARTIFACT_SETS, TALENT_BOOKS, WEAPONS, charIcon, weaponIcon, artifactIcon } from '../data/gameData.js'

const ls  = k=>{ try{return JSON.parse(localStorage.getItem(k))}catch{return null} }
const lss = (k,v)=>localStorage.setItem(k,JSON.stringify(v))

function loadTracked(){
  const raw = ls('tv_chars')||{}
  // Migrate old data: artifactSet may be a plain name string instead of an id
  const migrated = {}
  for(const [charId, data] of Object.entries(raw)){
    let art = data.artifactSet||'none'
    // If it's not an id (ids are lowercase with underscores, not spaces/apostrophes)
    if(art && art!=='none' && (art.includes(' ') || art.includes("'"))) {
      // Try to find matching set by name
      const match = ARTIFACT_SETS.find(a=>a.name.toLowerCase()===art.toLowerCase())
      art = match ? match.id : 'none'
    }
    migrated[charId] = {...data, artifactSet: art}
  }
  return migrated
}
function saveTracked(d){ lss('tv_chars',d) }

function defaultData(def){
  return {id:def.id,talents:{aa:1,e:1,q:1},ascension:0,level:1,artifactSet:'none',weapon:'',notes:''}
}

function TalentDots({label,value,onChange}){
  return (
    <div className="tal-row">
      <span className="tal-lbl">{label}</span>
      <div className="dots">
        {Array.from({length:10},(_,i)=>i+1).map(lvl=>(
          <div key={lvl} className={`dot${value>=lvl?(lvl===10?' crown':' on'):''}`}
            onClick={()=>onChange(value===lvl?lvl-1:lvl)} title={`Lv ${lvl}`}/>
        ))}
      </div>
      <span className="tal-num">{value}</span>
    </div>
  )
}

function AscTrack({value,onChange}){
  return (
    <div className="asc-row">
      <span className="asc-lbl">Ascension</span>
      <div className="asc-steps">
        {[1,2,3,4,5,6].map(s=>(
          <div key={s} className={`asc-step${value>=s?' on':''}`}
            onClick={()=>onChange(value===s?s-1:s)} title={`Asc ${s}`}/>
        ))}
      </div>
      <span className="asc-val">{value}/6</span>
    </div>
  )
}

function CharCard({charDef,charData,onUpdate,onRemove}){
  const el    = ELEMENTS[charDef.element]
  const elRgb = el?.rgb||'200,169,110'
  const book  = TALENT_BOOKS[charDef.talentBook]
  const ic    = charIcon(charDef.id)
  const [weapSearch, setWeapSearch] = useState('')
  const [artSearch, setArtSearch]   = useState('')
  const [artOpen, setArtOpen]       = useState(false)
  const ownedWeaponsRaw = JSON.parse(localStorage.getItem('tv_weapons_owned') || '{}')
  const ownedWeaponIds = Array.isArray(ownedWeaponsRaw) ? ownedWeaponsRaw : Object.keys(ownedWeaponsRaw)
  const validWeapons = WEAPONS.filter(w=>w.type===charDef.weaponType).sort((a,b)=>b.rarity-a.rarity||a.name.localeCompare(b.name))
  const ownedValidWeapons = validWeapons.filter(w=>ownedWeaponIds.includes(w.id))
  // If nothing owned yet, fall back to all weapons
  const weaponPool = ownedValidWeapons.length > 0 ? ownedValidWeapons : validWeapons
  const filteredWeapons = weapSearch
    ? weaponPool.filter(w=>w.name.toLowerCase().includes(weapSearch.toLowerCase()))
    : weaponPool
  const selectedWeapon   = WEAPONS.find(w=>w.id===charData.weapon) || null
  const artId = charData.artifactSet && charData.artifactSet!=='none' && charData.artifactSet!=='None'
    ? charData.artifactSet
    : 'none'
  const selectedArtifact = ARTIFACT_SETS.find(a=>a.id===artId) || ARTIFACT_SETS[0]
  const selectedArtifactIcon = selectedArtifact?.enkaId ? artifactIcon(selectedArtifact.enkaId) : null
  const filteredArtifacts = artSearch
    ? ARTIFACT_SETS.filter(a=>a.name.toLowerCase().includes(artSearch.toLowerCase()))
    : ARTIFACT_SETS
  const upd = (k,v)=>onUpdate({...charData,[k]:v})
  const updTalent = (slot,v)=>onUpdate({...charData,talents:{...charData.talents,[slot]:Math.max(1,Math.min(10,v))}})

  return (
    <div className="char-card">
      <div className="char-head">
        {ic
          ? <img className={`char-av ${charDef.rarity===5?'r5':'r4'}`} src={ic} alt={charDef.name} onError={e=>{e.target.style.display='none'}}/>
          : <div className={`char-av ${charDef.rarity===5?'r5':'r4'}`} style={{display:'flex',alignItems:'center',justifyContent:'center',background:`rgba(${elRgb},.15)`}}>
              {el&&<img src={el.icon} style={{width:20,height:20}} alt={charDef.element} onError={e=>{e.target.style.display='none'}}/>}
            </div>
        }
        <div className="char-nm-blk" style={{flex:1,minWidth:0}}>
          <div className="char-nm">{charDef.name}</div>
          <div className="char-sub">
            {el&&<img src={el.icon} style={{width:13,height:13}} alt={charDef.element} onError={e=>{e.target.style.display='none'}}/>}
            <span style={{color:`rgba(${elRgb},.9)`}}>{charDef.element}</span>
            <span style={{color:'var(--text3)'}}>·</span>
            <span style={{color:'var(--text3)'}}>{charDef.weaponType}</span>
            {book&&<><span style={{color:'var(--text3)'}}>·</span><span style={{color:book.color,fontSize:'.64rem'}}>{book.name}</span></>}
          </div>
        </div>
        <span className={`char-rar ${charDef.rarity===5?'r5c':'r4c'}`}>{'★'.repeat(charDef.rarity)}</span>
      </div>

      {/* Level */}
      <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
        <span style={{fontSize:'.7rem',color:'var(--text3)',width:52}}>Level</span>
        <input className="input char-lvl" type="number" min="1" max="90" value={charData.level}
          onChange={e=>upd('level',Math.max(1,Math.min(90,+e.target.value)))}/>
        <span style={{fontSize:'.65rem',color:'var(--text3)'}}>→ 90</span>
      </div>

      <div className="tal-rows">
        <TalentDots label="AA" value={charData.talents.aa} onChange={v=>updTalent('aa',v)}/>
        <TalentDots label="E"  value={charData.talents.e}  onChange={v=>updTalent('e',v)}/>
        <TalentDots label="Q"  value={charData.talents.q}  onChange={v=>updTalent('q',v)}/>
      </div>
      <AscTrack value={charData.ascension} onChange={v=>upd('ascension',v)}/>

      <div className="char-bottom">
        {/* Weapon — searchable */}
        <div className="weapon-search-wrap" style={{flex:2,minWidth:120,position:'relative'}}>
          {selectedWeapon && (
            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:3}}>
              <img src={weaponIcon(selectedWeapon.id)} style={{width:22,height:22,objectFit:'contain'}} alt={selectedWeapon.name}
                onError={e=>{e.target.style.display='none'}}/>
              <span style={{fontSize:'.74rem',color:selectedWeapon.rarity===5?'rgba(var(--five),1)':'rgba(var(--four),1)',flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {'★'.repeat(selectedWeapon.rarity)} {selectedWeapon.name}
              </span>
              <button style={{fontSize:'.65rem',color:'var(--text3)',padding:'0 3px',flexShrink:0}} onClick={()=>{upd('weapon','');setWeapSearch('')}}>✕</button>
            </div>
          )}
          <input className="input" placeholder={ownedValidWeapons.length > 0 ? `Owned ${charDef.weaponType}s…` : `Search ${charDef.weaponType}…`}
            value={weapSearch} onChange={e=>setWeapSearch(e.target.value)}
            style={{width:'100%',fontSize:'.75rem',padding:'4px 8px'}}/>
          {weapSearch && (
            <div className="weap-dropdown">
              {filteredWeapons.slice(0,12).map(w=>(
                <div key={w.id} className="weap-opt" onClick={()=>{upd('weapon',w.id);setWeapSearch('')}}>
                  <img src={weaponIcon(w.id)} style={{width:20,height:20,objectFit:'contain'}} alt={w.name}
                    onError={e=>{e.target.style.display='none'}}/>
                  <span style={{color:w.rarity===5?'rgba(var(--five),1)':'rgba(var(--four),1)',fontSize:'.75rem'}}>
                    {'★'.repeat(w.rarity)} {w.name}
                  </span>
                </div>
              ))}
              {filteredWeapons.length===0&&<div style={{padding:'6px 10px',fontSize:'.72rem',color:'var(--text3)'}}>No results</div>}
            </div>
          )}
        </div>

        {/* Artifact set — searchable */}
        <div style={{flex:2,minWidth:120,position:'relative'}}>
          {selectedArtifact && selectedArtifact.id!=='none' && (
            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:3}}>
              {selectedArtifactIcon && (
                <img src={selectedArtifactIcon} style={{width:22,height:22,objectFit:'contain',borderRadius:4}} alt={selectedArtifact.name}
                  onError={e=>{e.target.style.display='none'}}/>
              )}
              <span style={{fontSize:'.72rem',color:'var(--text2)',flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {selectedArtifact.name}
              </span>
              <button style={{fontSize:'.65rem',color:'var(--text3)',padding:'0 3px',flexShrink:0}} onClick={()=>{upd('artifactSet','none');setArtSearch('')}}>✕</button>
            </div>
          )}
          <input className="input" placeholder="Search artifact set…"
            value={artSearch} onChange={e=>{setArtSearch(e.target.value);setArtOpen(true)}}
            onFocus={()=>setArtOpen(true)} onBlur={()=>setTimeout(()=>setArtOpen(false),150)}
            style={{width:'100%',fontSize:'.75rem',padding:'4px 8px'}}/>
          {artOpen && (
            <div className="weap-dropdown">
              {filteredArtifacts.filter(a=>a.id!=='none').slice(0,12).map(a=>(
                <div key={a.id} className="weap-opt" onMouseDown={()=>{upd('artifactSet',a.id);setArtSearch('');setArtOpen(false)}}>
                  {a.enkaId && (
                    <img src={artifactIcon(a.enkaId)} style={{width:20,height:20,objectFit:'contain',borderRadius:3}} alt={a.name}
                      onError={e=>{e.target.style.display='none'}}/>
                  )}
                  <span style={{fontSize:'.75rem',color:'var(--text)'}}>{a.name}</span>
                </div>
              ))}
              {filteredArtifacts.filter(a=>a.id!=='none').length===0&&<div style={{padding:'6px 10px',fontSize:'.72rem',color:'var(--text3)'}}>No results</div>}
            </div>
          )}
        </div>

        <button className="btn btn-danger btn-sm" onClick={onRemove} style={{flexShrink:0,alignSelf:'flex-end'}}>✕</button>
      </div>

      <textarea className="input" rows={2} placeholder="Notes…" value={charData.notes} onChange={e=>upd('notes',e.target.value)}/>
    </div>
  )
}

function AddCharModal({ tracked, onAdd, onClose }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [draft, setDraft] = useState(null)
  const isMobile = window.innerWidth < 600

  const available = CHARACTERS
    .filter(c => !tracked[c.id])
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => b.rarity - a.rarity || a.name.localeCompare(b.name))

  const selectChar = (def) => {
    setSelected(def)
    setDraft(defaultData(def))
  }

  const save = () => {
    if (!selected || !draft) return
    onAdd(selected, draft)
  }

  // ── Mobile: subview when character selected ──────────────────────────────
  if (isMobile) {
    return (
      <div style={{position:'fixed',inset:0,background:'var(--panel)',zIndex:1001,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {/* Header */}
        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
          {selected ? (
            <button onClick={()=>setSelected(null)} style={{background:'transparent',border:'none',cursor:'pointer',color:'var(--text2)',fontSize:'1.1rem',padding:'0 4px',lineHeight:1}}>←</button>
          ) : (
            <button onClick={onClose} style={{background:'transparent',border:'none',cursor:'pointer',color:'var(--text2)',fontSize:'1.1rem',padding:'0 4px',lineHeight:1}}>✕</button>
          )}
          <div style={{fontSize:'.95rem',fontWeight:700,color:'var(--text)',flex:1}}>
            {selected ? selected.name : 'Add Character'}
          </div>
          {selected && (
            <button onClick={save}
              style={{background:'rgba(var(--goldr),0.85)',color:'#fff',border:'none',borderRadius:8,
                padding:'6px 16px',fontSize:'.8rem',fontWeight:600,cursor:'pointer'}}>
              Add
            </button>
          )}
        </div>

        {!selected ? (
          /* List view */
          <>
            <div style={{padding:'10px 14px',borderBottom:'1px solid var(--border)',flexShrink:0}}>
              <input className="input" placeholder="Search characters…" value={search}
                onChange={e=>setSearch(e.target.value)} autoFocus
                style={{width:'100%',fontSize:'.85rem'}}/>
            </div>
            <div style={{overflowY:'auto',flex:1}}>
              {available.map(c => {
                const el = ELEMENTS[c.element]
                return (
                  <div key={c.id} onClick={()=>selectChar(c)}
                    style={{display:'flex',alignItems:'center',gap:12,padding:'11px 16px',
                      borderBottom:'1px solid var(--border)',cursor:'pointer',background:'transparent',
                      transition:'background .1s'}}
                    onTouchStart={e=>e.currentTarget.style.background='var(--hover)'}
                    onTouchEnd={e=>e.currentTarget.style.background='transparent'}>
                    <img src={charIcon(c.id)} style={{width:42,height:42,borderRadius:'50%',objectFit:'cover',border:'1px solid var(--border)',flexShrink:0}}
                      alt={c.name} onError={e=>{e.target.style.display='none'}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'.88rem',fontWeight:600,color:c.rarity===5?'rgba(var(--five),1)':'rgba(var(--four),1)'}}>{c.name}</div>
                      <div style={{fontSize:'.72rem',color:'var(--text3)',display:'flex',alignItems:'center',gap:4,marginTop:2}}>
                        {el&&<img src={el.icon} style={{width:12,height:12}} alt={c.element} onError={e=>{e.target.style.display='none'}}/>}
                        {c.element} · {c.weaponType}
                      </div>
                    </div>
                    <span style={{color:'var(--text3)',fontSize:'1rem'}}>›</span>
                  </div>
                )
              })}
              {available.length===0 && <div style={{padding:'20px',fontSize:'.8rem',color:'var(--text3)',textAlign:'center'}}>No characters found</div>}
            </div>
          </>
        ) : (
          /* Config view */
          <div style={{overflowY:'auto',flex:1,padding:'20px 16px',display:'flex',flexDirection:'column',gap:20}}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <img src={charIcon(selected.id)} style={{width:60,height:60,borderRadius:'50%',objectFit:'cover',border:'2px solid var(--border)'}}
                alt={selected.name} onError={e=>{e.target.style.opacity=0}}/>
              <div>
                <div style={{fontWeight:700,fontSize:'1rem',color:'var(--text)'}}>{selected.name}</div>
                <div style={{fontSize:'.75rem',color:'var(--text3)'}}>{selected.element} · {selected.weaponType}</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:'.82rem',color:'var(--text2)',width:90,flexShrink:0}}>Level</span>
              <input type="number" min="1" max="90" value={draft.level}
                onChange={e=>setDraft(d=>({...d,level:Math.min(90,Math.max(1,+e.target.value||1))}))}
                className="input" style={{width:80,fontSize:'.82rem'}}/>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:'.82rem',color:'var(--text2)',width:90,flexShrink:0}}>Ascension</span>
              <AscTrack value={draft.ascension} onChange={v=>setDraft(d=>({...d,ascension:v}))}/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <span style={{fontSize:'.82rem',color:'var(--text2)',marginBottom:2}}>Talents</span>
              <TalentDots label="Normal" value={draft.talents.aa} onChange={v=>setDraft(d=>({...d,talents:{...d.talents,aa:v}}))}/>
              <TalentDots label="Skill"  value={draft.talents.e}  onChange={v=>setDraft(d=>({...d,talents:{...d.talents,e:v}}))}/>
              <TalentDots label="Burst"  value={draft.talents.q}  onChange={v=>setDraft(d=>({...d,talents:{...d.talents,q:v}}))}/>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Desktop: side-by-side layout ─────────────────────────────────────────
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:1001,display:'flex',alignItems:'center',justifyContent:'center'}}
      onClick={onClose}>
      <div style={{background:'var(--panel)',border:'1px solid var(--border)',borderRadius:14,
        width:'min(780px,92vw)',height:'min(560px,85vh)',display:'flex',flexDirection:'column',overflow:'hidden'}}
        onClick={e=>e.stopPropagation()}>

        <div style={{padding:'18px 24px 14px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div style={{fontSize:'1rem',fontWeight:700,color:'var(--text)'}}>Add Character</div>
          <button onClick={onClose} style={{background:'transparent',border:'none',cursor:'pointer',color:'var(--text3)',fontSize:'1.2rem',lineHeight:1}}>✕</button>
        </div>

        <div style={{display:'flex',flex:1,overflow:'hidden',minHeight:0}}>
          {/* Left: character picker */}
          <div style={{width:260,borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',flexShrink:0}}>
            <div style={{padding:'10px 12px',borderBottom:'1px solid var(--border)'}}>
              <input className="input" placeholder="Search…" value={search}
                onChange={e=>setSearch(e.target.value)} autoFocus
                style={{width:'100%',fontSize:'.78rem'}}/>
            </div>
            <div style={{overflowY:'auto',flex:1}}>
              {available.map(c => {
                const el = ELEMENTS[c.element]
                const isSel = selected?.id === c.id
                return (
                  <div key={c.id} onClick={()=>selectChar(c)}
                    style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',cursor:'pointer',
                      background: isSel ? 'var(--hover)' : 'transparent',
                      borderLeft: isSel ? '2px solid rgba(var(--goldr),1)' : '2px solid transparent',
                      transition:'background .1s'}}>
                    <img src={charIcon(c.id)} style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',border:'1px solid var(--border)',flexShrink:0}}
                      alt={c.name} onError={e=>{e.target.style.display='none'}}/>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:'.78rem',fontWeight:600,color:c.rarity===5?'rgba(var(--five),1)':'rgba(var(--four),1)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</div>
                      <div style={{fontSize:'.65rem',color:'var(--text3)',display:'flex',alignItems:'center',gap:3}}>
                        {el&&<img src={el.icon} style={{width:10,height:10}} alt={c.element} onError={e=>{e.target.style.display='none'}}/>}
                        {c.element}
                      </div>
                    </div>
                  </div>
                )
              })}
              {available.length===0 && <div style={{padding:'12px',fontSize:'.75rem',color:'var(--text3)'}}>No characters found</div>}
            </div>
          </div>

          {/* Right: configure */}
          <div style={{flex:1,overflowY:'auto',padding:'24px 28px',display:'flex',flexDirection:'column',gap:18}}>
            {!selected ? (
              <div style={{color:'var(--text3)',fontSize:'.8rem',marginTop:20,textAlign:'center'}}>Select a character to configure</div>
            ) : (
              <>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <img src={charIcon(selected.id)} style={{width:64,height:64,borderRadius:'50%',objectFit:'cover',border:'2px solid var(--border)'}}
                    alt={selected.name} onError={e=>{e.target.style.opacity=0}}/>
                  <div>
                    <div style={{fontWeight:700,fontSize:'1.05rem',color:'var(--text)'}}>{selected.name}</div>
                    <div style={{fontSize:'.78rem',color:'var(--text3)'}}>{selected.element} · {selected.weaponType}</div>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:'.78rem',color:'var(--text2)',width:80,flexShrink:0}}>Level</span>
                  <input type="number" min="1" max="90" value={draft.level}
                    onChange={e=>setDraft(d=>({...d,level:Math.min(90,Math.max(1,+e.target.value||1))}))}
                    className="input" style={{width:70,fontSize:'.78rem'}}/>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:'.78rem',color:'var(--text2)',width:80,flexShrink:0}}>Ascension</span>
                  <AscTrack value={draft.ascension} onChange={v=>setDraft(d=>({...d,ascension:v}))}/>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:4}}>
                  <span style={{fontSize:'.78rem',color:'var(--text2)',marginBottom:2}}>Talents</span>
                  <TalentDots label="Normal" value={draft.talents.aa} onChange={v=>setDraft(d=>({...d,talents:{...d.talents,aa:v}}))}/>
                  <TalentDots label="Skill"  value={draft.talents.e}  onChange={v=>setDraft(d=>({...d,talents:{...d.talents,e:v}}))}/>
                  <TalentDots label="Burst"  value={draft.talents.q}  onChange={v=>setDraft(d=>({...d,talents:{...d.talents,q:v}}))}/>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{padding:'12px 20px',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'flex-end',gap:8,flexShrink:0}}>
          <button className="btn" onClick={onClose}
            style={{background:'transparent',border:'1px solid var(--border)',color:'var(--text2)'}}>Cancel</button>
          <button className="btn" onClick={save} disabled={!selected}
            style={{background:selected?'rgba(var(--goldr),0.85)':'var(--card)',color:selected?'#fff':'var(--text3)',
              border:'none',opacity:selected?1:0.6,cursor:selected?'pointer':'default'}}>
            Add Character
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CharactersTab({ onTrackedChange, onChange }) {
  const [tracked, setTracked]       = useState(loadTracked)
  const [elFilter, setEl]           = useState('All')
  const [search, setSearch]         = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const trackedIds = Object.keys(tracked)

  const addChar = (def, data) => {
    if (!def || tracked[def.id]) return
    const next = {...tracked, [def.id]: {...data, id: def.id}}
    setTracked(next); saveTracked(next)
    onTrackedChange(new Set(Object.keys(next)))
    onChange?.()
    setShowAddModal(false)
  }
  const updateChar = useCallback((id,data)=>{
    setTracked(prev=>{ const n={...prev,[id]:data}; saveTracked(n); onChange?.(); return n })
  },[])
  const removeChar = useCallback((id)=>{
    setTracked(prev=>{ const n={...prev}; delete n[id]; saveTracked(n); onTrackedChange(new Set(Object.keys(n))); onChange?.(); return n })
  },[onTrackedChange])

  const filtered = trackedIds
    .filter(id=>{
      const def=CHARACTERS.find(c=>c.id===id)
      if(!def) return false
      if(elFilter!=='All'&&def.element!==elFilter) return false
      if(search&&!def.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a,b)=>a.localeCompare(b))

  return (
    <div>
      {showAddModal && (
        <AddCharModal tracked={tracked} onAdd={addChar} onClose={()=>setShowAddModal(false)}/>
      )}

      <div className="chars-bar">
        <h2>Characters <span style={{color:'var(--text3)',fontWeight:400,fontSize:'.8rem'}}>({trackedIds.length})</span></h2>
        <input className="input" placeholder="Search characters…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:150}}/>
        <button onClick={()=>setShowAddModal(true)}
          style={{display:'flex',alignItems:'center',gap:5,fontSize:'.75rem',
            background:'rgba(var(--goldr),0.12)',color:'var(--gold)',
            border:'1px solid rgba(var(--goldr),0.3)',borderRadius:7,padding:'4px 10px',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>
          <span style={{fontSize:'1rem',lineHeight:1}}>+</span> Add character
        </button>
        <div className="filter-pills">
          {['All',...Object.keys(ELEMENTS)].map(el=>(
            <button key={el} className={`pill${elFilter===el?' active':''}`} onClick={()=>setEl(el)}>
              {el!=='All'&&ELEMENTS[el]&&<img src={ELEMENTS[el].icon} alt={el} onError={e=>{e.target.style.display='none'}}/>}
              {el}
            </button>
          ))}
        </div>
      </div>

      {trackedIds.length===0
        ? <div className="empty"><h3>No characters tracked</h3><p>Click "Add character" to get started.</p></div>
        : <div className="char-grid">
            {filtered.map(id=>{
              const def=CHARACTERS.find(c=>c.id===id)
              if(!def) return null
              return <CharCard key={id} charDef={def} charData={tracked[id]} onUpdate={d=>updateChar(id,d)} onRemove={()=>removeChar(id)}/>
            })}
            {(elFilter==='All' && !search) && (
              <div onClick={()=>setShowAddModal(true)}
                style={{background:'var(--card)',border:'2px dashed var(--border)',borderRadius:10,
                  display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                  gap:8,cursor:'pointer',minHeight:160,color:'var(--text3)',transition:'border-color .15s,color .15s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(var(--goldr),0.5)';e.currentTarget.style.color='var(--gold)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text3)'}}>
                <div style={{fontSize:'2rem',lineHeight:1,fontWeight:300}}>+</div>
                <div style={{fontSize:'.75rem',fontWeight:600}}>Add character</div>
              </div>
            )}
          </div>
      }
    </div>
  )
}
