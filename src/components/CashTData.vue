<template>
  <td>
    <inputSign />
    <input type="number" v-model.number="cashComputed" placeholder="Cash" />
  </td>
</template>

<script>
import inputSign from "@/components/inputSign";

export default {
  name: "CashTData",
  components: {
    inputSign,
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
