import OptionsSync from "webext-options-sync";

export default new OptionsSync({
  defaults: {
    personalToken: "test",
  },
  migrations: [
    (savedOptions, currentDefaults) => {
      console.log('savedOptions: ', savedOptions);
      console.log('currentDefaults: ', currentDefaults);
      // Perhaps it was renamed
      // if (savedOptions.colour) {
      //   savedOptions.color = savedOptions.colour;
      //   delete savedOptions.colour;
      // }
    },
    OptionsSync.migrations.removeUnused,
  ],
  logging: true,
});
