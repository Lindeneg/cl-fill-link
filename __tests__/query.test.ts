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
          year: 1959,
          autoplay: true,
        },
      })
    ).toEqual(
      '/admin/user/1?music=jazz&artist=miles-davis&tune=so-what&year=1959&autoplay=true'
    );
  });
  test('unsafe: can fill single key with $query', () => {
    expect(
      fillLink('/admin/user/[id]', {
        id: 1,
        $query: {
          music: 'jazz',
          artist: 'miles-davis',
          tune: 'so-what',
          year: 1959,
          autoplay: false,
        },
      })
    ).toEqual(
      '/admin/user/1?music=jazz&artist=miles-davis&tune=so-what&year=1959&autoplay=false'
    );
  });
  test('unsafe: encodes $query to a valid URIComponent', () => {
    expect(
      fillLink('/admin/user/[id]', {
        id: 1,
        $query: {
          artist: 'miles davis',
          tune: 'so what | kind of blue',
          year: '[1959]',
        },
      })
    ).toEqual(
      '/admin/user/1?artist=miles%20davis&tune=so%20what%20%7C%20kind%20of%20blue&year=%5B1959%5D'
    );
  });
});
