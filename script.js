document.addEventListener("DOMContentLoaded", () => {
  // Year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // NAV TOGGLE (mobile)
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Close nav on click
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
    }
  });

  // CART LOGIC
  const cartButton = document.getElementById("cart-button");
  const cartClose = document.getElementById("cart-close");
  const cartPanel = document.getElementById("cart-panel");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const cartCountEl = document.getElementById("cart-count");
  const checkoutButton = document.getElementById("checkout-button");

  let cart = [];

  function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
  }

  function closeCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
  }

  cartButton.addEventListener("click", openCart);
  cartClose.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  function renderCart() {
    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      const empty = document.createElement("p");
      empty.className = "cart-empty";
      empty.textContent = "Your cart is empty. Go add something that doesn’t suck.";
      cartItemsEl.appendChild(empty);
      cartTotalEl.textContent = "0";
      cartCountEl.textContent = "0";
      return;
    }

    let total = 0;
    let totalCount = 0;

    cart.forEach((item) => {
      total += item.price * item.qty;
      totalCount += item.qty;

      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
        <div class="cart-item-main">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-meta">Qty: ${item.qty} × ₹${item.price}</span>
        </div>
        <div class="cart-item-actions">
          <span>₹${item.price * item.qty}</span>
          <button class="cart-item-remove" data-id="${item.id}">Remove</button>
        </div>
      `;
      cartItemsEl.appendChild(row);
    });

    cartTotalEl.textContent = total.toString();
    cartCountEl.textContent = totalCount.toString();
  }

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    renderCart();
  }

  // Event delegation for remove buttons
  cartItemsEl.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-item-remove")) {
      const id = e.target.getAttribute("data-id");
      removeFromCart(id);
    }
  });

  // Add-to-cart buttons
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = parseInt(btn.getAttribute("data-price"), 10);

      addToCart({ id, name, price });
      openCart();
    });
  });

  checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Cart is empty. Add something first.");
      return;
    }
    alert("This is a demo checkout. Wire this up to your real payment flow later.");
  });

  // PRODUCT FILTERS
  const chips = document.querySelectorAll(".chip");
  const productCards = document.querySelectorAll(".product-card");
  const collectionButtons = document.querySelectorAll(".collection-card .link-button");

  function setFilter(filter) {
    chips.forEach((chip) => {
      chip.classList.toggle("chip-active", chip.dataset.filter === filter || (filter === "all" && chip.dataset.filter === "all"));
    });

    productCards.forEach((card) => {
      const cat = card.dataset.category || "";
      if (filter === "all" || cat.includes(filter)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter || "all";
      setFilter(filter);
    });
  });

  collectionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      setFilter(filter === "essentials" ? "bottom" : filter === "street" ? "tee" : "hoodie");
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    });
  });

  // CONTACT FORM (mock)
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formStatus.textContent = "Message sent (mock). Wire this to backend or Formspree later.";
    contactForm.reset();
    setTimeout(() => {
      formStatus.textContent = "";
    }, 3500);
  });
});
