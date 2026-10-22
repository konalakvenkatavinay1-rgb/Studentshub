/**
 * Central Resource & Google Drive Configuration for Student Learning Hub.
 * 
 * Update these URL values as external links become available.
 * Empty strings ('') are gracefully handled across the UI with polite
 * "Coming soon / Awaiting URL" states without dead links or page errors.
 */

// =============================================================================
// 1. GATE 2028 Official Resources URL
// =============================================================================
/**
 * Paste the official GATE 2028 Google Drive or resource repository URL below.
 * Example: 'https://drive.google.com/drive/folders/YOUR_GATE_FOLDER_ID'
 */
export const GATE_RESOURCES_URL: string = '';

// =============================================================================
// 2. BOS Academic Semester Drive Folders (4 Years x 2 Semesters = 8 Entries)
// =============================================================================
/**
 * Individual Google Drive folder links for each of the 8 academic semesters.
 * Year 2 — Semester 1 contains the verified active curriculum folder.
 * Paste remaining semester drive URLs below when ready.
 */
export const SEMESTER_DRIVE_URLS: Record<string, string> = {
  // Year 1
  'Y1_S1': '',
  'Y1_S2': '',
  
  // Year 2 (Y2_S1 is verified active)
  'Y2_S1': 'https://drive.google.com/drive/folders/1tdsZBk58FdWLd0iQsIkNXIv-pUJUB_gW',
  'Y2_S2': '',
  
  // Year 3
  'Y3_S1': '',
  'Y3_S2': '',
  
  // Year 4
  'Y4_S1': '',
  'Y4_S2': '',
};

// =============================================================================
// 3. Backward-Compatible Year Mappings
// =============================================================================
export const YEAR_DRIVE_URLS: Record<
  'YEAR_1_DRIVE_URL' | 'YEAR_2_DRIVE_URL' | 'YEAR_3_DRIVE_URL' | 'YEAR_4_DRIVE_URL',
  string
> = {
  YEAR_1_DRIVE_URL: SEMESTER_DRIVE_URLS['Y1_S1'],
  YEAR_2_DRIVE_URL: SEMESTER_DRIVE_URLS['Y2_S1'],
  YEAR_3_DRIVE_URL: SEMESTER_DRIVE_URLS['Y3_S1'],
  YEAR_4_DRIVE_URL: SEMESTER_DRIVE_URLS['Y4_S1'],
};

export type YearDriveKey = keyof typeof YEAR_DRIVE_URLS;
