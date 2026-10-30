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
