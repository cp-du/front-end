export function getDataByDataPath<T = object>(data: T, dataPath: string) {
    if (!dataPath) return data
    const paths = dataPath.split('.')
    let result: any = data
    for (const path of paths) {
        if (result[path] === undefined) return undefined
        result = result[path]
    }
    return result
}