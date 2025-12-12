import axiosInstance from "./axios";

export const productApi = {
    getAll: async () => {
        const { data } = await axiosInstance.get("/admin/products");
        return data;
    }
}