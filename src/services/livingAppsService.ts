// AUTOMATICALLY GENERATED SERVICE
import { APP_IDS } from '@/types/app';
import type { Kategorien, Prioritaetsstufen, Statusverwaltung, Techniker } from '@/types/app';

// Base Configuration
const API_BASE_URL = 'https://my.living-apps.de/rest';

// --- HELPER FUNCTIONS ---
export function extractRecordId(url: string | null | undefined): string | null {
  if (!url) return null;
  // Extrahiere die letzten 24 Hex-Zeichen mit Regex
  const match = url.match(/([a-f0-9]{24})$/i);
  return match ? match[1] : null;
}

export function createRecordUrl(appId: string, recordId: string): string {
  return `https://my.living-apps.de/rest/apps/${appId}/records/${recordId}`;
}

async function callApi(method: string, endpoint: string, data?: any) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // Nutze Session Cookies für Auth
    body: data ? JSON.stringify(data) : undefined
  });
  if (!response.ok) throw new Error(await response.text());
  // DELETE returns often empty body or simple status
  if (method === 'DELETE') return true;
  return response.json();
}

export class LivingAppsService {
  // --- KATEGORIEN ---
  static async getKategorien(): Promise<Kategorien[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.KATEGORIEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getKategorienEntry(id: string): Promise<Kategorien | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.KATEGORIEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createKategorienEntry(fields: Kategorien['fields']) {
    return callApi('POST', `/apps/${APP_IDS.KATEGORIEN}/records`, { fields });
  }
  static async updateKategorienEntry(id: string, fields: Partial<Kategorien['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.KATEGORIEN}/records/${id}`, { fields });
  }
  static async deleteKategorienEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.KATEGORIEN}/records/${id}`);
  }

  // --- PRIORITAETSSTUFEN ---
  static async getPrioritaetsstufen(): Promise<Prioritaetsstufen[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.PRIORITAETSSTUFEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getPrioritaetsstufenEntry(id: string): Promise<Prioritaetsstufen | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.PRIORITAETSSTUFEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createPrioritaetsstufenEntry(fields: Prioritaetsstufen['fields']) {
    return callApi('POST', `/apps/${APP_IDS.PRIORITAETSSTUFEN}/records`, { fields });
  }
  static async updatePrioritaetsstufenEntry(id: string, fields: Partial<Prioritaetsstufen['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.PRIORITAETSSTUFEN}/records/${id}`, { fields });
  }
  static async deletePrioritaetsstufenEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.PRIORITAETSSTUFEN}/records/${id}`);
  }

  // --- STATUSVERWALTUNG ---
  static async getStatusverwaltung(): Promise<Statusverwaltung[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.STATUSVERWALTUNG}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getStatusverwaltungEntry(id: string): Promise<Statusverwaltung | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.STATUSVERWALTUNG}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createStatusverwaltungEntry(fields: Statusverwaltung['fields']) {
    return callApi('POST', `/apps/${APP_IDS.STATUSVERWALTUNG}/records`, { fields });
  }
  static async updateStatusverwaltungEntry(id: string, fields: Partial<Statusverwaltung['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.STATUSVERWALTUNG}/records/${id}`, { fields });
  }
  static async deleteStatusverwaltungEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.STATUSVERWALTUNG}/records/${id}`);
  }

  // --- TECHNIKER ---
  static async getTechniker(): Promise<Techniker[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.TECHNIKER}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getTechnikerEntry(id: string): Promise<Techniker | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.TECHNIKER}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createTechnikerEntry(fields: Techniker['fields']) {
    return callApi('POST', `/apps/${APP_IDS.TECHNIKER}/records`, { fields });
  }
  static async updateTechnikerEntry(id: string, fields: Partial<Techniker['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.TECHNIKER}/records/${id}`, { fields });
  }
  static async deleteTechnikerEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.TECHNIKER}/records/${id}`);
  }

}