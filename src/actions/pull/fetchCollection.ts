import { createMemexFetcher } from '@rebel9/memex-fetcher';

const PAGE_SIZE = 100;

type MemexFetcher = ReturnType<typeof createMemexFetcher>;

export async function fetchCollection(
  fetcher: MemexFetcher,
  projectId: string,
  modelKey: string,
) {
  const countRes = await fetcher.getListLength(projectId, modelKey);
  const { count } = await countRes.json();
  const totalPages = Math.ceil(count / PAGE_SIZE);

  const items: unknown[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const res = await fetcher.getList(projectId, modelKey, { size: PAGE_SIZE, page });
    const { list } = await res.json();
    items.push(...list);
  }

  return items;
}
