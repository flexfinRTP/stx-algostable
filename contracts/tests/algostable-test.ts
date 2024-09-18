import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that algo stable token can be minted and transferred",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('libre', 'mint', [types.principal(wallet1.address), types.uint(1000000)], deployer.address),
            Tx.contractCall('libre', 'transfer', [types.uint(500000), types.principal(deployer.address), types.principal(wallet1.address)], wallet1.address),
        ]);

        assertEquals(block.receipts.length, 2);
        assertEquals(block.height, 2);

        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);

        const deployerBalance = chain.callReadOnlyFn('libre', 'get-balance', [types.principal(deployer.address)], deployer.address);
        const wallet1Balance = chain.callReadOnlyFn('libre', 'get-balance', [types.principal(wallet1.address)], deployer.address);

        assertEquals(deployerBalance.result, '(ok u500000)');
        assertEquals(wallet1Balance.result, '(ok u1500000)');

        console.log('Deployer balance:', deployerBalance.result);
        console.log('Wallet 1 balance:', wallet1Balance.result);
    },
});