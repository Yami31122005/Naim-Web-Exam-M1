import axios from "axios";
import { useState } from "react";
import { PAGE_SIZE } from "../../shared/pagination/pagination";
import type {
  CreateCustomerModel,
  CustomerModel,
} from "../models/CustomerModel";

interface CustomerListResponse {
  totalCount: number;
  customers: CustomerModel[];
}

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (pageToLoad: number = page) => {
    setIsLoading(true);
    return axios
      .get<CustomerListResponse>("http://localhost:3000/customers", {
        params: { page: pageToLoad, limit: PAGE_SIZE },
      })
      .then((result) => {
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCustomer = (id: string) =>
    axios.delete(`http://localhost:3000/customers/${id}`).then(() => {
      // Last customer of a later page removed: step back to the previous page
      if (customers.length === 1 && page > 1) setPage(page - 1);
      else return load(page);
    });

  // Returns the request so the caller can react to errors (e.g. email already in use)
  const createCustomer = (input: CreateCustomerModel) =>
    axios
      .post<CustomerModel>("http://localhost:3000/customers", input)
      .then(() => load(page));

  return {
    customers,
    totalCount,
    page,
    setPage,
    load,
    isLoading,
    deleteCustomer,
    createCustomer,
  };
};
