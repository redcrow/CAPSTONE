var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const owner = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];

    console.log("TestERC721Mintable:");
    console.log("Account owner: accounts[0] ", accounts[0]);
    console.log("Account one: accounts[1] ", accounts[1]);
    console.log("Account two: accounts[2] ", accounts[2]);

    describe('match erc721 spec', function () {
      beforeEach(async function () { 
        this.contract = await ERC721MintableComplete.new({from: owner});

        // TODO: mint multiple tokens
        await this.contract.mint(account_one, 1, { from: owner });
        await this.contract.mint(account_one, 2, { from: owner });
        await this.contract.mint(account_two, 3, { from: owner });
        await this.contract.mint(account_two, 4, { from: owner });
        await this.contract.mint(account_two, 5, { from: owner });
      });

      it('should return total supply', async function () { 
        let totalSupply = await this.contract.totalSupply.call();
        assert.equal(totalSupply, 5, "Does not match actual supply");
      });

      it('should get token balance', async function () { 
        let balanceOf2 = await this.contract.balanceOf.call(account_one);
        let balanceOf3 = await this.contract.balanceOf.call(account_two);
        assert.equal(balanceOf2, 2, "Does not match balance of acct #2");
        assert.equal(balanceOf3, 3, "Does not match balance of acct #3");
      });

      // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
      it('should return token uri', async function () { 
        let tokenURI = await this.contract.tokenURI.call(1);
        assert.equal(
          tokenURI,
          "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
          "Does not match expected tokenURI");
      });

      it('should transfer token from one owner to another', async function () { 
        await this.contract.safeTransferFrom(
          account_one, account_two, 1, {from: account_one});
        let token1Owner = await this.contract.ownerOf(1);
        assert.equal(token1Owner, account_two, "Token not transferred");
      });
    });

    describe('have ownership properties', function () {
      beforeEach(async function () { 
        this.contract = await ERC721MintableComplete.new({from: owner});
      });

      it('should fail when minting address is not contract owner', async function () { 
        let accessDenied = false;
        try {
          await this.contract.mint(account_two, 6, {from: account_one});
        } catch (error) {
          accessDenied = true;
        }
        assert.equal(true, accessDenied, "Mint action not authorized for this account.");
        let balanceTwo = await this.contract.balanceOf.call(account_two);
        assert.equal(0, balanceTwo, "Account_two should have zero token on its own.");
        });

      it('should return contract owner', async function () { 
        let ownerOfContract = await this.contract.getOwner.call();
        assert.equal(ownerOfContract, owner, "Contract owner not returned");
      });
  });
});