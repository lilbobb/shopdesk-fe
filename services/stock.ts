import { getAccessToken } from "@/app/api/token";

type Stock = {
  id: string;
  name: string;
  quantity: number;
  buying_price: number;
  currency_code: string;
  product_id: string;
  organization_id: string;
  date_created: string;
  selectedSellingCurrency: { code: string; name: string };
};

type StockResponse = {
  page: number;
  size: number;
  total: number;
  previous_page: number | null;
  next_page: number | null;
  items: Stock[];
};

export async function AddStock(
  productName: string,
  sellingPrice: number,
  quantity: number,
  product_id: string,
  currency_code: string,
  organization_id: string,
  date_created: string,
  selectedSellingCurrency: { code: string; name: string }
): Promise<Stock> {
  try {
    const token = await getAccessToken();
    console.log("Token:", token);

    const response = await fetch("/api/stocks/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: productName,
        buying_price: sellingPrice,
        quantity: quantity,
        currency_code: selectedSellingCurrency.code,
        product_id: "c01eda6c30994c1fb7bba2aad99cf501",
        organization_id: "b66c4c205e2e44d496217b250fa8a4f5",
        date_created: new Date().toISOString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add stock");
    }

    return data;
  } catch (error) {
    console.error("Error adding stock:", error);
    throw error;
  }
}

export async function GetStock(): Promise<StockResponse> {
  try {
    const token = await getAccessToken();

    const response = await fetch(`/api/stocks/get`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch stock");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching stock:", error);
    throw error;
  }
}

export async function deleteStock(stockId: string): Promise<void> {
  try {
    const token = await getAccessToken();

    const response = await fetch(`/api/stocks/delete`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stock_id: stockId }), // Pass the ID in the request body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete stock");
    }
  } catch (error) {
    console.error("Error deleting stock:", error);
    throw error;
  }
}


export async function editStock(
  stockId: string,
  stockData: {
    name: string;
    buying_price: number;
    quantity: number;
    currency_code: string;
  }
): Promise<void> {
  try {
    const token = await getAccessToken();

    const response = await fetch(`/api/stocks/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stock_id: stockId,
        ...stockData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update stock");
    }
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
}
export async function editStockv3(
  stockId: string,
  stockData: {
    name: string;
    quantity: number;
  
  }
): Promise<void> {
  try {
    const token = await getAccessToken();

    const response = await fetch(`/api/stocks/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stock_id: stockId,
        ...stockData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update stock");
    }
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
}
export async function editPrice(
  stockId: string,
  stockData: {
    buying_price: number;
    currency_code: string;
  }
): Promise<void> {
  try {
    const token = await getAccessToken();

    const response = await fetch(`/api/stocks/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stock_id: stockId,
        ...stockData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update price");
    }
  } catch (error) {
    console.error("Error updating price:", error);
    throw error;
  }
}
export async function editQuantity(
  stockId: string,
  stockData: {
    quantity: number;
  
  }
): Promise<void> {
  try {
    const token = await getAccessToken();

    const response = await fetch(`/api/stocks/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stock_id: stockId,
        ...stockData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update stock");
    }
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
}

export async function editName(
  stockId: string,
  stockData: {
    name: string;
  
  }
): Promise<void> {
  try {
    const token = await getAccessToken();

    const response = await fetch(`/api/stocks/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stock_id: stockId,
        ...stockData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update stock");
    }
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
}