import crypto from 'crypto';
import { parseEnv } from '../env.js';

const generateSecret = () => crypto.randomBytes(48).toString('hex');

const buildEnv = () => ({
  PORT: '3001',
  DATABASE_URL: 'postgres://localhost:5432/payd_test',
  NODE_ENV: 'test' as const,
  JWT_SECRET: generateSecret(),
  JWT_REFRESH_SECRET: generateSecret(),
});

describe('parseEnv', () => {
  it('accepts strong JWT secrets from environment variables', () => {
    const env = buildEnv();

    const parsed = parseEnv(env);

    expect(parsed.JWT_SECRET).toBe(env.JWT_SECRET);
    expect(parsed.JWT_REFRESH_SECRET).toBe(env.JWT_REFRESH_SECRET);
  });

  it('rejects missing JWT access secrets', () => {
    const env = buildEnv() as NodeJS.ProcessEnv;
    delete env.JWT_SECRET;

    expect(() => parseEnv(env)).toThrow(/JWT_SECRET must be set in the environment/);
  });

  it('rejects placeholder JWT secrets', () => {
    const env = {
      ...buildEnv(),
      JWT_SECRET: 'replace-with-a-long-random-secret',
    };

    expect(() => parseEnv(env)).toThrow(/JWT_SECRET must be replaced with a strong random value/);
  });

  it('rejects reused refresh secrets', () => {
    const sharedSecret = generateSecret();
    const env = {
      ...buildEnv(),
      JWT_SECRET: sharedSecret,
      JWT_REFRESH_SECRET: sharedSecret,
    };

    expect(() => parseEnv(env)).toThrow(/JWT_REFRESH_SECRET must be different from JWT_SECRET/);
  });
});
