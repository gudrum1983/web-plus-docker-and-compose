import * as bcrypt from 'bcrypt';
import config from '../../config/configuration';

export async function hashValue(value: string): Promise<string> {
  const salt = bcrypt.genSaltSync(config().hash.saltRounds);
  return await bcrypt.hash(value, salt);
}

export async function verifyHash(
  value: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(value, hash);
}
