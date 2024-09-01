<p align='center'>
  <img src="./public/logo.png" width=600 />
</p>

Chaindraft
---

A blockchain-based fantasy draft game with challenge-able player pages.

Generate your dream lineup for offline contest or sportsbook using the app with lineups tracked on smart contracts. Keep your lineup as a shareable url and minted nft proving you drafted a given roster and at what time. Challenge other players

Track trending players

Initiate 1:1 competitions with other draft makers.

Chiliz for L1 deployment (public voting and trending players)
Fhenix for L2 deployment (private voting and drafts)

### Inspiration

Pain points:

- Traditional fantasy football platforms are centralized, and often require large engineering teams to run.
- There is often limited flexibility and customization in league settings and rules.
- Transaction fees and delays can frustrate users, especially when dealing with withdraws and rewards. Example: many platforms require entering your SSN just to cash out!
- Managing league data securely and transparently is a challenge with existing solutions.

### How Blockchain is Used

- **Blockchain provides a transparent and immutable ledger** for tracking league activities, transactions, and player statistics.
- **Smart contracts automate league management** tasks, such as scoring, payouts, and rule enforcement, ensuring fairness and consistency.
- **Decentralized identity verification** ensures that only verified users can participate, preventing fraud and multi-accounting.

### Technologies Used

- Web3Auth: Modal-based authentication. Main form of login for app.
- **Sign Protocol**: Ensures the human verifiable claim that the roster was produced randomly
- **Chiliz**: A blockchain-based fintech platform that allows fans to buy, trade, and execute voting rights in their favorite sports teams. In the context of BlockFantasy, Chiliz can be used for fan engagement and rewards, offering unique experiences and merchandise. Earn fan tokens for giving votes.
- **Lit Protocol**: Used for secure and decentralized access control, ensuring that only authorized users can access specific features or data within the app. It can also be used for encrypting sensitive user information. - User Identity / Proof of humanity / KYC

- **XMTP (Extensible Message Transport Protocol)**: Enables secure, decentralized messaging within the app. This can be used for communication between league members, announcements, and notifications about league activities.
- **Tableland/Basin**: Upload new images via s3

### Challenges

- Integrating multiple blockchain service providers into a single cohesive application.
- Ensuring a smooth user experience while interacting with blockchain features like smart contracts and digital wallets.
- Balancing decentralization with the need for quick and responsive user interactions.

### Future Work

- **Expanding cross-chain capabilities** to support more blockchains, offering users a broader range of options for transactions and participation.
- **Developing a mobile app** to enhance accessibility and user experience on the go.
- **Implementing advanced analytics tools** to provide in-depth insights into player performance and league trends.
- **Exploring partnerships with sports teams and organizations** to offer exclusive content and experiences for users.
- **Integrating with NFT marketplaces** to allow users to buy, sell, and trade fantasy football-related NFTs.
- **Enhancing security and privacy features** to ensure user data protection and compliance with regulatory standards.
- **Introducing a governance model** where users can vote on platform updates, rules changes, and other key decisions, promoting a community-driven approach.

These features and technologies will position BlockFantasy as a leading, innovative solution in the decentralized fantasy sports market, offering users unparalleled transparency, security, and engagement.


### Useful links
* https://github.com/nflverse/nflverse-data/releases/tag/players
* https://github.com/Web3Auth/web3auth-web
* https://github.com/textileio/demo-basin-server
