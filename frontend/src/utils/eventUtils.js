// Event categorization and utility functions

export const getEventStatus = (eventDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const eventDateObj = new Date(eventDate);
  eventDateObj.setHours(0, 0, 0, 0); // Reset time to start of day
  
  if (eventDateObj < today) {
    return 'Past';
  } else if (eventDateObj.getTime() === today.getTime()) {
    return 'Live';
  } else {
    return 'Upcoming';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Live':
      return 'bg-red-500';
    case 'Upcoming':
      return 'bg-green-500';
    case 'Past':
      return 'bg-gray-500';
    default:
      return 'bg-blue-500';
  }
};

export const getStatusTextColor = (status) => {
  switch (status) {
    case 'Live':
      return 'text-red-500';
    case 'Upcoming':
      return 'text-green-500';
    case 'Past':
      return 'text-gray-400';
    default:
      return 'text-blue-500';
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Smart search function
export const searchEvents = (events, searchTerm) => {
  if (!searchTerm.trim()) return events;
  
  const term = searchTerm.toLowerCase().trim();
  
  return events.filter(event => {
    // Check if it's a date search (YYYY-MM-DD or MM/DD/YYYY format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (dateRegex.test(term)) {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      const searchDate = term.includes('/') 
        ? new Date(term).toISOString().split('T')[0]
        : term;
      return eventDate === searchDate;
    }
    
    // Check if it's a status search
    const statusTerms = ['past', 'live', 'upcoming'];
    if (statusTerms.includes(term)) {
      const eventStatus = getEventStatus(event.date);
      return eventStatus.toLowerCase() === term;
    }
    
    // Default to name search
    return event.name.toLowerCase().includes(term) ||
           (event.description && event.description.toLowerCase().includes(term)) ||
           (event.venue && event.venue.toLowerCase().includes(term));
  });
};

// Filter events by status
export const filterEventsByStatus = (events, status) => {
  if (!status || status === 'All') return events;
  return events.filter(event => getEventStatus(event.date) === status);
};
