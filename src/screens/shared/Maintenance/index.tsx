// Export all maintenance components from a central location
import { MaintenanceList } from './MaintenanceList';
import { 
  MaintenanceDetail, 
  MaintenanceForm, 
  MaintenanceWorkers, 
  MaintenanceWorkerDetail, 
  MaintenanceAnalyticsComponent 
} from './MaintenanceComponents';
import { MaintenanceTabletLayout } from './MaintenanceTabletLayout';
import { MaintenanceDetails } from './MaintenanceDetails';

export { 
  MaintenanceList,
  MaintenanceDetail, 
  MaintenanceForm, 
  MaintenanceWorkers, 
  MaintenanceWorkerDetail, 
  MaintenanceDetails,
  MaintenanceTabletLayout,
  MaintenanceAnalyticsComponent as MaintenanceAnalytics
}; 