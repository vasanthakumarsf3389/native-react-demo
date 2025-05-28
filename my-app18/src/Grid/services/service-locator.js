// /**
//  * Service locator for dependency injection
//  */
//  export class ServiceLocator {
//   constructor() {
//       this.services = new Map();
//   }

//   /**
//    * Register a service with a name
//    * @param {string} name - Service name
//    * @param {any} service - Service instance
//    */
//   register(name, service) {
//       this.services.set(name, service);
//   }

//   /**
//    * Get a service by name
//    * @param {string} name - Service name
//    * @returns {any} Service instance
//    */
//   getService(name) {
//       return this.services.get(name);
//   }

//   /**
//    * Unregister all services
//    */
//   unregisterAll() {
//       this.services.clear();
//   }
// }

// /**
// * Create a new service locator instance
// * @returns {ServiceLocator} New service locator
// */
// export function createServiceLocator() {
//   return new ServiceLocator();
// }

import { isNullOrUndefined } from '@syncfusion/react-base';

/**
 * Creates a new ServiceLocator instance
 *
 * @returns {Object} A ServiceLocator instance
 */
export const createServiceLocator = () => {
    const servicesMap = {};

    const serviceLocator = {
        /**
         * @returns {Object} The services map
         */
        get services() {
            return servicesMap;
        },

        register: (name, type) => {
            if (isNullOrUndefined(servicesMap[name])) {
                servicesMap[name] = type;
            }
        },

        unregisterAll: () => {
            Object.keys(servicesMap).forEach((key) => {
                delete servicesMap[key];
            });
        },

        getService: (name) => {
            // if (isNullOrUndefined(servicesMap[name])) {
            //     throw new Error(`The service ${name} is not registered`);
            // }
            return servicesMap[name];
        }
    };

    return serviceLocator;
};

