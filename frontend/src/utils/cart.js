export function getCart() {
  if (typeof window === "undefined") return []
  const cart = localStorage.getItem("cart")
  return cart ? JSON.parse(cart) : []
}

export function saveCart(cart) {
  if (typeof window === "undefined") return
  localStorage.setItem("cart", JSON.stringify(cart))
}

export function addToCart(productId, quantity = 1) {
  const cart = getCart()
  const existingItem = cart.find(item => item.productId === productId)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }
  saveCart(cart)
}

export function removeFromCart(productId) {
  let cart = getCart()
  cart = cart.filter(item => item.productId !== productId)
  saveCart(cart)
}

export function updateQuantity(productId, quantity) {
  const cart = getCart()
  const item = cart.find(i => i.productId === productId)
  if (item) {
    item.quantity = quantity
    if (item.quantity <= 0) {
      removeFromCart(productId)
    } else {
      saveCart(cart)
    }
  }
}
