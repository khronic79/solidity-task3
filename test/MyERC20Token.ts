import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyERC20Token", function () {
    let MyERC20Token: any, myERC20Token: any, owner: any, addr1: any, addr2: any;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        MyERC20Token = await ethers.getContractFactory("MyERC20Token");
        myERC20Token = await MyERC20Token.deploy();
        await myERC20Token.waitForDeployment();
    });

    it("Общий объем токенов при деплое должен быть равен балансу владельца", async function () {
      const ownerBalance = await myERC20Token.balanceOf(owner.address);
      const totalSupply = await myERC20Token.totalSupply();
      expect(ownerBalance).to.equal(totalSupply);
    });
    
    it("Названия и мнемоника токена должны соответствоать значениям", async function () {
        expect(await myERC20Token.name()).to.equal("Task 2 Examle Of ERC20 Token");
        expect(await myERC20Token.symbol()).to.equal("T2EOET");
    });
  
    it("Токены могут быть переданы между аккаунтами", async function () {
        const initialOwnerBalance = await myERC20Token.balanceOf(owner.address);

        await myERC20Token.transfer(addr1.address, ethers.toBigInt(100));
        const addr1Balance = await myERC20Token.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(ethers.toBigInt(100));

        const finalOwnerBalance = await myERC20Token.balanceOf(owner.address);
        expect(finalOwnerBalance).to.equal(initialOwnerBalance - ethers.toBigInt(100));

        await myERC20Token.connect(addr1).transfer(addr2.address, ethers.toBigInt(50));
        const addr2Balance = await myERC20Token.balanceOf(addr2.address);
        expect(addr2Balance).to.equal(ethers.toBigInt(50));
    });
    
    it("Должна вернуться ошибка InvalidReceiver при передаче токенов на нулевой адрес", async function () {
        await expect(myERC20Token.transfer(ethers.ZeroAddress, 100)).to.be.revertedWithCustomError(myERC20Token, "InvalidReceiver");
    });

    it("Должна вернуться ошибка InsufficientBalance при отправке большего кол-ва токенов, чем есть на балансе", async function () {
      const initialOwnerBalance = await myERC20Token.balanceOf(owner.address);
      await expect(myERC20Token.transfer(addr1.address, initialOwnerBalance + ethers.toBigInt(100))).to.be.revertedWithCustomError(myERC20Token, "InsufficientBalance");
    });

    it("Должна быть возможность выдать разрешение и перевести токены по этому разрешению", async function () {
      await myERC20Token.approve(addr1.address, ethers.toBigInt(100));

      await myERC20Token.connect(addr1).transferFrom(owner.address, addr2.address, ethers.toBigInt(50));

      const addr2Balance = await myERC20Token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.toBigInt(50));
      const ownerBalance = await myERC20Token.balanceOf(owner.address);
      const totalSupply = await myERC20Token.totalSupply();
      expect(ownerBalance).to.equal(totalSupply - ethers.toBigInt(50));

      const remainingAllowance = await myERC20Token.allowance(owner.address, addr1.address);
      expect(remainingAllowance).to.equal(ethers.toBigInt(50));
    });
    
    it("Должна вернуться ошибка InvalidSpender при попытке выдать разрешение на нулевой адрес", async function() {
      await expect(myERC20Token.approve(ethers.ZeroAddress, 100)).to.be.revertedWithCustomError(myERC20Token, "InvalidSpender");
    });
    
    it("Должна вернуться ошибка InsufficientAllowance при попытка перевести больше токенов чем выдано разрешение", async function () {
      await myERC20Token.approve(addr1.address, 50);
        await expect(myERC20Token.connect(addr1).transferFrom(owner.address, addr2.address, 100)).to.be.revertedWithCustomError(myERC20Token, "InsufficientAllowance");
    });
});