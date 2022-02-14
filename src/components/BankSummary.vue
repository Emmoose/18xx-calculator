<template>
  <div class="bank-summation">
    <span>Sum cash and simulated operation: {{ bankSummation }}</span>
  </div>
</template>

<script>
export default {
  name: "BankSummary",

  props: {
    playersCash: Array,
    playerSimulatedIncome: Array,
  },

  computed: {
    bankSummation() {
      var cash = this.playersCash.reduce((acc, obj, index) => {
        if (index == 1) {
          return Number(acc.value) + Number(obj.value);
        } else {
          return Number(acc) + Number(obj.value);
        }
      });

      return (
        this.playerSimulatedIncome.reduce((previousValue, currentValue) => {
          return previousValue + currentValue;
        }) + cash
      );
    },
  },
};
</script>

<style lang="less" src="../assets/less/_BankSummary.less" scoped></style>
