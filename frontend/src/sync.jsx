import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const SYNC_KEYS = [
  'tv_chars', 'tv_teams', 'tv_weapons_owned',
  'tv_daily', 'tv_weekly', 'tv_monthly',
  'tv_active_team', 'tv_ev_dismissed', 'tv_plants_ts', 'tv_crystal_ts',
]
const PASS_KEY  = 'tv_sync_pass'
const API       = '/api'

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str.trim()))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')
}

function collectData() {
  const out = {}
  for (const k of SYNC_KEYS) {
    const v = localStorage.getItem(k)
    if (v !== null) out[k] = v
  }
  return out
}

function applyData(data) {
  if (!data) return
  for (const k of SYNC_KEYS) {
    if (k in data) localStorage.setItem(k, data[k])
  }
}

function clearData() {
  for (const k of SYNC_KEYS) localStorage.removeItem(k)
}

const SyncContext = createContext(null)

export function SyncProvider({ children }) {
  const [passHash,    setPassHash]    = useState(() => localStorage.getItem(PASS_KEY) || null)
  const [status,      setStatus]      = useState('idle')
  const [lastSync,    setLastSync]    = useState(null)
  const [showModal,   setShowModal]   = useState(false)
  // syncVersion bumps whenever localStorage data changes due to a sync event,
  // causing all tab components to remount and read fresh values
  const [syncVersion, setSyncVersion] = useState(0)
  const saveTimer = useRef(null)

  const bumpVersion = useCallback(() => setSyncVersion(v => v + 1), [])

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${passHash}`,
  }), [passHash])

  // Load from backend → overwrite localStorage → bump version so UI re-reads
  const loadFromServer = useCallback(async (hash) => {
    const h = hash || passHash
    if (!h) return
    setStatus('syncing')
    try {
      const r = await fetch(`${API}/sync`, {
        headers: { Authorization: `Bearer ${h}` }
      })
      if (!r.ok) throw new Error(r.status)
      const { data, updatedAt } = await r.json()
      if (data) {
        applyData(data)
        setLastSync(updatedAt)
        bumpVersion()   // ← triggers remount of all tab components
      }
      setStatus('ok')
    } catch {
      setStatus('offline')
    }
  }, [passHash, bumpVersion])

  // Save localStorage → backend (debounced)
  const saveToServer = useCallback(async () => {
    if (!passHash) return
    setStatus('syncing')
    try {
      const r = await fetch(`${API}/sync`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ data: collectData() }),
      })
      if (!r.ok) throw new Error(r.status)
      const { updatedAt } = await r.json()
      setLastSync(updatedAt)
      setStatus('ok')
    } catch {
      setStatus('offline')
    }
  }, [passHash, headers])

  const scheduleSave = useCallback(() => {
    if (!passHash) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(saveToServer, 3000)
  }, [passHash, saveToServer])

  // Login: hash passphrase, store, load data from server
  const setPassphrase = useCallback(async (plaintext) => {
    if (!plaintext.trim()) return
    const hash = await sha256(plaintext)
    localStorage.setItem(PASS_KEY, hash)
    setPassHash(hash)
    setShowModal(false)
    await loadFromServer(hash)
  }, [loadFromServer])

  // Logout: clear passphrase + wipe all synced data from localStorage + bump version
  const clearPassphrase = useCallback(() => {
    localStorage.removeItem(PASS_KEY)
    setPassHash(null)
    setStatus('idle')
    setLastSync(null)
    clearData()       // ← wipe stale data so next user starts fresh
    bumpVersion()     // ← triggers remount so UI reflects empty state
  }, [bumpVersion])

  // On mount: if stored passphrase exists, load from server immediately
  useEffect(() => {
    if (passHash) loadFromServer(passHash)
  }, []) // eslint-disable-line

  // Auto-save every 60s
  useEffect(() => {
    if (!passHash) return
    const t = setInterval(saveToServer, 60000)
    return () => clearInterval(t)
  }, [passHash, saveToServer])

  // Save on page hide
  useEffect(() => {
    const handler = () => { if (passHash) saveToServer() }
    const onVisibility = () => { if (document.visibilityState === 'hidden') handler() }
    window.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('beforeunload', handler)
    return () => {
      window.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('beforeunload', handler)
    }
  }, [passHash, saveToServer])

  return (
    <SyncContext.Provider value={{ passHash, status, lastSync, syncVersion, scheduleSave, saveToServer, setPassphrase, clearPassphrase, showModal, setShowModal }}>
      {children}
      {showModal && <PassphraseModal onSubmit={setPassphrase} onClose={() => setShowModal(false)}/>}
    </SyncContext.Provider>
  )
}

export function useSync() {
  return useContext(SyncContext)
}

// ── Passphrase Modal ──────────────────────────────────────────────────────────
function PassphraseModal({ onSubmit, onClose }) {
  const [val, setVal]   = useState('')
  const [show, setShow] = useState(false)

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1000,
      display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <div style={{
        background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:12,
        padding:'28px 32px', width:340, display:'flex', flexDirection:'column', gap:16
      }}>
        <div style={{fontSize:'1.05rem', fontWeight:700, color:'var(--text)'}}>Sync passphrase</div>
        <div style={{fontSize:'.78rem', color:'var(--text3)', lineHeight:1.5}}>
          Enter the same passphrase on all your devices to sync your data.
          It never leaves your device unencrypted — only a hash is sent.
        </div>
        <div style={{position:'relative'}}>
          <input
            type={show ? 'text' : 'password'}
            className="input"
            placeholder="e.g. teyvat-traveler-2025"
            value={val}
            onChange={e=>setVal(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&val.trim()&&onSubmit(val)}
            autoFocus
            style={{width:'100%', paddingRight:36}}
          />
          <button onClick={()=>setShow(s=>!s)} style={{
            position:'absolute', right:8, top:'50%', transform:'translateY(-50%)',
            background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:'.8rem'
          }}>{show ? '🙈' : '👁'}</button>
        </div>
        <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
          <button className="btn" onClick={onClose}
            style={{background:'transparent', border:'1px solid var(--border)', color:'var(--text2)'}}>
            Cancel
          </button>
          <button className="btn" onClick={()=>val.trim()&&onSubmit(val)}
            style={{background:'rgba(var(--accent),0.9)', color:'#fff'}}
            disabled={!val.trim()}>
            Connect
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sync Status Badge ─────────────────────────────────────────────────────────
export function SyncBadge() {
  const { passHash, status, lastSync, saveToServer, clearPassphrase, setShowModal } = useSync()

  const fmtTime = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
  }

  const icon  = { idle:'☁', syncing:'↻', ok:'✓', error:'⚠', offline:'✗' }[status] || '☁'
  const color = { idle:'var(--text3)', syncing:'rgba(var(--accent),1)', ok:'rgba(var(--ok),0.9)', error:'#e57', offline:'#e57' }[status] || 'var(--text3)'

  if (!passHash) {
    return (
      <button onClick={()=>setShowModal(true)} style={{
        display:'flex', alignItems:'center', gap:5, fontSize:'.7rem',
        color:'var(--text3)', background:'transparent', border:'1px solid var(--border)',
        borderRadius:6, padding:'3px 9px', cursor:'pointer', whiteSpace:'nowrap'
      }}>
        ☁ Enable sync
      </button>
    )
  }

  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      <button onClick={saveToServer} title="Save now" style={{
        display:'flex', alignItems:'center', gap:4, fontSize:'.7rem',
        color, background:'transparent', border:'1px solid var(--border)',
        borderRadius:6, padding:'3px 9px', cursor:'pointer', whiteSpace:'nowrap'
      }}>
        <span style={{display:'inline-block', animation: status==='syncing'?'spin 1s linear infinite':'none'}}>
          {icon}
        </span>
        {status==='ok' && lastSync ? `Synced ${fmtTime(lastSync)}` : status==='syncing' ? 'Syncing…' : status==='offline' ? 'Offline' : 'Sync'}
      </button>
      <button onClick={clearPassphrase} title="Disconnect sync" style={{
        fontSize:'.65rem', color:'var(--text3)', background:'transparent',
        border:'none', cursor:'pointer', padding:'2px 4px'
      }}>✕</button>
    </div>
  )
}
