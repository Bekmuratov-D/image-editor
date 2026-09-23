import { describe, expect, it } from 'vitest';
import { decodeGb7Header } from '../src/core/codecs/gb7/gb7Decoder';
import { Gb7Error } from '../src/core/codecs/gb7/gb7Errors';

function buildHeader(overrides: Partial<{ signature: number[]; version: number; flags: number; width: number; height: number; reserved: number }> = {}) {
  const opts = {
    signature: [0x47, 0x42, 0x37, 0x1d],
    version: 0x01,
    flags: 0x00,
    width: 4,
    height: 2,
    reserved: 0,
    ...overrides,
  };

  const buffer = new ArrayBuffer(12 + opts.width * opts.height);
  const view = new DataView(buffer);

  opts.signature.forEach((byte, i) => view.setUint8(i, byte));
  view.setUint8(4, opts.version);
  view.setUint8(5, opts.flags);
  view.setUint16(6, opts.width, false);
  view.setUint16(8, opts.height, false);
  view.setUint16(10, opts.reserved, false);

  return buffer;
}

describe('decodeGb7Header', () => {
  it('парсит корректный заголовок без маски', () => {
    const header = decodeGb7Header(buildHeader());
    expect(header).toEqual({ version: 1, hasMask: false, width: 4, height: 2 });
  });

  it('распознаёт флаг маски', () => {
    const header = decodeGb7Header(buildHeader({ flags: 0x01 }));
    expect(header.hasMask).toBe(true);
  });

  it('отклоняет неверную сигнатуру', () => {
    expect(() => decodeGb7Header(buildHeader({ signature: [0x00, 0x42, 0x37, 0x1d] }))).toThrow(Gb7Error);
  });

  it('отклоняет неподдерживаемую версию', () => {
    expect(() => decodeGb7Header(buildHeader({ version: 2 }))).toThrow(Gb7Error);
  });

  it('отклоняет ненулевые зарезервированные биты флага', () => {
    expect(() => decodeGb7Header(buildHeader({ flags: 0x02 }))).toThrow(Gb7Error);
  });

  it('отклоняет ненулевые зарезервированные байты заголовка', () => {
    expect(() => decodeGb7Header(buildHeader({ reserved: 1 }))).toThrow(Gb7Error);
  });

  it('отклоняет файл с обрезанными пиксельными данными', () => {
    const full = buildHeader({ width: 4, height: 2 });
    const truncated = full.slice(0, 12 + 3);
    expect(() => decodeGb7Header(truncated)).toThrow(Gb7Error);
  });
});
