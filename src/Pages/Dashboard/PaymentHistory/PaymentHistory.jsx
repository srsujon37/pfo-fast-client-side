import React from "react";
import useAuth from "../../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const formatDate = (iso) => new Date(iso).toLocaleString();

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      console.log("Payment history data:", res.data);
      return res.data;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <table className="table w-full table-zebra">
        <thead className="bg-base-200">
          <tr>
            <th>#</th>
            <th>Transaction ID</th>
            <th>Parcel ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Paid At</th>
          </tr>
        </thead>
        <tbody>
          {payments?.length > 0 ? (
            payments.map((payment, index) => (
              <tr key={payment.transactionId || index}>
                <td>{index + 1}</td>
                <td className="text-xs break-all">{payment.transactionId}</td>
                <td>{payment.parcelId}</td>
               
                <td>${((payment?.amount ?? 0) / 100).toFixed(2)}</td>
                <td>
                  <span className="badge badge-success">
                    {payment.payment_status}
                  </span>
                </td>
                <td>{formatDate(payment.paid_at_string)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-4">
                No payment history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
