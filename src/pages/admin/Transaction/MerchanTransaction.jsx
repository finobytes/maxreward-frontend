import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Eye, Loader } from "lucide-react";
import { Link } from "react-router";

import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import SearchInput from "@/components/form/form-elements/SearchInput";
import StatusBadge from "@/components/table/StatusBadge";
import Pagination from "@/components/table/Pagination";
import BulkActionBar from "@/components/table/BulkActionBar";
import MerchantStaffSkeleton from "@/components/skeleton/MerchantStaffSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Select from "../../../components/form/Select";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useGetMerchantTransactionsQuery } from "../../../redux/features/admin/reports/transaction/merchantTransaction";

const MerchantTransaction = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError } =
    useGetMerchantTransactionsQuery({ page });

  const transactions = data?.transactions || [];
  console.log("transactions", transactions);
  const meta = data?.meta || {};

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Purchase Transactions" }]}
      />

      <div className="rounded-xl border bg-white p-4 shadow-sm mt-4">
        <div className="relative overflow-x-auto custom-scrollbar">
          {/* Overlay Fetch Spinner */}
          {isFetching && !isLoading && (
            <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <Loader className="w-6 h-6 animate-spin text-gray-600" />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>S/N</TableHead> */}
                <TableHead>Transaction ID</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Redeem</TableHead>
                <TableHead>Cash Paid</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purchase Date</TableHead>
                {/* <TableHead>Action</TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <MerchantStaffSkeleton rows={8} cols={9} />
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan="10"
                    className="text-center text-red-500 py-6"
                  >
                    Failed to load transactions.
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan="10"
                    className="text-center text-gray-600 py-6"
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t, index) => (
                  <TableRow key={t.id} className="hover:bg-gray-50 transition">
                    {/* <TableCell>
                      {(meta.current_page - 1) * meta.per_page + (index + 1)}
                    </TableCell> */}

                    <TableCell>{t.transaction_id}</TableCell>
                    <TableCell>{t?.merchant?.business_name}</TableCell>
                    <TableCell>{t?.member?.name}</TableCell>

                    <TableCell>RM {t.transaction_amount}</TableCell>
                    <TableCell>{t.redeem_amount} pts</TableCell>
                    <TableCell>RM {t.cash_redeem_amount}</TableCell>
                    <TableCell className="capitalize">
                      {t.payment_method}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={t.status}>{t.status}</StatusBadge>
                    </TableCell>

                    <TableCell>
                      {new Date(t.created_at).toLocaleDateString()}
                    </TableCell>

                    {/* <TableCell>
                      <Link
                        to={`/admin/merchant-transaction/${t.id}`}
                        className="p-2 bg-indigo-100 rounded-md text-indigo-600 inline-block"
                      >
                        <Eye size={16} />
                      </Link>
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>
    </div>
  );
};

export default MerchantTransaction;
