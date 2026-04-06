$(document).ready(function() {
    const products = [
        { name: "Laptop gaming Lenovo LOQ 15IRX10...", img: "../../assets/img/banner/banner_1.jpg", priceNew: "35.790.000₫" },
        { name: "Laptop gaming Lenovo LOQ 15IRX10...", img: "../../assets/img/pay_img/pay_1.png", priceNew: "35.790.000₫" },
        { name: "Laptop gaming Acer Nitro ProPanel ANV1...", img: "", priceNew: "33.290.000₫" },
        { name: "Laptop gaming Gigabyte A16...", img: "", priceNew: "27.990.000₫"},
        { name: "Laptop gaming Gigabyte A16...", img: "", priceNew: "27.990.000₫"},
        { name: "Laptop gaming Gigabyte A16...", img: "", priceNew: "27.990.000₫"},
        { name: "Laptop gaming Gigabyte A16...", img: "", priceNew: "27.990.000₫"},
        { name: "Laptop gaming Gigabyte A16...", img: "", priceNew: "27.990.000₫"}
    ];

    let htmlToRender = '';

    $.each(products, function(index, product) {
        htmlToRender += `
            <div class="col">
                <div class="product-card h-100" data-bs-toggle="modal" data-bs-target="#productModal" style="cursor: pointer;"
                    data-name="${product.name}" data-price="${product.priceNew}" data-img="${product.img}">
                    <img src="${product.img}" alt="${product.name}" class="product-img">
                    <div class="product-title">${product.name}</div>
                    <span class="price-new">${product.priceNew}</span>
                </div>
            </div>
        `;
    });

    $('#product-grid-container').html(htmlToRender);

    $('#productModal').on('show.bs.modal', function(e) {
        let card = $(e.relatedTarget);
        $(this).find('h4').text(card.data('name'));
        $(this).find('.fs-3').text(card.data('price'));
        $(this).find('.img-fluid').attr('src', card.data('img'));
    });
});