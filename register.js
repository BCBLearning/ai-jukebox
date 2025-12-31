import { registerEntitySecretCiphertext } from "@circle-fin/developer-controlled-wallets";

const response = await registerEntitySecretCiphertext({
  apiKey:
    "TEST_API_KEY:3717936b9b9c336d144158221add7db9:6a881e54c503775db64afdb36ed10de2",
  entitySecret: "0aecaecf103b36ac9ff0ac2530b7d487ee3c31baf5cec0d771e865fd338ccd56",
  recoveryFileDownloadPath: "",
});
console.log(response.data?.recoveryFile);