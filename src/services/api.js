try {
  const { data } = await axios.request(options);
  console.log(data);
} catch (error) {
  console.error(error);
}

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
};

export const api = {
  // Announcements
  getAnnouncements: () => request("/api/announcements"),
  createAnnouncement: (payload, password) =>
    request("/api/announcements", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: JSON.stringify(payload),
    }),
  deleteAnnouncement: (id, password) =>
    request(`/api/announcements/${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": password },
    }),
  verifyAdmin: (password) =>
    request("/api/admin/verify", {
      method: "POST",
      headers: { "x-admin-password": password },
    }),

  // Members + attendance
  getMembers: () => request("/api/members"),
  getAttendance: (date) => request(`/api/attendance?date=${date}`),
  saveAttendance: (date, presentIds, password) =>
    request("/api/attendance", {
      method: "PUT",
      headers: { "x-admin-password": password },
      body: JSON.stringify({ date, presentIds }),
    }),
  getAbsentees: (date) => request(`/api/absentees?date=${date}`),

  // SMS
  previewSms: (date) =>
    request("/api/sms/preview", {
      method: "POST",
      body: JSON.stringify({ date }),
    }),
  sendSms: (date, password) =>
    request("/api/sms/send-absentees", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: JSON.stringify({ date }),
    }),
};