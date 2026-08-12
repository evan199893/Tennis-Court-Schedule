import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardPaste,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Clock3,
  MapPin,
} from "lucide-react";
import { Button } from "./components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/Card";
import { Textarea } from "./components/Textarea";
import { Badge } from "./components/Badge";
import { initializeAuth, onAuthChange, getItems, addItem, removeItemFromFirebase, database } from "./firebase";

const INITIAL_TEXT = `Happy Hour星空網球場A
已預約
租借日期：2026-09-09 | 20:00,21:00
星空球場網球 A
已預約
租借日期：2026-09-08 | 20:00,21:00
星空球場網球 B
已預約
租借日期：2026-09-06 | 17:00,18:00
星空球場網球 B
已預約
租借日期：2026-09-04 | 20:00,21:00
星空球場網球 B
已預約
租借日期：2026-09-03 | 20:00,21:00
星空球場網球 A
已預約
租借日期：2026-08-31 | 20:00,21:00
星空球場網球 B
已預約
租借日期：2026-08-28 | 20:00,21:00
星空球場網球 B
已預約
租借日期：2026-08-27 | 20:00,21:00
星空球場網球 A
不同意
租借日期：2026-08-26 | 18:00,19:00
星空球場網球 B
已預約
租借日期：2026-08-25 | 19:00,20:00
星空球場網球 A
已預約
租借日期：2026-08-23 | 20:00,21:00
星空球場網球 A
已預約
租借日期：2026-08-21 | 20:00,21:00
星空球場網球 A
已預約
租借日期：2026-08-19 | 20:00,21:00
星空球場網球 A
已預約
租借日期：2026-08-18 | 20:00,21:00
星空球場網球 A
不同意
租借日期：2026-08-17 | 18:00
星空球場網球 A
已預約
租借日期：2026-08-16 | 16:00,17:00
星空球場網球 B
臨櫃已預約
租借日期：2026-08-15 | 16:00,17:00
星空球場網球 B
不同意
租借日期：2026-08-15 | 16:00,17:00
星空球場網球 B
已預約
租借日期：2026-08-14 | 19:00,20:00
星空球場網球 A
已預約
租借日期：2026-08-13 | 18:00,19:00
星空球場網球 A
不同意
租借日期：2026-08-13 | 18:00,19:00
星空球場網球 B
已預約
租借日期：2026-08-13 | 18:00,19:00`;

const STATUS_OPTIONS = ["已預約", "臨櫃已預約", "不同意"];
const WEEKDAYS = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
const STORAGE_KEY = "tennis-calendar-items-v1";
const SOURCE_REPO_URL = "https://github.com/evan199893/Tennis-Court-Schedule";

function pad(n) {
  return String(n).padStart(2, "0");
}

function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function normalizeCourt(raw = "") {
  const compact = raw.replace(/\s+/g, "").toUpperCase();
  const match = compact.match(/(?:網球場?|場)?([AB])$/) || compact.match(/([AB])/);
  return match ? match[1] : "未指定";
}

function normalizeTime(raw) {
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return `${pad(h)}:${pad(min)}`;
}

function itemId(item) {
  return `${item.date}|${item.court}|${item.status}|${item.times.join(",")}`;
}

function parseSchedule(text) {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

  const results = [];
  let pendingCourt = null;
  let pendingStatus = "已預約";

  for (const line of lines) {
    const dateMatch = line.match(/租借日期\s*[：:]\s*(\d{4})[-\/]?(\d{1,2})[-\/]?(\d{1,2})\s*\|\s*(.+)$/);
    if (dateMatch) {
      const date = `${dateMatch[1]}-${pad(dateMatch[2])}-${pad(dateMatch[3])}`;
      const times = dateMatch[4]
        .split(/[,，、\s]+/)
        .map(normalizeTime)
        .filter(Boolean);

      if (pendingCourt && times.length) {
        results.push({
          id: `${Date.now()}-${results.length}-${Math.random()}`,
          date,
          court: pendingCourt,
          status: pendingStatus,
          times: [...new Set(times)].sort(),
          source: "貼上解析",
        });
      }
      pendingCourt = null;
      pendingStatus = "已預約";
      continue;
    }

    if (STATUS_OPTIONS.some((s) => line.includes(s))) {
      pendingStatus = line.includes("臨櫃已預約")
        ? "臨櫃已預約"
        : line.includes("不同意")
        ? "不同意"
        : "已預約";
      continue;
    }

    if (/星空|網球|球場|Happy Hour/i.test(line) && /[AB]\s*$/i.test(line)) {
      pendingCourt = normalizeCourt(line);
    }
  }

  // Keep the latest occurrence of an identical date/court/time block.
  return Array.from(new Map(results.map((x) => [itemId(x), x])).values());
}

