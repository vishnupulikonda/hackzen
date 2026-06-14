const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const path       = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'hackathon-registration')));

// ── MongoDB Connection ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.error('❌ MongoDB Error:', err.message); process.exit(1); });

// ── Schema & Model ──
const registrationSchema = new mongoose.Schema({
  name:          String,
  email:         String,
  phone:         String,
  year:          String,
  branch:        String,
  institution:   String,
  city:          String,
  pincode:       String,
  hackathon_exp: String,
  teamname:      String,
  members:       String,
  utr:           String
}, { timestamps: true });

const Registration = mongoose.model('Registration', registrationSchema);

// ── Routes ──

// POST /api/register — save new registration
app.post('/api/register', async (req, res) => {
  try {
    const reg = new Registration(req.body);
    await reg.save();
    console.log('📝 New registration:', reg.name, '|', reg.teamname);
    res.json({ success: true, message: 'Registration saved!', id: reg._id });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/registrations — fetch all (admin)
app.get('/api/registrations', async (req, res) => {
  try {
    const regs = await Registration.find().sort({ createdAt: -1 });
    res.json({ success: true, count: regs.length, data: regs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/registrations — clear all
app.delete('/api/registrations', async (req, res) => {
  try {
    await Registration.deleteMany({});
    res.json({ success: true, message: 'All registrations deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve form at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'hackathon-registration', 'index.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'hackathon-registration', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 HackZen server running at http://localhost:${PORT}`);
  console.log(`📋 Admin panel: http://localhost:${PORT}/admin`);
});
