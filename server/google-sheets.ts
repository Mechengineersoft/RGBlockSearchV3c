import { google } from "googleapis";
import { SearchResult, InsertUser, User, GrindResult, GPStockResult, SummaryResult, CPStockResult, Summary2Result } from "@shared/schema";
import { config } from './config';

export async function getGPStockData(blockNo: string, partNo?: string, thickness?: string): Promise<GPStockResult[]> {
  try {
    console.log('Starting GPStock search with params:', { blockNo, partNo });

    if (!blockNo || blockNo.trim() === '') {
      console.log('Block number is empty or undefined');
      return [];
    }

    const range = "GPStock!A2:S";
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE',
    });

    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    const results = response.data.values
      .filter(row => {
        if (!row[1]) { // Block number is in column B (index 1)
          console.log('Skipping row with no block number');
          return false;
        }

        const rowBlockNo = String(row[1]).toLowerCase().trim();
        const rowPartNo = row[2] ? String(row[2]).toLowerCase().trim() : '';
        const rowThickness = row[6] ? String(row[6]).toLowerCase().trim() : '';
        const searchBlockNo = blockNo.toLowerCase().trim();
        const searchPartNo = partNo ? partNo.toLowerCase().trim() : '';
        const searchThickness = thickness ? thickness.toLowerCase().trim() : '';

        const matchesBlock = rowBlockNo === searchBlockNo;
        const matchesPart = !searchPartNo || rowPartNo === searchPartNo;
        const matchesThickness = !searchThickness || rowThickness.includes(searchThickness);

        return matchesBlock && matchesPart && matchesThickness;
      })
      .map((row): GPStockResult => ({
        slicingDate: String(row[0] || ''),
        blockNo: String(row[1] || ''),
        partNo: String(row[2] || ''),
        colorName: String(row[3] || ''),
        length: String(row[4] || ''),
        height: String(row[5] || ''),
        thickness: String(row[6] || ''),
        nos: String(row[7] || ''),
        dispatched: String(row[8] || ''),
        eCut: String(row[9] || ''),
        balance: String(row[10] || ''),
        balanceStockNos: String(row[11] || ''),
        m2: String(row[12] || ''),
        remarks: String(row[13] || ''),
        location: String(row[14] || ''),
        mainLocation: String(row[15] || ''),
        colourName: String(row[16] || ''),
        subColour: String(row[17] || ''),
        sp: String(row[18] || ''),
        remark2: String(row[19] || '')
      }));

    console.log(`Returning ${results.length} GPStock results`);
    return results;
  } catch (error) {
    console.error('Error in getGPStockData:', error);
    throw error;
  }
}

interface DisReportResult {
  blockNo: string;
  thickness: string;
  o_column: string;
  p_column: string;
  q_column: string;
  r_column: string;
}

