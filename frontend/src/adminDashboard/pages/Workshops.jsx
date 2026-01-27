import ResourceManager from '../components/ResourceManager';
import React, { useState, useEffect } from 'react';
const Workshops = () => {
  const fields = [
    { name: 'title', label: 'Title' },
    { name: 'subtitle', label: 'Subtitle' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'posterImg', label: 'Poster Image', type: 'image' },
    { name: 'details', label: 'Event Details', type: 'nested', subFields: ['date', 'time', 'venue', 'prereq'] },
    { name: 'section', label: 'Section', type: 'select', options: ['upcoming', 'all'] },
    { name: 'regLink', label: 'Registration Link' }
  ];

  return <ResourceManager title="Workshops" endpoint="workshops" fields={fields} />;
};

export default Workshops;