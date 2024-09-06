// src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// 서비스 워커 생성 및 핸들러 등록
export const worker = setupWorker(...handlers);
