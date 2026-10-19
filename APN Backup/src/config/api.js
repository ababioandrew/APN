export const API_BASE_URL = "https://apn-data.vercel.app";
export const EMAIL_API_URL = "";

export const API_ENDPOINTS = {
  members: `${API_BASE_URL}/api/json/members`,
  memberById: (id) => `${API_BASE_URL}/api/json/members/${id}`,
  memberSearch: (q) =>
    `${API_BASE_URL}/api/json/members/search?q=${encodeURIComponent(q)}`,
  health: `${API_BASE_URL}/health`,
  sendEnquiry: `${EMAIL_API_URL}/api/send-enquiry`,
};

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
      throw new Error(
        data?.error || data?.message || `Request failed (${response.status})`
      );
    }

    return data;
  } catch (error) {
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      throw new Error(
        "Cannot connect to the API server. Please check your connection."
      );
    }
    throw new Error(error.message || "An unknown error occurred");
  }
};

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

export const membersApi = {
  getAll: async () => {
    const result = await fetchJSON(API_ENDPOINTS.members);
    let membersData = [];
    if (Array.isArray(result)) membersData = result;
    else if (result.members) membersData = result.members;
    else if (result.data) membersData = result.data;
    else if (result.records) membersData = result.records;
    return membersData.map(normalizeMember);
  },

  getById: async (id) => {
    const result = await fetchJSON(API_ENDPOINTS.memberById(id));
    return normalizeMember(result.member || result.data || result);
  },

  create: async (payload) =>
    fetchJSON(API_ENDPOINTS.members, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: async (id, payload) =>
    fetchJSON(API_ENDPOINTS.memberById(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: async (id) =>
    fetchJSON(API_ENDPOINTS.memberById(id), {
      method: "DELETE",
    }),

  getBirthdays: async () => {
    const members = await membersApi.getAll();
    const now = new Date();
    const currentMonth = now.getMonth();

    const birthdays = members
      .filter((m) => {
        if (!m.dateOfBirth) return false;
        return new Date(m.dateOfBirth).getMonth() === currentMonth;
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
        return (
          new Date(a.dateOfBirth).getDate() -
          new Date(b.dateOfBirth).getDate()
        );
      });

    return {
      month: now.toLocaleString("en-US", { month: "long" }),
      count: birthdays.length,
      birthdays,
    };
  },
};