import { MaintenanceRequest, MaintenanceWorker, MaintenanceComment, MaintenanceDocument, MaintenanceAnalytics, MaintenanceType, MaintenancePriority, MaintenanceStatus } from '../types/maintenanceTypes';
import { mockMaintenanceRequests, mockMaintenanceWorkers, mockMaintenanceAnalytics } from './mockData';
import api from './api';

/**
 * Service for maintenance-related operations
 */
class MaintenanceService {
  /**
   * Get all maintenance requests
   */
  async getAllRequests(): Promise<MaintenanceRequest[]> {
    // In a real implementation, this would make an API call
    // return api.get('/maintenance/requests').then(response => response.data);
    
    // Using mock data for now
    return Promise.resolve(mockMaintenanceRequests as MaintenanceRequest[]);
  }

  /**
   * Get maintenance requests by building
   */
  async getRequestsByBuilding(buildingId: string): Promise<MaintenanceRequest[]> {
    // In a real implementation, this would make an API call
    // return api.get(`/buildings/${buildingId}/maintenance/requests`).then(response => response.data);
    
    // Using mock data
    const requests = mockMaintenanceRequests.filter(request => request.buildingId === buildingId);
    return Promise.resolve(requests as MaintenanceRequest[]);
  }

  /**
   * Get maintenance requests by unit
   */
  async getRequestsByUnit(unitId: string): Promise<MaintenanceRequest[]> {
    // Using mock data
    const requests = mockMaintenanceRequests.filter(request => request.unitId === unitId);
    return Promise.resolve(requests as MaintenanceRequest[]);
  }

  /**
   * Get maintenance requests by status
   */
  async getRequestsByStatus(status: MaintenanceStatus): Promise<MaintenanceRequest[]> {
    // Using mock data
    const requests = mockMaintenanceRequests.filter(request => request.status === status);
    return Promise.resolve(requests as MaintenanceRequest[]);
  }

  /**
   * Get a single maintenance request by id
   */
  async getRequestById(requestId: string): Promise<MaintenanceRequest> {
    // Using mock data
    const request = mockMaintenanceRequests.find(req => req.id === requestId);
    if (!request) {
      throw new Error(`Maintenance request with id ${requestId} not found`);
    }
    return Promise.resolve(request as MaintenanceRequest);
  }

