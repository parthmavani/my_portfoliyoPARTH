import { useState, useEffect, useMemo } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import Toast from './Toast';
import Auth from './Auth';
import { getTasks, createTask, updateTask, deleteTask, getMe, generateAiDescription } from '../api';
import './Projects.css';

function Projects() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiNotice, setAiNotice] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'high' | 'medium' | 'low'

  // Inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');

  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUser(null);
    setTasks([]);
    showToast('Logged out successfully', 'info');
  };

  const handleAuthError = (err) => {
    if (err.message === 'Unauthorized') {
      handleLogout();
      showToast('Session expired. Please sign in again.', 'error');
    } else {
      setError(err.message);
    }
  };

  const fetchAllTasks = (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    else setLoading(true);

    setError(null);
    getTasks()
      .then((data) => {
        if (data.success) {
          setTasks(data.data || []);
        }
      })
      .catch(handleAuthError)
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((data) => {
          setUser(data.user);
          fetchAllTasks();
        })
        .catch(() => {
          handleLogout();
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Create Task Handler
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false
    };

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = { ...newTask, _id: tempId, createdAt: new Date().toISOString() };
    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const data = await createTask(newTask);
      if (data.success) {
        setTasks((prev) => prev.map((t) => (t._id === tempId ? data.data : t)));
        showToast('Task created successfully');
        setTitle('');
        setDescription('');
        setPriority('medium');
        setAiNotice(null);
      } else {
        throw new Error(data.message || 'Failed to create task');
      }
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      showToast(err.message || 'Failed to create task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Practical 13: Generate Description and Priority with Gemini AI
  const handleGenerateAIDescription = async () => {
    if (!title.trim()) {
      showToast('Please type a task title first so AI has context.', 'info');
      return;
    }

    setGeneratingAI(true);
    setAiNotice(null);

    try {
      const data = await generateAiDescription(title.trim());
      if (data && data.success && data.description) {
        setDescription(data.description);
        if (data.suggestedPriority) {
          setPriority(data.suggestedPriority);
        }

        if (data.fallback) {
          setAiNotice({
            type: 'fallback',
            text: '⚡ Fallback Mode: Generated locally. Review or edit before saving.'
          });
          showToast('Offline AI fallback applied.', 'info');
        } else {
          setAiNotice({
            type: 'ai',
            text: `✨ Powered by Gemini AI: Suggested description & ${data.suggestedPriority || 'medium'} priority applied. Review before saving.`
          });
          showToast('AI description generated successfully!', 'success');
        }
      } else {
        throw new Error(data.error || 'Failed to generate AI suggestion');
      }
    } catch (err) {
      showToast(err.message || 'AI generation encountered an error', 'error');
    } finally {
      setGeneratingAI(false);
    }
  };

  // Toggle Complete Handler
  const handleToggleComplete = async (task) => {
    const updated = { ...task, completed: !task.completed };
    setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));

    try {
      const data = await updateTask(task._id, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: !task.completed
      });
      if (data.success) {
        setTasks((prev) => prev.map((t) => (t._id === task._id ? data.data : t)));
        showToast(updated.completed ? 'Task marked as completed' : 'Task restored to active');
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (err) {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      showToast(err.message || 'Error updating task', 'error');
    }
  };

  // Start Edit Mode
  const startEditing = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
  };

  // Cancel Edit Mode
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Save Edit Handler
  const handleSaveEdit = async (id, currentCompleted) => {
    if (!editTitle.trim()) {
      showToast('Task title is required', 'error');
      return;
    }

    try {
      const data = await updateTask(id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        completed: currentCompleted
      });
      if (data.success) {
        setTasks((prev) => prev.map((t) => (t._id === id ? data.data : t)));
        setEditingId(null);
        showToast('Task updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update task');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'error');
    }
  };

  // Delete Task Handler
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      const data = await deleteTask(id);
      if (data.success) {
        showToast('Task deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete task');
      }
    } catch (err) {
      setTasks(previousTasks);
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  // Filtered tasks computation
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search matching
      const matchesSearch =
        (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      // Status matching
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !t.completed) ||
        (statusFilter === 'completed' && t.completed);

      // Priority matching
      const matchesPriority =
        priorityFilter === 'all' || (t.priority || '').toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Metrics computation
  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const high = tasks.filter((t) => !t.completed && t.priority === 'high').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, active, high, completionRate };
  }, [tasks]);

  return (
    <div className="task-dashboard-container">
      {/* Page Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Task Management Dashboard</h1>
        <p className="dashboard-subtitle">
          Organize, prioritize, and track your daily tasks in real-time.
        </p>
      </div>

      {!user ? (
        <Auth
          onAuthSuccess={(userData) => {
            setUser(userData);
            fetchAllTasks();
          }}
        />
      ) : (
        <>
          {/* User Session Bar */}
          <div className="session-bar">
            <div className="user-profile">
              <div className="avatar">
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <span className="user-email">{user.email}</span>
                <span className="user-status-pill">
                  <span className="pulse-dot"></span> Active Session
                </span>
              </div>
            </div>

            <div className="session-actions">
              <button
                type="button"
                className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
                onClick={() => fetchAllTasks(true)}
                title="Refresh Tasks from Server"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                </svg>
                <span>Refresh</span>
              </button>
              <button type="button" className="logout-btn" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon-wrap total">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
                </svg>
              </div>
              <div>
                <span className="kpi-label">Total Tasks</span>
                <span className="kpi-value">{metrics.total}</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-wrap active">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <span className="kpi-label">In Progress</span>
                <span className="kpi-value">{metrics.active}</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-wrap completed">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <span className="kpi-label">Completed ({metrics.completionRate}%)</span>
                <span className="kpi-value">{metrics.completed}</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon-wrap urgent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div>
                <span className="kpi-label">High Priority</span>
                <span className="kpi-value">{metrics.high}</span>
              </div>
            </div>
          </div>

          {/* New Task Creator Form Card */}
          <div className="create-task-card">
            <h2 className="create-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create New Task
            </h2>

            <form onSubmit={handleCreateTask} className="task-input-form">
              <div className="form-row">
                <input
                  type="text"
                  className="task-title-input"
                  placeholder="Task title (e.g. Implement caching layer)..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="ai-assist-row">
                <button
                  type="button"
                  className="ai-suggest-btn"
                  onClick={handleGenerateAIDescription}
                  disabled={generatingAI || !title.trim()}
                  title="Generate task description and suggest priority with Gemini AI"
                >
                  {generatingAI ? (
                    <>
                      <span className="btn-spinner ai-spinner"></span>
                      <span>Gemini Thinking...</span>
                    </>
                  ) : (
                    <>
                      <span className="ai-sparkle">✨</span>
                      <span>Auto-Generate with AI</span>
                    </>
                  )}
                </button>
                {aiNotice && (
                  <span className={`ai-notice-badge ${aiNotice.type}`}>
                    {aiNotice.text}
                  </span>
                )}
              </div>

              <div className="form-row">
                <textarea
                  className="task-desc-input"
                  placeholder="Optional description, notes, or details..."
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-bottom-bar">
                <div className="priority-selector">
                  <span className="priority-label">Priority:</span>
                  <div className="priority-chips">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`priority-chip ${p} ${priority === p ? 'selected' : ''}`}
                        onClick={() => setPriority(p)}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="add-task-btn" disabled={submitting || !title.trim()}>
                  {submitting ? (
                    <span className="btn-spinner"></span>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      <span>Add Task</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="toolbar-wrapper">
            <div className="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search tasks by title or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>

            <div className="filters-group">
              <div className="status-tabs">
                <button
                  type="button"
                  className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  All ({metrics.total})
                </button>
                <button
                  type="button"
                  className={`status-tab ${statusFilter === 'active' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('active')}
                >
                  Active ({metrics.active})
                </button>
                <button
                  type="button"
                  className={`status-tab ${statusFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('completed')}
                >
                  Completed ({metrics.completed})
                </button>
              </div>

              <select
                className="priority-dropdown"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Content Area */}
          {loading && <Spinner />}

          {!loading && error && (
            <ErrorMessage message={error} onRetry={() => fetchAllTasks()} />
          )}

          {!loading && !error && (
            <div className="task-list">
              {filteredTasks.length === 0 ? (
                <div className="empty-state-card">
                  <div className="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                  </div>
                  <h3>No tasks found</h3>
                  <p>
                    {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                      ? 'No tasks matched your current filter or search criteria.'
                      : 'You have no tasks in your workspace. Use the form above to add your first task!'}
                  </p>
                  {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
                    <button
                      type="button"
                      className="reset-filters-btn"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setPriorityFilter('all');
                      }}
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`task-card ${task.completed ? 'is-completed' : ''} priority-${task.priority}`}
                  >
                    {editingId === task._id ? (
                      /* Inline Edit Mode */
                      <div className="edit-form-wrap">
                        <input
                          type="text"
                          className="edit-title-input"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Task title"
                          required
                        />
                        <textarea
                          className="edit-desc-input"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Task description (optional)"
                          rows="2"
                        />
                        <div className="edit-bottom-bar">
                          <select
                            className="edit-priority-select"
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                          <div className="edit-actions">
                            <button
                              type="button"
                              className="save-edit-btn"
                              onClick={() => handleSaveEdit(task._id, task.completed)}
                            >
                              Save Changes
                            </button>
                            <button type="button" className="cancel-edit-btn" onClick={cancelEditing}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Normal Display Mode */
                      <>
                        <div className="task-main-content">
                          <button
                            type="button"
                            className={`checkbox-btn ${task.completed ? 'checked' : ''}`}
                            onClick={() => handleToggleComplete(task)}
                            title={task.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
                          >
                            {task.completed && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                          </button>

                          <div className="task-text-block">
                            <div className="task-headline">
                              <h3 className="task-title">{task.title}</h3>
                              <span className={`priority-badge ${task.priority}`}>
                                {task.priority}
                              </span>
                            </div>

                            {task.description && (
                              <p className="task-description">{task.description}</p>
                            )}

                            {task.createdAt && (
                              <span className="task-date">
                                Added {new Date(task.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="task-card-actions">
                          <button
                            type="button"
                            className="action-icon-btn edit"
                            onClick={() => startEditing(task)}
                            title="Edit Task"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>

                          <button
                            type="button"
                            className="action-icon-btn delete"
                            onClick={() => handleDeleteTask(task._id)}
                            title="Delete Task"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Projects;
