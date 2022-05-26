<template>
  <td>
    <slot><inputSign :disabled="disabled && cellIndex !== 0" /></slot>
    <input
      :disabled="disabled && cellIndex !== 0"
      type="number"
      v-model.number="cellValueComputed"
      :placeholder="placeholder"
      @focus="setInputFocused(true, rowIndex)"
      @blur="setInputFocused(false, null)"
    />
  </td>
</template>

<script>
import inputSign from "@/components/inputSign";

export default {
  name: "InputTData",
  props: {
    cellValue: Number,
    placeholder: String,
    rowIndex: Number,
    cellIndex: Number,
    action: String, // IMPROVE HERE
    disabled: Boolean,
  },
  components: {
    inputSign,
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
