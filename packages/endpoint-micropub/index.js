import {fileURLToPath} from 'url';
import path from 'path';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export {query} from './controllers/query.js';