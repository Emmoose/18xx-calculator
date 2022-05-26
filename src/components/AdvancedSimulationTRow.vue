<template>
  <tr>
    <td></td>
    <td></td>
    <td
      class="td-copy"
      v-for="(n, index) in simulatedRoundsComputed"
      :key="index"
    >
      <button
        @click="copyColumn(index + 1, index)"
        v-show="index"
        class="copyColumn"
      >
        Copy Left
      </button>
      <button
        @click="copyColumn(index + 1, index + 2)"
        v-show="index + 1 < simulatedRoundsComputed"
        class="copyColumn"
      >
        Copy Right
      </button>
    </td>
  </tr>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "AdvancedSimulationTRow",

  methods: {
    copyColumn(indexFrom, indexTo) {
      this.$store.dispatch("copyColumnCorporatioNWealth", {
        indexFrom,
        indexTo,
      });
    },
  },

  computed: {
    ...mapState(["simulatedRounds"]),

    simulatedRoundsComputed() {
      return this.simulatedRounds ? this.simulatedRounds : 1;
    },
  },
};
</script>
