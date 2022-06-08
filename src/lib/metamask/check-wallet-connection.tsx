const checkIfWalletIsConnected = async (onConnected: any) => {
  if ((window as any).ethereum) {
    const accounts = await (window as any).ethereum.request({
      method: "eth_accounts",
    });

    // console.log(accounts)

    if (accounts.length > 0) {
      const account = accounts[0];
      onConnected(account);
      return;
    }
  }
}

export { checkIfWalletIsConnected }
