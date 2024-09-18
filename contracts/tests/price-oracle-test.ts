import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that price oracle can be updated by authorized updater",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('price-oracle', 'add-authorized-updater', [types.principal(wallet1.address)], deployer.address),
            Tx.contractCall('price-oracle', 'update-price', [types.uint(1000000)], wallet1.address),
        ]);

        assertEquals(block.receipts.length, 2);
        assertEquals(block.height, 2);

        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);

        const price = chain.callReadOnlyFn('price-oracle', 'get-price', [], deployer.address);
        assertEquals(price.result, '(ok u1000000)');

        console.log('Updated price:', price.result);
    },
});