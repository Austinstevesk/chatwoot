export default {
  methods: {
    useInstallationName(str = '', installationName) {
      return str.replace(/NdovuChatwoot/g, installationName);
    },
  },
};
