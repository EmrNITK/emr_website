const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Replace with your actual API URL

// Handle API Response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return await response.json();
};

// User Registration
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// User Login
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return handleResponse(response);
};

// Retrieve all Teams
export const getAllTeams = async () => {
  const response = await fetch(`${API_BASE_URL}/api/teams/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
  return handleResponse(response);
};

export const getTeamById = async (teamId) => {
  const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });

  return handleResponse(response);
};

// Create a new Team
export const createTeam = async (teamName) => {
  const response = await fetch(`${API_BASE_URL}/api/teams/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ name: teamName }),
  });
  return handleResponse(response);
};

// Add members to a Team
export const addMemberToTeam = async (teamId, memberData) => {
  const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(memberData),
  });
  return handleResponse(response);
};

// Update status of a Team member
export const updateMemberStatus = async (teamId, memberId, status) => {
  const response = await fetch(
    `${API_BASE_URL}/api/teams/${teamId}/members/${memberId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );
  return handleResponse(response);
};

// Send invitations to members
export const sendInvitation = async (teamId, members) => {

  const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ members }),
  });
  return handleResponse(response);
};

// Accept or Reject Invitation
export const respondToInvitation = async (teamId, inviteId, userResponse) => {
  const response = await fetch(
    `${API_BASE_URL}/api/teams/${teamId}/invites/${inviteId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ response: userResponse }), // Use the renamed variable here
    }
  );
  return handleResponse(response);
};

// Request to join a Team
export const joinTeam = async (teamId) => {
  const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/join`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
  return handleResponse(response);
};

// Approve or Reject Join Request
export const respondToJoinRequest = async (
  teamId,
  joinRequestId,
  userResponse
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/teams/${teamId}/join/${joinRequestId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ response: userResponse }), // Use the renamed variable here
    }
  );
  return handleResponse(response);
};



// User Verification
export const verifyUser = async (transactionId) => {
  const response = await fetch(`${API_BASE_URL}/api/users/verify`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ transactionId }), // Send transactionId in the request body
  });
  return handleResponse(response);
};

// Admin approve/reject verification
// api.js (or wherever you keep your API functions)

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    // Handle the response
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the updated user data
  } catch (error) {
    console.error("Failed to fetch updated user:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};

// List all verified users
export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
  return handleResponse(response);
};


export const removeMember = async (teamId, memberId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/teams/${teamId}/members/${memberId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      }
    );

    // Handle the response
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the updated user data
  } catch (error) {
    console.error("Failed to fetch updated user:", error);
    throw error; // Re-throw the error for further handling if needed
  }
};

export const sendOTP = async (email) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot_password/otp`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
};

export const verifyOTP = async (email, otp) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot_password/verify`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });
  console.log("response", response);
  return handleResponse(response);
};

export const changePassword = async (email, newPassword) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot_password/new`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${localStorage.getItem('tempOtpJwt')}`
    },
    body: JSON.stringify({ email, newPassword }),
  });
  console.log("response", response);
  return handleResponse(response);
};

export const changePasswordUser = async (passwordData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/change-password`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(passwordData),
    }
  );
  console.log("response", response);
  return handleResponse(response);
};

