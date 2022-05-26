<template>
  <div
    v-if="showCorpHeaderMobile"
    class="corpNameMobile"
    :style="{
      'background-color': focusedCorporation.backgroundColor,
      color: focusedCorporation.textColor,
    }"
  >
    {{ focusedCorporation.name }}
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "CorpHintMobile",

  computed: {
    ...mapState(["showCorpHeaderMobile"]),
    ...mapGetters(["focusedCorporation"]),
  },
};
</script>
