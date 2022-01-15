<script lang="ts">
  import type { Web3Provider, Provider, JsonRpcSigner } from "@ethersproject/providers";
  import type { EthereumProvider } from "hardhat/types";

  import detectEthereumProvider from "@metamask/detect-provider";
  import { onMount } from "svelte";
  import { ethers } from "ethers";

  // down to component
  export let txt: boolean = undefined;
  export let autoconnect: string = undefined;
  export let address: string = undefined;

  const testnets = true;

  let ethereumProvider: EthereumProvider;
  let ethersProvider: Web3Provider;

  let nameOrAddress = "";

  const connectMetamaskMessage = "Connect to Metamask";
  const installMetamaskMessage = "Please install MetaMask extension to connect";

  let noMetamask = false;
  let targetChain = false;

  let signer;
  let provider;
  let chainId: string;

  let open = false;

  $: if (address) setEnsName();
  const setEnsName = async () => {
    nameOrAddress = address;
    nameOrAddress = await getEnsName(address);
  };

  const strUpFirst = (str: string): string => (str.length >= 1 ? str.charAt(0).toUpperCase() + str.substr(1) : "");

  const handleChainId = async (_chainId) => {
        chainId = _chainId;
        console.log("chainId", chainId);
  };

  const switchEthereumChain = async (_chainId, e?: Event) => {
    e?.preventDefault();
    if (_chainId && _chainId != chainId) {
      console.log("switchEthereumChain", _chainId);
      try {
        await ethereumProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: _chainId }]
        });
      } catch (switchError) {
        console.error("ERROR switchEthereumChain", switchError
      }
    }
  };

  const handleAccounts = async (_accounts) => {
    console.log("handleAccounts", _accounts);

    if (_accounts?.length === 0) {
      if (autoconnect !== "off") connectMetamask();
    } else if (_accounts[0] !== address) {
      // address.set(getChecksumAddress(_accounts[0]));
      // provider.set(ethersProvider);
      signer = ethersProvider.getSigner(0);
      address = await signer.getAddress();
      provider = signer.provider;
    }
  };

  const connectMetamask = async (e?: Event) => {
    e.preventDefault();
    // console.log("connectMetamask");

    ethereumProvider
      .request({
        method: "eth_requestAccounts"
      })
      .then(handleAccounts)
      .catch((e) => {
        if (e.code === 4001) {
          alert(connectMetamaskMessage);
        } else {
          console.error("KredeumMetamask ERROR eth_requestAccounts", e);
        }
      });
  };

  onMount(async () => {
    // console.log("init");
    const provider = await detectEthereumProvider();
    if (provider) {
      noMetamask = false;

      if (provider !== window.ethereum) {
        alert("Do you have multiple wallets installed?");
      }

      ethereumProvider = window.ethereum as EthereumProvider;
      ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any");

      ethereumProvider
        .request({
          method: "eth_accounts"
        })
        .then(handleAccounts)
        .catch((e) => console.error("KredeumMetamask ERROR eth_accounts", e));

      ethereumProvider
        .request({
          method: "eth_chainId"
        })
        .then(handleChainId)
        .catch((e) => console.error("KredeumMetamask ERROR eth_chainId", e));

      ethereumProvider.on("chainChanged", handleChainId);

      ethereumProvider.on("accountsChanged", handleAccounts);
    } else {
      noMetamask = true;
      console.log(installMetamaskMessage);
    }

    window.addEventListener("click", (e: Event): void => {
      const select = document.querySelector(".select-network");
      if (select && !select.contains(e.target as HTMLElement)) {
        open = false;
      }
    });
  });
</script>

<main>
  {#if address}
    <div id="metamask-address">{address}</div>
  {:else}
    <button on:click={connectMetamask}>Connect Metamask</button>
  {/if}
</main>
