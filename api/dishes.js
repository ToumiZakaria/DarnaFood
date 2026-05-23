const { MongoClient } = require('mongodb');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
function ok(res, data) { res.status(200).json({ success: true, ...data }) }
function err(res, msg, code = 400) { res.status(code).json({ success: false, error: msg }) }

function verifyToken(req) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  try { return require('jsonwebtoken').verify(h.slice(7), JWT_SECRET); }
  catch { return null; }
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  try {
    let db, users;
    try {
      db = await getDb();
      users = db.collection('accounts');
    } catch (dbErr) {
      console.error('MongoDB connection error:', dbErr.message);
      return err(res, 'Erreur de connexion: ' + dbErr.message, 500);
    }

    if (req.method === 'GET') {
      const cookId = req.query.cookId;
      if (cookId) {
        try {
          const objId = new (require('mongodb').ObjectId)(cookId);
          const cook = await users.findOne({ _id: objId, role: 'cuisinier' }, { projection: { menu: 1 } });
          return ok(res, { dishes: cook?.menu || [] });
        } catch { return err(res, 'ID invalide', 400); }
      }
      const payload = verifyToken(req);
      if (!payload) return err(res, 'Non autorisé', 401);
      const user = await users.findOne({ email: payload.email });
      if (!user) return err(res, 'Compte introuvable', 404);
      return ok(res, { dishes: user.menu || [] });
    }

    if (req.method === 'POST') {
      const payload = verifyToken(req);
      if (!payload) return err(res, 'Non autorisé', 401);
      const dish = {
        id: Date.now(),
        name: req.body.name || '',
        cat: req.body.cat || 'Plats principaux',
        price: Number(req.body.price) || 0,
        desc: req.body.desc || '',
        emoji: req.body.emoji || '🍽️',
        portion: req.body.portion || 'Individuel',
        ingredients: req.body.ingredients || [],
        available: req.body.available !== false,
        photo: req.body.photo || null,
      };
      if (!dish.name || !dish.price) return err(res, 'Nom et prix requis');
      await users.updateOne({ email: payload.email }, { $push: { menu: dish } });
      return ok(res, { dish });
    }

    if (req.method === 'PUT') {
      const payload = verifyToken(req);
      if (!payload) return err(res, 'Non autorisé', 401);
      const dishId = Number(req.body.id);
      if (!dishId) return err(res, 'ID plat requis');
      const setFields = {};
      ['name','cat','price','desc','emoji','portion','ingredients','available','photo'].forEach(f => {
        if (req.body[f] !== undefined) setFields['menu.$.' + f] = req.body[f];
      });
      if (req.body.price !== undefined) setFields['menu.$.price'] = Number(req.body.price) || 0;
      await users.updateOne({ email: payload.email, 'menu.id': dishId }, { $set: setFields });
      return ok(res, { message: 'Plat mis à jour' });
    }

    if (req.method === 'DELETE') {
      const payload = verifyToken(req);
      if (!payload) return err(res, 'Non autorisé', 401);
      const dishId = Number(req.query.id);
      if (!dishId) return err(res, 'ID plat requis');
      await users.updateOne({ email: payload.email }, { $pull: { menu: { id: dishId } } });
      return ok(res, { message: 'Plat supprimé' });
    }

    return err(res, 'Méthode non supportée', 405);

  } catch (globalErr) {
    console.error('Dishes handler error:', globalErr);
    return res.status(500).json({ success: false, error: 'Erreur serveur: ' + globalErr.message });
  }
};
