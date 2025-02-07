import { expect } from "chai";
import { ethers } from "hardhat";

describe("Optimization", function () {
    let Optimization: any, optimization: any, owner: any, addr1: any;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        Optimization = await ethers.getContractFactory("Optimization");
        optimization = await Optimization.deploy();
        await optimization.waitForDeployment();
    });

    it("Сравнение газа между noOptExpressionWithStorage и optExpressionWithStorage", async function () {
        const tx1 = await optimization.noOptExpressionWithStorage();
        const receipt1 = await tx1.wait();
        const gasUsed1 = receipt1.gasUsed;

        const tx2 = await optimization.optExpressionWithStorage();
        const receipt2 = await tx2.wait();
        const gasUsed2 = receipt2.gasUsed;

        console.log(`Используемый газ для noOptExpressionWithStorage: ${gasUsed1}`);
        console.log(`Используемый газ optExpressionWithStorage: ${gasUsed2}`);

        expect(gasUsed2).to.be.lessThan(gasUsed1);
    });

    it("Сравнение газа для writePacked и writeStructured", async function () {
      const a = 10;
      const b = 20;
      const c = 30;
      const d = 40;

      const tx1 = await optimization.writePacked(a, b, c, d);
      const receipt1 = await tx1.wait();
      const gasUsed1 = receipt1.gasUsed;

      const tx2 = await optimization.writeStructured(a, b, c, d);
      const receipt2 = await tx2.wait();
      const gasUsed2 = receipt2.gasUsed;

      console.log(`Используемый газ для writePacked: ${gasUsed1}`);
      console.log(`Используемый газ для writeStructured: ${gasUsed2}`);

      // Ожидаем, что writePacked будет дешевле
      expect(gasUsed1).to.be.lessThan(gasUsed2);
  });

  it("Сравнение газа для processDataNoOptimization и processDataWithOptimization", async function () {
    const arr = [1, 2, 3, 4, 5];

    const tx1 = await optimization.processDataNoOptimization(arr);
    const receipt1 = await tx1.wait();
    const gasUsed1 = receipt1.gasUsed;

    const tx2 = await optimization.processDataWithOptimization(arr);
    const receipt2 = await tx2.wait();
    const gasUsed2 = receipt2.gasUsed;

    console.log(`Используемый газ для processDataNoOptimization: ${gasUsed1}`);
    console.log(`Используемый газ для processDataWithOptimization: ${gasUsed2}`);

    expect(gasUsed2).to.be.lessThan(gasUsed1);
  });

  it("Сравнение газа для sumArrayNoOptimization и sumArrayWithOptimization", async function () {
    const arr = [1, 2, 3, 4, 5];

    const tx1 = await optimization.sumArrayNoOptimization(arr);
    const receipt1 = await tx1.wait();
    const gasUsed1 = receipt1.gasUsed;

    const tx2 = await optimization.sumArrayWithOptimization(arr);
    const receipt2 = await tx2.wait();
    const gasUsed2 = receipt2.gasUsed;

    console.log(`Используемый газ для sumArrayNoOptimization: ${gasUsed1}`);
    console.log(`Используемый газ для sumArrayWithOptimization: ${gasUsed2}`);

    expect(gasUsed2).to.be.lessThan(gasUsed1);
  });

  it("Сравнение газа для transferNoOptimization и transferWithOptimization", async function () {
    const tx1 = await optimization.transferNoOptimization(ethers.Wallet.createRandom().address, ethers.parseEther("1"));
    const receipt1 = await tx1.wait();
    const gasUsed1 = receipt1.gasUsed;

    const tx2 = await optimization.transferWithOptimization(ethers.Wallet.createRandom().address, ethers.parseEther("1"));
    const receipt2 = await tx2.wait();
    const gasUsed2 = receipt2.gasUsed;

    console.log(`Используемый газ для transferNoOptimization: ${gasUsed1}`);
    console.log(`Используемый газ для transferWithOptimization: ${gasUsed2}`);

    expect(gasUsed2).to.be.lessThan(gasUsed1);
  });

});