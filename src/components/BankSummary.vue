<template>
  <div class="bank-summation">
    <span>Sum cash and simulated operation: {{ bankSummation }}</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "BankSummary",

  computed: {
    ...mapGetters(["bankSummation"]),
  },
};
</script>
