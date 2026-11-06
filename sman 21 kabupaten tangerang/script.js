// Fitur interaktif website SMAN 21 Kabupaten Tangerang
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const themeButton = document.getElementById("theme-toggle");
  const topButton = document.getElementById("to-top");

  // Menu navigasi untuk layar ponsel
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
    });
    navLinks.forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  // Tahun dan tanggal otomatis
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const dateLabel = document.getElementById("today-date");
  if (dateLabel) {
    dateLabel.textContent = new Intl.DateTimeFormat("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    }).format(new Date());
  }

  // Mode terang/gelap
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const dark = document.body.classList.toggle("dark-mode");
      themeButton.textContent = dark ? "☼" : "◐";
      themeButton.setAttribute("aria-label", dark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0b2032" : "#102b45");
    });
  }

  // Pencarian dan filter berita
  const searchInput = document.getElementById("news-search");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const newsCards = document.querySelectorAll(".news-card");
  const noNews = document.getElementById("no-news");
  let selectedCategory = "semua";

  function filterNews() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    let visibleCount = 0;
    newsCards.forEach(card => {
      const categoryMatches = selectedCategory === "semua" || card.dataset.category === selectedCategory;
      const textMatches = card.textContent.toLowerCase().includes(query);
      const visible = categoryMatches && textMatches;
      card.hidden = !visible;
      if (visible) visibleCount++;
    });
    if (noNews) noNews.hidden = visibleCount > 0;
  }
  searchInput?.addEventListener("input", filterNews);
  filterButtons.forEach(button => button.addEventListener("click", () => {
    selectedCategory = button.dataset.filter || "semua";
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    filterNews();
  }));

  // FAQ buka/tutup
  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  // Form kontak: validasi front-end, tidak mengirim ke server
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  contactForm?.addEventListener("submit", event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const name = document.getElementById("contact-name")?.value.trim();
    if (formStatus) {
      formStatus.textContent = `Terima kasih, ${name}. Formulir berhasil diperiksa, tetapi belum dikirim karena website belum terhubung ke server.`;
    }
  });

  // Tombol kembali ke atas
  const updateTopButton = () => topButton?.classList.toggle("visible", window.scrollY > 450);
  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();
  topButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Navigasi aktif mengikuti bagian yang terlihat
  if ("IntersectionObserver" in window) {
    const observed = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    observed.forEach(section => observer.observe(section));
  }
});
