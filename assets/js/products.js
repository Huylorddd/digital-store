
// Khai báo biến toàn cục để lưu mảng sản phẩm (dùng chung cho các hàm bên dưới)
let danhSachSanPham = []; 

document.addEventListener("DOMContentLoaded", async function () {
    
    // 1. LẤY THÔNG TIN TỪ THANH ĐỊA CHỈ (URL)
    const urlParams = new URLSearchParams(window.location.search);
    const danhMucCanLoc = urlParams.get('category'); // Lấy chữ sau ?category=
    const tuKhoaTimKiem = urlParams.get('search');   // Lấy chữ sau ?search=

    const khungChuaSanPham = document.getElementById('productsContainer');
    if (!khungChuaSanPham) return; // Nếu không ở trang có chứa id này thì dừng script

    try {
        // 2. TẢI DỮ LIỆU TỪ FILE JSON
        const response = await fetch('../assets/data/products.json');
        danhSachSanPham = await response.json(); 

        let sanPhamHienThi = danhSachSanPham; // Mặc định hiển thị tất cả

        // 3. LỌC SẢN PHẨM (NẾU CÓ)
        if (tuKhoaTimKiem) {
            // Lọc theo thanh tìm kiếm (Đưa về chữ thường để dễ so sánh)
            const tuKhoaThuong = tuKhoaTimKiem.toLowerCase();
            sanPhamHienThi = danhSachSanPham.filter(function(sp) {
                return sp.name.toLowerCase().includes(tuKhoaThuong);
            });
        } 
        else if (danhMucCanLoc && danhMucCanLoc !== 'all') {
            // Lọc theo menu bên trái (Kiểm tra mảng tags)
            sanPhamHienThi = danhSachSanPham.filter(function(sp) {
                return sp.tags && sp.tags.includes(danhMucCanLoc);
            });
        }

        // 4. IN RA MÀN HÌNH
        hienThiSanPham(sanPhamHienThi, khungChuaSanPham);

    } catch (error) {
        khungChuaSanPham.innerHTML = `<h5 class="text-danger text-center w-100">Lỗi tải dữ liệu.</h5>`;
    }
});


// ==========================================
// CÁC HÀM XỬ LÝ CHỨC NĂNG CHÍNH
// ==========================================

// Hàm 1: Sinh ra các thẻ HTML chứa thông tin sản phẩm
function hienThiSanPham(danhSach, khungChua) {
    khungChua.innerHTML = ""; // Xóa trắng dữ liệu cũ

    if (danhSach.length === 0) {
        khungChua.innerHTML = `<h5 class="text-muted text-center w-100 mt-5">Không tìm thấy sản phẩm nào.</h5>`;
        return;
    }

    let chuoiHTML = ""; 

    // Lặp qua từng sản phẩm để tạo khung Card
    danhSach.forEach(function(sp, viTri) {
        let anhDung = sp.image.replace('../', './'); // Sửa lại đường dẫn ảnh cho khớp

        chuoiHTML += `
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${anhDung}" class="card-img-top p-3" style="object-fit: contain; height: 200px; cursor: pointer;" onclick="moChiTietSanPham(${viTri})">
                    
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title text-truncate" style="cursor: pointer;" onclick="moChiTietSanPham(${viTri})">${sp.name}</h6>
                        <p class="card-text text-danger fw-bold mb-3">${sp.price}</p>
                        
                        <div class="mt-auto d-flex gap-2">
                            <button class="btn btn-outline-info btn-sm w-50" onclick="moChiTietSanPham(${viTri})">Chi tiết</button>
                            <button class="btn btn-primary btn-sm w-50" onclick="themVaoGioHang(${viTri})">Vào giỏ</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    khungChua.innerHTML = chuoiHTML; // Đẩy toàn bộ HTML ra web
}

// Hàm 2: Tạo sẵn cái khung hộp thoại (Modal) rỗng ẩn dưới đáy trang web
function taoKhungModal() {
    if (document.getElementById('productModal')) return;
    
    const modalHTML = `
        <div class="modal fade" id="productModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="modalProductBody"></div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}
taoKhungModal(); // Chạy hàm này luôn khi tải script


// Hàm 3: Đổ dữ liệu vào khung Modal khi click vào 1 sản phẩm
window.moChiTietSanPham = function(viTri) {
    let sp = danhSachSanPham[viTri]; // Tìm đúng sản phẩm theo vị trí
    let noiDungModal = document.getElementById('modalProductBody');
    let anhDung = sp.image.replace('../', './');
    
    // Kẻ bảng thông số kỹ thuật (Nếu có dữ liệu)
    let bangThongSo = "";
    if (sp.detailedSpecs && sp.detailedSpecs.length > 0) {
        bangThongSo += `<div class="mt-5"><h5 class="fw-bold mb-2">Thông số kỹ thuật</h5><table class="table table-bordered text-start"><tbody>`;
        
        sp.detailedSpecs.forEach(function(thongso) {
            bangThongSo += `<tr><th class="bg-light" style="width: 30%;">${thongso.label}</th><td>${thongso.value}</td></tr>`;
        });
        
        bangThongSo += `</tbody></table></div>`;
    }

    // Đổ hình ảnh, tên, giá và bảng thông số vào Modal
    noiDungModal.innerHTML = `
        <div class="row">
            <div class="col-md-5 text-center">
                <img src="${anhDung}" class="img-fluid rounded">
            </div>
            <div class="col-md-7">
                <h3 class="fw-bold">${sp.name}</h3>
                <p class="text-danger h4 fw-bold mt-2 mb-4">${sp.price}</p>
                <button class="btn btn-danger w-100 py-3 fw-bold" onclick="themVaoGioHang(${viTri})">ĐẶT HÀNG NGAY</button>
            </div>
        </div>
        ${bangThongSo}
    `;

    // Hiển thị Modal lên
    const myModal = new bootstrap.Modal(document.getElementById('productModal'));
    myModal.show();
};


// Hàm 4: Chức năng thêm hàng vào bộ nhớ trình duyệt (LocalStorage)
window.themVaoGioHang = function(viTri) {
    let sp = danhSachSanPham[viTri];
    
    // Lấy giỏ hàng cũ ra xem (nếu chưa có thì tạo mảng rỗng [])
    let gioHang = JSON.parse(localStorage.getItem('cart')) || [];

    // Tìm xem món này đã từng được bấm thêm chưa
    let sanPhamDaCo = gioHang.find(item => item.id === sp.id);
    
    if (sanPhamDaCo) {
        sanPhamDaCo.quantity += 1; // Có rồi thì cộng dồn số lượng
    } else {
        sp.quantity = 1; // Chưa có thì gán số lượng là 1 rồi nhét vào mảng
        gioHang.push(sp);
    }

    // Cất ngược lại vào LocalStorage
    localStorage.setItem('cart', JSON.stringify(gioHang));
    alert("Đã thêm " + sp.name + " vào giỏ hàng!");
};