function statusStyle(status) {
  if (status === "不同意") return "border-rose-200 bg-rose-50 text-rose-700";
  if (status === "臨櫃已預約") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function EventPill({ item, onDelete, compact = false }) {
  return (
    <div className={`group relative rounded-lg border px-2 py-1 ${statusStyle(item.status)} ${compact ? "text-xs" : ""}`}>
      <div className="flex items-center justify-between gap-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 font-semibold">
            <span className="rounded bg-white/60 px-1">{item.court}</span>
            {!compact && <span className="text-[11px] font-medium">{item.status}</span>}
          </div>
          {!compact && (
            <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] font-medium">
              <Clock3 className="h-3 w-3" />
              {item.times.join("、")}
            </div>
          )}
          {compact && <div className="text-[10px] font-medium">{item.times.join("、")}</div>}
        </div>
        {!compact && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="rounded p-0.5 opacity-0 transition hover:bg-white/70 group-hover:opacity-100"
            aria-label="刪除預約"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function TennisCalendar() {
  const today = useMemo(() => new Date(), []);
  const todayKey = dateKey(today);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize Firebase authentication and real-time sync
  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeItems;

    // Set up auth state listener
    unsubscribeAuth = onAuthChange((currentUser) => {
      setUser(currentUser);

      // Clean up previous items listener if it exists
      if (unsubscribeItems) {
        unsubscribeItems();
        unsubscribeItems = null;
      }

      if (currentUser) {
        // Listen to Firebase items with real-time updates
        unsubscribeItems = getItems((firebaseItems) => {
          setItems(firebaseItems);
          setLoaded(true);
        });
      } else {
        // Sign in anonymously if possible; fall back to local storage otherwise.
        initializeAuth().catch(() => {
          try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const firstItems = saved ? JSON.parse(saved) : parseSchedule(INITIAL_TEXT);
            setItems(firstItems);
            setLoaded(true);
          } catch {
            setItems(parseSchedule(INITIAL_TEXT));
            setLoaded(true);
          }
        });
      }
    });

    // Cleanup function that properly unsubscribes from both listeners
    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
      if (unsubscribeItems) {
        unsubscribeItems();
      }
    };
  }, []);

  useEffect(() => {
    if (!loaded || user || database) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn("Unable to save fallback items to localStorage", error);
    }
  }, [items, loaded, user]);

  const itemsByDate = useMemo(() => {
    const map = {};
    for (const item of items) {
      if (item.status === "不同意") continue; // Skip rejected items
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    }
    Object.values(map).forEach((list) =>
      list.sort((a, b) => a.times[0].localeCompare(b.times[0]) || a.court.localeCompare(b.court))
    );
    return map;
  }, [items]);

  const calendarDays = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const first = new Date(year, monthIndex, 1);
    const last = new Date(year, monthIndex + 1, 0);
    const startDay = first.getDay();
    const endDay = last.getDay();
    
    const results = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      results.push(null);
    }
    
    // Add all dates in month
    for (let i = 1; i <= last.getDate(); i++) {
      const d = new Date(year, monthIndex, i);
      results.push(d);
    }
    
    // Add empty cells for days after month ends
    for (let i = endDay + 1; i < 7; i++) {
      results.push(null);
    }
    
    return results;
  }, [month]);

  async function addParsed() {
    const parsed = parseSchedule(input);
    if (!parsed.length) {
      setMessage("找不到可辨識的資料。請包含場地、狀態與「租借日期：YYYY-MM-DD | HH:MM」。");
      return;
    }

    const existingKeys = new Set(items.map(itemId));
    const fresh = parsed.filter((x) => !existingKeys.has(itemId(x)));

    if (!database || !user) {
      const nextItems = [
        ...items,
        ...fresh.map((item) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          date: item.date,
          court: item.court,
          status: item.status,
          times: item.times,
          source: item.source,
        })),
      ];
      setItems(nextItems);
      setInput("");
      setMessage(
        fresh.length
          ? `已加入 ${fresh.length} 筆預約${parsed.length > fresh.length ? `，略過 ${parsed.length - fresh.length} 筆重複資料` : ""}（本機暫存）。`
          : "這些資料已存在，未重複加入。"
      );
      return;
    }

    // Wait for all Firebase writes to complete
    try {
      await Promise.all(
        fresh.map((item) =>
          addItem({
            date: item.date,
            court: item.court,
            status: item.status,
            times: item.times,
            source: item.source,
          })
        )
      );
    } catch (error) {
      console.error("Error adding items to Firebase:", error);
      setMessage("新增預約時出錯，請稍後再試。");
      return;
    }

    const first = parsed[0];
    const d = new Date(`${first.date}T00:00:00`);
    setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    setSelectedDate(first.date);
    setInput("");
    setMessage(
      fresh.length
        ? `已加入 ${fresh.length} 筆預約${parsed.length > fresh.length ? `，略過 ${parsed.length - fresh.length} 筆重複資料` : ""}。`
        : "這些資料已存在，未重複加入。"
    );
  }

  function removeItem(id) {
    if (!database || !user) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      setMessage("已刪除預約（本機暫存）。");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    removeItemFromFirebase(id)
      .then(() => {
        setMessage("已刪除預約。");
        setTimeout(() => setMessage(""), 2000);
      })
      .catch((error) => {
        console.error("Error removing item from Firebase:", error);
        setMessage("刪除預約時出錯，請稍後再試。");
      });
  }

  function changeMonth(delta) {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  function goToday() {
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(todayKey);
  }

  const selectedItems = (itemsByDate[selectedDate] || []).filter((x) => x.status !== "不同意");
  const approvedCount = items.filter((x) => x.status !== "不同意").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-sky-50 p-3 text-slate-800 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100">🎾</span>
              Tennis Schedule
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Lane86網球場預約行事曆</h1>
            <p className="mt-1 text-sm text-slate-500">
              今天是 {today.getFullYear()} 年 {today.getMonth() + 1} 月 {today.getDate()} 日，資料會即時同步至 Firebase；若未設定 Firebase，則回退到此瀏覽器本機暫存。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:flex">
            <div className="rounded-2xl bg-emerald-50 px-4 py-2 text-center">
              <div className="text-xs text-emerald-700">有效預約</div>
              <div className="text-xl font-bold text-emerald-800">{approvedCount}</div>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-center">
              <div className="text-xs text-slate-500">全部紀錄</div>
              <div className="text-xl font-bold">{items.length}</div>
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <Card className="overflow-hidden rounded-3xl border-white/80 shadow-sm">
            <CardHeader className="border-b bg-white/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-xl" onClick={() => changeMonth(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="min-w-36 text-center text-xl">
                    {month.getFullYear()} 年 {month.getMonth() + 1} 月
                  </CardTitle>
                  <Button variant="outline" size="icon" className="rounded-xl" onClick={() => changeMonth(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" className="rounded-xl" onClick={goToday}>
                  <CalendarDays className="mr-2 h-4 w-4" />今天
                </Button>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-emerald-200 rounded"></div>
                  <span className="text-slate-600">已預約</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-200 rounded"></div>
                  <span className="text-slate-600">臨櫃預約</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-rose-200 rounded"></div>
                  <span className="text-slate-600">不同意</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid w-full grid-cols-7 border border-slate-200">
                {WEEKDAYS.map((d, i) => (
                  <div
                    key={d}
                    className={`border-b border-r border-slate-200 py-2.5 text-center text-xs font-bold md:text-sm ${
                      i === 0 || i === 6 ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-600"
                    } ${i === 6 ? "border-r-0" : ""}`}
                  >
                    {d}
                  </div>
                ))}
                {calendarDays.map((d, idx) => {
                  if (!d) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className={`min-h-28 border-b border-r border-slate-100 bg-slate-50/80 md:min-h-36 ${
                          (idx + 1) % 7 === 0 ? "border-r-0" : ""
                        }`}
                      />
                    );
                  }

                  const key = dateKey(d);
                  const dayItems = itemsByDate[key] || [];
                  const isToday = key === todayKey;
                  const isSelected = key === selectedDate;
                  const dayOfWeek = d.getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  const isLastCol = (idx + 1) % 7 === 0;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDate(key)}
                      className={`min-h-28 border-b border-r border-slate-100 p-1.5 text-left transition md:min-h-36 md:p-2 ${
                        isLastCol ? "border-r-0" : ""
                      } ${
                        isToday
                          ? "bg-emerald-50 ring-2 ring-inset ring-emerald-600 hover:bg-emerald-100"
                          : isSelected
                          ? "bg-emerald-50/80 ring-2 ring-inset ring-emerald-500"
                          : isWeekend
                          ? "bg-rose-50/40 hover:bg-rose-50"
                          : "bg-white hover:bg-emerald-50/60"
                      }`}
                    >
                      <div className="mb-1.5 flex items-center gap-1">
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                            isToday
                              ? "bg-emerald-600 text-white shadow-sm"
                              : isWeekend
                              ? "text-rose-700"
                              : "text-slate-800"
                          }`}
                        >
                          {d.getDate()}
                        </span>
                        {isToday && (
                          <span className="rounded bg-emerald-600 px-1 py-0.5 text-[10px] font-bold leading-none text-white">
                            今天
                          </span>
                        )}
                      </div>
                      {dayItems.length > 0 && (
                        <div className="space-y-1">
                          {dayItems.slice(0, 2).map((item) => (
                            <EventPill key={item.id} item={item} onDelete={removeItem} compact />
                          ))}
                          {dayItems.length > 2 && (
                            <div className="rounded-lg bg-emerald-100 px-2 py-1 text-center text-xs font-semibold text-emerald-700">
                              +{dayItems.length - 2}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-3xl border-white/80 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardPaste className="h-5 w-5 text-emerald-600" />
                  貼上新增預約
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setMessage("");
                  }}
                  className="min-h-44 resize-y rounded-2xl"
                  placeholder={`星空球場網球 B
已預約
租借日期：2026-08-13 | 18:00,19:00`}
                />
                <Button onClick={addParsed} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />解析並加入行事曆
                </Button>
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex gap-2 rounded-xl p-3 text-sm ${message.startsWith("找不到") ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}
                    >
                      {message.startsWith("找不到") ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
                      {message}
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-xs leading-5 text-slate-500">
                  可一次貼上多筆。系統會辨識 A／B 場、預約狀態、日期與多個時段，並略過完全相同的重複紀錄。
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/80 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{selectedDate} 詳細內容</span>
                  <Badge variant="secondary">{selectedItems.length} 筆</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedItems.length ? (
                  <div className="space-y-2">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <EventPill item={item} onDelete={removeItem} />
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0 rounded-xl text-slate-400 hover:text-rose-600" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-slate-400">
                    <MapPin className="mx-auto mb-2 h-6 w-6" />
                    這一天目前沒有預約
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="mx-auto mt-4 max-w-7xl pb-3">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
          <span>Source:</span>
          <a
            href={SOURCE_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-emerald-700 underline-offset-4 hover:text-emerald-800 hover:underline"
          >
            github.com/evan199893/Tennis-Court-Schedule
          </a>
        </div>
      </footer>
    </div>
  );
}
