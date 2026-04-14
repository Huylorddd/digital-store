/**
 * Tệp: products.js
 * Nhiệm vụ: Tải dữ liệu JSON, xử lý lọc (theo tag hoặc tìm kiếm) và render giao diện sản phẩm.
 */

document.addEventListener("DOMContentLoaded", async function() {
    
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
                product.tags.includes(categoryFilter)
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
        // Xóa sạch nội dung cũ (nếu có)
        productContainer.innerHTML = "";

        // Nếu không có sản phẩm nào khớp
        if (products.length === 0) {
            productContainer.innerHTML = `<h5 class="text-muted text-center w-100 mt-5">Không tìm thấy sản phẩm nào phù hợp.</h5>`;
            return;
        }

        // Lặp qua từng sản phẩm và tạo thẻ Card Bootstrap
        products.forEach(product => {
            const productHTML = `
                <div class="col-md-4 col-sm-6 mb-4">
                    <div class="card h-100 shadow-sm border-0">
                        <img src="${product.image}" class="card-img-top p-3" alt="${product.name}" style="object-fit: contain; height: 200px;">
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title text-truncate" title="${product.name}">${product.name}</h6>
                            <p class="card-text text-danger fw-bold mb-3">${product.price}</p>
                            <button class="btn btn-outline-primary btn-sm w-100 mt-auto">Thêm vào giỏ</button>
                        </div>
                    </div>
                </div>
            `;
            // Bơm thẻ HTML vừa tạo vào thùng chứa
            productContainer.innerHTML += productHTML;
        });
    }
});