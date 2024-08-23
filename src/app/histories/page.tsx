"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { unionBy } from "lodash";

import { UserData } from "@beincom/aa-sdk";
import {
  AuctionClosed,
  Commitment,
  CreateAuction,
  ERC20Message,
  ERC20Released,
  ERC20Transfer,
  ERC721Transfer,
  GetHistoriesOfAddressResponse,
  HistoriesFromSubgraphResponse,
  LoseBid,
  MintHandle,
  NewBid,
  NewListing,
  NewSale,
  ShareRevenue,
  Swap,
} from "@beincom/aa-sdk/subgraph";

import { AuthSession, BicSmartAccount, WalletInfo } from "@/types";
import { getSmartAccount } from "@/wallet";
import { bicSubgraph } from "@/utils/uniswap";

import LoginForm from "@/components/LoginForm";
import { useCustomSnackBar } from "@/hooks";

const HistoriesPage = () => {
  const [smartAccount, setSmartAccount] = useState<BicSmartAccount>();

  const [session] = useLocalStorage<AuthSession | null>("session", null);
  const [walletInfo] = useLocalStorage<WalletInfo | null>("wallet-info", null);

  const [bicAddresses, setBicAddresses] = useState<string[]>([]);
  const [bicUsers, setBicUsers] = useState<UserData[]>([]);
  const [histories, setHistories] = useState<GetHistoriesOfAddressResponse>([]);

  const { handleNotification } = useCustomSnackBar();

  const handleGetBicInfo = async () => {
    try {
      if (!session) {
        handleNotification("Please login first", "error");
        return;
      }

      const bicInfo = await bicSubgraph.getBicInformation({});
      setBicAddresses(bicInfo.addresses);
    } catch (error) {
      handleNotification(`fetchTransactionFee error: ${error}`, "error");
    }
  };

  const handleGetUsersByAddresses = async () => {
    try {
      if (!session) {
        handleNotification("Please login first", "error");
        return;
      }
      if (!smartAccount) {
        handleNotification("Please login first", "error");
        return;
      }
      const addresses = handleFilterAddressesInHistories();
      const bicInfo = await smartAccount.client.getUsersByAddresses(addresses, {
        headers: {
          Authorization: session.id_token || "",
        },
      });

      setBicUsers(bicInfo);
    } catch (error) {
      handleNotification(`fetchTransactionFee error: ${error}`, "error");
    }
  };

  const handleGetHistory = async () => {
    try {
      if (!session) {
        handleNotification("Please login first", "error");
        return;
      }

      const bicInfo = await bicSubgraph.getHistoriesOfAddress({
        address: "0x99D672D63bB316B495B6700827D6153Bf8E540Fb",
        option: {
          first: 100,
          offset: 0,
          orderDirection: "desc",
        },
      });
      setHistories(bicInfo);
      console.log("🚀 ~ handleGetBicInfo ~ bicInfo:", bicInfo);
    } catch (error) {
      handleNotification(`fetchTransactionFee error: ${error}`, "error");
    }
  };

  useEffect(() => {
    if (session) {
      getSmartAccount().then((account) => {
        setSmartAccount(account);
      });
    }
  }, [session]);

  const handleFilterAddressesInHistories = () => {
    if (!histories) {
      return [];
    }
    const addresses = histories
      .map((history: any) => {
        const keys = [
          "from",
          "to",
          "sender",
          "recipient",
          "beneficiary",
          "auctionCreator",
          "listingCreator",
          "bidder",
          "winningBidder",
          "buyer",
        ];
        const result = keys
          .map((key) => {
            return history[key];
          })
          .filter((address) => !!address);
        return result;
      })
      .flat();

    const unique = unionBy(addresses, (address) => address.toLowerCase());
    return unique;
  };

  useEffect(() => {
    if (session) {
      handleGetUsersByAddresses();
    }
  }, [histories]);

  const renderSwap = (txType: string, history: Swap) => {
    const isFrom = Number(history.amount0) < 0;
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>
        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        {isFrom && (
          <>
            <p>
              Sell: {history.token0.name} {history.amount0}
            </p>
            <p>
              Buy: {history.token1.name} {history.amount1}
            </p>
          </>
        )}
        {!isFrom && (
          <>
            <p>
              Sell: {history.token1.name} {history.amount1}
            </p>
            <p>
              Buy: {history.token0.name} {history.amount0}
            </p>
          </>
        )}
      </div>
    );
  };

  const renderERC20Transfer = (txType: string, history: ERC20Transfer) => {
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>

        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        <p>
          From: {history.from} To: {history.to}
        </p>
        <p>To: {history.to}</p>
        <p>
          Amount: {history.amount} {history.token.name}
        </p>
      </div>
    );
  };

  const renderERC721Transfer = (txType: string, history: ERC721Transfer) => {
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>
        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        <p>
          From: {history.from} To: {history.to}
        </p>
        <p>To: {history.to}</p>
        <p>
          Token: {history.tokenId} {history.token.name}
        </p>
      </div>
    );
  };

  const renderMintHandle = (txType: string, history: MintHandle) => {
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>
        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        <p>To: {history.to}</p>
        <p>Name: {history.name}</p>
        <p>Price: {history.price}</p>
        <p>HandleName: {history.handle.name}</p>
      </div>
    );
  };

  const renderCommitment = (txType: string, history: Commitment) => {
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>
        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        <p>{history.isClaimed ? "Claimed" : "Commit"}</p>
        <p>Name: {history.name}</p>
        <p>Price: {history.price}</p>
        <p>HandleName: {history.handle.name}</p>
      </div>
    );
  };

  const renderNewBid = (txType: string, history: NewBid) => {
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>
        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        <p>AuctionId: {history.auction.auctionId}</p>
        <p>Price: {history.bidAmount}</p>
        <p>Currency: {history.auction.currency.name}</p>
      </div>
    );
  };

  const renderLoseBid = (txType: string, history: LoseBid) => {
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>
        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        <p>AuctionId: {history.auction.auctionId}</p>
        <p>Price: {history.bidAmount}</p>
        <p>Currency: {history.auction.currency.name}</p>
      </div>
    );
  };

  const renderCreateAuction = (txType: string, history: CreateAuction) => {
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>
        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        <p>AuctionId: {history.auctionId}</p>
        <p>TokenId: {history.tokenId}</p>
        <p>Asset contract: {history.assetContract.name}</p>
      </div>
    );
  };

  const renderErc20Released = (txType: string, history: ERC20Released) => {
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>
        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        <p>from: {history.from}</p>
        <p>amount: {history.amount}</p>
        <p>Currency: BIC</p>
      </div>
    );
  };

  const renderShareRevenue = (txType: string, history: ShareRevenue) => {
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>
        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        <p>From: {history.from}</p>
        <p>To: {history.to}</p>
        <p>amount: {history.amount}</p>
        <p>Currency: BIC</p>
      </div>
    );
  };

  const renderNewListing = (txType: string, history: NewListing) => {
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>
        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        <p>ListingCreator: {history.listingCreator}</p>
        <p>Price: {history.pricePerToken}</p>
        <p>Quantity: {history.quantity}</p>
        <p>TokenId: {history.tokenId}</p>
        <p>Currency: {history.currency.name}</p>
        <p>Asset contract: {history.assetContract.name}</p>
      </div>
    );
  };

  const renderNewSale = (txType: string, history: NewSale) => {
    const isBuyer =
      history.buyer.toLowerCase() ===
      walletInfo?.smartAccountAddress.toLowerCase();
    return (
      <div className="mb-4 border-s-orange-50">
        <p>{txType}</p>
        <p>{history.transaction.id}</p>
        <p>{history.transaction.timestamp}</p>
        <p>Type: {isBuyer ? "buy" : "sell"} </p>
        <p>Total Price paid: {history.totalPricePaid}</p>
        <p>Quantity: {history.quantityBought}</p>
        <p>TokenId: {history.tokenId}</p>
        <p>Currency: {history.listing.currency.name}</p>
        <p>Asset contract: {history.assetContract.name}</p>
      </div>
    );
  };

  const renderAuctionClosed = (txType: string, history: AuctionClosed) => {
    const isCreator =
      history.auctionCreator.toLowerCase() ===
      walletInfo?.smartAccountAddress.toLowerCase();
    const isBidder =
      history.winningBidder.toLowerCase() ===
      walletInfo?.smartAccountAddress.toLowerCase();
    const { collectToken, collectPayout, bidPayout } = history;
    if (isCreator) {
      if (collectPayout) {
        return (
          <div className="mb-4 border-s-orange-50">
            <p>{txType}</p>
            <p>{history.transaction.id}</p>
            <p>{history.transaction.timestamp}</p>
            <p>Type: Receive BIC</p>
            <p>AuctionId: {history.auction.auctionId}</p>
            <p>Winning bidder: {history.winningBidder}</p>
            <p>Amount: {history.auction.currentWinningBid.bidAmount}</p>
          </div>
        );
      }
    }
    if (isBidder) {
      if (collectToken || bidPayout) {
        return (
          <div className="mb-4 border-s-orange-50">
            <p>{txType}</p>
            <p>{history.transaction.id}</p>
            <p>{history.transaction.timestamp}</p>
            <p>Type: Receive NFT</p>
            <p>AuctionId: {history.auction.auctionId}</p>
            <p>TokenId: {history.auction.tokenId}</p>
            <p>Asset contract: {history.auction.tokenId}</p>
            <p>Currency: {history.auction.currency.name}</p>
          </div>
        );
      }
    }
  };

  const renderERC20Message = (txType: string, history: ERC20Message) => {
    const isFrom =
      history.from.toLowerCase() ===
      walletInfo?.smartAccountAddress.toLowerCase();
    const isTo =
      history.to.toLowerCase() ===
      walletInfo?.smartAccountAddress.toLowerCase();
    if (isFrom) {
      return (
        <div className="mb-4 border-s-orange-50">
          <p>{txType}</p>
          <p>Tip</p>
          <p>{history.transaction.id}</p>
          <p>{history.transaction.timestamp}</p>
          <p>From: {history.from}</p>
          <p>To: {history.to}</p>
          <p>Amount: {history.amount}</p>
          <p>Message: {history.message}</p>
        </div>
      );
    }
    if (isTo) {
      return (
        <div className="mb-4 border-s-orange-50">
          <p>{txType}</p>
          <p>Receive</p>
          <p>{history.transaction.id}</p>
          <p>{history.transaction.timestamp}</p>
          <p>From: {history.from}</p>
          <p>To: {history.to}</p>
          <p>Amount: {history.amount}</p>
          <p>Message: {history.message}</p>
        </div>
      );
    }

    return null;
  };

  const renderHistories = () => {
    if (!histories) {
      return null;
    }

    const historyItems = histories.map((history: any, index) => {
      const txType = history.txType;
      if (txType === "swaps") {
        const historyData: Swap = history;
        return renderSwap(txType, historyData);
      }
      if (txType === "erc20Transfers") {
        const historyData: ERC20Transfer = history;
        return renderERC20Transfer(txType, historyData);
      }
      if (txType === "erc721Transfers") {
        const historyData: ERC721Transfer = history;
        return renderERC721Transfer(txType, historyData);
      }
      if (txType === "mintHandles") {
        const historyData: MintHandle = history;
        return renderMintHandle(txType, historyData);
      }
      if (txType === "commitments") {
        const historyData: Commitment = history;
        return renderCommitment(txType, historyData);
      }
      if (txType === "newBids") {
        const historyData: NewBid = history;
        return renderNewBid(txType, historyData);
      }
      if (txType === "loseBids") {
        const historyData: LoseBid = history;
        return renderLoseBid(txType, historyData);
      }
      if (txType === "createAuctions") {
        const historyData: CreateAuction = history;
        return renderCreateAuction(txType, historyData);
      }
      if (txType === "erc20Releaseds") {
        const historyData: ERC20Released = history;
        return renderErc20Released(txType, historyData);
      }
      if (txType === "shareRevenues") {
        const historyData: ShareRevenue = history;
        return renderShareRevenue(txType, historyData);
      }
      if (txType === "newListings") {
        const historyData: NewListing = history;
        return renderNewListing(txType, historyData);
      }
      if (txType === "newSales") {
        const historyData: NewSale = history;
        return renderNewSale(txType, historyData);
      }
      if (txType === "auctionCloseds") {
        const historyData: AuctionClosed = history;
        return renderAuctionClosed(txType, historyData);
      }
      if (txType === "erc20Messages") {
        const historyData: ERC20Message = history;
        return renderERC20Message(txType, historyData);
      }
      return (
        <div className="mb-4">
          <p>Unknown</p>
        </div>
      );
    });
    return historyItems;
  };

  return (
    <div className="bg-gray-200 p-4">
      <div className="w-full">
        <LoginForm />
      </div>
      <h3 className="text-2xl font-bold mb-4">
        My account address: {walletInfo?.smartAccountAddress}
      </h3>
      <div className="mb-4">
        <button
          onClick={handleGetBicInfo}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Get Bic Info
        </button>
        <button
          onClick={handleGetHistory}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Get Histories
        </button>
        <button
          onClick={handleGetUsersByAddresses}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Get Users by addresses
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-4">List histories of address</h3>
        {renderHistories()}
      </div>
    </div>
  );
};

export default HistoriesPage;
