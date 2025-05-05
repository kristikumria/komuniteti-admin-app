import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../navigation/types';
import { notificationService } from '../../services/notificationService';

// Define the state interface
interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  currentNotification: Notification | null;
  permissionsRequested: boolean;
  permissionsGranted: boolean;
}

// Initial state
const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
  currentNotification: null,
  permissionsRequested: false,
  permissionsGranted: false,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await notificationService.getNotifications(userId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await notificationService.getUnreadCount(userId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchNotificationById = createAsyncThunk(
  'notifications/fetchNotificationById',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      return await notificationService.getNotificationById(notificationId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      return await notificationService.markAsRead(notificationId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (userId: string, { rejectWithValue, dispatch }) => {
    try {
      await notificationService.markAllAsRead(userId);
      // After marking all as read, fetch the updated list
      dispatch(fetchNotifications(userId));
      return true;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData: Omit<Notification, 'id' | 'timestamp'>, { rejectWithValue }) => {
    try {
      return await notificationService.createNotification(notificationData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

// Create the slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotification: (state) => {
      state.currentNotification = null;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    receiveNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    setPermissionsRequested: (state, action: PayloadAction<boolean>) => {
      state.permissionsRequested = action.payload;
    },
    setPermissionsGranted: (state, action: PayloadAction<boolean>) => {
      state.permissionsGranted = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all notifications
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
      state.loading = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(notification => !notification.read).length;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Fetch unread count
    builder.addCase(fetchUnreadCount.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUnreadCount.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.unreadCount = action.payload;
    });
    builder.addCase(fetchUnreadCount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Fetch notification by ID
    builder.addCase(fetchNotificationById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNotificationById.fulfilled, (state, action: PayloadAction<Notification>) => {
      state.loading = false;
      state.currentNotification = action.payload;
    });
    builder.addCase(fetchNotificationById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Mark as read
    builder.addCase(markAsRead.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(markAsRead.fulfilled, (state, action: PayloadAction<Notification>) => {
      state.loading = false;
      
      // Update the notification in the list
      state.notifications = state.notifications.map(notification => 
        notification.id === action.payload.id ? action.payload : notification
      );
      
      // Update current notification if it's the same one
      if (state.currentNotification && state.currentNotification.id === action.payload.id) {
        state.currentNotification = action.payload;
      }
      
      // Recalculate unread count
      state.unreadCount = state.notifications.filter(notification => !notification.read).length;
    });
    builder.addCase(markAsRead.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Mark all as read (we don't need to handle fulfilled case directly as it triggers fetchNotifications)
    builder.addCase(markAllAsRead.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(markAllAsRead.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Create notification
    builder.addCase(createNotification.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createNotification.fulfilled, (state, action: PayloadAction<Notification>) => {
      state.loading = false;
      state.notifications.unshift(action.payload); // Add to the beginning of the array
      
      // Update unread count if the new notification is unread
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    });
    builder.addCase(createNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Delete notification
    builder.addCase(deleteNotification.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteNotification.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      
      // Check if the deleted notification was unread
      const deletedNotification = state.notifications.find(n => n.id === action.payload);
      if (deletedNotification && !deletedNotification.read) {
        state.unreadCount -= 1;
      }
      
      // Remove from the list
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
      
      // Clear current notification if it's the same one
      if (state.currentNotification && state.currentNotification.id === action.payload) {
        state.currentNotification = null;
      }
    });
    builder.addCase(deleteNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { 
  clearCurrentNotification, 
  resetUnreadCount, 
  receiveNotification, 
  setPermissionsRequested, 
  setPermissionsGranted 
} = notificationsSlice.actions;
export default notificationsSlice.reducer; 