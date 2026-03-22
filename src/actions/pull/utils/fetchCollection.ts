import { createMemexFetcher } from '@rebel9/memex-fetcher';

const PAGE_SIZE = 20;

type MemexFetcher = ReturnType<typeof createMemexFetcher>;

export async function fetchCollection(
  fetcher: MemexFetcher,
  projectId: string,
  modelKey: string,
) {
  const items: unknown[] = [];

  const firstRes = await fetcher.getList(projectId, modelKey, { size: PAGE_SIZE, page: 0 });
  const firstData = await firstRes.json();
  items.push(...firstData.list);

  const { totalPages } = firstData.pageInfo;

  for (let page = 1; page < totalPages; page++) {
    const res = await fetcher.getList(projectId, modelKey, { size: PAGE_SIZE, page });
    const { list } = await res.json();
    items.push(...list);
  }

  return items;
}
