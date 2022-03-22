<template>
  <div class="matrix" v-on:scroll="calulateIfCorpNameOutside">
    <table>
      <slot name="table-header"></slot>
      <tbody>
        <tr v-for="(row, index) in tableData" v-bind:key="index">
          <td
            ref="corpColumn"
            class="td-corporation"
            :style="{
              'background-color': corporations[index].backgroundColor,
              color: corporations[index].textColor,
            }"
          >
            {{ corporations[index].name }}
          </td>
          <InputTData
            v-for="(cell, innerIndex) in row"
            v-bind:key="`${index}#${innerIndex}`"
            v-bind:cell-value="cell"
            v-bind:row-index="index"
            v-bind:cell-index="innerIndex"
            v-bind:placeholder="tdPlaceholder[innerIndex]"
            v-bind:action="updateAction"
            v-on:input-focused="checkMobileHint"
          >
            <slot name="input-sign"></slot>
          </InputTData>
        </tr>
      </tbody>
      <slot name="additional-rows"></slot>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import InputTData from "@/components/InputTData";
import config from "@/config";
export default {
  name: "Table",
  components: {
    InputTData,
  },

  props: {
    tableData: Array,
    updateAction: String,
    tdPlaceholder: Array,
  },
  data() {
    return {
      isCorpNameOutside: false,
      isCellFocused: false,
    };
  },
  methods: {
    calulateIfCorpNameOutside() {
      this.isCorpNameOutside =
        this.$refs.corpColumn[0].getBoundingClientRect().x <
        -config.WIDTH_CORPORATION_NAME_ELEMENT;

      this.updateVisibilityCorpHint();
    },

    checkMobileHint(isSet) {
      this.isCellFocused = isSet;
      this.updateVisibilityCorpHint();
    },

    updateVisibilityCorpHint() {
      this.$store.commit(
        "SET_SHOW_CORP_HEADER_MOBILE",
        this.isCorpNameOutside && this.isCellFocused
      );
    },
  },
  computed: {
    ...mapGetters(["corporations"]),
  },
};
</script>
