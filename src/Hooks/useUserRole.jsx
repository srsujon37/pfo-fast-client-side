// 🔄 useUserRole.js
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const { user, loading } = useAuth(); // ধরে নিচ্ছি loading আছে
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading, isError } = useQuery({
    queryKey: ['user-role', user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role?email=${user.email}`);
      return res.data.role;
    },
  });

  return { role, isLoading, isError };
};

export default useUserRole;
