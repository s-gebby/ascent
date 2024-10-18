import { useState, useEffect, Fragment } from 'react'
import Sidebar from './Sidebar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { createJournalEntry, getJournalEntries, updateJournalEntry } from '../utils/database'
import { Button, TextInput, Select, MultiSelect, Textarea, Modal } from '@mantine/core'
import { jsPDF } from 'jspdf';
import { Menu, Transition } from '@headlessui/react';
import { ArrowDownTrayIcon, BellIcon, UserCircleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { CalendarIcon, TagIcon } from '@heroicons/react/20/solid'
import { TrashIcon } from '@heroicons/react/20/solid';
import { deleteJournalEntry } from '../utils/database';
import { useNavigate } from 'react-router-dom';



export default function Journal() {
  const [entries, setEntries] = useState([])
  const [newEntry, setNewEntry] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const prompts = [
    "Today, I'm feeling...",
    "The most interesting thing that happened today was...",
    "I'm grateful for...",
    "My goals for tomorrow are...",
    "A challenge I faced today was...",
  ];

  useEffect(() => {
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);

  const auth = getAuth()
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };
  
  const handleExport = (format) => {
    if (format === 'pdf' && selectedEntry) {
      const doc = new jsPDF();
      const lineHeight = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      doc.setFontSize(18);
      doc.text(selectedEntry.title, margin, 20);

      doc.setFontSize(12);
      doc.text(`Date: ${new Date(selectedEntry.date).toLocaleDateString()}`, margin, 35);
      doc.text(`Category: ${selectedEntry.category}`, margin, 45);

      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(selectedEntry.text, pageWidth - 2 * margin);
      doc.text(splitText, margin, 60);

      doc.save(`journal_entry_${selectedEntry.id}.pdf`);
    }
  };

  const categoryOptions = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'health', label: 'Health' },
    { value: 'finance', label: 'Finance' },
    { value: 'other', label: 'Other' },
  ]

  const categoryColors = {
    personal: 'bg-ascend-green',
    work: 'bg-ascend-blue',
    health: 'bg-ascend-pink',
    finance: 'bg-ascend-orange',
    other: 'bg-gray-600'
  };
  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])
  const fetchEntries = async () => {
    if (user) {
      const fetchedEntries = await getJournalEntries(user.uid)
      if (fetchedEntries) {
        setEntries(fetchedEntries)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newEntry.trim() && user) {
      await createJournalEntry(user.uid, {
        title,
        text: newEntry,
        category,
        date: new Date().toISOString(),
      })
      setTitle('')
      setNewEntry('')
      setCategory('')
      fetchEntries()
    }
  }

  const handleDeleteEntry = (entry) => {
    setEntryToDelete(entry);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (entryToDelete && auth.currentUser) {
      await deleteJournalEntry(auth.currentUser.uid, entryToDelete.id);
      fetchEntries();
      setIsDeleteModalOpen(false);
      setEntryToDelete(null);
    }
  };

  const filterEntries = () => {
    return entries.filter(entry => {
      const matchesSearch = (entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                            (entry.text?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                            (entry.category?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      return matchesSearch
    })
  }
  
  const ExportMenu = ({ onExport }) => (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-ascend-black">
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          Export
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-ascend-blue text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors duration-150`}
                  onClick={() => onExport('pdf')}
                >
                  <DocumentArrowDownIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Export as PDF
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
return (
  <div className="flex flex-col md:flex-row min-h-screen bg-ascend-white">
    <Sidebar 
      isOpen={isSidebarOpen} 
      setIsOpen={setIsSidebarOpen}
    />
    <div className="flex-1 flex flex-col h-screen">
      <header className="bg-white z-10 p-4 shadow-md">
        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-2xl font-semibold text-ascend-black">Journal</h2>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 items-center">
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Find..."
                className="w-full sm:w-auto pl-2 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ascend-green focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <p className="text-xs font-bold text-ascend-black">
                  Welcome, {user.displayName || 'Goal Ascender'}!
                </p>
              )}
              {user && user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-ascend-green"
                  onClick={() => navigate('/account')}
                />
              ) : (
                <UserCircleIcon 
                  className="h-8 w-8 text-gray-600 cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-ascend-green rounded-full" 
                  onClick={() => navigate('/account')}
                />
              )}
              <BellIcon className="h-6 w-6 text-gray-600 duration-1000"/>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-3/4 m-6 overflow-y-auto flex-grow">
          <div className="bg-white border border-gray-300 rounded-sm p-4 md:p-6 mb-4 md:mb-6 col-span-full">
            <h3 className="text-lg text-ascend-black mb-4">New Journal Entry</h3>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              className="mb-3"
            />
            <div className="flex flex-wrap gap-2 mb-3">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCategory(option.value)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    category === option.value
                      ? `${categoryColors[option.value]} text-white`
                      : 'bg-ascend-white text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <Textarea 
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder={prompt}
              className="mb-3"
              minRows={15}
              maxRows={25}
              maxLength={7500}
            />
            <div className="flex justify-between items-center">
              <Button onClick={() => setPrompt(prompts[Math.floor(Math.random() * prompts.length)])}>
                New Prompt
              </Button>
              <Button onClick={handleSubmit} color="ascend-blue">Save Entry</Button>
            </div>
          </div>
        </div>

        {/* Journal entries section */}
        <div className="w-full md:w-1/4 bg-white border border-gray-300 overflow-y-auto m-6">
          <div className="p-4">
            <h3 className="text-lg text-ascend-black mb-4 text-center">Journal Entries</h3>
            <TextInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search entries..."
              className="mb-4"
            />
            <div className="space-y-4">
              {filterEntries().map(entry => (
                <div 
                  key={entry.id} 
                  className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative"
                >
                  <div onClick={() => handleEntryClick(entry)}>
                    <h3 className="font-archivo font-semibold text-sm text-ascend-black mb-1 truncate pr-6">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${categoryColors[entry.category]}`}></span>
                      {entry.title}
                    </h3>
                    <div className="flex flex-wrap items-center text-xs text-gray-600 mb-1">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      <span className="mr-2">{new Date(entry.date).toLocaleDateString()}</span>
                      <TagIcon className="h-3 w-3 mr-1" />
                      <span>{entry.category}</span>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2">{entry.text}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEntry(entry);
                    }}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
      {/* Modal for displaying full entry content */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEntry?.title}
        size="xl"
      >
        {selectedEntry && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600">{new Date(selectedEntry.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">{selectedEntry.category}</p>
              </div>
              <ExportMenu onExport={handleExport} />
            </div>
            <p className="mb-4 whitespace-pre-wrap">{selectedEntry.text}</p>
          </div>
        )}
      </Modal>
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <p>Are you sure you want to delete this entry?</p>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsDeleteModalOpen(false)} variant="outline" className="mr-2">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="red">
            Delete
          </Button>
        </div>
      </Modal>
    </div>
)}

