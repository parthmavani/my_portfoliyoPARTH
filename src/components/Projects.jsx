import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import Skills from './Skills';
import Toast from './Toast';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import './Projects.css';

function Projects({ skillsData }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  
  const [toast, setToast] = useState(null);

  const fetchAllTasks = () => {
    setLoading(true);
    setError(null);
    getTasks()
      .then((data) => {
        if (data.success) {
          setTasks(data.data);
        } else {
          throw new Error(data.message || 'Error fetching tasks');
        }
      })
      .catch((err) => setError(err.message || 'Error fetching tasks'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = { title, description, priority, completed: false };
    // Optimistic update
    const tempId = Date.now().toString();
    const optimisticTask = { ...newTask, _id: tempId };
    setTasks([optimisticTask, ...tasks]);

    createTask(newTask)
      .then((data) => {
        if (data.success) {
          setTasks((prevTasks) => prevTasks.map(t => t._id === tempId ? data.data : t));
          showToast('Task created successfully');
          setTitle('');
          setDescription('');
          setPriority('medium');
        } else {
          throw new Error(data.message || 'Error creating task');
        }
      })
      .catch((err) => {
        setTasks((prevTasks) => prevTasks.filter(t => t._id !== tempId));
        showToast(err.message || 'Error creating task', 'error');
      });
  };

  const handleToggleComplete = (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    updateTask(task._id, updatedTask)
      .then((data) => {
        if (data.success) {
          setTasks((prevTasks) => prevTasks.map(t => t._id === task._id ? data.data : t));
          showToast('Task updated successfully');
        } else {
          throw new Error(data.message || 'Error updating task');
        }
      })
      .catch((err) => showToast(err.message || 'Error updating task', 'error'));
  };

  const handleDeleteTask = (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    deleteTask(id)
      .then((data) => {
        if (data.success) {
          setTasks((prevTasks) => prevTasks.filter(t => t._id !== id));
          showToast('Task deleted successfully');
        } else {
          throw new Error(data.message || 'Error deleting task');
        }
      })
      .catch((err) => showToast(err.message || 'Error deleting task', 'error'));
  };

  return (
    <div className="projects-container">
      <h2 className="projects-title">Task Manager (Practical 6)</h2>
      <p className="projects-subtitle">
        Full-Stack Integration - React Frontend with Node/Express/MongoDB Backend
      </p>

      <form onSubmit={handleCreateTask} className="task-form" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Create New Task</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit" style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add Task
          </button>
        </div>
      </form>

      {loading && <Spinner />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={fetchAllTasks} />
      )}

      {!loading && !error && (
        <div className="task-list">
          {tasks.length === 0 ? (
            <p>No tasks found. Create one above!</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #eee', marginBottom: '10px', borderRadius: '4px', background: task.completed ? '#f8f9fa' : 'white' }}>
                <div>
                  <h4 style={{ textDecoration: task.completed ? 'line-through' : 'none', margin: '0 0 5px 0' }}>{task.title}</h4>
                  <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>{task.description}</p>
                  <span style={{ fontSize: '12px', padding: '2px 6px', background: '#e9ecef', borderRadius: '4px' }}>Priority: {task.priority}</span>
                </div>
                <div>
                  <button onClick={() => handleToggleComplete(task)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>
                    {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <button onClick={() => handleDeleteTask(task._id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <hr style={{ margin: '3rem 0 2rem 0', borderColor: '#e2e8f0' }} />

      <h2 className="projects-title">Technical Skills & Expertise</h2>
      {skillsData && <Skills skills={skillsData} />}

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
