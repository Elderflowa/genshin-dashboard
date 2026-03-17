import React, { useState } from 'react'
import { ARTIFACT_SETS, artifactIcon } from '../data/gameData.js'

const REGIONS = ['All','Mondstadt','Liyue','Inazuma','Sumeru','Fontaine','Natlan','Nod-Krai']

// Map set id → region
const SET_REGIONS = {
  gladiators_finale:'Mondstadt', wanderers_troupe:'Mondstadt', maiden_beloved:'Mondstadt',
  viridescent_venerer:'Mondstadt', archaic_petra:'Mondstadt', retracing_bolide:'Mondstadt',
  thundering_fury:'Mondstadt', thundersoother:'Mondstadt', crimson_witch_of_flames:'Mondstadt',
  lavawalker:'Mondstadt', heart_of_depth:'Mondstadt', blizzard_strayer:'Mondstadt',
  noblesse_oblige:'Mondstadt', bloodstained_chivalry:'Mondstadt', pale_flame:'Mondstadt',
  tenacity_of_the_millelith:'Liyue', husk_of_opulent_dreams:'Liyue', 'ocean-hued_clam':'Inazuma',
  vermillion_hereafter:'Liyue', echoes_of_an_offering:'Liyue',
  emblem_of_severed_fate:'Inazuma', shimenawas_reminiscence:'Inazuma',
  deepwood_memories:'Sumeru', gilded_dreams:'Sumeru', desert_pavilion_chronicle:'Sumeru',
  flower_of_paradise_lost:'Sumeru', nymphs_dream:'Sumeru', vourukashas_glow:'Sumeru',
  marechaussee_hunter:'Fontaine', golden_troupe:'Fontaine', song_of_days_past:'Fontaine',
  nighttime_whispers_in_the_echoing_woods:'Fontaine', fragment_of_harmonic_whimsy:'Fontaine',
  unfinished_reverie:'Fontaine',
  obsidian_codex:'Natlan', scroll_of_the_hero_of_cinder_city:'Natlan',
  finale_of_the_deep:'Natlan', long_nights_oath:'Natlan',
  night_of_the_skys_unveiling:'Nod-Krai', silken_moon_serenade:'Nod-Krai',
  aubade_of_morningstar_and_moon:'Nod-Krai', a_day_carved_from_rising_winds:'Nod-Krai',
}

export default function ArtifactsTab() {
  const [search, setSearch]         = useState('')
  const [region, setRegion]         = useState('All')
  const [expanded, setExpanded]     = useState(null)

  const sets = ARTIFACT_SETS.filter(a => {
    if(a.id==='none') return false
    if(region!=='All' && SET_REGIONS[a.id]!==region) return false
    if(search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <div className="weapons-toolbar" style={{flexWrap:'wrap',gap:8,marginBottom:14}}>
        <input className="input" placeholder="Search artifact set…" value={search}
          onChange={e=>setSearch(e.target.value)} style={{width:200}}/>
        <div className="filter-pills">
          {REGIONS.map(r=>(
            <button key={r} className={`pill${region===r?' active':''}`} onClick={()=>setRegion(r)}>
              {r}
            </button>
          ))}
        </div>
        <span style={{marginLeft:'auto',fontSize:'.72rem',color:'var(--text3)'}}>{sets.length} sets</span>
      </div>

      <div className="artifact-grid">
        {sets.map(a => {
          const icon = artifactIcon(a.enkaId)
          const isOpen = expanded===a.id
          return (
            <div key={a.id} className={`artifact-card${isOpen?' open':''}`}
              onClick={()=>setExpanded(isOpen?null:a.id)}>
              <div className="artifact-card-head">
                {icon
                  ? <img src={icon} alt={a.name}
                      className="artifact-icon"
                      onError={e=>{e.target.style.display='none'}}/>
                  : <div className="artifact-icon artifact-icon-ph"/>
                }
                <div style={{flex:1,minWidth:0}}>
                  <div className="artifact-name">{a.name}</div>
                  <div className="artifact-region">{SET_REGIONS[a.id]||''}</div>
                </div>
                <span style={{fontSize:'.65rem',color:'var(--text3)',flexShrink:0}}>{isOpen?'▲':'▼'}</span>
              </div>
              {isOpen && (
                <div className="artifact-bonus">
                  {a.bonus2 && <div className="artifact-bonus-row"><span className="bonus-pc">2pc</span><span>{a.bonus2}</span></div>}
                  {a.bonus4 && <div className="artifact-bonus-row"><span className="bonus-pc">4pc</span><span>{a.bonus4}</span></div>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
