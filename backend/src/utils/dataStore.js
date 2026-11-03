const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const INITIAL_DATA = {
  announcements: [
    {
      _id: 'ann-1',
      title: 'Admissions Open for Session 2026-27 (Nursery to Class XII)',
      content: 'Master Mind Public School (MPBSE Affiliated) welcomes applications for the upcoming 2026-27 session. Merit scholarships, state-of-the-art digital classrooms, and safe bus transport are available. Register online or visit our campus office.',
      date: new Date('2026-04-02').toISOString(),
      isActive: true,
      createdAt: new Date('2026-04-02').toISOString()
    },
    {
      _id: 'ann-2',
      title: 'Annual Inter-House Sports Championship 2026',
      content: 'Campus athletic sports complex will host track and field events, cricket, badminton, and kho-kho trials this Wednesday. Students must report in full sports uniform.',
      date: new Date('2026-03-25').toISOString(),
      isActive: true,
      createdAt: new Date('2026-03-25').toISOString()
    },
    {
      _id: 'ann-3',
      title: 'Quarterly Parent-Teacher Meeting (PTM) for Classes 1 to 12',
      content: 'Parent-Teacher Conference scheduled for this Saturday from 9:00 AM to 1:00 PM. Parents are invited to discuss academic progress and report cards with class teachers.',
      date: new Date('2026-03-18').toISOString(),
      isActive: true,
      createdAt: new Date('2026-03-18').toISOString()
    },
    {
      _id: 'ann-4',
      title: 'District High Scorers & Merit Felicitations Announced',
      content: 'Heartiest congratulations to our Class 10 and 12 toppers for achieving distinction marks across Pipariya district. Special recognition awards will be presented on Saturday.',
      date: new Date('2026-03-10').toISOString(),
      isActive: true,
      createdAt: new Date('2026-03-10').toISOString()
    }
  ],
  jobs: [
    {
      _id: 'job-1',
      title: 'PGT - Senior Physics & Mathematics Educator',
      description: 'Seeking dynamic educators for Senior Secondary Classes (XI & XII). Responsible for curriculum delivery, practical lab experiments, and state board examination preparation.',
      requirements: 'M.Sc in Physics or Mathematics with B.Ed. Minimum 2-3 years teaching experience in MPBSE or CBSE board schools.',
      applyLink: 'https://forms.gle/L6r7K6nw5DwewRPF8',
      isActive: true,
      createdAt: new Date('2026-04-01').toISOString()
    },
    {
      _id: 'job-2',
      title: 'TGT - English & Social Sciences Teacher',
      description: 'Responsible for nurturing communicative fluency, English literature, and social studies for Middle Wing (Classes VI to VIII).',
      requirements: 'B.A. / M.A. in English with B.Ed. Strong communicative pedagogy and passion for student engagement.',
      applyLink: 'https://forms.gle/L6r7K6nw5DwewRPF8',
      isActive: true,
      createdAt: new Date('2026-03-28').toISOString()
    },
    {
      _id: 'job-3',
      title: 'Primary Wing (PRT) - Mother Teacher',
      description: 'Looking for caring and creative early childhood educators for Nursery to Class 2. Focus on phonics, numeracy, and activity-based learning.',
      requirements: 'Graduation with D.El.Ed / NTT / B.Ed. Warm disposition and love for foundational learning.',
      applyLink: 'https://forms.gle/L6r7K6nw5DwewRPF8',
      isActive: true,
      createdAt: new Date('2026-03-20').toISOString()
    },
    {
      _id: 'job-4',
      title: 'Campus Physical Education Instructor & Sports Coach',
      description: 'Lead morning physical assemblies, athletic track events, basketball, cricket, and football training across our sports complex.',
      requirements: 'B.P.Ed or M.P.Ed with state/national level athletics experience.',
      applyLink: 'https://forms.gle/L6r7K6nw5DwewRPF8',
      isActive: true,
      createdAt: new Date('2026-03-15').toISOString()
    }
  ],
  images: [
    {
      _id: 'img-1',
      imageUrl: '/gallery/schoolphoto.png',
      caption: 'Main Academic Campus & Courtyard, Pipariya',
      category: 'Campus',
      createdAt: new Date('2026-01-10').toISOString()
    },
    {
      _id: 'img-2',
      imageUrl: '/gallery/sportcmplex.png',
      caption: 'Inter-House Sports Complex & Playground',
      category: 'Event',
      createdAt: new Date('2026-01-12').toISOString()
    },
    {
      _id: 'img-3',
      imageUrl: '/gallery/classrooms.png',
      caption: 'Modern Digital Smart Classrooms',
      category: 'Campus',
      createdAt: new Date('2026-01-14').toISOString()
    },
    {
      _id: 'img-4',
      imageUrl: '/gallery/Directorsir.png',
      caption: 'School Leadership & Management Mentorship',
      category: 'Leadership',
      createdAt: new Date('2026-01-15').toISOString()
    }
  ]
};

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(INITIAL_DATA, null, 2), 'utf8');
  }
}

function readStore() {
  try {
    ensureStore();
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading dataStore:', err.message);
    return INITIAL_DATA;
  }
}

function writeStore(data) {
  try {
    ensureStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing dataStore:', err.message);
  }
}

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

module.exports = {
  readStore,
  writeStore,
  isDbConnected,
};