const auth = new google.auth.GoogleAuth({
  credentials: config.googleServiceAccount,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = config.googleSheetsId;

export async function getCPStockData(blockNo: string, partNo?: string, thickness?: string): Promise<CPStockResult[]> {
  try {
    console.log('Starting CPStock search with params:', { blockNo, partNo });

    if (!blockNo || blockNo.trim() === '') {
      console.log('Block number is empty or undefined');
      return [];
    }

    const range = "CPStock!A2:W";
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE',
    });

    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    const results = response.data.values
      .filter(row => {
        if (!row[3]) { // Block number is in column D (index 3)
          console.log('Skipping row with no block number');
          return false;
        }

        const rowBlockNo = String(row[3]).toLowerCase().trim();
        const rowPartNo = row[4] ? String(row[4]).toLowerCase().trim() : '';
        const rowThickness = row[7] ? String(row[7]).toLowerCase().trim() : '';
        const searchBlockNo = blockNo.toLowerCase().trim();
        const searchPartNo = partNo ? partNo.toLowerCase().trim() : '';
        const searchThickness = thickness ? thickness.toLowerCase().trim() : '';

        const matchesBlock = rowBlockNo === searchBlockNo;
        const matchesPart = !searchPartNo || rowPartNo === searchPartNo;
        const matchesThickness = !searchThickness || rowThickness.includes(searchThickness);

        return matchesBlock && matchesPart && matchesThickness;
      })
      .map((row): CPStockResult => ({
        type: String(row[0] || ''),
        slicedOn: String(row[1] || ''),
        colourName: String(row[2] || ''),
        blockNo: String(row[3] || ''),
        partNo: String(row[4] || ''),
        length: String(row[5] || ''),
        height: String(row[6] || ''),
        thickness: String(row[7] || ''),
        nos: String(row[8] || ''),
        dispatched: String(row[9] || ''),
        edgeCutting: String(row[10] || ''),
        balance: String(row[11] || ''),
        m2: String(row[12] || ''),
        sidePc: String(row[13] || ''),
        location: String(row[14] || ''),
        remarks: String(row[15] || ''),
        facColour: String(row[16] || ''),
        subColour: String(row[17] || ''),
        check: String(row[18] || ''),
        null: String(row[19] || ''),
        d: String(row[20] || ''),
        act: String(row[21] || ''),
        r: String(row[22] || '')
      }));

    console.log(`Returning ${results.length} CPStock results`);
    return results;
  } catch (error) {
    console.error('Error in getCPStockData:', error);
    throw error;
  }
}

export async function getSummary2Data(blockNo: string, partNo?: string, thickness?: string): Promise<Summary2Result[]> {
  try {
    console.log('Starting Summary2 search with params:', { blockNo, partNo });

    if (!blockNo || blockNo.trim() === '') {
      console.log('Block number is empty or undefined');
      return [];
    }

    const range = "Summary2!A2:S";
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE',
    });

    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    const results = response.data.values
      .filter(row => {
        if (!row[0]) { // Block number is in column A (index 0)
          console.log('Skipping row with no block number');
          return false;
        }

        const rowBlockNo = String(row[0]).toLowerCase().trim();
        const rowPartNo = row[1] ? String(row[1]).toLowerCase().trim() : '';
        const rowThickness = row[2] ? String(row[2]).toLowerCase().trim() : '';
        const searchBlockNo = blockNo.toLowerCase().trim();
        const searchPartNo = partNo ? partNo.toLowerCase().trim() : '';
        const searchThickness = thickness ? thickness.toLowerCase().trim() : '';

        const matchesBlock = rowBlockNo === searchBlockNo;
        const matchesPart = !searchPartNo || rowPartNo === searchPartNo;
        const matchesThickness = !searchThickness || rowThickness.includes(searchThickness);

        return matchesBlock && matchesPart && matchesThickness;
      })
      .map((row): Summary2Result => ({
        blockNo: String(row[0] || ''),
        part: String(row[1] || ''),
        thkCm: String(row[2] || ''),
        slicing1: String(row[3] || ''),
        export2: String(row[4] || ''),
        rework3: String(row[5] || ''),
        edgeCut4: String(row[6] || ''),
        pkl5: String(row[7] || ''),
        ctrStock6: String(row[8] || ''),
        stock6: String(row[9] || ''),
        d7: String(row[10] || ''),
        ds7: String(row[11] || ''),
        ec7: String(row[12] || ''),
        s7: String(row[13] || ''),
        sold9: String(row[14] || ''),
        add: String(row[15] || ''),
        ds: String(row[16] || ''),
        edgeCutting: String(row[17] || '')
      }));

    console.log(`Returning ${results.length} Summary2 results`);
    return results;
  } catch (error) {
    console.error('Error in getSummary2Data:', error);
    throw error;
  }
}

