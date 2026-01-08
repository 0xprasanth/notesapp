/**
 * Task type matching backend Task model
 */
export interface Task {
  _id: string;
  title: string;
  description?: string;
  deadline: string; // ISO date string
  isCompleted: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create task payload
 */
export interface CreateTaskPayload {
  title: string;
  description?: string;
  deadline: string; // ISO date string
}

/**
 * Update task payload (all fields optional)
 */
export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  deadline?: string;
  isCompleted?: boolean;
}


