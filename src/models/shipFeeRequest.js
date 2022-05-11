/**
 * Request Tính phí đơn hàng
 */
export default class ShipFeeRequest {
  /**
   * Loại đơn hàng (express / bbs/ opm)
   */
  package_type;
  pick_province;
  pick_district;
  province;
  district;
  address;
  weight;
  value;
  deliver_option;
  tags;

  /**
   * Khởi tạo
   * @param {*} package_type express / bbs/ opm
   * @param {*} pick_province Tên tỉnh/thành phố nơi lấy hàng hóa
   * @param {*} pick_district Tên quận/huyện nơi lấy hàng hóa
   * @param {*} province Tên tỉnh/thành phố của người nhận hàng hóa
   * @param {*} district Tên quận/huyện của người nhận hàng hóa
   * @param {*} address Địa chỉ chi tiết của người nhận hàng, ví dụ: Chung cư CT1, ngõ 58, đường Trần Bình
   * @param {*} weight Cân nặng của gói hàng, đơn vị sử dụng Gram
   * @param {*} value Giá trị thực của đơn hàng áp dụng để tính phí bảo hiểm, đơn vị sử dụng VNĐ
   * @param {*} deliver_option Sử dụng phương thức vận chuyển xfast. Nhận 1 trong 2 giá trị xteam/none
   * @param {*} tags Gắn nhãn cho đơn hàng. Truyền giá trị nhãn vào mảng tags
   * @param {*} transport GPhương thức vâng chuyển road ( bộ ) , fly (bay). Nếu phương thức vận chuyển không hợp lệ thì GHTK sẽ tự động nhảy về PTVC mặc định
   */
  constructor(
    package_type,
    pick_province,
    pick_district,
    province,
    district,
    address,
    weight,
    value,
    deliver_option,
    tags
  ) {
    this.package_type = package_type;
    this.pick_province = pick_province;
    this.pick_district = pick_district;
    this.province = province;
    this.district = district;
    this.address = address;
    this.weight = weight;
    this.value = value;
    this.deliver_option = deliver_option;
    this.tags = tags;
  }
}
