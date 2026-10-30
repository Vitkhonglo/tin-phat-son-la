const ADMIN_PASSWORD = "TinPhat2026";
const configDefaults = {
  phone: "0980000000", phoneDisplay: "0980 000 000", zalo: "https://zalo.me/0980000000",
  facebook: "https://www.facebook.com/", tiktok: "https://www.tiktok.com/", email: "thay-email-cua-ban@example.com", leadsEndpoint: "",
  backgroundImage: "https://i.postimg.cc/0yrxcbkT/Dap-thuy-dien-giua-nui-rung-xanh-tham.png",
  backgroundBlur: "0", overlayOpacity: "0", primaryColor: "#0d6efd", textColor: "#172b4d", fontSize: "16"
};
const contentDefaults = {
  heroTitle: "Mở lối đi <span>vững vàng</span> cho tương lai của bạn",
  heroLead: "Tư vấn du học Nhật, Hàn, Đài Loan và xuất khẩu lao động Nhật. Lộ trình rõ ràng, chi phí minh bạch, đồng hành từ lúc chuẩn bị hồ sơ đến khi ổn định tại nước bạn.",
  studentTitle: "Học viên của chúng tôi đã bắt đầu như bạn",
  studentLead: "Mỗi bức ảnh, lời kể và video là một hành trình thật. Hãy xem thêm trên Page và TikTok của văn phòng.",
  contactTitle: "Để lại thông tin,<br><span>nhận tư vấn miễn phí</span>",
  contactLead: "Không biết mình phù hợp với thị trường nào? Cứ để lại số điện thoại. Chúng tôi sẽ liên hệ trong giờ làm việc để cùng bạn gỡ từng câu hỏi.",
  officeName: "Chi nhánh Tín Phát Sơn La", address: "Đang cập nhật - Sơn La",
  hours: "Thứ 2 - Thứ 7 · 08:00 - 17:30", legalInfo: "Giấy phép và thông tin doanh nghiệp sẽ cập nhật tại đây",
  legalLead: "Hãy bổ sung giấy phép, tên pháp nhân, địa chỉ chính xác và giờ làm việc trước khi đưa website lên quảng bá."
};
const slideDefaults = [
  { id: "hero", label: "Slide mở đầu", title: "Mở lối đi vững vàng", description: "Thông điệp chính của website", color: "#ffffff", background: "#123052", fontSize: 42, width: 100 },
  { id: "markets", label: "Khung thị trường", title: "Những thị trường chúng tôi đồng hành", description: "Các lựa chọn Nhật, Hàn, Đài Loan và XKLĐ Nhật", color: "#172b4d", background: "#ffffff", fontSize: 30, width: 100 },
  { id: "process", label: "Khung quy trình", title: "Quy trình rõ ràng", description: "Các bước tư vấn và chuẩn bị hồ sơ", color: "#172b4d", background: "#f4f8ff", fontSize: 30, width: 100 },
  { id: "students", label: "Khung học viên", title: "Học viên của chúng tôi", description: "Câu chuyện thật và hành trình thật", color: "#ffffff", background: "#123052", fontSize: 30, width: 100 },
  { id: "blog", label: "Khung bài viết", title: "Góc chia sẻ kinh nghiệm", description: "Bài viết giúp khách hàng tìm thấy website trên Google", color: "#172b4d", background: "#ffffff", fontSize: 30, width: 100 },
  { id: "contact", label: "Khung nhận tư vấn", title: "Nhận lộ trình miễn phí", description: "Form để khách hàng để lại thông tin", color: "#ffffff", background: "#123052", fontSize: 30, width: 100 },
  { id: "legal", label: "Khung pháp lý", title: "Thông tin văn phòng", description: "Địa chỉ, giờ làm việc và thông tin pháp lý", color: "#ffffff", background: "#123052", fontSize: 24, width: 100 }
];
const loginPanel = document.getElementById("login-panel");
const editorPanel = document.getElementById("editor-panel");
const error = document.getElementById("login-error");
const form = document.getElementById("editor-form");
const CONFIG_VERSION = "professional-ui-v1";
const storedConfig = JSON.parse(localStorage.getItem("tinphat-config") || "{}");
if (localStorage.getItem("tinphat-config-version") !== CONFIG_VERSION) {
  storedConfig.backgroundBlur = "0";
  storedConfig.overlayOpacity = "0";
  storedConfig.backgroundImage = configDefaults.backgroundImage;
  localStorage.setItem("tinphat-config-version", CONFIG_VERSION);
  localStorage.setItem("tinphat-config", JSON.stringify(storedConfig));
}
const savedConfig = { ...configDefaults, ...storedConfig };
const savedContent = { ...contentDefaults, ...JSON.parse(localStorage.getItem("tinphat-content") || "{}") };
let slides = JSON.parse(localStorage.getItem("tinphat-slides") || "null") || slideDefaults.map((slide) => ({ ...slide }));
let selectedSlideId = slides[0].id;
if (!localStorage.getItem("tinphat-slides")) localStorage.setItem("tinphat-slides", JSON.stringify(slides));

