/// <reference types="vite/client" />

// Minimal path alias support for '@/...'
// (Vite/TS often need a shared tsconfig "paths" setup; this keeps compilation working for now.)
declare module '@/lib/utils' {
  export * from '../lib/utils'
}

