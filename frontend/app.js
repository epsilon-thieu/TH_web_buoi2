// Axios instance dùng chung, trỏ tới Back-end (xem "Urls" trong appsettings.json)
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

const form = document.getElementById("product-form");
const idInput = document.getElementById("product-id");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const listEl = document.getElementById("product-list");
const messageEl = document.getElementById("message");

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.className = isError ? "error" : "ok";
}

async function loadProducts() {
  try {
    const res = await api.get("/products");
    renderProducts(res.data);
  } catch (err) {
    showMessage("Không tải được danh sách: " + err.message, true);
  }
}

function renderProducts(products) {
  listEl.innerHTML = "";
  for (const p of products) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td></td>
      <td>${p.price}</td>
      <td>${p.quantity}</td>
      <td class="actions">
        <button data-action="edit">Sửa</button>
        <button data-action="delete">Xóa</button>
      </td>`;
    tr.children[1].textContent = p.name; // textContent để tránh chèn HTML
    tr.querySelector('[data-action="edit"]').addEventListener("click", () => startEdit(p));
    tr.querySelector('[data-action="delete"]').addEventListener("click", () => removeProduct(p.id));
    listEl.appendChild(tr);
  }
}

// ---------- POST / PUT: thêm hoặc cập nhật ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: nameInput.value.trim(),
    price: parseFloat(priceInput.value),
    quantity: parseInt(quantityInput.value, 10),
  };

  try {
    if (idInput.value) {
      const id = Number(idInput.value);
      await api.put(`/products/${id}`, { id, ...payload }); // PUT
      showMessage("Đã cập nhật sản phẩm.");
    } else {
      await api.post("/products", payload); // POST
      showMessage("Đã thêm sản phẩm.");
    }
    resetForm();
    loadProducts();
  } catch (err) {
    showMessage("Lưu thất bại: " + (err.response?.data?.title || err.message), true);
  }
});

// ---------- DELETE: xóa ----------
async function removeProduct(id) {
  if (!confirm(`Xóa sản phẩm #${id}?`)) return;
  try {
    await api.delete(`/products/${id}`);
    showMessage("Đã xóa sản phẩm.");
    loadProducts();
  } catch (err) {
    showMessage("Xóa thất bại: " + err.message, true);
  }
}

// ---------- Hỗ trợ form ----------
function startEdit(p) {
  idInput.value = p.id;
  nameInput.value = p.name;
  priceInput.value = p.price;
  quantityInput.value = p.quantity;
  submitBtn.textContent = "Cập nhật";
  cancelBtn.hidden = false;
}

function resetForm() {
  form.reset();
  idInput.value = "";
  submitBtn.textContent = "Thêm";
  cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);

loadProducts();
