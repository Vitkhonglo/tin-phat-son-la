// Thay các giá trị trong CONFIG bằng thông tin thật trước khi đăng website.
const DEFAULT_CONFIG = {
  phone: "0395268824",
  phoneDisplay: "0395268824",
  zalo: "http://zaloapp.com/qr/p/d6b6iunnx6a9",
  facebook: "https://www.facebook.com/",
  tiktok: "https://www.tiktok.com/@tinphatsonlaa?is_from_webapp=1&sender_device=pc",
  // Có thể dùng FormSubmit (miễn phí) hoặc Google Forms. Để trống sẽ mở email dự phòng.
  email: "tinphatsonlaa@gmail.com",
  backgroundImage: "https://i.postimg.cc/0yrxcbkT/Dap-thuy-dien-giua-nui-rung-xanh-tham.png",
  leadsEndpoint: "",
  backgroundBlur: "0",
  overlayOpacity: "0"
};
const CONFIG_VERSION = "professional-ui-v1";
const storedConfig = JSON.parse(localStorage.getItem("tinphat-config") || "{}");
if (localStorage.getItem("tinphat-config-version") !== CONFIG_VERSION) {
  storedConfig.backgroundBlur = "0";
  storedConfig.overlayOpacity = "0";
  storedConfig.backgroundImage = DEFAULT_CONFIG.backgroundImage;
  localStorage.setItem("tinphat-config-version", CONFIG_VERSION);
  localStorage.setItem("tinphat-config", JSON.stringify(storedConfig));
}
const CONFIG = { ...DEFAULT_CONFIG, ...storedConfig };
const CONTENT = JSON.parse(localStorage.getItem("tinphat-content") || "{}");
const SLIDES = JSON.parse(localStorage.getItem("tinphat-slides") || "[]");
const visualEditor = new URLSearchParams(location.search).get("visual-editor") === "1";
document.documentElement.style.setProperty("--background-image", `url("${CONFIG.backgroundImage}")`);
document.documentElement.style.setProperty("--blue", CONFIG.primaryColor || "#0d6efd");
document.documentElement.style.setProperty("--ink", CONFIG.textColor || "#172b4d");
document.documentElement.style.setProperty("--font-size", `${CONFIG.fontSize || 16}px`);
const backgroundBlur = Number(CONFIG.backgroundBlur);
const overlayOpacity = Number(CONFIG.overlayOpacity);
document.documentElement.style.setProperty("--background-blur", `${Number.isFinite(backgroundBlur) ? backgroundBlur : 0}px`);
document.documentElement.style.setProperty("--overlay-opacity", `${Number.isFinite(overlayOpacity) ? overlayOpacity / 100 : 0}`);
document.querySelectorAll("[data-edit]").forEach((element) => {
  const key = element.dataset.edit;
  if (CONTENT[key]) element.innerHTML = CONTENT[key];
});
if (Array.isArray(SLIDES) && SLIDES.length) {
  const homepage = document.querySelector("main#top");
  const sections = new Map([...document.querySelectorAll("[data-layout-id]")].map((section) => [section.dataset.layoutId, section]));
  SLIDES.forEach((slide) => {
    const section = sections.get(slide.id);
    if (!section) return;
    homepage?.appendChild(section);
    section.style.color = slide.color || "";
    section.style.backgroundColor = slide.background ? `${slide.background}cc` : "";
    const container = section.querySelector(".container");
    if (container) container.style.maxWidth = `calc(1200px * ${Math.min(100, Math.max(60, Number(slide.width) || 100)) / 100})`;
    const heading = section.querySelector("h1, h2");
    if (heading && slide.title) heading.textContent = slide.title;
    const description = section.querySelector(".hero-lead, .section-heading > p, .center-heading > p, .proof-grid .muted, .contact-copy > p, .legal-copy > p");
    if (description && slide.description) description.textContent = slide.description;
    if (heading && slide.fontSize) heading.style.fontSize = `${slide.fontSize}px`;
  });
}
function enableVisualEditor() {
  if (!visualEditor || sessionStorage.getItem("tinphat-admin") !== "yes") return;
  document.body.classList.add("visual-editor-active");
  const toolbar = document.createElement("div");
  toolbar.className = "visual-toolbar";
  toolbar.innerHTML = '<strong>CHẾ ĐỘ CHỈNH TRỰC TIẾP</strong><span>Kéo khung hoặc bấm vào chữ để sửa</span><button type="button" data-visual-save>Lưu thay đổi</button><button type="button" data-visual-close>Thoát</button>';
  document.body.appendChild(toolbar);
  const sections = [...document.querySelectorAll("[data-layout-id]")];
  sections.forEach((section) => {
    section.draggable = true;
    section.setAttribute("data-visual-editable", "true");
    section.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", section.dataset.layoutId);
      section.classList.add("visual-dragging");
    });
    section.addEventListener("dragend", () => section.classList.remove("visual-dragging"));
    section.addEventListener("dragover", (event) => event.preventDefault());
    section.addEventListener("drop", (event) => {
      event.preventDefault();
      const sourceId = event.dataTransfer.getData("text/plain");
      const source = document.querySelector(`[data-layout-id="${sourceId}"]`);
      if (!source || source === section) return;
      const main = document.querySelector("main#top");
      const boxes = [...main.querySelectorAll("[data-layout-id]")];
      if (boxes.indexOf(source) < boxes.indexOf(section)) section.after(source);
      else section.before(source);
    });
  });
  document.querySelectorAll("[data-edit], [data-layout-id] h1, [data-layout-id] h2, [data-layout-id] h3, [data-layout-id] p").forEach((element) => {
    if (element.closest(".visual-toolbar") || element.closest("form")) return;
    element.contentEditable = "true";
    element.spellcheck = true;
  });
  toolbar.querySelector("[data-visual-save]").addEventListener("click", () => {
    const order = [...document.querySelectorAll("main#top>[data-layout-id]")].map((section) => section.dataset.layoutId);
    const storedSlides = JSON.parse(localStorage.getItem("tinphat-slides") || "[]");
    const orderedSlides = order.map((id) => storedSlides.find((slide) => slide.id === id)).filter(Boolean);
    localStorage.setItem("tinphat-slides", JSON.stringify(orderedSlides));
    const content = JSON.parse(localStorage.getItem("tinphat-content") || "{}");
    document.querySelectorAll("[data-edit]").forEach((element) => { content[element.dataset.edit] = element.innerHTML; });
    localStorage.setItem("tinphat-content", JSON.stringify(content));
    toolbar.firstElementChild.textContent = "ĐÃ LƯU";
  });
  toolbar.querySelector("[data-visual-close]").addEventListener("click", () => {
    location.href = "index.html";
  });
}
enableVisualEditor();

