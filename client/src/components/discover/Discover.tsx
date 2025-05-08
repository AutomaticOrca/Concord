import { useEffect, useState } from "react";
import { getUsers } from "@/lib/api/discover";
import { MemberDto, UserParams, Pagination } from "@/types/user";
import UserCard from "./UserCard/UserCard";
import FilterPanel from "./FilterPanel/FilterPanel";
import PaginationControls from "./PaginationControls/PaginationControls";

const Discover = () => {
  const [users, setUsers] = useState<MemberDto[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [params, setParams] = useState<UserParams>({
    pageNumber: 1,
    pageSize: 8,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [params]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers(params);
      setUsers(res.data);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-12/12 h-full flex flex-col items-center justify-between">
      <div className="w-full border-b border-white/20 bg-white/30 backdrop-blur-md px-6 py-3">
        <h2 className="text-xl font-semibold text-emerald-900 tracking-wide text-center sm:text-left">
          🌿 Find Your Vibe There
        </h2>
      </div>

      <div className="flex-1 flex flex-col items-center w-11/12">
        <FilterPanel
          params={params}
          onChange={(updatedParams) => {
            setParams({
              ...updatedParams,
              pageNumber: 1,
            });
          }}
        />
        {loading ? (
          <div className="text-gray-500 mt-10">Loading users...</div>
        ) : (
          <>
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((user) => (
                  <UserCard key={user.userName} user={user} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {!loading && users.length === 0 && (
        <p className="text-gray-500 mt-10">
          No users found. Try adjusting your filters.
        </p>
      )}
      {pagination && (
        <div className="mb-6">
          <PaginationControls
            pagination={pagination}
            onPageChange={(page) =>
              setParams((prev) => ({
                ...prev,
                pageNumber: page,
              }))
            }
          />
        </div>
      )}
    </div>
  );
};

export default Discover;
