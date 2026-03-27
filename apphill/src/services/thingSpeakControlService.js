// ThingSpeak Control Service for Motor, Fertilizer, and Valve Management
// Write API: Updates field values on ThingSpeak
// Read API: Fetches current status from ThingSpeak

const WRITE_API = 'https://api.thingspeak.com/update?api_key=28VB3EVNSX0N4IE2';
const READ_API = 'https://api.thingspeak.com/channels/3259969/feeds.json?api_key=XP2ZYZMV4QHKX03O&results=1';
const LOCK_TIME = 15; // 15 seconds lock after update

/**
 * Field mapping for ThingSpeak:
 * field2 = Fertilizer
 * field3 = Motor
 * field4 = Valve 1
 * field5 = Valve 2
 */

/**
 * Fetch current status from ThingSpeak
 * @returns {Promise<Object>} Status object with motor, fertilizer, valve1, valve2
 */
export const fetchThingSpeakStatus = async () => {
  try {
    console.log('📡 Fetching ThingSpeak status...');
    const response = await fetch(READ_API);
    const json = await response.json();

    if (json.feeds && json.feeds.length > 0) {
      const data = json.feeds[0];
      const status = {
        motor: data.field3 === '1',
        fertilizer: data.field2 === '1',
        valve1: data.field4 === '1',
        valve2: data.field5 === '1',
        timestamp: data.created_at,
      };
      console.log('✅ ThingSpeak Status:', status);
      return status;
    }
    return {
      motor: false,
      fertilizer: false,
      valve1: false,
      valve2: false,
    };
  } catch (err) {
    console.error('❌ ThingSpeak Read Error:', err);
    throw new Error(`Failed to fetch ThingSpeak status: ${err.message}`);
  }
};

/**
 * Update all fields on ThingSpeak
 * @param {number} motor - 1 for ON, 0 for OFF
 * @param {number} fertilizer - 1 for ON, 0 for OFF
 * @param {number} valve1 - 1 for ON, 0 for OFF
 * @param {number} valve2 - 1 for ON, 0 for OFF
 * @returns {Promise<boolean>} Success status
 */
export const updateThingSpeakFields = async (motor, fertilizer, valve1, valve2) => {
  try {
    console.log('📤 Updating ThingSpeak with:', {
      motor,
      fertilizer,
      valve1,
      valve2,
    });

    const url = `${WRITE_API}&field3=${motor}&field2=${fertilizer}&field4=${valve1}&field5=${valve2}`;
    
    const response = await fetch(url, {
      method: 'GET',
      timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.text();
    console.log('✅ ThingSpeak Update Response:', result);

    // Fetch updated status after a short delay
    setTimeout(() => {
      fetchThingSpeakStatus();
    }, 2000);

    return true;
  } catch (err) {
    console.error('❌ ThingSpeak Write Error:', err);
    throw new Error(`Failed to update ThingSpeak: ${err.message}`);
  }
};

/**
 * Toggle motor status
 * @param {Object} currentStatus - Current status object
 * @returns {Promise<boolean>} Success status
 */
export const toggleMotor = async (currentStatus) => {
  const newMotor = currentStatus.motor ? 0 : 1;
  return updateThingSpeakFields(
    newMotor,
    currentStatus.fertilizer ? 1 : 0,
    currentStatus.valve1 ? 1 : 0,
    currentStatus.valve2 ? 1 : 0
  );
};

/**
 * Toggle fertilizer status
 * @param {Object} currentStatus - Current status object
 * @returns {Promise<boolean>} Success status
 */
export const toggleFertilizer = async (currentStatus) => {
  const newFertilizer = currentStatus.fertilizer ? 0 : 1;
  return updateThingSpeakFields(
    currentStatus.motor ? 1 : 0,
    newFertilizer,
    currentStatus.valve1 ? 1 : 0,
    currentStatus.valve2 ? 1 : 0
  );
};

/**
 * Toggle valve 1 status
 * @param {Object} currentStatus - Current status object
 * @returns {Promise<boolean>} Success status
 */
export const toggleValve1 = async (currentStatus) => {
  const newValve1 = currentStatus.valve1 ? 0 : 1;
  return updateThingSpeakFields(
    currentStatus.motor ? 1 : 0,
    currentStatus.fertilizer ? 1 : 0,
    newValve1,
    currentStatus.valve2 ? 1 : 0
  );
};

/**
 * Toggle valve 2 status
 * @param {Object} currentStatus - Current status object
 * @returns {Promise<boolean>} Success status
 */
export const toggleValve2 = async (currentStatus) => {
  const newValve2 = currentStatus.valve2 ? 0 : 1;
  return updateThingSpeakFields(
    currentStatus.motor ? 1 : 0,
    currentStatus.fertilizer ? 1 : 0,
    currentStatus.valve1 ? 1 : 0,
    newValve2
  );
};

/**
 * Set specific device status
 * @param {string} device - 'motor', 'fertilizer', 'valve1', or 'valve2'
 * @param {number} status - 1 for ON, 0 for OFF
 * @param {Object} currentStatus - Current status object
 * @returns {Promise<boolean>} Success status
 */
export const setDeviceStatus = async (device, status, currentStatus) => {
  const value = status ? 1 : 0;
  
  switch (device) {
    case 'motor':
      return updateThingSpeakFields(
        value,
        currentStatus.fertilizer ? 1 : 0,
        currentStatus.valve1 ? 1 : 0,
        currentStatus.valve2 ? 1 : 0
      );
    case 'fertilizer':
      return updateThingSpeakFields(
        currentStatus.motor ? 1 : 0,
        value,
        currentStatus.valve1 ? 1 : 0,
        currentStatus.valve2 ? 1 : 0
      );
    case 'valve1':
      return updateThingSpeakFields(
        currentStatus.motor ? 1 : 0,
        currentStatus.fertilizer ? 1 : 0,
        value,
        currentStatus.valve2 ? 1 : 0
      );
    case 'valve2':
      return updateThingSpeakFields(
        currentStatus.motor ? 1 : 0,
        currentStatus.fertilizer ? 1 : 0,
        currentStatus.valve1 ? 1 : 0,
        value
      );
    default:
      throw new Error(`Unknown device: ${device}`);
  }
};

export const LOCK_TIME_SECONDS = LOCK_TIME;

export default {
  fetchThingSpeakStatus,
  updateThingSpeakFields,
  toggleMotor,
  toggleFertilizer,
  toggleValve1,
  toggleValve2,
  setDeviceStatus,
  LOCK_TIME_SECONDS,
};
