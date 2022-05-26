<template>
  <span
    class="inputSign"
    v-bind:class="{
      left: currency.location == 'left',
      right: currency.location == 'right',
      disabled: disabled,
    }"
    >{{ currency.sign }}</span
  >
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "inputSign",
  props: {
    disabled: Boolean,
  },
  computed: {
    ...mapGetters(["currency"]),
  },
};
</script>
