<template>
  <div class="create-order__container">
    <div
      class="create-order__main"
      v-for="(order, orderIndex) in listOrder"
      :class="{
        't-mt-5': orderIndex > 0,
        'create-order__main--three min-h-76': listOrder.length < 2,
        'create-order__main--four': listOrder.length > 1,
      }"
      :key="order.orderId"
    >
      <div
        class="create-order__message t-text-warning t-mb-2"
        v-if="order.errorMessage"
      >
        {{ order.errorMessage }}
      </div>
      <div v-if="listOrder.length > 1" class="create-order__index">
        <div title="Xóa đơn hàng">
          <span class="text-index">
            {{ orderIndex + 1 }}
          </span>
          <span class="t-text-warning" @click="onClickRemoveOrder(orderIndex)"
            ><times-icon></times-icon
          ></span>
        </div>
      </div>
      <div class="create-order__left">
        <h3
          :id="'customer_' + orderIndex"
          class="t-font-bold t-flex t-items-center"
          style="font-size: 18px; margin-bottom: 0; height: 35px"
        >
          NGƯỜI NHẬN
        </h3>
        <customer-info
          :key="order.orderId"
          @update:customerInfo="(value) => updateCustomerInfo(order, value)"
          :orderType="order.type"
          :orderId="order.orderId"
          :dataTracking="dataTracking"
          :updateDataTracking="updateDataTracking"
        />
        <h3 class="t-font-bold t-mt-10" style="font-size: 18px">
          Lấy & Giao tận nơi
        </h3>
        <a-row align="middle" class="form-item">
          <a-col :span="12">
            <g-radio
              :id="`smallType` + orderIndex"
              v-model="order.type"
              @on-selection-change="onSelectionChangeOrderType(order, $event)"
              check-value="express"
            >
              <span class="t-flex t-items-center t-ml-2">
                <small-type-icon></small-type-icon>
                <span class="t-ml-2"
                  >Hàng nhỏ Express (&leq;&nbsp;{{ bbsMinWeight }}kg)</span
                >
              </span>
            </g-radio>
          </a-col>
          <a-col :span="12">
            <g-radio
              :disabled="order.loading"
              :id="`bigType` + orderIndex"
              v-model="order.type"
              check-value="bbs"
              @on-selection-change="onSelectionChangeOrderType(order, $event)"
            >
              <span class="t-flex t-items-center t-ml-2">
                <big-type-icon></big-type-icon>
                <span class="t-ml-2"
                  >Hàng lớn BBS (&#62;&nbsp;{{ bbsMinWeight }}kg)</span
                >
              </span>
            </g-radio>
          </a-col>
        </a-row>
        <div v-if="!order.isUrbanAddress">
          <a-row align="middle" class="form-item">
            <a-col :span="8">
              <g-radio
                :id="`transportRoad` + orderIndex"
                v-model="order.transport"
                check-value="road"
                @onSelectionChange="onSelectionChangeTransportType(order)"
              >
                <span
                  class="t-flex t-items-center t-ml-2"
                  :style="transportTypeStyle(order, 'road')"
                >
                  <truck-icon></truck-icon>
                  <span class="t-ml-2">Bộ</span>
                </span>
              </g-radio>
            </a-col>
            <a-col
              class="product__control t-flex t-flex-row t-justify-between t-items-center"
            >
              <g-select
                :disabled="order.transport != 'road'"
                :hide-selected-option="order.transport != 'road'"
                v-model:selectedItem="order.pick_date"
                :data-source="order.listPickTimeDataSource"
                :show-search="false"
                @on-selection-change="
                  (item) => onPickDateSelectionChange(order, item)
                "
                class="t-mr-2"
                style="flex: 0 1 250px"
                optionAlign="center"
                inputJustify="center"
                placeholder="Chọn thời gian lấy"
              ></g-select>
              <g-select
                :disabled="order.transport != 'road'"
                :hide-selected-option="order.transport != 'road'"
                v-model:selectedItem="order.deliver_date"
                :data-source="order.listDeliverTimeDataSource"
                :show-search="false"
                optionAlign="center"
                inputJustify="center"
                style="flex: 0 1 250px"
                placeholder="Chọn thời gian giao"
              ></g-select>
            </a-col>
          </a-row>
          <a-row
            v-if="isShowFly(order) && order.type !== 'bbs'"
            align="middle"
            class="form-item"
          >
            <a-col :span="8">
              <g-radio
                :id="`transportFly` + orderIndex"
                v-model="order.transport"
                check-value="fly"
                class=""
                @onSelectionChange="onSelectionChangeTransportType(order)"
              >
                <span
                  class="t-flex t-items-center t-ml-2"
                  :style="transportTypeStyle(order, 'fly')"
                >
                  <plane-icon></plane-icon>
                  <span class="t-ml-2">Bay</span>
                </span>
              </g-radio>
            </a-col>
            <a-col
              class="product__control t-flex t-flex-row t-justify-between t-items-center"
            >
              <g-select
                :disabled="order.transport != 'fly'"
                :hide-selected-option="order.transport != 'fly'"
                v-model:selectedItem="order.pick_date"
                :data-source="order.listPickTimeDataSource"
                :show-search="false"
                @on-selection-change="
                  (item) => onPickDateSelectionChange(order, item)
                "
                class="t-mr-2"
                style="flex: 0 1 250px"
                optionAlign="center"
                inputJustify="center"
                placeholder="Chọn thời gian lấy"
              ></g-select>
              <g-select
                :disabled="order.transport != 'fly'"
                :hide-selected-option="order.transport != 'fly'"
                v-model:selectedItem="order.deliver_date"
                :data-source="order.listDeliverTimeDataSource"
                :show-search="false"
                optionAlign="center"
                inputJustify="center"
                style="flex: 0 1 250px"
                placeholder="Chọn thời gian giao"
              ></g-select>
            </a-col>
          </a-row>
        </div>
        <a-row v-if="order.isUrbanAddress" align="middle" class="form-item">
          <a-col :span="8">
            <g-radio
              :disabled="order.loading"
              :id="`shippingOptionsDefault` + orderIndex"
              v-model="order.shipping_option"
              check-value="default_urban_shipping"
              @on-selection-change="
                onSelectionChangeShippingOption(order, $event)
              "
            >
              <span class="t-flex t-items-center t-ml-2"> Nội thành 6H </span>
            </g-radio>
          </a-col>
          <a-col
            class="product__control t-flex t-flex-row t-justify-between t-items-center"
          >
            <g-select
              v-model:selectedItem="order.pick_date"
              :data-source="order.listPickTimeDataSource"
              :show-search="false"
              @on-selection-change="
                (item) => onPickDateSelectionChange(order, item)
              "
              class="t-mr-2"
              style="flex: 0 1 250px"
              optionAlign="center"
              inputJustify="center"
              placeholder="Chọn thời gian lấy"
            ></g-select>
            <g-select
              v-model:selectedItem="order.deliver_date"
              :data-source="order.listDeliverTimeDataSource"
              :show-search="false"
              optionAlign="center"
              inputJustify="center"
              style="flex: 0 1 250px"
              placeholder="Chọn thời gian giao"
            ></g-select>
          </a-col>
        </a-row>
        <a-row
          v-if="order.isUrbanAddress && xfastValid"
          align="middle"
          class="form-item"
        >
          <a-col :span="8">
            <g-radio
              :disabled="order.loading"
              :id="`shippingOptionXfast` + orderIndex"
              v-model="order.shipping_option"
              check-value="xfast"
              @on-selection-change="
                onSelectionChangeShippingOption(order, $event)
              "
            >
              <span
                @mouseover="order.isShowXfastDescription = true"
                @mouseleave="order.isShowXfastDescription = false"
                class="t-flex t-items-center t-ml-2"
              >
                XFAST NOW
              </span>
            </g-radio>
          </a-col>
          <a-col :span="16">
            <g-select
              :data-source="order.listXFastTimeDataSource"
              v-model:selected-item="order.selectedXFastTime"
              @on-selection-change="onSelectionChangeXfastTime(order)"
              placeholder="Dự kiến lấy & giao"
            >
            </g-select>
          </a-col>
          <a-col
            v-if="order.isShowXfastDescription"
            v-click-outside="() => (order.isShowXfastDescription = false)"
            class="xfast-tooltip fade-in t-text-white t-w-full t-mt-2 t-text-[16px] t-p-2 t-rounded t-bg-[#219653]"
            >XFAST NOW là dịch vụ đến lấy & giao hàng ngay các quận nội thành
            tại Hà Nội và TP. Hồ Chí Minh</a-col
          >
        </a-row>
        <h3 class="t-font-bold t-mt-8 t-text-lg">Hình thức lấy hàng</h3>
        <a-row align="middle" class="form-item">
          <a-col :span="8">
            <g-radio
              :disabled="order.loading"
              :id="`pickOptionCod` + orderIndex"
              v-model="order.pick_option"
              check-value="cod"
              @onSelectionChange="handleChangePickOptionCod(order)"
            >
              <span class="t-flex t-items-center t-ml-2">
                Lấy hàng tận nơi
              </span>
            </g-radio>
          </a-col>
          <a-col :span="16">
            <g-select
              :disabled="order.loading"
              :data-source="pickAddresses"
              v-model:selected-item="order.selectedPickAddressCod"
              :hasSuffix="true"
              placeholder="Đường/Ấp/Khu"
              @on-selection-change="
                (item) => onPickAddressCodSelectionChange(order, item)
              "
            >
              <template v-slot:suffix>
                <span>
                  <select-location-icon
                    v-if="isShowSelectLocation(order)"
                  ></select-location-icon>
                  <un-select-location-icon v-else></un-select-location-icon>
                </span>
              </template>
              <template v-slot:option="{ item, index }">
                <div class="t-flex t-flex-row t-items-center">
                  <b class="t-mr-2" style="width: 95px; flex: 0 1 95px">
                    Địa chỉ {{ index + 1 }}:</b
                  >
                  <p style="flex: 1" class="t-mb-0">{{ item.labelEx }}</p>
                </div>
              </template>
            </g-select>
          </a-col>
        </a-row>
        <a-row align="middle" class="form-item">
          <a-col :span="8">
            <g-radio
              :disabled="order.loading"
              :id="`pickOptionPost` + orderIndex"
              v-model="order.pick_option"
              check-value="post"
              @onSelectionChange="handleChangePickOptionPost(order)"
            >
              <span class="t-flex t-items-center t-ml-2">
                Gửi hàng tại bưu cục
              </span>
            </g-radio>
          </a-col>
          <a-col :span="16">
            <g-select
              :disabled="order.loading"
              :data-source="order.nearOffices"
              v-model:selected-item="order.selectedPickAddressPost"
              @on-selection-change="onPickAddressSelectionChange(order)"
              placeholder="Bấm chọn Bưu cục gần nhất"
            >
              <template v-slot:option="{ item }">
                <div class="t-flex t-flex-row t-items-center">
                  <image-with-default
                    :src="item.payload.image"
                    :src-default="defaultPostOffice"
                    class="t-mr-2"
                  />
                  <div style="flex: 1" class="t-mb-0 t-flex t-flex-col">
                    <b>{{ item.payload.name }}</b>
                    <span>{{ item.payload.address }}</span>
                    <div class="t-flex t-items-center">
                      <span class="t-text-primary t-mr-2">
                        {{ item.payload.status }}
                      </span>
                      <span> ({{ item.payload.time_work }}) </span>
                    </div>
                    <div class="t-flex t-items-center">
                      <span class="t-text-primary t-mr-2">
                        <marker-icon></marker-icon>
                      </span>
                      <span>
                        {{ $filters.round(item.payload.distance) }} km
                      </span>
                      <span class="t-ml-10 t-text-primary t-underline">
                        Xem chi tiết
                        <right-forward-icon></right-forward-icon>
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </g-select>
          </a-col>
        </a-row>
      </div>
      <a-divider style="height: 100%" type="vertical" />
      <div class="create-order__right">
        <product-list
          :order-type="order.type"
          :key="order.orderId"
          @update:productList="(value) => updateProductList(order, value)"
        />
        <a-row align="bottom" class="form-item" style="margin-bottom: 0">
          <a-col class="product__control">
            <a-row
              align="middle"
              class="form-item"
              style="min-height: 34px"
              v-if="order.type === 'bbs'"
            >
              <a-col class="product__label">
                <label class="t-text-black">
                  KL tính cước
                  <a-tooltip>
                    <template #title>
                      <div>
                        <span style="font-weight: 500">
                          Khối lượng tính cước
                        </span>
                        của đơn hàng được tính dựa trên khối lượng thực tế hoặc
                        khối lượng quy đổi (tính theo khối lượng lớn hơn) <br />
                        <div class="t-mt-5" v-if="order.type === 'express'">
                          Khối lượng quy đổi = (Dài*Rộng*Cao) / 6000
                        </div>
                        <div class="t-mt-5" v-else>
                          Khối lượng quy đổi = (Dài*Rộng*Cao) / 4000
                        </div>
                      </div>
                    </template>
                    <span class="t-text-primary" style="cursor: pointer">
                      (?)
                    </span>
                  </a-tooltip>
                </label>
              </a-col>
              <a-col class="product__control">
                <span class="t-ml-1">
                  {{
                    $filters.numberFormatter(
                      order.total_weight > order.total_weight_ex
                        ? order.total_weight
                        : order.total_weight_ex
                    )
                  }}
                  kg
                </span>
                <div
                  v-if="
                    validateBbsWeight(
                      Math.max(order.total_weight, order.total_weight_ex),
                      order.selectedPickAddressCod.payload.province_id
                    )
                  "
                  class="t-text-warning text-[16px]"
                >
                  {{
                    validateBbsWeight(
                      Math.max(order.total_weight, order.total_weight_ex),
                      order.selectedPickAddressCod.payload.province_id
                    )
                  }}
                </div>
              </a-col>
            </a-row>
            <a-row align="middle" class="form-item" v-else>
              <a-col class="product__label">
                <label class="t-text-black">Tổng khối lượng</label>
              </a-col>
              <a-col class="product__control t-flex t-flex-row t-items-start">
                <g-input
                  :borderless="true"
                  placeholder="0 kg"
                  :hasValueType="true"
                  valueType="kg"
                  :number-only="true"
                  v-model="order.total_weight"
                  :formatter="$filters.numberFormatter"
                  :parser="$filters.numberCommaParser"
                  :outer-error-message="order.validate.total_weight.outerError"
                  @input-change="onExpressTotalWeightInputChange(order)"
                  style="flex: 2"
                ></g-input>
                <div class="t-ml-5 total_weight__express" style="flex: 5">
                  <g-input
                    v-if="isShowPickSize(order)"
                    :borderless="true"
                    :readonly="true"
                    placeholder="Nhập kích thước"
                    justify="center"
                    :inner-error-message="
                      order.validate.total_size_text.innerError
                    "
                    :model-value="total_size(order)"
                    @click="handleClickTotalSize($event, order)"
                  ></g-input>
                  <div
                    v-if="order.isShowPickSizeModal"
                    class="popup"
                    v-click-outside="
                      order.isShowPickSizeModal
                        ? () => onClickOutsidePickSizeModal(order)
                        : null
                    "
                  >
                    <div
                      class="t-flex t-flex-row t-items-center t-w-full popup-title"
                    >
                      <h3
                        class="t-text-center t-text-white t-mb-0"
                        style="
                          flex: 1;
                          font-size: 16px;
                          font-weight: 500;
                          margin-left: 50px;
                        "
                      >
                        Chọn kích thước
                      </h3>
                      <span
                        class="t-flex t-items-center t-justify-center t-text-white"
                        style="flex: 0 1 50px; width: 50px; cursor: pointer"
                        @click="order.isShowPickSizeModal = false"
                      >
                        <times-icon :width="16" :height="16"></times-icon>
                      </span>
                    </div>
                    <div class="popup-content">
                      <div class="t-text-black t-mb-2">Kích thước (cm)</div>
                      <div
                        class="t-flex t-flex-row t-items-center t-justify-between"
                      >
                        <g-select
                          v-model:selectedItem="order.pickSize.length"
                          :data-source="sizeDataSource"
                          :showSearch="false"
                          optionAlign="center"
                          placeholder="Dài"
                          inputJustify="center"
                          type="suggestion"
                          valueType="number"
                          number-only
                          style="flex: 1"
                          :max="maxSize"
                        ></g-select>
                        <b class="t-mx-3">x</b>
                        <g-select
                          v-model:selectedItem="order.pickSize.width"
                          :data-source="sizeDataSource"
                          :showSearch="false"
                          optionAlign="center"
                          placeholder="Rộng"
                          inputJustify="center"
                          type="suggestion"
                          valueType="number"
                          number-only
                          style="flex: 1"
                          :max="maxSize"
                        ></g-select>
                        <b class="t-mx-3">x</b>
                        <g-select
                          v-model:selectedItem="order.pickSize.height"
                          :data-source="sizeDataSource"
                          showSearch
                          optionAlign="center"
                          placeholder="Cao"
                          inputJustify="center"
                          type="suggestion"
                          valueType="number"
                          number-only
                          style="flex: 1"
                          :max="maxSize"
                        ></g-select>
                      </div>
                      <div class="popup-action">
                        <g-button
                          type="primary"
                          @on-click="onSubmitPickSize($event, order)"
                        >
                          Lưu thông tin
                        </g-button>
                      </div>
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>
            <a-row
              align="middle"
              class="form-item"
              v-if="isShowPickSize(order)"
            >
              <a-col class="product__label">
                <label class="t-text-black">
                  KL tính cước
                  <a-tooltip>
                    <template #title>
                      <div>
                        <span style="font-weight: 500">
                          Khối lượng tính cước
                        </span>
                        của đơn hàng được tính dựa trên khối lượng thực tế hoặc
                        khối lượng quy đổi (tính theo khối lượng lớn hơn) <br />
                        <div class="t-mt-5">
                          Khối lượng quy đổi = (Dài*Rộng*Cao) / 6000
                        </div>
                      </div>
                    </template>
                    <span class="t-text-primary" style="cursor: pointer">
                      (?)
                    </span>
                  </a-tooltip>
                </label>
              </a-col>
              <a-col class="product__control">
                <span>
                  {{
                    $filters.numberFormatter(
                      order.total_weight > order.total_weight_ex
                        ? order.total_weight
                        : order.total_weight_ex
                    )
                  }}
                  kg
                </span>
              </a-col>
            </a-row>
            <a-row align="middle" class="form-item">
              <a-col class="product__label">
                <label class="t-text-black">Tiền thu hộ</label>
              </a-col>
              <a-col class="product__control">
                <g-input
                  :borderless="true"
                  placeholder="0 đ"
                  v-model="order.pick_money"
                  :formatter="$filters.integerFormatter"
                  :parser="$filters.numberCommaParser"
                  :number-only="true"
                  @on-blur="onOrderPickMoneyBlur(order)"
                  :innerErrorMessage="order.validate.pick_money.innerError"
                  :outerErrorMessage="order.validate.pick_money.outerError"
                ></g-input>
              </a-col>
            </a-row>
            <a-row align="middle" class="form-item">
              <a-col class="product__label">
                <label class="t-text-black">Giá trị hàng</label>
              </a-col>
              <a-col class="product__control">
                <g-input
                  :borderless="true"
                  placeholder="0 đ"
                  :hasSuffix="isShowFreeInsurance(order)"
                  v-model="order.value"
                  :number-only="true"
                  :formatter="$filters.integerFormatter"
                  :parser="$filters.numberCommaParser"
                  @input-change="calculateOrderValue(order)"
                  @on-blur="onOrderValueBlur(order)"
                  :innerErrorMessage="order.validate.value.innerError"
                  :outerErrorMessage="order.validate.value.outerError"
                >
                  <template v-slot:suffix>
                    <span v-if="isShowFreeInsurance(order)">
                      <a-tooltip>
                        <template #title>
                          <div v-if="shopType == 0">
                            <span style="font-weight: 500">
                              Giá trị hàng hóa là giá trị GHTK sẽ bồi thường cho
                              người gửi trong trường hợp có sự cố xảy ra.
                            </span>
                            <span style="font-weight: 500">
                              Phí bảo hiểm được tính như sau:
                            </span>
                            <ul style="margin-left: 30px; margin-top: 30px">
                              <li>
                                Giá trị hàng hóa &lt; 1,000,000đ, GHTK miễn phí
                                bảo hiểm.
                              </li>
                              <li>
                                Giá trị hàng hóa ≥ 1,000,000đ (tối đa
                                20,000,000đ), phí bảo hiểm bằng 0,5% giá trị
                                hàng hóa
                              </li>
                            </ul>
                          </div>
                          <div v-if="shopType == 1">
                            <span style="font-weight: 500">
                              Giá trị hàng hóa là giá trị GHTK sẽ bồi thường cho
                              người gửi trong trường hợp có sự cố xảy ra.
                            </span>
                            <span style="font-weight: 500">
                              Phí bảo hiểm được tính như sau:
                            </span>
                            <ul style="margin-left: 30px; margin-top: 30px">
                              <li>
                                Giá trị hàng hóa ≤ 3,000,000đ, GHTK miễn phí bảo
                                hiểm.
                              </li>
                              <li>
                                Giá trị hàng hóa > 3,000,000đ (tối đa
                                20,000,000đ), phí bảo hiểm bằng 0,5% giá trị
                                hàng hóa
                              </li>
                            </ul>
                          </div>
                        </template>
                        <span
                          class="t-text-primary"
                          style="cursor: pointer; text-decoration: underline"
                        >
                          {{
                            order.insurance_fee > 0
                              ? $filters.numberFormatter(order.insurance_fee) +
                                " đ"
                              : "Miễn phí BH(?)"
                          }}
                        </span>
                      </a-tooltip>
                    </span>
                  </template>
                </g-input>
              </a-col>
            </a-row>
          </a-col>
          <a-col style="flex: 0 1 120px; width: 120px" class="t-ml-8">
            <div
              class="t-w-full t-flex t-justify-end"
              style="margin-bottom: 1em"
            >
              <div
                class="select-image__wrapper"
                @click="selectImage('orderImage' + order.orderId)"
                v-if="!order.image"
              >
                <plus-icon :width="40" :height="40"></plus-icon>
                <span
                  style="font-size: 16px; font-weight: 500; margin-top: 10px"
                >
                  Ảnh ĐH
                </span>
                <input
                  type="file"
                  @change="(e) => onSelectOrderImage(e, order)"
                  :id="'orderImage' + order.orderId"
                  style="display: none"
                />
              </div>
              <div v-else>
                <img
                  @click="selectImage('orderImage' + order.orderId)"
                  style="border-radius: 4px; cursor: pointer"
                  :width="120"
                  :height="120"
                  :src="order.image"
                  alt=""
                />
                <input
                  type="file"
                  @change="(e) => onSelectOrderImage(e, order)"
                  :id="'orderImage' + order.orderId"
                  style="display: none"
                />
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row align="middle" class="form-item">
          <a-col class="product__label">
            <label class="t-text-black">Phí ship</label>
          </a-col>
          <a-col class="product__control t-flex t-flex-row t-items-center">
            <div
              class="t-text-black t-ml-1 t-flex t-items-center"
              style="flex: 1; margin-top: 2px"
              v-if="order.isCalculatingFee"
            >
              <span class="t-text-primary">
                <loading-icon :width="20" :height="20"></loading-icon>
              </span>
              <span class="t-text-primary t-ml-2">Đang tính phí</span>
            </div>
            <span v-else class="t-text-black t-ml-1" style="flex: 1">
              {{ $filters.numberFormatter(order.ship_fee) }}&nbsp;đ
              <span v-if="order.isShowBbsFee" class="t-text-primary t-ml-2">
                {{ $filters.numberFormatter(order.bbs_fee) }}
              </span>
              <a-tooltip>
                <template #title>
                  <div class="t-flex t-flex-row">
                    <div
                      v-for="extFee in order.ext_fees"
                      :key="extFee.type"
                      class="t-mb-2"
                    >
                      <b>{{ extFee.title }}:</b>
                      <span class="t-ml-2 t-text-primary">
                        + {{ $filters.numberFormatter(extFee.amount) }} đ
                      </span>
                    </div>
                  </div>
                </template>
                <span v-if="order.ship_fee_ex" class="t-text-primary t-ml-5">
                  + {{ $filters.numberFormatter(order.ship_fee_ex) }}&nbsp;đ (?)
                </span>
              </a-tooltip>
            </span>
            <g-select
              v-model:selected-item="order.selectedShipFeeType"
              :show-search="false"
              optionAlign="center"
              inputJustify="center"
              :data-source="shipFeeTypeDataSource"
              @on-selection-change="calculateTotalAmount(order)"
              placeholder="Chọn"
              style="flex: 0 1 170px"
            ></g-select>
          </a-col>
        </a-row>
        <a-row align="middle" class="form-item">
          <a-col class="product__label">
            <label class="t-text-black">Tổng tiền</label>
          </a-col>
          <a-col class="product__control">
            <span class="t-text-black t-ml-1">
              {{ $filters.numberFormatter(order.total_amount) }}&nbsp;đ
            </span>
          </a-col>
        </a-row>
        <a-row :gutter="[8]" align="middle" class="form-item">
          <a-col class="product__label">
            <label class="t-text-black">Ghi chú</label>
          </a-col>
          <a-col class="product__control t-flex t-flex-row t-items-center">
            <g-input
              :borderless="true"
              v-model="order.note"
              style="flex: 1"
              placeholder="Nhập ghi chú riêng của đơn hàng"
            ></g-input>
            <g-select
              class="t-ml-10"
              v-model:selectedItem="order.selectedNote"
              :data-source="packageNotes"
              :show-search="false"
              multiple
              direction="right"
              inputJustify="center"
              placeholder="Chọn ghi chú"
              @on-selection-change="onOrderNoteSelectionChange(order)"
              style="flex: 0 1 170px"
            >
              <template v-slot:header v-if="false">
                <div style="padding: 0.25em 0.5em">
                  <a-checkbox
                    class="g-checkbox"
                    :checked="order.isApplyNoteAll"
                    @change="onApplyNoteAll(order, $event)"
                  >
                    <span class="t-font-medium">Áp dụng tất cả</span>
                  </a-checkbox>
                </div>
              </template>
            </g-select>
          </a-col>
        </a-row>

        <a-row :gutter="[8]" align="middle" class="form-item">
          <a-col class="product__label">
            <label class="t-text-black">Mã đơn hàng riêng</label>
          </a-col>
          <a-col class="product__control t-flex t-flex-row t-items-center">
            <g-input
              :borderless="true"
              v-model="order.client_id"
              style="flex: 1"
              placeholder="Nhập mã đơn hàng riêng của shop"
            ></g-input>
          </a-col>
        </a-row>

        <a-row align="middle" class="form-item force-inline-block t-w-full">
          <order-tag
            @onChangeTagsSelected="(data) => updateTagSelected(order, data)"
            :tag-list="tagList"
            :order-type="order.type"
            :not-deliver-options="notDeliverOptions"
            :not-deliver-option="order.not_delivered_option"
            :checked-list-default="order.tags"
            :not-deliver-fee="Number(order.not_delivered_fee)"
            :order-value="Number(order.value)"
            :key="
              order.orderId +
              ' ' +
              order.not_delivered_fee +
              ' ' +
              order.not_delivered_option +
              ' ' +
              order.value
            "
          ></order-tag>
        </a-row>
      </div>
      <div v-if="listOrder.length > 1" class="create-order__delete t-ml-2">
        <g-button
          type="outlined-danger"
          class="t-text-warning"
          size="small"
          title="Xóa đơn hàng"
          @click="onClickRemoveOrder(orderIndex)"
        >
          <times-icon></times-icon>
        </g-button>
      </div>
    </div>
    <div class="create-order__action">
      <div class="agreement_wrapper">
        <span class="t-mr-2" @click="toggleAgreeTermAndCondition">
          <checked-box-icon v-if="agreeTermAndCondition"></checked-box-icon>
          <unchecked-box-icon v-if="!agreeTermAndCondition" />
        </span>
        Tôi đã đọc và đồng ý với
        <a
          class="t-text-primary t-underline t-mx-1"
          href="https://admin.giaohangtietkiem.vn/files/templates/Bieuphi_Giaohangtietkiem.pdf"
          target="_blank"
        >
          Điều khoản & Quy định
        </a>
        của GHTK
      </div>
      <div>
        <g-button
          class="t-mt-5"
          size="large"
          style="width: 203px; font-size: 18px; height: 45px"
          type="outlined"
          @on-click="onClickAddNewOrder"
        >
          <a-space>
            <plus-icon></plus-icon>
            Thêm ĐH mới
          </a-space>
        </g-button>
      </div>
      <div class="save-form__wrapper t-mt-3">
        <g-button
          :disabled="isFetchingSubmitSaveDraftOrder"
          size="large"
          style="width: 273px; font-size: 20px; height: 45px"
          class="t-mr-2"
          type="outlined"
          @on-click="onSubmitSaveDraftOrder"
        >
          <a-space :size="16">
            <loading-icon
              :height="21"
              :width="21"
              v-if="isFetchingSubmitSaveDraftOrder"
            ></loading-icon>
            <save-icon v-else></save-icon>
            Lưu nháp
          </a-space>
        </g-button>
        <g-button
          size="large"
          type="primary"
          style="font-size: 20px; width: 395px; height: 45px"
          @on-click="onClickSubmitOrder"
        >
          <a-space :size="16">
            <upload-icon></upload-icon>
            Đăng đơn hàng
          </a-space>
        </g-button>
      </div>
    </div>
    <a-modal
      :visible="isShowConfirmSubmitOrderModal"
      :footer="null"
      :closable="false"
      :width="500"
      class="confirmSubmitOrderModal"
      @cancel="closeModal()"
    >
      <template v-slot:title>
        <div class="t-flex t-flex-row t-items-center t-w-full">
          <h3
            class="t-text-center t-text-white t-mb-0 t-flex-1"
            :style="!isShowResultSubmitOrder ? 'margin-left: 50px' : ''"
          >
            {{
              isShowResultSubmitOrder
                ? "Thông báo"
                : "Xác nhận đẩy đơn hàng sang GHTK"
            }}
          </h3>
          <span
            v-if="!isShowResultSubmitOrder"
            class="t-flex t-items-center t-justify-center t-text-white"
            style="flex: 0 1 50px; width: 50px; cursor: pointer"
            @click="onCancelSubmitOrder"
          >
            <times-icon :width="16" :height="16"></times-icon>
          </span>
        </div>
      </template>
      <div class="t-flex t-flex-col modal-content">
        <div
          v-if="isShowResultSubmitOrder"
          class="t-flex t-flex-col t-items-center t-justify-center"
          style="font-size: 16px"
        >
          <img
            class="t-w-[66.67px] t-h-[66.67px]"
            :src="listFailedOrder.length === 0 ? checkIcon : closeIcon"
          />
          <span class="t-mt-2">
            {{ listSucceedOrder.length }} ĐH đăng thành công, xem chi tiết tại
            màn
            <span class="t-text-primary t-underline decoration-1">Đã tạo</span>
          </span>
          <span class="t-mt-2" v-if="listFailedOrder.length > 0">
            {{ listFailedOrder.length }} ĐH gặp lỗi trong quá trình đăng đơn
            {{ showErrorsDetail ? ":" : "," }}
            <span
              v-if="!showErrorsDetail"
              class="t-text-primary t-underline decoration-1"
              @click="showErrorsDetail = true"
              >xem chi tiết lỗi</span
            >
          </span>
          <span
            class="create-order__message t-my-2 t-mx-[30px] t-max-w-[365px] t-text-[14px]"
            v-if="listFailedOrder.length > 0 && showErrorsDetail"
          >
            <span
              v-for="(errorOrder, errorOrderIndex) in listOrder"
              :key="errorOrderIndex"
            >
              <div class="" v-if="errorOrder.errorMessage">
                <span class="t-text-warning t-font-medium"
                  >ĐH {{ errorOrderIndex + 1 }}:
                </span>
                {{ errorOrder.errorMessage
                }}<span
                  v-if="errorOrderIndex == listFailedOrder.length - 1"
                  class="t-text-primary"
                  @click="showErrorsDetail = false"
                >
                  Ẩn bớt</span
                >
              </div>
            </span>
          </span>
        </div>
        <div class="product__extra" v-else>
          <b>Vui lòng xác nhận lại dữ liệu đăng đơn sau đây:</b>
          <div class="t-flex t-flex-col t-items-start t-mt-5">
            <div class="t-pb-2">
              <b>Tổng SL:</b>
              <span class="t-mx-2 t-text-primary">
                {{ listOrder.length }} đơn hàng
              </span>
            </div>
            <div class="t-pb-2">
              <b>Tổng KL:</b>
              <span class="t-mx-2 t-text-primary">
                {{ $filters.numberFormatter(allTotalWeight) }} kg
              </span>
            </div>
            <div class="t-pb-2">
              <b>Tổng tiền CoD:</b>
              <span class="t-mx-2 t-text-primary">
                {{ $filters.numberFormatter(allTotalCod) }} đ
              </span>
            </div>
            <div class="t-pb-2">
              <b>Tổng giá trị hàng:</b>
              <span class="t-mx-2 t-text-primary">
                {{ $filters.numberFormatter(allTotalValue) }} đ
              </span>
            </div>
            <span class="t-text-warning">
              Kiểm tra lại thông tin đơn hàng nếu có sai số
            </span>
          </div>
        </div>
        <div class="modal-action">
          <div
            v-if="isShowResultSubmitOrder"
            class="t-w-full t-flex t-justify-center"
          >
            <g-button
              type="primary"
              @on-click="onViewDetailOrder"
              class="t-mr-2 text-[16px] t-w-[135px]"
            >
              Xem chi tiết ĐH
            </g-button>
            <g-button
              type="none"
              @on-click="onCancelSubmitOrder"
              class="t-mr-2 text-[16px] t-w-[135px] t-text-white t-bg-[#C4C4C4]"
            >
              Đóng
            </g-button>
          </div>
          <div v-else class="t-w-full t-flex t-justify-center">
            <g-button
              :disabled="isFetchingSubmitOrder"
              type="primary"
              @on-click="onSubmitOrder"
              style="width: 150px"
              class="t-mr-2"
            >
              <a-space :size="8">
                <loading-icon
                  :height="21"
                  :width="21"
                  v-if="isFetchingSubmitOrder"
                ></loading-icon>
                Ok, đăng đơn
              </a-space>
            </g-button>
            <g-button
              type="outlined-danger"
              @on-click="onCancelSubmitOrder"
              style="width: 75px"
            >
              Hủy
            </g-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import {
  BigTypeIcon,
  CheckedBoxIcon,
  GButton,
  GInput,
  GRadio,
  GSelect,
  MarkerIcon,
  PlaneIcon,
  PlusIcon,
  RightForwardIcon,
  SaveIcon,
  SelectLocationIcon,
  SmallTypeIcon,
  TimesIcon,
  TruckIcon,
  UnSelectLocationIcon,
  UploadIcon,
} from "@/components";
import checkIcon from "@/assets/icons/checkCircleFilled.svg";
import closeIcon from "@/assets/icons/closeCircleFilled.svg";
import { DEFAULT_BBS_MIN_WEIGHT } from "@/contants/order";
import { mapState } from "vuex";
import { nanoid } from "nanoid";
import {
  debounce,
  filter,
  find,
  findIndex,
  forEach,
  get,
  isNaN,
  isNull,
  map,
  round,
  size,
} from "lodash";
import common from "@/utils/common";
import services from "@/services";
import models from "@/models";
import LoadingIcon from "@/components/icons/LoadingIcon";
import { message } from "ant-design-vue";
import UncheckedBoxIcon from "@/components/icons/UncheckedBoxIcon";
import CustomerInfo from "@/pages/create-order/CustomerInfo";
import ProductList from "@/pages/create-order/ProductList";
import OrderTag from "@/components/OrderTag";
import ImageWithDefault from "@/components/elements/image-with-default.vue";
import { MAX_SIZE_CONFIG } from "@/contants/order";
import pickTimeMixin from "@/plugins/mixins/pickTime";
import moment from "moment";
import { XFAST_ENABLE } from "@/contants";

import defaultPostOffice from "@/assets/images/default_post_office.png";
export default {
  components: {
    OrderTag,
    ProductList,
    CustomerInfo,
    UncheckedBoxIcon,
    LoadingIcon,
    GSelect,
    GButton,
    BigTypeIcon,
    SmallTypeIcon,
    GRadio,
    MarkerIcon,
    GInput,
    SaveIcon,
    UploadIcon,
    PlusIcon,
    TruckIcon,
    TimesIcon,
    RightForwardIcon,
    CheckedBoxIcon,
    SelectLocationIcon,
    UnSelectLocationIcon,
    PlaneIcon,
    ImageWithDefault,
  },
  mixins: [pickTimeMixin],
  data() {
    return {
      xfastValid: XFAST_ENABLE,
      bbsMinWeight: DEFAULT_BBS_MIN_WEIGHT,
      showErrorsDetail: false,
      checkIcon,
      closeIcon,
      selectedOrder: {},
      listSucceedOrder: [],
      listFailedOrder: [],
      listOrder: [
        {
          errorMessage: "",
          orderId: nanoid(),
          productTerm: "",
          pickSize: {
            height: {},
            width: {},
            length: {},
          },
          bbsProductIndex: null,
          bbsPickSize: {
            height: {},
            width: {},
            length: {},
          },
          bbsRealWeight: {
            label: 0.1,
            value: 0.1,
          },
          selectedShipFeeType: {
            label: "Shop trả ship",
            value: "1",
          },
          selectedAddressPicker: {
            selectedProvince: {},
            selectedDistrict: {},
            selectedWard: {},
            selectedHamlet: {},
          },
          selectedPickAddressCod: {},
          selectedPickAddressPost: {},
          loading: false,
          isUrbanAddress: false,
          selectedXFastTime: {},
          shipping_option: "",
          xfastInterval: null,
          listSelectedProduct: [],
          nearOffices: [],
          listPickTimeDataSource: [],
          listXFastTimeDataSource: [],
          deliverTimeDataSource: [],
          imageFile: null,
          image: null,
          imageData: null,
          value_order_images: [],
          value_order_images_file: [],
          name: "",
          selectedCustomer: {},
          selectedCustomerAddress: {},
          selectedNote: [],
          selectedTags: [],
          packageLabels: [],
          tel: "",
          customer_fullname: "",
          customer_address: "",
          type: "express",
          pick_option: "cod",
          transport: "road",
          total_amount: 0,
          total_weight: 0.1,
          total_weight_ex: 0.1,
          total_weight_on_charge: 0.1,
          pick_work_shift: null,
          pick_date: null,

          not_delivered_fee: 0,
          not_delivered_option: 0,
          tags: [],

          size: {
            height: {},
            width: {},
            length: {},
          },
          pick_money: "",
          value: "",
          note: "",
          shopCustomNote: "",
          tagNote: "",
          client_id: "",
          // ui only
          insurance_fee: 0,
          ship_fee: 0,
          first_ship_fee: 0,
          ship_fee_ex: 0,
          ship_total_value: 0,
          ext_fees: [],
          bbs_fee: 0,
          isShowXfastDescription: false,
          isShowPickSizeModal: false,
          isShowBbsFee: false,
          isCalculatingFee: false,
          isApplyNoteAll: false,
          validate: {
            customer_tel: {
              innerError: "",
              outerError: "",
            },
            customer_fullname: {
              innerError: "",
              outerError: "",
            },
            customer_address: {
              innerError: "",
              outerError: "",
            },
            value: {
              innerError: "",
              outerError: "",
            },
            pick_money: {
              innerError: "",
              outerError: "",
            },
            total_weight: {
              innerError: "",
              outerError: "",
            },
            total_size_text: {
              innerError: "",
            },
            selectedAddressPicker: {
              selectedHamletError: "",
              selectedWardError: "",
              selectedDistrictError: "",
              selectedProvinceError: "",
            },
          },
          isCustomerValid: false,
          isProductListValid: false,
          availableTransportMethod: ["fly", "road"],
        },
      ],
      listExistedProduct: [],
      packageLabels: [],
      // Loading
      isFetchingSubmitOrder: false,
      isShowResultSubmitOrder: false,
      isFetchingSubmitSaveDraftOrder: false,
      isShowConfirmSubmitOrderModal: false,
      // Confirm
      allTotalWeight: 0,
      allTotalCod: 0,
      allTotalValue: 0,
      // Debounce
      debounceCalculateOrderValue: null,
      debounceCalculateShipFee: null,
      debounceFormatTotalWeight: null,

      agreeTermAndCondition: true,

      maxSize: MAX_SIZE_CONFIG,
      dataTracking: {},
      defaultPostOffice,
    };
  },
  computed: {
    ...mapState({
      sizeDataSource: (state) => state.global.sizeDataSource,
      shipFeeTypeDataSource: (state) => state.global.shipFeeTypeDataSource,
      provinces: (state) => state.global.provinces,
      allowPosition: (state) => state.global.allowPosition,
      // packageNotes: (state) => state.global.packageNotes,
      Shop: (state) => state.shop.Shop,
      pickAddresses: (state) => state.shop.ListPickAddress,
      shopType: (state) => get({ ...state.shop.Shop }, "shop_type", "0"),
      notDeliverOptionTag() {
        return this.$store.getters["shop/notDeliverOptionTag"];
      },
      shopConfigTags: (state) => state.shop.shopConfigTags,
      shopPolicyInfo: (state) => state.shop.policyShopInfo,
    }),

    packageNotes() {
      return [
        {
          label: "Có vấn đề gọi shop, không tự ý hủy đơn",
          value: "Có vấn đề gọi shop, không tự ý hủy đơn",
        },
        {
          label: "Gọi khách trước khi giao",
          value: "Gọi khách trước khi giao",
        },
      ];
    },

    tagList() {
      return this.$store.state.constant.tagListExcel.filter(
        // lọc ra các tag đang được hỗ trợ cho màn đăng đơn hiện tại
        (tag) => tag.key !== 12
      );
    },
    notDeliverOptions() {
      return this.$store.state.constant.not_delivered_options;
    },
  },
  watch: {
    Shop(value) {
      if (value) {
        this.setPickAddressCod();
      }
    },
  },
  async mounted() {
    if (this.Shop) {
      this.setPickAddressCod();
    }
    if (!this.notDeliverOptionTag) {
      await this.$store.dispatch("shop/getShopConfig");
    }
    this.listOrder.forEach((order) => {
      order.tags = [
        ...order.tags,
        this.notDeliverOptionTag,
        ...this.shopConfigTags,
      ];
      order.not_delivered_option = this.notDeliverOptionTag;
      order.not_delivered_fee = this.$store.state.shop.deliveredFee || 0;
      if (this.shopPolicyInfo) {
        order.selectedShipFeeType = {
          label:
            this.shopPolicyInfo?.fee?.is_freeship === 1
              ? "Shop trả ship"
              : "Khách trả ship",
          value: this.shopPolicyInfo?.fee?.is_freeship === 1 ? "1" : "0",
        };
      }
    });
  },
  async created() {
    this.debounceCalculateShipFee = debounce(this.calculateShipFee, 300);
    this.debounceCalculateOrderValue = debounce(this.calculateOrderValue, 300);
    this.debounceFormatTotalWeight = debounce(this.formatTotalWeight, 300);
    // await this.getPackageLabel();
  },
  methods: {
    // ....................XFAST..........................
    async browseXFastTime(order) {
      const customer_address = order?.selectedAddressPicker;
      const pick_address = order?.selectedPickAddressCod?.payload;
      if (this.isValidAddress(order)) {
        let data = {
          customer_province_id: customer_address.selectedProvince?.value,
          customer_district_id: customer_address.selectedDistrict?.value,
          customer_ward_id: customer_address.selectedWard?.value,
          customer_hamlet_id: customer_address.selectedHamlet?.value,
          pick_province_id: pick_address.province_id,
          pick_district_id: pick_address.district_id,
          pick_hamlet_id: pick_address.hamlet_id,
          pick_ward_id: pick_address.ward_id,
          pick_street_id: pick_address.street_id,
          pick_first_address: pick_address.first_address,
          customer_first_address: order?.selectedCustomerAddress.label,
          date_to_delay_pick:
            order?.selectedXFastTime?.date_to_delay_pick || null,
          date_to_delay_deliver:
            order?.selectedXFastTime?.date_to_delay_deliver || null,
        };
        try {
          const response = await services.$thunder.browseXFastBooking(data);

          if (response.success) {
            if (order.shipping_option == "xfast") {
              order.booking_id = response?.data?.booking_id;
              // Handle xfast times
              if (!order.selectedXFastTime?.value) {
                order.listXFastTimeDataSource = [];
                for (const cod of response?.data?.xteam) {
                  const pick_time =
                    moment(cod.date_to_delay_pick).format("HH[h]mm") || "";
                  for (let deliver_date of cod.date_to_delay_deliver) {
                    const deliver_time =
                      moment(deliver_date).format("HH[h]mm") || "";
                    order.listXFastTimeDataSource.push({
                      label: `Lấy & Giao ${pick_time}-${deliver_time}`,
                      date_to_delay_pick: cod.date_to_delay_pick,
                      date_to_delay_deliver: deliver_date,
                      payload: cod,
                      value: nanoid(),
                    });
                  }
                }
                if (order.listXFastTimeDataSource.length > 0) {
                  order.selectedXFastTime = order.listXFastTimeDataSource[0];
                  // Get booking_id
                  await this.browseXFastTime(order);
                }
              }
            }
          } else {
            message.error(response.message);
            this.resetUrbanAddressOptions(order);
            order.shipping_option = "default_urban_shipping";
            this.browsePickTime(order);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    isValidAddress(order) {
      const customer_address = order?.selectedAddressPicker;
      const pick_address = order?.selectedPickAddressCod?.payload;
      return (
        customer_address.selectedProvince?.value &&
        customer_address.selectedDistrict?.value &&
        customer_address.selectedWard?.value &&
        customer_address.selectedHamlet?.value &&
        pick_address.province_id &&
        pick_address.district_id &&
        pick_address.hamlet_id &&
        (pick_address.ward_id || pick_address.street_id)
      );
    },
    resetUrbanAddressOptions(order) {
      clearInterval(order.xfastInterval);
      order.pick_date = {};
      order.deliver_date = {};
      order.listDeliverTimeDataSource = [];
      order.listPickTimeDataSource = [];
      order.selectedXFastTime = {};
      order.listXFastTimeDataSource = [];
    },
    async setXfastInterval(order) {
      order.xfastInterval = setInterval(async () => {
        if (order.shipping_option == "xfast") {
          order.loading = true;
          await this.handleUnusedBooking(order);
          order.listXFastTimeDataSource = [];
          order.selectedXFastTime = {};
          await this.browseXFastTime(order);
          order.loading = false;
        }
      }, 300000);
    },
    async onSelectionChangeShippingOption(order, value) {
      this.resetUrbanAddressOptions(order);
      order.loading = true;
      if (value == "xfast") {
        await this.browseXFastTime(order);
        // get xfast times after 5m
        if (order.shipping_option == "xfast") {
          await this.setXfastInterval(order);
          order.isShowXfastDescription = true;
        }
      } else {
        await this.handleUnusedBooking(order);
        await this.browsePickTime(order);
      }
      await this.calculateShipFee(order);
      order.loading = false;
    },
    async onSelectionChangeXfastTime(order) {
      order.loading = true;
      await this.handleUnusedBooking(order);
      await this.browseXFastTime(order);
      order.loading = false;
    },
    async checkUrbanAddressValid(order) {
      const customer_address = order?.selectedAddressPicker;
      const pick_address = order?.selectedPickAddressCod?.payload;
      if (
        this.isValidAddress(order) &&
        order.type == "express" &&
        order.pick_option == "cod"
      ) {
        let params = {
          customer_province_id: customer_address.selectedProvince?.value,
          customer_district_id: customer_address.selectedDistrict?.value,
          customer_ward_id: customer_address.selectedWard?.value,
          customer_hamlet_id: customer_address.selectedHamlet?.value,
          pick_province_id: pick_address.province_id,
          pick_district_id: pick_address.district_id,
          pick_hamlet_id: pick_address.hamlet_id,
          pick_ward_id: pick_address.ward_id,
          pick_street_id: pick_address.street_id,
        };
        try {
          const response = await services.$thunder.browseXFastArea(params);
          if (response.success) {
            order.isUrbanAddress = true;
            order.shipping_option = "default_urban_shipping";
          } else {
            order.isUrbanAddress = false;
          }
        } catch (error) {
          console.error(error);
          order.isUrbanAddress = false;
        }
      } else {
        order.isUrbanAddress = false;
      }
    },
    async deleteXfastBookingIds(data) {
      if (data.length > 0) {
        try {
          await services.$thunder.deleteBookingIds({
            booking_ids: data,
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
    // ..................................................
    onSelectionChangeTransportType(order) {
      this.browsePickTime(order);
      this.calculateShipFee(order);
    },
    isShowFly(order) {
      if (!order.selectedPickAddressCod.payload) return true;
      if (order.availableTransportMethod.includes("fly")) return true;
      if (
        order.type !== "bbs" &&
        order.selectedAddressPicker.selectedProvince.value !=
          order.selectedPickAddressCod.payload.province_id
      ) {
        return true;
      }
      order.transport = "road";
      return false;
    },
    setPickAddressCod(orderId = "") {
      let finded = get(this.pickAddresses, 0, null);
      if (finded) {
        setTimeout(() => {
          if (orderId.length) {
            const orderIndex = this.listOrder.findIndex(
              (x) => x.orderId === orderId
            );
            this.listOrder[orderIndex].selectedPickAddressCod =
              this.listOrder[0].selectedPickAddressCod;
            this.getNearOffice(this.listOrder[orderIndex]);
          } else {
            forEach(this.listOrder, (order) => {
              order.selectedPickAddressCod = finded;
              this.getNearOffice(order);
              this.browsePickTime(order);
            });
          }
        }, 50);
      }
    },
    onApplyNoteAll(order, e) {
      order.isApplyNoteAll = e.target.checked;
      if (order.isApplyNoteAll) {
        forEach(this.listOrder, (o) => {
          o.selectedNote = order.selectedNote;
          o.tags = order.tags;
          o.isApplyNoteAll = true;
          forEach(o.selectedNote, (note) => {
            if (order.orderId !== o.orderId) {
              o.note += `${note.label};`;
            }
          });
        });
      } else {
        forEach(this.listOrder, (o) => {
          o.isApplyNoteAll = false;
        });
      }
    },
    validateBbsWeight(producWeight, provinceId) {
      const bbsMaxWeight =
        this.$store.getters["global/getBbsMaxWeight"](provinceId);
      return producWeight < this.bbsMinWeight || producWeight > bbsMaxWeight
        ? "Khối lượng không thuộc mức hỗ trợ đơn BBS"
        : false;
    },
    onSelectionChangeOrderType(order, value) {
      if (value == "bbs") {
        if (order.transport === "fly") order.transport = "road";
        this.handleChangeShippingOption(order);
      } else {
        this.checkUrbanAddressValid(order);
      }
      this.browsePickTime(order);
      this.validateOrderValue(order);
      this.resetPickWeight(order);
      this.calculateShipFee(order);
    },
    async handleChangeShippingOption(order, getPickTime) {
      if (order.isUrbanAddress) {
        order.isUrbanAddress = false;
        this.resetUrbanAddressOptions(order);
        this.handleUnusedBooking(order);
        if (getPickTime) await this.browsePickTime(order);
      }
    },
    resetPickWeight(order) {
      const defaultSize = {
        height: {},
        width: {},
        length: {},
      };
      const defaultWeightObj = {
        label: "0.1",
        value: 0.1,
      };
      order.size = { ...defaultSize };
      order.bbsPickSize = { ...defaultSize };
      order.pickSize = { ...defaultSize };
      order.bbsRealWeight = defaultWeightObj;
      order.total_weight = 0;
      order.total_weight_ex = 0.1;
      order.total_weight_on_charge = 0.1;
      order.listSelectedProduct.forEach((product) => {
        product.product_size = { ...defaultSize };
        product.product_weight = defaultWeightObj;
        product.product_weight_ex = 0.1;
        product.product_size_text = "";
        product.product_quantity = {
          label: "1",
          value: 1,
        };
        order.total_weight = order.total_weight + 0.1;
      });
      order.total_weight = !order.total_weight ? 0.1 : order.total_weight;
    },
    closeModal() {
      this.listOrder.forEach((order) => {
        if (order.isUrbanAddress && order.shipping_option == "xfast") {
          this.setXfastInterval(order);
        }
      });
      this.isShowConfirmSubmitOrderModal = false;
    },
    onOrderNoteSelectionChange(order) {
      if (order.isApplyNoteAll) {
        forEach(this.listOrder, (o) => {
          o.selectedNote = order.selectedNote;
          o.shopCustomNote = "";
          forEach(o.selectedNote, (note) => {
            o.shopCustomNote += `${note.label};`;
          });
        });
      } else {
        order.shopCustomNote = "";
        forEach(order.selectedNote, (note) => {
          order.shopCustomNote += `${note.label}; `;
        });
        order.note =
          order.shopCustomNote + this.generateMessageFromTagList(order);
      }
    },
    onCancelSubmitOrder() {
      if (this.isFetchingSubmitOrder) return;
      this.listOrder.forEach((order) => {
        if (order.isUrbanAddress && order.shipping_option == "xfast") {
          this.setXfastInterval(order);
        }
      });
      this.isShowConfirmSubmitOrderModal = false;
      this.isShowResultSubmitOrder = false;
    },
    onViewDetailOrder() {
      this.$router.push("/tao-don-hang/don-da-tao");
    },
    onSelectOrderImage(e, order) {
      let files = e.target.files;
      if (size(files) > 0) {
        let reader = new FileReader();
        reader.addEventListener("load", (ev) => {
          order.image = ev.target.result;
        });
        order.imageFile = files[0];
        reader.readAsDataURL(files[0]);
      }
    },
    formatTotalWeight(order) {
      order.total_weight = parseFloat(order.total_weight).toFixed(1);
    },
    onExpressTotalWeightInputChange(order) {
      if (
        !Number.isInteger(parseFloat(order.total_weight)) &&
        order.total_weight
      ) {
        this.debounceFormatTotalWeight(order);
      }
      let isValid = this.validateOrderExpressTotalWeight(order);
      if (isValid) {
        this.debounceCalculateShipFee(order);
      }
    },
    calculateOrderValue(order) {
      let parsed = parseFloat(order.value);
      let shop_type = get({ ...this.Shop }, "shop_type", "1");
      let giaTriCaoTag = order.packageLabels.find(
        (x) => x.label === "Giá trị cao"
      );
      let tieuChuanTag = order.packageLabels.find(
        (x) => x.label === "Tiêu chuẩn"
      );
      if (
        parsed > 3000000 &&
        shop_type == "1" &&
        giaTriCaoTag &&
        tieuChuanTag
      ) {
        // Nếu giá trị hàng lớn hơn 3tr thì tự động chọn tag Giá trị cao
        giaTriCaoTag.isSelected = true;
        // tieuChuanTag.isSelected = false;
      } else if (
        parsed > 0 &&
        parsed < 3000000 &&
        shop_type == "1" &&
        giaTriCaoTag &&
        tieuChuanTag
      ) {
        giaTriCaoTag.isSelected = false;
        let anySelected =
          findIndex(order.packageLabels, (x) => x.isSelected) > -1;
        if (anySelected === false) {
          tieuChuanTag.isSelected = true;
        }
      } else if (
        parsed > 0 &&
        parsed >= 1000000 &&
        shop_type == "0" &&
        giaTriCaoTag &&
        tieuChuanTag
      ) {
        giaTriCaoTag.isSelected = true;
      } else if (
        parsed > 0 &&
        parsed < 1000000 &&
        shop_type == "0" &&
        giaTriCaoTag &&
        tieuChuanTag
      ) {
        giaTriCaoTag.isSelected = false;
      }
    },

    total_size(order) {
      // dài x rộng x cao
      if (
        !order.size.length.value &&
        !order.size.width.value &&
        !order.size.height.value
      ) {
        return "D x R x C";
      }
      order.validate.total_size_text = "";
      const length = common.numberFormatter(order.size.length.value);
      const width = common.numberFormatter(order.size.width.value);
      const height = common.numberFormatter(order.size.height.value);
      return `${length}cm x ${width}cm x ${height}cm`;
    },

    onClickRemoveOrder(orderIndex) {
      if (this.listOrder[orderIndex].isUrbanAddress) {
        clearInterval(this.listOrder[orderIndex].xfastInterval);
        this.handleUnusedBooking(this.listOrder[orderIndex]);
      }
      this.listOrder.splice(orderIndex, 1);
    },
    onClickAddNewOrder() {
      let firstOrder = this.listOrder[0];
      let isApplyNoteAll = false;
      let selectedNote = [];
      let note = "";
      let selectedPickAddressCod = "";
      if (firstOrder) {
        isApplyNoteAll = firstOrder.isApplyNoteAll;
        selectedNote = firstOrder.selectedNote;
        note = firstOrder.note;
        selectedPickAddressCod = firstOrder.selectedPickAddressCod;
      } else {
        selectedPickAddressCod = get(this.pickAddresses, 0, null);
      }
      this.listOrder.push({
        orderId: nanoid(),
        errorMessage: "",
        productTerm: "",
        customerDetail: "",
        availableTransportMethod: ["fly", "road"],
        pickSize: {
          height: {},
          width: {},
          length: {},
        },
        bbsProductIndex: null,
        bbsPickSize: {
          height: {},
          width: {},
          length: {},
        },
        bbsRealWeight: {
          label: 0.1,
          value: 0.1,
        },
        selectedShipFeeType: {
          label: "Shop trả ship",
          value: "1",
        },
        selectedAddressPicker: {
          selectedProvince: {},
          selectedDistrict: {},
          selectedWard: {},
          selectedHamlet: {},
        },
        selectedPickAddressCod: selectedPickAddressCod,
        selectedPickAddressPost: {},
        listSelectedProduct: [],
        nearOffices: [],
        listPickTimeDataSource: [],
        deliverTimeDataSource: [],
        imageFile: null,
        image: null,
        value_order_images: [],
        value_order_images_file: [],
        name: "",
        selectedCustomer: {},
        selectedCustomerAddress: {},
        selectedNote: selectedNote,
        selectedTags: [],
        not_delivered_fee:
          this.shopPolicyInfo?.deliver_package?.not_delivered_fee?.fee || 0,
        not_delivered_option: this.notDeliverOptionTag,
        tags: [this.notDeliverOptionTag, ...this.shopConfigTags],
        packageLabels: [...map(this.packageLabels, (x) => ({ ...x }))],
        tel: "",
        customer_fullname: "",
        customer_address: "",
        type: "express",
        pick_option: "cod",
        transport: "road",
        total_amount: 0,
        total_weight: 0.1,
        total_weight_ex: 0.1,
        total_weight_on_charge: 0.1,
        size: {
          height: {},
          width: {},
          length: {},
        },
        pick_work_shift: null,
        pick_date: null,
        pick_money: "",
        value: "",
        note: note,
        shopCustomNote: "",
        tagNote: "",
        client_id: "",
        // ui only
        insurance_fee: 0,
        ship_fee: 0,
        first_ship_fee: 0,
        ship_fee_ex: 0,
        ship_total_value: 0,
        ext_fees: [],
        bbs_fee: 0,

        isShowPickSizeModal: false,
        isShowBbsFee: false,
        isCalculatingFee: false,
        isApplyNoteAll: isApplyNoteAll,
        validate: {
          value: {
            innerError: "",
            outerError: "",
          },
          pick_money: {
            innerError: "",
            outerError: "",
          },
          total_weight: {
            innerError: "",
            outerError: "",
          },
          total_size_text: {
            innerError: "",
          },
        },
      });
      this.setPickAddressCod(this.listOrder[size(this.listOrder) - 1].orderId);
      this.$nextTick(() => {
        let index = size(this.listOrder) - 1;
        let element = document.getElementById("customer_" + index);
        element.scrollIntoView({
          behavior: "smooth",
        });
      });
      this.browsePickTime(this.listOrder[size(this.listOrder) - 1]);
    },

    productBbsType(order) {
      return order.type === "bbs";
    },
    calculateTotalAmount(order) {
      let parsed = parseFloat(order.pick_money);
      let isFreeShip = get(order, "selectedShipFeeType.value", "1") === "1";
      if (parsed >= 0) {
        order.total_amount = (isFreeShip ? 0 : order.ship_total_value) + parsed;
      } else {
        order.total_amount = isFreeShip ? 0 : order.ship_total_value;
      }
    },
    isShowFreeInsurance(order) {
      let shop_type = get({ ...this.Shop }, "shop_type", "1");
      let parsed = parseFloat(order.value);
      return (
        (parsed >= 0 && parsed <= 1000000) ||
        order.insurance_fee > 0 ||
        (shop_type == "0" && parsed >= 1000000)
      );
    },
    isShowPickSize(order) {
      return order.type === "express" && order.total_weight >= 3;
    },
    isShowSelectLocation(order) {
      if (order.selectedPickAddressCod.value) return true;
      return false;
    },

    onClickOutsidePickSizeModal(order) {
      order.isShowPickSizeModal = false;
    },
    onSelectTag(order, item) {
      let tieuChuanTag = find(
        order.packageLabels,
        (x) => x.label === "Tiêu chuẩn"
      );
      if (item.isSelected) {
        // Đang chọn thì un-tick
        if (item.label === "Dễ vỡ" || item.label === "Giao hàng 1 phần") return;
        item.isSelected = false;
        if (item.label === "Gia cố hàng hóa") {
          order.isShowBbsFee = false;
        }
      } else {
        item.isSelected = true;
        if (item.label !== "Tiêu chuẩn") {
          tieuChuanTag.isSelected = false;
        } else {
          if (item.label === "Gia cố hàng hóa") {
            order.isShowBbsFee = true;
          }
          filter(
            order.packageLabels,
            (x) => x.label !== "Tiêu chuẩn" && x.label !== "Giá trị cao"
          ).forEach((x) => (x.isSelected = false));
        }
      }
      let anySelected =
        findIndex(order.packageLabels, (x) => x.isSelected) > -1;
      if (anySelected === false) {
        tieuChuanTag.isSelected = true;
      }
      order.packageLabels = [...order.packageLabels];
      this.debounceCalculateShipFee(order);
    },

    handleClickTotalSize(e, order) {
      e.stopImmediatePropagation();
      order.isShowPickSizeModal = true;
    },
    transportTypeStyle(order, type) {
      return order.transport === type
        ? { color: "#069255" }
        : { color: "#bdbdbd" };
    },
    validateOrder() {
      let isValidOrder = true;
      forEach(this.listOrder, (order) => {
        let isValidOrderValue = this.validateOrderValue(order);
        let isValidOrderPickMoney = this.validateOrderPickMoney(order);
        let isValidTotalWeight =
          order.type === "express"
            ? this.validateOrderExpressTotalWeight(order)
            : this.validateOrderTotalWeight(order);
        if (
          isValidOrderValue === false ||
          isValidOrderPickMoney === false ||
          order.isProductListValid === false ||
          isValidTotalWeight === false ||
          order.isCustomerValid === false
        ) {
          isValidOrder = false;
        }
      });
      return isValidOrder;
    },
    onClickSubmitOrder() {
      if (!this.validateOrder()) {
        message.error("Thông tin đơn hàng không hợp lệ. Vui lòng nhập lại.");
        return;
      }
      if (!this.agreeTermAndCondition) {
        message.error("Vui lòng đồng ý với điều khoản & quy định của GHTK!");
        return;
      }
      let totalWeight = 0;
      let totalValue = 0;
      let totalCod = 0;
      forEach(this.listOrder, (order) => {
        if (order.isUrbanAddress && order.shipping_option == "xfast") {
          clearInterval(order.xfastInterval);
        }
        let orderPickMoneyNumber = parseFloat(order.pick_money);
        let orderValueNumber = parseFloat(order.value);
        let totalWeightNumber = parseFloat(
          order.total_weight > order.total_weight_ex
            ? order.total_weight
            : order.total_weight_ex
        );
        totalWeight += totalWeightNumber;
        totalValue += orderValueNumber;
        totalCod += orderPickMoneyNumber;
      });
      this.allTotalCod = totalCod || 0;
      this.allTotalValue = totalValue || 0;
      this.allTotalWeight = round(totalWeight || 0, 1);
      this.isShowConfirmSubmitOrderModal = true;
    },
    async onUploadOrderImage() {
      forEach(this.listSucceedOrder, async (order) => {
        if (order.imageFile) {
          let data = new FormData();
          data.append("content", "packageImage");
          data.append("object", "package");
          data.append("files[]", order.imageFile);
          data.append("object_ids[]", order.package_id);
          let result = await services.$package.uploadImage(data);
          if (result && result.success) {
            console.log("uploaded", result);
          }
        }
        if (order.value_order_images.length) {
          let valueImageData = new FormData();
          order.value_order_images.forEach((image) => {
            valueImageData.append("files[]", image);
          });
          valueImageData.append("content", "pkg_high_value");
          valueImageData.append("object", "package");
          valueImageData.append("object_ids[]", order.package_id);
          await services.$package.uploadImage(valueImageData);
        }
      });
    },
    async onSubmitOrder() {
      this.isFetchingSubmitOrder = true;
      let listCreatePackagePromises = [];
      this.listSucceedOrder = [];
      this.listFailedOrder = [];
      forEach(this.listOrder, (order) => {
        // Thông tin điểm giao hàng
        order.errorMessage = "";
        let name = get(order, "customer_fullname", "");
        let tel = get(order, "tel", "");
        let address = get(order, "selectedCustomerAddress.label", "");
        let selectedAddressPicker = order.selectedAddressPicker;
        let province = get(selectedAddressPicker, "selectedProvince.label", "");
        let district = get(selectedAddressPicker, "selectedDistrict.label", "");
        let ward = get(selectedAddressPicker, "selectedWard.label", "");
        let hamlet = get(selectedAddressPicker, "selectedHamlet.label", "");

        let orderValueNumber = parseFloat(order.value);
        // Thông tin điểm lấy hàng
        let payload = {
          order: {
            client_id: order.client_id,
            type: order.type,
            // Thông tin điểm lấy hàng
            pick_name: "",
            pick_money: order.pick_money,
            pick_address: "",
            pick_province: "",
            pick_district: "",
            pick_ward: "",
            pick_hamlet: "",
            pick_street: "",
            pick_tel: "",
            pick_email: "",
            pick_po_id: "",
            // Thông tin điểm giao hàng
            name: name,
            address: address,
            province: province,
            district: district,
            ward: ward,
            street: ward,
            hamlet: hamlet,
            tel: tel,
            email: "",
            // Thông tin điểm trả hàng
            return_name: "",
            return_address: "",
            return_province: "",
            return_district: "",
            return_ward: "",
            return_street: "",
            return_hamlet: "",
            return_tel: "",
            return_email: "",
            // Thông tin thêm
            is_freeship: order.selectedShipFeeType.value,
            total_weight:
              order.total_weight > order.total_weight_ex
                ? order.total_weight
                : order.total_weight_ex,
            length:
              order.type === "bbs"
                ? order.bbsPickSize.length.value
                : order.pickSize.length.value,
            width:
              order.type === "bbs"
                ? order.bbsPickSize.width.value
                : order.pickSize.width.value,
            height:
              order.type === "bbs"
                ? order.bbsPickSize.height.value
                : order.pickSize.height.value,
            // Quan trọng: Kiểm tra cẩn thận
            value: orderValueNumber,
            transport: order.transport,
            note: order.note,
            tags: order.tags,
            not_delivered_fee: order.not_delivered_fee,
            not_delivered_option: order.not_delivered_option,
            //Truyền lên key is_delayed_time để tránh việc bị tính delay ca lấy 2 lần
            is_delayed_time: 0,
          },
        };
        if (order.isUrbanAddress && order.shipping_option == "xfast") {
          payload.order.pick_option = "cod";
          payload.order.deliver_option = "xteam";
          payload.order.booking_id = order?.booking_id || 0;
        } else {
          payload.order.pick_option = order.pick_option;
          payload.order.pick_time = order.pick_date ? order.pick_date.type : "";
          payload.order.pick_time_slot =
            order.type === "bbs"
              ? order.pick_date.pick_time_slot
              : order.pick_date.value;
          if (order.pick_work_shift) {
            payload.order.pick_work_shift = order.pick_work_shift;
            payload.order.pick_date = order.pick_date?.payload?.date;
          }
          payload.order.deliver_work_shift =
            order?.deliver_date?.payload?.work_shift;
          payload.order.deliver_time_slot =
            order?.deliver_date?.deliver_time_slot || "";
          order.deliver_date.payload.type
            ? (payload.order.deliver_time = order?.deliver_date?.payload.type)
            : (payload.order.deliver_date = order?.deliver_date?.payload.date);
        }

        let pickAddress = order.selectedPickAddressCod;
        let pick_name = get(pickAddress, "payload.fullname", "");
        let pick_address = get(pickAddress, "payload.first_address", "");
        let pick_province = get(pickAddress, "payload.province", "");
        let pick_district = get(pickAddress, "payload.district", "");
        let pick_ward = get(pickAddress, "payload.ward", "");
        let pick_hamlet = get(pickAddress, "payload.hamlet", "");
        let pick_street = get(pickAddress, "payload.street", "");
        let pick_tel = get(pickAddress, "payload.tel", "");
        let pick_email = get(pickAddress, "payload.email", "");
        payload.order.pick_name = pick_name;
        payload.order.pick_address = pick_address;
        payload.order.pick_address_id = get(pickAddress, "payload.id", "");
        payload.order.pick_province = pick_province;
        payload.order.pick_district = pick_district;
        payload.order.pick_ward = pick_ward;
        payload.order.pick_hamlet = pick_hamlet;
        payload.order.pick_street = pick_street;
        payload.order.pick_tel = pick_tel;
        payload.order.pick_email = pick_email;
        if (order.pick_option === "post") {
          let selectedPostOffice = { ...order.selectedPickAddressPost };
          payload.order.pick_po_id = get(selectedPostOffice, "payload.id", "");
        }
        payload.products = map(order.listSelectedProduct, (product) => {
          let numberWeight = parseFloat(product.product_weight.value);
          let numberQuantity = parseFloat(product.product_quantity.value);
          let product_code = get(product, "selectedProduct.payload.code", "");
          let weight =
            numberWeight > product.product_weight_ex
              ? numberWeight
              : product.product_weight_ex;
          if (order.type === "bbs") {
            return {
              name: product.selectedProduct.label,
              weight: weight,
              quantity: numberQuantity,
              product_code: product_code,
              height: parseFloat(product.product_size.height.value) || 0,
              width: parseFloat(product.product_size.width.value) || 0,
              length: parseFloat(product.product_size.length.value) || 0,
            };
          }
          return {
            name: product.selectedProduct.label,
            weight: weight,
            quantity: numberQuantity,
            product_code: product_code,
          };
        });
        // Call api
        let createPromise = services.$package.createPackage(payload);
        listCreatePackagePromises.push(createPromise);
      });
      if (size(listCreatePackagePromises) > 0) {
        Promise.allSettled(listCreatePackagePromises).then((results) => {
          let listOrder = [...this.listOrder];
          this.listOrder = [];
          let listUnusedBookingIds = [];
          let dataTracking = { ...this.dataTracking };
          this.dataTracking = {};

          forEach(results, (res, resIndex) => {
            let isSucceed = get(res, "value.success", false);
            let message = get(res, "value.message", "");
            if (isSucceed) {
              let payload = {
                ...get(res, "value.order", {}),
                imageFile: listOrder[resIndex].imageFile,
                value_order_images: listOrder[resIndex].value_order_images,
              };
              this.listSucceedOrder.push(payload);
            } else {
              const failedOrder = listOrder[resIndex];
              if (
                failedOrder.isUrbanAddress &&
                failedOrder.shipping_option == "xfast"
              ) {
                this.resetUrbanAddressOptions(failedOrder);
                failedOrder.shipping_option = "default_urban_shipping";
                if (failedOrder.booking_id) {
                  listUnusedBookingIds.push(failedOrder.booking_id);
                  delete failedOrder.booking_id;
                }
                this.browsePickTime(failedOrder);
              }
              failedOrder.errorMessage = message;
              this.listOrder.push(failedOrder);
              this.listFailedOrder.push(get(res, "value"));
            }

            const orderId = listOrder[resIndex].orderId;
            const records = dataTracking[orderId] || [];

            dataTracking[orderId] = records.map((item, index) => ({
              ...item,
              status: index === records.length - 1 ? 1 : 0,
              pkg_order:
                index === records.length - 1
                  ? get(res, "value.order.pkg_order", "")
                  : "",
            }));
          });
          this.deleteXfastBookingIds(listUnusedBookingIds);

          this.handleSubmitTracking(dataTracking);

          if (size(this.listSucceedOrder) > 0) {
            this.onUploadOrderImage();
          }
          if (size(this.listOrder) === 0) {
            this.listOrder.push({
              orderId: nanoid(),
              errorMessage: "",
              productTerm: "",
              pickSize: {
                height: {},
                width: {},
                length: {},
              },
              bbsProductIndex: null,
              bbsPickSize: {
                height: {},
                width: {},
                length: {},
              },
              bbsRealWeight: {
                label: 0.1,
                value: 0.1,
              },
              selectedShipFeeType: {
                label: "Shop trả ship",
                value: "1",
              },
              selectedAddressPicker: {
                selectedProvince: {},
                selectedDistrict: {},
                selectedWard: {},
                selectedHamlet: {},
              },
              selectedPickAddressCod: {},
              selectedPickAddressPost: {},
              listSelectedProduct: [],
              availableTransportMethod: ["road", "fly"],
              nearOffices: [],
              listPickTimeDataSource: [],
              deliverTimeDataSource: [],
              imageFile: null,
              image: null,
              value_order_images: [],
              value_order_images_file: [],
              name: "",
              selectedCustomer: {},
              selectedCustomerAddress: {},
              selectedNote: [],
              selectedTags: [],
              packageLabels: [...map(this.packageLabels, (x) => ({ ...x }))],
              tel: "",
              customer_fullname: "",
              customer_address: "",
              type: "express",
              pick_option: "cod",
              transport: "road",
              total_amount: 0,
              total_weight: 0.1,
              total_weight_ex: 0.1,
              total_weight_on_charge: 0.1,

              not_delivered_fee:
                this.shopPolicyInfo?.deliver_package?.not_delivered_fee?.fee ||
                0,
              not_delivered_option: this.notDeliverOptionTag,
              tags: [this.notDeliverOptionTag, ...this.shopConfigTags],

              size: {
                height: {},
                width: {},
                length: {},
              },
              pick_money: "",
              value: "",
              note: "",
              shopCustomNote: "",
              tagNote: "",
              client_id: "",
              // ui only
              insurance_fee: 0,
              ship_fee: 0,
              first_ship_fee: 0,
              ship_fee_ex: 0,
              ship_total_value: 0,
              ext_fees: [],
              bbs_fee: 0,
              pick_work_shift: null,
              pick_date: null,

              isShowPickSizeModal: false,
              isShowBbsFee: false,
              isCalculatingFee: false,
              isApplyNoteAll: false,
              validate: {
                value: {
                  innerError: "",
                  outerError: "",
                },
                pick_money: {
                  innerError: "",
                  outerError: "",
                },
                total_weight: {
                  innerError: "",
                  outerError: "",
                },
                total_size_text: {
                  innerError: "",
                },
              },
            });
            this.setPickAddressCod();
          }
          this.isShowResultSubmitOrder = true;
          this.isFetchingSubmitOrder = false;
        });
      }
    },
    async onSubmitSaveDraftOrder() {
      if (!this.validateOrder()) {
        message.error("Thông tin đơn hàng không hợp lệ. Vui lòng nhập lại.");
        return;
      }
      let listPackage = [];
      forEach(this.listOrder, (order) => {
        if (order.isUrbanAddress && order.shipping_option == "xfast") {
          message.error(
            "Vui lòng chọn lại hình thức Lấy & giao  để lưu đơn nháp!"
          );
          return;
        }
        if (order.pick_option === "post") {
          message.error(
            "Vui lòng chọn lại hình thức lấy hàng tận nơi để lưu đơn nháp!"
          );
          return;
        }
        // Thông tin điểm giao hàng
        let name = get(order, "customer_fullname", "");
        let tel = get(order, "tel", "");
        let address = get(order, "selectedCustomerAddress.label", "");
        let selectedAddressPicker = order.selectedAddressPicker;
        let province = get(selectedAddressPicker, "selectedProvince.label", "");
        let province_id = get(
          selectedAddressPicker,
          "selectedProvince.value",
          ""
        );
        let district = get(selectedAddressPicker, "selectedDistrict.label", "");
        let district_id = get(
          selectedAddressPicker,
          "selectedDistrict.value",
          ""
        );
        let ward = get(selectedAddressPicker, "selectedWard.label", "");
        let ward_id = get(selectedAddressPicker, "selectedWard.value", "");
        let hamlet = get(selectedAddressPicker, "selectedHamlet.label", "");
        let hamlet_id = get(selectedAddressPicker, "selectedHamlet.value", "");

        let orderValueNumber = parseFloat(order.value);
        let totalWeight =
          order.type === "express" && order.total_weight_ex > order.total_weight
            ? order.total_weight_ex
            : order.total_weight;

        let pick_po_id = "";
        if (order.pick_option === "post") {
          let selectedPostOffice = { ...order.selectedPickAddressPost };
          pick_po_id = get(selectedPostOffice, "payload.id", "");
        }
        // Thông tin điểm lấy hàng
        let payload = {
          type: order.type,
          // Thông tin điểm lấy hàng
          pick_name: "",
          pick_money: order.pick_money,
          pick_address: "",
          pick_province: "",
          pick_province_id: "",
          pick_district: "",
          pick_ward: "",
          pick_hamlet: "",
          pick_street: "",
          pick_tel: "",
          pick_email: "",
          pick_po_id: pick_po_id,
          // Thông tin điểm giao hàng
          customer_fullname: name,
          customer_province_id: province_id,
          customer_province: province,
          customer_district: district,
          customer_district_id: district_id,
          customer_ward: ward,
          customer_ward_id: ward_id,
          customer_first_address: address,
          customer_specific: hamlet,
          customer_specific_id: hamlet_id,
          customer_tel: tel,
          email: "",
          // Thông tin điểm trả hàng
          return_name: "",
          return_address: "",
          return_province: "",
          return_district: "",
          return_ward: "",
          return_street: "",
          return_hamlet: "",
          return_tel: "",
          return_email: "",
          // Thông tin thêm
          is_freeship: order.selectedShipFeeType.value,
          total_weight: totalWeight,
          // Quan trọng: Kiểm tra cẩn thận
          value: orderValueNumber,
          pick_option: order.pick_option,
          pick_time: order.pick_date?.payload?.type
            ? order.pick_date?.payload?.type
            : "sang_mai",
          pick_date: order?.pick_date?.payload?.date,
          pick_work_shift: order?.pick_work_shift,
          pick_time_slot:
            order.type === "bbs"
              ? order.pick_date.pick_time_slot
              : order.pick_date.value,
          deliver_time: order.deliver_date ? order.deliver_date.type : "",
          transport: order.transport,
          hub_type: order.pick_option === "post" ? "buu-cuc" : "kho",
          post_office: order.pick_option === "post" ? pick_po_id : "",
          is_bigsize: order.type === "bbs" ? 1 : 0,
          length:
            order.type === "bbs"
              ? order.bbsPickSize.length.value
              : order.pickSize.length.value,
          width:
            order.type === "bbs"
              ? order.bbsPickSize.width.value
              : order.pickSize.width.value,
          height:
            order.type === "bbs"
              ? order.bbsPickSize.height.value
              : order.pickSize.height.value,
          note: order.note,
          tags: order.tags,
          Order: [],
          source: 30,
          deliver_work_shift: order?.deliver_date?.payload?.work_shift,
          deliver_time_slot: order?.deliver_date?.deliver_time_slot || "",
        };
        order?.deliver_date?.payload.type
          ? (payload.deliver_time = order?.deliver_date?.payload.type)
          : (payload.deliver_date = order?.deliver_date?.payload.date);

        let pickAddress = order.selectedPickAddressCod;
        let pick_name = get(pickAddress, "payload.fullname", "");
        let pick_address = get(pickAddress, "payload.first_address", "");
        let pick_province = get(pickAddress, "payload.province", "");
        let pick_district = get(pickAddress, "payload.district", "");
        let pick_ward = get(pickAddress, "payload.ward", "");
        let pick_hamlet = get(pickAddress, "payload.hamlet", "");
        let pick_street = get(pickAddress, "payload.street", "");
        let pick_tel = get(pickAddress, "payload.tel", "");
        let pick_email = get(pickAddress, "payload.email", "");
        payload.pick_name = pick_name;
        payload.pick_address_name = pickAddress.label;
        payload.pick_address = pick_address;
        payload.pick_address_id = get(pickAddress, "payload.id", "");
        payload.pick_province = pick_province;
        payload.pick_province_id = get(pickAddress, "payload.province_id", "");
        payload.pick_district = pick_district;
        payload.pick_ward = pick_ward;
        payload.pick_hamlet = pick_hamlet;
        payload.pick_street = pick_street;
        payload.pick_tel = pick_tel;
        payload.pick_email = pick_email;
        if (order.pick_option === "post") {
          payload.pick_po_id = get(
            order.selectedPickAddressPost,
            "payload.id",
            ""
          );
          payload.pick_address = "";
        }
        payload.Order = map(order.listSelectedProduct, (product) => {
          let numberRetailPrices = parseFloat(product.retail_prices);
          let numberWeight = parseFloat(product.product_weight.value);
          let numberQuantity = parseFloat(product.product_quantity.value);
          let weight =
            numberWeight > product.product_weight_ex
              ? numberWeight
              : product.product_weight_ex;
          if (order.type === "bbs") {
            return {
              product_name: product.selectedProduct.label,
              weight: weight,
              quantity: numberQuantity,
              height: parseFloat(product.product_size.height.value) || 0,
              width: parseFloat(product.product_size.width.value) || 0,
              length: parseFloat(product.product_size.length.value) || 0,
            };
          }
          return {
            product_name: product.selectedProduct.label,
            weight: weight,
            quantity: numberQuantity,
            money: numberRetailPrices,
          };
        });
        listPackage.push(JSON.stringify(payload));
      });
      if (size(listPackage) > 0) {
        this.isFetchingSubmitSaveDraftOrder = true;
        const result = await services.$package.saveDraftPackage({
          packages: listPackage,
        });
        if (result && result.success) {
          if (get(result, "data.session_id")) {
            this.$store.commit("orderExcel/updateSessions", [
              {
                session_id: get(result, "data.session_id"),
                numberOrder: listPackage.length,
              },
            ]);
          }
          this.listOrder = [];
          this.onClickAddNewOrder();
        } else {
          message.error(result.message);
          if (result?.data?.log_id) {
            message.error("Mã lỗi: " + result?.data?.log_id);
          }
        }
        this.isFetchingSubmitSaveDraftOrder = false;
      }
    },

    // Giá trị hàng
    onOrderValueBlur(order) {
      let isValid = this.validateOrderValue(order);
      if (isValid) {
        this.calculateShipFee(order);
      } else {
        order.insurance_fee = 0;
      }
    },
    onOrderPickMoneyBlur(order) {
      this.validateOrderPickMoney(order);
      if (order.pick_money) {
        order.pick_money = parseInt(order.pick_money);
      }
      if (!order.value) {
        order.value = order.pick_money;
        this.calculateOrderValue(order);
        this.validateOrderValue(order);
      }
      this.calculateTotalAmount(order);
      this.debounceCalculateShipFee(order);
    },
    // Validate đơn hàng
    /**
     * Validate tiền thu hộ
     * @returns {boolean} True nếu tiền thu hộ đúng định dạng
     */
    validateOrderPickMoney(order) {
      order.validate.pick_money.innerError = "";
      order.validate.pick_money.outerError = "";

      let pick_money = order.pick_money;
      if (pick_money === 0) {
        return true;
      }
      if (!pick_money) {
        order.validate.pick_money.innerError = "Nhập tiền thu hộ";
        return false;
      } else {
        let parsed = parseFloat(pick_money);
        if (isNaN(parsed) || isNull(parsed)) {
          order.validate.pick_money.outerError = "Tiền thu hộ sai";
          return false;
        } else if (parsed > 20000000) {
          order.pick_money = 20000000;
          order.validate.pick_money.outerError =
            "GHTK chưa hỗ trợ ĐH có giá trị hàng lớn hơn 20,000,000 đ.";
          setTimeout(() => {
            order.validate.pick_money.outerError = "";
          }, 3000);
          return false;
        } else if (parsed > 0 && parsed < 10000) {
          order.validate.pick_money.outerError =
            "Tiền thu hộ bằng 0 đ hoặc từ 10,000 đ.";
          return false;
        }
        return true;
      }
    },

    validateOrderExpressTotalWeight(order) {
      order.validate.total_weight.innerError = "";
      order.validate.total_weight.outerError = "";
      let parsed = parseFloat(order.total_weight);
      if (order.total_weight && isNaN(parsed)) {
        order.validate.total_weight.outerError = "Tổng KL sai";
        return false;
      } else if (parsed > this.bbsMinWeight) {
        order.validate.total_weight.outerError = `Nhỏ hơn bằng ${this.bbsMinWeight}kg`;
        return false;
      }
      if (
        parsed >= 3 &&
        (!order.size.length.value ||
          !order.size.width.value ||
          !order.size.height.value)
      ) {
        order.validate.total_size_text.innerError = " ";
        return false;
      }
      return true;
    },
    /**
     * Validate giá trị đơn hàng
     * @returns {boolean} True nếu giá trị đơn hàng đúng định dạng
     */
    validateOrderValue(order) {
      order.validate.value.innerError = "";
      order.validate.value.outerError = "";
      let orderValue = parseFloat(order.value);
      let limitMoney = this.$store.getters["global/getBbsMaxValue"](order.type);
      if (order.value && isNaN(orderValue)) {
        order.validate.value.outerError = "Giá trị hàng sai";
        return false;
      } else if (orderValue > limitMoney) {
        order.value = limitMoney;
        order.validate.value.outerError = `GHTK chưa hỗ trợ ĐH có giá trị hàng lớn hơn ${this.$filters.numberFormatter(
          limitMoney
        )} đ.`;

        setTimeout(() => {
          order.validate.value.outerError = "";
        }, 3000);
        return false;
      } else if (orderValue === 0) {
        order.validate.value.outerError = "Giá trị hàng lớn hơn 0 đ.";
        return false;
      } else if (!orderValue && orderValue !== 0) {
        order.validate.value.innerError = "Nhập giá trị hàng";
        return false;
      } else if (
        orderValue < parseFloat(order.pick_money) &&
        order.type === "bbs"
      ) {
        order.validate.value.outerError =
          "Đối với đơn hàng BBS, Giá trị hàng hóa >= tiền thu hộ";
        return false;
      }
      return true;
    },
    validateOrderTotalWeight(order) {
      let weight =
        order.total_weight > order.total_weight_ex
          ? order.total_weight
          : order.total_weight_ex;
      const bbsMaxWeight = this.$store.getters["global/getBbsMaxWeight"](
        order.selectedPickAddressCod.payload.province_id
      );
      if (
        order.type === "bbs" &&
        (weight < this.bbsMinWeight || weight > bbsMaxWeight)
      ) {
        message.error("Khối lượng không thuộc mức hỗ trợ đơn BBS");
        return false;
      }
      return true;
    },

    // Địa chỉ lấy hàng
    onPickAddressSelectionChange(order) {
      order.deliver_date = {};
      order.pick_option = "post";
      this.browseDeliverTime(order);
      this.handleChangeShippingOption(order);
      this.calculateShipFee(order);
    },
    onPickAddressCodSelectionChange(order) {
      order.deliver_date = {};
      order.pick_option = "cod";
      this.handleChangeShippingOption(order);
      this.checkUrbanAddressValid(order);
      this.browsePickTime(order);
      this.getTransportMethod(order);
      this.getNearOffice(order);
      this.browseDeliverTime(order);
      this.calculateShipFee(order);
    },
    // Chọn thời gian lấy
    onPickDateSelectionChange(order, item) {
      order.deliver_date = {};
      order.pick_work_shift = item?.payload?.work_shift;
      this.browseDeliverTime(order);
    },

    async getNearOffice(order) {
      if (
        order.selectedPickAddressCod &&
        order.selectedPickAddressCod.value &&
        order.selectedPickAddressCod.payload.province_id &&
        order.selectedPickAddressCod.payload.district_id
      ) {
        let params = {
          provinceId: order.selectedPickAddressCod.payload.province_id,
          districtId: order.selectedPickAddressCod.payload.district_id,
          wardId: order.selectedPickAddressCod.payload.ward_id || "",
          streetId:
            order.selectedPickAddressCod.payload.street_id ||
            order.selectedPickAddressCod.payload.hamlet_id,
        };
        let res = await services.$address.browseNearOffice(params);
        if (res && res.success) {
          let converted = common.convertLabelValueDataSource({
            dataSource: res.data,
            labelName: "name",
            valueName: "id",
          });
          order.nearOffices = converted;
        }
      }
    },
    async calculateShipFee(order) {
      let payload = new models.ShipFeeRequest();
      let orderValueNumber = parseFloat(order.value) || 0;
      let totalWeightNumber = parseFloat(
        order.total_weight > order.total_weight_ex
          ? order.total_weight
          : order.total_weight_ex
      );
      let pickAddress = order.selectedPickAddressCod;
      if (
        !isNaN(orderValueNumber) &&
        !isNaN(totalWeightNumber) &&
        orderValueNumber != null &&
        orderValueNumber >= 0 &&
        order.selectedAddressPicker &&
        order.selectedAddressPicker.selectedProvince &&
        order.selectedAddressPicker.selectedProvince.value &&
        order.selectedAddressPicker.selectedDistrict &&
        order.selectedAddressPicker.selectedDistrict.value &&
        pickAddress &&
        pickAddress.value &&
        pickAddress.payload.province_id &&
        pickAddress.payload.district_id &&
        order.selectedCustomerAddress.label
      ) {
        order.isCalculatingFee = true;
        const addressPickerInfo = order.selectedAddressPicker;
        if (order.isUrbanAddress && order.shipping_option == "xfast")
          payload.deliver_option = "xteam";

        payload.package_type = order.type;
        payload.pick_province = pickAddress.payload.province;
        payload.pick_district = pickAddress.payload.district;
        payload.province = addressPickerInfo.selectedProvince.label;
        payload.district = addressPickerInfo.selectedDistrict.label;
        payload.address = order.selectedCustomerAddress.label;
        payload.weight = totalWeightNumber;
        payload.value = orderValueNumber;
        payload.transport = order.transport;
        payload.tags = order.tags;
        if (order.type === "bbs") {
          // Đơn hàng bbs
          payload.products = [];
          forEach(order.listSelectedProduct, (product) => {
            let quantity = parseInt(product.product_quantity.value);
            let width = parseInt(product.product_size.width.value);
            let height = parseInt(product.product_size.height.value);
            let length = parseInt(product.product_size.length.value);
            let product_weight = parseFloat(
              get(product, "product_weight.value", 0)
            );
            let product_weight_ex = parseFloat(
              get(product, "product_weight_ex", 0)
            );
            payload.products.push({
              width: width,
              height: height,
              length: length,
              quantity: quantity,
              weight:
                product_weight > product_weight_ex
                  ? product_weight
                  : product_weight_ex,
            });
          });
        } else {
          payload.weight = payload.weight * 1000;
        }
        order.ship_fee = 0;
        let result = await services.$package.calculateShipFee(payload);
        if (result && result.success) {
          if (order.type === "express") {
            order.ship_fee = get(result, "fee.ship_fee_only", 0);
            order.insurance_fee = get(result, "fee.insurance_fee", 0);
            order.ship_total_value = get(result, "fee.fee", 0);
            order.ext_fees = get(result, "fee.extFees", []);
            order.ship_fee_ex = 0;
          } else {
            order.insurance_fee = get(result, "data.insurance", 0);
            order.ship_fee = get(result, "data.value", 0);
            order.ship_total_value = get(result, "data.total_value", 0);
            order.ship_fee_ex = 0;
            order.ext_fees = get(result, "data.ext_fees", []);
          }
          let crr_first_ship_fee = order.first_ship_fee;
          if (order.type === "express") {
            order.first_ship_fee = order.first_ship_fee
              ? order.first_ship_fee
              : get(result, "fee.ship_fee_only", 0);
          } else {
            order.first_ship_fee = order.first_ship_fee
              ? order.first_ship_fee
              : get(result, "data.value", 0);
          }
          if (crr_first_ship_fee !== order.first_ship_fee) {
            order.not_delivered_fee = this.shopPolicyInfo?.deliver_package
              ?.not_delivered_fee?.fee
              ? order.not_delivered_fee
              : order.first_ship_fee;
          }
          let ship_fee_ex = 0;
          forEach(order.ext_fees, (extFee) => {
            ship_fee_ex += extFee.amount;
          });
          order.ship_fee_ex = ship_fee_ex;
          this.calculateTotalAmount(order);
        }
        order.isCalculatingFee = false;
      }
    },
    async getPackageLabel() {
      let res = await services.$package.browsePackageLabel();
      if (res && res.success) {
        let converted = map(get(res, "data", []), (x) => ({
          label: x.name,
          value: x.id,
          isSelected: false,
          payload: x,
        }));
        this.packageLabels = converted;
        let tag_tieu_chuan = find(
          this.packageLabels,
          (x) => x.label === "Tiêu chuẩn"
        );
        if (tag_tieu_chuan) {
          tag_tieu_chuan.isSelected = true;
        }
        this.listOrder[0].packageLabels = [
          ...map(converted, (x) => ({ ...x })),
        ];
      }
    },
    async browsePickTime(order, params) {
      if (!params && order.selectedPickAddressCod) {
        params = {
          province_id: order.selectedPickAddressCod.payload.province_id,
          district_id: order.selectedPickAddressCod.payload.district_id,
        };
      }
      order.pick_date = {};
      order.deliver_date = {};
      let listPickTime = [];

      if (order.type === "bbs") {
        let warehouse = order.selectedPickAddressCod.payload;
        let products = order.listSelectedProduct;
        listPickTime = await this.getPickTimeBBS(
          { warehouse, products, type: 1 },
          {
            convertToWithoutPayloadLabel: true,
            uniqueKey: "key",
          }
        );
      } else {
        let result = await services.$shop.browsePickTimes(params);
        let data = get(result, "data.pick_up", []);
        forEach(data, (x) => {
          if (x.type === "" && x.time.length) {
            forEach(x.time, (y) => {
              let text = y.text.trim().replace("ngày mai", "");
              listPickTime.push({
                label: text,
                value: y.id,
                payload: x,
              });
            });
          } else if (x.type === "" && !x.time.length) {
            listPickTime.push({
              label: x.name,
              value: x.date.trim() + " " + x.work_shift,
              payload: x,
            });
          } else {
            forEach(x.time, (y) => {
              let text = y.text;
              listPickTime.push({
                label: text,
                value: y.id,
                payload: x,
              });
            });
          }
        });
      }

      order.listPickTimeDataSource = listPickTime;
      if (order.listPickTimeDataSource.length) {
        order.pick_date = order.listPickTimeDataSource[0];
        order.pick_work_shift =
          order.listPickTimeDataSource[0]?.payload?.work_shift;
        await this.browseDeliverTime(order);
      }
    },
    async browseDeliverTime(order) {
      let pickAddress = order.selectedPickAddressCod;
      if (
        // Thời gian lấy hàng
        order.pick_date &&
        order.pick_date.value &&
        order.pick_date.label &&
        // Địa chỉ giao
        order.selectedAddressPicker &&
        order.selectedAddressPicker.selectedProvince &&
        order.selectedAddressPicker.selectedProvince.value &&
        order.selectedAddressPicker.selectedDistrict &&
        order.selectedAddressPicker.selectedDistrict.value &&
        pickAddress &&
        pickAddress.value &&
        pickAddress.payload.province_id &&
        pickAddress.payload.district_id
      ) {
        order.deliver_date = {};
        let params = {
          // id tỉnh địa chỉ lấy
          province_id: pickAddress.payload.province_id,
          // id huyện địa chỉ lấy
          district_id: pickAddress.payload.district_id,
          transfer_province_id:
            order.selectedAddressPicker.selectedProvince.value,
          transfer_district_id:
            order.selectedAddressPicker.selectedDistrict.value,
          pick_time: order.pick_date?.payload?.type || order.pick_date?.type,
          pick_date: order?.pick_date?.payload?.date,
          pick_work_shift: order?.pick_work_shift,
        };
        let result = await services.$package.browseDeliverTime(params);
        let data = get(result, ["data"], []);
        order.deliverTimeDataSource = data;
        let dataDeliverTime = get(
          order.deliverTimeDataSource,
          [order.transport, "deliver"],
          []
        );
        let listDeliverTime = [];
        forEach(dataDeliverTime, (x) => {
          if (x.type == "") {
            const date = moment(x.date).format("DD/MM");
            forEach(x.time, (y) => {
              if (y.id != -1) {
                listDeliverTime.push({
                  label: `${y.text} ngày ${date}`,
                  value: nanoid(),
                  deliver_time_slot: y.id,
                  payload: x,
                });
              }
            });
          } else {
            forEach(x.time, (y) => {
              if (y.id != -1) {
                listDeliverTime.push({
                  label: `${y.text} ${x.name.toLowerCase()}`,
                  value: nanoid(),
                  deliver_time_slot: y.id,
                  payload: x,
                });
              }
            });
          }
        });
        order.listDeliverTimeDataSource = listDeliverTime;
        if (size(dataDeliverTime) > 0) {
          order.deliver_date = listDeliverTime[0];
          order.deliver_work_shift =
            order.listDeliverTimeDataSource[0]?.payload?.work_shift;
        }
      }
    },

    onSubmitPickSize(e, order) {
      e.stopImmediatePropagation();
      if (
        !order.pickSize.length.value ||
        !order.pickSize.width.value ||
        !order.pickSize.height.value
      ) {
        message.error("Vui lòng nhập kích thước.");
        return;
      }
      const length = order.pickSize.length.value;
      const width = order.pickSize.width.value;
      const height = order.pickSize.height.value;
      const quyDoi_Weight = round((length * width * height) / 6000, 1);
      if (quyDoi_Weight > this.bbsMinWeight) {
        message.error(
          `GHTK chưa hỗ trợ ĐH express có khối lượng lớn hơn ${this.bbsMinWeight} kg.`
        );
        return;
      }
      order.size = {
        ...order.pickSize,
      };

      order.total_weight_ex = quyDoi_Weight;
      order.isShowPickSizeModal = false;
      this.calculateShipFee(order);
    },

    toggleAgreeTermAndCondition() {
      this.agreeTermAndCondition = !this.agreeTermAndCondition;
    },

    async getTransportMethod(order) {
      let pickAddress = order.selectedPickAddressCod;
      let selectedAddressPicker = order.selectedAddressPicker;
      let province_id = get(
        selectedAddressPicker,
        "selectedProvince.value",
        ""
      );
      let params = {
        pick_street_id: get(pickAddress, "payload.street_id", ""),
        pick_province_id: get(pickAddress, "payload.province_id", ""),
        pick_ward_id: get(pickAddress, "payload.ward_id", ""),
        customer_province_id: province_id,
      };
      try {
        let result = await services.$package.getTransportMethod(params);
        order.availableTransportMethod = get(result, ["data"], ["road"]);
      } catch (e) {
        order.availableTransportMethod = ["road"];
      }
    },

    async updateCustomerInfo(order, value) {
      order.tel = value.tel;
      order.customer_fullname = value.customer_fullname;
      order.customer_address = value.customer_address;
      order.selectedAddressPicker = value.selectedAddressPicker;
      order.selectedCustomerAddress = value.selectedCustomerAddress;
      order.isCustomerValid = value.isCustomerValid;

      if (value.isAddressChanged) {
        this.getTransportMethod(order);
        this.handleUnusedBooking(order);
        await this.checkUrbanAddressValid(order);
        if (order.isUrbanAddress) {
          this.resetUrbanAddressOptions(order);
          this.browsePickTime(order);
        } else {
          this.browseDeliverTime(order);
        }
        await this.calculateShipFee(order);
      }
    },

    updateProductList(order, productListInfo) {
      let quyDoi_Weight = 0;
      if (
        order.pickSize.length.value &&
        order.pickSize.width.value &&
        order.pickSize.height.value
      ) {
        const length = order.pickSize.length.value;
        const width = order.pickSize.width.value;
        const height = order.pickSize.height.value;
        quyDoi_Weight = round((length * width * height) / 6000, 1);
      }

      order.listSelectedProduct = productListInfo.listSelectedProduct;
      order.isProductListValid = productListInfo.isProductListValid;
      order.bbsPickSize = productListInfo.bbsPickSize;
      order.bbsRealWeight = productListInfo.bbsRealWeight;
      order.total_weight = productListInfo.total_weight;
      order.total_weight_ex =
        productListInfo.total_weight_ex > quyDoi_Weight
          ? productListInfo.total_weight_ex
          : quyDoi_Weight;
      order.total_weight_on_charge = productListInfo.total_weight_on_charge;
      if (!order.value && productListInfo.value > 0) {
        order.value = productListInfo.value;
      }
      this.debounceCalculateShipFee(order);
    },

    updatePickAddress(order, pickAddressInfo) {
      order.pick_option = pickAddressInfo.pick_option;
      order.selectedPickAddressCod = pickAddressInfo.selectedPickAddressCod;
      order.selectedPickAddressPost = pickAddressInfo.selectedPickAddressPost;
      this.browseDeliverTime(order);
      this.calculateShipFee(order);
    },
    async handleChangePickOptionCod(order) {
      order.selectedPickAddressPost = {};
      this.handleChangeShippingOption(order);
      await this.checkUrbanAddressValid(order);
      await this.browsePickTime(order);
      this.calculateShipFee(order);
    },
    async handleUnusedBooking(order) {
      if (order?.booking_id) {
        await this.deleteXfastBookingIds([order.booking_id]);
        delete order.booking_id;
      }
    },
    async handleChangePickOptionPost(order) {
      if (!order.selectedPickAddressPost.label) {
        order.selectedPickAddressPost = order.nearOffices.length
          ? order.nearOffices[0]
          : {};
      }
      await this.handleChangeShippingOption(order, true);
      await this.calculateShipFee(order);
    },

    selectImage(image) {
      document.getElementById(image).click();
    },

    updateTagSelected(order, data) {
      order.tags = data.tags.filter((item) => Number(item) > 0);
      order.tagNote = data.message;
      order.not_delivered_fee = Number(data.not_delivered_fee);
      order.not_delivered_option = data.not_delivered_option;
      order.value_order_images = data.images;
      order.value_order_images_file = data.images_file;
      order.note =
        order.shopCustomNote + this.generateMessageFromTagList(order);
      if (data.need_to_change_ship_fee) {
        this.calculateShipFee(order);
      }
    },

    generateMessageFromTagList(order) {
      let message = "";
      const not_delivered_fee = order.not_delivered_fee;
      for (let i = 0; i < this.tagList.length; i++) {
        let tag = this.tagList[i];
        if (order.tags && order.tags.includes(this.tagList[i].key)) {
          message += "; " + tag.title;
          if (this.tagList[i].key === 19 && not_delivered_fee) {
            message +=
              " " +
              not_delivered_fee
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
              " đ";
          }
        }
      }

      let tag = find(
        this.notDeliverOptions,
        (x) => x.value === order.not_delivered_option
      );
      if (tag) {
        message = message + "; " + "Hoàn hàng: " + tag["label"].toLowerCase();
      }
      message = message.slice(2);
      return message;
    },
    updateDataTracking(_dataTracking) {
      this.dataTracking = _dataTracking;
    },
    handleSubmitTracking(_dataTracking) {
      try {
        let payload = [];

        for (const orderId in _dataTracking) {
          payload = payload.concat(..._dataTracking[orderId]);
        }
        if (payload.length) {
          services.$address.addTrackingSuggestion(payload);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  async beforeUnmount() {
    let listBookingIds = [];
    this.listOrder.forEach((order) => {
      clearInterval(order.xfastInterval);
      if (order?.booking_id) {
        listBookingIds.push(order.booking_id);
      }
    });
    await this.deleteXfastBookingIds(listBookingIds);
  },
  unmounted() {
    this.dataTracking = [];
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/scss/create_order.scss";
</style>

<style>
.create-order__container .g-input {
  font-size: 16px !important;
}
.force-inline-block {
  display: inline-block !important;
}
.fade-in {
  animation: fadeIn ease 1s;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.xfast-tooltip::after {
  content: " ";
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 12px 12.5px 0 12.5px;
  border-color: #219653 transparent transparent transparent;
  position: absolute;
  top: -9px;
  left: 35px;
  transform: rotate(180deg);
}
</style>
