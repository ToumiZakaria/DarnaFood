import { getToken } from '../utils'

const BASE = import.meta.env.VITE_API_URL || ''
const AUTH_API = `${BASE}/api/auth`
const DISHES_API = `${BASE}/api/dishes`

export async function apiRegister(data) {
  const res = await fetch(`${AUTH_API}?action=register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function apiLogin(email, password) {
  const res = await fetch(`${AUTH_API}?action=login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function apiGetProfile() {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${AUTH_API}?action=me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function apiUpdateProfile(data) {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${AUTH_API}?action=profile`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function apiGetCook(id) {
  const res = await fetch(`${AUTH_API}?action=cook&id=${id}`)
  return res.json()
}

export async function apiGetCooks() {
  const res = await fetch(`${AUTH_API}?action=cooks`)
  return res.json()
}

/* ── Dish CRUD (RESTful) ─────────────────────── */

export async function apiGetDishes() {
  const token = getToken()
  const res = await fetch(DISHES_API, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function apiGetCookDishes(cookId) {
  const res = await fetch(`${DISHES_API}?cookId=${cookId}`)
  return res.json()
}

export async function apiAddDish(dish) {
  const token = getToken()
  const res = await fetch(DISHES_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(dish),
  })
  return res.json()
}

export async function apiUpdateDish(dish) {
  const token = getToken()
  const res = await fetch(DISHES_API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(dish),
  })
  return res.json()
}

export async function apiDeleteDish(id) {
  const token = getToken()
  const res = await fetch(`${DISHES_API}?id=${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
