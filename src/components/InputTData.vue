<template>
  <td>
    <slot><CurrencySign /></slot>
    <input
      type="number"
      v-model.number="cellValueComputed"
      :placeholder="placeholder"
      @focus="setInputFocused(true, rowIndex)"
      @blur="setInputFocused(false, null)"
    />
  </td>
</template>

<script>
import CurrencySign from "@/components/CurrencySign";

export default {
  name: "InputTData",
  props: {
    cellValue: Number,
    placeholder: String,
    rowIndex: Number,
    cellIndex: Number,
    action: String, // IMPROVE HERE
  },
  components: {
    CurrencySign,
  },

  methods: {
    setInputFocused(isSet, rowIndex) {
      this.$emit("input-focused", isSet);
      this.$store.commit("SET_FOCUSED_CORP_INDEX", rowIndex);
    },
  },

  computed: {
    cellValueComputed: {
      get() {
        return this.cellValue;
      },
      set(value) {
        this.$store.dispatch(this.action, {
          rowIndex: this.rowIndex,
          cellIndex: this.cellIndex,
          cellValue: value,
        });
      },
    },
  },
};
</script>

<style lang="less" src="../assets/less/_InputTData.less" scoped></style>
