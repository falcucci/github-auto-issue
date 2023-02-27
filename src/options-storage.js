import OptionsSync from "webext-options-sync";

export default new OptionsSync({
  defaults: {
    personalToken: "test",
  },
  migrations: [
    OptionsSync.migrations.removeUnused,
  ],
  logging: true,
});
