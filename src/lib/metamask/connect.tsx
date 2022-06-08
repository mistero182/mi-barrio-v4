const connect = async (onConnected: any) => {
  if (!(window as any).ethereum) {
    alert("Get MetaMask!");
    return;
  }

  const accounts = await (window as any).ethereum.request({
    method: "eth_requestAccounts",
  });

  // console.log(accounts)

  onConnected(accounts[0]);
}

export { connect }