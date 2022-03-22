<template>
  <span
    class="input-sign"
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
