<template>
  <td>
    <CurrencySign />
    <input type="number" v-model.number="cashComputed" placeholder="Cash" />
  </td>
</template>

<script>
import CurrencySign from "@/components/CurrencySign";

export default {
  name: "CashCell",
  components: {
    CurrencySign,
  },
  props: {
    index: Number,
    cash: Number,
  },
  computed: {
    cashComputed: {
      get() {
        return this.cash;
      },
      set(value) {
        this.$store.dispatch("updatePlayerCash", {
          index: this.index,
          value: value,
        });
      },
    },
  },
};
</script>

<style lang="less" src="../assets/less/_CurrencySign.less" scoped></style>
