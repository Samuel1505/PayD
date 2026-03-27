import * as csv from 'fast-csv';
import { Readable } from 'stream';
import { StrKey } from '@stellar/stellar-sdk';
import { createEmployeeSchema, CreateEmployeeInput } from '../schemas/employeeSchema.js';
import { employeeService } from './employeeService.js';
import { pool } from '../config/database.js';
import logger from '../utils/logger.js';

export interface CsvRow {
  first_name: string;
  last_name: string;
  email: string;
  wallet_address?: string;
  position?: string;
  department?: string;
  base_salary?: string;
  base_currency?: string;
}

export interface ImportError {
  row: number;
  email: string;
  errors: string[];
}

export interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: ImportError[];
}

export class CsvPayrollImportService {
  private static readonly SUPPORTED_CURRENCIES = new Set([
    'USDC',
    'USD',
    'EUR',
    'GBP',
    'KES',
    'NGN',
  ]);
  private static readonly MIN_SALARY = 0;
  private static readonly MAX_SALARY = 1000000000;

  async processCsv(organizationId: number, csvContent: string): Promise<ImportResult> {
    const stream = Readable.from(csvContent);
    const rows: CsvRow[] = [];

    return new Promise((resolve, reject) => {
      csv
        .parseStream(stream, { headers: true })
        .on('error', (error: Error) => reject(error))
        .on('data', (row: CsvRow) => rows.push(row))
        .on('end', async () => {
          try {
            const result = await this.validateAndStoreRows(organizationId, rows);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
    });
  }

  private async validateAndStoreRows(
    organizationId: number,
    rows: CsvRow[]
  ): Promise<ImportResult> {
    const errors: ImportError[] = [];
    const validEmployees: CreateEmployeeInput[] = [];

    rows.forEach((row, index) => {
      const rowNum = index + 2; // +1 for 0-index, +1 for header row
      const rowErrors: string[] = [];

      // Basic structure validation
      if (!row.first_name || !row.last_name || !row.email) {
        rowErrors.push('Missing required fields: first_name, last_name, and email are mandatory');
      }

      // Wallet address validation
      if (row.wallet_address && !StrKey.isValidEd25519PublicKey(row.wallet_address)) {
        rowErrors.push('Invalid Stellar wallet address');
      }

      // Salary validation
      const salary = row.base_salary ? parseFloat(row.base_salary) : 0;
      if (row.base_salary && isNaN(salary)) {
        rowErrors.push('Invalid salary format: must be a number');
      } else if (salary < CsvPayrollImportService.MIN_SALARY) {
        rowErrors.push('Salary cannot be negative');
      } else if (salary > CsvPayrollImportService.MAX_SALARY) {
        rowErrors.push(`Salary exceeds allowed maximum (${CsvPayrollImportService.MAX_SALARY})`);
      }

      const baseCurrency = (row.base_currency || 'USDC').trim().toUpperCase();
      if (!CsvPayrollImportService.SUPPORTED_CURRENCIES.has(baseCurrency)) {
        rowErrors.push(
          `Unsupported base_currency '${baseCurrency}'. Allowed: ${Array.from(CsvPayrollImportService.SUPPORTED_CURRENCIES).join(', ')}`
        );
      }

      // Zod validation for the rest
      try {
        const validated = createEmployeeSchema.parse({
          organization_id: organizationId,
          first_name: row.first_name?.trim(),
          last_name: row.last_name?.trim(),
          email: row.email?.trim(),
          wallet_address: row.wallet_address?.trim(),
          position: row.position,
          department: row.department,
          base_salary: salary,
          base_currency: baseCurrency,
          status: 'active',
        });

        if (rowErrors.length === 0) {
          validEmployees.push(validated);
        }
      } catch (error: any) {
        if (error.errors) {
          error.errors.forEach((err: any) =>
            rowErrors.push(`${err.path.join('.')}: ${err.message}`)
          );
        } else {
          rowErrors.push(error.message);
        }
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: rowNum,
          email: row.email || 'N/A',
          errors: rowErrors,
        });
      }
    });

    let successCount = 0;
    if (validEmployees.length > 0) {
      // Use a transaction for bulk storage
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        for (const employee of validEmployees) {
          await employeeService.create(employee, client);
          successCount++;
        }
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Bulk import transaction failed', error);
        throw new Error('Database transaction failed during bulk import');
      } finally {
        client.release();
      }
    }

    return {
      totalRows: rows.length,
      successCount,
      errorCount: errors.length,
      errors,
    };
  }
}

export const csvPayrollImportService = new CsvPayrollImportService();
