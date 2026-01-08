'use client';

import { useState, useEffect } from 'react';

import { Navbar } from '@/components/Navbar';
import TaskCard from '@/components/Task/TaskCard';
import TaskModal from '@/components/Task/TaskModal';
import { getTasks, createTask, updateTask, completeTask, deleteTask } from '@/services/task.service';
import type { CreateTaskPayload, Task, UpdateTaskPayload } from '@/types';
import { Plus, ListFilter } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [tasks, filter]);

  const applyFilter = () => {
    let filtered = [...tasks];
    
    if (filter === 'active') {
      filtered = filtered.filter(task => !task.isCompleted);
    } else if (filter === 'completed') {
      filtered = filtered.filter(task => task.isCompleted);
    }

    setFilteredTasks(filtered);
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskPayload) => {
    try {
      const newTask = await createTask(data);
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
      throw error;
    }
  };

  const handleUpdateTask = async (data: UpdateTaskPayload) => {
    if (!editingTask) return;

    try {
      const updatedTask = await updateTask(editingTask._id, data);
      setTasks(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task));
      toast.success('Task updated successfully');
      setEditingTask(null);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      throw error;
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      const updatedTask = await completeTask(id);
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task));
      toast.success('Task marked as completed');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to complete task';
      toast.error(message);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      toast.success('Task deleted successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast.error(message);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.isCompleted).length,
    completed: tasks.filter(t => t.isCompleted).length,
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                <p className="text-gray-600 mt-1">Manage your tasks and stay organized</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Task</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="card text-center">
                <p className="text-gray-600 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="card text-center">
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-3xl font-bold text-primary-600 mt-1">{stats.active}</p>
              </div>
              <div className="card text-center">
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <ListFilter className="w-5 h-5 text-gray-600" />
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'active'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'completed'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500 text-lg">
                  {filter === 'all' ? 'No tasks yet. Create your first task!' : `No ${filter} tasks.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          task={editingTask}
        />
      </div>
  );
}