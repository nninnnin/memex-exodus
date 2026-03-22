import { describe, it, expect, vi } from 'vitest';
import { fetchCollection } from './fetchCollection';

function makeFetcher(totalPages: number, items: unknown[]) {
  const pageSize = 100;
  return {
    getList: vi.fn().mockImplementation((_, __, { page, size }) => {
      const start = (page - 1) * size;
      return Promise.resolve({
        json: () => Promise.resolve({
          list: items.slice(start, start + size),
          pageInfo: { totalPages, size: pageSize, page },
        }),
      });
    }),
  };
}

describe('fetchCollection', () => {
  it('아이템이 없으면 빈 배열을 반환한다', async () => {
    const fetcher = makeFetcher(0, []);
    const result = await fetchCollection(fetcher as any, 'proj', 'model');
    expect(result).toEqual([]);
  });

  it('한 페이지 분량이면 getList를 한 번만 호출한다', async () => {
    const items = Array.from({ length: 3 }, (_, i) => ({ uid: `${i}` }));
    const fetcher = makeFetcher(1, items);
    const result = await fetchCollection(fetcher as any, 'proj', 'model');
    expect(fetcher.getList).toHaveBeenCalledTimes(1);
    expect(result).toEqual(items);
  });

  it('100개 초과면 페이지를 나눠서 전부 가져온다', async () => {
    const items = Array.from({ length: 250 }, (_, i) => ({ uid: `${i}` }));
    const fetcher = makeFetcher(3, items);
    const result = await fetchCollection(fetcher as any, 'proj', 'model');
    expect(fetcher.getList).toHaveBeenCalledTimes(3);
    expect(result).toHaveLength(250);
    expect(result).toEqual(items);
  });

  it('projectId와 modelKey를 올바르게 전달한다', async () => {
    const fetcher = makeFetcher(1, [{ uid: 'a' }]);
    await fetchCollection(fetcher as any, 'my-project', 'my-model');
    expect(fetcher.getList).toHaveBeenCalledWith('my-project', 'my-model', expect.any(Object));
  });
});
