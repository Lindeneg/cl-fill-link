import { fillLink, fillLinkSafe } from '../src/index';

describe('Standard Test Suite', () => {
  test('unsafe: can fill single key', () => {
    expect(fillLink('/admin/user/[id]', { id: '1' })).toEqual('/admin/user/1');
  });
  test('unsafe: can fill nested keys', () => {
    expect(
      fillLink('/admin/user/[id]/dashboard/[view]', {
        id: '1',
        view: 'analytics',
      })
    ).toEqual('/admin/user/1/dashboard/analytics');
  });
  test('unsafe: throws error on missing nested keys', () => {
    expect(() =>
      //@ts-expect-error testing invalid key
      fillLink('/admin/user/[id]/dashboard/[view]', {
        view: 'analytics',
      })
    ).toThrow(
      "Error: key 'id' is missing from replacer object in link '/admin/user/[id]/dashboard/[view]'"
    );
  });
  test('unsafe: throws error on missing single key', () => {
    //@ts-expect-error testing missing key
    expect(() => fillLink('/admin/user/[id]', {})).toThrow(
      "Error: key 'id' is missing from replacer object in link '/admin/user/[id]'"
    );
  });
  test('safe: can fill single key', () => {
    expect(fillLinkSafe('/admin/user/[id]', { id: 1 })).toEqual(
      '/admin/user/1'
    );
  });
  test('safe: can fill nested keys', () => {
    expect(
      fillLinkSafe('/admin/user/[id]/dashboard/[view]', {
        id: 1,
        view: 'analytics',
      })
    ).toEqual('/admin/user/1/dashboard/analytics');
  });
  test('safe: does not throw error on missing single key', () => {
    //@ts-expect-error testing missing key
    expect(fillLinkSafe('/admin/user/[id]', {})).toEqual(null);
  });
  test('safe: does not throw error on missing nested keys', () => {
    expect(
      //@ts-expect-error testing missing key
      fillLinkSafe('/admin/user/[id]/dashboard/[view]', { view: 'analytics' })
    ).toEqual(null);
  });
  test('all: defined but empty value is accepted', () => {
    expect(fillLinkSafe('/admin/user/[id]', { id: '' })).toEqual(
      '/admin/user/'
    );
  });
});
