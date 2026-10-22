import { useMemo, useState } from "react";
import "./AcademicCalendar.css";

type Category = "Academic" | "Examination" | "Results" | "Vacation" | "Deadline";
type AcademicEvent = {
  id: string;
  title: string;
  start: string; // YYYY-MM-DD
  end?: string;
  category: Category;
  description?: string;
};

const events: AcademicEvent[] = [
  { id: "sem1-start", title: "Semester I registration / classes commence", start: "2025-06-30", category: "Academic", description: "Semester I commencement date listed in the supplied A.Y. 2025–26 calendar." },
  { id: "mid1-s1", title: "Mid Test I", start: "2025-08-05", end: "2025-08-07", category: "Examination", description: "Semester I dates shown in the calendar summary table." },
  { id: "mid1-result-s1", title: "Mid Test I result announcement", start: "2025-08-18", category: "Results" },
  { id: "mid2-s1", title: "Mid Test II", start: "2025-09-25", end: "2025-09-27", category: "Examination" },
  { id: "mid2-result-s1", title: "Mid Test II result announcement", start: "2025-10-13", category: "Results" },
  { id: "mid3-s1", title: "Mid Test III", start: "2025-11-05", end: "2025-11-07", category: "Examination" },
  { id: "instruction-close-s1", title: "Instruction closing day", start: "2025-11-04", category: "Deadline" },
  { id: "mid3-result-s1", title: "Mid Test III result announcement", start: "2025-11-15", category: "Results" },
  { id: "est-s1", title: "EST examinations", start: "2025-11-17", end: "2025-11-29", category: "Examination" },
  { id: "result-s1", title: "End Semester result announcement", start: "2025-12-30", category: "Results" },
  { id: "sem2-start", title: "Semester II registration / classes commence", start: "2025-12-01", category: "Academic" },
  { id: "mid1-s2", title: "Mid Test I", start: "2026-01-07", end: "2026-01-09", category: "Examination" },
  { id: "mid1-result-s2", title: "Mid Test I result announcement", start: "2026-01-24", category: "Results" },
  { id: "mid2-s2", title: "Mid Test II", start: "2026-02-19", end: "2026-02-21", category: "Examination" },
  { id: "mid2-result-s2", title: "Mid Test II result announcement", start: "2026-03-02", category: "Results" },
  { id: "mid3-s2", title: "Mid Test III", start: "2026-04-08", end: "2026-04-10", category: "Examination" },
  { id: "instruction-close-s2", title: "Instruction closing day", start: "2026-04-07", category: "Deadline" },
  { id: "mid3-result-s2", title: "Mid Test III result announcement", start: "2026-04-18", category: "Results" },
  { id: "est-s2", title: "EST examinations", start: "2026-04-17", end: "2026-04-30", category: "Examination", description: "Date range as printed in the summary table. Confirm any overlap/details with the official department notice." },
  { id: "end-result-s2", title: "End Semester result announcement", start: "2026-06-15", category: "Results" },
  { id: "pongal", title: "Pongal vacation", start: "2026-01-12", end: "2026-01-17", category: "Vacation", description: "Vacation block shown in the Semester II calendar grid." },
  { id: "dussehra", title: "Dussehra vacation", start: "2025-09-29", end: "2025-10-05", category: "Vacation", description: "Vacation block shown across the Semester I calendar grid; verify exact dates with the official notice." },
  { id: "lab-s1", title: "Lab examinations (Semester I)", start: "2025-11-10", end: "2025-11-15", category: "Examination", description: "The Semester I grid labels this period as Lab Exams." },
  { id: "lab-s2", title: "Lab examinations (Semester II)", start: "2026-04-13", end: "2026-04-18", category: "Examination", description: "The Semester II grid labels this period as Lab Exams." },

  // A.Y. 2026–27 — Odd semester
  { id: "ay2627-sem1-start", title: "Semester I registration / classes commence", start: "2026-06-29", category: "Academic" },
  { id: "ay2627-mid1-s1", title: "Mid Test I — Odd Semester", start: "2026-08-05", end: "2026-08-07", category: "Examination" },
  { id: "ay2627-mid1-result-s1", title: "Mid Test I result announcement — Odd Semester", start: "2026-08-17", category: "Results" },
  { id: "ay2627-mid2-s1", title: "Mid Test II — Odd Semester", start: "2026-09-24", end: "2026-09-26", category: "Examination" },
  { id: "ay2627-mid2-result-s1", title: "Mid Test II result announcement — Odd Semester", start: "2026-10-05", category: "Results", description: "Summary table says 5 October 2026; the calendar grid appears to show a later result-announcement period. Confirm with the department." },
  { id: "ay2627-instruction-close-s1", title: "Instruction closing day — Odd Semester", start: "2026-11-04", category: "Deadline" },
  { id: "ay2627-mid3-s1", title: "Mid Test III — Odd Semester", start: "2026-11-05", end: "2026-11-07", category: "Examination" },
  { id: "ay2627-lab-s1", title: "Lab examinations — Odd Semester", start: "2026-11-09", end: "2026-11-13", category: "Examination" },
  { id: "ay2627-mid3-result-s1", title: "Mid Test III result announcement — Odd Semester", start: "2026-11-14", category: "Results" },
  { id: "ay2627-est-s1", title: "End Semester (EST) examinations — Odd Semester", start: "2026-11-16", end: "2026-11-28", category: "Examination" },
  { id: "ay2627-result-s1", title: "End Semester result announcement — Odd Semester", start: "2026-12-30", category: "Results" },
  { id: "ay2627-supplementary-s1", title: "Supplementary examinations", start: "2027-02-01", end: "2027-02-12", category: "Examination" },

  // A.Y. 2026–27 — Even semester
  { id: "ay2627-sem2-start", title: "Semester II registration / classes commence", start: "2026-12-01", category: "Academic" },
  { id: "ay2627-mid1-s2", title: "Mid Test I — Even Semester", start: "2027-01-06", end: "2027-01-08", category: "Examination" },
  { id: "ay2627-mid1-result-s2", title: "Mid Test I result announcement — Even Semester", start: "2027-01-25", category: "Results" },
  { id: "ay2627-mid2-s2", title: "Mid Test II — Even Semester", start: "2027-02-18", end: "2027-02-20", category: "Examination" },
  { id: "ay2627-mid2-result-s2", title: "Mid Test II result announcement — Even Semester", start: "2027-03-27", category: "Results" },
  { id: "ay2627-instruction-close-s2", title: "Instruction closing day — Even Semester", start: "2027-04-05", category: "Deadline" },
  { id: "ay2627-mid3-s2", title: "Mid Test III — Even Semester", start: "2027-04-06", end: "2027-04-09", category: "Examination" },
  { id: "ay2627-lab-s2", title: "Lab examinations — Even Semester", start: "2027-04-12", end: "2027-04-17", category: "Examination" },
  { id: "ay2627-mid3-result-s2", title: "Mid Test III result announcement — Even Semester", start: "2027-04-17", category: "Results" },
  { id: "ay2627-est-s2", title: "End Semester (EST) examinations — Even Semester", start: "2027-04-19", end: "2027-04-30", category: "Examination" },
  { id: "ay2627-result-s2", title: "End Semester result announcement — Even Semester", start: "2027-06-15", category: "Results" },
  { id: "ay2627-supplementary-s2", title: "Supplementary examinations", start: "2027-06-01", end: "2027-06-12", category: "Examination" },

  // Holidays and vacations shown in the supplied calendar
  { id: "ay2627-independence-day", title: "Independence Day", start: "2026-08-15", category: "Vacation" },
  { id: "ay2627-varalakshmi", title: "Varalakshmi Vratham", start: "2026-08-21", category: "Vacation" },
  { id: "ay2627-krishna-janmashtami", title: "Sri Krishna Janmashtami", start: "2026-09-04", category: "Vacation" },
  { id: "ay2627-vinayaka-chavithi", title: "Vinayaka Chavithi", start: "2026-09-14", category: "Vacation" },
  { id: "ay2627-gandhi-jayanti", title: "Gandhi Jayanti", start: "2026-10-02", category: "Vacation" },
  { id: "ay2627-dussehra-vacation", title: "Dussehra vacation", start: "2026-10-11", end: "2026-10-21", category: "Vacation", description: "The grid shows 19–24 October near the Mid Test II result announcement; confirm the exact vacation dates with the department." },
  { id: "ay2627-christmas", title: "Christmas", start: "2026-12-25", category: "Vacation" },
  { id: "ay2627-pongal-vacation", title: "Pongal vacation", start: "2027-01-11", end: "2027-01-16", category: "Vacation" },
  { id: "ay2627-republic-day", title: "Republic Day", start: "2027-01-26", category: "Vacation" },
  { id: "ay2627-maha-shivaratri", title: "Maha Shivaratri", start: "2027-03-06", category: "Vacation" },
  { id: "ay2627-ramzan", title: "Ramzan", start: "2027-03-10", category: "Vacation" },
  { id: "ay2627-holi", title: "Holi", start: "2027-03-22", category: "Vacation" },
  { id: "ay2627-good-friday", title: "Good Friday", start: "2027-03-26", category: "Vacation" },
  { id: "ay2627-ambedkar-jayanti", title: "Ambedkar Jayanti", start: "2027-04-14", category: "Vacation" },
  { id: "ay2627-rama-navami", title: "Rama Navami", start: "2027-04-15", category: "Vacation" },
];

