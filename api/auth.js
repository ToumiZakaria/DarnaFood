// api/auth.js — DarnaFood serverless auth API
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET  = process.env.JWT_SECRET || 'darnafood_secret_change_me';

let cachedClient = null;
async function getDb() {
  if (!cachedClient || !cachedClient.topology?.isConnected()) {
    cachedClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 30000,
      tls: true,
      tlsAllowInvalidCertificates: false,
    });
    await cachedClient.connect();
  }
  return cachedClient.db('darnafood');
}


function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function ok(res, data) {
  res.status(200).json({ success: true, ...data });
}
function err(res, msg, code = 400) {
  res.status(code).json({ success: false, error: msg });
}

function verifyToken(req) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  try { return jwt.verify(h.slice(7), JWT_SECRET); }
  catch { return null; }
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // Wrap everything in try-catch so we always return JSON
  try {
    const action = req.query.action;

    // Test the DB connection
    let db, users;
    try {
      db = await getDb();
      users = db.collection('accounts');
    } catch (dbErr) {
      console.error('MongoDB connection error:', dbErr.message);
      return err(res, 'Erreur de connexion à la base de données: ' + dbErr.message, 500);
    }

    /* ── REGISTER ─────────────────────────────────────────────── */
    if (action === 'register') {
      if (req.method !== 'POST') return err(res, 'POST requis');
      const body = req.body;
      if (!body || !body.email || !body.password || !body.name || !body.role) {
        return err(res, 'Champs obligatoires manquants');
      }
      const existing = await users.findOne({ email: body.email.toLowerCase() });
      if (existing) return err(res, 'Cet email est déjà utilisé');

      const passwordHash = await bcrypt.hash(body.password, 10);
      const isCuisinier = body.role === 'cuisinier'
      const newUser = {
        email:       body.email.toLowerCase().trim(),
        passwordHash,
        name:        body.name.trim(),
        firstName:   body.firstName || '',
        lastName:    body.lastName  || '',
        role:        body.role,
        phone:       body.phone     || '',
        wilaya:      body.wilaya    || '',
        commune:     body.commune   || '',
        cat:         body.cat       || '',
        desc:        body.desc      || '',
        cin:         body.cin       || '',
        dob:         body.dob       || '',
        birthWilaya: body.birthWilaya || '',
        menu:        [],
        isKitchenOpen: isCuisinier ? true : undefined,
        isVerified:    isCuisinier ? true : undefined,
        createdAt:   new Date()
      };

      await users.insertOne(newUser);
      const { passwordHash: _, ...safeUser } = newUser;
      const token = jwt.sign({ email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '30d' });
      return ok(res, { user: safeUser, token });
    }

    /* ── LOGIN ────────────────────────────────────────────────── */
    if (action === 'login') {
      if (req.method !== 'POST') return err(res, 'POST requis');
      const { email, password } = req.body || {};
      if (!email || !password) return err(res, 'Email et mot de passe requis');

      const user = await users.findOne({ email: email.toLowerCase().trim() });
      if (!user) return err(res, 'Compte introuvable. Vérifiez votre email.', 401);

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return err(res, 'Mot de passe incorrect', 401);

      const { passwordHash: _, ...safeUser } = user;
      const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
      return ok(res, { user: safeUser, token });
    }

    /* ── GET PROFILE ──────────────────────────────────────────── */
    if (action === 'me') {
      const payload = verifyToken(req);
      if (!payload) return err(res, 'Non autorisé', 401);
      const user = await users.findOne({ email: payload.email });
      if (!user) return err(res, 'Compte introuvable', 404);
      const { passwordHash: _, ...safeUser } = user;
      return ok(res, { user: safeUser });
    }

    /* ── UPDATE PROFILE ───────────────────────────────────────── */
    if (action === 'profile') {
      if (req.method !== 'PUT') return err(res, 'PUT requis');
      const payload = verifyToken(req);
      if (!payload) return err(res, 'Non autorisé', 401);

      const allowed = ['name','firstName','lastName','phone','wilaya','commune','cat','desc','menu'];
      const update = {};
      allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });

      await users.updateOne({ email: payload.email }, { $set: update });
      const user = await users.findOne({ email: payload.email });
      const { passwordHash: _, ...safeUser } = user;
      return ok(res, { user: safeUser });
    }

    /* ── CHANGE PASSWORD ──────────────────────────────────────── */
    if (action === 'password') {
      if (req.method !== 'PUT') return err(res, 'PUT requis');
      const payload = verifyToken(req);
      if (!payload) return err(res, 'Non autorisé', 401);
      const { currentPassword, newPassword } = req.body || {};
      const user = await users.findOne({ email: payload.email });
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) return err(res, 'Mot de passe actuel incorrect', 401);
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await users.updateOne({ email: payload.email }, { $set: { passwordHash } });
      return ok(res, { message: 'Mot de passe mis à jour' });
    }

    /* ── SINGLE COOK BY ID (public, no auth) ─────────────────── */
    if (action === 'cook') {
      if (req.method !== 'GET') return err(res, 'GET requis');
      const { ObjectId } = require('mongodb');
      let cookId;
      try { cookId = new ObjectId(req.query.id); }
      catch { return err(res, 'ID invalide', 400); }
      const cook = await users.findOne({ _id: cookId, role: 'cuisinier' }, {
        projection: { passwordHash: 0, cin: 0, dob: 0, birthWilaya: 0 }
      });
      if (!cook) return err(res, 'Cuisinier introuvable', 404);
      const { _id, ...rest } = cook;
      return ok(res, {
        cook: {
          id: _id.toString(),
          ...rest,
          name: cook.name || (cook.firstName || '') + ' ' + (cook.lastName || ''),
          tagline: cook.desc ? cook.desc.slice(0, 80) : 'Cuisine maison',
          rating: cook.rating || 0,
          reviews: cook.reviews || 0,
          minOrder: cook.minOrder || 300,
          deliveryFee: cook.deliveryFee || 0,
          deliveryTime: cook.deliveryTime || 45,
          open: cook.isKitchenOpen !== false,
          gradient: cook.gradient || 'linear-gradient(135deg,#4A3020,#8B6040)',
          emoji: cook.emoji || '🍽️',
        }
      });
    }

    /* ── LIST COOKS ──────────────────────────────────────────── */
    if (action === 'cooks') {
      if (req.method !== 'GET') return err(res, 'GET requis');
      const cursor = users.find({
        role: 'cuisinier',
        isVerified: true,
        isKitchenOpen: true,
      }, {
        projection: {
          passwordHash: 0,
          cin: 0,
          dob: 0,
          birthWilaya: 0,
        }
      });
      const cooks = await cursor.toArray();
      const mapped = cooks.map(c => ({
        ...c,
        id: c._id.toString(),
        name: c.name || c.firstName + ' ' + c.lastName,
        tagline: c.desc ? c.desc.slice(0, 80) : 'Cuisine maison',
        rating: c.rating || 0,
        reviews: c.reviews || 0,
        minOrder: c.minOrder || 300,
        deliveryFee: c.deliveryFee || 0,
        deliveryTime: c.deliveryTime || 45,
        open: c.isKitchenOpen !== false,
        gradient: c.gradient || 'linear-gradient(135deg,#4A3020,#8B6040)',
        emoji: c.emoji || '🍽️',
        featured: false,
      }));
      return ok(res, { cooks: mapped });
    }

    return err(res, 'Action inconnue: ' + action, 404);

  } catch (globalErr) {
    console.error('API handler error:', globalErr);
    return res.status(500).json({ success: false, error: 'Erreur serveur: ' + globalErr.message });
  }
};