  /**
   * Create a new maintenance request
   */
  async createRequest(request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceRequest> {
    // In a real implementation, this would make an API call
    // return api.post('/maintenance/requests', request).then(response => response.data);
    
    // Generate mock response
    const newRequest: MaintenanceRequest = {
      ...request,
      id: `${Date.now()}`, // Generate a timestamp-based ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    
    return Promise.resolve(newRequest);
  }

  /**
   * Update a maintenance request
   */
  async updateRequest(requestId: string, updates: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    // In a real implementation, this would make an API call
    // return api.put(`/maintenance/requests/${requestId}`, updates).then(response => response.data);
    
    // Find the request to update
    const request = await this.getRequestById(requestId);
    
    // Apply updates
    const updatedRequest: MaintenanceRequest = {
      ...request,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return Promise.resolve(updatedRequest);
  }

  /**
   * Delete a maintenance request
   */
  async deleteRequest(requestId: string): Promise<boolean> {
    // In a real implementation, this would make an API call
    // return api.delete(`/maintenance/requests/${requestId}`).then(() => true);
    
    // Mock successful deletion
    return Promise.resolve(true);
  }

  /**
   * Add a comment to a maintenance request
   */
  async addComment(
    requestId: string, 
    comment: Omit<MaintenanceComment, 'id' | 'maintenanceRequestId' | 'createdAt'>
  ): Promise<MaintenanceComment> {
    // In a real implementation, this would make an API call
    // return api.post(`/maintenance/requests/${requestId}/comments`, comment)
    //   .then(response => response.data);
    
    // Generate mock response
    const newComment: MaintenanceComment = {
      ...comment,
      id: `${Date.now()}`,
      maintenanceRequestId: requestId,
      createdAt: new Date().toISOString()
    };
    
    return Promise.resolve(newComment);
  }

  /**
   * Upload an image to a maintenance request
   */
  async uploadImage(requestId: string, imageFile: File): Promise<string> {
    // In a real implementation, this would upload a file
    // const formData = new FormData();
    // formData.append('image', imageFile);
    // return api.post(`/maintenance/requests/${requestId}/images`, formData)
    //   .then(response => response.data.imageUrl);
    
    // Mock image URL
    return Promise.resolve(`https://example.com/images/${Date.now()}.jpg`);
  }

  /**
   * Upload a document to a maintenance request
   */
  async uploadDocument(
    requestId: string, 
    document: File, 
    name: string, 
    uploadedById: string, 
    uploadedByName: string
  ): Promise<MaintenanceDocument> {
    // In a real implementation, this would upload a file
    // const formData = new FormData();
    // formData.append('document', document);
    // formData.append('name', name);
    // formData.append('uploadedById', uploadedById);
    // formData.append('uploadedByName', uploadedByName);
    // return api.post(`/maintenance/requests/${requestId}/documents`, formData)
    //   .then(response => response.data);
    
    // Mock document response
    const newDocument: MaintenanceDocument = {
      id: `${Date.now()}`,
      maintenanceRequestId: requestId,
      name,
      url: `https://example.com/documents/${Date.now()}.pdf`,
      type: document.type || 'application/pdf',
      size: document.size || 0,
      uploadedById,
      uploadedByName,
      createdAt: new Date().toISOString()
    };
    
    return Promise.resolve(newDocument);
  }

  /**
   * Get all maintenance workers
   */
  async getAllWorkers(): Promise<MaintenanceWorker[]> {
    // In a real implementation, this would make an API call
    // return api.get('/maintenance/workers').then(response => response.data);
    
    // Using mock data
    return Promise.resolve(mockMaintenanceWorkers as MaintenanceWorker[]);
  }

  /**
   * Get maintenance workers by specialty
   */
  async getWorkersBySpecialty(specialty: MaintenanceType): Promise<MaintenanceWorker[]> {
    // Using mock data
    const workers = mockMaintenanceWorkers.filter(worker => 
      worker.specialties.includes(specialty as any)
    );
    return Promise.resolve(workers as MaintenanceWorker[]);
  }

  /**
   * Get available maintenance workers
   */
  async getAvailableWorkers(): Promise<MaintenanceWorker[]> {
    // Using mock data
    const workers = mockMaintenanceWorkers.filter(worker => 
      worker.availability === 'available'
    );
    return Promise.resolve(workers as MaintenanceWorker[]);
  }

  /**
   * Assign a maintenance request to a worker
   */
  async assignRequestToWorker(
    requestId: string, 
    workerId: string, 
    workerName: string
  ): Promise<MaintenanceRequest> {
    // In a real implementation, this would make an API call
    // return api.put(`/maintenance/requests/${requestId}/assign`, {
    //   workerId,
    //   workerName
    // }).then(response => response.data);
    
    // Update the request with the assigned worker
    return this.updateRequest(requestId, {
      assignedToId: workerId,
      assignedToName: workerName,
      status: 'in-progress',
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Update the status of a maintenance request
   */
  async updateRequestStatus(
    requestId: string, 
    status: MaintenanceStatus, 
    resolutionDetails?: string
  ): Promise<MaintenanceRequest> {
    // Prepare updates based on the new status
    const updates: Partial<MaintenanceRequest> = { status };
    
    if (status === 'in-progress' && !resolutionDetails) {
      updates.startedAt = new Date().toISOString();
    } else if (status === 'resolved') {
      updates.completedAt = new Date().toISOString();
      if (resolutionDetails) {
        updates.resolutionDetails = resolutionDetails;
      }
    }
    
    // Update the request
    return this.updateRequest(requestId, updates);
  }

  /**
   * Get maintenance analytics
   */
  async getAnalytics(buildingId?: string): Promise<MaintenanceAnalytics> {
    // In a real implementation, this would make an API call
    // const url = buildingId 
    //   ? `/buildings/${buildingId}/maintenance/analytics` 
    //   : '/maintenance/analytics';
    // return api.get(url).then(response => response.data);
    
    // Using mock data
    return Promise.resolve({
      ...mockMaintenanceAnalytics,
      buildingId
    } as MaintenanceAnalytics);
  }
}

export const maintenanceService = new MaintenanceService(); 