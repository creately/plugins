<script>
  import gravatarUrl from "gravatar-url";

  let value = "";
  let images = [];

  function handleInputEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleButtonClick(e) {
    e.preventDefault();
    handleSubmit();
  }

  function handleSubmit() {
    const emails = value.split(",").map(s => s.trim());
    images = emails.map(email => gravatarUrl(email, { size: 240 }));
  }

  function handleImageClick() {
    // ...
  }
</script>

<style>
  .control {
    width: 100%;
    display: block;
    padding: 12px 18px;
    margin: 0;
    border: solid 1px #aaa;
    box-sizing: border-box;
    font-size: 16px;
    font-family: sans-serif;
    outline: none;
    border-radius: 3px;
    transition: all 250ms;
  }

  .control + .control {
    margin-top: 6px;
  }

  input.control {
    text-align: left;
    color: #666;
  }

  input.control::placeholder {
    color: #ddd;
  }

  input.control:focus {
    border-color: #666;
  }

  button.control {
    text-align: center;
    color: #aaa;
    cursor: pointer;
  }

  button.control:hover {
    color: #666;
    border-color: #666;
  }

  #info {
    margin-top: 24px;
  }

  #info img {
    display: inline-block;
    width: 240px;
    max-width: 100%;
    height: auto;
    box-sizing: border-box;
    border: dashed 1px #aaa;
    cursor: pointer;
  }
</style>

<div id="form">
  <input
    class="control"
    type="text"
    placeholder="Enter email addresses separated by commas:"
    bind:value
    on:keydown={handleInputEnter} />
  <button class="control" on:click={handleButtonClick}>Fetch Gravatar!</button>
</div>

<div id="info">
  {#each images as image}
    <img on:click={handleImageClick} src={image} alt="" />
  {/each}
</div>