export async function getDisReportData(blockNo: string, thickness?: string): Promise<DisReportResult[]> {
  try {
    console.log('Starting Dis Report search with params:', { blockNo, thickness });

    // Validate input parameters
    if (!blockNo || blockNo.trim() === '') {
      console.log('Block number is empty or undefined');
      return [];
    }

    // Specify the range for columns O through R in the "Data2" tab
    const range = "Data2!O:R"; // Fetch all rows from columns O-R
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE', // Get the raw values
    });

    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    // Filter and map the rows to DisReportResult objects
    const results = response.data.values
      .filter(row => {
        if (!row[0]) { // Column O (block number)
          console.log('Skipping row with no block number in column O');
          return false;
        }

        const rowBlockNo = String(row[0]).toLowerCase().trim(); // Column O
        const rowThickness = row[1] ? String(row[1]).toLowerCase().trim() : ''; // Column P
        const searchBlockNo = blockNo.toLowerCase().trim();
        const searchThickness = thickness ? thickness.toLowerCase().trim() : '';

        console.log('Comparing values:', {
          rowBlockNo,
          searchBlockNo,
          rowThickness,
          searchThickness
        });

        const matchesBlock = rowBlockNo === searchBlockNo;
        const matchesThickness = !searchThickness || rowThickness.includes(searchThickness);

        console.log('Match results:', {
          matchesBlock,
          matchesThickness
        });

        if (matchesBlock && matchesThickness) {
          console.log('Found matching row for Dis Report:', row);
        }

        return matchesBlock && matchesThickness;
      })
      .map((row): DisReportResult => ({
        blockNo: row[0] || '', // Column O
        thickness: row[1] || '', // Column P
        o_column: row[0] || '', // Column O
        p_column: row[1] || '', // Column P
        q_column: row[2] || '', // Column Q
        r_column: row[3] || '', // Column R
      }));

    console.log(`Returning ${results.length} Dis Report results`);
    return results;
  } catch (error) {
    console.error('Error in getDisReportData:', error);
    throw error;
  }
}

import { MastersheetResult } from '@shared/schema';

export async function getSummaryData(blockNo: string, partNo?: string, thickness?: string): Promise<SummaryResult[]> {
  try {
    console.log('Starting Summary search with params:', { blockNo, partNo });

    if (!blockNo || blockNo.trim() === '') {
      console.log('Block number is empty or undefined');
      return [];
    }

    const range = "Summary!A2:S";
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE',
    });

    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    const results = response.data.values
      .filter(row => {
        if (!row[0]) { // Block number is in column A (index 0)
          console.log('Skipping row with no block number');
          return false;
        }

        const rowBlockNo = String(row[0]).toLowerCase().trim();
        const rowPartNo = row[1] ? String(row[1]).toLowerCase().trim() : '';
        const rowThickness = row[2] ? String(row[2]).toLowerCase().trim() : '';
        const searchBlockNo = blockNo.toLowerCase().trim();
        const searchPartNo = partNo ? partNo.toLowerCase().trim() : '';
        const searchThickness = thickness ? thickness.toLowerCase().trim() : '';

        const matchesBlock = rowBlockNo === searchBlockNo;
        const matchesPart = !searchPartNo || rowPartNo === searchPartNo;
        const matchesThickness = !searchThickness || rowThickness.includes(searchThickness);

        return matchesBlock && matchesPart && matchesThickness;
      })
      .map((row): SummaryResult => ({
        blockNo: String(row[0] || ''),
        partNo: String(row[1] || ''),
        thkCm: String(row[2] || ''),
        slicing: String(row[3] || ''),
        export: String(row[4] || ''),
        rework: String(row[5] || ''),
        edgeCut: String(row[6] || ''),
        pkl: String(row[7] || ''),
        ctrStock: String(row[8] || ''),
        stock: String(row[9] || ''),
        d: String(row[10] || ''),
        dS: String(row[11] || ''),
        eC: String(row[12] || ''),
        s: String(row[13] || ''),
        sold: String(row[14] || ''),
        add: String(row[15] || ''),
        dSlash: String(row[16] || ''),
        edgeCutting: String(row[17] || '')
      }));

    console.log(`Returning ${results.length} Summary results`);
    return results;
  } catch (error) {
    console.error('Error in getSummaryData:', error);
    throw error;
  }
}

