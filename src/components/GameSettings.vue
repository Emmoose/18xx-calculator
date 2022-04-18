<template>
  <div class="game-settings">
    <h2>Settings</h2>
    <div class="flex-column">
      <label>Select Game</label>
      <select v-model="selectedGame">
        <option v-for="(game, index) in games" v-bind:key="index">
          {{ game }}
        </option>
      </select>
    </div>
    <div class="flex-column">
      <label>Select Player number</label>
      <select v-model="selectedPlayerCount">
        <option v-for="(playerCount, index) in playerCounts" v-bind:key="index">
          {{ playerCount }}
        </option>
      </select>

      <label>Simulated Rounds</label>
      <div class="simulate-rounds">
        <button
          class="sim-button"
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
        <button
          class="sim-button"
          v-on:click="changeSimulatedRounds(simulatedRounds + 1)"
        >
          +1
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "GameSettings",
  methods: {
    changeSimulatedRounds(value) {
      this.$store.dispatch("setSimulatedRounds", value);
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
