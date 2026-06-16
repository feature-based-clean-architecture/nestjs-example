import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { err, fromThrowable, ok, Result } from 'neverthrow';
import { HashError, VerifyHashError } from './hash.errors';

@Injectable()
export class HashService {
  private static readonly KEYLEN = 32;
  private static readonly SALT_LEN = 16;

  private static readonly SCRYPT_PARAMS = {
    N: 131072,
    r: 8,
    p: 1,
    maxmem: 256 * 1024 * 1024,
  };

  async hash(value: string): Promise<Result<string, HashError>> {
    const saltResult = fromThrowable(
      () => randomBytes(HashService.SALT_LEN),
      () => 'HASH_RANDOM_BYTES_FAILED' as const,
    )();
    if (saltResult.isErr()) {
      return err(saltResult.error);
    }

    const salt = saltResult.value;

    const derivedKeyResult = await new Promise<
      Result<Buffer, 'HASH_DERIVE_KEY_FAILED'>
    >((resolve) => {
      scrypt(
        value,
        salt,
        HashService.KEYLEN,
        HashService.SCRYPT_PARAMS,
        (error, derivedKey) => {
          if (error) {
            resolve(err('HASH_DERIVE_KEY_FAILED'));
            return;
          }

          resolve(ok(derivedKey));
        },
      );
    });
    if (derivedKeyResult.isErr()) {
      return err(derivedKeyResult.error);
    }

    return ok(
      [
        'scrypt',
        HashService.SCRYPT_PARAMS.N.toString(),
        HashService.SCRYPT_PARAMS.r.toString(),
        HashService.SCRYPT_PARAMS.p.toString(),
        salt.toString('base64url'),
        derivedKeyResult.value.toString('base64url'),
      ].join('$'),
    );
  }

  async verify(
    value: string,
    storedHash: string,
  ): Promise<Result<boolean, VerifyHashError>> {
    const parts = storedHash.split('$');
    if (parts.length !== 6) {
      return err('VERIFY_HASH_INVALID_FORMAT');
    }

    const [algorithm, nStr, rStr, pStr, saltB64, keyB64] = parts;

    if (algorithm !== 'scrypt') {
      return err('VERIFY_HASH_UNSUPPORTED_ALGORITHM');
    }

    const N = Number(nStr);
    const r = Number(rStr);
    const p = Number(pStr);

    if (
      !Number.isInteger(N) ||
      !Number.isInteger(r) ||
      !Number.isInteger(p) ||
      N <= 1 ||
      r <= 0 ||
      p <= 0
    ) {
      return err('VERIFY_HASH_INVALID_PARAMS');
    }

    const buffersResult = fromThrowable(
      () => ({
        salt: Buffer.from(saltB64, 'base64url'),
        expectedKey: Buffer.from(keyB64, 'base64url'),
      }),
      () => 'VERIFY_HASH_INVALID_BASE64' as const,
    )();
    if (buffersResult.isErr()) {
      return err(buffersResult.error);
    }

    const { salt, expectedKey } = buffersResult.value;

    if (salt.length !== HashService.SALT_LEN) {
      return err('VERIFY_HASH_INVALID_SALT_LENGTH');
    }

    if (expectedKey.length !== HashService.KEYLEN) {
      return err('VERIFY_HASH_INVALID_KEY_LENGTH');
    }

    const derivedKeyResult = await new Promise<
      Result<Buffer, 'VERIFY_HASH_DERIVE_KEY_FAILED'>
    >((resolve) => {
      scrypt(
        value,
        salt,
        HashService.KEYLEN,
        { N, r, p, maxmem: Math.max(256 * 1024 * 1024, 128 * N * r * 2) },
        (error, derivedKey) => {
          if (error) {
            resolve(err('VERIFY_HASH_DERIVE_KEY_FAILED'));
            return;
          }

          resolve(ok(derivedKey));
        },
      );
    });
    if (derivedKeyResult.isErr()) {
      return err(derivedKeyResult.error);
    }

    return fromThrowable(
      () => timingSafeEqual(expectedKey, derivedKeyResult.value),
      () => 'VERIFY_HASH_COMPARISON_FAILED' as const,
    )();
  }
}
