declare namespace Components {
  namespace Schemas {
    /**
     * An AccountBalanceRequest is utilized to make a balance request on the /account/balance endpoint. If the block_identifier is populated, a historical balance query should be performed.
     */
    export interface AccountBalanceRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      account_identifier: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier;
      block_identifier?: /* When fetching data by BlockIdentifier, it may be possible to only specify the index or hash. If neither property is specified, it is assumed that the client is making a request at the current block. */ PartialBlockIdentifier;
      /**
       * In some cases, the caller may not want to retrieve all available balances for an AccountIdentifier. If the currencies field is populated, only balances for the specified currencies will be returned. If not populated, all available balances will be returned.
       */
      currencies?: /* Currency is composed of a canonical Symbol and Decimals. This Decimals value is used to convert an Amount.Value from atomic units (Satoshis) to standard units (Bitcoins). */ Currency[];
    }
    /**
     * An AccountBalanceResponse is returned on the /account/balance endpoint. If an account has a balance for each AccountIdentifier describing it (ex: an ERC-20 token balance on a few smart contracts), an account balance request must be made with each AccountIdentifier. The `coins` field was removed and replaced by by `/account/coins` in `v1.4.7`.
     */
    export interface AccountBalanceResponse {
      block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      /**
       * A single account may have a balance in multiple currencies.
       */
      balances: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount[];
      /**
       * Account-based blockchains that utilize a nonce or sequence number should include that number in the metadata. This number could be unique to the identifier or global across the account address.
       * example:
       * {
       *   "sequence_number": 23
       * }
       */
      metadata?: {};
    }
    /**
     * AccountCoinsRequest is utilized to make a request on the /account/coins endpoint.
     */
    export interface AccountCoinsRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      account_identifier: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier;
      /**
       * Include state from the mempool when looking up an account's unspent coins. Note, using this functionality breaks any guarantee of idempotency.
       */
      include_mempool?: boolean;
      /**
       * In some cases, the caller may not want to retrieve coins for all currencies for an AccountIdentifier. If the currencies field is populated, only coins for the specified currencies will be returned. If not populated, all unspent coins will be returned.
       */
      currencies?: /* Currency is composed of a canonical Symbol and Decimals. This Decimals value is used to convert an Amount.Value from atomic units (Satoshis) to standard units (Bitcoins). */ Currency[];
    }
    /**
     * AccountCoinsResponse is returned on the /account/coins endpoint and includes all unspent Coins owned by an AccountIdentifier.
     */
    export interface AccountCoinsResponse {
      block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      /**
       * If a blockchain is UTXO-based, all unspent Coins owned by an account_identifier should be returned alongside the balance. It is highly recommended to populate this field so that users of the Rosetta API implementation don't need to maintain their own indexer to track their UTXOs.
       */
      coins: /* Coin contains its unique identifier and the amount it represents. */ Coin[];
      /**
       * Account-based blockchains that utilize a nonce or sequence number should include that number in the metadata. This number could be unique to the identifier or global across the account address.
       * example:
       * {
       *   "sequence_number": 23
       * }
       */
      metadata?: {};
    }
    /**
     * The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated).
     */
    export interface AccountIdentifier {
      /**
       * The address may be a cryptographic public key (or some encoding of it) or a provided username.
       * example:
       * 0x3a065000ab4183c6bf581dc1e55a605455fc6d61
       */
      address: string;
      sub_account?: /* An account may have state specific to a contract address (ERC-20 token) and/or a stake (delegated balance). The sub_account_identifier should specify which state (if applicable) an account instantiation refers to. */ SubAccountIdentifier;
      /**
       * Blockchains that utilize a username model (where the address is not a derivative of a cryptographic public key) should specify the public key(s) owned by the address in metadata.
       */
      metadata?: {};
    }
    /**
     * * Base address - associated to a payment and a staking credential, * Reward address - associated to a staking credential * Enterprise address - holds no delegation rights and will be created when no stake key is sent to the API
     */
    export type AddressType = string;
    /**
     * Allow specifies supported Operation status, Operation types, and all possible error statuses. This Allow object is used by clients to validate the correctness of a Rosetta Server implementation. It is expected that these clients will error if they receive some response that contains any of the above information that is not specified here.
     */
    export interface Allow {
      /**
       * All Operation.Status this implementation supports. Any status that is returned during parsing that is not listed here will cause client validation to error.
       */
      operation_statuses: /**
       * OperationStatus is utilized to indicate which Operation status are considered successful.
       * example:
       * {
       *   "status": "SUCCESS",
       *   "successful": true
       * }
       */
      OperationStatus[];
      /**
       * All Operation.Type this implementation supports. Any type that is returned during parsing that is not listed here will cause client validation to error.
       */
      operation_types: string[];
      /**
       * All Errors that this implementation could return. Any error that is returned during parsing that is not listed here will cause client validation to error.
       */
      errors: /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Error[];
      /**
       * Any Rosetta implementation that supports querying the balance of an account at any height in the past should set this to true.
       */
      historical_balance_lookup: boolean;
      /**
       * If populated, `timestamp_start_index` indicates the first block index where block timestamps are considered valid (i.e. all blocks less than `timestamp_start_index` could have invalid timestamps). This is useful when the genesis block (or blocks) of a network have timestamp 0. If not populated, block timestamps are assumed to be valid for all available blocks.
       */
      timestamp_start_index?: number; // int64
      /**
       * All methods that are supported by the /call endpoint. Communicating which parameters should be provided to /call is the responsibility of the implementer (this is en lieu of defining an entire type system and requiring the implementer to define that in Allow).
       */
      call_methods: string[];
      /**
       * BalanceExemptions is an array of BalanceExemption indicating which account balances could change without a corresponding Operation. BalanceExemptions should be used sparingly as they may introduce significant complexity for integrators that attempt to reconcile all account balance changes. If your implementation relies on any BalanceExemptions, you MUST implement historical balance lookup (the ability to query an account balance at any BlockIdentifier).
       */
      balance_exemptions: /* BalanceExemption indicates that the balance for an exempt account could change without a corresponding Operation. This typically occurs with staking rewards, vesting balances, and Currencies with a dynamic supply. Currently, it is possible to exempt an account from strict reconciliation by SubAccountIdentifier.Address or by Currency. This means that any account with SubAccountIdentifier.Address would be exempt or any balance of a particular Currency would be exempt, respectively. BalanceExemptions should be used sparingly as they may introduce significant complexity for integrators that attempt to reconcile all account balance changes. If your implementation relies on any BalanceExemptions, you MUST implement historical balance lookup (the ability to query an account balance at any BlockIdentifier). */ BalanceExemption[];
      /**
       * Any Rosetta implementation that can update an AccountIdentifier's unspent coins based on the contents of the mempool should populate this field as true. If false, requests to `/account/coins` that set `include_mempool` as true will be automatically rejected.
       */
      mempool_coins: boolean;
    }
    /**
     * Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency.
     */
    export interface Amount {
      /**
       * Value of the transaction in atomic units represented as an arbitrary-sized signed integer. For example, 1 BTC would be represented by a value of 100000000.
       * example:
       * 1238089899992
       */
      value: string;
      currency: /* Currency is composed of a canonical Symbol and Decimals. This Decimals value is used to convert an Amount.Value from atomic units (Satoshis) to standard units (Bitcoins). */ Currency;
      metadata?: {};
    }
    /**
     * BalanceExemption indicates that the balance for an exempt account could change without a corresponding Operation. This typically occurs with staking rewards, vesting balances, and Currencies with a dynamic supply. Currently, it is possible to exempt an account from strict reconciliation by SubAccountIdentifier.Address or by Currency. This means that any account with SubAccountIdentifier.Address would be exempt or any balance of a particular Currency would be exempt, respectively. BalanceExemptions should be used sparingly as they may introduce significant complexity for integrators that attempt to reconcile all account balance changes. If your implementation relies on any BalanceExemptions, you MUST implement historical balance lookup (the ability to query an account balance at any BlockIdentifier).
     */
    export interface BalanceExemption {
      /**
       * SubAccountAddress is the SubAccountIdentifier.Address that the BalanceExemption applies to (regardless of the value of SubAccountIdentifier.Metadata).
       * example:
       * staking
       */
      sub_account_address?: string;
      currency?: /* Currency is composed of a canonical Symbol and Decimals. This Decimals value is used to convert an Amount.Value from atomic units (Satoshis) to standard units (Bitcoins). */ Currency;
      exemption_type?: /* ExemptionType is used to indicate if the live balance for an account subject to a BalanceExemption could increase above, decrease below, or equal the computed balance. * greater_or_equal: The live balance may increase above or equal the computed balance. This typically   occurs with staking rewards that accrue on each block. * less_or_equal: The live balance may decrease below or equal the computed balance. This typically   occurs as balance moves from locked to spendable on a vesting account. * dynamic: The live balance may increase above, decrease below, or equal the computed balance. This   typically occurs with tokens that have a dynamic supply. */ ExemptionType;
    }
    /**
     * Blocks contain an array of Transactions that occurred at a particular BlockIdentifier. A hard requirement for blocks returned by Rosetta implementations is that they MUST be _inalterable_: once a client has requested and received a block identified by a specific BlockIndentifier, all future calls for that same BlockIdentifier must return the same block contents.
     */
    export interface Block {
      block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      parent_block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      timestamp: /**
       * The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
       * example:
       * 1582833600000
       */
      Timestamp /* int64 */;
      transactions: /* Transactions contain an array of Operations that are attributable to the same TransactionIdentifier. */ Transaction[];
      /**
       * example:
       * {
       *   "transactions_root": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
       *   "difficulty": "123891724987128947"
       * }
       */
      metadata?: {
        transactionsCount?: number;
        createdBy?: string;
        size?: number;
        epochNo?: number;
        slotNo?: number;
      };
    }
    /**
     * BlockEvent represents the addition or removal of a BlockIdentifier from storage. Streaming BlockEvents allows lightweight clients to update their own state without needing to implement their own syncing logic.
     */
    export interface BlockEvent {
      /**
       * sequence is the unique identifier of a BlockEvent within the context of a NetworkIdentifier.
       * example:
       * 5
       */
      sequence: number; // int64
      block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      type: /* BlockEventType determines if a BlockEvent represents the addition or removal of a block. */ BlockEventType;
    }
    /**
     * BlockEventType determines if a BlockEvent represents the addition or removal of a block.
     */
    export type BlockEventType = 'block_added' | 'block_removed';
    /**
     * The block_identifier uniquely identifies a block in a particular network.
     */
    export interface BlockIdentifier {
      /**
       * This is also known as the block height.
       * example:
       * 1123941
       */
      index: number; // int64
      /**
       * example:
       * 0x1f2cc6c5027d2f201a5453ad1119574d2aed23a392654742ac3c78783c071f85
       */
      hash: string;
    }
    /**
     * A BlockRequest is utilized to make a block request on the /block endpoint.
     */
    export interface BlockRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      block_identifier: /* When fetching data by BlockIdentifier, it may be possible to only specify the index or hash. If neither property is specified, it is assumed that the client is making a request at the current block. */ PartialBlockIdentifier;
    }
    /**
     * A BlockResponse includes a fully-populated block or a partially-populated block with a list of other transactions to fetch (other_transactions). As a result of the consensus algorithm of some blockchains, blocks can be omitted (i.e. certain block indices can be skipped). If a query for one of these omitted indices is made, the response should not include a `Block` object. It is VERY important to note that blocks MUST still form a canonical, connected chain of blocks where each block has a unique index. In other words, the `PartialBlockIdentifier` of a block after an omitted block should reference the last non-omitted block.
     */
    export interface BlockResponse {
      block: /* Blocks contain an array of Transactions that occurred at a particular BlockIdentifier. A hard requirement for blocks returned by Rosetta implementations is that they MUST be _inalterable_: once a client has requested and received a block identified by a specific BlockIndentifier, all future calls for that same BlockIdentifier must return the same block contents. */ Block;
      /**
       * Some blockchains may require additional transactions to be fetched that weren't returned in the block response (ex: block only returns transaction hashes). For blockchains with a lot of transactions in each block, this can be very useful as consumers can concurrently fetch all transactions returned.
       */
      other_transactions?: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier[];
    }
    /**
     * BlockTransaction contains a populated Transaction and the BlockIdentifier that contains it.
     */
    export interface BlockTransaction {
      block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      transaction: /* Transactions contain an array of Operations that are attributable to the same TransactionIdentifier. */ Transaction;
    }
    /**
     * A BlockTransactionRequest is used to fetch a Transaction included in a block that is not returned in a BlockResponse.
     */
    export interface BlockTransactionRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      transaction_identifier: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier;
    }
    /**
     * A BlockTransactionResponse contains information about a block transaction.
     */
    export interface BlockTransactionResponse {
      transaction: /* Transactions contain an array of Operations that are attributable to the same TransactionIdentifier. */ Transaction;
    }
    /**
     * CallRequest is the input to the `/call` endpoint.
     */
    export interface CallRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      /**
       * Method is some network-specific procedure call. This method could map to a network-specific RPC endpoint, a method in an SDK generated from a smart contract, or some hybrid of the two. The implementation must define all available methods in the Allow object. However, it is up to the caller to determine which parameters to provide when invoking `/call`.
       * example:
       * eth_call
       */
      method: string;
      /**
       * Parameters is some network-specific argument for a method. It is up to the caller to determine which parameters to provide when invoking `/call`.
       * example:
       * {
       *   "block_number": 23,
       *   "address": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5"
       * }
       */
      parameters: {};
    }
    /**
     * CallResponse contains the result of a `/call` invocation.
     */
    export interface CallResponse {
      /**
       * Result contains the result of the `/call` invocation. This result will not be inspected or interpreted by Rosetta tooling and is left to the caller to decode.
       * example:
       * {
       *   "count": 1000
       * }
       */
      result: {};
      /**
       * Idempotent indicates that if `/call` is invoked with the same CallRequest again, at any point in time, it will return the same CallResponse. Integrators may cache the CallResponse if this is set to true to avoid making unnecessary calls to the Rosetta implementation. For this reason, implementers should be very conservative about returning true here or they could cause issues for the caller.
       */
      idempotent: boolean;
    }
    /**
     * Coin contains its unique identifier and the amount it represents.
     */
    export interface Coin {
      coin_identifier: /* CoinIdentifier uniquely identifies a Coin. */ CoinIdentifier;
      amount: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount;
      metadata?: {
        [name: string]: TokenBundleItem[];
      };
    }
    /**
     * CoinActions are different state changes that a Coin can undergo. When a Coin is created, it is coin_created. When a Coin is spent, it is coin_spent. It is assumed that a single Coin cannot be created or spent more than once.
     */
    export type CoinAction = 'coin_created' | 'coin_spent';
    /**
     * CoinChange is used to represent a change in state of a some coin identified by a coin_identifier. This object is part of the Operation model and must be populated for UTXO-based blockchains. Coincidentally, this abstraction of UTXOs allows for supporting both account-based transfers and UTXO-based transfers on the same blockchain (when a transfer is account-based, don't populate this model).
     */
    export interface CoinChange {
      coin_identifier: /* CoinIdentifier uniquely identifies a Coin. */ CoinIdentifier;
      coin_action: /* CoinActions are different state changes that a Coin can undergo. When a Coin is created, it is coin_created. When a Coin is spent, it is coin_spent. It is assumed that a single Coin cannot be created or spent more than once. */ CoinAction;
    }
    /**
     * CoinIdentifier uniquely identifies a Coin.
     */
    export interface CoinIdentifier {
      /**
       * Identifier should be populated with a globally unique identifier of a Coin. In Bitcoin, this identifier would be transaction_hash:index.
       * example:
       * 0x2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f:1
       */
      identifier: string;
    }
    /**
     * ConstructionCombineRequest is the input to the `/construction/combine` endpoint. It contains the unsigned transaction blob returned by `/construction/payloads` and all required signatures to create a network transaction.
     */
    export interface ConstructionCombineRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      unsigned_transaction: string;
      signatures: /* Signature contains the payload that was signed, the public keys of the keypairs used to produce the signature, the signature (encoded in hex), and the SignatureType. PublicKey is often times not known during construction of the signing payloads but may be needed to combine signatures properly. */ Signature[];
    }
    /**
     * ConstructionCombineResponse is returned by `/construction/combine`. The network payload will be sent directly to the `construction/submit` endpoint.
     */
    export interface ConstructionCombineResponse {
      signed_transaction: string;
    }
    /**
     * ConstructionDeriveRequest is passed to the `/construction/derive` endpoint. Network is provided in the request because some blockchains have different address formats for different networks. Metadata is provided in the request because some blockchains allow for multiple address types (i.e. different address for validators vs normal accounts).
     */
    export interface ConstructionDeriveRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      public_key: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey;
      metadata?: {
        staking_credential?: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey;
        address_type?: /* * Base address - associated to a payment and a staking credential, * Reward address - associated to a staking credential * Enterprise address - holds no delegation rights and will be created when no stake key is sent to the API */ AddressType;
      };
    }
    /**
     * ConstructionDeriveResponse is returned by the `/construction/derive` endpoint.
     */
    export interface ConstructionDeriveResponse {
      /**
       * [DEPRECATED by `account_identifier` in `v1.4.4`] Address in network-specific format.
       */
      address?: string;
      account_identifier: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier;
      metadata?: {};
    }
    /**
     * ConstructionHashRequest is the input to the `/construction/hash` endpoint.
     */
    export interface ConstructionHashRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      signed_transaction: string;
    }
    /**
     * A ConstructionMetadataRequest is utilized to get information required to construct a transaction. The Options object used to specify which metadata to return is left purposely unstructured to allow flexibility for implementers. Options is not required in the case that there is network-wide metadata of interest. Optionally, the request can also include an array of PublicKeys associated with the AccountIdentifiers returned in ConstructionPreprocessResponse.
     */
    export interface ConstructionMetadataRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      /**
       * Some blockchains require different metadata for different types of transaction construction (ex: delegation versus a transfer). Instead of requiring a blockchain node to return all possible types of metadata for construction (which may require multiple node fetches), the client can populate an options object to limit the metadata returned to only the subset required.
       */
      options: {
        relative_ttl: number;
        transaction_size: number;
      };
      public_keys?: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey[];
    }
    /**
     * The ConstructionMetadataResponse returns network-specific metadata used for transaction construction. Optionally, the implementer can return the suggested fee associated with the transaction being constructed. The caller may use this info to adjust the intent of the transaction or to create a transaction with a different account that can pay the suggested fee. Suggested fee is an array in case fee payment must occur in multiple currencies.
     */
    export interface ConstructionMetadataResponse {
      /**
       * example:
       * {
       *   "account_sequence": 23,
       *   "recent_block_hash": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5"
       * }
       */
      metadata: {
        ttl?: string;
      };
      suggested_fee?: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount[];
    }
    /**
     * ConstructionParseRequest is the input to the `/construction/parse` endpoint. It allows the caller to parse either an unsigned or signed transaction.
     */
    export interface ConstructionParseRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      /**
       * Signed is a boolean indicating whether the transaction is signed.
       */
      signed: boolean;
      /**
       * This must be either the unsigned transaction blob returned by `/construction/payloads` or the signed transaction blob returned by `/construction/combine`.
       */
      transaction: string;
    }
    /**
     * ConstructionParseResponse contains an array of operations that occur in a transaction blob. This should match the array of operations provided to `/construction/preprocess` and `/construction/payloads`.
     */
    export interface ConstructionParseResponse {
      operations: /* Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction. Operations are used both to represent on-chain data (Data API) and to construct new transactions (Construction API), creating a standard interface for reading and writing to blockchains. */ Operation[];
      /**
       * [DEPRECATED by `account_identifier_signers` in `v1.4.4`] All signers (addresses) of a particular transaction. If the transaction is unsigned, it should be empty.
       */
      signers?: string[];
      account_identifier_signers: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier[];
      metadata?: {};
    }
    /**
     * ConstructionPayloadsRequest is the request to `/construction/payloads`. It contains the network, a slice of operations, and arbitrary metadata that was returned by the call to `/construction/metadata`. Optionally, the request can also include an array of PublicKeys associated with the AccountIdentifiers returned in ConstructionPreprocessResponse.
     */
    export interface ConstructionPayloadsRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      operations: /* Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction. Operations are used both to represent on-chain data (Data API) and to construct new transactions (Construction API), creating a standard interface for reading and writing to blockchains. */ Operation[];
      metadata: {
        ttl: string;
      };
      public_keys?: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey[];
    }
    /**
     * ConstructionTransactionResponse is returned by `/construction/payloads`. It contains an unsigned transaction blob (that is usually needed to construct the a network transaction from a collection of signatures) and an array of payloads that must be signed by the caller.
     */
    export interface ConstructionPayloadsResponse {
      unsigned_transaction: string;
      payloads: /* SigningPayload is signed by the client with the keypair associated with an AccountIdentifier using the specified SignatureType. SignatureType can be optionally populated if there is a restriction on the signature scheme that can be used to sign the payload. */ SigningPayload[];
    }
    /**
     * ConstructionPreprocessRequest is passed to the `/construction/preprocess` endpoint so that a Rosetta implementation can determine which metadata it needs to request for construction. Metadata provided in this object should NEVER be a product of live data (i.e. the caller must follow some network-specific data fetching strategy outside of the Construction API to populate required Metadata). If live data is required for construction, it MUST be fetched in the call to `/construction/metadata`. The caller can provide a max fee they are willing to pay for a transaction. This is an array in the case fees must be paid in multiple currencies. The caller can also provide a suggested fee multiplier to indicate that the suggested fee should be scaled. This may be used to set higher fees for urgent transactions or to pay lower fees when there is less urgency. It is assumed that providing a very low multiplier (like 0.0001) will never lead to a transaction being created with a fee less than the minimum network fee (if applicable). In the case that the caller provides both a max fee and a suggested fee multiplier, the max fee will set an upper bound on the suggested fee (regardless of the multiplier provided).
     */
    export interface ConstructionPreprocessRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      operations: /* Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction. Operations are used both to represent on-chain data (Data API) and to construct new transactions (Construction API), creating a standard interface for reading and writing to blockchains. */ Operation[];
      metadata?: {
        relative_ttl: number;
      };
      max_fee?: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount[];
      suggested_fee_multiplier?: number; // double
    }
    /**
     * ConstructionPreprocessResponse contains `options` that will be sent unmodified to `/construction/metadata`. If it is not necessary to make a request to `/construction/metadata`, `options` should be omitted.  Some blockchains require the PublicKey of particular AccountIdentifiers to construct a valid transaction. To fetch these PublicKeys, populate `required_public_keys` with the AccountIdentifiers associated with the desired PublicKeys. If it is not necessary to retrieve any PublicKeys for construction, `required_public_keys` should be omitted.
     */
    export interface ConstructionPreprocessResponse {
      /**
       * The options that will be sent directly to `/construction/metadata` by the caller.
       */
      options?: {
        relative_ttl: number;
        transaction_size: number;
      };
      required_public_keys?: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier[];
    }
    /**
     * The transaction submission request includes a signed transaction.
     */
    export interface ConstructionSubmitRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      signed_transaction: string;
    }
    /**
     * Currency is composed of a canonical Symbol and Decimals. This Decimals value is used to convert an Amount.Value from atomic units (Satoshis) to standard units (Bitcoins).
     */
    export interface Currency {
      /**
       * Canonical symbol associated with a currency.
       * example:
       * BTC
       */
      symbol: string;
      /**
       * Number of decimal places in the standard unit representation of the amount. For example, BTC has 8 decimals. Note that it is not possible to represent the value of some currency in atomic units that is not base 10.
       * example:
       * 8
       */
      decimals: number; // int32
      metadata?: any;
    }
    /**
     * CurveType is the type of cryptographic curve associated with a PublicKey. * secp256k1: SEC compressed - `33 bytes` (https://secg.org/sec1-v2.pdf#subsubsection.2.3.3) * secp256r1: SEC compressed - `33 bytes` (https://secg.org/sec1-v2.pdf#subsubsection.2.3.3) * edwards25519: `y (255-bits) || x-sign-bit (1-bit)` - `32 bytes` (https://ed25519.cr.yp.to/ed25519-20110926.pdf) * tweedle: 1st pk : Fq.t (32 bytes) || 2nd pk : Fq.t (32 bytes) (https://github.com/CodaProtocol/coda/blob/develop/rfcs/0038-rosetta-construction-api.md#marshal-keys)
     */
    export type CurveType = 'secp256k1' | 'secp256r1' | 'edwards25519' | 'tweedle';
    /**
     * Used by RelatedTransaction to indicate the direction of the relation (i.e. cross-shard/cross-network sends may reference `backward` to an earlier transaction and async execution may reference `forward`). Can be used to indicate if a transaction relation is from child to parent or the reverse.
     */
    export type Direction = 'forward' | 'backward';
    /**
     * Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields.
     */
    export interface Error {
      /**
       * Code is a network-specific error code. If desired, this code can be equivalent to an HTTP status code.
       * example:
       * 12
       */
      code: number; // int32
      /**
       * Message is a network-specific error message. The message MUST NOT change for a given code. In particular, this means that any contextual information should be included in the details field.
       * example:
       * Invalid account format
       */
      message: string;
      /**
       * Description allows the implementer to optionally provide additional information about an error. In many cases, the content of this field will be a copy-and-paste from existing developer documentation. Description can ONLY be populated with generic information about a particular type of error. It MUST NOT be populated with information about a particular instantiation of an error (use `details` for this). Whereas the content of Error.Message should stay stable across releases, the content of Error.Description will likely change across releases (as implementers improve error documentation). For this reason, the content in this field is not part of any type assertion (unlike Error.Message).
       * example:
       * This error is returned when the requested AccountIdentifier is improperly formatted.
       */
      description?: string;
      /**
       * An error is retriable if the same request may succeed if submitted again.
       */
      retriable: boolean;
      /**
       * Often times it is useful to return context specific to the request that caused the error (i.e. a sample of the stack trace or impacted account) in addition to the standard error message.
       * example:
       * {
       *   "address": "0x1dcc4de8dec75d7aab85b567b6",
       *   "error": "not base64"
       * }
       */
      details?: {
        message: string;
      };
    }
    /**
     * EventsBlocksRequest is utilized to fetch a sequence of BlockEvents indicating which blocks were added and removed from storage to reach the current state.
     */
    export interface EventsBlocksRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      /**
       * offset is the offset into the event stream to sync events from. If this field is not populated, we return the limit events backwards from tip. If this is set to 0, we start from the beginning.
       * example:
       * 5
       */
      offset?: number; // int64
      /**
       * limit is the maximum number of events to fetch in one call. The implementation may return <= limit events.
       * example:
       * 5
       */
      limit?: number; // int64
    }
    /**
     * EventsBlocksResponse contains an ordered collection of BlockEvents and the max retrievable sequence.
     */
    export interface EventsBlocksResponse {
      /**
       * max_sequence is the maximum available sequence number to fetch.
       * example:
       * 5
       */
      max_sequence: number; // int64
      /**
       * events is an array of BlockEvents indicating the order to add and remove blocks to maintain a canonical view of blockchain state. Lightweight clients can use this event stream to update state without implementing their own block syncing logic.
       */
      events: /* BlockEvent represents the addition or removal of a BlockIdentifier from storage. Streaming BlockEvents allows lightweight clients to update their own state without needing to implement their own syncing logic. */ BlockEvent[];
    }
    /**
     * ExemptionType is used to indicate if the live balance for an account subject to a BalanceExemption could increase above, decrease below, or equal the computed balance. * greater_or_equal: The live balance may increase above or equal the computed balance. This typically   occurs with staking rewards that accrue on each block. * less_or_equal: The live balance may decrease below or equal the computed balance. This typically   occurs as balance moves from locked to spendable on a vesting account. * dynamic: The live balance may increase above, decrease below, or equal the computed balance. This   typically occurs with tokens that have a dynamic supply.
     */
    export type ExemptionType = 'greater_or_equal' | 'less_or_equal' | 'dynamic';
    /**
     * A MempoolResponse contains all transaction identifiers in the mempool for a particular network_identifier.
     */
    export interface MempoolResponse {
      transaction_identifiers: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier[];
    }
    /**
     * A MempoolTransactionRequest is utilized to retrieve a transaction from the mempool.
     */
    export interface MempoolTransactionRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      transaction_identifier: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier;
    }
    /**
     * A MempoolTransactionResponse contains an estimate of a mempool transaction. It may not be possible to know the full impact of a transaction in the mempool (ex: fee paid).
     */
    export interface MempoolTransactionResponse {
      transaction: /* Transactions contain an array of Operations that are attributable to the same TransactionIdentifier. */ Transaction;
      /**
       * example:
       * {
       *   "descendant_fees": 123923,
       *   "ancestor_count": 2
       * }
       */
      metadata?: {};
    }
    /**
     * A MetadataRequest is utilized in any request where the only argument is optional metadata.
     */
    export interface MetadataRequest {
      metadata?: {};
    }
    /**
     * The network_identifier specifies which network a particular object is associated with.
     */
    export interface NetworkIdentifier {
      /**
       * example:
       * bitcoin
       */
      blockchain: string;
      /**
       * If a blockchain has a specific chain-id or network identifier, it should go in this field. It is up to the client to determine which network-specific identifier is mainnet or testnet.
       * example:
       * mainnet
       */
      network: string;
      sub_network_identifier?: /* In blockchains with sharded state, the SubNetworkIdentifier is required to query some object on a specific shard. This identifier is optional for all non-sharded blockchains. */ SubNetworkIdentifier;
    }
    /**
     * A NetworkListResponse contains all NetworkIdentifiers that the node can serve information for.
     */
    export interface NetworkListResponse {
      network_identifiers: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier[];
    }
    /**
     * NetworkOptionsResponse contains information about the versioning of the node and the allowed operation statuses, operation types, and errors.
     */
    export interface NetworkOptionsResponse {
      version: /* The Version object is utilized to inform the client of the versions of different components of the Rosetta implementation. */ Version;
      allow: /* Allow specifies supported Operation status, Operation types, and all possible error statuses. This Allow object is used by clients to validate the correctness of a Rosetta Server implementation. It is expected that these clients will error if they receive some response that contains any of the above information that is not specified here. */ Allow;
    }
    /**
     * A NetworkRequest is utilized to retrieve some data specific exclusively to a NetworkIdentifier.
     */
    export interface NetworkRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      metadata?: {};
    }
    /**
     * NetworkStatusResponse contains basic information about the node's view of a blockchain network. It is assumed that any BlockIdentifier.Index less than or equal to CurrentBlockIdentifier.Index can be queried. If a Rosetta implementation prunes historical state, it should populate the optional `oldest_block_identifier` field with the oldest block available to query. If this is not populated, it is assumed that the `genesis_block_identifier` is the oldest queryable block. If a Rosetta implementation performs some pre-sync before it is possible to query blocks, sync_status should be populated so that clients can still monitor healthiness. Without this field, it may appear that the implementation is stuck syncing and needs to be terminated.
     */
    export interface NetworkStatusResponse {
      current_block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      current_block_timestamp: /**
       * The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
       * example:
       * 1582833600000
       */
      Timestamp /* int64 */;
      genesis_block_identifier: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      oldest_block_identifier?: /* The block_identifier uniquely identifies a block in a particular network. */ BlockIdentifier;
      sync_status?: /* SyncStatus is used to provide additional context about an implementation's sync status. This object is often used by implementations to indicate healthiness when block data cannot be queried until some sync phase completes or cannot be determined by comparing the timestamp of the most recent block with the current time. */ SyncStatus;
      peers: /* A Peer is a representation of a node's peer. */ Peer[];
    }
    /**
     * Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction. Operations are used both to represent on-chain data (Data API) and to construct new transactions (Construction API), creating a standard interface for reading and writing to blockchains.
     */
    export interface Operation {
      operation_identifier: /* The operation_identifier uniquely identifies an operation within a transaction. */ OperationIdentifier;
      /**
       * Restrict referenced related_operations to identifier indices < the current operation_identifier.index. This ensures there exists a clear DAG-structure of relations. Since operations are one-sided, one could imagine relating operations in a single transfer or linking operations in a call tree.
       * example:
       * [
       *   {
       *     "index": 1
       *   },
       *   {
       *     "index": 2
       *   }
       * ]
       */
      related_operations?: /* The operation_identifier uniquely identifies an operation within a transaction. */ OperationIdentifier[];
      /**
       * Type is the network-specific type of the operation. Ensure that any type that can be returned here is also specified in the NetworkOptionsResponse. This can be very useful to downstream consumers that parse all block data.
       * example:
       * Transfer
       */
      type: string;
      /**
       * Status is the network-specific status of the operation. Status is not defined on the transaction object because blockchains with smart contracts may have transactions that partially apply (some operations are successful and some are not). Blockchains with atomic transactions (all operations succeed or all operations fail) will have the same status for each operation. On-chain operations (operations retrieved in the `/block` and `/block/transaction` endpoints) MUST have a populated status field (anything on-chain must have succeeded or failed). However, operations provided during transaction construction (often times called "intent" in the documentation) MUST NOT have a populated status field (operations yet to be included on-chain have not yet succeeded or failed).
       * example:
       * Reverted
       */
      status?: string;
      account?: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier;
      amount?: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount;
      coin_change?: /* CoinChange is used to represent a change in state of a some coin identified by a coin_identifier. This object is part of the Operation model and must be populated for UTXO-based blockchains. Coincidentally, this abstraction of UTXOs allows for supporting both account-based transfers and UTXO-based transfers on the same blockchain (when a transfer is account-based, don't populate this model). */ CoinChange;
      /**
       * example:
       * {
       *   "staking_credential": {
       *     "hex_bytes": "1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F",
       *     "curve_type": "edwards25519"
       *   },
       *   "payment_key": {
       *     "hex_bytes": "1B400D60AAF34EAF6DCBAB9BBA46001A23497886CF11066F7846933D30E5AD3F",
       *     "curve_type": "edwards25519"
       *   },
       *   "asm": "304502201fd8abb11443f8b1b9a04e0495e0543d05611473a790c8939f089d073f90509a022100f4677825136605d732e2126d09a2d38c20c75946cd9fc239c0497e84c634e3dd01 03301a8259a12e35694cc22ebc45fee635f4993064190f6ce96e7fb19a03bb6be2",
       *   "hex": "48304502201fd8abb11443f8b1b9a04e0495e0543d05611473a790c8939f089d073f90509a022100f4677825136605d732e2126d09a2d38c20c75946cd9fc239c0497e84c634e3dd012103301a8259a12e35694cc22ebc45fee635f4993064190f6ce96e7fb19a03bb6be2"
       * }
       */
      metadata?: /* Metadata related to Cardano operations */ OperationMetadata;
    }
    /**
     * The operation_identifier uniquely identifies an operation within a transaction.
     */
    export interface OperationIdentifier {
      /**
       * The operation index is used to ensure each operation has a unique identifier within a transaction. This index is only relative to the transaction and NOT GLOBAL. The operations in each transaction should start from index 0. To clarify, there may not be any notion of an operation index in the blockchain being described.
       * example:
       * 5
       */
      index: number; // int64
      /**
       * Some blockchains specify an operation index that is essential for client use. For example, Bitcoin uses a network_index to identify which UTXO was used in a transaction. network_index should not be populated if there is no notion of an operation index in a blockchain (typically most account-based blockchains).
       * example:
       * 0
       */
      network_index?: number; // int64
    }
    /**
     * Metadata related to Cardano operations
     */
    export interface OperationMetadata {
      /**
       * If it's a withdrawal operation, the amount will re returned here.
       */
      withdrawalAmount?: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount;
      /**
       * If it's a registration operation, the amount will re returned here.
       */
      depositAmount?: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount;
      /**
       * If it's a deregistration operation, the amount will re returned here.
       */
      fundAmount?: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount;
      staking_credential?: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey;
      pool_key_hash?: string;
      /**
       * A token bundle is a heterogeneous (‘mixed’) collection of tokens. Any tokens can be bundled together. Token bundles are the standard - and only - way to represent and store assets on the Cardano blockchain.
       */
      tokenBundle?: TokenBundleItem[];
      /**
       * Certificate of a pool registration encoded as hex string
       */
      poolRegistrationCert?: string;
      poolRegistrationParams?: PoolRegistrationParams;
    }
    /**
     * OperationStatus is utilized to indicate which Operation status are considered successful.
     * example:
     * {
     *   "status": "SUCCESS",
     *   "successful": true
     * }
     */
    export interface OperationStatus {
      /**
       * The status is the network-specific status of the operation.
       */
      status: string;
      /**
       * An Operation is considered successful if the Operation.Amount should affect the Operation.Account. Some blockchains (like Bitcoin) only include successful operations in blocks but other blockchains (like Ethereum) include unsuccessful operations that incur a fee. To reconcile the computed balance from the stream of Operations, it is critical to understand which Operation.Status indicate an Operation is successful and should affect an Account.
       */
      successful: boolean;
    }
    /**
     * Operator is used by query-related endpoints to determine how to apply conditions. If this field is not populated, the default `and` value will be used.
     */
    export type Operator = 'or' | 'and';
    /**
     * When fetching data by BlockIdentifier, it may be possible to only specify the index or hash. If neither property is specified, it is assumed that the client is making a request at the current block.
     */
    export interface PartialBlockIdentifier {
      /**
       * example:
       * 1123941
       */
      index?: number; // int64
      /**
       * example:
       * 0x1f2cc6c5027d2f201a5453ad1119574d2aed23a392654742ac3c78783c071f85
       */
      hash?: string;
    }
    /**
     * A Peer is a representation of a node's peer.
     */
    export interface Peer {
      /**
       * example:
       * 0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5
       */
      peer_id: string;
      metadata?: {};
    }
    export interface PoolMargin {
      numerator: string;
      denominator: string;
    }
    export interface PoolMetadata {
      url: string;
      hash: string;
    }
    export interface PoolRegistrationParams {
      vrfKeyHash: string;
      /**
       * Lovelace amount to pledge
       */
      pledge: string;
      /**
       * Operational costs per epoch lovelace
       */
      cost: string;
      poolOwners: string[];
      relays: Relay[];
      margin: PoolMargin;
      poolMetadata?: PoolMetadata;
    }
    /**
     * PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation.
     */
    export interface PublicKey {
      /**
       * Hex-encoded public key bytes in the format specified by the CurveType.
       */
      hex_bytes: string;
      curve_type: /* CurveType is the type of cryptographic curve associated with a PublicKey. * secp256k1: SEC compressed - `33 bytes` (https://secg.org/sec1-v2.pdf#subsubsection.2.3.3) * secp256r1: SEC compressed - `33 bytes` (https://secg.org/sec1-v2.pdf#subsubsection.2.3.3) * edwards25519: `y (255-bits) || x-sign-bit (1-bit)` - `32 bytes` (https://ed25519.cr.yp.to/ed25519-20110926.pdf) * tweedle: 1st pk : Fq.t (32 bytes) || 2nd pk : Fq.t (32 bytes) (https://github.com/CodaProtocol/coda/blob/develop/rfcs/0038-rosetta-construction-api.md#marshal-keys) */ CurveType;
    }
    /**
     * The related_transaction allows implementations to link together multiple transactions. An unpopulated network identifier indicates that the related transaction is on the same network.
     */
    export interface RelatedTransaction {
      network_identifier?: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      transaction_identifier: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier;
      direction: /* Used by RelatedTransaction to indicate the direction of the relation (i.e. cross-shard/cross-network sends may reference `backward` to an earlier transaction and async execution may reference `forward`). Can be used to indicate if a transaction relation is from child to parent or the reverse. */ Direction;
    }
    export interface Relay {
      type: string;
      ipv4?: string;
      ipv6?: string;
      dnsName?: string;
      port?: string;
    }
    /**
     * SearchTransactionsRequest is used to search for transactions matching a set of provided conditions in canonical blocks.
     */
    export interface SearchTransactionsRequest {
      network_identifier: /* The network_identifier specifies which network a particular object is associated with. */ NetworkIdentifier;
      operator?: /* Operator is used by query-related endpoints to determine how to apply conditions. If this field is not populated, the default `and` value will be used. */ Operator;
      /**
       * max_block is the largest block index to consider when searching for transactions. If this field is not populated, the current block is considered the max_block. If you do not specify a max_block, it is possible a newly synced block will interfere with paginated transaction queries (as the offset could become invalid with newly added rows).
       * example:
       * 5
       */
      max_block?: number; // int64
      /**
       * offset is the offset into the query result to start returning transactions. If any search conditions are changed, the query offset will change and you must restart your search iteration.
       * example:
       * 5
       */
      offset?: number; // int64
      /**
       * limit is the maximum number of transactions to return in one call. The implementation may return <= limit transactions.
       * example:
       * 5
       */
      limit?: number; // int64
      transaction_identifier?: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier;
      account_identifier?: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier;
      coin_identifier?: /* CoinIdentifier uniquely identifies a Coin. */ CoinIdentifier;
      currency?: /* Currency is composed of a canonical Symbol and Decimals. This Decimals value is used to convert an Amount.Value from atomic units (Satoshis) to standard units (Bitcoins). */ Currency;
      /**
       * status is the network-specific operation type.
       * example:
       * reverted
       */
      status?: string;
      /**
       * type is the network-specific operation type.
       * example:
       * transfer
       */
      type?: string;
      /**
       * address is AccountIdentifier.Address. This is used to get all transactions related to an AccountIdentifier.Address, regardless of SubAccountIdentifier.
       * example:
       * 0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347
       */
      address?: string;
      /**
       * success is a synthetic condition populated by parsing network-specific operation statuses (using the mapping provided in `/network/options`).
       */
      success?: boolean;
    }
    /**
     * SearchTransactionsResponse contains an ordered collection of BlockTransactions that match the query in SearchTransactionsRequest. These BlockTransactions are sorted from most recent block to oldest block.
     */
    export interface SearchTransactionsResponse {
      /**
       * transactions is an array of BlockTransactions sorted by most recent BlockIdentifier (meaning that transactions in recent blocks appear first). If there are many transactions for a particular search, transactions may not contain all matching transactions. It is up to the caller to paginate these transactions using the max_block field.
       */
      transactions: /* BlockTransaction contains a populated Transaction and the BlockIdentifier that contains it. */ BlockTransaction[];
      /**
       * total_count is the number of results for a given search. Callers typically use this value to concurrently fetch results by offset or to display a virtual page number associated with results.
       * example:
       * 5
       */
      total_count: number; // int64
      /**
       * next_offset is the next offset to use when paginating through transaction results. If this field is not populated, there are no more transactions to query.
       * example:
       * 5
       */
      next_offset?: number; // int64
    }
    /**
     * Signature contains the payload that was signed, the public keys of the keypairs used to produce the signature, the signature (encoded in hex), and the SignatureType. PublicKey is often times not known during construction of the signing payloads but may be needed to combine signatures properly.
     */
    export interface Signature {
      signing_payload: /* SigningPayload is signed by the client with the keypair associated with an AccountIdentifier using the specified SignatureType. SignatureType can be optionally populated if there is a restriction on the signature scheme that can be used to sign the payload. */ SigningPayload;
      public_key: /* PublicKey contains a public key byte array for a particular CurveType encoded in hex. Note that there is no PrivateKey struct as this is NEVER the concern of an implementation. */ PublicKey;
      signature_type: /* SignatureType is the type of a cryptographic signature. * ecdsa: `r (32-bytes) || s (32-bytes)` - `64 bytes` * ecdsa_recovery: `r (32-bytes) || s (32-bytes) || v (1-byte)` - `65 bytes` * ed25519: `R (32-byte) || s (32-bytes)` - `64 bytes` * schnorr_1: `r (32-bytes) || s (32-bytes)` - `64 bytes`  (schnorr signature implemented by Zilliqa where both `r` and `s` are scalars encoded as `32-bytes` values, most significant byte first.) * schnorr_poseidon: `r (32-bytes) || s (32-bytes)` where s = Hash(1st pk || 2nd pk || r) - `64 bytes`  (schnorr signature w/ Poseidon hash function implemented by O(1) Labs where both `r` and `s` are scalars encoded as `32-bytes` values, least significant byte first. https://github.com/CodaProtocol/signer-reference/blob/master/schnorr.ml ) */ SignatureType;
      hex_bytes: string;
    }
    /**
     * SignatureType is the type of a cryptographic signature. * ecdsa: `r (32-bytes) || s (32-bytes)` - `64 bytes` * ecdsa_recovery: `r (32-bytes) || s (32-bytes) || v (1-byte)` - `65 bytes` * ed25519: `R (32-byte) || s (32-bytes)` - `64 bytes` * schnorr_1: `r (32-bytes) || s (32-bytes)` - `64 bytes`  (schnorr signature implemented by Zilliqa where both `r` and `s` are scalars encoded as `32-bytes` values, most significant byte first.) * schnorr_poseidon: `r (32-bytes) || s (32-bytes)` where s = Hash(1st pk || 2nd pk || r) - `64 bytes`  (schnorr signature w/ Poseidon hash function implemented by O(1) Labs where both `r` and `s` are scalars encoded as `32-bytes` values, least significant byte first. https://github.com/CodaProtocol/signer-reference/blob/master/schnorr.ml )
     */
    export type SignatureType = 'ecdsa' | 'ecdsa_recovery' | 'ed25519' | 'schnorr_1' | 'schnorr_poseidon';
    /**
     * SigningPayload is signed by the client with the keypair associated with an AccountIdentifier using the specified SignatureType. SignatureType can be optionally populated if there is a restriction on the signature scheme that can be used to sign the payload.
     */
    export interface SigningPayload {
      /**
       * [DEPRECATED by `account_identifier` in `v1.4.4`] The network-specific address of the account that should sign the payload.
       */
      address?: string;
      account_identifier?: /* The account_identifier uniquely identifies an account within a network. All fields in the account_identifier are utilized to determine this uniqueness (including the metadata field, if populated). */ AccountIdentifier;
      hex_bytes: string;
      signature_type?: /* SignatureType is the type of a cryptographic signature. * ecdsa: `r (32-bytes) || s (32-bytes)` - `64 bytes` * ecdsa_recovery: `r (32-bytes) || s (32-bytes) || v (1-byte)` - `65 bytes` * ed25519: `R (32-byte) || s (32-bytes)` - `64 bytes` * schnorr_1: `r (32-bytes) || s (32-bytes)` - `64 bytes`  (schnorr signature implemented by Zilliqa where both `r` and `s` are scalars encoded as `32-bytes` values, most significant byte first.) * schnorr_poseidon: `r (32-bytes) || s (32-bytes)` where s = Hash(1st pk || 2nd pk || r) - `64 bytes`  (schnorr signature w/ Poseidon hash function implemented by O(1) Labs where both `r` and `s` are scalars encoded as `32-bytes` values, least significant byte first. https://github.com/CodaProtocol/signer-reference/blob/master/schnorr.ml ) */ SignatureType;
    }
    /**
     * An account may have state specific to a contract address (ERC-20 token) and/or a stake (delegated balance). The sub_account_identifier should specify which state (if applicable) an account instantiation refers to.
     */
    export interface SubAccountIdentifier {
      /**
       * The SubAccount address may be a cryptographic value or some other identifier (ex: bonded) that uniquely specifies a SubAccount.
       * example:
       * 0x6b175474e89094c44da98b954eedeac495271d0f
       */
      address: string;
      /**
       * If the SubAccount address is not sufficient to uniquely specify a SubAccount, any other identifying information can be stored here. It is important to note that two SubAccounts with identical addresses but differing metadata will not be considered equal by clients.
       */
      metadata?: {};
    }
    /**
     * In blockchains with sharded state, the SubNetworkIdentifier is required to query some object on a specific shard. This identifier is optional for all non-sharded blockchains.
     */
    export interface SubNetworkIdentifier {
      /**
       * example:
       * shard 1
       */
      network: string;
      /**
       * example:
       * {
       *   "producer": "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5"
       * }
       */
      metadata?: {};
    }
    /**
     * SyncStatus is used to provide additional context about an implementation's sync status. This object is often used by implementations to indicate healthiness when block data cannot be queried until some sync phase completes or cannot be determined by comparing the timestamp of the most recent block with the current time.
     */
    export interface SyncStatus {
      /**
       * CurrentIndex is the index of the last synced block in the current stage. This is a separate field from current_block_identifier in NetworkStatusResponse because blocks with indices up to and including the current_index may not yet be queryable by the caller. To reiterate, all indices up to and including current_block_identifier in NetworkStatusResponse must be queryable via the /block endpoint (excluding indices less than oldest_block_identifier).
       * example:
       * 100
       */
      current_index?: number; // int64
      /**
       * TargetIndex is the index of the block that the implementation is attempting to sync to in the current stage.
       * example:
       * 150
       */
      target_index?: number; // int64
      /**
       * Stage is the phase of the sync process.
       * example:
       * header sync
       */
      stage?: string;
      /**
       * sycned is a boolean that indicates if an implementation has synced up to the most recent block. If this field is not populated, the caller should rely on a traditional tip timestamp comparison to determine if an implementation is synced. This field is particularly useful for quiescent blockchains (blocks only produced when there are pending transactions). In these blockchains, the most recent block could have a timestamp far behind the current time but the node could be healthy and at tip.
       */
      synced?: boolean;
    }
    /**
     * The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
     * example:
     * 1582833600000
     */
    export type Timestamp = number; // int64
    export interface TokenBundleItem {
      /**
       * Policy Id hex string
       */
      policyId: string;
      tokens: /* Amount is some Value of a Currency. It is considered invalid to specify a Value without a Currency. */ Amount[];
    }
    /**
     * Transactions contain an array of Operations that are attributable to the same TransactionIdentifier.
     */
    export interface Transaction {
      transaction_identifier: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier;
      operations: /* Operations contain all balance-changing information within a transaction. They are always one-sided (only affect 1 AccountIdentifier) and can succeed or fail independently from a Transaction. Operations are used both to represent on-chain data (Data API) and to construct new transactions (Construction API), creating a standard interface for reading and writing to blockchains. */ Operation[];
      related_transactions?: /* The related_transaction allows implementations to link together multiple transactions. An unpopulated network identifier indicates that the related transaction is on the same network. */ RelatedTransaction[];
      /**
       * Transactions that are related to other transactions (like a cross-shard transaction) should include the tranaction_identifier of these transactions in the metadata.
       * example:
       * {
       *   "size": 12378,
       *   "lockTime": 1582272577
       * }
       */
      metadata?: {};
    }
    /**
     * The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool.
     */
    export interface TransactionIdentifier {
      /**
       * Any transactions that are attributable only to a block (ex: a block event) should use the hash of the block as the identifier.
       * example:
       * 0x2f23fd8cca835af21f3ac375bac601f97ead75f2e79143bdf71fe2c4be043e8f
       */
      hash: string;
    }
    /**
     * TransactionIdentifierResponse contains the transaction_identifier of a transaction that was submitted to either `/construction/hash` or `/construction/submit`.
     */
    export interface TransactionIdentifierResponse {
      transaction_identifier: /* The transaction_identifier uniquely identifies a transaction in a particular network and block or in the mempool. */ TransactionIdentifier;
      metadata?: {};
    }
    /**
     * Unspent set for a given Account
     */
    export interface Utxo {
      value: string;
      index: number;
      transactionHash: string;
    }
    /**
     * The Version object is utilized to inform the client of the versions of different components of the Rosetta implementation.
     */
    export interface Version {
      /**
       * The rosetta_version is the version of the Rosetta interface the implementation adheres to. This can be useful for clients looking to reliably parse responses.
       * example:
       * 1.2.5
       */
      rosetta_version: string;
      /**
       * The node_version is the canonical version of the node runtime. This can help clients manage deployments.
       * example:
       * 1.0.2
       */
      node_version: string;
      /**
       * When a middleware server is used to adhere to the Rosetta interface, it should return its version here. This can help clients manage deployments.
       * example:
       * 0.2.7
       */
      middleware_version?: string;
      /**
       * Any other information that may be useful about versioning of dependent services should be returned here.
       */
      metadata?: {};
    }
  }
}
declare namespace Paths {
  namespace AccountBalance {
    export type RequestBody = /* An AccountBalanceRequest is utilized to make a balance request on the /account/balance endpoint. If the block_identifier is populated, a historical balance query should be performed. */ Components.Schemas.AccountBalanceRequest;
    namespace Responses {
      export type $200 = /* An AccountBalanceResponse is returned on the /account/balance endpoint. If an account has a balance for each AccountIdentifier describing it (ex: an ERC-20 token balance on a few smart contracts), an account balance request must be made with each AccountIdentifier. The `coins` field was removed and replaced by by `/account/coins` in `v1.4.7`. */ Components.Schemas.AccountBalanceResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace AccountCoins {
    export type RequestBody = /* AccountCoinsRequest is utilized to make a request on the /account/coins endpoint. */ Components.Schemas.AccountCoinsRequest;
    namespace Responses {
      export type $200 = /* AccountCoinsResponse is returned on the /account/coins endpoint and includes all unspent Coins owned by an AccountIdentifier. */ Components.Schemas.AccountCoinsResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace Block {
    export type RequestBody = /* A BlockRequest is utilized to make a block request on the /block endpoint. */ Components.Schemas.BlockRequest;
    namespace Responses {
      export type $200 = /* A BlockResponse includes a fully-populated block or a partially-populated block with a list of other transactions to fetch (other_transactions). As a result of the consensus algorithm of some blockchains, blocks can be omitted (i.e. certain block indices can be skipped). If a query for one of these omitted indices is made, the response should not include a `Block` object. It is VERY important to note that blocks MUST still form a canonical, connected chain of blocks where each block has a unique index. In other words, the `PartialBlockIdentifier` of a block after an omitted block should reference the last non-omitted block. */ Components.Schemas.BlockResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace BlockTransaction {
    export type RequestBody = /* A BlockTransactionRequest is used to fetch a Transaction included in a block that is not returned in a BlockResponse. */ Components.Schemas.BlockTransactionRequest;
    namespace Responses {
      export type $200 = /* A BlockTransactionResponse contains information about a block transaction. */ Components.Schemas.BlockTransactionResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace Call {
    export type RequestBody = /* CallRequest is the input to the `/call` endpoint. */ Components.Schemas.CallRequest;
    namespace Responses {
      export type $200 = /* CallResponse contains the result of a `/call` invocation. */ Components.Schemas.CallResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionCombine {
    export type RequestBody = /* ConstructionCombineRequest is the input to the `/construction/combine` endpoint. It contains the unsigned transaction blob returned by `/construction/payloads` and all required signatures to create a network transaction. */ Components.Schemas.ConstructionCombineRequest;
    namespace Responses {
      export type $200 = /* ConstructionCombineResponse is returned by `/construction/combine`. The network payload will be sent directly to the `construction/submit` endpoint. */ Components.Schemas.ConstructionCombineResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionDerive {
    export type RequestBody = /* ConstructionDeriveRequest is passed to the `/construction/derive` endpoint. Network is provided in the request because some blockchains have different address formats for different networks. Metadata is provided in the request because some blockchains allow for multiple address types (i.e. different address for validators vs normal accounts). */ Components.Schemas.ConstructionDeriveRequest;
    namespace Responses {
      export type $200 = /* ConstructionDeriveResponse is returned by the `/construction/derive` endpoint. */ Components.Schemas.ConstructionDeriveResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionHash {
    export type RequestBody = /* ConstructionHashRequest is the input to the `/construction/hash` endpoint. */ Components.Schemas.ConstructionHashRequest;
    namespace Responses {
      export type $200 = /* TransactionIdentifierResponse contains the transaction_identifier of a transaction that was submitted to either `/construction/hash` or `/construction/submit`. */ Components.Schemas.TransactionIdentifierResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionMetadata {
    export type RequestBody = /* A ConstructionMetadataRequest is utilized to get information required to construct a transaction. The Options object used to specify which metadata to return is left purposely unstructured to allow flexibility for implementers. Options is not required in the case that there is network-wide metadata of interest. Optionally, the request can also include an array of PublicKeys associated with the AccountIdentifiers returned in ConstructionPreprocessResponse. */ Components.Schemas.ConstructionMetadataRequest;
    namespace Responses {
      export type $200 = /* The ConstructionMetadataResponse returns network-specific metadata used for transaction construction. Optionally, the implementer can return the suggested fee associated with the transaction being constructed. The caller may use this info to adjust the intent of the transaction or to create a transaction with a different account that can pay the suggested fee. Suggested fee is an array in case fee payment must occur in multiple currencies. */ Components.Schemas.ConstructionMetadataResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionParse {
    export type RequestBody = /* ConstructionParseRequest is the input to the `/construction/parse` endpoint. It allows the caller to parse either an unsigned or signed transaction. */ Components.Schemas.ConstructionParseRequest;
    namespace Responses {
      export type $200 = /* ConstructionParseResponse contains an array of operations that occur in a transaction blob. This should match the array of operations provided to `/construction/preprocess` and `/construction/payloads`. */ Components.Schemas.ConstructionParseResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionPayloads {
    export type RequestBody = /* ConstructionPayloadsRequest is the request to `/construction/payloads`. It contains the network, a slice of operations, and arbitrary metadata that was returned by the call to `/construction/metadata`. Optionally, the request can also include an array of PublicKeys associated with the AccountIdentifiers returned in ConstructionPreprocessResponse. */ Components.Schemas.ConstructionPayloadsRequest;
    namespace Responses {
      export type $200 = /* ConstructionTransactionResponse is returned by `/construction/payloads`. It contains an unsigned transaction blob (that is usually needed to construct the a network transaction from a collection of signatures) and an array of payloads that must be signed by the caller. */ Components.Schemas.ConstructionPayloadsResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionPreprocess {
    export type RequestBody = /* ConstructionPreprocessRequest is passed to the `/construction/preprocess` endpoint so that a Rosetta implementation can determine which metadata it needs to request for construction. Metadata provided in this object should NEVER be a product of live data (i.e. the caller must follow some network-specific data fetching strategy outside of the Construction API to populate required Metadata). If live data is required for construction, it MUST be fetched in the call to `/construction/metadata`. The caller can provide a max fee they are willing to pay for a transaction. This is an array in the case fees must be paid in multiple currencies. The caller can also provide a suggested fee multiplier to indicate that the suggested fee should be scaled. This may be used to set higher fees for urgent transactions or to pay lower fees when there is less urgency. It is assumed that providing a very low multiplier (like 0.0001) will never lead to a transaction being created with a fee less than the minimum network fee (if applicable). In the case that the caller provides both a max fee and a suggested fee multiplier, the max fee will set an upper bound on the suggested fee (regardless of the multiplier provided). */ Components.Schemas.ConstructionPreprocessRequest;
    namespace Responses {
      export type $200 = /* ConstructionPreprocessResponse contains `options` that will be sent unmodified to `/construction/metadata`. If it is not necessary to make a request to `/construction/metadata`, `options` should be omitted.  Some blockchains require the PublicKey of particular AccountIdentifiers to construct a valid transaction. To fetch these PublicKeys, populate `required_public_keys` with the AccountIdentifiers associated with the desired PublicKeys. If it is not necessary to retrieve any PublicKeys for construction, `required_public_keys` should be omitted. */ Components.Schemas.ConstructionPreprocessResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace ConstructionSubmit {
    export type RequestBody = /* The transaction submission request includes a signed transaction. */ Components.Schemas.ConstructionSubmitRequest;
    namespace Responses {
      export type $200 = /* TransactionIdentifierResponse contains the transaction_identifier of a transaction that was submitted to either `/construction/hash` or `/construction/submit`. */ Components.Schemas.TransactionIdentifierResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace EventsBlocks {
    export type RequestBody = /* EventsBlocksRequest is utilized to fetch a sequence of BlockEvents indicating which blocks were added and removed from storage to reach the current state. */ Components.Schemas.EventsBlocksRequest;
    namespace Responses {
      export type $200 = /* EventsBlocksResponse contains an ordered collection of BlockEvents and the max retrievable sequence. */ Components.Schemas.EventsBlocksResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace Mempool {
    export type RequestBody = /* A NetworkRequest is utilized to retrieve some data specific exclusively to a NetworkIdentifier. */ Components.Schemas.NetworkRequest;
    namespace Responses {
      export type $200 = /* A MempoolResponse contains all transaction identifiers in the mempool for a particular network_identifier. */ Components.Schemas.MempoolResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace MempoolTransaction {
    export type RequestBody = /* A MempoolTransactionRequest is utilized to retrieve a transaction from the mempool. */ Components.Schemas.MempoolTransactionRequest;
    namespace Responses {
      export type $200 = /* A MempoolTransactionResponse contains an estimate of a mempool transaction. It may not be possible to know the full impact of a transaction in the mempool (ex: fee paid). */ Components.Schemas.MempoolTransactionResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace NetworkList {
    export type RequestBody = /* A MetadataRequest is utilized in any request where the only argument is optional metadata. */ Components.Schemas.MetadataRequest;
    namespace Responses {
      export type $200 = /* A NetworkListResponse contains all NetworkIdentifiers that the node can serve information for. */ Components.Schemas.NetworkListResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace NetworkOptions {
    export type RequestBody = /* A NetworkRequest is utilized to retrieve some data specific exclusively to a NetworkIdentifier. */ Components.Schemas.NetworkRequest;
    namespace Responses {
      export type $200 = /* NetworkOptionsResponse contains information about the versioning of the node and the allowed operation statuses, operation types, and errors. */ Components.Schemas.NetworkOptionsResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace NetworkStatus {
    export type RequestBody = /* A NetworkRequest is utilized to retrieve some data specific exclusively to a NetworkIdentifier. */ Components.Schemas.NetworkRequest;
    namespace Responses {
      export type $200 = /* NetworkStatusResponse contains basic information about the node's view of a blockchain network. It is assumed that any BlockIdentifier.Index less than or equal to CurrentBlockIdentifier.Index can be queried. If a Rosetta implementation prunes historical state, it should populate the optional `oldest_block_identifier` field with the oldest block available to query. If this is not populated, it is assumed that the `genesis_block_identifier` is the oldest queryable block. If a Rosetta implementation performs some pre-sync before it is possible to query blocks, sync_status should be populated so that clients can still monitor healthiness. Without this field, it may appear that the implementation is stuck syncing and needs to be terminated. */ Components.Schemas.NetworkStatusResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
  namespace SearchTransactions {
    export type RequestBody = /* SearchTransactionsRequest is used to search for transactions matching a set of provided conditions in canonical blocks. */ Components.Schemas.SearchTransactionsRequest;
    namespace Responses {
      export type $200 = /* SearchTransactionsResponse contains an ordered collection of BlockTransactions that match the query in SearchTransactionsRequest. These BlockTransactions are sorted from most recent block to oldest block. */ Components.Schemas.SearchTransactionsResponse;
      export type $500 = /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
  }
}
