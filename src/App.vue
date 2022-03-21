<template>
  <div id="app" class="app">
    <div class="calculator">
      <h2>Game: {{ selectedGame }}</h2>
      <p class="info-text">
        App for calculating end game scoring and optionally to simulate
        operating rounds with full payout.
      </p>
      <div class="top-row">
        <GameSettings />
        <CorporationHintMobile />
        <Table
          :table-data="corporationsWealth"
          :update-action="'updateCorporationWealth'"
        >
          <template v-slot:table-header>
            <CorpWealthTableHeader />
          </template>
          <template v-slot:input-sign> </template>
        </Table>
      </div>
      <Table
        :table-data="playerCorporationOwnership"
        :update-action="'updateCorporationOwnership'"
      >
        <template v-slot:table-header>
          <HoldingsTableHeader />
        </template>
        <template v-slot:input-sign>
          <span class="input-percentage">%</span>
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
import { mapState } from "vuex";
import { version } from "../package";
import constants from "@/constants.js";
import GameSettings from "./components/GameSettings";
import BankSummary from "./components/BankSummary";
import ScoringRows from "@/components/ScoringRows";
import CorporationHintMobile from "./components/CorporationHintMobile";
import CorpWealthTableHeader from "./components/CorpWealthTableHeader";
import Table from "./components/Table";
import HoldingsTableHeader from "./components/HoldingsTableHeader";

export default {
  name: "App",
  components: {
    BankSummary,
    CorporationHintMobile,
    Table,
    CorpWealthTableHeader,
    GameSettings,
    HoldingsTableHeader,
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
  },

  created: function () {
    this.$store.dispatch("setupGameOptions");

    const savedXXGame = JSON.parse(window.localStorage.getItem("savedXXGame"));

    savedXXGame && savedXXGame.version === version
      ? this.$store.dispatch("setupCachedGame", savedXXGame)
      : this.$store.dispatch("setupNewGame", constants.DEFAULT_GAME);
  },
};
</script>

<style lang="less" src="./assets/less/_App.less" />
