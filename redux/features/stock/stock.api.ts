import { api } from '@/redux/api';

interface StockBase {
  id: string;
  name: string;
  quantity: number;
  buying_price: number;
  currency_code: string;
  supplier_id: string | null;
  buying_date: string;
  product_id: string;
  status: string;
  user_id: string;
  date_created: string;
  original_quantity: number;
  supplier: string | null;
  timeslots: string[];
}

interface CreateStockRequest extends StockBase {
  // Types
}

interface EditStockRequest extends StockBase {
  // Types
}

interface StockResponse extends StockBase {}

export const accessControlApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStocks: builder.mutation<StockResponse[], string>({
      query: (organizatiohn_id: string) => ({
        url: `stocks/?organization_id=${organizatiohn_id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Stock'],
    }),

    // createStock: builder.mutation<
    //   APIResponse<StockResponse>,
    //   CreateStockRequest
    // >({
    //   query: (values) => ({
    //     url: 'stocks',
    //     method: 'POST',
    //     body: values,
    //   }),
    //   invalidatesTags: ['Stock'],
    // }),
    // editStock: builder.mutation<APIResponse<StockResponse>, EditStockRequest>({
    //   query: (values) => ({
    //     url: `stocks/${values.id}`,
    //     method: 'PUT',
    //     body: values,
    //   }),
    //   invalidatesTags: (result) => [{ type: 'Stock', id: result?.data?.id }],
    // }),
    // deleteStock: builder.mutation<void, string>({
    //   query: (id) => ({
    //     url: `stocks/${id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Stock'],
    // }),
  }),
});

export const {
  // useGetStocksQuery,
  // useCreateStockMutation,
  // useEditStockMutation,
  // useDeleteStockMutation,

  useGetStocksMutation,
} = accessControlApi;
