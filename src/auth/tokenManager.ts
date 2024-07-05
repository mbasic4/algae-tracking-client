

export const setToken = (token: string | null) => {
  if (!token) {
    localStorage.removeItem("token")
    return
  }
  localStorage.setItem("token", token)
}

export const getToken = () => {
  const token = localStorage.getItem("token")
  return token
}
