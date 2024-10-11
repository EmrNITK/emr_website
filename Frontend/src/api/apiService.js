const API_BASE_URL = 'http://your-api-url.com'; // Replace with your actual API URL

// User Registration
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// User Login
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// Retrieve all Teams
export const fetchTeams = async () => {
  const response = await fetch(`${API_BASE_URL}/teams`);
  return handleResponse(response);
};

// Create a new Team
export const createTeam = async (teamData) => {
  const response = await fetch(`${API_BASE_URL}/teams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(teamData),
  });
  return handleResponse(response);
};

// Add members to a Team
export const addMemberToTeam = async (teamId, memberData) => {
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberData),
  });
  return handleResponse(response);
};

// Update status of a Team member
export const updateMemberStatus = async (teamId, memberId, status) => {
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members/${memberId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

// Send invitations to members
export const sendInvitation = async (teamId, inviteData) => {
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/invites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inviteData),
  });
  return handleResponse(response);
};

// Accept or Reject Invitation
export const respondToInvitation = async (teamId, inviteId, userResponse) => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/invites/${inviteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response: userResponse }), // Use the renamed variable here
    });
    return handleResponse(response);
  };

// Request to join a Team
export const joinTeam = async (teamId) => {
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/join`, {
    method: 'POST',
  });
  return handleResponse(response);
};

// Approve or Reject Join Request
export const respondToJoinRequest = async (teamId, joinRequestId, userResponse) => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/join/${joinRequestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response: userResponse }), // Use the renamed variable here
    });
    return handleResponse(response);
  };

// Handle API Response
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return await response.json();
};

// User Verification
export const verifyUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/verify`, {
    method: 'POST',
  });
  return handleResponse(response);
};

// Admin approve/reject verification
export const handleVerificationRequest = async (userId, status) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/verify`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

// List all verified users
export const fetchUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return handleResponse(response);
  };
  
  // Retrieve user details
  export const fetchUserDetails = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    return handleResponse(response);
  };