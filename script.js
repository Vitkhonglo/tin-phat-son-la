// Thay các giá trị trong CONFIG bằng thông tin thật trước khi đăng website.
const DEFAULT_CONFIG = {
  phone: "0395268824",
  phoneDisplay: "0395268824",
  zalo: "http://zaloapp.com/qr/p/d6b6iunnx6a9",
  facebook: "https://www.facebook.com/",
  tiktok: "https://www.tiktok.com/@tinphatsonlaa?is_from_webapp=1&sender_device=pc",
  // Có thể dùng FormSubmit (miễn phí) hoặc Google Forms. Để trống sẽ mở email dự phòng.
  email: "tinphatsonlaa@gmail.com"
};
const CONFIG = { ...DEFAULT_CONFIG, ...JSON.parse(localStorage.getItem("tinphat-config") || "{}") };
const CONTENT = JSON.parse(localStorage.getItem("tinphat-content") || "{}");
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

  if (CONFIG.email && !CONFIG.email.includes("example.com")) {
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Yêu cầu tư vấn mới từ website")}&body=${encodeURIComponent(body)}`;
    status.textContent = "Đã mở ứng dụng email để gửi yêu cầu. Cảm ơn bạn!";
    return;
  }

  navigator.clipboard?.writeText(body);
  status.textContent = "Đã ghi nhận thông tin trên trình duyệt. Vui lòng bấm Gọi/Zalo để được phản hồi nhanh hơn.";
  form.reset();
});
