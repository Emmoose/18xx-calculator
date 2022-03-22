<template>
  <div id="app" class="app">
    <div class="calculator">
      <h2>Game: {{ selectedGame }}</h2>
      <p class="info-text">
        Web app for calculating end game scoring and optionally to simulate
        operating rounds with full payout.<br />
        Thoughts, ideas, comments etc, please contact me
        <a href="mailto: emil.mossberg@gmail.com">emil.mossberg@gmail.com</a>.
      </p>
      <div class="top-row">
        <GameSettings />
        <CorpHintMobile />
        <Table
          :table-data="corporationsWealth"
          :update-action="'updateCorporationWealth'"
          :td-placeholder="[' Stock value', 'Revenue']"
        >
          <template v-slot:table-header>
            <CorpWealthTHeader />
          </template>
          <template v-slot:input-sign> </template>
        </Table>
      </div>
      <Table
        :table-data="playerCorporationOwnership"
        :update-action="'updateCorporationOwnership'"
        :td-placeholder="PlaceholderValuesHoldings"
      >
        <template v-slot:table-header>
          <HoldingsTHeader />
        </template>
        <template v-slot:input-sign>
          <span class="input-sign right">%</span>
        </template>
        <template v-slot:additional-rows>
          <thead>
            <tr>
              <th class="main-header" :colspan="selectedPlayerCount + 1">
                Players Scoring Summary
              </th>
            </tr>
          </thead>
          <ScoringRows />
        </template>
      </Table>
      <BankSummary />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { version } from "../package";
import config from "@/config.js";
import GameSettings from "./components/GameSettings";
import BankSummary from "./components/BankSummary";
import ScoringRows from "@/components/ScoringRows";
import CorpHintMobile from "./components/CorpHintMobile";
import CorpWealthTHeader from "./components/CorpWealthTHeader";
import Table from "./components/Table";
import HoldingsTHeader from "./components/HoldingsTHeader";

export default {
  name: "App",
  components: {
    BankSummary,
    CorpHintMobile,
    Table,
    CorpWealthTHeader,
    GameSettings,
    HoldingsTHeader,
    ScoringRows,
  },

  methods: {
    setupNewGame(gameName) {
      this.$store.dispatch("setupNewGame", gameName);
    },
  },

  computed: {
    ...mapState([
      "corporationsWealth",
      "playerCorporationOwnership",
      "selectedGame",
      "selectedPlayerCount",
    ]),
    ...mapGetters(["PlaceholderValuesHoldings"]),
  },

  created() {
    this.$store.dispatch("setupGameOptions");

    const savedXXGame = JSON.parse(window.localStorage.getItem("savedXXGame"));

    savedXXGame && savedXXGame.version === version
      ? this.$store.dispatch("setupCachedGame", savedXXGame)
      : this.$store.dispatch("setupNewGame", config.DEFAULT_GAME);
  },
};
</script>

<style lang="less" src="./assets/less/_App.less" />
