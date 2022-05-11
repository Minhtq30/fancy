// Chứa các const của project mong muốn sử dụng chung.
// TODO NamVH: Bên moshop đang để tạm các const này trong store nên đang để tạm đây.

const constantModule = {
  namespaced: true,
  state: {
    expNotes: [
      {
        name: "Giao hàng một phần",
        value: "Giao hàng một phần",
        text: "Giao hàng một phần",
      },
      {
        name: "Có vấn đề gọi shop, không tự ý hủy đơn",
        value: "Có vấn đề gọi shop, không tự ý hủy đơn",
        text: "Có vấn đề gọi shop, không tự ý hủy đơn",
      },
      {
        name: "Gọi khách trước khi giao",
        value: "Gọi khách trước khi giao",
        text: "Gọi khách trước khi giao",
      },
      {
        name: "Khách không lấy hàng thu ship",
        value: "Khách không lấy hàng thu ship",
        text: "Khách không lấy hàng thu ship",
      },
    ],
    shipMethods: [
      { text: "Bay", label: "Bay", value: "fly", key: "fly" },
      { text: "Bộ", label: "Bộ", value: "road", key: "road" },
    ],
    serviceMethods: [
      {
        text: "Express (Hàng nhỏ ≤20kg)",
        value: "Express",
        key: "express",
      },
      { text: "BBS (Hàng lớn >20kg)", value: "BBS", key: "bbs" },
    ],
    whoPays: [
      { label: "Khách trả", value: "khach", key: "1" }, // freeship = false
      { label: "Shop trả", value: "shop", key: "0" }, // freeship = true
    ],
    shop: [],
    tagListExcel: [
      {
        key: 1,
        title: "Hàng dễ vỡ",
        extFeeNote: "20% phí dịch vụ",
        extFeeNoteExplain: [
          "Hàng dễ vỡ là những mặt hàng làm bằng chất liệu dễ bị hư hỏng, đổ vỡ trong quá trình vận chuyển.",
          "Cách tính phụ phí hàng dễ vỡ bằng 20% tổng phí dịch vụ (gồm phí ship + phí bảo hiểm nếu có).",
          "Trường hợp hàng hóa xảy ra sự cố hư hại, hỏng vỡ, GHTK sẽ chịu toàn bộ trách nhiệm với đơn hàng được tích Dễ vỡ.",
        ],
      },
      {
        key: 2,
        title: "Hàng giá trị cao",
        extFeeNote: "+Ảnh giá trị hàng",
        extFeeNoteExplain: [
          "Hàng giá trị cao là những mặt hàng có giá trị hàng hóa > 3,000,000đ. Các hàng hóa giá trị cao sẽ tính thêm phí bảo hiểm là khoản bảo hiểm cho các rủi ro trong quá trình vận chuyển hoặc lưu kho.",
          "Phí bảo hiểm bằng 0,5% giá trị hàng hoá",
          "GHTK sẽ bồi hoàn 100% giá trị bảo hiểm khi mất hàng (tối đa 20.000.000 VNĐ) nếu có giấy tờ chứng minh nguồn gốc và giá trị hàng hoá (hoá đơn nhập hàng, hoá đơn mua hàng hợp lệ vầ khớp với thông tin sản phẩm trên hệ thống GHTK...). Trong trường hợp Shop không thể chứng minh nguồn gốc và giá trị hàng hoá, bồi thường tối đa 04 lần cước phí vận chuyển.",
        ],
      },
      {
        key: 6,
        title: "Gia cố hàng hóa",
        extFeeNote: "20% phí dịch vụ",
        extFeeNoteExplain: [
          "GHTK cung cấp thêm dịch vụ gia cố hàng hoá cho các đơn hàng BBS đóng gói chưa đảm bảo với phụ phí là 20% phí vận chuyển của đơn hàng, tối thiếu là 50,000đ/ đơn hàng.",
        ],
      },
      {
        key: 10,
        title: "Cho xem hàng / đồng kiểm",
        field: "checking_service",
        extFeeNote: "Miễn phí",
        extFeeNoteExplain: [
          "GHTK hỗ trợ dịch vụ Cho xem hàng / đồng kiểm cho phép khách hàng xem sản phẩm trước khi nhận hàng.",
          "Khi nhận hàng từ nhân viên giao hàng, khách hàng có thể mở kiện hàng để xem hàng hóa trước khi quyết định có nhận hay không.",
        ],
      },
      {
        key: 11,
        title: "Cho thử hàng / test sản phẩm",
        field: "try_on_service",
        extFeeNote: "Miễn phí",
        extFeeNoteExplain: [
          "GHTK hỗ trợ dịch vụ Thử hàng / test sản phẩm cho phép khách hàng kiểm tra và thử từng sản phẩm có trong kiện hàng.",
          "Lưu ý: Việc thử hàng không bao gồm mở seal (niêm phong) riêng của sản phẩm.",
        ],
      },
      {
        key: 12,
        title: "Cho COD sửa tiền thu hộ",
        extFeeNote: "Miễn phí",
        field: "allow_cod_change_pick_money",
        extFeeNoteExplain: [
          "Nhân viên giao hàng có thể sửa tiền thu hộ của đơn hàng cho shop khi có sự thay đổi, nhằm giúp việc giao hàng diễn ra nhanh chóng và thuận tiện hơn.",
        ],
      },
      {
        key: 13,
        title:
          "Gọi shop khi khách không nhận hàng, không liên lạc được, sai thông tin",
        field: "calling_service",
        extFeeNote: "Miễn phí",
        extFeeNoteExplain: [
          "Nhân viên giao hàng của GHTK sẽ liên hệ với Shop trong trường hợp đơn hàng gặp vấn đề như: Sai thông tin người nhận, không liên lạc được, khách hàng từ chối nhận hàng.",
          "Việc này giúp Shop kịp thời nắm được tình hình và đảm bảo khả năng đơn hàng được giao thành công.",
        ],
      },

      {
        key: 17,
        title: "Giao hàng 1 phần chọn sản phẩm",
        field: "partial_shipment_item_selecting",
        extFeeNote: "Phí hoàn",
        extFeeNoteExplain: [
          "Khi Shop nhấn chọn Giao hàng 1 phần chọn sản phẩm, GHTK sẽ hỗ trợ cho khách chỉ nhận 1 phần hàng và trả tiền một phần hàng (theo thỏa thuận giữa khách và Shop).",
          "Những sản phẩm còn lại sẽ được trả về Shop với mức phí nội tỉnh = 5.000đ/đơn, liên tỉnh = 50% phí ship.",
        ],
      },
      {
        key: 18,
        title: "Giao hàng 1 phần đổi trả hàng",
        field: "partial_shipment_item_returning",
        extFeeNote: "Phí hoàn",
        extFeeNoteExplain: [
          "Khi Shop nhấn chọn Giao hàng 1 phần đổi trả hàng, GHTK sẽ hỗ trợ giao 1 sản phẩm đến cho khách hàng và mang phần hàng còn lại về lại cho Shop.",
          "Phần hàng mang về cho Shop được xem như đơn hàng trả bình thường với mức phí nội tỉnh = 5.000đ/đơn, liên tỉnh = 50% phí ship.",
        ],
      },
      {
        key: 19,
        title: "Không giao được thu:",
        extFeeNote: "Phí hoàn",
        field: "not_delivered_fee",
        extFeeNoteExplain: [
          "Với các đơn hàng Shop nhấn chọn Không giao được thu phí, GHTK sẽ hỗ trợ khách hàng không nhận sản phẩm nhưng thu một phần phí cho Shop.",
          "Phí cần thu mặc định bằng phí ship, Shop có thể sửa giá trị tiền cần thu theo mong muốn của mình.",
          "Phần hàng mang về cho Shop được xem như đơn hàng trả bình thường với mức phí nội tỉnh = 5.000đ/đơn, liên tỉnh = 50% phí ship.",
        ],
      },

      {
        key: 21,
        title: "Hoàn hàng",
        extFeeNote: "(?)",
        extFeeNoteExplain: [
          "Đơn hàng sau 3 ca giao không thành công: Shop có 24h để xác nhận (Giao lại/ Giao KH mới/ Trả shop). Hết thời gian này, đơn hàng sẽ Tự động lưu kho chờ check/ Không lưu kho, hoàn ngay/ Không nhận hàng trả theo thiết lập mặc định của shop khi tạo đơn.",
          "- Tự động lưu kho chờ check: Sau 24h xác nhận, ĐH sẽ tự động được lưu kho và tính phí theo thời gian mà shop đã thiết lập. Thời gian lưu kho tối đa 30 ngày.",
          "- Không lưu kho/ hoàn ngay: Sau 24h xác nhận, đơn hàng sẽ không lưu kho và được trả về ngay cho shop.",
          "- Không nhận hàng trả: GHTK sẽ không trả hàng về shop và có toàn quyền xử lý với những đơn hàng này.",
          "Phí lưu kho: ",
          "Ngày đầu tiên: 1000đ/đơn\n" +
            "Ngày thứ 2: 2000đ/ đơn\n" +
            "Từ ngày thứ 3: 3000đ/đơn.",
          "Phí giao lại: 10.000đ/lần/đơn.",
          "Phí giao KH mới: \n" +
            "Cùng tỉnh với KH cũ: 50% phí ship\n" +
            "Khác tỉnh với KH cũ: 100% phí ship\n" +
            "  (Cách tính phí ship: theo biểu phí niêm yết)",
        ],
      },
    ],
    not_delivered_fee: 0,
    not_delivered_options: [
      {
        value: 14,
        label: "Tự động lưu kho chờ check",
      },
      {
        value: 16,
        label: "Không nhận hàng trả",
      },
      {
        value: 15,
        label: "Không lưu kho/ hoàn ngay",
      },
    ],
    min_order_value_shop_b2c: 3000000,
    min_order_value_shop_c2c: 1000000,
  },
  mutations: {},
  actions: {},
};

export default constantModule;
