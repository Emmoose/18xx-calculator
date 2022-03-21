<template>
  <span
    class="currency-on-input"
    v-bind:class="{
      left: currency.location == 'left',
      right: currency.location == 'right',
    }"
    >{{ currency.sign }}</span
  >
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CurrencySign",
  computed: {
    ...mapGetters(["currency"]),
  },
};
</script>

<style lang="less" src="../assets/less/_CurrencySign.less" scoped></style>
