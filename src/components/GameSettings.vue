<template>
  <div class="game-settings">
    <h4>Settings</h4>
    <div class="flex-column">
      <label>Select Game</label>
      <v-select
        placeholder="Välj lista"
        :clearable="false"
        :options="games"
        v-model="selectedGame"
      ></v-select>
    </div>
    <div class="flex-column">
      <label>Select Player number</label>

      <v-select
        placeholder="Välj lista"
        :clearable="false"
        :options="playerCounts"
        v-model="selectedPlayerCount"
      ></v-select>

      <label>Simulated Rounds</label>
      <div class="simulate-rounds">
        <button
          :disabled="simulatedRounds < 1"
          v-on:click="changeSimulatedRounds(simulatedRounds - 1)"
        >
          -1
        </button>
        <input
          type="number"
          :value="simulatedRounds"
          @change="changeSimulatedRounds($event.target.value)"
        />
        <button v-on:click="changeSimulatedRounds(simulatedRounds + 1)">
          +1
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import "vue-select/dist/vue-select.css";

export default {
  name: "GameSettings",
  methods: {
    changeSimulatedRounds(value) {
      this.$store.commit("SET_SIMULATED_ROUNDS", value);
    },
  },
  computed: {
    ...mapGetters(["playerCounts", "selectedPlayerCount"]),
    ...mapState(["games", "simulatedRounds"]),
    selectedGame: {
      get() {
        return this.$store.state.selectedGame;
      },
      set(value) {
        this.$store.dispatch("setupNewGame", value);
      },
    },

    selectedPlayerCount: {
      get() {
        return this.$store.state.selectedPlayerCount;
      },
      set(value) {
        this.$store.dispatch("changePlayerCount", value);
      },
    },
  },
};
</script>

<style lang="less" src="../assets/less/_GameSettings.less" scoped></style>
