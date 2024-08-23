"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { BicSmartAccount, WalletInfo } from "@/types";
import { getSmartAccount } from "@/wallet";

import LoginForm from "@/components/LoginForm";
import { BIC_ADDRESS, NFT_ADDRESS } from "@/utils";
import { useCustomSnackBar } from "@/hooks";
import { marketplace } from "@/utils/marketplace";

const MarketplacePage = () => {
  const [networkFeeByBic, setNetworkFeeByBic] = useState<string>("0");
  const [smartAccount, setSmartAccount] = useState<BicSmartAccount>();

  const [calldata, setCalldata] = useState<string>();

  const [session] = useLocalStorage("session", {});
  const [walletInfo] = useLocalStorage<WalletInfo | null>("wallet-info", null);

  const { handleNotification } = useCustomSnackBar();

  const auctionId = "92";
  const listingId = "2";
  const offerId = "2";
  useEffect(() => {
    if (session) {
      getSmartAccount().then((account) => {
        setSmartAccount(account);
      });
    }
  }, [session]);

  const handleGetTotalAuctions = async () => {
    const res = await marketplace.getTotalAuctions();
    console.log("🚀 ~ handleGetTotalAuctions ~ res:", res);
  };

  const handleGetAuctions = async () => {
    const res = await marketplace.getAllAuctions(0, 10);
    console.log("🚀 ~ handleGetAuctions ~ res:", res)
  };

  const handleGetStatusCollected = async () => {
    const res = await marketplace.getAuctionCollectedStatus(Number(auctionId));
    console.log("🚀 ~ handleGetAuctions ~ res:", res)
  };

  const handleCreateAuction = async () => {
    if(!smartAccount) { 
      handleNotification("Please login first", "error");
      return;
    }
    const res = await marketplace.createAuction(walletInfo!.smartAccountAddress, {
      tokenId: "23876103999596038501684966597109561354210392938526387450156480010624699820667",
      currency: {
        address: BIC_ADDRESS,
        decimals: 18,
        name:"",
        symbol:""
      },
      assetContract: NFT_ADDRESS,
      bidBufferBps: "200",
      buyoutBidAmount: "1000",
      minimumBidAmount: "1",
      timeBufferInSeconds: "600",
      quantity: "1",
      startTimestamp: (Math.floor(Date.now() / 1000)).toString(),
      endTimestamp: (Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7).toString()
    });

    console.log("🚀 ~ handleGetTotalAuctions ~ res:", res);
    const tx = await smartAccount.buildAndSendUserOperation({calldata: res.calldata});
    console.log("🚀 ~ handleCreateAuction ~ tx:", tx)
  };

  const handleBidAuction = async () => {
    if(!smartAccount) { 
      handleNotification("Please login first", "error");
      return;
    }
    const res = await marketplace.bidInAuction({
      auctionId: auctionId,
      bidAmount: "1000",
      currency: {
        address: BIC_ADDRESS,
        decimals: 18,
        name:"",
        symbol:""
      },
     
    });


    const tx = await smartAccount.buildAndSendUserOperation({calldata: res.calldata});
    console.log("🚀 ~ handleBidAuction ~ tx:", tx)

  };

  const handleCancelAuction = async () => {
    if(!smartAccount) { 
      handleNotification("Please login first", "error");
      return;
    }
    const res = await marketplace.cancelAuction({
      auctionId: auctionId,     
    });


    const tx = await smartAccount.buildAndSendUserOperation({calldata: res.calldata});
    console.log("🚀 ~ handleCancelAuction ~ tx:", tx)
  };

  const handleClaimNFT = async () => {
    if(!smartAccount) { 
      handleNotification("Please login first", "error");
      return;
    }
    const res = await marketplace.collectAuctionTokens({
      auctionId: auctionId,     
    });


    const tx = await smartAccount.buildAndSendUserOperation({calldata: res.calldata});
    console.log("🚀 ~ handleClaimNFT ~ tx:", tx)
  };

  const handleClaimPayout = async () => {
    if(!smartAccount) { 
      handleNotification("Please login first", "error");
      return;
    }
    const res = await marketplace.collectAuctionPayout({
      auctionId: auctionId,     
    });


    const tx = await smartAccount.buildAndSendUserOperation({calldata: res.calldata});
    console.log("🚀 ~ handleClaimNFT ~ tx:", tx)
  };

  const handleCreateListing = async () => {
    if(!smartAccount) { 
      handleNotification("Please login first", "error");
      return;
    }
    const res = await marketplace.createListing(walletInfo!.smartAccountAddress, {
      tokenId: "23876103999596038501684966597109561354210392938526387450156480010624699820667",
      currency: {
        address: BIC_ADDRESS,
        decimals: 18,
        name:"",
        symbol:""
      },
      pricePerToken: "10",
      assetContract: NFT_ADDRESS,
      quantity: "1",
      startTimestamp: (Math.floor(Date.now() / 1000)).toString(),
      endTimestamp: (Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7).toString(),
      reserved: false,
    });


    const tx = await smartAccount.buildAndSendUserOperation({calldata: res.calldata});
    console.log("🚀 ~ handleCreateListing ~ tx:", tx)

  };

  const handleCancelListing = async () => {
    if(!smartAccount) { 
      handleNotification("Please login first", "error");
      return;
    }
    const res = await marketplace.cancelListing(walletInfo!.smartAccountAddress, {
      listingId: listingId,
    });


    const tx = await smartAccount.buildAndSendUserOperation({calldata: res.calldata});
    console.log("🚀 ~ handleCreateListing ~ tx:", tx)

  };

  const handleBuyListing = async () => {
    if(!smartAccount) { 
      handleNotification("Please login first", "error");
      return;
    }
    const res = await marketplace.buyNFTFromListing(walletInfo!.smartAccountAddress, {
      listingId: listingId,
      buyFor: walletInfo!.smartAccountAddress,
      currency: {
        address: BIC_ADDRESS,
        decimals: 18,
        name:"",
        symbol:""
      },
      expectedTotalPrice: "10",
      quantity: "1",
    });


    const tx = await smartAccount.buildAndSendUserOperation({calldata: res.calldata});
    console.log("🚀 ~ handleCreateListing ~ tx:", tx)

  };

  const handleMakeOffer = async () => {
    if(!smartAccount) { 
      handleNotification("Please login first", "error");
      return;
    }
    const res = await marketplace.makeOffer({
      tokenId: "24331227447559671635823913998370430931041154384853949609391040065526148029689",
      currency: {
        address: BIC_ADDRESS,
        decimals: 18,
        name:"",
        symbol:""
      },
      totalPrice: "12.55",
      assetContract: NFT_ADDRESS,
      quantity: "1",
      expirationTimestamp: (Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7).toString(),

    });


    const tx = await smartAccount.buildAndSendUserOperation({calldata: res.calldata});
    console.log("🚀 ~ handleMakeOffer ~ tx:", tx)
  };


  const handleAcceptOffer = async () => {
    if(!smartAccount) { 
      handleNotification("Please login first", "error");
      return;
    }
    const res = await marketplace.acceptOffer(walletInfo!.smartAccountAddress,{
      offerId:offerId,
    });


    const tx = await smartAccount.buildAndSendUserOperation({calldata: res.calldata});
    console.log("🚀 ~ handleMakeOffer ~ tx:", tx)
  };

  const handleCancelOffer = async () => {
    if(!smartAccount) { 
      handleNotification("Please login first", "error");
      return;
    }
    const res = await marketplace.cancelOffer({
      offerId:offerId,
    });


    const tx = await smartAccount.buildAndSendUserOperation({calldata: res.calldata});
    console.log("🚀 ~ handleCancelOffer ~ tx:", tx)

  };


  return (
    <div className="bg-gray-200 p-4">
      <div className="w-full">
        <LoginForm />
      </div>
      <h1 className="text-2xl font-bold mb-4">Tip Service</h1>
      <h3 className="text-2xl font-bold mb-4">
        My account address: {walletInfo?.smartAccountAddress}
      </h3>
      <h3 className="text-2xl font-bold mb-4">Token tip: {BIC_ADDRESS}</h3>
      <h4 className="text-2xl font-bold mb-4">
        Network cost: {networkFeeByBic}
      </h4>
      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-4">Read Auctions</h3>
        <button
          onClick={handleGetTotalAuctions}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Get total auction
        </button>
        <button
          onClick={handleGetAuctions}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Get total auction
        </button>
        <button
          onClick={handleGetStatusCollected}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Get Status auction
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-4">Write Auctions</h3>
        <button
          onClick={handleCreateAuction}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Create Auction
        </button>
        <button
          onClick={handleBidAuction}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Bid Auction
        </button>
        <button
          onClick={handleCancelAuction}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Cancel Auction
        </button>
        <button
          onClick={handleClaimNFT}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Claim NFT Auction
        </button>
        <button
          onClick={handleClaimPayout}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Claim Payout Auction
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-4">Write Listing</h3>
        <button
          onClick={handleCreateListing}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Create Listing
        </button>
        <button
          onClick={handleCancelListing}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Cancel Listing
        </button>

        <button
          onClick={handleBuyListing}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Buy NFT
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-4">Write offer</h3>
        <button
          onClick={handleMakeOffer}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Make Offer
        </button>
        <button
          onClick={handleAcceptOffer}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Accept Offer
        </button>

        <button
          onClick={handleCancelOffer}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Cancel offer
        </button>
      </div>
    </div>
  );
};

export default MarketplacePage;
