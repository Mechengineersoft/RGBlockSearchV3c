import { SearchResult, PolishResult, GrindResult, EpoxyResult } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function searchSheetData(blockNo: string, partNo?: string, thickness?: string): Promise<SearchResult[]> {
  const params = new URLSearchParams();
  params.append('blockNo', blockNo);
  if (partNo) params.append('partNo', partNo);
  if (thickness) params.append('thickness', thickness);

  const response = await apiRequest('GET', `/api/search?${params}`);
  return response.json();
}

export async function getPolishData(blockNo: string, partNo?: string, thickness?: string): Promise<PolishResult[]> {
  const params = new URLSearchParams();
  params.append('blockNo', blockNo);
  if (partNo) params.append('partNo', partNo);
  if (thickness) params.append('thickness', thickness);

  const response = await apiRequest('GET', `/api/polish?${params}`);
  return response.json();
}

export async function getGrindData(blockNo: string, partNo?: string, thickness?: string): Promise<GrindResult[]> {
  const params = new URLSearchParams();
  params.append('blockNo', blockNo);
  if (partNo) params.append('partNo', partNo);
  if (thickness) params.append('thickness', thickness);

  const response = await apiRequest('GET', `/api/grind?${params}`);
  return response.json();
}

export async function getEpoxyData(blockNo: string, partNo?: string, thickness?: string): Promise<EpoxyResult[]> {
  const params = new URLSearchParams();
  params.append('blockNo', blockNo);
  if (partNo) params.append('partNo', partNo);
  if (thickness) params.append('thickness', thickness);

  const response = await apiRequest('GET', `/api/epoxy?${params}`);
  return response.json();
}

export async function getEColData(blockNo: string, partNo?: string, thickness?: string): Promise<EpoxyResult[]> {
  const params = new URLSearchParams();
  params.append('blockNo', blockNo);
  if (partNo) params.append('partNo', partNo);
  if (thickness) params.append('thickness', thickness);

  try {
    const response = await fetch(`/api/ecol?${params}`, {
      credentials: "include",
      headers: {
        "Accept": "application/json"
      }
    });
    
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      const responseText = await response.text();
      
      // Check if the response is HTML (error page) instead of JSON
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Server returned an HTML error page instead of JSON data. Please contact support.");
      }
      
      // Try to parse as JSON if possible
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch (parseError) {
          // If JSON parsing fails, use the raw text
          throw new Error(`Server error: ${responseText || response.statusText}`);
        }
      }
      
      // Default error message
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    
    // Verify content type is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }
    
    return await response.json();
  } catch (error) {
    console.error("ECol data fetch error:", error);
    throw error;
  }
}