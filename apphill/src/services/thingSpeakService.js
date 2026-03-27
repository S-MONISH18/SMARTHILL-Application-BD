/**
 * ThingSpeak Service
 * Fetches real-time sensor data from ThingSpeak channel
 */

const THINGSPEAK_CHANNEL_ID = '3232296';
const THINGSPEAK_API_URL = `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json`;

/**
 * Parse comma-separated field values
 */
const parseFieldValues = (fieldStr) => {
  if (!fieldStr) return [];
  return fieldStr.split(',').map(v => {
    const parsed = parseFloat(v.trim());
    return isNaN(parsed) ? 0 : parsed;
  });
};

/**
 * Fetch the latest sensor reading from ThingSpeak channel
 * Returns an object with parsed sensor fields for multiple nodes
 *
 * Data structure:
 * - field1: Node 1 data (ph, temp readings, etc as comma-separated)
 * - field2: Node 2 data (ph, temp readings, etc as comma-separated)
 * - field3: NPK sensor data (N,P,K as comma-separated)
 * - field4: User ID
 */
export const fetchLatestSensorReading = async (timeoutMs = 15000) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`${THINGSPEAK_API_URL}?results=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`ThingSpeak API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract latest feed entry
    if (data.feeds && data.feeds.length > 0) {
      const latestFeed = data.feeds[0];

      // Parse comma-separated values for each node
      const node1Values = parseFieldValues(latestFeed.field1);
      const node2Values = parseFieldValues(latestFeed.field2);
      const npkValues = parseFieldValues(latestFeed.field3);

      return {
        success: true,
        timestamp: latestFeed.created_at,
        entryId: latestFeed.entry_id,
        
        // Node 1 data (from field1)
        node1: {
          ph: node1Values[0] || 0,
          temperature: node1Values[1] || 0,
          waterLevel: node1Values[2] || 0,
          ldr: node1Values[3] || 0,  // Light Dependent Resistor (LDR) value
        },

        // Node 2 data (from field2)
        node2: {
          ph: node2Values[0] || 0,
          temperature: node2Values[1] || 0,
          waterLevel: node2Values[2] || 0,
          ldr: node2Values[3] || 0,  // Light Dependent Resistor (LDR) value
        },

        // NPK Sensor data (from field3)
        npk: {
          nitrogen: npkValues[0] || 0,
          phosphorus: npkValues[1] || 0,
          potassium: npkValues[2] || 0,
        },

        userId: latestFeed.field4 || null,

        // Raw data for flexibility
        rawData: latestFeed,
      };
    }

    return {
      success: false,
      error: 'No feed data available',
    };
  } catch (error) {
    console.error('❌ ThingSpeak fetch error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to fetch sensor data',
    };
  }
};

/**
 * Fetch multiple sensor readings (for historical data)
 */
export const fetchSensorReadings = async (resultsCount = 10, timeoutMs = 15000) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`${THINGSPEAK_API_URL}?results=${resultsCount}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`ThingSpeak API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.feeds && data.feeds.length > 0) {
      const parsedFeeds = data.feeds.map(feed => ({
        timestamp: feed.created_at,
        entryId: feed.entry_id,
        soilMoisture: feed.field1 ? parseInt(feed.field1) : 0,
        temperature: feed.field2 ? parseInt(feed.field2) : 0,
        humidity: feed.field3 ? parseInt(feed.field3) : 0,
        ph: feed.field4 ? parseFloat(feed.field4) : 0,
        npk: feed.field5 ? feed.field5 : 'N/A',
      }));

      return {
        success: true,
        data: parsedFeeds,
      };
    }

    return {
      success: false,
      error: 'No feed data available',
    };
  } catch (error) {
    console.error('❌ ThingSpeak historical fetch error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to fetch historical data',
    };
  }
};

export default {
  fetchLatestSensorReading,
  fetchSensorReadings,
};
