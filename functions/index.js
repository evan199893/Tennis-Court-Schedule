const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

setGlobalOptions({
  maxInstances: 10,
});

admin.initializeApp();

const TZ = process.env.ICS_TIMEZONE || "Asia/Taipei";
const SLOT_MINUTES = Number(process.env.ICS_SLOT_MINUTES || 60);

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

function foldLine(line) {
  const max = 75;
  if (line.length <= max) return [line];

  const parts = [];
  let remaining = line;
  while (remaining.length > max) {
    parts.push(remaining.slice(0, max));
    remaining = ` ${remaining.slice(max)}`;
  }
  parts.push(remaining);
  return parts;
}

function toEventLines(itemKey, item) {
  const date = String(item.date || "").trim();
  const court = String(item.court || "未指定").trim();
  const status = String(item.status || "已預約").trim();
  const source = String(item.source || "Firebase").trim();
  const times = Array.isArray(item.times)
    ? item.times
        .map((x) => String(x).trim())
        .filter((x) => /^\d{2}:\d{2}$/.test(x))
    : [];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !times.length) {
    return [];
  }

  const uniqueTimes = [...new Set(times)].sort();

  return uniqueTimes.flatMap((time, index) => {
    const end = addMinutes(date, time, SLOT_MINUTES);
    const uid = `${itemKey}-${index}@lane86-tennis`;
    const summary = `Lane86 Tennis Court ${court} (${status})`;
    const description = `${source}\\nCourt: ${court}\\nStatus: ${status}\\nTime: ${date} ${time}`;

    const lines = [
      "BEGIN:VEVENT",
      `UID:${escapeIcsText(uid)}`,
      `DTSTAMP:${utcStamp()}`,
      `DTSTART;TZID=${TZ}:${toIcsLocalDateTime(date, time)}`,
      `DTEND;TZID=${TZ}:${toIcsLocalDateTime(end.date, end.time)}`,
      `SUMMARY:${escapeIcsText(summary)}`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      "LOCATION:Lane86 Tennis Court",
      "END:VEVENT",
    ];

    return lines.flatMap(foldLine);
  });
}

function buildCalendar(itemsMap = {}) {
  const bodyLines = Object.entries(itemsMap)
    .filter(([, item]) => item && item.status !== "不同意")
    .sort((a, b) => {
      const aDate = String(a[1]?.date || "");
      const bDate = String(b[1]?.date || "");
      return aDate.localeCompare(bDate);
    })
    .flatMap(([key, item]) => toEventLines(key, item));

  const header = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lane86//Tennis Court Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Lane86 Tennis Court Schedule",
    `X-WR-TIMEZONE:${TZ}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT3H",
    "X-PUBLISHED-TTL:PT3H",
  ];

  return [...header, ...bodyLines, "END:VCALENDAR", ""].join("\r\n");
}

exports.calendarIcs = onRequest({ cors: true, region: "asia-east1" }, async (req, res) => {
  try {
    const snapshot = await admin.database().ref("items").get();
    const data = snapshot.val() || {};
    const icsText = buildCalendar(data);

    res.set("Content-Type", "text/calendar; charset=utf-8");
    res.set("Content-Disposition", 'inline; filename="lane86-tennis.ics"');
    res.set("Cache-Control", "public, max-age=300");
    res.status(200).send(icsText);
  } catch (error) {
    console.error("Failed to generate ICS feed", error);
    res.status(500).send("Failed to generate ICS feed");
  }
});
