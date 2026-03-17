import React, { useState } from 'react'
import { CHARACTERS, ELEMENTS, charIcon } from '../data/gameData.js'

const ls  = k=>{ try{return JSON.parse(localStorage.getItem(k))}catch{return null} }
const lss = (k,v)=>localStorage.setItem(k,JSON.stringify(v))

function loadTeams(){ return ls('tv_teams')||[] }
function saveTeams(t){ lss('tv_teams',t) }

function ElIcon({element,size=12}){
  const el=ELEMENTS[element]
  if(!el) return null
  return <img src={el.icon} alt={element} style={{width:size,height:size,objectFit:'contain'}} onError={e=>{e.target.style.display='none'}}/>
}

function CharAvatar({charId,size=52,className=''}){
  const def=CHARACTERS.find(c=>c.id===charId)
  if(!def) return <div className="slot-av" style={{width:size,height:size,background:'var(--input)'}}/>
  const ic=charIcon(def.id)
  const el=ELEMENTS[def.element]
  if(ic) return <img className={`slot-av ${def.rarity===5?'r5':'r4'} ${className}`} style={{width:size,height:size}} src={ic} alt={def.name} onError={e=>{e.target.style.display='none'}}/>
  return (
    <div className={`slot-av ${def.rarity===5?'r5':'r4'} ${className}`} style={{width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center',background:`rgba(${el?.rgb||'200,169,110'},.15)`}}>
      {el&&<ElIcon element={def.element} size={20}/>}
    </div>
  )
}

function TeamSlot({charId,index,onPick,onRemove}){
  const def=charId?CHARACTERS.find(c=>c.id===charId):null
  const el=def?ELEMENTS[def.element]:null
  return (
    <div className={`slot${def?' filled':''}`} onClick={()=>!def&&onPick(index)}>
      {def ? (
        <>
          <button className="slot-remove" onClick={e=>{e.stopPropagation();onRemove(index)}}>✕</button>
          <CharAvatar charId={charId} size={52}/>
          <div className="slot-name">{def.name}</div>
          <div className="slot-el">
            {el&&<ElIcon element={def.element} size={12}/>}
            <span>{def.element}</span>
          </div>
        </>
      ) : (
        <div className="slot-empty">
          <div style={{fontSize:'1.4rem',color:'var(--borderlt)',marginBottom:4}}>+</div>
          <div>Slot {index+1}</div>
          <div style={{fontSize:'.6rem',marginTop:2,color:'var(--text3)'}}>click to add</div>
        </div>
      )}
    </div>
  )
}

function CharPicker({team,onPick,onClose}){
  const [elF, setElF] = useState('All')
  const [search, setSearch] = useState('')
  const inTeam = new Set(team.filter(Boolean))
  const chars = CHARACTERS.filter(c=>{
    if(inTeam.has(c.id)) return true // show but dimmed
    if(elF!=='All'&&c.element!==elF) return false
    if(search&&!c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a,b)=>b.rarity-a.rarity||a.name.localeCompare(b.name))

  return (
    <div className="team-picker">
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
        <span className="stitle" style={{marginBottom:0}}>Pick Character</span>
        <button className="btn btn-ghost btn-sm" style={{marginLeft:'auto'}} onClick={onClose}>✕ Close</button>
      </div>
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
        <input className="input" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:110,fontSize:'.72rem',padding:'4px 8px'}}/>
        {['All',...Object.keys(ELEMENTS)].map(el=>(
          <button key={el} className={`pill${elF===el?' active':''}`} onClick={()=>setElF(el)} style={{fontSize:'.65rem',padding:'2px 7px'}}>
            {el!=='All'&&ELEMENTS[el]&&<img src={ELEMENTS[el].icon} style={{width:11,height:11}} alt={el} onError={e=>{e.target.style.display='none'}}/>}
            {el}
          </button>
        ))}
      </div>
      <div className="team-picker-grid">
        {chars.map(c=>(
          <div key={c.id} className={`pick-char${inTeam.has(c.id)?' in-team':''}`} onClick={()=>!inTeam.has(c.id)&&onPick(c.id)}>
            <CharAvatar charId={c.id} size={44}/>
            <div className="pick-nm">{c.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TeamBuilderTab({ onChange }) {
  const [teams, setTeams]         = useState(loadTeams)
  const [activeIdx, setActiveIdx] = useState(0)
  const [pickingSlot, setPickingSlot] = useState(null) // slot index or null

  const saveAndSet = t=>{ setTeams(t); saveTeams(t); onChange?.() }

  const addTeam = () => {
    const n=[...teams,{id:Date.now(),name:`Team ${teams.length+1}`,slots:[null,null,null,null],notes:''}]
    saveAndSet(n); setActiveIdx(n.length-1)
  }
  const removeTeam = idx => {
    const n=teams.filter((_,i)=>i!==idx)
    saveAndSet(n)
    setActiveIdx(Math.max(0,Math.min(activeIdx,n.length-1)))
  }
  const updateTeam = (idx,patch) => {
    const n=teams.map((t,i)=>i===idx?{...t,...patch}:t)
    saveAndSet(n)
  }
  const setSlot = (teamIdx,slotIdx,charId) => {
    const slots=[...teams[teamIdx].slots]
    slots[slotIdx]=charId
    updateTeam(teamIdx,{slots})
    setPickingSlot(null)
  }
  const removeSlot = (teamIdx,slotIdx) => {
    const slots=[...teams[teamIdx].slots]
    slots[slotIdx]=null
    updateTeam(teamIdx,{slots})
  }

  const team = teams[activeIdx]

  // Elemental resonance checker
  const getResonance = (slots) => {
    const filled = slots.filter(Boolean)
    const elCounts = {}
    filled.forEach(id=>{ const def=CHARACTERS.find(c=>c.id===id); if(def) elCounts[def.element]=(elCounts[def.element]||0)+1 })
    const res=[]
    if(filled.length===4){
      Object.entries(elCounts).forEach(([el,cnt])=>{
        if(cnt>=2){
          const labels={Pyro:'Fervent Flames (+25% ATK)',Cryo:'Shattering Ice (+15% Crit on frozen)',Hydro:'Soothing Water (+25% Max HP)',Electro:'High Voltage (+Energy on EC)',Anemo:'Impetuous Winds (−15% Stamina)',Geo:'Enduring Rock (+Shield)',Dendro:'Sprawling Greenery (+50 EM)'}
          if(labels[el]) res.push(`${el}: ${labels[el]}`)
        }
      })
      if(Object.keys(elCounts).length>=4) res.push('Protective Canopy (+15% all RES)')
    }
    return res
  }

  return (
    <div className="teams-outer">
      {/* Team list panel */}
      <div className="team-list-panel">
        <div className="stitle">Teams ({teams.length})</div>
        <div className="team-list">
          {teams.map((t,i)=>(
            <div key={t.id} className={`team-item${activeIdx===i?' active':''}`} onClick={()=>setActiveIdx(i)}>
              <div className="team-item-name">{t.name}</div>
              <div style={{display:'flex',gap:2}}>
                {t.slots.filter(Boolean).slice(0,4).map(id=>(
                  <CharAvatar key={id} charId={id} size={20}/>
                ))}
              </div>
              <button className="btn btn-danger btn-sm" style={{padding:'1px 6px',fontSize:'.65rem'}}
                onClick={e=>{e.stopPropagation();removeTeam(i)}}>✕</button>
            </div>
          ))}
        </div>
        <button className="btn btn-gold" onClick={addTeam} style={{width:'100%'}}>+ New Team</button>
      </div>

      {/* Team detail */}
      <div className="team-detail">
        {!team ? (
          <div className="empty"><h3>No teams yet</h3><p>Create a team to get started.</p></div>
        ) : (
          <>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <input className="input" value={team.name}
                onChange={e=>updateTeam(activeIdx,{name:e.target.value})}
                style={{fontWeight:600,fontSize:'.95rem',padding:'5px 10px'}}/>
            </div>

            <div className="team-slots">
              {team.slots.map((charId,si)=>(
                <TeamSlot key={si} charId={charId} index={si}
                  onPick={(idx)=>setPickingSlot(idx)}
                  onRemove={(idx)=>removeSlot(activeIdx,idx)}/>
              ))}
            </div>

            {/* Elemental resonance */}
            {(() => {
              const res=getResonance(team.slots)
              return res.length>0 ? (
                <div style={{background:'rgba(var(--goldr),.06)',border:'1px solid rgba(var(--goldr),.2)',borderRadius:8,padding:'9px 12px',marginBottom:12}}>
                  <div className="stitle" style={{marginBottom:4}}>Elemental Resonance</div>
                  {res.map((r,i)=><div key={i} style={{fontSize:'.76rem',color:'var(--gold)',marginBottom:2}}>✦ {r}</div>)}
                </div>
              ) : null
            })()}

            {/* Notes */}
            <div className="team-notes">
              <div className="stitle">Notes</div>
              <textarea className="input" rows={3} placeholder="Team comp notes, rotation, tips…"
                value={team.notes} onChange={e=>updateTeam(activeIdx,{notes:e.target.value})}/>
            </div>

            {/* Char picker */}
            {pickingSlot!==null && (
              <div style={{marginTop:14}}>
                <CharPicker
                  team={team.slots}
                  onPick={(charId)=>setSlot(activeIdx,pickingSlot,charId)}
                  onClose={()=>setPickingSlot(null)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
