const products = [
  { id: 1, name: "Astral Drake", category: "single", rarity: "Legendary", price: 129.90, condition: "Mint", set: "Celestial Rift", symbol: "✦", color: "violet", image: "assets/astral-drake.svg", description: "Eine auffällige Foil Chase Card mit starkem Sammlerfokus und Premium Präsentation." },
  { id: 2, name: "Volt Sprite", category: "single", rarity: "Rare", price: 18.50, condition: "Near Mint", set: "Storm Circuit", symbol: "⚡", color: "cyan", image: "assets/volt-sprite.svg", description: "Schnelle Rare Single für Spieler, die ein dynamisches Elektro Thema mögen." },
  { id: 3, name: "Ember Kitsune", category: "single", rarity: "Ultra Rare", price: 44.90, condition: "Mint", set: "Crimson Pact", symbol: "🔥", color: "pink", image: "assets/ember-kitsune.svg", description: "Ultra Rare Karte mit warmem Foil Look und hoher Display Wirkung." },
  { id: 4, name: "Nebula Booster", category: "sealed", rarity: "Sealed", price: 5.90, condition: "Factory Sealed", set: "Celestial Rift", symbol: "★", color: "violet", image: "assets/nebula-booster.svg", description: "Einzelner Booster Pack für neue Pulls, Draft Abende und spontane Sammler Momente." },
  { id: 5, name: "Nebula Vault Box", category: "sealed", rarity: "Sealed", price: 119.90, condition: "Factory Sealed", set: "Celestial Rift", symbol: "▣", color: "gold", image: "assets/nebula-vault-box.svg", description: "Limitierte Display Box mit starkem Regalwert und Sammler Appeal." },
  { id: 6, name: "Starter Clash Bundle", category: "bundle", rarity: "Sealed", price: 39.90, condition: "New", set: "Starter Clash", symbol: "◆", color: "green", image: "assets/starter-clash-bundle.svg", description: "Einsteigerfreundliches Bundle mit Decks, Token Set und schneller Spielbereitschaft." },
  { id: 7, name: "Moonlit Guardian", category: "single", rarity: "Ultra Rare", price: 59.00, condition: "Excellent", set: "Lunar Oath", symbol: "☾", color: "cyan", image: "assets/moonlit-guardian.svg", description: "Elegante Ultra Rare Single für Binder, Displays und thematische Decks." },
  { id: 8, name: "Nova Sleeves", category: "accessory", rarity: "Rare", price: 9.90, condition: "New", set: "Accessories", symbol: "▥", color: "gold", image: "assets/nova-sleeves.svg", description: "Premium Sleeves mit klarer Oberfläche für Turnier, Binder und Schutz." },
  { id: 9, name: "Prism Binder", category: "accessory", rarity: "Rare", price: 24.90, condition: "New", set: "Accessories", symbol: "◇", color: "violet", image: "assets/prism-binder.svg", description: "Stabiler Sammelordner mit hochwertigem Look für wertvolle Karten." }
];

const featuredPrices = {
  "Nebula Vault Box": 119.90,
  "Starter Clash Bundle": 39.90
};

let activeCategory = "all";
let searchTerm = "";
let cart = [];

const productGrid = document.querySelector("#productGrid");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const resetFilters = document.querySelector("#resetFilters");
const rarityInputs = [...document.querySelectorAll(".rarity-filter input")];
const filterButtons = [...document.querySelectorAll(".filter-pill")];
const cartDrawer = document.querySelector("#cartDrawer");
const openCart = document.querySelector("#openCart");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const subtotal = document.querySelector("#subtotal");
const shipping = document.querySelector("#shipping");
const total = document.querySelector("#total");
const toast = document.querySelector("#toast");
const modal = document.querySelector("#productModal");
const modalContent = document.querySelector("#modalContent");
const closeModal = document.querySelector("#closeModal");

function formatPrice(value) {
  return `${value.toFixed(2)} Euro`;
}

function productGradient(color) {
  const gradients = {
    violet: "linear-gradient(135deg, rgba(155,124,255,.7), rgba(103,232,249,.35), rgba(255,107,158,.25))",
    cyan: "linear-gradient(135deg, rgba(103,232,249,.72), rgba(120,242,166,.35), rgba(155,124,255,.25))",
    pink: "linear-gradient(135deg, rgba(255,107,158,.72), rgba(255,213,106,.35), rgba(155,124,255,.25))",
    gold: "linear-gradient(135deg, rgba(255,213,106,.78), rgba(255,240,168,.35), rgba(155,124,255,.22))",
    green: "linear-gradient(135deg, rgba(120,242,166,.72), rgba(103,232,249,.35), rgba(255,213,106,.23))"
  };
  return gradients[color] || gradients.violet;
}

function renderProductImage(product, extraClass = "") {
  return `<div class="product-art image-art ${extraClass}" style="background:${productGradient(product.color)}"><img src="${product.image}" alt="${product.name} Artwork" loading="lazy"></div>`;
}

