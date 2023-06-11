import pluginId from '../pluginId';
import axiosInstance from '../utils/axiosInstance';
//import { IFilesExistAndLastUpdate } from '../../../types';

const mainApi = {
  status: async (): Promise<{ data: any[] }> => {
    return await axiosInstance.get(`/${pluginId}/status`);
  },
  importByFileName: async (fileName: string): Promise<{ data: void }> => {
    return await axiosInstance.get(`/${pluginId}/import/${fileName}`);
  },
  getAll: async (
    dateFrom: string,
    dateTo: string
  ): Promise<{ data: any[] }> => {
    return await axiosInstance.get(`/${pluginId}/all`, {
      params: { dateFrom, dateTo }
    });
  }
};

export default mainApi;
