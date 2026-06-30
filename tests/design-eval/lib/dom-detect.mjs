// DOM detector for the regression suite. jsdom is scoped to this folder's
// package.json, so it resolves here (not from the repo lib/). Shares the core
// engine via detectDomWith.
import { JSDOM } from 'jsdom';
import { detectDomWith } from '../../../lib/design-detect.mjs';

export const detectDom = (file, opts) => detectDomWith(JSDOM, file, opts);