export async function getMastersheetData(blockNo: string, partNo?: string, thickness?: string): Promise<MastersheetResult[]> {
  try {
    console.log('Starting Mastersheet search with params:', { blockNo, partNo });

    if (!blockNo || blockNo.trim() === '') {
      console.log('Block number is empty or undefined');
      return [];
    }

    const range = "Mastersheet!A2:AZ";
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
      valueRenderOption: 'UNFORMATTED_VALUE',
    });

    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    const results = response.data.values
      .filter(row => {
        if (!row[0]) {
          console.log('Skipping row with no block number');
          return false;
        }

        const rowBlockNo = String(row[0]).toLowerCase().trim();
        const rowPartNo = row[1] ? String(row[1]).toLowerCase().trim() : '';
        const rowThickness = row[2] ? String(row[2]).toLowerCase().trim() : '';
        const searchBlockNo = blockNo.toLowerCase().trim();
        const searchPartNo = partNo ? partNo.toLowerCase().trim() : '';
        const searchThickness = thickness ? thickness.toLowerCase().trim() : '';

        const matchesBlock = rowBlockNo === searchBlockNo;
        const matchesPart = !searchPartNo || rowPartNo === searchPartNo;
        const matchesThickness = !searchThickness || rowThickness.includes(searchThickness);

        return matchesBlock && matchesPart && matchesThickness;
      })
      .map((row): MastersheetResult => ({
        blockNo: String(row[0] || ''),
        partNo: String(row[1] || ''),
        facStoneColor: String(row[2] || ''),
        subColor: String(row[3] || ''),
        mnL: String(row[4] || ''),
        mnH: String(row[5] || ''),
        mnW: String(row[6] || ''),
        mnCbm: String(row[7] || ''),
        fnL: String(row[8] || ''),
        fnH: String(row[9] || ''),
        fnW: String(row[10] || ''),
        fnCbm: String(row[11] || ''),
        location: String(row[12] || ''),
        type: String(row[13] || ''),
        remarks2: String(row[14] || ''),
        rcvdDt: String(row[15] || ''),
        markerNo: String(row[16] || ''),
        sp: String(row[17] || ''),
        mgL: String(row[18] || ''),
        mgH: String(row[19] || ''),
        mgW: String(row[20] || ''),
        mgCbm: String(row[21] || ''),
        quality: String(row[22] || ''),
        shift: String(row[23] || ''),
        mc: String(row[24] || ''),
        date: String(row[25] || ''),
        slabL: String(row[26] || ''),
        slabH: String(row[27] || ''),
        t1_6: String(row[28] || ''),
        t1_8: String(row[29] || ''),
        t2: String(row[30] || ''),
        t3: String(row[31] || ''),
        t4: String(row[32] || ''),
        t5: String(row[33] || ''),
        t6: String(row[34] || ''),
        t7: String(row[35] || ''),
        t8: String(row[36] || ''),
        t10: String(row[37] || ''),
        t12: String(row[38] || ''),
        t15: String(row[39] || ''),
        t20: String(row[40] || ''),
        t25: String(row[41] || ''),
        width: String(row[42] || ''),
        sliceNos: String(row[43] || ''),
        leftOverWidth: String(row[44] || ''),
        wastePctFn: String(row[45] || ''),
        wastePctFn5: String(row[46] || ''),
        wastePctMn: String(row[47] || ''),
        total: String(row[48] || ''),
        oprSft: String(row[49] || ''),
        sln: String(row[50] || ''),
        stDate: String(row[51] || ''),
        r: String(row[52] || '')
      }));

    console.log(`Returning ${results.length} Mastersheet results`);
    return results;
  } catch (error) {
    console.error('Error in getMastersheetData:', error);
    throw error;
  }
}



