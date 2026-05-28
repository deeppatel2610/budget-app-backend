const apiLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, body } = req;

  // Mask sensitive password values in backend logs too
  const loggedBody = { ...body };
  if (loggedBody.password) {
    loggedBody.password = "******";
  }
  if (loggedBody.refreshToken) {
    loggedBody.refreshToken =
      loggedBody.refreshToken.toString().slice(0, 15) + "...";
  }

  // 1. Log Request details
  console.log(
    `\n┌── 🖥️  [BACKEND REQUEST] ──────────────────────────────────────`,
  );
  console.log(`│ ▶️ Method: ${method}`);
  console.log(`│ ▶️ URL:    ${originalUrl}`);
  if (Object.keys(loggedBody).length > 0) {
    console.log(`│ 📦 Body:   ${JSON.stringify(loggedBody)}`);
  }
  console.log(`└─────────────────────────────────────────────────────────────`);

  // 2. Intercept response to log execution duration and status code
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 200 && res.statusCode < 300
        ? "🟢 SUCCESS"
        : "🔴 ERROR";

    console.log(
      `┌── 🖥️  [BACKEND RESPONSE] ─────────────────────────────────────`,
    );
    console.log(`│ ⏪ URL:    ${originalUrl}`);
    console.log(`│ 📶 Status: ${statusColor} (${res.statusCode})`);
    console.log(`│ ⏱️ Time:   ${duration}ms`);
    console.log(
      `└─────────────────────────────────────────────────────────────\n`,
    );

    return originalJson.call(this, data);
  };

  next();
};

module.exports = apiLogger;
