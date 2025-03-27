mod programs;

use solana_client::rpc_client::RpcClient;
use solana_program::{pubkey::Pubkey, system_program};
use solana_sdk::{signature::{Keypair, Signer, read_keypair_file}, transaction::Transaction};
use crate::programs::Turbin3_prereq::{TurbinePrereqProgram, CompleteArgs}; // Updated here

const RPC_URL: &str = "https://api.devnet.solana.com";

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fetch_pda_data() {
        let rpc_client = RpcClient::new(RPC_URL);
        let signer = read_keypair_file("Turbin3-wallet.json").expect("Couldn't find wallet file");
        let prereq = TurbinePrereqProgram::derive_program_address(&[b"prereq", signer.pubkey().to_bytes().as_ref()]);
        
        // Fetch account data
        let account = rpc_client.get_account(&prereq).expect("Failed to fetch account");
        let account_data = account.data;

        // Skip the 8-byte discriminator and deserialize
        let data: SolanaCohort5Account = try_from_slice_unchecked(&account_data[8..]).expect("Failed to deserialize");
        
        // Convert github bytes to string
        let github_str = String::from_utf8(data.github).expect("Invalid UTF-8 in github field");
        
        println!("PDA: {}", prereq);
        println!("GitHub Username: {}", github_str);
        println!("Key: {}", data.key);
    }
}