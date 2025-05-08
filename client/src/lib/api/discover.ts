import apiClient from "./httpClient.ts";
import { MemberDto, UserParams, Pagination } from "@/types/user";

interface GetUsersResponse {
  data: MemberDto[];
  pagination: Pagination;
}

export const getUsers = async (
  params: UserParams
): Promise<GetUsersResponse> => {
  const res = await apiClient.get<MemberDto[]>("/users", { params });

  const paginationHeader = res.headers["pagination"];
  const pagination: Pagination = paginationHeader
    ? JSON.parse(paginationHeader)
    : {
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        totalCount: 0,
      };

  return {
    data: res.data,
    pagination,
  };
};
