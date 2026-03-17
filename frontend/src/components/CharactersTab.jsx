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

export default function CharactersTab({ onTrackedChange, onChange }) {
  const [tracked, setTracked] = useState(loadTracked)
  const [elFilter, setEl]     = useState('All')
  const [search, setSearch]   = useState('')
  const [addSearch, setAddSearch] = useState('')
  const [addOpen, setAddOpen]   = useState(false)

  const trackedIds = Object.keys(tracked)
  const available  = CHARACTERS.filter(c=>!tracked[c.id])

  // Filtered available for the add dropdown
  const addResults = available
    .filter(c=>{
      if(elFilter!=='All'&&c.element!==elFilter) return false
      if(addSearch&&!c.name.toLowerCase().includes(addSearch.toLowerCase())) return false
      return true
    })
    .sort((a,b)=>b.rarity-a.rarity||a.name.localeCompare(b.name))

  const addChar = (def) => {
    if(!def||tracked[def.id]) return
    const next={...tracked,[def.id]:defaultData(def)}
    setTracked(next); saveTracked(next)
    onTrackedChange(new Set(Object.keys(next)))
    onChange?.()
    setAddSearch(''); setAddOpen(false)
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
      <div className="chars-bar">
        <h2>Characters <span style={{color:'var(--text3)',fontWeight:400,fontSize:'.8rem'}}>({trackedIds.length})</span></h2>
        <input className="input" placeholder="Search tracked…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:130}}/>
        <div className="filter-pills">
          {['All',...Object.keys(ELEMENTS)].map(el=>(
            <button key={el} className={`pill${elFilter===el?' active':''}`} onClick={()=>setEl(el)}>
              {el!=='All'&&ELEMENTS[el]&&<img src={ELEMENTS[el].icon} alt={el} onError={e=>{e.target.style.display='none'}}/>}
              {el}
            </button>
          ))}
        </div>
      </div>

      {/* Searchable add character */}
      <div className="add-row" style={{position:'relative'}}>
        <div style={{flex:1,position:'relative'}}>
          <input className="input" placeholder="Search to add a character…" value={addSearch}
            style={{width:'100%'}}
            onChange={e=>{setAddSearch(e.target.value);setAddOpen(true)}}
            onFocus={()=>setAddOpen(true)}
            onBlur={()=>setTimeout(()=>setAddOpen(false),150)}/>
          {addOpen && addSearch && (
            <div className="char-add-dropdown">
              {addResults.slice(0,10).map(c=>{
                const el=ELEMENTS[c.element]
                return (
                  <div key={c.id} className="char-add-opt" onMouseDown={()=>addChar(c)}>
                    <img src={charIcon(c.id)} style={{width:24,height:24,borderRadius:'50%',objectFit:'cover',border:'1px solid var(--border)'}}
                      alt={c.name} onError={e=>{e.target.style.display='none'}}/>
                    {el&&<img src={el.icon} style={{width:13,height:13}} alt={c.element} onError={e=>{e.target.style.display='none'}}/>}
                    <span style={{color:c.rarity===5?'rgba(var(--five),1)':'rgba(var(--four),1)',fontSize:'.8rem'}}>
                      {'★'.repeat(c.rarity)} {c.name}
                    </span>
                    <span style={{marginLeft:'auto',fontSize:'.65rem',color:'var(--text3)'}}>{c.element}</span>
                  </div>
                )
              })}
              {addResults.length===0&&<div style={{padding:'8px 12px',fontSize:'.75rem',color:'var(--text3)'}}>No characters found</div>}
            </div>
          )}
        </div>
      </div>

      {filtered.length===0
        ? <div className="empty"><h3>No characters tracked{elFilter!=='All'?` for ${elFilter}`:''}{search?` matching "${search}"`:''}</h3><p>Search above to add characters.</p></div>
        : <div className="char-grid">
            {filtered.map(id=>{
              const def=CHARACTERS.find(c=>c.id===id)
              if(!def) return null
              return <CharCard key={id} charDef={def} charData={tracked[id]} onUpdate={d=>updateChar(id,d)} onRemove={()=>removeChar(id)}/>
            })}
          </div>
      }
    </div>
  )
}
