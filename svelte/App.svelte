<script lang="ts">
  import type { Web3Provider, EnsProvider, EnsResolver, JsonRpcSigner } from "@ethersproject/providers";
  import { providers, BigNumber } from "ethers";
  import { onMount } from "svelte";
  import { namehash } from "@ethersproject/hash";

  let name: string;
  let firstName: string;
  let lastName: string = "tennis3";

  let url: string;
  let tokenId: string;
  let address: string;

  let ensProvider: EnsProvider;
  let ensResolver: EnsResolver;

  const gotoCollection = () => window.open(url, "_blank");

  const gotoNFT = () => window.open(`https://testnets.opensea.io/assets/${address}/${tokenId}`, "_blank");

  $: resolve(firstName, lastName);

  const resolve = async (firstName: string, lastName: string): Promise<void> => {
    if (firstName) {
      name = firstName + "." + lastName + ".eth";
    } else {
      name = lastName + ".eth";
    }

    url = "";
    address = "";
    tokenId = "";

    try {
      if (!ensProvider) {
        try {
          ensProvider = new providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`);
        } catch (e) {
          console.error("NO ENS found");
        }
      }
      if (ensProvider) {
        ensResolver = await ensProvider.getResolver(name);
        if (ensResolver) {
          address = await ensResolver.getAddress(60);
          tokenId = await ensResolver.getText("notice");
          url = await ensResolver.getText("url");

          console.log("resolve", name, "=>", url, address, tokenId);
        }
      }
    } catch (e) {
      console.log("ERROR resolve", e);
    }
  };
</script>

<main>
  <h1>FirstName NFTs</h1>

  <p><i>Get access to your favorite NFTs with ease, using simple names powered by ENS Domains.</i></p>
  <p><i>Give FirstName to your NFTs and LastName to your Collections !</i></p>
  <p>Have a try with this Collection of Top3 Tennis Champions</p>

  <hr />
  <br />
  <div>
    <input placeholder="firstName" bind:value={firstName} />
    <input placeholder="lastName" bind:value={lastName} />
  </div>

  <div>
    <p>
      <button disabled={!url} on:click={gotoCollection}>GoTo URL</button>
      ({name} ens url) => {url ? `${url}` : ""}
    </p>
    <p>
      <button disabled={!(address && tokenId)} on:click={gotoNFT}>GoTo NFT</button>
      ({name} ens address/tokenId) => {address && tokenId ? `${address} / ${tokenId}` : ""}
    </p>
  </div>

  <hr />

  <p>You can enter firstname of these 3 NFTs : roger / djoko / nadal</p>
  <p>... with the lastname of the 'Top3 Tennis Collection' : tennis3.eth</p>

  <ul>
    <li>tennis3</li>
    <li>roger tennis3</li>
    <li>djoko tennis3 (no url settled)</li>
    <li>nadal tennis3</li>
  </ul>

  <hr />

  <p>Todo: Automaticly register these ENS Domains while Minting NFTs !</p>
</main>

<style>
  main {
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    font-size: 4em;
    font-weight: 100;
  }

  button {
    background-color: #4caf50;
    color: white;
  }

  button:disabled {
    background-color: #e7e7e7;
    color: white;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