interface DisRptResult {
  blockNo: string;
  partNo: string;
  thickness: string;
  nos: string;
  m2: string;
}

export async function getDisRptData(blockNo: string, partNo?: string, thickness?: string): Promise<DisRptResult[]> {
  try {
    console.log('Starting main page 2 search with params:', { blockNo, partNo, thickness });

    // Specify the exact range in the "Data3" tab
    const range = "Data3!A2:E"; // Columns A through E, starting from row 2
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    // Filter and map the rows to DisRptResult objects
    const results = response.data.values
      .filter(row => {
        if (!row[0]) {
          console.log('Skipping row with no block number');
          return false;
        }

        const rowBlockNo = row[0].toString().toLowerCase();
        const rowPartNo = row[1]?.toString().toLowerCase() || '';
        const rowThickness = row[2]?.toString().toLowerCase() || '';

        const matchesBlock = rowBlockNo === blockNo.toLowerCase();
        const matchesPart = !partNo || rowPartNo === partNo.toLowerCase();
        const matchesThickness = !thickness || rowThickness === thickness.toLowerCase();

        const matches = matchesBlock && matchesPart && matchesThickness;
        if (matches) {
          console.log('Found matching row:', row);
        }

        return matches;
      })
      .map((row): DisRptResult => ({
        blockNo: row[0] || '',
        partNo: row[1] || '',
        thickness: row[2] || '',
        nos: row[3] || '',
        m2: row[4] || ''
      }));

    console.log(`Returning ${results.length} results`);
    return results;
  } catch (error) {
    console.error('Error in getDisRptData:', error);
    throw error;
  }
}

export async function getGrindData(blockNo: string, partNo?: string, thickness?: string): Promise<GrindResult[]> {
  try {
    console.log('Starting Grind search with params:', { blockNo, partNo, thickness });

    // Specify the exact range in the "Grind" tab
    const range = "Grind!A2:N"; // Columns A through N, starting from row 2
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    // Filter and map the rows to GrindResult objects
    const results = response.data.values
      .filter(row => {
        if (!row[0]) {
          console.log('Skipping row with no block number');
          return false;
        }

        const rowBlockNo = row[0].toString().toLowerCase();
        const rowPartNo = row[1]?.toString().toLowerCase() || '';
        const rowThickness = row[2]?.toString().toLowerCase() || '';

        const matchesBlock = rowBlockNo === blockNo.toLowerCase();
        const matchesPart = !partNo || rowPartNo === partNo.toLowerCase();
        const matchesThickness = !thickness || rowThickness === thickness.toLowerCase();

        const matches = matchesBlock && matchesPart && matchesThickness;
        if (matches) {
          console.log('Found matching row:', row);
        }

        return matches;
      })
      .map((row): GrindResult => ({
        blockNo: row[0] || '',       // Block No
        partNo: row[1] || '',        // Part
        thickness: row[2] || '',     // Thk cm
        finish: row[3] || '',        // Finish
        nos: row[4] || '',           // Nos
        re: row[5] || '',            // Re
        lCm: row[6] || '',           // L cm
        hCm: row[7] || '',           // H cm
        sft: row[8] || '',           // Sft
        date: row[9] || '',          // Date
        shift: row[10] || '',        // Shift
        machine: row[11] || '',      // Machine
        remark: row[12] || '',       // Remark
        slabNo: row[13] || ''        // Slab No
      }));

    console.log(`Returning ${results.length} Grind results`);
    return results;
  } catch (error) {
    console.error('Error in getGrindData:', error);
    throw error;
  }
}

