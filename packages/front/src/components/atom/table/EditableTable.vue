<template>
  <div id="editable-table">
    <GenericTable
      :headers="headersItems"
      :items="items"
      :itemsPerPage="itemsPerPage"
      :groupBy="groupBy"
      :hideGroupByCloseButton="hideGroupByCloseButton"
      :hideFooter="hideFooter !== undefined ? hideFooter : items.length < 11"
      :noDataTextHtml="noDataTextHtml"
      :isEnableCustomFooter="viewType === 'editable'"
      :disableSort="disableSort"
    >
      <template
        v-for="{ value: headerValue } in headersItems"
        v-slot:[`item.${headerValue}`]="{ item, value, rowIndex }"
      >
        <div :key="headerValue" class="item">
          <div v-if="headerValue !== 'actions'">
            <slot
              :name="`item.${headerValue}`"
              :headerValue="headerValue"
              :item="item"
              :value="value"
              :rowIndex="rowIndex"
              :isEditing="
                isEditingRows.find((index) => index === rowIndex) !== undefined
              "
            />
          </div>

          <div v-else class="d-flex">
            <template
              v-if="
                rowIndex === items.length - 1 ? !isDisableActionOnLastRow : true
              "
            >
              <div v-if="isEnableEditItem">
                <v-tooltip
                  v-if="
                    isEditingRows.find((index) => index === rowIndex) ===
                      undefined &&
                    !(hideActionRow(rowIndex) && hideActionRow(rowIndex).edit)
                  "
                  bottom
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      @click="editItem(rowIndex)"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>Modifier</span>
                </v-tooltip>

                <div v-else class="action-edit">
                  <v-tooltip
                    v-if="
                      isEnableValidateItem &&
                      !(
                        hideActionRow(rowIndex) &&
                        hideActionRow(rowIndex).validate
                      )
                    "
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="primary"
                        @click="validateItem(rowIndex)"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-check
                      </v-icon>
                    </template>
                    <span>Valider</span>
                  </v-tooltip>

                  <v-tooltip
                    v-if="
                      !(
                        hideActionRow(rowIndex) &&
                        hideActionRow(rowIndex).cancelEdit
                      )
                    "
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        @click="cancelEditItem(rowIndex)"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-arrow-u-left-top
                      </v-icon>
                    </template>
                    <span>Annuler</span>
                  </v-tooltip>
                </div>
              </div>

              <v-tooltip
                v-if="
                  isEnableDeleteItem &&
                  !(hideActionRow(rowIndex) && hideActionRow(rowIndex).delete)
                "
                bottom
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="error"
                    @click="deleteItem(rowIndex)"
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-delete
                  </v-icon>
                </template>
                <span>Supprimer</span>
              </v-tooltip>
            </template>
          </div>
        </div>
      </template>

      <template v-slot:[`footer`]>
        <div class="actions">
          <div
            v-if="viewType === 'editable' && !hideAddButton"
            class="actions-new"
          >
            <v-btn text class="actions-new-btn" color="grey" @click="addItem()">
              <v-icon dense left color="grey">mdi-plus-circle</v-icon>
              {{ addItemText }}
            </v-btn>
          </div>
        </div>
      </template>
    </GenericTable>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  computed,
  ComputedRef,
  defineComponent,
  onBeforeMount,
  PropType,
  ref,
  Ref,
} from "@vue/composition-api";
import { cloneDeep } from "lodash";

import CustomLabelButton from "@/components/atom/button/CustomLabelButton.vue";
import GenericTable, {
  TableHeaderItems,
  TableHeaderItem,
} from "./GenericTable.vue";

export type EditableTableRef = Vue & {
  updateIsEditing: (rowIndex: number, isEditing: boolean) => void;
  updateHideAction: (
    rowIndex: number,
    hideAction?: {
      edit?: boolean;
      cancelEdit?: boolean;
      delete?: boolean;
      validate?: boolean;
    }
  ) => void;
};
type HeaderActionItem = {
  text: "Action";
  value: "actions";
  sortable?: boolean;
  width?: string;
  align?: "start" | "center" | "end";
};
export { TableHeaderItems };
export type EditableTableHeaderItem = TableHeaderItem & HeaderActionItem;
export type EditableTableHeaderItems = EditableTableHeaderItem[];