const categories: Category[] = ["Academic", "Examination", "Results", "Vacation", "Deadline"];
const categoryClass: Record<Category, string> = {
  Academic: "academic", Examination: "exam", Results: "results", Vacation: "vacation", Deadline: "deadline",
};

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseISO = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const monthLabel = (date: Date) => date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
const formatDate = (value: string) => parseISO(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const overlaps = (event: AcademicEvent, day: string) => event.start <= day && (event.end ?? event.start) >= day;

export default function AcademicCalendar() {
  const [month, setMonth] = useState(() => new Date(2025, 5, 1));
  const [activeCategories, setActiveCategories] = useState<Category[]>(categories);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(null);

  const visibleEvents = useMemo(
    () => events.filter((event) => activeCategories.includes(event.category)),
    [activeCategories],
  );

  const calendarDays = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - mondayOffset);
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [month]);

  const selectedDayEvents = selectedDay
    ? visibleEvents.filter((event) => overlaps(event, selectedDay))
    : [];
  const upcoming = useMemo(() => {
    const today = iso(new Date());
    return visibleEvents
      .filter((event) => (event.end ?? event.start) >= today)
      .sort((a, b) => a.start.localeCompare(b.start))
      .slice(0, 5);
  }, [visibleEvents]);

  const changeMonth = (delta: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
    setSelectedDay(null);
    setSelectedEvent(null);
  };
  const toggleCategory = (category: Category) => {
    setActiveCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category],
    );
  };

  return (
    <main className="academic-calendar-page">
      <header className="calendar-heading">
        <div>
          <div className="calendar-eyebrow"><span className="eyebrow-dot" /> ECE CAMPUS HUB</div>
          <h1>Academic Calendar</h1>
          <p>Keep your semester, exams, and important dates in one clear view.</p>
        </div>
        <div className="academic-year-pill"><span className="year-pill-icon">✦</span> Academic Year 2025–26</div>
      </header>

      <section className="calendar-layout">
        <div className="calendar-main-card">
          <div className="month-toolbar">
            <div className="month-title-wrap">
              <span className="month-kicker">YOUR SCHEDULE</span>
              <h2>{monthLabel(month)}</h2>
            </div>
            <div className="month-actions">
              <button className="today-button" onClick={() => { const now = new Date(); setMonth(new Date(now.getFullYear(), now.getMonth(), 1)); setSelectedDay(iso(now)); }}>Today</button>
              <button className="month-arrow" aria-label="Previous month" onClick={() => changeMonth(-1)}>‹</button>
              <button className="month-arrow" aria-label="Next month" onClick={() => changeMonth(1)}>›</button>
            </div>
          </div>

          <div className="calendar-grid">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div className="weekday" key={day}>{day}</div>
            ))}
            {calendarDays.map((day) => {
              const dayISO = iso(day);
              const inMonth = day.getMonth() === month.getMonth();
              const dayEvents = visibleEvents.filter((event) => overlaps(event, dayISO));
              const selected = selectedDay === dayISO;
              const isToday = dayISO === iso(new Date());
              return (
                <button
                  key={dayISO}
                  className={`calendar-day ${inMonth ? "" : "outside-month"} ${selected ? "selected-day" : ""} ${isToday ? "is-today" : ""} ${dayEvents.length ? "has-events" : ""}`}
                  onClick={() => { setSelectedDay(dayISO); setSelectedEvent(dayEvents[0] ?? null); }}
                  aria-label={`${formatDate(dayISO)}${dayEvents.length ? `, ${dayEvents.length} events` : ""}`}
                >
                  <span className="day-number">{day.getDate()}</span>
                  <span className="day-markers">
                    {dayEvents.slice(0, 3).map((event) => <i key={event.id} className={`event-dot ${categoryClass[event.category]}`} title={event.title} />)}
                  </span>
                  {dayEvents.length > 0 && <span className="day-event-count">{dayEvents.length}</span>}
                </button>
              );
            })}
          </div>

          <div className="calendar-legend">
            {categories.map((category) => (
              <span className={`legend-item ${activeCategories.includes(category) ? "" : "legend-muted"}`} key={category}>
                <i className={`event-dot ${categoryClass[category]}`} />{category}
              </span>
            ))}
          </div>
        </div>

        <aside className="calendar-side">
          <section className="side-card filter-card">
            <div className="side-card-heading"><div><span className="side-kicker">CUSTOM VIEW</span><h3>Filter events</h3></div><span className="filter-symbol">☷</span></div>
            <p className="side-subtitle">Choose what appears on your calendar.</p>
            <div className="filter-options">
              {categories.map((category) => (
                <label className="filter-option" key={category}>
                  <input type="checkbox" checked={activeCategories.includes(category)} onChange={() => toggleCategory(category)} />
                  <i className={`event-dot ${categoryClass[category]}`} />
                  <span>{category}</span>
                </label>
              ))}
            </div>
            <button className="reset-filter" onClick={() => setActiveCategories(categories)}>Reset filters</button>
          </section>

          <section className="side-card upcoming-card">
            <div className="side-card-heading"><div><span className="side-kicker">DON'T MISS</span><h3>Upcoming events</h3></div><span className="upcoming-count">{upcoming.length}</span></div>
            {upcoming.length ? <div className="upcoming-list">
              {upcoming.map((event) => (
                <button className="upcoming-event" key={event.id} onClick={() => { setSelectedDay(event.start); setSelectedEvent(event); setMonth(new Date(parseISO(event.start).getFullYear(), parseISO(event.start).getMonth(), 1)); }}>
                  <span className={`upcoming-date ${categoryClass[event.category]}`}><b>{parseISO(event.start).getDate()}</b><small>{parseISO(event.start).toLocaleDateString("en-IN", { month: "short" })}</small></span>
                  <span className="upcoming-copy"><strong>{event.title}</strong><small>{event.end ? `${formatDate(event.start)} – ${formatDate(event.end)}` : formatDate(event.start)}</small></span>
                  <span className="upcoming-chevron">›</span>
                </button>
              ))}
            </div> : <p className="empty-state">No upcoming events match these filters.</p>}
          </section>
        </aside>
      </section>

      <section className="event-details-card">
        <div className="details-heading">
          <div><span className="side-kicker">EVENT DETAILS</span><h3>{selectedDay ? formatDate(selectedDay) : "Select a date"}</h3></div>
          {selectedDay && <span className="details-count">{selectedDayEvents.length} {selectedDayEvents.length === 1 ? "event" : "events"}</span>}
        </div>
        {!selectedDay ? (
          <p className="empty-state">Select a date on the calendar or choose an event from the upcoming list to see its details.</p>
        ) : selectedDayEvents.length === 0 ? (
          <p className="empty-state">No listed events on this date. Enjoy the breathing room.</p>
        ) : (
          <div className="details-event-list">
            {selectedDayEvents.map((event) => (
              <button className={`detail-event ${selectedEvent?.id === event.id ? "detail-event-active" : ""}`} key={event.id} onClick={() => setSelectedEvent(event)}>
                <span className={`detail-category-bar ${categoryClass[event.category]}`} />
                <span className="detail-event-copy"><strong>{event.title}</strong><small>{event.category} · {formatDate(event.start)}{event.end ? ` – ${formatDate(event.end)}` : ""}</small>{selectedEvent?.id === event.id && event.description && <p>{event.description}</p>}</span>
                <span className="detail-chevron">›</span>
              </button>
            ))}
          </div>
        )}
      </section>
      <p className="calendar-source-note">Dates are transcribed from the supplied A.Y. 2025–26 calendar. Please confirm ambiguous vacation blocks and any conflicting dates against the official department notice. This page does not assume a new/current academic year.</p>
    </main>
  );
}
