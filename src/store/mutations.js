export default {
  SET_GAME_OPTIONS(state, val) {
    state.games = val;
  },

  SET_GAME(state, val) {
    state.selectedGame = val;
  },

  SET_GAME_DATA(state, val) {
    state.selectedGameData = val;
  },

  SET_PLAYER_COUNT(state, val) {
    state.selectedPlayerCount = val;
  },

  SET_PLAYERS_CASH(state, val) {
    state.playersCash = val;
  },

  SET_PLAYERS(state, val) {
    state.players = val;
  },

  SET_CORPORATIONS_WEALTH(state, val) {
    state.corporationsWealth = val;
  },

  SET_PLAYERS_CORPORATION_OWNERSHIP(state, val) {
    state.playerCorporationOwnership = val;
  },

  SET_SIMULATED_ROUNDS(state, val) {
    state.simulatedRounds = val;
  },

  SET_FOCUSED_CORP_INDEX(state, val) {
    state.focusedCorpIndex = val;
  },

  SET_SHOW_CORP_HEADER_MOBILE(state, val) {
    state.showCorpHeaderMobile = val;
  },
};
