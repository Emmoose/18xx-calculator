<template>
  <div class="bankSummation">
    <h2 class="gameSectionHeader">Bank estimate</h2>
    <div class="bankSummation__body">
      <span v-if="currency.location === 'left'">{{ currency.sign }} </span>
      <span class="bankSummation__value"
        >{{ Math.ceil(bankSummation.cash) }} </span
      ><span v-if="currency.location === 'right'">{{ currency.sign }} </span
      ><span class="bankSummation__name"> (Player total cash) </span>
      <span class="bankSummation__value"> + </span>
      <span v-if="currency.location === 'left'">{{ currency.sign }} </span
      ><span class="bankSummation__value">{{
        Math.ceil(bankSummation.simulatedIncome)
      }}</span
      ><span v-if="currency.location === 'right'"> {{ currency.sign }} </span
      ><span class="bankSummation__name">
        (Player total simulated revenue)
      </span>
      <span class="bankSummation__value"> = </span>
      <span v-if="currency.location === 'left'">{{ currency.sign }} </span>
      <span class="bankSummation__value">
        {{ Math.ceil(bankSummation.total) }}
      </span>
      <span v-if="currency.location === 'right'">{{ currency.sign }} </span>
      <span class="bankSummation__name"> (Player total value) </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BankSummary",

  computed: {
    ...mapGetters(["bankSummation", "currency"]),
  },
};
</script>