document.querySelectorAll("[data-phone-link]").forEach((link) => {
  link.href = `tel:${CONFIG.phone}`;
});
document.querySelectorAll("[data-phone-text]").forEach((text) => {
  text.textContent = CONFIG.phoneDisplay;
});
document.querySelectorAll("[data-zalo-link]").forEach((link) => {
  link.href = CONFIG.zalo;
});
document.querySelectorAll("[data-facebook-link]").forEach((link) => {
  link.href = CONFIG.facebook;
});
document.querySelectorAll("[data-tiktok-link]").forEach((link) => {
  link.href = CONFIG.tiktok;
});
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const leadForm = document.getElementById("lead-form");
leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = data.get("name");
  const phone = data.get("phone");
  const interest = data.get("interest");
  const message = data.get("message");
  const body = `Họ tên: ${name}\nSố điện thoại: ${phone}\nQuan tâm: ${interest}\nLời nhắn: ${message || "(không có)"}`;
  const status = form.querySelector(".form-status");

  const lead = { name, phone, interest, message, createdAt: new Date().toISOString() };
  const localLeads = JSON.parse(localStorage.getItem("tinphat-leads") || "[]");
  localStorage.setItem("tinphat-leads", JSON.stringify([lead, ...localLeads]));
  if (CONFIG.leadsEndpoint) {
    fetch(CONFIG.leadsEndpoint, { method: "POST", mode: "no-cors", body: JSON.stringify(lead) }).catch(() => {});
    status.textContent = "Đã gửi yêu cầu. Chúng tôi sẽ liên hệ sớm!";
    form.reset();
    return;
  }
  if (CONFIG.email && !CONFIG.email.includes("example.com")) {
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Yêu cầu tư vấn mới từ website")}&body=${encodeURIComponent(body)}`;
    status.textContent = "Đã mở ứng dụng email để gửi yêu cầu. Cảm ơn bạn!";
    return;
  }

  navigator.clipboard?.writeText(body);
  status.textContent = "Đã ghi nhận thông tin trên trình duyệt. Vui lòng bấm Gọi/Zalo để được phản hồi nhanh hơn.";
  form.reset();
});
document.querySelectorAll(".section,.contact-section,.legal-section").forEach((section) => section.classList.add("reveal"));
const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: .12 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
