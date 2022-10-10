import { CustomerStep } from './customer-step.service';
import { NotificationStep } from './notification-step.service';

export const subscribeOrchestratorSteps = {
  notificationStep: NotificationStep,
  customerStep: CustomerStep,
};
