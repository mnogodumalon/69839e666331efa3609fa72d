// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface Kategorien {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    category_name?: string;
    category_description?: string;
    active?: boolean;
    sortorder?: number;
  };
}

export interface Prioritaetsstufen {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    priority_name?: string;
    prioritaet_beschreibung?: string;
    reaction_time?: string;
    active?: boolean;
    sortorder?: number;
  };
}

export interface Statusverwaltung {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    status_name?: string;
    status_description?: string;
    active?: boolean;
    sortorder?: number;
  };
}

export interface Techniker {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    techniker_vorname?: string;
    techniker_nachname?: string;
    techniker_email?: string;
    techniker_telefon?: string;
    specialization?: string;
    active?: boolean;
    sortorder?: number;
    display_name?: string;
  };
}

export const APP_IDS = {
  KATEGORIEN: '69839e0e7f411f503718a8c5',
  PRIORITAETSSTUFEN: '69839e21acb68b5454b34897',
  STATUSVERWALTUNG: '69839e2b2c50fa1991e03803',
  TECHNIKER: '69839e2d2382349e8100f33a',
} as const;

// Helper Types for creating new records
export type CreateKategorien = Kategorien['fields'];
export type CreatePrioritaetsstufen = Prioritaetsstufen['fields'];
export type CreateStatusverwaltung = Statusverwaltung['fields'];
export type CreateTechniker = Techniker['fields'];