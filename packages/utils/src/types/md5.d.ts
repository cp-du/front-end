declare module "crypto-js/md5" {
  interface WordArray {
    toString(encoder?: unknown): string;
  }

  const MD5: (message: string | WordArray) => WordArray;

  export = MD5;
}
