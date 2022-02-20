<template>
  <div class="game-settings">
    <h4>Settings</h4>
    <div class="flex-column">
      <label>Select Game</label>
      <select
        :value="selectedGame"
        @change="$emit('change-game', $event.target.value)"
      >
        <option v-for="game in games" v-bind:key="game">
          {{ game }}
        </option>
      </select>
    </div>
    <div class="flex-column">
      <label>Select Player number</label>
      <select
        v-model="selectedPlayerCountLocal"
        @change="$emit('change-player-count', $event)"
      >
        <option v-for="count in playerCounts" v-bind:key="count">
          {{ count }}
        </option>
      </select>
      <label>Simulated Rounds</label>
      <div class="simulate-rounds">
        <button
          :disabled="simulatedRounds < 1"
          v-on:click="$emit('change-simulated-rounds', simulatedRounds - 1)"
        >
          -1
        </button>
        <input
          type="number"
          :value="simulatedRounds"
          @change="$emit('change-simulated-rounds', $event.target.value)"
        />
        <button
          v-on:click="$emit('change-simulated-rounds', simulatedRounds + 1)"
        >
          +1
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameSettings",
  props: {
    games: Array,
    selectedGame: String,
    selectedPlayerCount: Number,
    simulatedRounds: Number,
    maxPlayer: Number,
    minPlayer: Number,
  },
  data() {
    return {
      playerCounts: [],
      selectedPlayerCountLocal: null,
    };
  },

  methods: {
    setupPlayerCounts() {
      var tempPlayerCounts = [];

      for (let index = this.minPlayer; index <= this.maxPlayer; index++) {
        tempPlayerCounts.push(index);
      }

      this.playerCounts = tempPlayerCounts;
    },
  },

  watch: {
    selectedGame() {
      this.setupPlayerCounts();
      this.selectedPlayerCountLocal = this.minPlayer;
    },
  },

  mounted() {
    this.setupPlayerCounts();
    this.selectedPlayerCountLocal = this.selectedPlayerCount;
  },
};
</script>

<style lang="less" src="../assets/less/_GameSettings.less" scoped></style>
