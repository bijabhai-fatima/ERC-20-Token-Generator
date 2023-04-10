const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
   let MyToken;
   let myToken;
   let addr1;
   let addr2;
   let owner;

   beforeEach(async function(){
      MyToken = await ethers.getContractFactory("MyToken");
      myToken = await MyToken.deploy();
      [owner, addr1, addr2] = await ethers.getSigners();
   })

   describe("Deployment", async function(){
      it("Should set the correct name, symbol and decimals", async function(){
        expect(await myToken.name()).to.equal("hope coin");
        expect(await myToken.symbol()).to.equal("HC");
        expect(await myToken.decimals()).to.equal(18);
      })
      it("Should set the correct value of totalSupply", async function(){
        expect(BigInt(await myToken.totalSupply())).to.equal(BigInt(1000 * (10 ** 18)));
      })
      it("Should assign the total supply to contract creator", async function(){
        expect(BigInt(await myToken.balanceOf(owner.address))).to.equal(BigInt(1000 * (10 ** 18)));
      })
      it("Should emit Trasfer event when token when the total supply assigned contract creator", async function(){
        const totalSupply = await myToken.totalSupply();
        const contractAddress = myToken.address;

        const receipt = await ethers.provider.getTransactionReceipt(myToken.deployTransaction.hash);
        const transferEvent = myToken.interface.parseLog(receipt.logs[0]);

        expect(transferEvent.name).to.equal("Transfer");
        expect(transferEvent.args._from).to.equal(contractAddress);
        expect(transferEvent.args._to).to.equal(owner.address);
        expect(transferEvent.args._value.toString()).to.equal(totalSupply);
      })
   })

   describe("transfer",async function(){
      it("Should transfer token corretly",async function(){ 
          await myToken.transfer(addr1.address, 100);
          expect(await myToken.balanceOf(addr1.address)).to.equal(100);

          await myToken.connect(addr1).transfer(addr2.address, 50);
          expect(await myToken.balanceOf(addr2.address)).to.equal(50);
          expect(await myToken.balanceOf(addr1.address)).to.equal(50);
      })
      it("Should emit Trasfer event when token transfed corretly", async function(){
        await expect(myToken.transfer(addr1.address, 50))
          .to.emit(myToken, "Transfer")
          .withArgs(owner.address, addr1.address, 50);
      })
      it("Should fail if sender does not have enugh tokens", async function(){
          const initialBalance = await myToken.balanceOf(addr2.address);
          await expect(
              myToken.connect(addr2).transfer(addr1.address, initialBalance + 1))
                .to.be.revertedWith("don't have enugh coins");
          expect(await myToken.balanceOf(addr2.address)).to.equal(initialBalance);
 

          const initialOwnerBalance = await myToken.balanceOf(owner.address);
          await expect(
            myToken.transfer(addr1.address, initialOwnerBalance.add(1))
           ).to.be.revertedWith("don't have enugh coins");
          expect(await myToken.balanceOf(owner.address)).to.equal(
            initialOwnerBalance
          );
      })
   })

   describe("approve",async function(){
      it("Should approve tokens correctly", async function(){
        await myToken.approve(addr1.address, 100);
        expect(await myToken.allowance(owner.address, addr1.address)).to.equal(100);
      })
      it("Should emit Approval event when token is approved correctly", async function(){
        expect(await myToken.approve(addr1.address, 100))
          .to.emit(myToken,"Approval")
          .withArgs(owner.address, addr1.address, 100);
      })
      it("Should allow spender to transfer tokens correctly", async function(){
        await myToken.approve(addr1.address, 100);
        expect(await myToken.allowance(owner.address, addr1.address)).to.equal(100);

        const intialOwnerBalance = BigInt(await myToken.balanceOf(owner.address));
        const initialBalance = await myToken.balanceOf(addr2.address);
        const initialAllowance = await myToken.allowance(owner.address, addr1.address);

        await myToken.connect(addr1).transferFrom(owner.address, addr2.address, 50);
        expect(BigInt(await myToken.balanceOf(owner.address))).to.equal(intialOwnerBalance - BigInt(50));
        expect(await myToken.balanceOf(addr2.address)).to.equal(initialBalance + 50);
        expect(await myToken.allowance(owner.address, addr1.address)).to.equal(initialAllowance - 50);
      })
      it("Should emit Trasfer event when token transfed corretly", async function(){
        await myToken.approve(addr1.address, 100);
        await expect(
          myToken.connect(addr1).transferFrom(owner.address, addr2.address, 50))
          .to.emit(myToken, "Transfer")
          .withArgs(owner.address, addr2.address, 50);
      })
      it("Should fail if spender does not have enugh allowance", async function(){
        await myToken.approve(addr1.address, 100);
        
        await expect(
          myToken.connect(addr1).transferFrom(owner.address, addr2.address, 150))
          .to.be.revertedWith("Not approved to transfer");
 
       })
      it("Should fail if owner does not have enugh tokens", async function(){
        const initialOwnerBalance = await myToken.balanceOf(owner.address);
        await myToken.approve(addr1.address, initialOwnerBalance);
         
        await expect(
           myToken.connect(addr1).transferFrom(owner.address, addr2.address, initialOwnerBalance.add(1))
           ).to.be.revertedWith("Not approved to transfer");
 
      })

   })
});
