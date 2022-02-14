import constants from "@/constants";

var checkCorpHint = {
  data() {
    return {
      isCompanyOutside: false,
      isInputFocused: {
        value: false,
        index: null,
      },
    };
  },
  methods: {
    calulateIfCorpNameOutside(table) {
      this.isCompanyOutside =
        this.$refs[table][0].getBoundingClientRect().x <
        -constants.WIDTH_CORPORATION_NAME_ELEMENT;

      this.$emit(
        "toggle-corp-hint",
        this.isCompanyOutside && this.isInputFocused.value,
        this.isInputFocused.index,
        table
      );
    },

    setInputFocused(boolean, index, table) {
      this.isInputFocused.value = boolean;
      this.isInputFocused.index = index;

      this.$emit(
        "toggle-corp-hint",
        this.isCompanyOutside && this.isInputFocused.value,
        this.isInputFocused.index,
        table
      );
    },
  },
};

export default checkCorpHint;