/**
 * @Component EditableTable
 * @exports EditableTableRef
 * @exports EditableTableHeaderItem
 * @exports EditableTableHeaderItems
 * @slot {Object<{headerValue: string, item: EditableTableHeaderItem, value: string, rowIndex: number, isEditing: boolean }> item.`${headers[].value}`
 * @prop {TableHeaderItems} headers, required
 * @prop {Array} items, required
 * @prop {Number} itemsPerPage, default: 10
 * @prop {String} groupBy, default: undefined, groupe item by header key
 * @prop {Boolean} hideGroupByCloseButton, default: false
 * @prop {Boolean} hideAddButton, default: false
 * @prop {Boolean} hideFooter, default: undefined, set true by default if items.length < 11
 * @prop {Boolean} disableSort, default: false
 * @prop {Boolean} isEditingOnStartup, default: false, only on startup
 * @prop {String} addItemText, default: Ajouter
 * @prop {String} noDataTextHtml
 * @prop {Boolean} isEnableEditItem, default: true
 * @prop {Boolean} isEnableDeleteItem, default: true
 * @prop {Boolean} isEnableValidateItem, default: true
 * @prop {Boolean} isDisableActionOnLastRow, default: false
 * @emits addItem
 * @emits {Object<{rowIndex: number}>} editItem
 * @emits {Object<{rowIndex: number}>} cancelEditItem
 * @emits {Object<{rowIndex: number}} deleteItem
 * @emits {Object<{rowIndex: number}} validateItem
 */
