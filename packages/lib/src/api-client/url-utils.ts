type QueryParamValue = string | number | boolean | null | undefined;
type QueryParamObject = Record<string, QueryParamValue | QueryParamValue[] | Record<string, QueryParamValue>>;
type QueryParams = QueryParamObject;
type ArrayFormat = 'bracket' | 'index' | 'comma' | 'repeat';

export class URLUtils {
  static serializeQueryParams(
    params: QueryParams,
    arrayFormat: ArrayFormat = 'bracket'
  ): string {
    const entries = Object.entries(params);
    const parts: string[] = [];

    const encode = (key: string, value: QueryParamValue) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;

    const processEntry = (key: string, value: any, parentKey?: string) => {
      const currentKey = parentKey ? `${parentKey}[${key}]` : key;

      if (Array.isArray(value)) {
        if (arrayFormat === 'comma') {
          parts.push(encode(currentKey, value.join(',')));
        } else if (arrayFormat === 'index') {
          value.forEach((item, index) =>
            parts.push(encode(`${currentKey}[${index}]`, item))
          );
        } else if (arrayFormat === 'repeat') {
          value.forEach(item => parts.push(encode(currentKey, item)));
        } else {
          value.forEach(item =>
            parts.push(encode(`${currentKey}[]`, item))
          );
        }
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) =>
          processEntry(subKey, subValue, currentKey)
        );
      } else if (value !== null && value !== undefined) {
        parts.push(encode(currentKey, value));
      }
    };

    entries.forEach(([key, value]) => processEntry(key, value));
    return parts.join('&');
  }

  static mergeUrls(baseUrl: string, path: string): string {
    const [basePath, baseQuery] = baseUrl.split('?');
    const [pathPart, pathQuery] = path.split('?');

    const mergedPath = [basePath, pathPart]
      .filter(Boolean)
      .join('/')
      .replace(/\/+/g, '/')
      .replace(/\/$/, '');

    const mergedQuery = [baseQuery, pathQuery]
      .filter(Boolean)
      .join('&');

    return mergedQuery ? `${mergedPath}?${mergedQuery}` : mergedPath;
  }
}

export type { QueryParams, ArrayFormat };
