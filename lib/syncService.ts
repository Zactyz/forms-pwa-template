import { getUnsyncedResponses, markResponseAsSynced } from './formResponses';
import { IFormDestination } from "@/db/types/formTemplate";
import { IFormResponse } from "@/db/types/formResponse";

/**
 * Service to handle syncing of offline form responses when online
 */
export class SyncService {
    private isOnline: boolean;
    private isSyncing: boolean;
    private syncListeners: Function[];

    constructor() {
        this.isOnline = navigator ? navigator.onLine : false;
        this.isSyncing = false;
        this.syncListeners = [];

        // Set up event listeners for online/offline status
        if (typeof window !== 'undefined') {
            window.addEventListener('online', this.handleOnline);
            window.addEventListener('offline', this.handleOffline);
        }
    }

    /**
     * Handle when the browser goes online
     */
    private handleOnline = () => {
        this.isOnline = true;
        this.sync();
    };

    /**
     * Handle when the browser goes offline
     */
    private handleOffline = () => {
        this.isOnline = false;
    };

    /**
     * Add a listener for sync events
     */
    public addSyncListener(listener: Function) {
        this.syncListeners.push(listener);
    }

    /**
     * Remove a sync listener
     */
    public removeSyncListener(listener: Function) {
        this.syncListeners = this.syncListeners.filter(l => l !== listener);
    }

    /**
     * Notify all listeners of a sync event
     */
    private notifyListeners(event: 'start' | 'complete' | 'error', data?: any) {
        this.syncListeners.forEach(listener => {
            try {
                listener(event, data);
            } catch (error) {
                console.error('Error in sync listener:', error);
            }
        });
    }

    /**
     * Manually trigger a sync
     */
    public async sync() {
        if (!this.isOnline || this.isSyncing) {
            return;
        }

        this.isSyncing = true;
        this.notifyListeners('start');

        try {
            // Get all unsynced responses
            const unsyncedResponses = await getUnsyncedResponses();
            console.log(`Found ${unsyncedResponses.length} unsynced responses`);

            if (unsyncedResponses.length === 0) {
                this.isSyncing = false;
                this.notifyListeners('complete', { synced: 0 });
                return;
            }

            // In a real application, this would make API calls to a backend server
            // For our MVP, we'll just mark them as synced locally
            const syncPromises = unsyncedResponses.map(async (response) => {
                // Simulate an API call with a short delay
                await new Promise(resolve => setTimeout(resolve, 500));

                if (response.id) {
                    await markResponseAsSynced(response.id as number);
                    return true;
                }
                return false;
            });

            // Wait for all sync operations to complete
            const results = await Promise.all(syncPromises);
            const syncedCount = results.filter(Boolean).length;

            this.notifyListeners('complete', { synced: syncedCount });
        } catch (error) {
            console.error('Error syncing responses:', error);
            this.notifyListeners('error', error);
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Cleanup event listeners
     */
    public destroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('online', this.handleOnline);
            window.removeEventListener('offline', this.handleOffline);
        }
        this.syncListeners = [];
    }

    /**
     * Process a form response through specified destinations
     * @param response The form response to process
     * @param destinations The destinations to send the response to
     */
    async processDestinations(response: IFormResponse, destinations?: IFormDestination[]) {
        if (!destinations || destinations.length === 0) {
            console.log('No destinations configured for this form');
            return;
        }

        this.notifyListeners('start', { response });

        for (const destination of destinations) {
            if (!destination.enabled) continue;

            try {
                switch (destination.type) {
                    case 'email':
                        await this.processEmailDestination(response, destination);
                        break;
                    case 'api':
                        await this.processApiDestination(response, destination);
                        break;
                    case 'database':
                        await this.processDatabaseDestination(response, destination);
                        break;
                    case 'file':
                        await this.processFileDestination(response, destination);
                        break;
                    default:
                        console.warn(`Unknown destination type: ${destination.type}`);
                }
            } catch (error) {
                console.error(`Error processing destination ${destination.name}:`, error);
                this.notifyListeners('error', { response, destination, error });
            }
        }

        this.notifyListeners('complete', { response });
    }

    /**
     * Process an email destination
     */
    private async processEmailDestination(response: IFormResponse, destination: IFormDestination) {
        console.log(`[Mock] Sending email to ${destination.config.recipient}`);
        // In a real implementation, this would send an email
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    /**
     * Process an API destination
     */
    private async processApiDestination(response: IFormResponse, destination: IFormDestination) {
        console.log(`[Mock] Sending data to API endpoint: ${destination.config.url}`);
        // In a real implementation, this would make an API call
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    /**
     * Process a database destination
     */
    private async processDatabaseDestination(response: IFormResponse, destination: IFormDestination) {
        console.log(`[Mock] Storing data in external database: ${destination.config.connectionString}`);
        // In a real implementation, this would store data in an external database
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    /**
     * Process a file destination
     */
    private async processFileDestination(response: IFormResponse, destination: IFormDestination) {
        console.log(`[Mock] Generating ${destination.config.format} file`);
        // In a real implementation, this would generate and save a file
        return new Promise(resolve => setTimeout(resolve, 500));
    }
}

// Create a singleton instance
export const syncService = typeof window !== 'undefined' ? new SyncService() : null;

/**
 * Hook to initialize sync service and register for sync events
 */
export function initializeSync() {
    // Check if we're in the browser environment
    if (syncService) {
        // Do an initial sync check
        if (navigator.onLine) {
            syncService.sync();
        }
    }
} 