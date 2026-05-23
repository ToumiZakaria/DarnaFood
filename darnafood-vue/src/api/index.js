import { getToken, getAuthUser } from '../utils'

const API = '/api/auth'

export async function apiRegister(data) {
  const res = await fetch(`${API}?action=register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function apiLogin(email, password) {
  const res = await fetch(`${API}?action=login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function apiGetProfile() {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${API}?action=me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function apiUpdateProfile(data) {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${API}?action=profile`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function apiGetCook(id) {
  const res = await fetch(`/api/auth?action=cook&id=${id}`)
  return res.json()
}

export async function apiGetCooks() {
  const res = await fetch('/api/auth?action=cooks')
  return res.json()
}

export async function apiChangePassword(currentPassword, newPassword) {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${API}?action=password`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  return res.json()
}
