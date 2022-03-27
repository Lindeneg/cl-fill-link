import { fillLink, fillLinkSafe } from '../src/index';

describe('Catchall Test Suite', () => {
  test.each([
    ['safe', fillLinkSafe],
    ['unsafe', fillLink],
  ])('%s: can fill single catchall slug', (_, fn) => {
    expect(
      fn('/posts/[...slug]', {
        slug: ['category'],
      })
    ).toEqual('/posts/category');
  });
  test.each([
    ['safe', fillLinkSafe],
    ['unsafe', fillLink],
  ])('%s: can fill multiple catchall slugs', (_, fn) => {
    expect(
      fn('/posts/[...slug]', {
        slug: ['category', 'music', 'jazz', 'miles-davis'],
      })
    ).toEqual('/posts/category/music/jazz/miles-davis');
  });
});
