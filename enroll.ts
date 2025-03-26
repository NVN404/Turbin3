import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";

// Load the keypair from your Turbin3-wallet.json file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a connection to Solana devnet
const connection = new Connection("https://api.devnet.solana.com");

// Replace "<your github account>" with your actual GitHub username
const github = Buffer.from("NVN404", "utf8");

// Create an Anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment: "confirmed",
});

// Instantiate the Turbin3 program using the IDL
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

// Derive the PDA for the enrollment account
const enrollment_seeds = [Buffer.from("preQ225"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
    enrollment_seeds,
    program.programId
);

// Execute the enrollment transaction
(async () => {
    try {
        const txhash = await program.methods
            .submit(github)
            .accounts({
                signer: keypair.publicKey,
            })
            .signers([keypair])
            .rpc();
        console.log(
            `Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
        );
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();