export async function getPolishData(blockNo: string, partNo?: string, thickness?: string): Promise<PolishResult[]> {
  try {
    console.log('Starting Polish search with params:', { blockNo, partNo, thickness });

    // Specify the exact range in the "Polish" tab
    const range = "Polish!A2:N"; // Columns A through N, starting from row 2
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    // Filter and map the rows to PolishResult objects
    const results = response.data.values
      .filter(row => {
        if (!row[0]) {
          console.log('Skipping row with no block number');
          return false;
        }

        const rowBlockNo = row[0].toString().toLowerCase();
        const rowPartNo = row[1]?.toString().toLowerCase() || '';
        const rowThickness = row[2]?.toString().toLowerCase() || '';

        const matchesBlock = rowBlockNo === blockNo.toLowerCase();
        const matchesPart = !partNo || rowPartNo === partNo.toLowerCase();
        const matchesThickness = !thickness || rowThickness === thickness.toLowerCase();

        const matches = matchesBlock && matchesPart && matchesThickness;
        if (matches) {
          console.log('Found matching row:', row);
        }

        return matches;
      })
      .map((row): PolishResult => ({
        blockNo: row[0] || '',       // Block No
        partNo: row[1] || '',        // Part
        thickness: row[2] || '',     // Thk cm
        finish: row[3] || '',        // Finish
        nos: row[4] || '',           // Nos
        re: row[5] || '',            // Re
        lCm: row[6] || '',           // L cm
        hCm: row[7] || '',           // H cm
        sft: row[8] || '',           // Sft
        date: row[9] || '',          // Date
        shift: row[10] || '',        // Shift
        machine: row[11] || '',      // Machine
        remark: row[12] || '',       // Remark
        slabNo: row[13] || ''        // Slab No
      }));

    console.log(`Returning ${results.length} Polish results`);
    return results;
  } catch (error) {
    console.error('Error in getPolishData:', error);
    throw error;
  }
}

export async function getEpoxyData(blockNo: string, partNo?: string, thickness?: string): Promise<SearchResult[]> {
  try {
    console.log('Starting Epoxy search with params:', { blockNo, partNo, thickness });

    // Specify the exact range in the "Epoxy" tab
    const range = "Epoxy!A2:T"; // Columns A through T, starting from row 2 (including Factory Color and Sub Color)
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    // Filter and map the rows to SearchResult objects
    const results = response.data.values
      .filter(row => {
        if (!row[0]) {
          console.log('Skipping row with no block number');
          return false;
        }

        const rowBlockNo = row[0].toString().toLowerCase();
        const rowPartNo = row[1]?.toString().toLowerCase() || '';
        const rowThickness = row[2]?.toString().toLowerCase() || '';

        const matchesBlock = rowBlockNo === blockNo.toLowerCase();
        const matchesPart = !partNo || rowPartNo === partNo.toLowerCase();
        const matchesThickness = !thickness || rowThickness === thickness.toLowerCase();

        const matches = matchesBlock && matchesPart && matchesThickness;
        if (matches) {
          console.log('Found matching row:', row);
        }

        return matches;
      })
      .map((row): SearchResult => ({
        blockNo: row[0] || '',       // Block No
        partNo: row[1] || '',        // Part
        thickness: row[2] || '',     // Thk cm
        finish: row[3] || '',        // Finish
        nos: row[4] || '',           // Nos
        type: row[5] || '',          // Type
        ratio: row[6] || '',         // Ratio
        aKg: row[7] || '',           // A Kg
        bKg: row[8] || '',           // B Kg
        cKg: row[9] || '',           // C Kg
        lCm: row[10] || '',          // L cm
        hCm: row[11] || '',          // H cm
        sft: row[12] || '',          // Sft
        date: row[13] || '',         // Date
        shift: row[14] || '',        // Shift
        machine: row[15] || '',      // Machine
        remark: row[16] || '',       // Remark
        slabNo: row[17] || '',      // Slab No
        factoryColor: row[18] || '',  // Factory Color
        subColor: row[19] || ''       // Sub Color
      }));

    console.log(`Returning ${results.length} Epoxy results`);
    return results;
  } catch (error) {
    console.error('Error in getEpoxyData:', error);
    throw error;
  }
}

