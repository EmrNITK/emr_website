import React, { useState, useMemo, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ReactSortable } from "react-sortablejs";
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import {
    PlusCircle, Trash2, AlignLeft, Type, CheckSquare,
    CircleDot, Image as ImageIcon, Minus, Moon, Sun, GripVertical,
    GripHorizontal, ChevronDown, Calendar, Clock, UploadCloud,
    SlidersHorizontal, LayoutList, X, MoreVertical, GitBranch,
    ArrowRight, Copy, TextQuote, Shuffle, Save, Loader2, Users,
    Settings as SettingsIcon, ImagePlus, Shield, FileText, Eye, EyeOff,
    Download, BarChart, PieChart, CheckCircle, XCircle, Check,
    Sheet, PlusIcon, Search,
    // Missing icons added:
    Trophy, Lock, ShieldAlert
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RichMarkdownEditor from '../components/MarkdownEditor';
import ImageUploader from '../components/ImageUploader';

const ELEMENT_TYPES = [
    { value: "SHORT_TEXT", label: "Short answer", icon: <Minus size={16} /> },
    { value: "LONG_TEXT", label: "Paragraph", icon: <AlignLeft size={16} /> },
    { value: "MULTIPLE_CHOICE", label: "Multiple choice", icon: <CircleDot size={16} /> },
    { value: "CHECKBOXES", label: "Checkboxes", icon: <CheckSquare size={16} /> },
    { value: "DROPDOWN", label: "Dropdown", icon: <ChevronDown size={16} /> },
    { value: "FILE_UPLOAD", label: "File Upload", icon: <UploadCloud size={16} /> },
    { value: "LINEAR_SCALE", label: "Linear Scale", icon: <SlidersHorizontal size={16} /> },
    { value: "DATE", label: "Date", icon: <Calendar size={16} /> },
    { value: "TIME", label: "Time", icon: <Clock size={16} /> },
    { value: "TEXT_ONLY", label: "Text Only", icon: <Type size={16} /> },
    { value: "IMAGE", label: "Image", icon: <ImageIcon size={16} /> },
];

export default function FormBuilder({ initialFormId = null }) {
    const { slug: urlFormId } = useParams();
    const navigate = useNavigate();
    const [newResponseCount, setNewResponseCount] = useState(0);
    const [formId, setFormId] = useState(initialFormId || urlFormId);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(!!formId);
    const [activeTab, setActiveTab] = useState('questions');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [isSearchingUsers, setIsSearchingUsers] = useState(false);
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [tempSections, setTempSections] = useState([]);
    const [accessRequests, setAccessRequests] = useState([]);
    const [hasNewAccess, setHasNewAccess] = useState(false);
    // State for responses
    const [responses, setResponses] = useState([]);
    const [loadingResponses, setLoadingResponses] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(null);

    // Image option state
    const [activeImageOptionId, setActiveImageOptionId] = useState(null);
    // Conditional logic modal
    const [conditionModal, setConditionModal] = useState({ open: false, sectionId: null, elementId: null });

    // Initial form state (matching backend schema + added collaborators & requireNitkkrDomain)
    const [form, setForm] = useState({
        title: "Untitled Form",
        description: "Please fill out this form.",
        coverPhoto: "",
        collaborators: [], // added
        sections: [
            {
                id: uuidv4(),
                title: "Section 1",
                description: "",
                elements: [
                    {
                        id: uuidv4(), type: "MULTIPLE_CHOICE", question: "Untitled Question",
                        description: "", showDescription: false, shuffleOptions: false,
                        options: [{ id: uuidv4(), text: "Option 1", image: "", goToSection: "NEXT", isOther: false, isCorrect: false }],
                        required: false, logicEnabled: false,
                        points: 0,
                        isGraded: true,
                        correctAnswer: null,
                        validation: { regex: '', errorMessage: '', enabled: false },
                        conditions: [],
                        fileRestrictions: { allowedExtensions: '', maxSizeMB: 10 },
                        shortInputType: "",
                    }
                ]
            }
        ],
        settings: {
            loginReq: false,
            isQuiz: false,
            releaseGrades: 'MANUALLY',
            showMissedQuestions: true,
            showCorrectAnswers: true,
            showPointValues: true,
            defaultQuestionPoints: 0,
            collectEmails: 'DO_NOT_COLLECT',
            sendResponderCopy: 'OFF',
            allowEditAfterSubmit: false,
            limitToOneResponse: false,
            acceptingResponses: true,
            showProgressBar: false,
            shuffleQuestionOrder: false,
            confirmationMessage: "Your response has been recorded.",
            requireNitkkrDomain: false, // added
        }
    });

    const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/forms';
    const RESPONSES_API_URL = import.meta.env.VITE_API_BASE_URL + '/api/responses';
    const responsesRef = useRef(responses);
    useEffect(() => {
        responsesRef.current = responses;
    }, [responses]);

    // --- Fetch form data ---
    useEffect(() => {
        if (!formId) return;
        const fetchForm = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/${formId}`, { headers: { Authorization: token }, withCredentials: true });
                setForm(res.data);
                setIsLoading(false);
            } catch (err) {
                toast.error("Failed to load form");
                setIsLoading(false);
            }
        };
        fetchForm();
    }, [formId, API_URL]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (userSearchQuery.length > 2) {
                setIsSearchingUsers(true);
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/forms/users/search?q=${userSearchQuery}`, {
                        headers: { Authorization: token },
                        withCredentials: true
                    });
                    setUserSearchResults(res.data);
                } catch (error) {
                    toast.error("Failed to search users");
                } finally {
                    setIsSearchingUsers(false);
                }
            } else {
                setUserSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [userSearchQuery]);

    // --- Fetch responses with polling when responses tab is active ---
    useEffect(() => {
        let interval;
        if (activeTab === 'responses' && formId) {
            fetchResponses(true); // immediate fetch, silent
            interval = setInterval(() => fetchResponses(true), 5000);
        }
        return () => clearInterval(interval);
    }, [activeTab, formId]);

    const fetchResponses = async (silent = false) => {
        if (!silent) setLoadingResponses(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${RESPONSES_API_URL}/form/${formId}`, {
                headers: { Authorization: token }, withCredentials: true
            });
            let newResponses = res.data;
            // Ensure newest first (if API doesn't guarantee order)
            newResponses.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

            const currentIds = new Set(responsesRef.current.map(r => r._id));
            const freshResponses = newResponses.filter(r => !currentIds.has(r._id));

            if (freshResponses.length > 0) {
                setResponses(prev => [...freshResponses, ...prev]);
                setNewResponseCount(prev => prev + freshResponses.length);
                toast.success(`${freshResponses.length} new response(s) received`, { icon: '📬' });
            }
        } catch (err) {
            toast.error("Failed to load responses");
        } finally {
            if (!silent) setLoadingResponses(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'responses') {
            setNewResponseCount(0);
        }
    }, [activeTab]);

    const saveForm = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: token };

            if (formId) {
                await axios.put(`${API_URL}/${formId}`, form, { headers, withCredentials: true });
                toast.success("Form updated successfully");
            } else {
                const res = await axios.post(`${API_URL}`, form, { headers, withCredentials: true });
                const newFormId = res.data._id;
                setFormId(newFormId);
                toast.success("Form created successfully");
                navigate(`/admin/form/${newFormId}`, { replace: true });
            }
        } catch (err) {
            toast.error(formId ? "Failed to update form" : "Failed to create form");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Click outside dropdown ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Helper data ---
    const availableSections = useMemo(() => {
        return form.sections.map((s, idx) => ({ id: s.id, index: idx + 1, title: s.title || `Section ${idx + 1}` }));
    }, [form.sections]);

    // Enhanced allQuestions with sectionIndex
    const allQuestions = useMemo(() => {
        return form.sections.flatMap((section, sectionIndex) =>
            section.elements
                .filter(el => !['TEXT_ONLY', 'IMAGE'].includes(el.type))
                .map(el => ({
                    id: el.id,
                    question: el.question || 'Untitled',
                    sectionId: section.id,
                    sectionTitle: section.title || `Section ${sectionIndex + 1}`,
                    sectionIndex: sectionIndex + 1,
                }))
        );
    }, [form.sections]);

    // --- Update functions ---
    const updateFormHeader = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
    const updateSettings = (key, value) => setForm(prev => ({ ...prev, settings: { ...prev.settings, [key]: value } }));

    // Sections
    const addSection = () => setForm(prev => ({ ...prev, sections: [...prev.sections, { id: uuidv4(), title: "", description: "", elements: [] }] }));
    const updateSection = (sectionId, key, value) => setForm(prev => ({ ...prev, sections: prev.sections.map(s => s.id === sectionId ? { ...s, [key]: value } : s) }));
    const removeSection = (sectionId) => {
        if (form.sections.length === 1) return;
        setForm(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== sectionId) }));
        setActiveDropdown(null);
    };
    const duplicateSection = (sectionId) => {
        const sIndex = form.sections.findIndex(s => s.id === sectionId);
        if (sIndex === -1) return;
        const newSection = {
            ...form.sections[sIndex], id: uuidv4(),
            elements: form.sections[sIndex].elements.map(el => ({
                ...el, id: uuidv4(),
                options: el.options ? el.options.map(o => ({ ...o, id: uuidv4() })) : [],
                validation: el.validation ? { ...el.validation } : { regex: '', errorMessage: '', enabled: false },
                conditions: el.conditions ? [...el.conditions] : [],
                fileRestrictions: el.fileRestrictions ? { ...el.fileRestrictions } : { allowedExtensions: '', maxSizeMB: 10 }
            }))
        };
        const newSections = [...form.sections];
        newSections.splice(sIndex + 1, 0, newSection);
        setForm(prev => ({ ...prev, sections: newSections }));
        setActiveDropdown(null);
    };
    const openMoveModal = () => { setTempSections([...form.sections]); setIsSectionModalOpen(true); setActiveDropdown(null); };
    const saveSectionOrder = () => { setForm(prev => ({ ...prev, sections: tempSections })); setIsSectionModalOpen(false); };

    // Elements
    const addElementToSection = (sectionId, type = "MULTIPLE_CHOICE") => {
        const baseOptions = (t) => {
            if (t === 'MULTIPLE_CHOICE' || t === 'DROPDOWN')
                return [{ id: uuidv4(), text: "Option 1", image: "", goToSection: "NEXT", isOther: false, isCorrect: false }];
            if (t === 'CHECKBOXES')
                return [{ id: uuidv4(), text: "Option 1", image: "", isOther: false, isCorrect: false }];
            return [];
        };
        const newElement = {
            id: uuidv4(), type, question: "", description: "", showDescription: false, shuffleOptions: false, imageUrl: "",
            options: baseOptions(type),
            required: false, logicEnabled: false,
            points: form.settings.defaultQuestionPoints,
            isGraded: form.settings.isQuiz ? true : false,
            correctAnswer: null,
            validation: { regex: '', errorMessage: '', enabled: false },
            conditions: [],
            fileRestrictions: { allowedExtensions: '', maxSizeMB: 10 },
            shortInputType: ""
        };
        setForm(prev => ({ ...prev, sections: prev.sections.map(s => s.id === sectionId ? { ...s, elements: [...s.elements, newElement] } : s) }));
    };
    const updateElement = (sectionId, elementId, key, value) => setForm(prev => ({ ...prev, sections: prev.sections.map(s => s.id === sectionId ? { ...s, elements: s.elements.map(el => el.id === elementId ? { ...el, [key]: value } : el) } : s) }));
    const removeElement = (sectionId, elementId) => { setForm(prev => ({ ...prev, sections: prev.sections.map(s => s.id === sectionId ? { ...s, elements: s.elements.filter(el => el.id !== elementId) } : s) })); setActiveDropdown(null); };
    const duplicateElement = (sectionId, elementId) => {
        setForm(prev => ({
            ...prev, sections: prev.sections.map(s => {
                if (s.id !== sectionId) return s;
                const eIndex = s.elements.findIndex(el => el.id === elementId);
                if (eIndex === -1) return s;
                const newEl = {
                    ...s.elements[eIndex], id: uuidv4(),
                    options: s.elements[eIndex].options ? s.elements[eIndex].options.map(o => ({ ...o, id: uuidv4() })) : [],
                    validation: s.elements[eIndex].validation ? { ...s.elements[eIndex].validation } : { regex: '', errorMessage: '', enabled: false },
                    conditions: s.elements[eIndex].conditions ? [...s.elements[eIndex].conditions] : [],
                    fileRestrictions: s.elements[eIndex].fileRestrictions ? { ...s.elements[eIndex].fileRestrictions } : { allowedExtensions: '', maxSizeMB: 10 }
                };
                const newElements = [...s.elements];
                newElements.splice(eIndex + 1, 0, newEl);
                return { ...s, elements: newElements };
            })
        }));
        setActiveDropdown(null);
    };
    const setSectionElements = (sectionId, newElements) => setForm(prev => ({ ...prev, sections: prev.sections.map(s => s.id === sectionId ? { ...s, elements: newElements } : s) }));

    // Options
    const updateOption = (sectionId, elementId, optionId, key, value) => setForm(prev => ({ ...prev, sections: prev.sections.map(s => s.id === sectionId ? { ...s, elements: s.elements.map(el => el.id === elementId ? { ...el, options: el.options.map(opt => opt.id === optionId ? { ...opt, [key]: value } : opt) } : el) } : s) }));
    const addOption = (sectionId, elementId) => setForm(prev => ({ ...prev, sections: prev.sections.map(s => s.id === sectionId ? { ...s, elements: s.elements.map(el => el.id === elementId ? { ...el, options: [...el.options, { id: uuidv4(), text: `Option ${el.options.length + 1}`, image: "", goToSection: "NEXT", isOther: false, isCorrect: false }] } : el) } : s) }));
    const addOtherOption = (sectionId, elementId) => setForm(prev => ({ ...prev, sections: prev.sections.map(s => s.id === sectionId ? { ...s, elements: s.elements.map(el => el.id === elementId ? { ...el, options: [...el.options, { id: uuidv4(), text: "Other", image: "", goToSection: "NEXT", isOther: true, isCorrect: false }] } : el) } : s) }));
    const removeOption = (sectionId, elementId, optionId) => setForm(prev => ({ ...prev, sections: prev.sections.map(s => s.id === sectionId ? { ...s, elements: s.elements.map(el => el.id === elementId ? { ...el, options: el.options.filter(opt => opt.id !== optionId) } : el) } : s) }));
    const setOptionsList = (sectionId, elementId, newOptions) => updateElement(sectionId, elementId, 'options', newOptions);

    // Conditions
    const addCondition = (sectionId, elementId, condition) => {
        const el = form.sections.find(s => s.id === sectionId)?.elements.find(e => e.id === elementId);
        const newConditions = [...(el?.conditions || []), condition];
        updateElement(sectionId, elementId, 'conditions', newConditions);
    };
    const removeCondition = (sectionId, elementId, index) => {
        const el = form.sections.find(s => s.id === sectionId)?.elements.find(e => e.id === elementId);
        const newConditions = el.conditions.filter((_, i) => i !== index);
        updateElement(sectionId, elementId, 'conditions', newConditions);
    };

    // --- Quiz helpers ---
    const setCorrectOption = (sectionId, elementId, optionId, isSingle = true) => {
        const element = form.sections.find(s => s.id === sectionId)?.elements.find(e => e.id === elementId);
        if (!element) return;
        const newOptions = element.options.map(opt =>
            opt.id === optionId ? { ...opt, isCorrect: !opt.isCorrect } : { ...opt, isCorrect: isSingle ? false : opt.isCorrect }
        );
        updateElement(sectionId, elementId, 'options', newOptions);
    };

    // --- Export CSV ---
    const exportCSV = () => {
        if (!responses.length) {
            toast.error("No responses to export");
            return;
        }
        const questions = form.sections.flatMap(s => s.elements.filter(e => !['TEXT_ONLY', 'IMAGE'].includes(e.type)));
        const headers = ['Submitted At', 'Email', ...questions.map(q => q.question || 'Untitled')];
        if (form.settings.isQuiz) headers.push('Score', 'Max Score');

        const rows = responses.map(r => {
            const base = [
                new Date(r.submittedAt).toLocaleString(),
                r.respondentEmail || ''
            ];
            const answerMap = new Map(r.answers.map(a => [a.questionId, a.value]));
            const answerValues = questions.map(q => {
                const val = answerMap.get(q.id);
                if (Array.isArray(val)) return val.join('; ');
                return val || '';
            });
            if (form.settings.isQuiz) {
                return [...base, ...answerValues, r.totalScore, r.maxScore];
            }
            return [...base, ...answerValues];
        });

        const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `responses_${form.title.replace(/\s+/g, '_')}.csv`;
        link.click();
    };
    const textiRef = useRef(null);

    const handleCopy = async () => {
        const baseUrl = window.location.origin;

        try {
            await navigator.clipboard.writeText(baseUrl + '/form/' + formId);
            toast.success("Base URL copied!");

            // Change text
            textiRef.current.textContent = "Copied";

            // Reset after 2 seconds
            setTimeout(() => {
                textiRef.current.textContent = "Copy Link";
            }, 2000);

        } catch {
            toast.error("Failed to copy!");
        }
    };

    useEffect(() => {
        if (activeTab === 'access' && formId) {
            const fetchRequests = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`${API_URL}/${formId}/access-requests`, {
                        headers: { Authorization: token },
                        withCredentials: true
                    });
                    setAccessRequests(res.data);
                } catch (err) {
                    toast.error("Failed to load access requests");
                }
            };
            fetchRequests();
        }
    }, [activeTab, formId, API_URL]);

    const handleApproveAccess = async (request) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/access-requests/${request._id}`, {
                headers: { Authorization: token },
                withCredentials: true
            });

            if (!(form.collaborators || []).find(c => c.user === request.userId._id)) {
                updateFormHeader('collaborators', [
                    ...(form.collaborators || []),
                    {
                        user: request.userId._id,
                        name: request.userId.name,
                        email: request.userId.email,
                        profilePhoto: request.userId.profilePhoto
                    }
                ]);
            }
            setAccessRequests(prev => prev.filter(r => r._id !== request._id));
            setHasNewAccess(true);
        } catch (err) {
            toast.error("Failed to approve access");
        }
    };

    const handleRejectAccess = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/access-requests/${requestId}`, {
                headers: { Authorization: token },
                withCredentials: true
            });
            setAccessRequests(prev => prev.filter(r => r._id !== requestId));
            toast.success("Request rejected");
        } catch (err) {
            toast.error("Failed to reject request");
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <Loader2 className="animate-spin w-10 h-10 text-[#51b749]" />
        </div>
    );

    return (
        <div className="min-h-screen font-sans bg-black pb-32 text-white selection:bg-[#51b749]/30 selection:text-[#51b749] relative overflow-x-hidden">
            
            {/* --- BACKGROUND GRID --- */}
            <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
                <div 
                    className="absolute inset-0 bg-[linear-gradient(to_right,#51b74915_1px,transparent_1px),linear-gradient(to_bottom,#51b74915_1px,transparent_1px)] bg-[size:40px_40px]"
                    style={{
                        maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)",
                        WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)"
                    }}
                />
            </div>

            <div className="max-w-4xl mx-auto p-4 md:p-8 relative z-10">

                {/* --- HEADER & TABS --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-[#111111]/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 sticky top-4 z-50 gap-4">
                    <div className="flex space-x-6 px-2 overflow-x-auto w-full md:w-auto custom-scrollbar pb-2 md:pb-0">
                        <button className={`font-semibold pb-1 flex items-center whitespace-nowrap transition-colors ${activeTab === 'questions' ? 'text-[#51b749] border-b-2 border-[#51b749]' : 'text-white/50 hover:text-white border-b-2 border-transparent'}`} onClick={() => setActiveTab('questions')}><LayoutList size={18} className="mr-2" /> Builder</button>
                        <button
                            className={`font-semibold pb-1 flex items-center whitespace-nowrap relative transition-colors ${activeTab === 'responses' ? 'text-[#51b749] border-b-2 border-[#51b749]' : 'text-white/50 hover:text-white border-b-2 border-transparent'}`}
                            onClick={() => setActiveTab('responses')}
                        >
                            <Users size={18} className="mr-2" /> Responses
                            {newResponseCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                                    {newResponseCount}
                                </span>
                            )}
                        </button> 
                        <button className={`font-semibold pb-1 flex items-center whitespace-nowrap transition-colors ${activeTab === 'settings' ? 'text-[#51b749] border-b-2 border-[#51b749]' : 'text-white/50 hover:text-white border-b-2 border-transparent'}`} onClick={() => setActiveTab('settings')}><SettingsIcon size={18} className="mr-2" /> Settings</button>
                        <button className={`font-semibold pb-1 flex items-center whitespace-nowrap transition-colors ${activeTab === 'access' ? 'text-[#51b749] border-b-2 border-[#51b749]' : 'text-white/50 hover:text-white border-b-2 border-transparent'}`} onClick={() => setActiveTab('access')}><Shield size={18} className="mr-2" /> Access</button>
                    </div>
                    <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                        <button
                            onClick={saveForm} disabled={isSaving}
                            className="flex items-center space-x-2 bg-[#51b749]/80 hover:bg-[#38984c] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-[0_0_15px_-3px_rgba(81,183,73,0.4)] transition-all active:scale-95 border-none disabled:opacity-50 disabled:shadow-none"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            <span className="hidden sm:inline">{formId ? 'Update Form' : 'Save Form'}</span>
                        </button>
                        {formId && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Copy size={16} />
                                <span ref={textiRef} className="hidden sm:inline">Copy Link</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* --- QUESTIONS TAB (BUILDER) --- */}
                {activeTab === 'questions' && (
                    <div className="space-y-8">
                        {/* FORM HEADER & COVER PHOTO */}
                        <div className="bg-[#111111] rounded-2xl shadow-xl border border-white/10 overflow-hidden relative">
                            <div className="w-full relative group bg-black">
                                {form.coverPhoto ? (
                                    <div className="relative w-full h-48 sm:h-72 border-b border-white/5">
                                        <img src={form.coverPhoto} alt="Cover" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                            <button
                                                onClick={() => updateFormHeader('coverPhoto', '')}
                                                className="bg-black/60 backdrop-blur-md border border-white/10 text-red-400 p-2.5 rounded-lg shadow-lg hover:bg-red-500/20 hover:border-red-500/50 flex items-center space-x-2 text-sm font-semibold transition-all"
                                            >
                                                <Trash2 size={16} /> <span className="hidden sm:inline">Remove Cover</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 sm:p-8 border-b border-white/5">
                                        <ImageUploader
                                            currentMedia={form.coverPhoto}
                                            onUpload={(url) => updateFormHeader('coverPhoto', url)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={`p-8 ${form.coverPhoto ? 'border-t-4 border-[#51b749]' : ''}`}>
                                <input
                                    type="text" value={form.title} onChange={(e) => updateFormHeader('title', e.target.value)} placeholder="Form Title"
                                    className="w-full text-4xl font-extrabold bg-transparent text-white border-b-2 border-transparent hover:border-white/10 focus:border-[#51b749] focus:outline-none pb-2 mb-6 transition-colors placeholder:text-white/20"
                                />
                                <div className="bg-black border border-white/5 rounded-xl p-2 focus-within:border-[#51b749]/50 transition-colors">
                                    <RichMarkdownEditor initialValue={form.description} onChange={(val) => updateFormHeader('description', val)} />
                                </div>
                            </div>
                        </div>

                        {/* SECTIONS */}
                        <div className="space-y-12">
                            {form.sections.map((section, sIdx) => (
                                <div key={section.id} className="relative bg-white/5 p-4 md:p-6 rounded-3xl border-2 border-dashed border-white/10">

                                    {/* Section Header */}
                                    <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border-t-4 border-[#51b749] border-x border-b border-white/10 mb-6 group relative">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="inline-flex items-center space-x-2 bg-[#13703a]/30 border border-[#51b749]/20 text-[#51b749] px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4">
                                                    <span>Section {sIdx + 1} of {form.sections.length}</span>
                                                </div>
                                                <input type="text" value={section.title} onChange={(e) => updateSection(section.id, 'title', e.target.value)} placeholder="Untitled Section" className="w-full text-2xl font-bold bg-transparent text-white border-b-2 border-transparent hover:border-white/10 focus:border-[#51b749] focus:outline-none pb-2 mb-4 transition-colors placeholder:text-white/30" />
                                                <input type="text" value={section.description} onChange={(e) => updateSection(section.id, 'description', e.target.value)} placeholder="Section Description (optional)" className="w-full text-sm bg-transparent text-white/60 border-b border-transparent hover:border-white/10 focus:border-[#51b749] focus:outline-none pb-1 transition-colors placeholder:text-white/20" />
                                            </div>
                                            <div className="ml-6 relative z-20 dropdown-container">
                                                <button onClick={() => setActiveDropdown(activeDropdown === section.id ? null : section.id)} className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                                                    <MoreVertical size={20} />
                                                </button>
                                                {activeDropdown === section.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-[#111111] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/10 py-2 overflow-hidden">
                                                        <button onClick={openMoveModal} className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-[#51b749] flex items-center transition-colors"><LayoutList size={16} className="mr-3" /> Move Section</button>
                                                        <button onClick={() => duplicateSection(section.id)} className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-[#51b749] flex items-center transition-colors"><Copy size={16} className="mr-3" /> Duplicate Section</button>
                                                        <div className="h-px bg-white/10 my-1"></div>
                                                        <button onClick={() => removeSection(section.id)} disabled={form.sections.length === 1} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center disabled:opacity-30 transition-colors"><Trash2 size={16} className="mr-3" /> Delete Section</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sortable Elements */}
                                    <ReactSortable
                                        list={section.elements} setList={(newElements) => setSectionElements(section.id, newElements)}
                                        group="shared-questions" animation={250} handle=".drag-handle-element" ghostClass="opacity-40" className="space-y-4 min-h-[50px]"
                                    >
                                        {section.elements.map((el) => {
                                            const isNonQuestion = el.type === 'TEXT_ONLY' || el.type === 'IMAGE';
                                            const showQuizUI = form.settings.isQuiz && !isNonQuestion && el.isGraded;

                                            return (
                                                <div key={el.id} className="relative group bg-[#111111] p-6 md:p-8 rounded-2xl shadow-md border border-white/10 focus-within:border-[#51b749] focus-within:shadow-[0_0_20px_-5px_rgba(81,183,73,0.2)] transition-all">
                                                    <div className="drag-handle-element cursor-grab w-full flex justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 left-0 right-0">
                                                        <GripHorizontal size={24} className="text-white/20 hover:text-white/50" />
                                                    </div>

                                                    <div className="flex justify-between items-start mb-4 mt-2">
                                                        <div className="flex-1 space-y-3">
                                                            {el.type !== 'IMAGE' && (
                                                                <div className="bg-black border border-white/5 rounded-xl p-2">
                                                                    <RichMarkdownEditor initialValue={el.question} onChange={(val) => updateElement(section.id, el.id, 'question', val)} />
                                                                    {el.showDescription && (
                                                                        <input type="text" value={el.description} onChange={(e) => updateElement(section.id, el.id, 'description', e.target.value)} placeholder="Description" className="w-full mt-2 text-sm bg-[#111111] text-white/70 border border-white/5 hover:border-white/10 focus:border-[#51b749] focus:outline-none p-3 rounded-lg transition-colors placeholder:text-white/20" />
                                                                    )}
                                                                </div>
                                                            )}
                                                            {el.type === 'IMAGE' && (
                                                                <ImageUploader currentMedia={el.imageUrl} onUpload={(url) => updateElement(section.id, el.id, 'imageUrl', url)} />
                                                            )}
                                                            {(el.type === 'SHORT_TEXT') && (
                                                                <div className="mt-4 p-5 bg-black rounded-xl space-y-4 border border-white/5">
                                                                    <div>
                                                                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#51b749] flex items-center">
                                                                            <Shield size={14} className="mr-1.5" /> Auto-Fill User Data
                                                                        </label>
                                                                        <div className="relative">
                                                                            <select
                                                                                value={el.shortInputType || ''}
                                                                                onChange={(e) => updateElement(section.id, el.id, 'shortInputType', e.target.value)}
                                                                                className="w-full text-sm bg-[#111111] text-white border border-white/10 rounded-lg p-3 outline-none focus:border-[#51b749] appearance-none cursor-pointer"
                                                                            >
                                                                                <option value="" className="bg-black text-white/50">None (Standard Input)</option>
                                                                                <option value="name" className="bg-black text-white">Full Name</option>
                                                                                <option value="email" className="bg-black text-white">Account Email</option>
                                                                                <option value="rollNo" className="bg-black text-white">Roll Number</option>
                                                                                <option value="collegeEmail" className="bg-black text-white">College Email</option>
                                                                                <option value="collegeName" className="bg-black text-white">College Name</option>
                                                                            </select>
                                                                            <ChevronDown size={16} className="absolute right-3 top-3.5 text-white/40 pointer-events-none"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Validation UI */}
                                                            {el.validation?.enabled && (el.type === 'SHORT_TEXT' || el.type === 'LONG_TEXT') && (
                                                                <div className="mt-4 p-5 bg-black rounded-xl space-y-3 border border-white/5">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Regex pattern (e.g., ^[A-Za-z]+$)"
                                                                        value={el.validation.regex || ''}
                                                                        onChange={(e) => updateElement(section.id, el.id, 'validation', { ...el.validation, regex: e.target.value })}
                                                                        className="w-full text-sm bg-[#111111] text-white border border-white/10 rounded-lg p-3 outline-none focus:border-[#51b749] placeholder:text-white/20"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Custom Error message"
                                                                        value={el.validation.errorMessage || ''}
                                                                        onChange={(e) => updateElement(section.id, el.id, 'validation', { ...el.validation, errorMessage: e.target.value })}
                                                                        className="w-full text-sm bg-[#111111] text-white border border-white/10 rounded-lg p-3 outline-none focus:border-[#51b749] placeholder:text-white/20"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* File restrictions */}
                                                            {el.type === 'FILE_UPLOAD' && el.fileRestrictions && (
                                                                <div className="mt-4 p-5 bg-black rounded-xl space-y-3 border border-white/5">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Allowed extensions (e.g., .jpg,.png,.pdf)"
                                                                        value={el.fileRestrictions.allowedExtensions || ''}
                                                                        onChange={(e) => updateElement(section.id, el.id, 'fileRestrictions', { ...el.fileRestrictions, allowedExtensions: e.target.value })}
                                                                        className="w-full text-sm bg-[#111111] text-white border border-white/10 rounded-lg p-3 outline-none focus:border-[#51b749] placeholder:text-white/20"
                                                                    />
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-sm text-white/50">Max size:</span>
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Size"
                                                                            value={el.fileRestrictions.maxSizeMB || 10}
                                                                            onChange={(e) => updateElement(section.id, el.id, 'fileRestrictions', { ...el.fileRestrictions, maxSizeMB: parseInt(e.target.value) || 10 })}
                                                                            className="w-24 text-sm bg-[#111111] text-white border border-white/10 rounded-lg p-2 outline-none focus:border-[#51b749] text-center"
                                                                        />
                                                                        <span className="text-sm text-white/50">MB</span>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Conditional logic badge */}
                                                            {el.conditions && el.conditions.length > 0 && (
                                                                <div className="mt-2 flex items-center space-x-2 text-xs text-white bg-[#13703a]/50 border border-[#51b749]/30 p-2.5 rounded-lg w-fit">
                                                                    <GitBranch size={14} className="text-[#51b749]" />
                                                                    <span>{el.conditions.length} condition(s) applied</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="ml-2 flex items-center space-x-2 relative">
                                                            {/* Points display for quiz */}
                                                            {showQuizUI && (
                                                                <div className="flex items-center space-x-1 text-xs font-bold tracking-widest bg-[#13703a]/30 border border-[#51b749]/30 text-[#51b749] px-2.5 py-1.5 rounded-md">
                                                                    <span>{el.points ?? form.settings.defaultQuestionPoints}</span>
                                                                    <span>PTS</span>
                                                                </div>
                                                            )}
                                                            <div className="relative z-20 dropdown-container">
                                                                <button onClick={() => setActiveDropdown(activeDropdown === el.id ? null : el.id)} className="p-2 hover:bg-white/10 rounded-lg text-white/50 transition-colors">
                                                                    <MoreVertical size={20} />
                                                                </button>
                                                                {activeDropdown === el.id && (
                                                                    <div className="absolute right-0 mt-2 w-56 bg-[#111111] rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/10 py-2 overflow-hidden">
                                                                        {el.type !== 'IMAGE' && (
                                                                            <button onClick={() => { updateElement(section.id, el.id, 'showDescription', !el.showDescription); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 flex items-center justify-between transition-colors">
                                                                                <span className="flex items-center"><TextQuote size={16} className="mr-3 text-white/40" /> Description</span>
                                                                                {el.showDescription && <CheckSquare size={16} className="text-[#51b749]" />}
                                                                            </button>
                                                                        )}
                                                                        {['MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN'].includes(el.type) && (
                                                                            <button onClick={() => { updateElement(section.id, el.id, 'shuffleOptions', !el.shuffleOptions); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 flex items-center justify-between transition-colors">
                                                                                <span className="flex items-center"><Shuffle size={16} className="mr-3 text-white/40" /> Shuffle order</span>
                                                                                {el.shuffleOptions && <CheckSquare size={16} className="text-[#51b749]" />}
                                                                            </button>
                                                                        )}
                                                                        {(el.type === 'SHORT_TEXT' || el.type === 'LONG_TEXT') && (
                                                                            <button onClick={() => { updateElement(section.id, el.id, 'validation', { ...el.validation, enabled: !el.validation?.enabled }); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 flex items-center justify-between transition-colors">
                                                                                <span className="flex items-center"><Shield size={16} className="mr-3 text-white/40" /> Validation</span>
                                                                                {el.validation?.enabled && <CheckSquare size={16} className="text-[#51b749]" />}
                                                                            </button>
                                                                        )}
                                                                        {!isNonQuestion && (
                                                                            <button onClick={() => { setConditionModal({ open: true, sectionId: section.id, elementId: el.id }); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 flex items-center transition-colors">
                                                                                <GitBranch size={16} className="mr-3 text-white/40" /> Conditional logic
                                                                            </button>
                                                                        )}
                                                                        {/* Graded toggle */}
                                                                        {form.settings.isQuiz && !isNonQuestion && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    if (el.isGraded) {
                                                                                        updateElement(section.id, el.id, 'isGraded', false);
                                                                                        updateElement(section.id, el.id, 'points', 0);
                                                                                        updateElement(section.id, el.id, 'correctAnswer', null);
                                                                                        if (el.options) {
                                                                                            const newOptions = el.options.map(opt => ({ ...opt, isCorrect: false }));
                                                                                            updateElement(section.id, el.id, 'options', newOptions);
                                                                                        }
                                                                                    } else {
                                                                                        updateElement(section.id, el.id, 'isGraded', true);
                                                                                        if (!el.points) updateElement(section.id, el.id, 'points', form.settings.defaultQuestionPoints);
                                                                                    }
                                                                                    setActiveDropdown(null);
                                                                                }}
                                                                                className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 flex items-center justify-between transition-colors"
                                                                            >
                                                                                <span className="flex items-center"><FileText size={16} className="mr-3 text-white/40" /> Graded</span>
                                                                                {el.isGraded && <CheckSquare size={16} className="text-[#51b749]" />}
                                                                            </button>
                                                                        )}
                                                                        <div className="h-px bg-white/10 my-1"></div>
                                                                        <button onClick={() => duplicateElement(section.id, el.id)} className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 flex items-center transition-colors"><Copy size={16} className="mr-3 text-white/40" /> Duplicate</button>
                                                                        <button onClick={() => removeElement(section.id, el.id)} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center transition-colors"><Trash2 size={16} className="mr-3 text-red-400" /> Delete</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Options rendering */}
                                                    {!isNonQuestion && (el.type === 'MULTIPLE_CHOICE' || el.type === 'DROPDOWN' || el.type === 'CHECKBOXES') && (
                                                        <div className="mt-4 p-4 bg-black rounded-xl border border-white/5">
                                                            <ReactSortable list={el.options} setList={(newOpts) => setOptionsList(section.id, el.id, newOpts)} animation={200} handle=".drag-handle-option" ghostClass="opacity-40" className="space-y-3">
                                                                {el.options.map((opt, optIdx) => (
                                                                    <div key={opt.id} className="flex flex-col space-y-2 group/opt">
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="drag-handle-option cursor-grab opacity-0 group-hover/opt:opacity-100 text-white/20 hover:text-white/50"><GripVertical size={18} /></div>
                                                                            <div className="text-[#51b749]">
                                                                                {el.type === 'MULTIPLE_CHOICE' ? <CircleDot size={18} /> : el.type === 'CHECKBOXES' ? <CheckSquare size={18} /> : <span className="font-mono text-sm text-white/40">{optIdx + 1}.</span>}
                                                                            </div>
                                                                            <input
                                                                                type="text"
                                                                                value={opt.text}
                                                                                onChange={(e) => updateOption(section.id, el.id, opt.id, 'text', e.target.value)}
                                                                                className="flex-1 bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#51b749] focus:outline-none py-1.5 text-white transition-colors"
                                                                            />
                                                                            {showQuizUI && !opt.isOther && (
                                                                                <div className="flex items-center">
                                                                                    {el.type === 'MULTIPLE_CHOICE' || el.type === 'DROPDOWN' ? (
                                                                                        <input type="radio" name={`correct-${el.id}`} checked={opt.isCorrect || false} onChange={() => setCorrectOption(section.id, el.id, opt.id, true)} className="mr-1.5 w-4 h-4 accent-[#51b749]" />
                                                                                    ) : el.type === 'CHECKBOXES' ? (
                                                                                        <input type="checkbox" checked={opt.isCorrect || false} onChange={() => setCorrectOption(section.id, el.id, opt.id, false)} className="mr-1.5 w-4 h-4 accent-[#51b749] rounded" />
                                                                                    ) : null}
                                                                                    <span className="text-xs text-[#51b749] font-medium">Correct</span>
                                                                                </div>
                                                                            )}
                                                                            {!opt.isOther && (
                                                                                <button onClick={() => setActiveImageOptionId(activeImageOptionId === opt.id ? null : opt.id)} className="p-1 text-white/30 hover:text-[#51b749] transition-colors">
                                                                                    <ImagePlus size={16} />
                                                                                </button>
                                                                            )}
                                                                            <button onClick={() => removeOption(section.id, el.id, opt.id)} disabled={el.options.length === 1} className="p-1.5 text-white/30 hover:text-red-400 disabled:opacity-20 transition-colors"><X size={16} /></button>
                                                                        </div>

                                                                        {/* Option Image */}
                                                                        {!opt.isOther && (
                                                                            <div className="ml-9">
                                                                                {opt.image && (
                                                                                    <div className="relative inline-block mt-2">
                                                                                        <img src={opt.image} alt="option" className="max-h-24 rounded-lg border border-white/10" />
                                                                                        <button onClick={() => updateOption(section.id, el.id, opt.id, 'image', '')} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
                                                                                            <X size={12} />
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                                {activeImageOptionId === opt.id && (
                                                                                    <div className="mt-3 p-3 bg-[#111111] rounded-lg border border-white/5">
                                                                                        <ImageUploader
                                                                                            currentMedia={opt.image}
                                                                                            onUpload={(url) => {
                                                                                                updateOption(section.id, el.id, opt.id, 'image', url);
                                                                                                setActiveImageOptionId(null);
                                                                                            }}
                                                                                        />
                                                                                        <button onClick={() => setActiveImageOptionId(null)} className="text-xs text-white/40 mt-2 hover:text-white transition-colors">Cancel Upload</button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        {opt.isOther && (
                                                                            <div className="ml-9 text-xs text-white/40 italic flex items-center">
                                                                                <span className="mr-2">(Free-text "Other")</span>
                                                                            </div>
                                                                        )}

                                                                        {el.logicEnabled && el.type !== 'CHECKBOXES' && (
                                                                            <div className="ml-9 flex items-center space-x-3 text-sm mt-1">
                                                                                <ArrowRight size={14} className="text-white/30" />
                                                                                <div className="relative">
                                                                                    <select value={opt.goToSection || 'NEXT'} onChange={(e) => updateOption(section.id, el.id, opt.id, 'goToSection', e.target.value)} className="appearance-none bg-[#111111] border border-white/10 text-white/80 py-1.5 pl-3 pr-8 rounded-md focus:outline-none focus:border-[#51b749] text-xs w-64 cursor-pointer">
                                                                                        <option value="NEXT" className="bg-black">Continue to next section</option>
                                                                                        {availableSections.map(s => <option key={s.id} value={s.id} className="bg-black">Go to section {s.index} ({s.title.substring(0, 20) || 'Untitled'}...)</option>)}
                                                                                        <option value="SUBMIT" className="bg-black text-[#51b749]">Submit form</option>
                                                                                    </select>
                                                                                    <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-white/40 pointer-events-none"/>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </ReactSortable>
                                                            <div className="ml-9 mt-4 flex space-x-4">
                                                                <button onClick={() => addOption(section.id, el.id)} className="text-xs font-bold tracking-wider uppercase text-[#51b749] hover:text-[#38984c] transition-colors flex items-center gap-1"><PlusIcon size={12}/> Add Option</button>
                                                                <button onClick={() => addOtherOption(section.id, el.id)} className="text-xs font-bold tracking-wider uppercase text-white/40 hover:text-white transition-colors flex items-center gap-1"><PlusIcon size={12}/> Add "Other"</button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Correct answer input for text */}
                                                    {showQuizUI && (el.type === 'SHORT_TEXT' || el.type === 'LONG_TEXT') && (
                                                        <div className="mt-4 p-5 bg-black rounded-xl border border-[#51b749]/30">
                                                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#51b749]">Exact Correct Answer</label>
                                                            <input
                                                                type="text"
                                                                value={el.correctAnswer?.value || ''}
                                                                onChange={(e) => updateElement(section.id, el.id, 'correctAnswer', { ...el.correctAnswer, value: e.target.value, type: 'exact' })}
                                                                placeholder="Type the exact expected answer..."
                                                                className="w-full p-3 bg-[#111111] border border-white/10 rounded-lg text-white focus:border-[#51b749] focus:outline-none transition-colors placeholder:text-white/20"
                                                            />
                                                            <p className="text-xs text-white/40 mt-2">You can also use regex by enabling validation above.</p>
                                                        </div>
                                                    )}

                                                    {/* Bottom toolbar */}
                                                    <div className="flex flex-wrap md:flex-nowrap justify-between items-center border-t border-white/5 pt-5 mt-6 gap-4">
                                                        
                                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                                            <div className="relative z-10 w-full md:w-48">
                                                                <select value={el.type} onChange={(e) => updateElement(section.id, el.id, 'type', e.target.value)} className="w-full appearance-none bg-black border border-white/10 text-white/90 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-[#51b749] text-sm font-medium cursor-pointer transition-colors">
                                                                    {ELEMENT_TYPES.map(type => <option key={type.value} value={type.value} className="bg-black text-white">{type.label}</option>)}
                                                                </select>
                                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
                                                            </div>
                                                            {showQuizUI && (
                                                                <div className="flex items-center space-x-2 bg-black border border-white/10 rounded-lg px-3 py-1">
                                                                    <span className="text-xs font-bold text-white/50 uppercase tracking-wider">PTS</span>
                                                                    <input
                                                                        type="number" min="0"
                                                                        value={el.points ?? form.settings.defaultQuestionPoints}
                                                                        onChange={(e) => updateElement(section.id, el.id, 'points', parseInt(e.target.value) || 0)}
                                                                        className="w-12 bg-transparent text-center text-[#51b749] font-bold focus:outline-none"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto justify-end">
                                                            {!isNonQuestion && (el.type === 'MULTIPLE_CHOICE' || el.type === 'DROPDOWN') && (
                                                                <button onClick={() => updateElement(section.id, el.id, 'logicEnabled', !el.logicEnabled)} className={`p-2 px-3 rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium border ${el.logicEnabled ? 'bg-[#13703a]/30 border-[#51b749]/30 text-[#51b749]' : 'border-transparent text-white/50 hover:bg-white/5 hover:text-white'}`}>
                                                                    <GitBranch size={16} /> <span className="hidden sm:inline">Logic</span>
                                                                </button>
                                                            )}
                                                            {!isNonQuestion && (
                                                                <label className="flex items-center space-x-2 text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors">
                                                                    <span className="hidden sm:inline">Required</span>
                                                                    <span className="sm:hidden">Req</span>
                                                                    <input type="checkbox" checked={el.required} onChange={(e) => updateElement(section.id, el.id, 'required', e.target.checked)} className="h-4 w-4 accent-[#51b749] rounded cursor-pointer" />
                                                                </label>
                                                            )}
                                                            {!isNonQuestion && <div className="w-px h-6 bg-white/10"></div>}
                                                            <button onClick={() => removeElement(section.id, el.id)} className="text-white/40 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-lg"><Trash2 size={18} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </ReactSortable>

                                    {/* Add Element Buttons */}
                                    <div className="mt-6 flex justify-center gap-3">
                                        <button onClick={() => addElementToSection(section.id, "MULTIPLE_CHOICE")} className="flex items-center space-x-2 bg-black border border-white/10 text-white hover:text-[#51b749] hover:border-[#51b749]/50 px-5 py-2.5 rounded-full shadow-lg transition-all text-sm font-semibold active:scale-95">
                                            <PlusCircle size={18} /> <span className="hidden sm:inline">Add Question</span>
                                        </button>
                                        <button onClick={() => addElementToSection(section.id, "TEXT_ONLY")} className="flex items-center space-x-2 bg-black border border-white/10 text-white hover:text-[#51b749] hover:border-[#51b749]/50 px-4 py-2.5 rounded-full shadow-lg transition-all active:scale-95" title="Add Text">
                                            <Type size={18} />
                                        </button>
                                        <button onClick={() => addElementToSection(section.id, "IMAGE")} className="flex items-center space-x-2 bg-black border border-white/10 text-white hover:text-[#51b749] hover:border-[#51b749]/50 px-4 py-2.5 rounded-full shadow-lg transition-all active:scale-95" title="Add Image">
                                            <ImageIcon size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Floating Add Section */}
                        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
                            <div className="bg-[#111111]/90 backdrop-blur-xl p-1.5 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/10 flex items-center">
                                <button onClick={addSection} className="px-6 py-2.5 text-white hover:bg-white/10 rounded-full flex items-center space-x-2 font-bold text-sm transition-all active:scale-95">
                                    <LayoutList size={18} className="text-[#51b749]" /> <span>Add New Section</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- RESPONSES TAB --- */}
                {activeTab === 'responses' && (
                    <div className="bg-[#111111] p-6 md:p-8 rounded-2xl shadow-xl border border-white/10 space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 gap-4">
                            <h2 className="text-3xl font-bold text-white tracking-tight">{responses.length} <span className="text-white/50 font-normal">Responses</span></h2>
                            <div className="flex flex-wrap items-center gap-4">
                                <button onClick={() => fetchResponses(false)} className="flex items-center space-x-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg">
                                    <Loader2 size={14} className={loadingResponses ? 'animate-spin' : ''} />
                                    <span>Refresh</span>
                                </button>
                                <button onClick={exportCSV} className="flex items-center space-x-2 bg-[#13703a]/50 border border-[#51b749]/50 hover:bg-[#13703a] text-[#51b749] hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">
                                    <Download size={16} />
                                    <span>Export CSV</span>
                                </button>
                                
                                <div className="flex items-center gap-3 bg-black border border-white/5 px-4 py-2 rounded-lg">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${form.settings.acceptingResponses ? 'text-[#51b749]' : 'text-red-400'}`}>
                                        {form.settings.acceptingResponses ? 'Accepting' : 'Not Accepting'}
                                    </span>
                                    <button
                                        onClick={() => updateSettings('acceptingResponses', !form.settings.acceptingResponses)}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${form.settings.acceptingResponses ? 'bg-[#51b749]' : 'bg-white/20'}`}
                                    >
                                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${form.settings.acceptingResponses ? 'translate-x-5' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                
                                <Link to={'/sheets/' + formId} className="p-2.5 text-white/50 hover:text-[#51b749] bg-black border border-white/5 hover:border-[#51b749]/50 rounded-lg transition-all" title="View in Sheets mode">
                                    <Sheet size={18} />
                                </Link>
                            </div>
                        </div>

                        {loadingResponses ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-[#51b749]" /></div>
                        ) : responses.length === 0 ? (
                            <div className="text-center py-20 text-white/40 border border-dashed border-white/10 rounded-xl bg-black/50">
                                <Users size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="font-medium">Waiting for responses.</p>
                                <p className="text-sm mt-1">Once submitted, charts and data will appear here.</p>
                            </div>
                        ) : (
                            <>
                                {/* Simple charts */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {form.sections.flatMap(s => s.elements)
                                        .filter(e => !['TEXT_ONLY', 'IMAGE'].includes(e.type) && e.options?.length)
                                        .map(question => {
                                            const counts = new Map();
                                            question.options.forEach(opt => counts.set(opt.id, 0));
                                            responses.forEach(r => {
                                                const answer = r.answers.find(a => a.questionId === question.id);
                                                if (answer) {
                                                    if (Array.isArray(answer.value)) {
                                                        answer.value.forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
                                                    } else {
                                                        counts.set(answer.value, (counts.get(answer.value) || 0) + 1);
                                                    }
                                                }
                                            });
                                            return (
                                                <div key={question.id} className="border border-white/10 rounded-xl p-5 bg-black">
                                                    <h4 className="font-bold text-white mb-4 line-clamp-2">{question.question || 'Untitled Question'}</h4>
                                                    <div className="space-y-2">
                                                        {question.options.map(opt => (
                                                            <div key={opt.id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-white/5 border border-white/5">
                                                                <span className="text-white/80">{opt.text}</span>
                                                                <span className="font-bold bg-white/10 text-white px-2 py-0.5 rounded-md">{counts.get(opt.id) || 0}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>

                                {/* Individual responses table */}
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold mb-4 text-white">Individual Responses</h3>
                                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-black">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white/5 border-b border-white/10">
                                                <tr>
                                                    <th className="p-4 font-semibold text-white/70">Submitted</th>
                                                    <th className="p-4 font-semibold text-white/70">Email</th>
                                                    {form.settings.isQuiz && <th className="p-4 font-semibold text-white/70">Score</th>}
                                                    <th className="p-4 font-semibold text-white/70">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {responses.map(resp => (
                                                    <tr key={resp._id} className="hover:bg-white/5 transition-colors">
                                                        <td className="p-4 text-white/90">{new Date(resp.submittedAt).toLocaleString()}</td>
                                                        <td className="p-4 text-white/60">{resp.respondentEmail || '—'}</td>
                                                        {form.settings.isQuiz && (
                                                            <td className="p-4 font-mono text-[#51b749] font-bold">
                                                                {resp.totalScore} / {resp.maxScore}
                                                            </td>
                                                        )}
                                                        <td className="p-4">
                                                            <button
                                                                onClick={() => setSelectedResponse(resp)}
                                                                className="text-[#51b749] hover:text-[#38984c] font-semibold tracking-wide hover:underline"
                                                            >
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* --- SETTINGS TAB --- */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        {/* Quiz Settings */}
                        <div className="bg-[#111111] p-6 md:p-8 rounded-2xl shadow-xl border border-white/10">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Trophy size={20} className="text-[#51b749]"/> Make this a quiz</h3>
                                    <p className="text-sm text-white/50 mt-1">Assign point values, set answers, and automatically provide feedback.</p>
                                </div>
                                <button onClick={() => updateSettings('isQuiz', !form.settings.isQuiz)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.settings.isQuiz ? 'bg-[#51b749]' : 'bg-white/20'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.settings.isQuiz ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            
                            {form.settings.isQuiz && (
                                <div className="pl-6 border-l-2 border-[#51b749]/30 space-y-6 pt-2">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-white/80 uppercase tracking-wider">Release grades</label>
                                        <select
                                            value={form.settings.releaseGrades}
                                            onChange={(e) => updateSettings('releaseGrades', e.target.value)}
                                            className="w-full md:w-64 p-3 border border-white/10 rounded-lg bg-black text-white focus:border-[#51b749] outline-none"
                                        >
                                            <option value="IMMEDIATELY">Immediately after submission</option>
                                            <option value="MANUALLY">Later, after manual review</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input type="checkbox" checked={form.settings.showMissedQuestions} onChange={(e) => updateSettings('showMissedQuestions', e.target.checked)} className="h-4 w-4 accent-[#51b749] rounded" />
                                            <span className="text-white/80">Show missed questions to respondent</span>
                                        </label>
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input type="checkbox" checked={form.settings.showCorrectAnswers} onChange={(e) => updateSettings('showCorrectAnswers', e.target.checked)} className="h-4 w-4 accent-[#51b749] rounded" />
                                            <span className="text-white/80">Show correct answers</span>
                                        </label>
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input type="checkbox" checked={form.settings.showPointValues} onChange={(e) => updateSettings('showPointValues', e.target.checked)} className="h-4 w-4 accent-[#51b749] rounded" />
                                            <span className="text-white/80">Show point values</span>
                                        </label>
                                    </div>
                                    <div className="pt-2">
                                        <label className="block text-sm font-semibold mb-2 text-white/80 uppercase tracking-wider">Default points per question</label>
                                        <input
                                            type="number" min="0"
                                            value={form.settings.defaultQuestionPoints}
                                            onChange={(e) => updateSettings('defaultQuestionPoints', parseInt(e.target.value) || 0)}
                                            className="w-24 p-3 border border-white/10 rounded-lg bg-black text-[#51b749] font-bold focus:border-[#51b749] outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Response Settings */}
                        <div className="bg-[#111111] p-6 md:p-8 rounded-2xl shadow-xl border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6">Responses</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-white/80 uppercase tracking-wider">Collect email addresses</label>
                                    <select
                                        value={form.settings.collectEmails}
                                        onChange={(e) => updateSettings('collectEmails', e.target.value)}
                                        className="w-full md:w-64 p-3 border border-white/10 rounded-lg bg-black text-white focus:border-[#51b749] outline-none"
                                    >
                                        <option value="DO_NOT_COLLECT">Do not collect</option>
                                        <option value="VERIFIED">Verified (requires login)</option>
                                        <option value="RESPONDER">Responder input</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-white/80 uppercase tracking-wider">Send responder a copy</label>
                                    <select
                                        value={form.settings.sendResponderCopy}
                                        onChange={(e) => updateSettings('sendResponderCopy', e.target.value)}
                                        className="w-full md:w-64 p-3 border border-white/10 rounded-lg bg-black text-white focus:border-[#51b749] outline-none"
                                    >
                                        <option value="OFF">Off</option>
                                        <option value="ON_SUBMIT">On submission</option>
                                    </select>
                                </div>
                                <div className="pt-4 space-y-3">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" checked={form.settings.allowEditAfterSubmit} onChange={(e) => updateSettings('allowEditAfterSubmit', e.target.checked)} className="h-4 w-4 accent-[#51b749] rounded" />
                                        <span className="text-white/80">Allow responders to edit after submit</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" checked={form.settings.limitToOneResponse} onChange={(e) => updateSettings('limitToOneResponse', e.target.checked)} className="h-4 w-4 accent-[#51b749] rounded" />
                                        <span className="text-white/80">Limit to one response per user</span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer mt-4 pt-4 border-t border-white/5">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${form.settings.acceptingResponses ? 'bg-[#51b749]/20 text-[#51b749]' : 'bg-red-500/20 text-red-400'}`}>STATUS</span>
                                        <span className="text-white font-medium pl-1">Accepting responses</span>
                                        <div className="flex-1"></div>
                                        <button
                                            onClick={(e) => { e.preventDefault(); updateSettings('acceptingResponses', !form.settings.acceptingResponses); }}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.settings.acceptingResponses ? 'bg-[#51b749]' : 'bg-white/20'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.settings.acceptingResponses ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Presentation Settings */}
                        <div className="bg-[#111111] p-6 md:p-8 rounded-2xl shadow-xl border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6">Presentation</h3>
                            <div className="space-y-4">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={form.settings.showProgressBar} onChange={(e) => updateSettings('showProgressBar', e.target.checked)} className="h-4 w-4 accent-[#51b749] rounded" />
                                    <span className="text-white/80">Show progress bar</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer pb-4 border-b border-white/5">
                                    <input type="checkbox" checked={form.settings.shuffleQuestionOrder} onChange={(e) => updateSettings('shuffleQuestionOrder', e.target.checked)} className="h-4 w-4 accent-[#51b749] rounded" />
                                    <span className="text-white/80">Shuffle question order</span>
                                </label>
                                <div className="pt-2">
                                    <label className="block text-sm font-semibold mb-2 text-white/80 uppercase tracking-wider">Confirmation message</label>
                                    <div className="bg-black border border-white/5 rounded-xl p-2 focus-within:border-[#51b749]/50 transition-colors">
                                        <RichMarkdownEditor initialValue={form.settings.confirmationMessage} onChange={(val) => updateSettings('confirmationMessage', val)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ACCESS TAB --- */}
                {activeTab === 'access' && (
                    <div className="bg-[#111111] p-6 md:p-8 rounded-2xl shadow-xl border border-white/10 space-y-8">
                        <h2 className="text-2xl font-bold text-white">Access Management</h2>

                        {/* Form Level Restrictions */}
                        <div className="flex items-center justify-between p-5 border border-white/10 rounded-xl bg-black">
                            <div>
                                <h3 className="font-bold text-white flex items-center gap-2"><Lock size={16} className="text-[#51b749]" /> Form Login Required</h3>
                                <p className="text-sm text-white/50 mt-1">Require users to log in to platform before they can view or submit this form.</p>
                            </div>
                            <button
                                onClick={() => updateSettings('loginReq', !form.settings.loginReq)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.settings.loginReq ? 'bg-[#51b749]' : 'bg-white/20'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.settings.loginReq ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        {form.settings.loginReq && (
                            <div className="flex items-center justify-between p-5 border border-[#51b749]/30 rounded-xl bg-[#13703a]/10 mt-4">
                                <div>
                                    <h3 className="font-bold text-[#51b749] flex items-center gap-2"><ShieldAlert size={16} /> Restrict to NIT Kurukshetra</h3>
                                    <p className="text-sm text-white/60 mt-1">Only allow users with a verified @nitkkr.ac.in email address to access this form.</p>
                                </div>
                                <button
                                    onClick={() => updateSettings('requireNitkkrDomain', !form.settings.requireNitkkrDomain)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.settings.requireNitkkrDomain ? 'bg-[#51b749]' : 'bg-white/20'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.settings.requireNitkkrDomain ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        )}

                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <h3 className="font-bold text-white">Share Response Sheet Access</h3>
                            <p className="text-sm text-white/50 mb-4">Allow other admins or organizers to view the response data for this form.</p>
                            
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search users by name, email, or roll no..."
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                    className="w-full p-3 pl-10 border border-white/10 rounded-xl bg-black text-white focus:ring-1 focus:ring-[#51b749] focus:border-[#51b749] outline-none transition-all placeholder:text-white/30"
                                />
                                <Search className="absolute left-3 top-3.5 text-white/40" size={18} />

                                {isSearchingUsers && (
                                    <div className="absolute right-4 top-3.5 text-[#51b749]">
                                        <Loader2 size={18} className="animate-spin" />
                                    </div>
                                )}

                                {userSearchResults.length > 0 && (
                                    <div className="absolute w-full mt-2 bg-[#111111] border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] z-50 max-h-60 overflow-y-auto custom-scrollbar">
                                        {userSearchResults.map(u => (
                                            <div key={u._id} className="p-3 hover:bg-white/5 cursor-pointer flex justify-between items-center border-b border-white/5 last:border-0 transition-colors"
                                                onClick={() => {
                                                    if (!(form.collaborators || []).find(c => c.user === u._id)) {
                                                        updateFormHeader('collaborators', [...(form.collaborators || []), { user: u._id, name: u.name, email: u.email, profilePhoto: u.profilePhoto }]);
                                                    }
                                                    setUserSearchQuery('');
                                                    setUserSearchResults([]);
                                                }}>
                                                <div className="flex items-center space-x-3">
                                                    {u.profilePhoto ? <img src={u.profilePhoto} className="w-8 h-8 rounded-full object-cover border border-white/10" /> : <div className="w-8 h-8 bg-[#51b749]/20 rounded-full flex items-center justify-center text-[#51b749] font-bold border border-[#51b749]/30">{u.name.charAt(0)}</div>}
                                                    <div>
                                                        <p className="font-medium text-sm text-white">{u.name}</p>
                                                        <p className="text-xs text-white/50">{u.email} {u.rollNo ? `• ${u.rollNo}` : ''}</p>
                                                    </div>
                                                </div>
                                                <PlusCircle size={18} className="text-[#51b749]" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {accessRequests.length > 0 && (
                                <div className="p-5 border border-white/10 rounded-xl bg-white/5 mt-6 mb-8">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">Pending Access Requests <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] animate-pulse">{accessRequests.length}</span></h3>
                                    <div className="space-y-3">
                                        {accessRequests.map(req => (
                                            <div key={req._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border border-white/5 rounded-xl bg-black gap-4">
                                                <div className="flex items-center space-x-3">
                                                    {req.userId?.profilePhoto ? (
                                                        <img src={req.userId.profilePhoto} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-[#51b749]/20 rounded-full flex items-center justify-center text-[#51b749] font-bold border border-[#51b749]/30">
                                                            {req.userId?.name?.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-sm text-white">{req.userId?.name}</p>
                                                        <p className="text-xs text-white/50">{req.userId?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleApproveAccess(req)} className="flex-1 sm:flex-none flex justify-center items-center p-2.5 px-4 bg-[#13703a]/40 border border-[#51b749]/30 text-[#51b749] hover:bg-[#51b749] hover:text-white rounded-lg transition-colors">
                                                        <Check size={18} className="mr-1 sm:mr-0"/> <span className="sm:hidden text-sm font-bold">Approve</span>
                                                    </button>
                                                    <button onClick={() => handleRejectAccess(req._id)} className="flex-1 sm:flex-none flex justify-center items-center p-2.5 px-4 bg-red-900/30 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                                                        <X size={18} className="mr-1 sm:mr-0"/> <span className="sm:hidden text-sm font-bold">Reject</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={() => {
                                        saveForm();
                                        setHasNewAccess(false);
                                    }}
                                    disabled={isSaving}
                                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold shadow-[0_0_15px_-3px_rgba(81,183,73,0.4)] transition-all disabled:opacity-50 border-none ${
                                        hasNewAccess 
                                            ? 'bg-yellow-500 text-black hover:bg-yellow-400 animate-pulse shadow-[0_0_20px_rgba(234,179,8,0.4)]' 
                                            : 'bg-[#51b749]/80 hover:bg-[#38984c] text-white active:scale-95'
                                    }`}
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    <span>{formId ? 'Update Form Access' : 'Save Form'}</span>
                                </button>
                            </div>

                            <div className="mt-8 space-y-2">
                                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Current Collaborators</h4>
                                {(!form.collaborators || form.collaborators.length === 0) && (
                                    <p className="text-sm text-white/30 italic">No one else has access to these responses yet.</p>
                                )}
                                {(form.collaborators || []).map((collab, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 border border-white/5 rounded-xl bg-black">
                                        <div className="flex items-center space-x-3">
                                            {collab.profilePhoto ? <img src={collab.profilePhoto} className="w-8 h-8 rounded-full object-cover border border-white/10" /> : <div className="w-8 h-8 bg-[#51b749]/20 rounded-full flex items-center justify-center text-[#51b749] font-bold border border-[#51b749]/30">{collab.name?.charAt(0)}</div>}
                                            <div>
                                                <p className="font-medium text-sm text-white">{collab.name}</p>
                                                <p className="text-xs text-white/50">{collab.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => updateFormHeader('collaborators', form.collaborators.filter(c => c.user !== collab.user))} className="text-white/30 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"><X size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SECTION REORDER MODAL --- */}
                <AnimatePresence>
                    {isSectionModalOpen && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#111111] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                                    <h3 className="text-xl font-bold text-white tracking-tight">Reorder Sections</h3>
                                    <button onClick={() => setIsSectionModalOpen(false)} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
                                </div>
                                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                                    <ReactSortable
                                        list={tempSections} setList={setTempSections}
                                        animation={250} handle=".drag-handle-section" ghostClass="opacity-40"
                                    >
                                        {tempSections.map((s, idx) => (
                                            <div key={s.id} className="flex items-center space-x-4 p-4 bg-black border border-white/5 rounded-xl mb-3 hover:border-white/20 transition-colors">
                                                <GripVertical size={20} className="drag-handle-section cursor-grab text-white/30 hover:text-white/60 transition-colors" />
                                                <div>
                                                    <div className="text-[10px] font-bold text-[#51b749] tracking-widest uppercase mb-0.5">Section {idx + 1}</div>
                                                    <span className="font-bold text-white">{s.title || 'Untitled Section'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </ReactSortable>
                                </div>
                                <div className="p-5 border-t border-white/10 bg-black/50 flex justify-end space-x-3">
                                    <button onClick={() => setIsSectionModalOpen(false)} className="px-5 py-2.5 rounded-lg text-white/50 font-medium hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                                    <button onClick={saveSectionOrder} className="px-6 py-2.5 bg-[#51b749]/80 text-white rounded-lg font-bold hover:bg-[#38984c] shadow-[0_0_15px_-3px_rgba(81,183,73,0.5)] transition-all active:scale-95 border-none">Save Order</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- CONDITIONAL LOGIC MODAL --- */}
                <AnimatePresence>
                    {conditionModal.open && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#111111] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2"><GitBranch size={20} className="text-[#51b749]"/> Conditional Logic</h3>
                                    <button onClick={() => setConditionModal({ open: false, sectionId: null, elementId: null })} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
                                </div>
                                <div className="p-6 overflow-y-auto custom-scrollbar">
                                    {(() => {
                                        const element = form.sections.find(s => s.id === conditionModal.sectionId)?.elements.find(e => e.id === conditionModal.elementId);
                                        if (!element) return null;
                                        return (
                                            <div className="space-y-5">
                                                <p className="text-sm font-medium text-white/60">Show this question only if all conditions below are met:</p>
                                                <div className="space-y-3">
                                                    {element.conditions && element.conditions.map((cond, idx) => (
                                                        <div key={idx} className="flex flex-col md:flex-row md:items-center gap-3 bg-black border border-white/5 p-4 rounded-xl relative group">
                                                            <select
                                                                value={cond.questionId}
                                                                onChange={(e) => {
                                                                    const newConditions = [...element.conditions];
                                                                    newConditions[idx] = { ...cond, questionId: e.target.value };
                                                                    updateElement(conditionModal.sectionId, conditionModal.elementId, 'conditions', newConditions);
                                                                }}
                                                                className="bg-[#111111] text-white border border-white/10 rounded-lg p-2.5 text-sm flex-1 outline-none focus:border-[#51b749]"
                                                            >
                                                                <option value="" className="text-white/50">Select trigger question</option>
                                                                {allQuestions.map(q => (
                                                                    <option key={q.id} value={q.id}>Sec {q.sectionIndex}: {q.question.substring(0, 40) || 'Untitled'}...</option>
                                                                ))}
                                                            </select>
                                                            <div className="flex gap-3 w-full md:w-auto">
                                                                <select
                                                                    value={cond.operator || 'equals'}
                                                                    onChange={(e) => {
                                                                        const newConditions = [...element.conditions];
                                                                        newConditions[idx] = { ...cond, operator: e.target.value };
                                                                        updateElement(conditionModal.sectionId, conditionModal.elementId, 'conditions', newConditions);
                                                                    }}
                                                                    className="bg-[#111111] text-white border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-[#51b749] w-full md:w-auto"
                                                                >
                                                                    <option value="equals">equals</option>
                                                                    <option value="notEquals">does not equal</option>
                                                                    <option value="contains">contains</option>
                                                                    <option value="notContains">does not contain</option>
                                                                </select>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Value"
                                                                    value={cond.value || ''}
                                                                    onChange={(e) => {
                                                                        const newConditions = [...element.conditions];
                                                                        newConditions[idx] = { ...cond, value: e.target.value };
                                                                        updateElement(conditionModal.sectionId, conditionModal.elementId, 'conditions', newConditions);
                                                                    }}
                                                                    className="bg-[#111111] text-white border border-white/10 rounded-lg p-2.5 text-sm flex-1 md:w-32 outline-none focus:border-[#51b749] placeholder:text-white/20"
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={() => removeCondition(conditionModal.sectionId, conditionModal.elementId, idx)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => addCondition(conditionModal.sectionId, conditionModal.elementId, { questionId: '', operator: 'equals', value: '' })}
                                                    className="text-[#51b749] hover:text-[#38984c] text-sm font-bold flex items-center gap-1.5 transition-colors py-2"
                                                >
                                                    <PlusIcon size={16} /> Add new condition
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div className="p-5 border-t border-white/10 bg-black/50 flex justify-end">
                                    <button
                                        onClick={() => setConditionModal({ open: false, sectionId: null, elementId: null })}
                                        className="px-6 py-2.5 bg-[#51b749]/80 hover:bg-[#38984c] text-white rounded-lg font-bold shadow-[0_0_15px_-3px_rgba(81,183,73,0.5)] transition-all active:scale-95 border-none"
                                    >
                                        Done
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- INDIVIDUAL RESPONSE VIEW MODAL --- */}
                <AnimatePresence>
                    {selectedResponse && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#111111] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">Response Details</h3>
                                        <p className="text-xs text-white/50 mt-1">Submitted: {new Date(selectedResponse.submittedAt).toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => setSelectedResponse(null)} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
                                </div>
                                <div className="p-6 overflow-y-auto custom-scrollbar">
                                    {form.settings.isQuiz && (
                                        <div className="mb-6 p-4 rounded-xl bg-[#13703a]/20 border border-[#51b749]/30 flex items-center justify-between">
                                            <span className="font-bold text-white">Total Score</span>
                                            <span className="text-xl font-black text-[#51b749] tracking-wider">{selectedResponse.totalScore} <span className="text-sm font-medium text-white/40">/ {selectedResponse.maxScore}</span></span>
                                        </div>
                                    )}
                                    <div className="space-y-6">
                                        {form.sections.flatMap(s => s.elements).filter(e => !['TEXT_ONLY', 'IMAGE'].includes(e.type)).map((q, idx) => {
                                            const answer = selectedResponse.answers.find(a => a.questionId === q.id);
                                            const displayValue = answer ? (Array.isArray(answer.value) ? answer.value.join(', ') : answer.value) : '(No answer)';
                                            return (
                                                <div key={q.id} className="border border-white/5 bg-black rounded-xl p-5">
                                                    <p className="font-bold text-white/90 mb-3 text-sm leading-relaxed"><span className="text-white/40 mr-2">{idx + 1}.</span> {q.question || 'Untitled Question'}</p>
                                                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                                        <p className="text-sm text-white font-medium break-words">{displayValue}</p>
                                                    </div>
                                                    {form.settings.isQuiz && answer && (
                                                        <div className="mt-3 flex justify-end">
                                                            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded ${answer.pointsEarned > 0 ? 'bg-[#13703a]/40 text-[#51b749]' : 'bg-red-900/30 text-red-400'}`}>
                                                                {answer.pointsEarned} / {q.points} PTS
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
            
            <style jsx global>{`
                /* Custom Scrollbar */
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(81,183,73,0.5); }
            `}</style>
        </div>
    );
}