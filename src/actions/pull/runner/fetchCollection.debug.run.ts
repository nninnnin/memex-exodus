import 'dotenv/config';
import { createMemexFetcher } from '@rebel9/memex-fetcher';

const fetcher = createMemexFetcher(process.env.MEMEX_TOKEN!);
const res = await fetcher.getList(process.env.MEMEX_PROJECT_ID!, 'arProjects', { size: 20, page: 1 });
const data = await res.json();
console.log(JSON.stringify(data, null, 2));
