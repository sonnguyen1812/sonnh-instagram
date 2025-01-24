// packages/assets/src/hooks/api/useGetApi.js
import {useEffect, useState} from 'react';
import {api} from '@assets/helpers';
import {handleError} from '@assets/services/errorService';
import queryString from 'query-string';

export default function useGetApi({
  url,
  defaultData = [],
  initLoad = true,
  presentData = null,
  initQueries = {},
  onSuccess = null // Thêm callback onSuccess
}) {
  const [loading, setLoading] = useState(initLoad);
  const [fetched, setFetched] = useState(false);
  const [data, setData] = useState(defaultData);
  const [pageInfo, setPageInfo] = useState({});
  const [count, setCount] = useState(0);

  async function fetchApi(apiUrl, params = null, keepPreviousData = false) {
    try {
      setLoading(true);
      const path = apiUrl || url;
      const separateChar = path.includes('?') ? '&' : '?';
      const query = params ? separateChar + queryString.stringify(params) : '';
      const resp = await api(path + query);

      if (resp.hasOwnProperty('pageInfo')) setPageInfo(resp.pageInfo);
      if (resp.hasOwnProperty('count')) setCount(resp.count);
      if (resp.hasOwnProperty('data')) {
        let newData = presentData ? presentData(resp.data) : resp.data;
        if (!Array.isArray(newData)) {
          newData = {...defaultData, ...newData};
        }
        setData(prev => {
          const result = !keepPreviousData
            ? newData
            : Array.isArray(newData)
            ? [...prev, ...newData]
            : {...prev, ...newData};

          // Gọi callback onSuccess nếu có
          if (onSuccess) {
            onSuccess({data: result, resp});
          }

          return result;
        });
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }

  useEffect(() => {
    if (initLoad && !fetched) {
      fetchApi(url, initQueries).then(() => {});
    }
  }, []);

  return {
    fetchApi,
    data,
    setData,
    pageInfo,
    count,
    setCount,
    loading,
    fetched,
    setFetched
  };
}
