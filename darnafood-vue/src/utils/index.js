export function dzd(n) {
  return new Intl.NumberFormat('fr-DZ').format(n) + ' DA'
}

export function toast(msg, type = 'default') {
  const host = document.getElementById('toast-host')
  if (!host) return
  const el = document.createElement('div')
  el.className = `toast ${type}`
  el.textContent = msg
  host.appendChild(el)
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300) }, 2500)
}

export function getAccounts() {
  try { return JSON.parse(localStorage.getItem('df_accounts') || '[]') }
  catch { return [] }
}

export function saveAccounts(accounts) {
  localStorage.setItem('df_accounts', JSON.stringify(accounts))
}

export function getToken() {
  return localStorage.getItem('df_token')
}

export function setToken(t) {
  if (t) localStorage.setItem('df_token', t)
  else localStorage.removeItem('df_token')
}

export function getAuthUser() {
  try { return JSON.parse(localStorage.getItem('df_user') || 'null') }
  catch { return null }
}

export function setAuthUser(u) {
  if (u) localStorage.setItem('df_user', JSON.stringify(u))
  else localStorage.removeItem('df_user')
}
