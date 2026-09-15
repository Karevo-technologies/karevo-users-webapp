/** Nigeria's National Identification Number: exactly 11 digits. */
export const NIN_LENGTH = 11;
const NIN_PATTERN = /^\d{11}$/;

export function isValidNin(value: string): boolean {
  return NIN_PATTERN.test(value.trim());
}
