<template>
  <thead class="corpWealthHeader">
    <tr>
      <th class="mainHeader" :colspan="colSpan">Corporation Wealth Table</th>
    </tr>
    <tr>
      <th>Corporations</th>
      <th v-show="multipleShare"># Shares</th>
      <th>Per Stock Value</th>
      <th v-show="!advancedSimulation">Corp Revenue</th>
      <th
        v-show="advancedSimulation && simulatedRounds > 0"
        v-for="(round, index) in simulatedRounds"
        v-bind:key="index"
      >
        {{ `Corp OR #${index + 1}` }}
      </th>
      <th v-show="advancedSimulation && simulatedRounds == 0">Corp OR #1</th>
    </tr>
  </thead>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CorpWealthTHeader",

  computed: {
    ...mapState([
      "multipleShare",
      "corporationsWealth",
      "simulatedRounds",
      "advancedSimulation",
    ]),

    colSpan() {
      return this.corporationsWealth.length;
    },
  },
};
</script>