function getFilteredProducts() {
  const activeRarities = rarityInputs.filter(input => input.checked).map(input => input.value);
  let items = products.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const haystack = `${product.name} ${product.rarity} ${product.set} ${product.condition}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    const matchesRarity = activeRarities.length === 0 || activeRarities.includes(product.rarity);
    return matchesCategory && matchesSearch && matchesRarity;
  });

  const sort = sortSelect.value;
  if (sort === "priceLow") items = items.sort((a, b) => a.price - b.price);
  if (sort === "priceHigh") items = items.sort((a, b) => b.price - a.price);
  if (sort === "name") items = items.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "featured") items = items.sort((a, b) => b.price - a.price);
  return items;
}

function renderProducts() {
  const items = getFilteredProducts();
  resultCount.textContent = `${items.length} Produkte`;
  productGrid.innerHTML = items.map(product => `
    <article class="product-card">
      <span class="product-badge">${product.rarity}</span>
      ${renderProductImage(product)}
      <span class="product-meta">${product.set} • ${product.condition}</span>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-bottom"><span class="price">${formatPrice(product.price)}</span><span>${labelForCategory(product.category)}</span></div>
      <div class="product-actions">
        <button type="button" class="details-btn" data-details="${product.id}">Details</button>
        <button type="button" data-add="${product.id}">Auswählen</button>
      </div>
    </article>
  `).join("") || `<div class="filter-note"><strong>Keine Produkte gefunden</strong><p>Ändere Suche oder Filter, um weitere Karten zu sehen.</p></div>`;
}

function labelForCategory(category) {
  return {
    single: "Single",
    sealed: "Sealed",
    bundle: "Bundle",
    accessory: "Zubehör"
  }[category] || category;
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  renderCart();
  showToast(`${product.name} wurde ausgewählt`);
}

function addFeatured(name) {
  const found = products.find(product => product.name === name);
  if (found) addToCart(found);
  else addToCart({ id: `featured-${name}`, name, price: featuredPrices[name] || 0, rarity: "Sealed", symbol: "★", qty: 1 });
}

function renderCart() {
  const quantity = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotalValue = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingValue = subtotalValue > 0 ? 4.90 : 0;

  cartCount.textContent = quantity;
  subtotal.textContent = formatPrice(subtotalValue);
  shipping.textContent = formatPrice(shippingValue);
  total.textContent = formatPrice(subtotalValue + shippingValue);

  if (!cart.length) {
    cartItems.innerHTML = `<div class="cart-empty"><p>Deine Demo Auswahl ist noch leer.</p></div>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <article class="cart-item">
      <div class="cart-thumb">${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.symbol || "★"}</div>
      <div><h4>${item.name}</h4><p>${formatPrice(item.price)} • ${item.rarity}</p></div>
      <div class="qty-controls">
        <button type="button" data-dec="${item.id}">−</button>
        <strong>${item.qty}</strong>
        <button type="button" data-inc="${item.id}">+</button>
      </div>
    </article>
  `).join("");
}

function changeQty(id, delta) {
  const item = cart.find(entry => String(entry.id) === String(id));
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(entry => String(entry.id) !== String(id));
  renderCart();
}

function showProductDetails(id) {
  const product = products.find(item => item.id === Number(id));
  if (!product) return;
  modalContent.innerHTML = `
    <div class="modal-content-grid">
      ${renderProductImage(product, "modal-art")}
      <div class="modal-copy">
        <span class="eyebrow">${product.rarity}</span>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <div class="detail-list">
          <div><span>Set</span><strong>${product.set}</strong></div>
          <div><span>Zustand</span><strong>${product.condition}</strong></div>
          <div><span>Kategorie</span><strong>${labelForCategory(product.category)}</strong></div>
          <div><span>Preis</span><strong>${formatPrice(product.price)}</strong></div>
        </div>
        <button type="button" class="modal-buy" data-add="${product.id}">Zur Demo Auswahl hinzufügen</button>
      </div>
    </div>
  `;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function openDrawer() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function closeProductModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.filter;
    renderProducts();
  });
});

rarityInputs.forEach(input => input.addEventListener("change", renderProducts));
searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});
sortSelect.addEventListener("change", renderProducts);

resetFilters.addEventListener("click", () => {
  activeCategory = "all";
  searchTerm = "";
  searchInput.value = "";
  sortSelect.value = "featured";
  rarityInputs.forEach(input => input.checked = false);
  filterButtons.forEach(button => button.classList.toggle("active", button.dataset.filter === "all"));
  renderProducts();
});

productGrid.addEventListener("click", event => {
  const addId = event.target.dataset.add;
  const detailsId = event.target.dataset.details;
  if (addId) addToCart(products.find(product => product.id === Number(addId)));
  if (detailsId) showProductDetails(detailsId);
});

cartItems.addEventListener("click", event => {
  if (event.target.dataset.inc) changeQty(event.target.dataset.inc, 1);
  if (event.target.dataset.dec) changeQty(event.target.dataset.dec, -1);
});

document.addEventListener("click", event => {
  if (event.target.dataset.featuredAdd) addFeatured(event.target.dataset.featuredAdd);
  if (event.target.dataset.add && event.target.closest(".modal")) {
    addToCart(products.find(product => product.id === Number(event.target.dataset.add)));
    closeProductModal();
  }
});

openCart.addEventListener("click", openDrawer);
closeCart.addEventListener("click", closeDrawer);
cartDrawer.addEventListener("click", event => {
  if (event.target === cartDrawer) closeDrawer();
});
closeModal.addEventListener("click", closeProductModal);
modal.addEventListener("click", event => {
  if (event.target === modal) closeProductModal();
});

document.querySelector("#scrollToDrops").addEventListener("click", () => document.querySelector("#drops").scrollIntoView({ behavior: "smooth" }));
document.querySelector("#focusSingles").addEventListener("click", () => {
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
  const singleButton = filterButtons.find(button => button.dataset.filter === "single");
  singleButton.click();
});

document.querySelector("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Danke. Demo Alert wurde gespeichert.");
});

document.querySelector("#demoButton").addEventListener("click", () => {
  showToast("Demo Anfrage geöffnet. Echte Bestellung ist nicht aktiv.");
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeDrawer();
    closeProductModal();
  }
});

renderProducts();
renderCart();
