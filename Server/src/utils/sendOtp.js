import https from "https";

const otpLimits = {};

const OTP_LIMIT = 5;
const OTP_WINDOW = 60 * 60 * 1000; // 1 Hour

export const sendOtp = (mobile, otp) => {
  return new Promise((resolve, reject) => {
    const currentTime = Date.now();

    // Clean phone number (remove non-digits)
    let cleanMobile = String(mobile).replace(/\D/g, "");
    if (cleanMobile.length === 10) {
      cleanMobile = `91${cleanMobile}`;
    }

    if (!otpLimits[cleanMobile]) {
      otpLimits[cleanMobile] = {
        count: 0,
        firstSentTime: currentTime,
      };
    }

    const { count, firstSentTime } = otpLimits[cleanMobile];

    if (currentTime - firstSentTime < OTP_WINDOW) {
      if (count >= OTP_LIMIT) {
        return resolve(false);
      }
    } else {
      otpLimits[cleanMobile] = {
        count: 0,
        firstSentTime: currentTime,
      };
    }

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
        otpLimits[cleanMobile].count++;

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
        mobiles: cleanMobile,
        otp: otp,
      })
    );

    req.end();
  });
};