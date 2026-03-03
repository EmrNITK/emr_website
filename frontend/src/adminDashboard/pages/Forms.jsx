import React, { useState, useMemo, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ReactSortable } from "react-sortablejs";
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    PlusCircle, Trash2, AlignLeft, Type, CheckSquare,
    CircleDot, Image as ImageIcon, Minus, Moon, Sun, GripVertical,
    GripHorizontal, ChevronDown, Calendar, Clock, UploadCloud,
    SlidersHorizontal, LayoutList, X, MoreVertical, GitBranch,
    ArrowRight, Copy, TextQuote, Shuffle, Save, Loader2, Users,
    Settings as SettingsIcon, ImagePlus, Shield, FileText, Eye, EyeOff,
    Download, BarChart, PieChart, CheckCircle, XCircle, Check,
    Sheet
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

    // State for responses
    const [responses, setResponses] = useState([]);
    const [loadingResponses, setLoadingResponses] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(null);

    // Image option state
    const [activeImageOptionId, setActiveImageOptionId] = useState(null);
    // Conditional logic modal
    const [conditionModal, setConditionModal] = useState({ open: false, sectionId: null, elementId: null });

    // Initial form state (matching backend schema)
    const [form, setForm] = useState({
        title: "Untitled Form",
        description: "Please fill out this form.",
        coverPhoto: "",
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
                        isGraded: true,                       // new field
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
            releaseGrades: 'IMMEDIATELY',
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
            confirmationMessage: "Your response has been recorded."
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
    // --- Save form ---
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

    const allQuestions = useMemo(() => {
        return form.sections.flatMap(section =>
            section.elements
                .filter(el => !['TEXT_ONLY', 'IMAGE'].includes(el.type))
                .map(el => ({
                    id: el.id,
                    question: el.question || 'Untitled',
                    sectionId: section.id,
                    sectionTitle: section.title || 'Untitled Section'
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
            isGraded: form.settings.isQuiz ? true : false,   // default to graded only if quiz mode is on
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
            await navigator.clipboard.writeText(baseUrl + /form/ + formId);
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







    if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-zinc-950 text-white"><Loader2 className="animate-spin w-8 h-8 text-blue-500" /></div>;

    return (
        <div className={`${isDarkMode ? 'dark' : ''} min-h-screen font-sans bg-black pb-32 transition-colors`}>
            <div className="max-w-4xl mx-auto p-4 md:p-8">

                {/* HEADER & TABS (unchanged) */}
                <div className="flex justify-between items-center mb-8 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 sticky top-4 z-50">
                    <div className="flex space-x-6 px-4 overflow-x-auto">
                        <button className={`font-semibold pb-1 flex items-center whitespace-nowrap ${activeTab === 'questions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-white'}`} onClick={() => setActiveTab('questions')}><LayoutList size={18} className="mr-2" /> Builder</button>
                        <button
                            className={`font-semibold pb-1 flex items-center whitespace-nowrap relative ${activeTab === 'responses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-white'}`}
                            onClick={() => setActiveTab('responses')}
                        >
                            <Users size={18} className="mr-2" /> Responses
                            {newResponseCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {newResponseCount}
                                </span>
                            )}
                        </button> <button className={`font-semibold pb-1 flex items-center whitespace-nowrap ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-white'}`} onClick={() => setActiveTab('settings')}><SettingsIcon size={18} className="mr-2" /> Settings</button>
                        <button className={`font-semibold pb-1 flex items-center whitespace-nowrap ${activeTab === 'access' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-white'}`} onClick={() => setActiveTab('access')}><Shield size={18} className="mr-2" /> Access</button>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hidden sm:block">
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button> */}

                        <button
                            onClick={saveForm} disabled={isSaving}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            <span className="hidden sm:inline">{formId ? 'Update Form' : 'Save Form'}</span>

                        </button>{formId && <button
                            onClick={handleCopy}
                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"

                        >
                            <Copy size={18} />
                            <span ref={textiRef}>Copy Link</span>
                        </button>}
                    </div>
                </div>

                {/* QUESTIONS TAB */}
                {activeTab === 'questions' && (
                    <div className="space-y-8">
                        {/* FORM HEADER & COVER PHOTO (unchanged) */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden relative">
                            <div className="w-full relative group bg-blue-50 dark:bg-zinc-900/50">
                                {form.coverPhoto ? (
                                    <div className="relative w-full h-48 sm:h-72">
                                        <img src={form.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => updateFormHeader('coverPhoto', '')}
                                                className="bg-red-500 text-white p-2 rounded-lg shadow-lg hover:bg-red-600 flex items-center space-x-2 text-sm font-semibold"
                                            >
                                                <Trash2 size={16} /> <span className="hidden sm:inline">Remove Cover</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 sm:p-8">
                                        <ImageUploader
                                            currentMedia={form.coverPhoto}
                                            onUpload={(url) => updateFormHeader('coverPhoto', url)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={`p-8 ${form.coverPhoto ? 'border-t-8 border-blue-500' : 'border-t border-gray-200 dark:border-zinc-800'}`}>
                                <input
                                    type="text" value={form.title} onChange={(e) => updateFormHeader('title', e.target.value)} placeholder="Form Title"
                                    className="w-full text-4xl font-extrabold bg-transparent text-gray-900 dark:text-white border-b-2 border-transparent hover:border-gray-200 dark:hover:border-zinc-700 focus:border-blue-500 focus:outline-none pb-2 mb-6"
                                />
                                <RichMarkdownEditor initialValue={form.description} onChange={(val) => updateFormHeader('description', val)} />
                            </div>
                        </div>

                        {/* SECTIONS */}
                        <div className="space-y-12">
                            {form.sections.map((section, sIdx) => (
                                <div key={section.id} className="relative bg-gray-100/50 dark:bg-zinc-900/30 p-4 md:p-6 rounded-3xl border-2 border-dashed border-gray-200 dark:border-zinc-800">

                                    {/* Section header (unchanged) */}
                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border-t-8 border-purple-500 border-x-gray-200 border-b-gray-200 dark:border-zinc-800 mb-6 group relative">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                                    <span>Section {sIdx + 1} of {form.sections.length}</span>
                                                </div>
                                                <input type="text" value={section.title} onChange={(e) => updateSection(section.id, 'title', e.target.value)} placeholder="Untitled Section" className="w-full text-2xl font-bold bg-transparent text-gray-900 dark:text-white border-b-2 border-transparent hover:border-gray-200 dark:hover:border-zinc-700 focus:border-purple-500 focus:outline-none pb-2 mb-4" />
                                                <input type="text" value={section.description} onChange={(e) => updateSection(section.id, 'description', e.target.value)} placeholder="Section Description (optional)" className="w-full text-sm bg-transparent text-gray-600 dark:text-zinc-400 border-b border-transparent hover:border-gray-200 dark:hover:border-zinc-700 focus:border-purple-500 focus:outline-none pb-1" />
                                            </div>
                                            <div className="ml-6 relative z-20 dropdown-container">
                                                <button onClick={() => setActiveDropdown(activeDropdown === section.id ? null : section.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-500">
                                                    <MoreVertical size={20} />
                                                </button>
                                                {activeDropdown === section.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2 overflow-hidden">
                                                        <button onClick={openMoveModal} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center"><LayoutList size={16} className="mr-2" /> Move Section</button>
                                                        <button onClick={() => duplicateSection(section.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center"><Copy size={16} className="mr-2" /> Duplicate Section</button>
                                                        <div className="h-px bg-gray-200 dark:bg-zinc-700 my-1"></div>
                                                        <button onClick={() => removeSection(section.id)} disabled={form.sections.length === 1} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center disabled:opacity-50"><Trash2 size={16} className="mr-2" /> Delete Section</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sortable elements */}
                                    <ReactSortable
                                        list={section.elements} setList={(newElements) => setSectionElements(section.id, newElements)}
                                        group="shared-questions" animation={250} handle=".drag-handle-element" ghostClass="opacity-40" className="space-y-4 min-h-[50px]"
                                    >
                                        {section.elements.map((el) => {
                                            const isNonQuestion = el.type === 'TEXT_ONLY' || el.type === 'IMAGE';
                                            const showQuizUI = form.settings.isQuiz && !isNonQuestion && el.isGraded;   // only show if graded

                                            return (
                                                <div key={el.id} className="relative group bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 focus-within:border-blue-500 transition-all">
                                                    <div className="drag-handle-element cursor-grab w-full flex justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 left-0 right-0">
                                                        <GripHorizontal size={24} className="text-gray-300 dark:text-zinc-600 hover:text-gray-500" />
                                                    </div>

                                                    <div className="flex justify-between items-start mb-4 mt-2">
                                                        <div className="flex-1 space-y-3">
                                                            {el.type !== 'IMAGE' && (
                                                                <>
                                                                    <RichMarkdownEditor initialValue={el.question} onChange={(val) => updateElement(section.id, el.id, 'question', val)} />
                                                                    {el.showDescription && (
                                                                        <input type="text" value={el.description} onChange={(e) => updateElement(section.id, el.id, 'description', e.target.value)} placeholder="Description" className="w-full text-sm bg-gray-50 dark:bg-zinc-800/50 text-gray-600 dark:text-zinc-400 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none p-2 rounded-lg transition-colors" />
                                                                    )}
                                                                </>
                                                            )}
                                                            {el.type === 'IMAGE' && (
                                                                <ImageUploader currentMedia={el.imageUrl} onUpload={(url) => updateElement(section.id, el.id, 'imageUrl', url)} />
                                                            )}
                                                            {(el.type === 'SHORT_TEXT') && (
                                                                <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg space-y-4 border border-gray-200 dark:border-zinc-700">
                                                                    <div>
                                                                        <label className="block text-sm font-medium mb-2 text-blue-600 dark:text-blue-400 flex items-center">
                                                                            <Shield size={16} className="mr-2" /> Auto-Fill User Data Profile
                                                                        </label>
                                                                        <select
                                                                            value={el.shortInputType || ''}
                                                                            onChange={(e) => updateElement(section.id, el.id, 'shortInputType', e.target.value)}
                                                                            className="w-full text-sm bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                                                        >
                                                                            <option value="">None (Standard Input)</option>
                                                                            <option value="name">Full Name</option>
                                                                            <option value="email">Account Email</option>
                                                                            <option value="rollNo">Roll Number</option>
                                                                            <option value="collegeEmail">College Email</option>
                                                                            <option value="collegeName">College Name</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Validation UI */}
                                                            {el.validation?.enabled && (el.type === 'SHORT_TEXT' || el.type === 'LONG_TEXT') && (
                                                                <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg space-y-3 border border-gray-200 dark:border-zinc-700">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Regex pattern (e.g., ^[A-Za-z]+$)"
                                                                        value={el.validation.regex || ''}
                                                                        onChange={(e) => updateElement(section.id, el.id, 'validation', { ...el.validation, regex: e.target.value })}
                                                                        className="w-full text-sm bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Error message"
                                                                        value={el.validation.errorMessage || ''}
                                                                        onChange={(e) => updateElement(section.id, el.id, 'validation', { ...el.validation, errorMessage: e.target.value })}
                                                                        className="w-full text-sm bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* File restrictions */}
                                                            {el.type === 'FILE_UPLOAD' && el.fileRestrictions && (
                                                                <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg space-y-3 border border-gray-200 dark:border-zinc-700">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Allowed extensions (comma separated, e.g., .jpg,.png,.pdf)"
                                                                        value={el.fileRestrictions.allowedExtensions || ''}
                                                                        onChange={(e) => updateElement(section.id, el.id, 'fileRestrictions', { ...el.fileRestrictions, allowedExtensions: e.target.value })}
                                                                        className="w-full text-sm bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2"
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Max file size (MB)"
                                                                        value={el.fileRestrictions.maxSizeMB || 10}
                                                                        onChange={(e) => updateElement(section.id, el.id, 'fileRestrictions', { ...el.fileRestrictions, maxSizeMB: parseInt(e.target.value) || 10 })}
                                                                        className="w-full text-sm bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Conditional logic badge */}
                                                            {el.conditions && el.conditions.length > 0 && (
                                                                <div className="mt-2 flex items-center space-x-2 text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 p-2 rounded-lg">
                                                                    <GitBranch size={14} />
                                                                    <span>{el.conditions.length} condition(s) applied</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="ml-1 flex items-center space-x-2 relative">
                                                            {/* Points display for quiz - only if graded */}
                                                            {showQuizUI && (
                                                                <div className="flex items-center space-x-1 text-sm bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                                                                    <span>{el.points ?? form.settings.defaultQuestionPoints}</span>
                                                                    <span className="text-xs">pts</span>
                                                                </div>
                                                            )}
                                                            <div className="relative z-20 dropdown-container">
                                                                <button onClick={() => setActiveDropdown(activeDropdown === el.id ? null : el.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-500 transition-colors">
                                                                    <MoreVertical size={20} />
                                                                </button>
                                                                {activeDropdown === el.id && (
                                                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 py-2 overflow-hidden">
                                                                        {el.type !== 'IMAGE' && (
                                                                            <button onClick={() => { updateElement(section.id, el.id, 'showDescription', !el.showDescription); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center justify-between">
                                                                                <span className="flex items-center"><TextQuote size={16} className="mr-2" /> Description</span>
                                                                                {el.showDescription && <CheckSquare size={14} className="text-blue-500" />}
                                                                            </button>
                                                                        )}
                                                                        {['MULTIPLE_CHOICE', 'CHECKBOXES', 'DROPDOWN'].includes(el.type) && (
                                                                            <button onClick={() => { updateElement(section.id, el.id, 'shuffleOptions', !el.shuffleOptions); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center justify-between">
                                                                                <span className="flex items-center"><Shuffle size={16} className="mr-2" /> Shuffle option order</span>
                                                                                {el.shuffleOptions && <CheckSquare size={14} className="text-blue-500" />}
                                                                            </button>
                                                                        )}
                                                                        {(el.type === 'SHORT_TEXT' || el.type === 'LONG_TEXT') && (
                                                                            <button onClick={() => { updateElement(section.id, el.id, 'validation', { ...el.validation, enabled: !el.validation?.enabled }); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center justify-between">
                                                                                <span className="flex items-center"><Shield size={16} className="mr-2" /> Validation</span>
                                                                                {el.validation?.enabled && <CheckSquare size={14} className="text-blue-500" />}
                                                                            </button>
                                                                        )}
                                                                        {!isNonQuestion && (
                                                                            <button onClick={() => { setConditionModal({ open: true, sectionId: section.id, elementId: el.id }); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center">
                                                                                <GitBranch size={16} className="mr-2" /> Conditional logic
                                                                            </button>
                                                                        )}
                                                                        {/* Graded toggle - only visible when quiz mode is on */}
                                                                        {form.settings.isQuiz && !isNonQuestion && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    if (el.isGraded) {
                                                                                        // Turning off graded: reset all quiz fields
                                                                                        updateElement(section.id, el.id, 'isGraded', false);
                                                                                        updateElement(section.id, el.id, 'points', 0);
                                                                                        updateElement(section.id, el.id, 'correctAnswer', null);
                                                                                        if (el.options) {
                                                                                            const newOptions = el.options.map(opt => ({ ...opt, isCorrect: false }));
                                                                                            updateElement(section.id, el.id, 'options', newOptions);
                                                                                        }
                                                                                    } else {
                                                                                        // Turning on graded
                                                                                        updateElement(section.id, el.id, 'isGraded', true);
                                                                                        if (!el.points) {
                                                                                            updateElement(section.id, el.id, 'points', form.settings.defaultQuestionPoints);
                                                                                        }
                                                                                    }
                                                                                    setActiveDropdown(null);
                                                                                }}
                                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center justify-between"
                                                                            >
                                                                                <span className="flex items-center"><FileText size={16} className="mr-2" /> Graded</span>
                                                                                {el.isGraded && <CheckSquare size={14} className="text-blue-500" />}
                                                                            </button>
                                                                        )}
                                                                        <div className="h-px bg-gray-200 dark:bg-zinc-700 my-1"></div>
                                                                        <button onClick={() => duplicateElement(section.id, el.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/50 flex items-center"><Copy size={16} className="mr-2" /> Duplicate</button>
                                                                        <button onClick={() => removeElement(section.id, el.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center"><Trash2 size={16} className="mr-2" /> Delete</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Options rendering */}
                                                    {!isNonQuestion && (el.type === 'MULTIPLE_CHOICE' || el.type === 'DROPDOWN' || el.type === 'CHECKBOXES') && (
                                                        <div className="mt-4">
                                                            <ReactSortable list={el.options} setList={(newOpts) => setOptionsList(section.id, el.id, newOpts)} animation={200} handle=".drag-handle-option" ghostClass="opacity-40" className="space-y-3">
                                                                {el.options.map((opt, optIdx) => (
                                                                    <div key={opt.id} className="flex flex-col space-y-2 group/opt bg-white dark:bg-zinc-900">
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="drag-handle-option cursor-grab opacity-0 group-hover/opt:opacity-100 text-gray-400"><GripVertical size={18} /></div>
                                                                            <div className="text-gray-400">
                                                                                {el.type === 'MULTIPLE_CHOICE' ? <CircleDot size={18} /> : el.type === 'CHECKBOXES' ? <CheckSquare size={18} /> : <span className="font-mono text-sm">{optIdx + 1}.</span>}
                                                                            </div>
                                                                            <input
                                                                                type="text"
                                                                                value={opt.text}
                                                                                onChange={(e) => updateOption(section.id, el.id, opt.id, 'text', e.target.value)}
                                                                                className="flex-1 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none py-1 text-gray-800 dark:text-zinc-200"
                                                                            />
                                                                            {/* Quiz correct answer indicator - only if graded */}
                                                                            {showQuizUI && !opt.isOther && (
                                                                                <div className="flex items-center">
                                                                                    {el.type === 'MULTIPLE_CHOICE' || el.type === 'DROPDOWN' ? (
                                                                                        <input
                                                                                            type="radio"
                                                                                            name={`correct-${el.id}`}
                                                                                            checked={opt.isCorrect || false}
                                                                                            onChange={() => setCorrectOption(section.id, el.id, opt.id, true)}
                                                                                            className="mr-1 w-4 h-4 text-green-600"
                                                                                        />
                                                                                    ) : el.type === 'CHECKBOXES' ? (
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={opt.isCorrect || false}
                                                                                            onChange={() => setCorrectOption(section.id, el.id, opt.id, false)}
                                                                                            className="mr-1 w-4 h-4 text-green-600 rounded"
                                                                                        />
                                                                                    ) : null}
                                                                                    <span className="text-xs text-green-600">Correct</span>
                                                                                </div>
                                                                            )}
                                                                            {/* Image upload for option */}
                                                                            {!opt.isOther && (
                                                                                <button
                                                                                    onClick={() => setActiveImageOptionId(activeImageOptionId === opt.id ? null : opt.id)}
                                                                                    className="p-1 text-gray-400 hover:text-blue-500"
                                                                                >
                                                                                    <ImagePlus size={16} />
                                                                                </button>
                                                                            )}
                                                                            <button onClick={() => removeOption(section.id, el.id, opt.id)} disabled={el.options.length === 1} className="p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-30"><X size={16} /></button>
                                                                        </div>

                                                                        {/* Option image */}
                                                                        {!opt.isOther && (
                                                                            <div className="ml-8">
                                                                                {opt.image && (
                                                                                    <div className="relative inline-block mt-2">
                                                                                        <img src={opt.image} alt="option" className="max-h-20 rounded border border-gray-300 dark:border-zinc-700" />
                                                                                        <button
                                                                                            onClick={() => updateOption(section.id, el.id, opt.id, 'image', '')}
                                                                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
                                                                                        >
                                                                                            <X size={12} />
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                                {activeImageOptionId === opt.id && (
                                                                                    <div className="mt-2">
                                                                                        <ImageUploader
                                                                                            currentMedia={opt.image}
                                                                                            onUpload={(url) => {
                                                                                                updateOption(section.id, el.id, opt.id, 'image', url);
                                                                                                setActiveImageOptionId(null);
                                                                                            }}
                                                                                        />
                                                                                        <button
                                                                                            onClick={() => setActiveImageOptionId(null)}
                                                                                            className="text-xs text-gray-500 mt-1 hover:underline"
                                                                                        >
                                                                                            Cancel
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        {/* "Other" indicator */}
                                                                        {opt.isOther && (
                                                                            <div className="ml-8 text-sm text-gray-500 dark:text-zinc-400 italic flex items-center">
                                                                                <span className="mr-2">(Free-text "Other")</span>
                                                                            </div>
                                                                        )}

                                                                        {/* Branching logic */}
                                                                        {el.logicEnabled && el.type !== 'CHECKBOXES' && (
                                                                            <div className="ml-12 flex items-center space-x-2 text-sm">
                                                                                <ArrowRight size={14} className="text-gray-400" />
                                                                                <select value={opt.goToSection || 'NEXT'} onChange={(e) => updateOption(section.id, el.id, opt.id, 'goToSection', e.target.value)} className="appearance-none bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:border-blue-500 text-xs w-64">
                                                                                    <option value="NEXT">Continue to next section</option>
                                                                                    {availableSections.map(s => <option key={s.id} value={s.id}>Go to section {s.index} ({s.title.substring(0, 20) || 'Untitled'}...)</option>)}
                                                                                    <option value="SUBMIT">Submit form</option>
                                                                                </select>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </ReactSortable>
                                                            <div className="ml-8 mt-3 flex space-x-4">
                                                                <button onClick={() => addOption(section.id, el.id)} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Add option</button>
                                                                <button onClick={() => addOtherOption(section.id, el.id)} className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">Add "Other"</button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Correct answer input for text questions - only if graded */}
                                                    {showQuizUI && (el.type === 'SHORT_TEXT' || el.type === 'LONG_TEXT') && (
                                                        <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700">
                                                            <label className="block text-sm font-medium mb-1">Correct Answer</label>
                                                            <input
                                                                type="text"
                                                                value={el.correctAnswer?.value || ''}
                                                                onChange={(e) => updateElement(section.id, el.id, 'correctAnswer', {
                                                                    ...el.correctAnswer,
                                                                    value: e.target.value,
                                                                    type: 'exact'
                                                                })}
                                                                placeholder="Enter correct answer (exact match)"
                                                                className="w-full p-2 border rounded dark:bg-zinc-900"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">You can also use regex by enabling validation above.</p>
                                                        </div>
                                                    )}

                                                    {/* Bottom toolbar */}
                                                    <div className="flex justify-end items-center border-t border-gray-100 dark:border-zinc-800 pt-4 mt-8 space-x-4">
                                                        <div className="relative z-10 w-48 hidden md:block">
                                                            <select value={el.type} onChange={(e) => updateElement(section.id, el.id, 'type', e.target.value)} className="w-full appearance-none bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium cursor-pointer">
                                                                {ELEMENT_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                                                            </select>
                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                                        </div>

                                                        {/* Points input - only if graded */}
                                                        {showQuizUI && (
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm text-gray-500">Points</span>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={el.points ?? form.settings.defaultQuestionPoints}
                                                                    onChange={(e) => updateElement(section.id, el.id, 'points', parseInt(e.target.value) || 0)}
                                                                    className="w-16 p-1 border rounded dark:bg-zinc-800 text-center"
                                                                />
                                                            </div>
                                                        )}

                                                        {!isNonQuestion && (el.type === 'MULTIPLE_CHOICE' || el.type === 'DROPDOWN') && (
                                                            <button onClick={() => updateElement(section.id, el.id, 'logicEnabled', !el.logicEnabled)} className={`p-2 rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium ${el.logicEnabled ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}>
                                                                <GitBranch size={16} /> <span className="hidden sm:inline">Logic</span>
                                                            </button>
                                                        )}
                                                        {!isNonQuestion && (
                                                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-zinc-400 cursor-pointer">
                                                                <span>Required</span>
                                                                <input type="checkbox" checked={el.required} onChange={(e) => updateElement(section.id, el.id, 'required', e.target.checked)} className="h-4 w-4 text-blue-600 rounded" />
                                                            </label>
                                                        )}
                                                        {!isNonQuestion && <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800"></div>}
                                                        <button onClick={() => removeElement(section.id, el.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </ReactSortable>

                                    {/* Add element buttons (unchanged) */}
                                    <div className="mt-4 flex justify-center space-x-3">
                                        <button onClick={() => addElementToSection(section.id, "MULTIPLE_CHOICE")} className="flex items-center space-x-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-500/50 px-4 py-2 rounded-full shadow-sm transition-all text-sm font-medium"><PlusCircle size={18} /> <span className="hidden sm:inline">Add Question</span></button>
                                        <button onClick={() => addElementToSection(section.id, "TEXT_ONLY")} className="flex items-center space-x-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-500/50 px-4 py-2 rounded-full shadow-sm transition-all text-sm font-medium" title="Add Text"><Type size={18} /></button>
                                        <button onClick={() => addElementToSection(section.id, "IMAGE")} className="flex items-center space-x-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-500/50 px-4 py-2 rounded-full shadow-sm transition-all text-sm font-medium" title="Add Image"><ImageIcon size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add section floating button (unchanged) */}
                        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
                            <div className="bg-white dark:bg-zinc-800 p-2 rounded-full shadow-2xl border border-gray-200 dark:border-zinc-700 flex items-center">
                                <button onClick={addSection} className="px-6 py-2 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full flex items-center space-x-2 font-semibold text-sm transition-colors"><LayoutList size={20} className="text-purple-500" /> <span>Add New Section</span></button>
                            </div>
                        </div>
                    </div>
                )}

                {/* RESPONSES TAB (with polling already set up) */}
                {activeTab === 'responses' && (
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 space-y-8">
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{responses.length} Responses</h2>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={fetchResponses}
                                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600"
                                >
                                    <Loader2 size={14} className={loadingResponses ? 'animate-spin' : ''} />
                                    <span>Refresh</span>
                                </button>
                                <button
                                    onClick={exportCSV}
                                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                                >
                                    <Download size={16} />
                                    <span>Export CSV</span>
                                </button>
                                <span className={`text-sm font-medium ${form.settings.acceptingResponses ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                    {form.settings.acceptingResponses ? 'Accepting responses' : 'Not accepting responses'}
                                </span>

                                <button
                                    onClick={() => updateSettings('acceptingResponses', !form.settings.acceptingResponses)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.settings.acceptingResponses ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-700'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.settings.acceptingResponses ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <Link to={'/sheets/' + formId} className="p-2 mr-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <Sheet size={18} />
                                </Link>



                            </div>
                        </div>

                        {loadingResponses ? (
                            <div className="flex justify-center py-12"><Loader2 className="animate-spin w-8 h-8 text-blue-500" /></div>
                        ) : responses.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-zinc-400">
                                <Users size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Waiting for responses. Once submitted, charts and data will appear here.</p>
                            </div>
                        ) : (
                            <>
                                {/* Simple charts (unchanged) */}
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
                                                <div key={question.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-zinc-800">
                                                    <h4 className="font-medium mb-2">{question.question || 'Untitled'}</h4>
                                                    <div className="space-y-1">
                                                        {question.options.map(opt => (
                                                            <div key={opt.id} className="flex justify-between text-sm">
                                                                <span>{opt.text}</span>
                                                                <span className="font-semibold">{counts.get(opt.id) || 0}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>

                                {/* Individual responses table (unchanged) */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-2">Individual Responses</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b dark:border-zinc-700">
                                                    <th className="text-left py-2">Submitted</th>
                                                    <th className="text-left py-2">Email</th>
                                                    {form.settings.isQuiz && <th className="text-left py-2">Score</th>}
                                                    <th className="text-left py-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {responses.map(resp => (
                                                    <tr key={resp._id} className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                                        <td className="py-2">{new Date(resp.submittedAt).toLocaleString()}</td>
                                                        <td className="py-2">{resp.respondentEmail || '—'}</td>
                                                        {form.settings.isQuiz && (
                                                            <td className="py-2">
                                                                {resp.totalScore} / {resp.maxScore}
                                                            </td>
                                                        )}
                                                        <td className="py-2">
                                                            <button
                                                                onClick={() => setSelectedResponse(resp)}
                                                                className="text-blue-600 hover:underline text-sm"
                                                            >
                                                                View
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

                {/* SETTINGS TAB (unchanged, already comprehensive) */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        {/* ... (same as before, no changes needed) ... */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Make this a quiz</h3>
                                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Assign point values, set answers, and automatically provide feedback.</p>
                                </div>
                                <button onClick={() => updateSettings('isQuiz', !form.settings.isQuiz)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.settings.isQuiz ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-700'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.settings.isQuiz ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            {form.settings.isQuiz && (
                                <div className="pl-6 border-l-2 border-blue-100 dark:border-blue-900/30 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Release grades</label>
                                        <select
                                            value={form.settings.releaseGrades}
                                            onChange={(e) => updateSettings('releaseGrades', e.target.value)}
                                            className="w-full md:w-64 p-2 border rounded dark:bg-zinc-800"
                                        >
                                            <option value="IMMEDIATELY">Immediately after submission</option>
                                            <option value="MANUALLY">Later, after manual review</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={form.settings.showMissedQuestions}
                                                onChange={(e) => updateSettings('showMissedQuestions', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span>Show missed questions</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={form.settings.showCorrectAnswers}
                                                onChange={(e) => updateSettings('showCorrectAnswers', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span>Show correct answers</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={form.settings.showPointValues}
                                                onChange={(e) => updateSettings('showPointValues', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span>Show point values</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Default points per question</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.settings.defaultQuestionPoints}
                                            onChange={(e) => updateSettings('defaultQuestionPoints', parseInt(e.target.value) || 0)}
                                            className="w-24 p-2 border rounded dark:bg-zinc-800"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Responses</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Collect email addresses</label>
                                    <select
                                        value={form.settings.collectEmails}
                                        onChange={(e) => updateSettings('collectEmails', e.target.value)}
                                        className="w-full md:w-64 p-2 border rounded dark:bg-zinc-800"
                                    >
                                        <option value="DO_NOT_COLLECT">Do not collect</option>
                                        <option value="VERIFIED">Verified (requires login)</option>
                                        <option value="RESPONDER">Responder input</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Send responder a copy</label>
                                    <select
                                        value={form.settings.sendResponderCopy}
                                        onChange={(e) => updateSettings('sendResponderCopy', e.target.value)}
                                        className="w-full md:w-64 p-2 border rounded dark:bg-zinc-800"
                                    >
                                        <option value="OFF">Off</option>
                                        <option value="ON_SUBMIT">On submission</option>
                                        <option value="ON_GRADE">When grades released</option>
                                    </select>
                                </div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={form.settings.allowEditAfterSubmit}
                                        onChange={(e) => updateSettings('allowEditAfterSubmit', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span>Allow responders to edit after submit</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={form.settings.limitToOneResponse}
                                        onChange={(e) => updateSettings('limitToOneResponse', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span>Limit to one response per user</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={form.settings.acceptingResponses}
                                        onChange={(e) => updateSettings('acceptingResponses', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span>Accepting responses</span>
                                </label>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Presentation</h3>
                            <div className="space-y-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={form.settings.showProgressBar}
                                        onChange={(e) => updateSettings('showProgressBar', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span>Show progress bar</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={form.settings.shuffleQuestionOrder}
                                        onChange={(e) => updateSettings('shuffleQuestionOrder', e.target.checked)}
                                        className="rounded"
                                    />
                                    <span>Shuffle question order</span>
                                </label>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Confirmation message</label>
                                    <RichMarkdownEditor initialValue={form.settings.confirmationMessage} onChange={(val) => updateSettings('confirmationMessage', val)} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'access' && (
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Management</h2>

                        <div className="flex items-center justify-between p-6 border rounded-xl dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Form Login Required</h3>
                                <p className="text-sm text-gray-500 dark:text-zinc-400">Require users to log in before they can view or submit this form.</p>
                            </div>
                            <button
                                onClick={() => updateSettings('loginReq', !form.settings.loginReq)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.settings.loginReq ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.settings.loginReq ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        {form.settings.loginReq && (
                            <div className="flex items-center justify-between p-6 border rounded-xl dark:border-zinc-700 bg-[#0078d4]/5 border-[#0078d4]/30 mt-4">
                                <div>
                                    <h3 className="font-semibold text-[#0078d4] dark:text-[#4cc2ff]">Restrict to NIT Kurukshetra</h3>
                                    <p className="text-sm text-gray-600 dark:text-zinc-400">Only allow users with an @nitkkr.ac.in email address to access this form.</p>
                                </div>
                                <button
                                    onClick={() => updateSettings('requireNitkkrDomain', !form.settings.requireNitkkrDomain)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.settings.requireNitkkrDomain ? 'bg-[#0078d4]' : 'bg-gray-300 dark:bg-zinc-700'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.settings.requireNitkkrDomain ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Share Response Sheet Access</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search users by name, email, or roll no..."
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                    className="w-full p-3 border rounded-xl dark:bg-zinc-900 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />

                                {isSearchingUsers && (
                                    <div className="absolute right-4 top-3 text-gray-400">
                                        <Loader2 size={20} className="animate-spin" />
                                    </div>
                                )}

                                {userSearchResults.length > 0 && (
                                    <div className="absolute w-full mt-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                                        {userSearchResults.map(u => (
                                            <div key={u._id} className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer flex justify-between items-center"
                                                onClick={() => {
                                                    if (!(form.collaborators || []).find(c => c.user === u._id)) {
                                                        updateFormHeader('collaborators', [...(form.collaborators || []), { user: u._id, name: u.name, email: u.email, profilePhoto: u.profilePhoto }]);
                                                    }
                                                    setUserSearchQuery('');
                                                    setUserSearchResults([]);
                                                }}>
                                                <div className="flex items-center space-x-3">
                                                    {u.profilePhoto ? <img src={u.profilePhoto} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{u.name.charAt(0)}</div>}
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-900 dark:text-white">{u.name}</p>
                                                        <p className="text-xs text-gray-500">{u.email} {u.rollNo ? `• ${u.rollNo}` : ''}</p>
                                                    </div>
                                                </div>
                                                <PlusCircle size={18} className="text-blue-500" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 space-y-2">
                                {(form.collaborators || []).map((collab, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 border border-gray-200 rounded-xl dark:border-zinc-700 bg-white dark:bg-zinc-900">
                                        <div className="flex items-center space-x-3">
                                            {collab.profilePhoto ? <img src={collab.profilePhoto} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{collab.name?.charAt(0)}</div>}
                                            <div>
                                                <p className="font-medium text-sm text-gray-900 dark:text-white">{collab.name}</p>
                                                <p className="text-xs text-gray-500">{collab.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => updateFormHeader('collaborators', form.collaborators.filter(c => c.user !== collab.user))} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><X size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* SECTION REORDER MODAL (unchanged) */}
                {isSectionModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reorder Sections</h3>
                                <button onClick={() => setIsSectionModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                <ReactSortable
                                    list={tempSections}
                                    setList={setTempSections}
                                    animation={250}
                                    handle=".drag-handle-section"
                                    ghostClass="opacity-40"
                                >
                                    {tempSections.map((s, idx) => (
                                        <div key={s.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg mb-2">
                                            <GripVertical size={20} className="drag-handle-section cursor-grab text-gray-400" />
                                            <span className="font-medium">{s.title || `Section ${idx + 1}`}</span>
                                        </div>
                                    ))}
                                </ReactSortable>
                            </div>
                            <div className="p-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end space-x-3">
                                <button onClick={() => setIsSectionModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                                <button onClick={saveSectionOrder} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Order</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONDITIONAL LOGIC MODAL (unchanged) */}
                {conditionModal.open && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
                            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Conditional Logic</h3>
                                <button onClick={() => setConditionModal({ open: false, sectionId: null, elementId: null })} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                {(() => {
                                    const element = form.sections
                                        .find(s => s.id === conditionModal.sectionId)
                                        ?.elements.find(e => e.id === conditionModal.elementId);
                                    if (!element) return null;
                                    return (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-500 dark:text-zinc-400">Show this question only if all conditions are met:</p>
                                            {element.conditions && element.conditions.map((cond, idx) => (
                                                <div key={idx} className="flex items-center space-x-2 bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg">
                                                    <select
                                                        value={cond.questionId}
                                                        onChange={(e) => {
                                                            const newCond = { ...cond, questionId: e.target.value };
                                                            const newConditions = [...element.conditions];
                                                            newConditions[idx] = newCond;
                                                            updateElement(conditionModal.sectionId, conditionModal.elementId, 'conditions', newConditions);
                                                        }}
                                                        className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2 text-sm flex-1"
                                                    >
                                                        <option value="">Select question</option>
                                                        {allQuestions.map(q => (
                                                            <option key={q.id} value={q.id}>{q.sectionTitle} - {q.question.substring(0, 40)}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={cond.operator || 'equals'}
                                                        onChange={(e) => {
                                                            const newCond = { ...cond, operator: e.target.value };
                                                            const newConditions = [...element.conditions];
                                                            newConditions[idx] = newCond;
                                                            updateElement(conditionModal.sectionId, conditionModal.elementId, 'conditions', newConditions);
                                                        }}
                                                        className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2 text-sm"
                                                    >
                                                        <option value="equals">equals</option>
                                                        <option value="notEquals">not equals</option>
                                                        <option value="contains">contains</option>
                                                        <option value="notContains">not contains</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        placeholder="Value"
                                                        value={cond.value || ''}
                                                        onChange={(e) => {
                                                            const newCond = { ...cond, value: e.target.value };
                                                            const newConditions = [...element.conditions];
                                                            newConditions[idx] = newCond;
                                                            updateElement(conditionModal.sectionId, conditionModal.elementId, 'conditions', newConditions);
                                                        }}
                                                        className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-2 text-sm flex-1"
                                                    />
                                                    <button
                                                        onClick={() => removeCondition(conditionModal.sectionId, conditionModal.elementId, idx)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addCondition(conditionModal.sectionId, conditionModal.elementId, { questionId: '', operator: 'equals', value: '' })}
                                                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                                            >
                                                + Add condition
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-end">
                                <button
                                    onClick={() => setConditionModal({ open: false, sectionId: null, elementId: null })}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Individual response view modal (unchanged) */}
                {selectedResponse && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Response Details</h3>
                                <button onClick={() => setSelectedResponse(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <p className="text-sm text-gray-500 mb-4">Submitted: {new Date(selectedResponse.submittedAt).toLocaleString()}</p>
                                {form.settings.isQuiz && (
                                    <p className="text-sm font-semibold mb-4">Score: {selectedResponse.totalScore} / {selectedResponse.maxScore}</p>
                                )}
                                <div className="space-y-4">
                                    {form.sections.flatMap(s => s.elements).filter(e => !['TEXT_ONLY', 'IMAGE'].includes(e.type)).map(q => {
                                        const answer = selectedResponse.answers.find(a => a.questionId === q.id);
                                        const displayValue = answer ? (Array.isArray(answer.value) ? answer.value.join(', ') : answer.value) : '(No answer)';
                                        return (
                                            <div key={q.id} className="border-b pb-2">
                                                <p className="font-medium">{q.question || 'Untitled'}</p>
                                                <p className="text-sm text-gray-700 dark:text-zinc-300">{displayValue}</p>
                                                {form.settings.isQuiz && answer && (
                                                    <p className="text-xs text-green-600">Points earned: {answer.pointsEarned} / {q.points}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
                                <button onClick={() => setSelectedResponse(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}