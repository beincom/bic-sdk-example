"use client";

import React, { use, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useCustomSnackBar } from "@/hooks";
import {
  fetchAllChargeFees,
  fetchAllTransactionOps,
  fetchAllDeposited,
} from "@/utils/bic-stat";
import { formatUnits } from "@beincom/aa-sdk/utils";

const PaymentServicePage = () => {
  const { handleNotification } = useCustomSnackBar();

  const fetchUserOps = async () => {
    try {
      const startAt = dayjs().month(7).startOf("months").unix();
      const endAt = dayjs().month(10).endOf("months").unix();
      const data = await fetchAllTransactionOps({ startAt, endAt });
      const feesByETH = data
        .map((item) => {
          return (item?.feesByETH || []).map((elm) => BigInt(elm || 0));
        })
        .flat();

      const feesByBIC = data.flatMap((item) => {
        return (item?.feesByBic || []).map((elm) => BigInt(elm || 0));
      });

      const totalFeesByETH = feesByETH.reduce(
        (acc, fee) => acc + BigInt(fee),
        BigInt(0)
      );
      console.log("🚀 ~ fetchUserOps ~ totalFeesByETH:", totalFeesByETH);
      const totalFeesByBIC = feesByBIC.reduce(
        (acc, fee) => acc + BigInt(fee),
        BigInt(0)
      );
      console.log("🚀 ~ fetchUserOps ~ totalFeesByBIC:", totalFeesByBIC);
      return { totalFeesByETH, totalFeesByBIC };
    } catch (error: any) {
      console.log("🚀 ~ fetchUserOps ~ error:", error);
      handleNotification("error", error.message);
    }
  };

  const fetchDeposited = async () => {
    try {
      const startAt = dayjs().month(7).startOf("months").unix();
      const endAt = dayjs().month(10).endOf("months").unix();
      const data = await fetchAllDeposited({ startAt, endAt });
      const depositedByETH = data.reduce(
        (acc, item) => acc + BigInt(item.depositedAmount || 0),
        BigInt(0)
      );
      console.log("🚀 ~ fetchDeposited ~ depositedByETH:", depositedByETH)
    } catch (error: any) {
      handleNotification("error", error.message);
    }
  };

  useEffect(() => {
    fetchUserOps();
    fetchDeposited();
    // fetchChargeFees();
  });
  return (
    <div className="bg-gray-200 p-4">
      <div className="w-full">Bic stat</div>
    </div>
  );
};

export default PaymentServicePage;
