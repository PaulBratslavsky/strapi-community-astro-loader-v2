import qs from "qs";
import { strapi } from "@strapi/client";

// Cache the client instance
let strapiClientInstance: any = null;

/**
 * Get or create a Strapi client instance
 * @param strapiUrl The base URL for the Strapi API
 * @returns A configured Strapi client
 */
function getStrapiClient(strapiUrl: string) {
  if (!strapiClientInstance) {
    strapiClientInstance = strapi({ 
      baseURL: `${strapiUrl}/api`
    });
  }
  return strapiClientInstance;
}

/**
 * Fetches data from the Strapi API
 * @param path The API endpoint path
 * @param strapiUrl The base URL of the Strapi API
 * @param params Optional query parameters
 * @returns The JSON response from the API
 */
async function fetchFromStrapi(
  path: string,
  strapiUrl: string,
  params?: object
): Promise<any> {
  console.log("Params from call: ", params);
  
  try {
    const client = getStrapiClient(strapiUrl);
    const apiPath = path.startsWith('/api/') ? path.substring(5) : path;
    
    // Handle schema requests via fetch since they might not be part of content API
    if (apiPath.includes('get-strapi-schema') || apiPath.includes('content-type')) {
      const url = new URL(path, strapiUrl);
      if (params) {
        url.search = qs.stringify(params);
      }
      
      console.log(`Fetching from Strapi via fetch: ${url.href}`);
      const response = await fetch(url.href);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Strapi API error (${response.status}): ${errorText}`);
      }
      
      return response.json();
    }
    
    // Extract content type from path
    // Handle paths like /api/articles, /api/pages, etc.
    const pathParts = apiPath.split('/').filter(Boolean);
    const contentType = pathParts[0]?.replace(/s$/, '') || '';
    
    console.log(`Fetching from Strapi via client: ${contentType} with params:`, params);
    
    if (!contentType) {
      throw new Error(`Invalid API path: ${path}`);
    }
    
    // Use the client collection to fetch data
    const data = await client.collection(contentType).find(params || {});
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch failed")) {
      throw new Error(`Failed to connect to Strapi at ${strapiUrl}. Is the server running?`);
    }
    throw error;
  }
}

/**
 * Gets the pagination information from the Strapi response
 * @param response The Strapi response
 * @returns The pagination information
 */
function getPaginationInfo<
  T extends { meta?: { pagination?: { page: number; pageCount: number } } }
>(response: T) {
  return {
    currentPage: response.meta?.pagination?.page,
    totalPages: response.meta?.pagination?.pageCount,
  };
}

export { fetchFromStrapi, getPaginationInfo }; 