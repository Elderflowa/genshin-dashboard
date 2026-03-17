const express = require('express')
const crypto  = require('crypto')
const fs      = require('fs')
const path    = require('path')
const cors    = require('cors')

const app     = express()
const DB_FILE = path.join(__dirname, 'data', 'db.json')
const PORT    = 4000

// ── helpers ──────────────────────────────────────────────────────────────────
function loadDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) } catch { return {} }
}
function saveDB(db) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true })
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}
function hashPass(pass) {
  return crypto.createHash('sha256').update(pass.trim()).digest('hex')
}
function getToken(req) {
  const auth = req.headers['authorization'] || ''
  return auth.startsWith('Bearer ') ? auth.slice(7) : null
}

// ── middleware ────────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json({ limit: '2mb' }))

function auth(req, res, next) {
  const token = getToken(req)
  if (!token) return res.status(401).json({ error: 'No passphrase provided' })
  // token IS the hashed passphrase - just validate it's a valid sha256 hex string
  if (!/^[a-f0-9]{64}$/.test(token)) return res.status(401).json({ error: 'Invalid token' })
  req.profileKey = token
  next()
}

// ── routes ───────────────────────────────────────────────────────────────────

// POST /api/auth/check — verify passphrase works (always succeeds if format valid)
// Returns whether this profile has any saved data yet
app.post('/api/auth/check', auth, (req, res) => {
  const db = loadDB()
  const exists = !!db[req.profileKey]
  res.json({ ok: true, hasData: exists })
})

// GET /api/sync — load all data for this profile
app.get('/api/sync', auth, (req, res) => {
  const db = loadDB()
  const profile = db[req.profileKey] || {}
  res.json({ ok: true, data: profile.data || null, updatedAt: profile.updatedAt || null })
})

// PUT /api/sync — save all data for this profile
app.put('/api/sync', auth, (req, res) => {
  const { data } = req.body
  if (!data || typeof data !== 'object') return res.status(400).json({ error: 'Invalid data' })
  const db = loadDB()
  db[req.profileKey] = { data, updatedAt: new Date().toISOString() }
  saveDB(db)
  res.json({ ok: true, updatedAt: db[req.profileKey].updatedAt })
})

// DELETE /api/sync — wipe this profile's data
app.delete('/api/sync', auth, (req, res) => {
  const db = loadDB()
  delete db[req.profileKey]
  saveDB(db)
  res.json({ ok: true })
})

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }))

// ── start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Teyvat sync backend running on :${PORT}`))
