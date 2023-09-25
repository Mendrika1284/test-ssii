<template>
  <div id="generic-table">
    <template>
      <v-card outlined class="px-3">
        <v-data-table
          :headers="headers"
          :items="items"
          class="mt-4 mb-1 table"
          :class="{ hideGroupByCloseButton }"
          :items-per-page="itemsPerPage"
          :group-by="groupBy"
          :hide-default-header="hideHeader"
          :hide-default-footer="hideFooter"
          :disable-sort="disableSort"
        >
          <template
            v-for="{ value: headerValue } in headers"
            v-slot:[`item.${headerValue}`]="{ value, item, index }"
          >
            <div :key="headerValue">
              <slot
                :name="`item.${headerValue}`"
                :headerValue="headerValue"
                :item="item"
                :value="value"
                :rowIndex="index"
              />
            </div>
          </template>

          <template v-slot:no-data v-if="noDataTextHtml">
            <div v-html="noDataTextHtml" />
          </template>

          <template
            v-slot:[`footer`]="{ props, on, headers, widths }"
            v-if="isEnableCustomFooter"
          >
            <div class="footer">
              <slot
                name="footer"
                :props="props"
                :on="on"
                :headers="headers"
                :widths="widths"
              />
            </div>
          </template>
        </v-data-table>

        <div class="mt-1">
          <slot name="default" />
        </div>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/composition-api";
import { upperFirst } from "lodash";

export type TableHeaderItem = {
  text: string;
  value: string;
  sortable?: boolean;
  width?: string;
  align?: "start" | "center" | "end";
};
export type TableHeaderItems = TableHeaderItem[];

/**
 * @Component GenericTable
 * @exports TableHeaderItem
 * @exports TableHeaderItems
 * @slot {Object<{headerValue: string, item: TableHeaderItem, value: string, rowIndex: number }> item.`${headers[].value}`
 * @slot {Object<{props: Object<https://v2.vuetifyjs.com/en/api/v-data-table/#slots-footer>, on: object, headers: TableHeaderItems, widths: [] }> footer
 * @slot actions
 * @prop {TableHeaderItems} headers, required
 * @prop {Array} items, required
 * @prop {Number} itemsPerPage
 * @prop {String} groupBy, default: undefined, groupe item by header key
 * @prop {Boolean} hideGroupByCloseButton
 * @prop {Boolean} hideHeader
 * @prop {Boolean} hideFooter
 * @prop {Boolean} disableSort
 * @prop {String} noDataTextHtml
 * @prop {Boolean} isEnableCustomFooter, Activate footer slot
 */
export default defineComponent({
  name: "GenericTable",
  props: {
    headers: { type: Array as PropType<TableHeaderItems>, required: true },
    items: { type: Array, require: true },
    itemsPerPage: { type: Number, default: 10 },
    groupBy: { type: String, default: undefined },
    hideGroupByCloseButton: { type: Boolean, default: false },
    hideHeader: { type: Boolean, default: false },
    hideFooter: { type: Boolean, default: false },
    disableSort: { type: Boolean, default: false },
    noDataTextHtml: { type: String },
    isEnableCustomFooter: { type: Boolean, default: false },
  },
  setup(props) {
    const groupBySummary = (headerValue: string, groupValue) => {
      const headerItem = props.headers.find(
        (header) => header.value === headerValue
      );
      if (headerItem) {
        return `${upperFirst(headerItem.text)}: ${groupValue}`;
      }
      return "";
    };

    return { groupBySummary };
  },
});
</script>

<style lang="scss">
@import "~vuetify/src/styles/settings/_variables";

#generic-table {
  width: -webkit-fill-available;

  .table {
    .v-data-table__mobile-row {
      align-items: baseline;
    }
    .footer {
      padding-top: #{map-get($spacers, 0)};
      padding-bottom: #{map-get($spacers, 2)};
      padding-right: #{map-get($spacers, 3)};
      padding-left: #{map-get($spacers, 3)};
    }
  }

  .table.hideGroupByCloseButton {
    .v-row-group__header {
      td {
        button:last-child {
          display: none;
        }
      }
    }
  }
}
</style>
