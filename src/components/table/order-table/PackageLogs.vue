<template>
  <div>
    <g-timeline v-if="isLoading" :type="type">
      <a-timeline-item class="is-first">
        <g-skeleton-text :active="true" :width="'50%'" />
      </a-timeline-item>
      <a-timeline-item>
        <g-skeleton-text :active="true" :width="'80%'" />
      </a-timeline-item>
      <a-timeline-item>
        <div class="t-flex t-flex-col t-w-full">
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-image
            :active="true"
            :width="50"
            :height="50"
            class="mb"
          />
        </div>
      </a-timeline-item>
      <a-timeline-item>
        <g-skeleton-text :active="true" :width="'50%'" />
      </a-timeline-item>
    </g-timeline>
    <g-timeline v-else :type="type">
      <!-- <template v-if="isExtend && extendLogs?.length">
        <a-timeline-item
          class="is-extend"
          v-for="(extendLog, index) in extendLogs"
          :key="index"
        >
          <span>{{ extendLog.created }}: {{ extendLog.desc }}</span>
        </a-timeline-item>
      </template> -->
      <a-timeline-item
        v-for="(log, index) in logs"
        :key="log.id"
        :class="{ 'is-current': index === 0 && this.isExtend }"
      >
        <span class="t-mr-1">{{ formatTimelineCreated(log) }}:</span>
        <template v-if="isCallLog(log)">
          <template v-if="formatDesCallLog(log.desc)">
            <span>{{ formatDesCallLog(log.desc)[0] }}</span>
            <hidden-content
              :text="formatDesCallLog(log.desc)[1]"
              :first="3"
              :last="4"
            />
            <span>{{ formatDesCallLog(log.desc)[2] }}</span>
          </template>
          <span v-else>{{ log.desc }}</span>
        </template>
        <template v-else>
          <span v-html="log.desc" />
          <div v-if="logImageSrc(log)">
            <img class="t-w-[80px] t-rounded" :src="logImageSrc(log)" />
          </div>
        </template>
      </a-timeline-item>
    </g-timeline>
  </div>
</template>

<script>
import moment from "moment";

import { GSkeletonImage, GSkeletonText } from "@/components/elements/skeleton";
import { CACHE_URL } from "@/contants";
import { REGEX_PHONE_NUMBER } from "@/utils";
import { formatMomentDate } from "@/utils/date";
import { WORK_SHIFT } from "@/components/modal/PackageDetailModal.vue";
import { GTimeline } from "@/components/elements";
import { HiddenContent } from "@/components";

export const CALL_LOG_ACTION = [
  "callCustomer",
  "callShop",
  "callShopFail",
  "callCustomerFail",
  "voipCallShop",
  "voipCallShopFail",
];

export default {
  name: "PackageLogs",
  props: ["packageDetail", "isLoading", "max", "type", "isExtend"],
  components: {
    GSkeletonImage,
    GSkeletonText,
    GTimeline,
    HiddenContent,
  },
  computed: {
    extendLogs() {
      if (!this.isExtend) return [];
      let extendLogs = [];
      const _packageDetail = this.packageDetail?.Package || {};
      const dateDeliver = _packageDetail.date_to_delay_deliver;
      if (dateDeliver) {
        let created = formatMomentDate(moment(new Date(dateDeliver)), "DD/MM");
        if (_packageDetail.deliver_work_shift) {
          created = `${
            WORK_SHIFT[_packageDetail.deliver_work_shift]
          } ${created}`;
        }
        extendLogs = [
          {
            created,
            desc: "Dự kiến ĐH sẽ được giao đến người nhận",
          },
        ];
      }
      return extendLogs;
    },
    logs() {
      const csLogs = (this.packageDetail?.CsLog || []).map((l) => ({
        ...l,
        action: "callShop",
        isCsLog: true,
      }));

      let callLogs = [];
      for (const log of this.packageDetail?.logs || []) {
        if (CALL_LOG_ACTION.includes(log.action)) {
          callLogs.push(log);
        }
      }

      const mergeLogs = [
        ...csLogs,
        ...callLogs,
        ...(this.packageDetail?.CreateLog || []),
        ...(this.packageDetail?.PickLog || []),
        ...(this.packageDetail?.DeliverLog || []),
        ...(this.packageDetail?.AuditLog || []),
        ...(this.packageDetail?.ReturnLog || []),
      ];

      const _logsSorted = mergeLogs.sort((a, b) => {
        const aCreated = a.isCsLog
          ? new Date(a.created).getTime() - 7 * 3600 * 1000
          : new Date(a.created).getTime();
        const bCreated = b.isCsLog
          ? new Date(b.created).getTime() - 7 * 3600 * 1000
          : new Date(b.created).getTime();
        return bCreated - aCreated;
      });

      return this.max ? _logsSorted.slice(0, this.max) : _logsSorted;
    },
  },
  methods: {
    formatTimelineCreated(log) {
      if (!log.created) return "";
      if (log.isCsLog) {
        const timestamp = new Date(log.created).getTime() - 7 * 3600 * 1000;

        return formatMomentDate(moment(new Date(timestamp)), "hh:mm DD/MM");
      }

      const [date, time] = log.created.split(" ");
      const [hours, minutes] = time.split(":");
      // eslint-disable-next-line no-unused-vars
      const [_, month, day] = date.split("-");

      return `${hours}:${minutes} ${day}/${month}`;
    },
    logImageSrc(log) {
      const imageSrc = log.pickImage || log.deliveryImage || log.returnImage;
      if (!imageSrc) return null;
      if (!imageSrc.startsWith("http")) {
        return CACHE_URL + "/" + imageSrc;
      }
      return imageSrc;
    },
    isCallLog(log) {
      return CALL_LOG_ACTION.includes(log.action);
    },
    formatDesCallLog(des) {
      const match = des.match(REGEX_PHONE_NUMBER);
      const phoneNumber = match && match[0] ? match[0] : null;
      if (phoneNumber) {
        return [
          des.split(phoneNumber)[0],
          phoneNumber,
          des.split(phoneNumber)[1],
        ];
      }
      return null;
    },
  },
};
</script>
