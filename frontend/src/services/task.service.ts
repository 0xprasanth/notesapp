import api from "./api";
import type { Task, CreateTaskPayload, UpdateTaskPayload, ApiResponse } from "@/types";

/**
 * Get all tasks for the authenticated user
 */
export async function getTasks(isCompleted?: boolean): Promise<Task[]> {
  const params = isCompleted !== undefined ? { isCompleted: String(isCompleted) } : {};
  const response = await api.get<ApiResponse<Task[]>>("/tasks", { params });
  return response.data.data;
}

/**
 * Get a single task by ID
 */
export async function getTaskById(id: string): Promise<Task> {
  const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
  return response.data.data;
}

/**
 * Create a new task
 */
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await api.post<ApiResponse<Task>>("/tasks", payload);
  return response.data.data;
}

/**
 * Update an existing task
 */
export async function updateTask(
  id: string,
  payload: UpdateTaskPayload
): Promise<Task> {
  const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, payload);
  return response.data.data;
}

/**
 * Mark a task as completed
 */
export async function completeTask(id: string): Promise<Task> {
  const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/complete`);
  return response.data.data;
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}



