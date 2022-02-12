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
export default {
  name: "TableDataCurrency",
  props: {
    currency: Object,
  },
};
</script>

<style lang="less" src="../assets/less/_TableDataCurrency.less" scoped></style>
