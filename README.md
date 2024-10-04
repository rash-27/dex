# Decentralized Exchange 
![image](https://github.com/user-attachments/assets/2a6672e2-26d0-40ca-8245-d6515935d15b)


## How a Decentralized exchange Works ??
- Swaps in DEX are done using smart contracts (Whose code is public and any one can access the code and are immutable) 
- DEX work on the basis of liquidity pools of the smart contracts
- If that contract has a diverse liquidity of tokens then it can support swaps of various tokens
## Things implemented in the project
- This project has a total of three smart contracts in solidity (2 ERC-20 token contracts + a contract to swap tokens)
- This project has a feature to swap ERC-20 tokens managed by a smart contract(Currently only 2 as the local hardhat block chain has only two ERC-20 tokens deployed on it, so we can have liquidity for the two tokens only for a contract)
- Also transactions are maintained in the contract itself (source of truth) and also we can store it on our backend (Optionsal) by listening to events that are emitted while performing a transaction
- The front end is made with react and uses the Web3JS library to make calls to the block chain via the MetaMask Wallet and the swaps are signed with the help of the wallet.
- The user can get the list of all the swaps he made using the DEX, as well as the purchases he made to buy ERC-20 tokens with native ETH.(This info is stored on block chain itself).
- And also user can provide the liquidity of tokens to the swap contract.
## UI
![image](https://github.com/user-attachments/assets/1fa404d5-ad2f-442d-b3b5-675d71b7f5a3)
![image](https://github.com/user-attachments/assets/c4bd8d10-0fb1-4a11-9443-c468ed9a3a02)
![image](https://github.com/user-attachments/assets/59e8b2d5-7252-4aeb-972a-e867f4cbbbee)
