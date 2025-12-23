
import { GlobalData } from './types';
import { globalData as localFallback } from './data';

const CMS_CONFIG = {
  enabled: false,
  maxRetries: 3,
  retryDelay: 1000, // base delay
  endpoint: 'https://cdn.contentful.com/spaces/YOUR_SPACE_ID/environments/master/entries',
  accessToken: 'YOUR_ACCESS_TOKEN'
};

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchProfileData = async (retryCount = 0): Promise<GlobalData> => {
  if (!CMS_CONFIG.enabled) {
    return localFallback;
  }

  try {
    const response = await fetch(CMS_CONFIG.endpoint, {
      headers: {
        Authorization: `Bearer ${CMS_CONFIG.accessToken}`
      },
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) throw new Error(`CMS HTTP ${response.status}`);
    
    const data = await response.json();
    return data as GlobalData;
  } catch (error) {
    if (retryCount < CMS_CONFIG.maxRetries) {
      console.warn(`CMS Fetch Attempt ${retryCount + 1} failed. Retrying...`);
      await wait(CMS_CONFIG.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
      return fetchProfileData(retryCount + 1);
    }
    
    console.error("CMS Final failure, reverting to hardened local data.");
    return localFallback;
  }
};
