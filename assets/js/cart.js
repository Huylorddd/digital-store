document.addEventListener("DOMContentLoaded", function () {
    // Khởi tạo giỏ hàng khi load trang
    renderCart();

    // XỬ LÝ ĐĂNG NHẬP GIẢ LẬP
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Chặn load lại trang

            // Lưu trạng thái đã đăng nhập vào localStorage
            localStorage.setItem('isLoggedIn', 'true');

            // Thông báo và đóng Modal
            alert("Đăng nhập thành công!");
            const authModalEl = document.getElementById('authModal');
            const modalInstance = bootstrap.Modal.getInstance(authModalEl);
            modalInstance.hide();

            // Cập nhật lại giao diện nút đăng nhập trên Navbar
            location.reload();
        });
    }

    // XỬ LÝ NÚT THANH TOÁN
    const btnCheckout = document.getElementById('btnCheckout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', function () {

            // KIỂM TRA GIỎ HÀNG TRỐNG
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert("Giỏ hàng của bạn đang trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
                return;
            }

            // KIỂM TRA ĐĂNG NHẬP
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            if (!isLoggedIn) {
                alert("Vui lòng đăng nhập để thanh toán!");
                const authModal = new bootstrap.Modal(document.getElementById('authModal'));
                authModal.show();
            } else {
                // Nếu đã đăng nhập và có sản phẩm trong giỏ
                alert("Chúc mừng! Đơn hàng của bạn đã được thanh toán thành công.");
                localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi mua
                renderCart(); // Cập nhật lại giao diện trống
            }
        });
    }
});

// CÁC HÀM XỬ LÝ GIỎ HÀNG

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cartList');
    const totalPriceElem = document.getElementById('totalPrice');

    if (cart.length === 0) {
        cartList.innerHTML = `<div class="text-center p-5">
            <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" width="100" class="mb-3 opacity-50">
            <p class="text-muted">Giỏ hàng trống rỗng</p>
        </div>`;
        totalPriceElem.innerText = "0đ";
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        // Chuyển đổi giá từ chuỗi "3.590.000đ" sang số để tính toán
        const priceNum = parseInt(item.price.replace(/\./g, ''));
        total += priceNum * item.quantity;

        // Xử lý đường dẫn ảnh khi hiển thị trong giỏ hàng (nằm trong thư mục pages)
        const imgSrc = item.image.includes('/assets/')
            ? '../assets/' + item.image.split('/assets/')[1]
            : item.image;

        html += `
        <div class="d-flex align-items-center border-bottom py-3">
            <img src="${imgSrc}" width="80" class="rounded">
            <div class="ms-3 flex-grow-1">
                <h6 class="mb-0 text-truncate" style="max-width: 300px;">${item.name}</h6>
                <small class="text-danger fw-bold">${item.price}</small>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-light border" onclick="updateQty(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="btn btn-sm btn-light border" onclick="updateQty(${index}, 1)">+</button>
            </div>
            <button class="btn text-muted ms-3" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button>
        </div>`;
    });

    cartList.innerHTML = html;
    totalPriceElem.innerText = total.toLocaleString('vi-VN') + "đ";
}

// Hàm tăng giảm số lượng
window.updateQty = function (index, change) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity += change;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Hàm xóa sản phẩm
window.removeItem = function (index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}