function showEditor() { loginPanel.hidden = true; editorPanel.hidden = false; fillForm(); }
if (sessionStorage.getItem("tinphat-admin") === "yes") showEditor();
document.getElementById("login-button").addEventListener("click", () => {
  if (document.getElementById("admin-password").value === ADMIN_PASSWORD) {
    sessionStorage.setItem("tinphat-admin", "yes"); error.textContent = ""; showEditor();
  } else error.textContent = "Mật khẩu chưa đúng.";
});
document.getElementById("logout-button").addEventListener("click", () => {
  sessionStorage.removeItem("tinphat-admin"); editorPanel.hidden = true; loginPanel.hidden = false;
});
function fillForm() {
  Object.entries({ ...savedConfig, ...savedContent }).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; });
  updateRangeLabels();
  renderSlideEditor();
}
function updateRangeLabels() {
  document.getElementById("font-output").textContent = `${form.elements.fontSize.value}px`;
  document.getElementById("blur-output").textContent = `${form.elements.backgroundBlur.value}px`;
  document.getElementById("overlay-output").textContent = `${form.elements.overlayOpacity.value}%`;
}
form.elements.fontSize.addEventListener("input", updateRangeLabels);
form.elements.backgroundBlur.addEventListener("input", updateRangeLabels);
form.elements.overlayOpacity.addEventListener("input", updateRangeLabels);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form).entries());
  const configKeys = Object.keys(configDefaults);
  const config = Object.fromEntries(configKeys.map((key) => [key, values[key]]));
  const content = Object.fromEntries(Object.keys(contentDefaults).map((key) => [key, values[key]]));
  localStorage.setItem("tinphat-config", JSON.stringify(config));
  localStorage.setItem("tinphat-config-version", CONFIG_VERSION);
  localStorage.setItem("tinphat-content", JSON.stringify(content));
  localStorage.setItem("tinphat-slides", JSON.stringify(slides));
  document.documentElement.style.setProperty("--blue", config.primaryColor);
  document.documentElement.style.setProperty("--ink", config.textColor);
  document.documentElement.style.setProperty("--font-size", `${config.fontSize}px`);
  document.documentElement.style.setProperty("--background-image", `url("${config.backgroundImage}")`);
  document.documentElement.style.setProperty("--background-blur", `${config.backgroundBlur}px`);
  document.documentElement.style.setProperty("--overlay-opacity", `${Number(config.overlayOpacity) / 100}`);
  document.getElementById("save-status").textContent = "Đã lưu trên trình duyệt này.";
});
document.getElementById("reset-button").addEventListener("click", () => {
  if (!confirm("Khôi phục toàn bộ nội dung mẫu?")) return;
  localStorage.removeItem("tinphat-config"); localStorage.removeItem("tinphat-content"); fillForm();
  document.getElementById("save-status").textContent = "Đã khôi phục nội dung mẫu.";
});
async function renderLeads() {
  let leads = JSON.parse(localStorage.getItem("tinphat-leads") || "[]");
  const endpoint = String(savedConfig.leadsEndpoint || "").trim();
  if (endpoint) {
    try {
      const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const sharedLeads = await response.json();
      if (!Array.isArray(sharedLeads)) throw new Error("Dữ liệu trả về không phải danh sách.");
      leads = sharedLeads;
    } catch (requestError) {
      document.getElementById("save-status").textContent = `Không tải được dữ liệu Google Sheets: ${requestError.message}`;
    }
  }
  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
  document.getElementById("leads-body").innerHTML = leads.length ? leads.map((lead) => `<tr><td>${escapeHtml(new Date(lead.createdAt).toLocaleString("vi-VN"))}</td><td>${escapeHtml(lead.name)}</td><td>${escapeHtml(lead.phone)}</td><td>${escapeHtml(lead.interest)}</td><td>${escapeHtml(lead.message)}</td></tr>`).join("") : '<tr><td colspan="5">Chưa có yêu cầu tư vấn trên trình duyệt này.</td></tr>';
}
document.getElementById("refresh-leads").addEventListener("click", renderLeads);
renderLeads();