export async function getEColData(factoryColor?: string, subColor?: string, type?: string): Promise<SearchResult[]> {
  try {
    console.log('Starting ECol search with params:', { factoryColor, subColor, type });

    // Specify the exact range in the "Epoxy" tab (using the same tab for now, can be changed to a different tab if needed)
    const range = "Epoxy!A2:T"; // Columns A through T, starting from row 2 (including Factory Color and Sub Color)
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    // Filter and map the rows to SearchResult objects
    const results = response.data.values
      .filter(row => {
        const rowFactoryColor = row[18]?.toString().toLowerCase() || '';
        const rowSubColor = row[19]?.toString().toLowerCase() || '';
        const rowType = row[5]?.toString().toLowerCase() || '';

        const matchesFactoryColor = !factoryColor || rowFactoryColor.includes(factoryColor.toLowerCase());
        const matchesSubColor = !subColor || rowSubColor.includes(subColor.toLowerCase());
        const matchesType = !type || rowType.includes(type.toLowerCase());

        const matches = matchesFactoryColor && matchesSubColor && matchesType;
        if (matches) {
          console.log('Found matching row:', row);
        }

        return matches;
      })
      .map((row): SearchResult => ({
        blockNo: row[0] || '',       // Block No
        partNo: row[1] || '',        // Part
        thickness: row[2] || '',     // Thk cm
        finish: row[3] || '',        // Finish
        nos: row[4] || '',           // Nos
        type: row[5] || '',          // Type
        ratio: row[6] || '',         // Ratio
        aKg: row[7] || '',           // A Kg
        bKg: row[8] || '',           // B Kg
        cKg: row[9] || '',           // C Kg
        lCm: row[10] || '',          // L cm
        hCm: row[11] || '',          // H cm
        sft: row[12] || '',          // Sft
        date: row[13] || '',         // Date
        shift: row[14] || '',        // Shift
        machine: row[15] || '',      // Machine
        remark: row[16] || '',       // Remark
        slabNo: row[17] || '',      // Slab No
        factoryColor: row[18] || '',  // Factory Color
        subColor: row[19] || ''       // Sub Color
      }));

    console.log(`Returning ${results.length} ECol results`);
    return results;
  } catch (error) {
    console.error('Error in getEColData:', error);
    throw error;
  }
}

