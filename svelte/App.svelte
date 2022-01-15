<script>
  let name = "tennis.eth";
  let url;
  let collection;

  const openWindow = () => (url = window.open(url, "_blank"));

  $: switch (name) {
    case "tennis.eth":
      collection = true;
      url = "https://testnets.opensea.io/collection/tennis-v2";
      break;
    case "djoko.tennis.eth":
      url = "https://testnets.opensea.io/assets/0xd750a97a4d742f142c18c67ccbb393ec6200ca04/1";
      break;
    case "nadal.tennis.eth":
      url = "https://testnets.opensea.io/assets/0xd750a97a4d742f142c18c67ccbb393ec6200ca04/2";
      break;
    case "roger.tennis.eth":
      url = "https://testnets.opensea.io/assets/0xd750a97a4d742f142c18c67ccbb393ec6200ca04/3";
      break;
    default:
      collection = false;
      url = "";
  }
</script>

<body>
  <h1>FirstName NFTs</h1>

  <div>
    <input bind:value={name} />
  </div>

  <div>
    {#if collection}
      <button on:click={openWindow}>Goto Collection</button>
    {:else if url}
      <button on:click={openWindow}>Goto NFT</button>
    {/if}
  </div>
</body>
