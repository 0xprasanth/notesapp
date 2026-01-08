export const validateEmail = (email: string): string | null => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };
  
  export const validatePassword = (password: string): string | null => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };
  
  export const validateName = (name: string): string | null => {
    if (!name) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (name.trim().length > 50) {
      return 'Name cannot exceed 50 characters';
    }
    return null;
  };
  
  export const validateTaskTitle = (title: string): string | null => {
    if (!title) {
      return 'Task title is required';
    }
    if (title.trim().length < 3) {
      return 'Title must be at least 3 characters long';
    }
    if (title.trim().length > 200) {
      return 'Title cannot exceed 200 characters';
    }
    return null;
  };
  
  export const validateTaskDescription = (description: string): string | null => {
    if (description && description.length > 1000) {
      return 'Description cannot exceed 1000 characters';
    }
    return null;
  };
  
  export const validateDeadline = (deadline: string): string | null => {
    if (!deadline) {
      return 'Deadline is required';
    }
    const deadlineDate = new Date(deadline);
    const now = new Date();
    
    if (isNaN(deadlineDate.getTime())) {
      return 'Please enter a valid date';
    }
    
    if (deadlineDate <= now) {
      return 'Deadline must be in the future';
    }
    
    return null;
  };