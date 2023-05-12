// import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('Rogue', async () => {
  let owner: SignerWithAddress;
  let tester: SignerWithAddress;
  let tokenReceipt: SignerWithAddress;
  let rogue: Contract;
  let lootByRogue: Contract;
  let erc20: Contract;

  beforeEach(async () => {
    [owner, tester, tokenReceipt] = await ethers.getSigners();
    console.log(owner.address);
    console.log(tester.address);

    const f1 = await ethers.getContractFactory('LootByRogue', owner);
    lootByRogue = await f1.deploy();
    await lootByRogue.deployed();

    const f2 = await ethers.getContractFactory('MockERC20', owner);
    erc20 = await f2.deploy();
    await erc20.deployed();

    const f3 = await ethers.getContractFactory('Rogue', owner);
    rogue = await f3.deploy(
      lootByRogue.address,
      erc20.address,
      ethers.utils.parseEther('1'),
      tokenReceipt.address
    );
    await rogue.deployed();

    const role = await lootByRogue.MINTER_ROLE();
    await lootByRogue.grantRole(role, rogue.address);

    await erc20.transfer(tester.address, ethers.utils.parseEther('1'));
    await erc20
      .connect(tester)
      .approve(rogue.address, ethers.utils.parseEther('1'));
  });

  it('mint', async () => {
    await rogue
      .connect(tester)
      .mint(
        '0x231ca888d47177f9c68d54613eadb499d4e793f1d7100776531dc70a67790e98',
        [
          0, 2, 0, 0, 2, 1, 1, 1, 1, 2, 2, 0, 2, 0, 2, 0, 2, 2, 2, 1, 1, 1, 1,
          3, 1, 1,
        ],
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
          0, 0, 0,
        ]
      );

    console.log(await lootByRogue.tokenURI(1));
  });

  // it('mint2', async () => {
  //   const f = (_x: number, _y: number) => {
  //     const move = [];
  //     const item = [];
  //     for (let y = 0; y < _y; y++) {
  //       for (let x = 0; x < _x; x++) {
  //         if (x === 0 && y === 0) continue;
  //         item.push(0);

  //         if (x === 0 || x === 64) {
  //           if (move[-1] === 0 || move[-1] === 0) {
  //             continue;
  //           } else {
  //             move.push(0);
  //             continue;
  //           }
  //         }
  //         if (y % 2 === 0) {
  //           move.push(3);
  //           continue;
  //         } else {
  //           move.push(2);
  //           continue;
  //         }
  //       }
  //     }
  //     return [move, item];
  //   };
  //   const [move, item] = f(64, 32);
  //   await rogue.connect(tester).mint(0, move, item);
  // });
});
