/**
 * Tệp: main.js
 * Nhiệm vụ: Xử lý các tương tác UI dùng chung cho toàn bộ website (Header, Sidebar, Overlay...)
 */

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. XỬ LÝ HIỆU ỨNG ACCORDION CHO SIDEBAR (Đóng/Mở danh mục) ---
    const sidebarHeaders = document.querySelectorAll('.sidebar-header');

    sidebarHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const currentItem = this.parentElement;
            const isActive = currentItem.classList.contains('active');

            // Thu gọn tất cả các mục khác trước
            document.querySelectorAll('.sidebar-item').forEach(item => {
                item.classList.remove('active');
            });

            // Nếu mục vừa bấm đang đóng thì mở nó ra
            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    });

    // --- 2. XỬ LÝ MENU MOBILE & OVERLAY (Cho nút "Danh mục" ở các trang) ---
    const btnMenu = document.getElementById("btnMenu");
    const overlay = document.getElementById("overlay");
    const mobileSidebar = document.getElementById("mobileSidebar"); // Trúng id này thì sidebar mới trượt ra

    // Kiểm tra xem các phần tử có tồn tại trên trang không để tránh lỗi
    if (btnMenu && overlay) {
        btnMenu.addEventListener("click", function() {
            overlay.classList.toggle("active");
            if (mobileSidebar) mobileSidebar.classList.toggle("active");
        });

        // Click vào vùng tối để tắt cả menu và overlay
        overlay.addEventListener("click", function() {
            overlay.classList.remove("active");
            if (mobileSidebar) mobileSidebar.classList.remove("active");
        });
    }
});