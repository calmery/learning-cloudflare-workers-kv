const axios = require("axios");

const ACCOUNT_ID = "";
// Reference: https://dash.cloudflare.com/profile/api-tokens
// アクセス許可（「アカウント」、「Workers KV 保存スペース」、「編集」）を設定する
const TOKEN = "";
const KV_ID = "ab3f98a2a0204696a2aea3e3628c8ed0";

const ID = "example";
const VALUE = "localhost";

(async () => {
  try {
    const { data } = await axios.put(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${KV_ID}/values/${ID}`,
      JSON.stringify(VALUE),
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
})();