function renderSlideEditor() {
  const list = document.getElementById("slide-list");
  if (!list) return;
  list.innerHTML = slides.map((slide) => `<button class="slide-item${slide.id === selectedSlideId ? " selected" : ""}" type="button" draggable="true" data-slide-id="${slide.id}"><span class="drag-handle">☷</span><span><b>${escapeText(slide.label)}</b><small>${escapeText(slide.title)}</small></span></button>`).join("");
  list.querySelectorAll(".slide-item").forEach((item) => {
    item.addEventListener("click", () => { selectedSlideId = item.dataset.slideId; renderSlideEditor(); });
    item.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", item.dataset.slideId));
    item.addEventListener("dragover", (event) => event.preventDefault());
    item.addEventListener("drop", (event) => {
      event.preventDefault();
      const sourceId = event.dataTransfer.getData("text/plain");
      const sourceIndex = slides.findIndex((slide) => slide.id === sourceId);
      const targetIndex = slides.findIndex((slide) => slide.id === item.dataset.slideId);
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;
      const [moved] = slides.splice(sourceIndex, 1);
      slides.splice(targetIndex, 0, moved);
      localStorage.setItem("tinphat-slides", JSON.stringify(slides));
      renderSlideEditor();
    });
  });
  const selected = slides.find((slide) => slide.id === selectedSlideId);
  const properties = document.getElementById("slide-properties");
  if (!selected) { properties.hidden = true; return; }
  properties.hidden = false;
  document.getElementById("slide-label").value = selected.label;
  document.getElementById("slide-title").value = selected.title;
  document.getElementById("slide-description").value = selected.description;
  document.getElementById("slide-color").value = selected.color;
  document.getElementById("slide-background").value = selected.background;
  document.getElementById("slide-font-size").value = selected.fontSize;
  document.getElementById("slide-width").value = selected.width;
  document.getElementById("slide-font-output").textContent = `${selected.fontSize}px`;
  document.getElementById("slide-width-output").textContent = `${selected.width}%`;
}
function escapeText(value) { return String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]); }
function updateSelectedSlide(property, value) {
  const selected = slides.find((slide) => slide.id === selectedSlideId);
  if (!selected) return;
  selected[property] = property === "fontSize" || property === "width" ? Number(value) : value;
  localStorage.setItem("tinphat-slides", JSON.stringify(slides));
  renderSlideEditor();
}
["label", "title", "description", "color", "background"].forEach((property) => {
  document.getElementById(`slide-${property}`).addEventListener("input", (event) => updateSelectedSlide(property, event.target.value));
});
document.getElementById("slide-font-size").addEventListener("input", (event) => updateSelectedSlide("fontSize", event.target.value));
document.getElementById("slide-width").addEventListener("input", (event) => updateSelectedSlide("width", event.target.value));
document.getElementById("reset-layout").addEventListener("click", () => {
  slides = slideDefaults.map((slide) => ({ ...slide }));
  selectedSlideId = slides[0].id;
  localStorage.setItem("tinphat-slides", JSON.stringify(slides));
  renderSlideEditor();
});
