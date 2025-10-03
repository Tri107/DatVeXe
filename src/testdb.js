const db = require('./config/db');

(async () => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log(" Kết nối DB thành công, test query =", rows[0].result);
  } catch (err) {
    console.error("Lỗi kết nối DB:", err.message);
  }
})();
