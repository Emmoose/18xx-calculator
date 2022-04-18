<template>
  <div class="bank-summation">
    <span class="bank-summation__value">Bank estimate: </span>
    <span v-if="currency.location === 'left'">{{ currency.sign }} </span>
    <span class="bank-summation__value">{{ bankSummation.cash }}</span
    ><span v-if="currency.location === 'right'">{{ currency.sign }} </span
    ><span class="bank-summation__name"> (Player total cash) </span>
    <span class="bank-summation__value"> + </span>
    <span v-if="currency.location === 'left'">{{ currency.sign }} </span
    ><span class="bank-summation__value">{{
      bankSummation.simulatedIncome
    }}</span
    ><span v-if="currency.location === 'right'">{{ currency.sign }} </span
    ><span class="bank-summation__name">
      (Player total simulated revenue)
    </span>
    <span class="bank-summation__value"> = </span>
    <span v-if="currency.location === 'left'">{{ currency.sign }} </span>
    <span class="bank-summation__value"> {{ bankSummation.total }} </span>
    <span v-if="currency.location === 'right'">{{ currency.sign }} </span>
    <span class="bank-summation__name"> (Player total value) </span>
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