export default defineComponent({
  name: "EditableTable",
  components: { CustomLabelButton, GenericTable },
  props: {
    // Generic
    headers: { type: Array as PropType<TableHeaderItems>, required: true },
    items: { type: Array, required: true },
    // Editable
    viewType: {
      type: String as PropType<"readOnly" | "editable">,
      default: "readOnly",
    },
    itemsPerPage: { type: Number, default: 10 },
    groupBy: { type: String, default: undefined },
    hideGroupByCloseButton: { type: Boolean, default: false },
    hideAddButton: { type: Boolean, default: false },
    hideFooter: { type: Boolean, default: undefined },
    disableSort: { type: Boolean, default: false },
    isEditingOnStartup: { type: Boolean, default: false },
    addItemText: { type: String, default: "Ajouter" },
    noDataTextHtml: { type: String, default: undefined },
    isEnableEditItem: { type: Boolean, default: true },
    isEnableDeleteItem: { type: Boolean, default: true },
    isEnableValidateItem: { type: Boolean, default: true },
    isDisableActionOnLastRow: { type: Boolean, default: false },
  },
  setup(props, context) {
    const isEditingRows: Ref<number[]> = ref([]);
    const hideActionRows: Ref<
      {
        edit: boolean;
        cancelEdit: boolean;
        delete: boolean;
        validate: boolean;
        rowIndex: number;
      }[]
    > = ref([]);
    const hideActionRow = computed(
      () => (rowIndex: number) =>
        hideActionRows.value.find(
          (hideActionRow) => hideActionRow.rowIndex === rowIndex
        )
    );

    // Header
    const headerActionItem: HeaderActionItem = {
      text: "Action",
      value: "actions",
      sortable: false,
      width: "80px",
      align: "center",
    };
    const headersItems: ComputedRef<EditableTableHeaderItems> = computed(() => {
      const headersItems = cloneDeep(props.headers);
      const headerActionsIndex = headersItems.findIndex(
        (headersItem) => headersItem.value === "actions"
      );
      if (headerActionsIndex !== -1 && props.viewType === "readOnly") {
        headersItems.splice(headerActionsIndex, 1);
      }
      if (headerActionsIndex === -1 && props.viewType === "editable") {
        headersItems.push(headerActionItem);
      }
      return headersItems as EditableTableHeaderItems;
    });

    // Methods
    const updateIsEditing: EditableTableRef["updateIsEditing"] = (
      rowIndex,
      isEditing
    ) => {
      const rowIndexFind = isEditingRows.value.findIndex(
        (index) => index === rowIndex
      );
      if (isEditing) {
        if (rowIndexFind === -1) {
          isEditingRows.value.push(rowIndex);
        }
      } else {
        if (rowIndexFind !== -1) {
          isEditingRows.value.splice(rowIndexFind, 1);
        }
      }
    };
    const updateHideAction: EditableTableRef["updateHideAction"] = (
      rowIndex,
      hideAction
    ) => {
      const rowIndexFind = hideActionRows.value.findIndex(
        (hideActionRow) => hideActionRow.rowIndex === rowIndex
      );
      if (rowIndexFind === -1) {
        hideActionRows.value.push({
          rowIndex,
          edit: !!hideAction?.edit,
          cancelEdit: !!hideAction?.cancelEdit,
          delete: !!hideAction?.delete,
          validate: !!hideAction?.validate,
        });
      } else {
        hideActionRows.value[rowIndexFind] = Object.assign(
          hideActionRows.value[rowIndexFind],
          {
            rowIndex,
            ...hideAction,
          }
        );
      }
    };

    // Events
    const addItem = () => {
      let rowIndex: number;
      if (props.items.length) {
        if (props.isDisableActionOnLastRow) {
          rowIndex = props.items.length - 1;
          updateIsEditing(rowIndex, true);
        } else {
          rowIndex = props.items.length;
          updateIsEditing(props.items.length, true);
        }
      } else {
        rowIndex = 0;
        updateIsEditing(0, true);
      }
      context.emit("addItem", { rowIndex });
    };
    const editItem = (rowIndex: number) => {
      updateIsEditing(rowIndex, true);
      context.emit("editItem", { rowIndex });
    };
    const cancelEditItem = (rowIndex: number) => {
      updateIsEditing(rowIndex, false);
      context.emit("cancelEditItem", { rowIndex });
    };
    const deleteItem = (rowIndex: number) => {
      updateIsEditing(rowIndex, false);
      const rowIndexFindNext = isEditingRows.value.findIndex(
        (index) => index === rowIndex + 1
      );
      if (rowIndexFindNext !== -1) {
        for (
          let index = rowIndexFindNext;
          index < isEditingRows.value.length;
          index++
        ) {
          const element = isEditingRows.value[index];
          Vue.set(isEditingRows.value, index, element - 1);
        }
      }
      context.emit("deleteItem", { rowIndex });
    };
    const validateItem = (rowIndex: number) => {
      context.emit("validateItem", { rowIndex });
    };

    // Init
    onBeforeMount(() => {
      if (props.isEditingOnStartup) {
        for (let index = 0; index < props.items.length; index++) {
          if (
            props.isDisableActionOnLastRow &&
            index === props.items.length - 1
          ) {
            continue;
          } else {
            updateIsEditing(index, true);
          }
        }
      }
    });

    return {
      headersItems,
      isEditingRows,
      hideActionRows,
      hideActionRow,
      updateIsEditing,
      updateHideAction,
      addItem,
      editItem,
      cancelEditItem,
      deleteItem,
      validateItem,
    };
  },
});
</script>

<style lang="scss">
@import "~vuetify/src/styles/settings/_variables";

#editable-table {
  margin-bottom: #{map-get($spacers, 6)};
}

.item {
  .action-edit {
    display: flex;
  }
}

.actions {
  display: flex;

  &-new {
    text-align: center !important;
    width: 100%;

    &-btn {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: inherit;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 4px;

      .v-btn__content {
        display: flex;
        flex-direction: row;
      }
    }
  }
}
</style>
