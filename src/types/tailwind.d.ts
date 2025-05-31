/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'tailwindcss' {
  import type { Config } from 'tailwindcss/types/config';
  export default function tailwindcss(config?: Config): unknown;
}

declare module 'tailwindcss-animate' {
  import type { PluginCreator } from 'tailwindcss/types/config';
  const plugin: PluginCreator;
  export default plugin;
}
