import React, { useState, useCallback, useEffect } from 'react'
import DailyTab       from './components/DailyTab.jsx'
import CharactersTab  from './components/CharactersTab.jsx'
import WeaponsTab     from './components/WeaponsTab.jsx'
import ArtifactsTab   from './components/ArtifactsTab.jsx'
import TeamBuilderTab from './components/TeamBuilderTab.jsx'
import { SyncProvider, SyncBadge, useSync } from './sync.jsx'

const SunIcon    = ()=><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
const PersonIcon = ()=><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const SwordIcon  = ()=><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M2 2l20 20"/></svg>
const StarIcon   = ()=><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const TeamsIcon  = ()=><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>

const TABS = [
  {id:'daily',     label:'Daily',      icon:SunIcon},
  {id:'chars',     label:'Characters', icon:PersonIcon},
  {id:'weapons',   label:'Weapons',    icon:SwordIcon},
  {id:'artifacts', label:'Artifacts',  icon:StarIcon},
  {id:'teams',     label:'Teams',      icon:TeamsIcon},
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
        <div className="hdr-logo">Traveler's Guide <a href="https://github.com/elderflowa/travelers-guide" target="_blank" rel="noopener noreferrer">
          <span className="hdr-logo-text">v106</span>
          <span className="hdr-logo-gh" style={{display:'none',alignItems:'center',marginLeft:6,opacity:0.6}}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </span>
        </a></div>
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
          <button key={t.id} className={`tab${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>
            {t.id==='daily' ? '☀ Daily' : t.label}
          </button>
        ))}
      </nav>
      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {TABS.map(t=>{
          const Icon = t.icon
          return (
            <button key={t.id} className={`mobile-nav-item${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>
              <Icon/>
              <span>{t.label}</span>
            </button>
          )
        })}
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
