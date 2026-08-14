function pad(number) {
  return String(number).padStart(2, "0");
}

function escapeIcsText(value = "") {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toIcsLocalDateTime(dateString, timeString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hour, minute] = timeString.split(":").map(Number);
  return `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
}

function addMinutes(dateString, timeString, minutesToAdd) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hour, minute] = timeString.split(":").map(Number);
  const dt = new Date(year, month - 1, day, hour, minute, 0, 0);
  dt.setMinutes(dt.getMinutes() + minutesToAdd);

  return {
    date: `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`,
    time: `${pad(dt.getHours())}:${pad(dt.getMinutes())}`,
  };
}

function utcStamp() {
  const now = new Date();
  return `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(
    now.getUTCMinutes()
  )}${pad(now.getUTCSeconds())}Z`;
}

function buildCalendar(itemsMap = {}) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lane86//Tennis Court Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Lane86 Tennis Court Schedule",
    "X-WR-TIMEZONE:Asia/Taipei",
    "REFRESH-INTERVAL;VALUE=DURATION:PT3H",
    "X-PUBLISHED-TTL:PT3H",
  ];

  Object.entries(itemsMap)
    .filter(([, item]) => item && item.status !== "不同意")
    .sort((a, b) => String(a[1]?.date || "").localeCompare(String(b[1]?.date || "")))
    .forEach(([key, item]) => {
      const date = String(item.date || "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;

      const court = String(item.court || "未指定").trim();
      const status = String(item.status || "已預約").trim();
      const source = String(item.source || "Firebase").trim();
      const uniqueTimes = [...new Set((item.times || []).map((x) => String(x).trim()).filter((x) => /^\d{2}:\d{2}$/.test(x)))].sort();

      uniqueTimes.forEach((time, index) => {
        const end = addMinutes(date, time, 60);
        const uid = `${key}-${index}@lane86-tennis`;
        const summary = `Lane86 Tennis Court ${court} (${status})`;
        const description = `${source}\\nCourt: ${court}\\nStatus: ${status}\\nTime: ${date} ${time}`;

        lines.push("BEGIN:VEVENT");
        lines.push(`UID:${escapeIcsText(uid)}`);
        lines.push(`DTSTAMP:${utcStamp()}`);
        lines.push(`DTSTART;TZID=Asia/Taipei:${toIcsLocalDateTime(date, time)}`);
        lines.push(`DTEND;TZID=Asia/Taipei:${toIcsLocalDateTime(end.date, end.time)}`);
        lines.push(`SUMMARY:${escapeIcsText(summary)}`);
        lines.push(`DESCRIPTION:${escapeIcsText(description)}`);
        lines.push("LOCATION:Lane86 Tennis Court");
        lines.push("END:VEVENT");
      });
    });

  lines.push("END:VCALENDAR", "");
  return lines.join("\r\n");
}

export default async function handler(req, res) {
  const databaseUrl = process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL;

  if (!databaseUrl) {
    res.status(500).send("Missing FIREBASE_DATABASE_URL or VITE_FIREBASE_DATABASE_URL");
    return;
  }

  try {
    const response = await fetch(`${databaseUrl.replace(/\/$/, "")}/items.json`);
    if (!response.ok) {
      throw new Error(`Firebase REST request failed with ${response.status}`);
    }

    const items = (await response.json()) || {};
    const icsText = buildCalendar(items);

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", 'inline; filename="lane86-tennis.ics"');
    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(200).send(icsText);
  } catch (error) {
    console.error("Failed to generate ICS feed", error);
    res.status(500).send("Failed to generate ICS feed");
  }
}