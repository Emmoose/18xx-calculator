<template>
  <td>
    <select v-model="shareOption" class="matrixSelect">
      <option v-for="(playerCount, index) in shareOptions" v-bind:key="index">
        {{ playerCount }}
      </option>
    </select>
  </td>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SelectTCell",
  props: {
    index: Number,
  },

  computed: {
    ...mapState(["selectedGameData"]),

    shareOptions() {
      return this.selectedGameData.shareStructure.shareVersions;
    },

    shareOption: {
      get() {
        return this.$store.state.multipleShareSelected[this.index];
      },

      set(value) {
        this.$store.dispatch("setShareOption", {
          index: this.index,
          value: value,
        });
      },
    },
  },
};
</script>
