import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import EventsSection from "../components/EventSection";
import SearchBar from "../components/SearchBar";
import { useApiRequest } from "@/hooks/useApiRequest";
import { getAllEvents } from "@/api/apiService";
import { 
  getEventStatus, 
  searchEvents, 
  filterEventsByStatus 
} from "../utils/eventUtils";

export default function ManageEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const { request, loading } = useApiRequest({ enableToast: false });

  useEffect(() => {
    async function fetch() {
      const response = await request(getAllEvents, "");
      if (response && response.events) {
        setEvents(response.events);
      }
    }

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Categorize events by status
  const categorizedEvents = useMemo(() => {
    const categorized = {
      Live: [],
      Upcoming: [],
      Past: []
    };

    events.forEach(event => {
      const status = getEventStatus(event.date);
      categorized[status].push(event);
    });

    return categorized;
  }, [events]);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Apply search
    if (searchTerm) {
      filtered = searchEvents(filtered, searchTerm);
    }

    // Apply status filter
    if (selectedStatus !== "All") {
      filtered = filterEventsByStatus(filtered, selectedStatus);
    }

    return filtered;
  }, [events, searchTerm, selectedStatus]);

  // Get filtered categorized events
  const filteredCategorizedEvents = useMemo(() => {
    const categorized = {
      Live: [],
      Upcoming: [],
      Past: []
    };

    filteredEvents.forEach(event => {
      const status = getEventStatus(event.date);
      categorized[status].push(event);
    });

    return categorized;
  }, [filteredEvents]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const statusFilters = [
    { label: "All Events", value: "All", count: events.length },
    { label: "Live", value: "Live", count: categorizedEvents.Live.length },
    { label: "Upcoming", value: "Upcoming", count: categorizedEvents.Upcoming.length },
    { label: "Past", value: "Past", count: categorizedEvents.Past.length }
  ];

  return (
    <PageLayout title="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 mt-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Event Management
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover, manage, and organize all your events in one place. 
            Find events by name, date, or status with our smart search.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search by event name, date (YYYY-MM-DD), or status (Live/Upcoming/Past)..."
        />

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedStatus === filter.value
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50"
              }`}
            >
              {filter.label}
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-700/50">
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-white transition ease-in-out duration-150">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading events...
            </div>
          </div>
        )}

                 {/* Events Display */}
         {!loading && (
           <>
             {/* Show filtered results when search or filter is active */}
             {(searchTerm || selectedStatus !== "All") ? (
               <>
                 {/* Search/Filter Results Summary */}
                 <div className="mb-6 text-center">
                   <p className="text-gray-400">
                     {searchTerm && selectedStatus !== "All" ? (
                       <>Found <span className="text-blue-400 font-semibold">{filteredEvents.length}</span> events matching "{searchTerm}" in {selectedStatus} events</>
                     ) : searchTerm ? (
                       <>Found <span className="text-blue-400 font-semibold">{filteredEvents.length}</span> events matching "{searchTerm}"</>
                     ) : (
                       <>Showing <span className="text-blue-400 font-semibold">{filteredEvents.length}</span> {selectedStatus} events</>
                     )}
                   </p>
                 </div>

                 {/* Single Filtered Results Section */}
                 <EventsSection
                   title={searchTerm ? "Search Results" : `${selectedStatus} Events`}
                   events={filteredEvents}
                   navigate={navigate}
                   emptyMessage={searchTerm ? `No events found matching "${searchTerm}"` : `No ${selectedStatus.toLowerCase()} events found`}
                 />
               </>
             ) : (
               <>
                 {/* Show categorized sections when no filters are active */}
                 {/* Live Events */}
                 <EventsSection
                   title="Live Events"
                   events={filteredCategorizedEvents.Live}
                   navigate={navigate}
                   emptyMessage="No live events found"
                 />

                 {/* Upcoming Events */}
                 <EventsSection
                   title="Upcoming Events"
                   events={filteredCategorizedEvents.Upcoming}
                   navigate={navigate}
                   emptyMessage="No upcoming events found"
                 />

                 {/* Past Events */}
                 <EventsSection
                   title="Past Events"
                   events={filteredCategorizedEvents.Past}
                   navigate={navigate}
                   emptyMessage="No past events found"
                 />

                 {/* No Results */}
                 {filteredEvents.length === 0 && (
                   <div className="text-center py-16">
                     <div className="text-gray-400 text-xl mb-4">No events found</div>
                     <p className="text-gray-500">Try adjusting your search or filters</p>
                   </div>
                 )}
               </>
             )}
           </>
         )}
      </div>
    </PageLayout>
  );
}
