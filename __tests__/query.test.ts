import { fillLink, fillLinkSafe } from '../src/index';

describe('Query Test Suite', () => {
  test('safe: can fill single key with $query', () => {
    expect(
      fillLinkSafe('/admin/user/[id]', {
        id: 1,
        $query: {
          music: 'jazz',
          artist: 'miles-davis',
          tune: 'so-what',
          year: 1967,
        },
      })
    ).toEqual(
      '/admin/user/1?music=jazz&artist=miles-davis&tune=so-what&year=1967'
    );
  });
});
