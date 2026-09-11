// =====================================================
// API CONFIGURATION
// =====================================================

// External JSON API (absolute — different domain)
export const API_BASE_URL = "https://apn-data.vercel.app";

// Email API (relative — same domain on Vercel, proxied locally)
export const EMAIL_API_URL = "";

// =====================================================
// API ENDPOINTS
// =====================================================

export const API_ENDPOINTS = {
  // Members CRUD via external JSON API
  members: `${API_BASE_URL}/api/json/members`,
  memberById: (id) => `${API_BASE_URL}/api/json/members/${id}`,
  memberSearch: (query) =>
    `${API_BASE_URL}/api/json/members/search?q=${encodeURIComponent(query)}`,

  // Health
  health: `${API_BASE_URL}/health`,

  // Email (relative — routes to server.js / api/index.js)
  sendEnquiry: `${EMAIL_API_URL}/api/send-enquiry`,
};

// =====================================================
// HELPER: fetchJSON with error handling
// =====================================================

export const fetchJSON = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 200));
      throw new Error(
        `Expected JSON but received ${contentType}. Status: ${response.status}`
      );
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data?.error ||
        data?.message ||
        `Request failed (${response.status})`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      throw new Error(
        `Cannot connect to the API server. Please check your connection.`
      );
    }
    throw new Error(error.message || "An unknown error occurred");
  }
};

// =====================================================
// NORMALIZE MEMBER DATA
// The external JSON API may return different field names.
// This normalizes them into a consistent shape.
// =====================================================

export const normalizeMember = (member) => ({
  ...member,
  id: member.id ?? member._id ?? null,
  fullName: member.fullName ?? member.fullname ?? member.name ?? "",
  gender: member.gender ?? "",
  location: member.location ?? "",
  dateOfBirth: member.dateOfBirth ?? member.dateofbirth ?? null,
  dateOfEntry: member.dateOfEntry ?? member.dateofentry ?? null,
  contacts: member.contacts ?? member.contact ?? "",
  remarks: member.remarks ?? "",
  createdAt: member.createdAt ?? member.createdat ?? null,
  updatedAt: member.updatedAt ?? member.updatedat ?? null,
});

// =====================================================
// MEMBERS API
// =====================================================

export const membersApi = {
  // GET all members
  getAll: async () => {
    const result = await fetchJSON(API_ENDPOINTS.members);

    // Handle different response shapes
    let membersData = [];
    if (Array.isArray(result)) {
      membersData = result;
    } else if (result.members) {
      membersData = result.members;
    } else if (result.data) {
      membersData = result.data;
    } else if (result.records) {
      membersData = result.records;
    }

    return membersData.map(normalizeMember);
  },

  // GET single member
  getById: async (id) => {
    const result = await fetchJSON(API_ENDPOINTS.memberById(id));
    const member = result.member || result.data || result;
    return normalizeMember(member);
  },

  // CREATE member
  create: async (payload) => {
    return fetchJSON(API_ENDPOINTS.members, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // UPDATE member
  update: async (id, payload) => {
    return fetchJSON(API_ENDPOINTS.memberById(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // DELETE member
  delete: async (id) => {
    return fetchJSON(API_ENDPOINTS.memberById(id), {
      method: "DELETE",
    });
  },

  // GET birthdays for current month
  getBirthdays: async () => {
    const members = await membersApi.getAll();

    const now = new Date();
    const currentMonth = now.getMonth();

    const birthdays = members
      .filter((m) => {
        if (!m.dateOfBirth) return false;
        const d = new Date(m.dateOfBirth);
        return d.getMonth() === currentMonth;
      })
      .map((m) => {
        const dob = new Date(m.dateOfBirth);
        const age =
          now.getFullYear() -
          dob.getFullYear() -
          (now <
          new Date(now.getFullYear(), dob.getMonth(), dob.getDate())
            ? 1
            : 0);
        return { ...m, age };
      })
      .sort((a, b) => {
        const da = new Date(a.dateOfBirth).getDate();
        const db = new Date(b.dateOfBirth).getDate();
        return da - db;
      });

    return {
      month: now.toLocaleString("en-US", { month: "long" }),
      count: birthdays.length,
      birthdays,
    };
  },
};