export async function searchSheetData(blockNo: string, partNo?: string, thickness?: string): Promise<SearchResult[]> {
  try {
    console.log('Starting search with params:', { blockNo, partNo, thickness });

    // Specify the exact range in the "Data2" tab
    const range = "Data1!A2:Y"; // Columns A through Y, starting from row 2
    console.log('Fetching from range:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });


    if (!response.data.values) {
      console.log('No data found in sheet');
      return [];
    }

    console.log(`Found ${response.data.values.length} rows in sheet`);

    // First, map the rows to full SearchResult objects
    const fullResults = response.data.values
      .filter(row => {
        if (!row[0]) {
          console.log('Skipping row with no block number');
          return false;
        }

        const rowBlockNo = row[0].toString().toLowerCase();
        const rowPartNo = row[1]?.toString().toLowerCase() || '';
        const rowThickness = row[2]?.toString().toLowerCase() || '';

        const matchesBlock = rowBlockNo === blockNo.toLowerCase();
        const matchesPart = !partNo || rowPartNo === partNo.toLowerCase();
        const matchesThickness = !thickness || rowThickness === thickness.toLowerCase();

        const matches = matchesBlock && matchesPart && matchesThickness;
        if (matches) {
          console.log('Found matching row:', row);
        }

        return matches;
      })
      .map((row): SearchResult => ({
        blockNo: row[0] || '',
        partNo: row[1] || '',
        thickness: row[2] || '',
        nos: row[3] || '',
        grind: row[4] || '',
        net: row[5] || '',
        epoxy: row[6] || '',
        polish: row[7] || '',
        lea: row[8] || '',
        lap: row[9] || '',
        hon: row[10] || '',
        shot: row[11] || '',
        polR: row[12] || '',
        flam: row[13] || '',
        bal: row[14] || '',
        bSP: row[15] || '',
        edge: row[16] || '',
        trim: row[17] || '',
        meas: row[18] || '',
        lCm: row[19] || '',
        hCm: row[20] || '',
        status: row[21] || '',
        date: row[22] || '',
        color1: row[23] || '',
        color2: row[24] || ''
      }));

    // Identify columns that have data in at least one result
    const columnsWithData = new Set<string>();
    
    // Always include these essential columns regardless of data
    columnsWithData.add('blockNo');
    columnsWithData.add('partNo');
    columnsWithData.add('thickness');
    
    // Check each result to find columns with data
    fullResults.forEach(result => {
      Object.entries(result).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          columnsWithData.add(key);
        }
      });
    });
    
    console.log('Columns with data:', Array.from(columnsWithData));
    
    // Filter each result to only include columns with data
    const results = fullResults.map(result => {
      const filteredResult: Partial<SearchResult> = {};
      
      columnsWithData.forEach(column => {
        filteredResult[column as keyof SearchResult] = result[column as keyof SearchResult];
      });
      
      return filteredResult as SearchResult;
    });

    console.log(`Returning ${results.length} results with ${columnsWithData.size} columns`);
    return results;
  } catch (error) {
    console.error('Error in searchSheetData:', error);
    throw error;
  }
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  try {
    const range = "User!A2:C";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    const values = response.data.values || [];
    const userRow = values.find((row) => row[1]?.toString().toLowerCase() === username.toLowerCase());

    if (!userRow) return undefined;

    return {
      id: parseInt(userRow[0]),
      username: userRow[1],
      password: userRow[2]
    };
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    return undefined;
  }
}

export async function getUser(id: number): Promise<User | undefined> {
  try {
    const range = "User!A2:C";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    const values = response.data.values || [];
    const userRow = values.find((row) => parseInt(row[0]) === id);

    if (!userRow) return undefined;

    return {
      id: parseInt(userRow[0]),
      username: userRow[1],
      password: userRow[2]
    };
  } catch (error) {
    console.error('Error in getUser:', error);
    return undefined;
  }
}

export async function createUser(user: InsertUser): Promise<User> {
  try {
    // Check if username already exists
    const range = "User!A2:C";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    const values = response.data.values || [];
    const existingUsername = values.find((row) => row[1]?.toString().toLowerCase() === user.username.toLowerCase());

    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // First, check if the User sheet exists and create it if it doesn't
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID
    });

    const userSheet = spreadsheet.data.sheets?.find(
      sheet => sheet.properties?.title === 'User'
    );

    if (!userSheet) {
      // Create User sheet with headers
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'User',
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 3
                }
              }
            }
          }]
        }
      });

      // Add headers
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'User!A1:D1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [['ID', 'Username', 'Password', 'Email']]
        }
      });
    }

    // Get current users to determine next ID
    const userRange = "User!A2:C";
    const userResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: userRange,
    });

    const userValues = userResponse.data.values || [];
    const newId = userValues.length > 0 
      ? Math.max(...userValues.map(row => parseInt(row[0] || '0'))) + 1 
      : 1;

    const newUser: User = {
      id: newId,
      username: user.username,
      password: user.password
    };

    // Append new user
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "User!A:D",
      valueInputOption: "RAW",
      requestBody: {
        values: [[newUser.id, newUser.username, newUser.password, user.email]]
      }
    });

    return newUser;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw new Error('Failed to create user');
  }
}
