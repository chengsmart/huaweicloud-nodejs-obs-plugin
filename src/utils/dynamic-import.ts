/**
 * 动态import for script
 * var x = 'someplace';
 * import(x).then((a) => {
 * // `a` is imported and can be used here
 * });
 * or
 * async function run(x) {
 * const a = await import(x);
 * // `a` is imported and can be used here
 * }
 */

export const dynamicImport = async (
  pathName: string
): Promise<any> => {
  return await import(pathName);
};
