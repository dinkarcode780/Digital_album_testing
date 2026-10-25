import https from "https";

export const sendSmsInvite = (mobile, inviteLink) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      hostname: "api.msg91.com",
      path: "/api/v5/flow/",
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        "content-type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve(true);
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(
      JSON.stringify({
        flow_id: process.env.MSG91_FLOW_ID,
        sender: process.env.MSG91_SENDER,
        mobiles: `91${mobile}`,

        name: "Album Studio",

        link: inviteLink,
      })
    );

    req.end();
  });
};