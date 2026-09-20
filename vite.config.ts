import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import stylex from '@stylexjs/unplugin'
import {fileURLToPath,URL} from 'node:url'
export default defineConfig({plugins:[stylex.vite({useCSSLayers:false,dev:process.env['NODE_ENV']!=='production',runtimeInjection:false}),react()],resolve:{alias:{'@':fileURLToPath(new URL('.',import.meta.url))}}})
