// 🔄 useUserRole.js
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading, isError, error } = useQuery({
    queryKey: ['user-role', user?.email],
    enabled: !!user?.email && !loading, // wait for user to load
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/users/role?email=${user.email}`);
        console.log("✅ Role response:", res.data); // debug
        return res.data?.role || null; // fallback if role is undefined
      } catch (err) {
        console.error("❌ Error fetching role:", err);
        throw err;
      }
    },
  });

  // Debug logs
  // console.log("👤 User:", user);
  // console.log("🧾 Loading:", loading);
  // console.log("🔐 Role:", role);

  return { role, isLoading, isError, error };
};

export default useUserRole;

