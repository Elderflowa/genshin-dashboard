import React, { useState, useCallback, useEffect } from 'react'
import DailyTab       from './components/DailyTab.jsx'
import CharactersTab  from './components/CharactersTab.jsx'
import WeaponsTab     from './components/WeaponsTab.jsx'
import ArtifactsTab   from './components/ArtifactsTab.jsx'
import TeamBuilderTab from './components/TeamBuilderTab.jsx'
import { SyncProvider, SyncBadge, useSync } from './sync.jsx'

const TABS = [
  {id:'daily',     label:'☀  Daily'},
  {id:'chars',     label:'Characters'},
  {id:'weapons',   label:'Weapons'},
  {id:'artifacts', label:'Artifacts'},
  {id:'teams',     label:'Team Builder'},
]

function loadTrackedIds(){
  try{const d=JSON.parse(localStorage.getItem('tv_chars')||'{}');return new Set(Object.keys(d))}catch{return new Set()}
}

const dateStr = () => new Date().toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'})

function AppInner() {
  const [tab, setTab]         = useState('daily')
  const { scheduleSave, syncVersion } = useSync()
  const [theme, setTheme]     = useState(()=>localStorage.getItem('tv_theme')||'dark')

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('tv_theme', theme)
  }, [theme])

  // syncVersion changes on login/logout → loadTrackedIds re-runs with fresh localStorage
  const [tracked, setTracked] = useState(() => loadTrackedIds())

  // When syncVersion changes, re-read tracked from (now-updated) localStorage
  const prevVersion = React.useRef(syncVersion)
  if (prevVersion.current !== syncVersion) {
    prevVersion.current = syncVersion
    setTracked(loadTrackedIds())
  }

  const handleTracked = useCallback(ids => { setTracked(ids); scheduleSave() }, [scheduleSave])
  const handleChange  = useCallback(() => scheduleSave(), [scheduleSave])

  const isLight = theme === 'light'

  return (
    <div className="app">
      <header className="hdr">
        <div className="hdr-logo">Traveler's Guide <span>self-hosted</span></div>
        <div className="hdr-date">{dateStr()}</div>
        <button onClick={()=>setTheme(isLight?'dark':'light')} title="Toggle theme" style={{
          marginLeft:6, padding:'5px 7px', borderRadius:6,
          background:'var(--card)', border:'1px solid var(--border)',
          color:'var(--text2)', cursor:'pointer', transition:'all .13s',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {isLight ? (
            // Moon icon
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            // Sun icon
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>
        <SyncBadge/>
      </header>
      <nav className="tabs">
        {TABS.map(t=>(
          <button key={t.id} className={`tab${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </nav>
      <main>
        {/* key={syncVersion} forces full remount on login/logout so all useState()
            initialisers re-run and pick up the freshly-written localStorage values */}
        {tab==='daily'     && <DailyTab     key={syncVersion} onChange={handleChange}/>}
        {tab==='chars'     && <CharactersTab key={syncVersion} onTrackedChange={handleTracked} onChange={handleChange}/>}
        {tab==='weapons'   && <WeaponsTab    key={syncVersion} onChange={handleChange}/>}
        {tab==='artifacts' && <ArtifactsTab  key={syncVersion}/>}
        {tab==='teams'     && <TeamBuilderTab key={syncVersion} onChange={handleChange}/>}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <SyncProvider>
      <AppInner/>
    </SyncProvider>
  )
}
