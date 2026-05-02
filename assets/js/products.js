/**
 * Tệp: products.js
 * Nhiệm vụ: Tải dữ liệu JSON, xử lý lọc (theo tag hoặc tìm kiếm) và render giao diện sản phẩm.
 */

document.addEventListener("DOMContentLoaded", async function () {
    
    // --- 1. ĐỌC THAM SỐ TỪ URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category'); // Vd: ?category=router
    const searchQuery = urlParams.get('search');      // Vd: ?search=asus

    // Lấy vùng chứa sản phẩm trên HTML
    const productContainer = document.getElementById('productsContainer');

    // Nếu trang không có vùng chứa sản phẩm thì ngừng chạy script này luôn
    if (!productContainer) return;

    try {
        // --- 2. GỌI DỮ LIỆU TỪ DATABASE (JSON) ---
        const response = await fetch('../assets/data/products.json');
        const allProducts = await response.json();

        let productsToShow = allProducts; // Mặc định là hiện tất cả

        // --- 3. LOGIC LỌC SẢN PHẨM ---
        if (searchQuery) {
            // Trường hợp 1: Người dùng dùng thanh tìm kiếm
            const lowerCaseQuery = searchQuery.toLowerCase();
            productsToShow = allProducts.filter(product =>
                product.name.toLowerCase().includes(lowerCaseQuery)
            );
        } else if (categoryFilter && categoryFilter !== 'all') {
            // Trường hợp 2: Người dùng bấm vào danh mục (lọc theo Tag)
            productsToShow = allProducts.filter(product =>
                // <Thêm 'product.tags &&' để kiểm tra xem sản phẩm có mảng tags không trước khi lọc, tránh lỗi sập trang (Crash)>
                product.tags && product.tags.includes(categoryFilter)
            );
        }

        // --- 4. RENDER GIAO DIỆN ---
        renderProducts(productsToShow);

    } catch (error) {
        console.error("Lỗi tải dữ liệu JSON:", error);
        productContainer.innerHTML = `<h5 class="text-danger text-center w-100">Đã xảy ra lỗi khi tải dữ liệu.</h5>`;
    }



    // --- HÀM PHỤ: TẠO GIAO DIỆN CHO MẢNG SẢN PHẨM ---
    function renderProducts(products) {
        // Lưu data vào biến toàn cục (Global Variable) để hiển thị chi tiết sau này
        window.currentProductsData = products;
        // Xóa sạch nội dung cũ (nếu có)
        productContainer.innerHTML = "";

        // Nếu không có sản phẩm nào khớp
        if (products.length === 0) {
            productContainer.innerHTML = `<h5 class="text-muted text-center w-100 mt-5">Không tìm thấy sản phẩm nào phù hợp.</h5>`;
            return;
        }

        let htmlContent = ""; // Biến chứa chuỗi HTML tạm thời

        // Lặp qua từng sản phẩm và tạo thẻ Card Bootstrap
       products.forEach((product, index) => {

        // <div /* Thẻ bọc ngoài tạo khung dạng thẻ (card) cho từng sản phẩm */ class="card">
        // <img /* Thẻ hiển thị hình ảnh, gán sự kiện onclick để mở Modal */ src="..." onclick="showProductDetail(...)">
        // <button /* Nút bấm để mở thông tin chi tiết */ onclick="showProductDetail(...)">
        
            const productHTML = `
                <div class="col-md-4 col-sm-6 mb-4" /* Thẻ chia cột Bootstrap, chiếm 4/12 màn hình */>
                    <div class="card h-100 shadow-sm border-0" /* Khung sản phẩm bo góc, có bóng mờ */>
                        <img src="${product.image.replace('../', './')}" 
                            class="card-img-top p-3" 
                            style="object-fit: contain; height: 200px; cursor: pointer;"
                            onclick="showProductDetail(${index})" /* Kích hoạt (Trigger) Modal khi bấm vào ảnh */>
                        
                        <div class="card-body d-flex flex-column" /* Phần thân chứa chữ, đẩy các nút xuống dưới đáy */>
                            <h6 class="card-title text-truncate" onclick="showProductDetail(${index})" /* Tiêu đề tự động cắt ngắn (...) */>
                                ${product.name}
                            </h6>
                            <p class="card-text text-danger fw-bold mb-3" /* Thẻ chữ hiển thị giá tiền màu đỏ */>${product.price}</p>
                            
                            <div class="mt-auto d-flex gap-2" /* Nhóm 2 nút bấm nằm ngang, cách nhau một khoảng gap */>
                                <button class="btn btn-outline-info btn-sm w-50" onclick="showProductDetail(${index})" /* Nút mở Modal */>
                                    Chi tiết
                                </button>
                                <button class="btn btn-primary btn-sm w-50 btn-add-cart" data-index="${index}" /* Nút thêm vào giỏ, chứa ID (data-index) của sản phẩm */>
                                    Vào giỏ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productContainer.innerHTML += productHTML;
        });
        

        
        // Gán sự kiện cho tất cả nút "Thêm vào giỏ"
        document.querySelectorAll('.btn-add-cart').forEach((button, index) => {
            button.addEventListener('click', () => {
                addToCart(products[index]);
            });
        });
    }
});


initModal(); // Gọi hàm tự động chèn cấu trúc Modal vào trang
// Hàm khởi tạo khung Modal (Modal Initialization)
function initModal() {
    if (document.getElementById('productModal')) return;
    
    const modalHTML = `
        <div class="modal fade" id="productModal" tabindex="-1" /* Thẻ nền của hộp thoại ẩn */>
            <div class="modal-dialog modal-dialog-centered modal-lg" /* Hộp thoại nổi lên (Dialog), nằm giữa màn hình (centered) */>
                <div class="modal-content" /* Thẻ chứa nội dung chính nền trắng */>
                    <div class="modal-header border-0" /* Phần đầu hộp thoại chứa nút đóng */>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" /* Nút [X] để tắt hộp thoại */></button>
                    </div>
                    <div class="modal-body" id="modalProductBody" /* Khu vực rỗng sẽ được JS chèn dữ liệu sản phẩm vào */></div>
                </div>
            </div>
        </div>
    `;
    // document.body.insertAdjacentHTML /* Lệnh chèn thẳng đoạn mã HTML vào cuối thẻ <body> */
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Hàm toàn cục (Global Scope) dùng để hiển thị nội dung Modal
window.showProductDetail = function(index) {
    const product = window.currentProductsData[index];
    const modalBody = document.getElementById('modalProductBody');
    
    // <Khởi tạo biến rỗng để chứa bảng thông số (Specification Table)>
    let specsHTML = "";
    
    // <Kiểm tra an toàn: Chỉ vẽ bảng khi sản phẩm có mảng detailedSpecs và mảng đó không bị rỗng>
    if (product.detailedSpecs && product.detailedSpecs.length > 0) {
        specsHTML = `
            <div class="mt-5" /* Thêm khoảng cách (margin-top) phía trên bảng */>
                <h4 class="fw-bold mb-3">Thông tin sản phẩm</h4>
                <h5 class="fw-bold mb-2">Thông số kỹ thuật</h5>
                <table class="table table-bordered table-striped text-start" /* Bảng Bootstrap: có viền, kẻ sọc và căn lề trái */>
                    <tbody>
                        ${product.detailedSpecs.map(spec => `
                            <tr>
                                <th scope="row" class="bg-light" style="width: 30%;" /* Cột tiêu đề chiếm 30% chiều rộng */>${spec.label}</th>
                                <td>${spec.value}</td>
                            </tr>
                        `).join('')} </tbody>
                </table>
            </div>
        `;
    }

    // <Kết xuất (Render) toàn bộ nội dung vào thân của hộp thoại Modal>
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-5 text-center">
                <img src="${product.image.replace('../', './')}" class="img-fluid rounded">
            </div>
            <div class="col-md-7">
                <h3 class="fw-bold">${product.name}</h3>
                <p class="text-danger h4 fw-bold mt-2 mb-4">${product.price}</p>
                <button id="btnModalOrder" class="btn btn-danger w-100 py-3 fw-bold">ĐẶT HÀNG NGAY</button>
            </div>
        </div>
        ${specsHTML}
    `;

    // <Gắn sự kiện click cho nút Đặt hàng vừa được tạo ra>
    document.getElementById('btnModalOrder').addEventListener('click', function() {
        addToCart(product);
    });

    // <Kích hoạt hiển thị Modal>
    const myModal = new bootstrap.Modal(document.getElementById('productModal'));
    myModal.show();
};

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
}
