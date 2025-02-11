/* Menu */
declare namespace Menu {
  type IRole = 'superAdmin' | 'admin';
  interface MenuOptions {
    path: string;
    name: string;
    component?: string | (() => Promise<unknown>);
    redirect?: string;
    meta: MetaProps;
    children?: MenuOptions[];
  }
  interface MetaProps {
    icon: string;
    title: string;
    activeMenu?: string;
    auth?: IRole[];
    isLink?: string;
    index?: number;
    isHide?: boolean;
    isFull?: boolean;
    isAffix?: boolean;
    isKeepAlive?: boolean;
  }
}

/* FileType */
declare namespace File {
  type ImageMimeType =
    | 'image/apng'
    | 'image/bmp'
    | 'image/gif'
    | 'image/jpeg'
    | 'image/pjpeg'
    | 'image/png'
    | 'image/svg+xml'
    | 'image/tiff'
    | 'image/webp'
    | 'image/x-icon';

  type ExcelMimeType = 'application/vnd.ms-excel' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}

/* Vite */
declare type Recordable<T = any> = Record<string, T>;

declare interface ViteEnv {
  VITE_USER_NODE_ENV: 'development' | 'production' | 'test';
  VITE_GLOB_APP_TITLE: string;
  VITE_PORT: number;
  VITE_OPEN: boolean;
  VITE_REPORT: boolean;
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'gzip,brotli' | 'none';
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
  VITE_DROP_CONSOLE: boolean;
  VITE_PUBLIC_PATH: string;
  VITE_API_URL: string;
  VITE_PROXY: [string, string][];
}

interface ImportMetaEnv extends ViteEnv {
  __: unknown;
}

/* __APP_INFO__ */
declare const __APP_INFO__: {
  pkg: {
    name: string;
    version: string;
    dependencies: Recordable<string>;
    devDependencies: Recordable<string>;
  };
  lastBuildTime: string;
};

/* Generic Tools */
type ObjToKeyValUnion<T> = {
  [K in keyof T]: { key: K; value: T[K] };
}[keyof T];

type ObjToKeyValArray<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];
declare namespace Column {
  interface ColumnOptions {
    prop?: string;
    label?: string;
    type?: 'selection' | 'index' | 'expand';
    fixed?: true | 'left' | 'right';
    width?: string | number;
    minWidth?: string | number;
    align?: 'left' | 'center' | 'right';
    formatter?: (scope: any) => void;
    render?: (scope?: any) => void;
  }
}

interface Window {
  TSDD_CONFIG: {
    APP_TITLE: string;
    APP_URL: string;
  };
}

declare const windos: Window & typeof globalThis;
