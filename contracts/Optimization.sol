// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

contract Optimization {
    uint[] data = [10, 20, 30, 40, 0, 0, 0];

    uint256 public packedData;

     uint256 public sum;

    struct DataStruct {
        uint8 a;
        uint8 b;
        uint8 c;
        uint8 d;
    }

    DataStruct public structuredData;

    uint256 public dataResult;

    mapping(address => uint256) public balances;

    constructor() {
        address sender = msg.sender;
        balances[sender] = 10 ether;
    }


    function noOptExpressionWithStorage () public {
      uint one = data[0] + data[1];
      uint two = data[0] + data[1] + data[2];
      uint three = data[0] + data[1] + data[2] + data[3];
      data[4] = one;
      data[5] = two;
      data[6] = three;
    }

    function optExpressionWithStorage () public {
      uint first = data[0];
      uint second = data[1];
      uint third = data[2];
      uint one = first + second;
      uint two = first + second +third;
      uint three = first + second +third + data[3];
      data[4] = one;
      data[5] = two;
      data[6] = three;
    }

    function writePacked(uint64 _a, uint64 _b, uint64 _c, uint64 _d) public {
        packedData = uint256(_a) | (uint256(_b) << 64) | (uint256(_c) << 128) | (uint256(_d) << 192);
    }

    function writeStructured(uint8 _a, uint8 _b, uint8 _c, uint8 _d) public {
        structuredData.a = _a;
        structuredData.b = _b;
        structuredData.c = _c;
        structuredData.d = _d;
    }

    function processDataNoOptimization(uint256[] memory _data) public {
        uint256 result = 0;
        for (uint256 i = 0; i < _data.length; i++) {
            result += _data[i];
        }

        dataResult = result;
    }

    function processDataWithOptimization(uint256[] calldata _data) public {
        uint256 result = 0;
        for (uint256 i = 0; i < _data.length; i++) {
            result += _data[i];
        }
        dataResult = result;
    }

    function sumArrayNoOptimization(uint256[] memory _arr) public {
        for (uint256 i = 0; i < _arr.length; i++) {
            sum += _arr[i]; // Чтение и запись в хранилище в каждой итерации
        }
    }

    function sumArrayWithOptimization(uint256[] memory _arr) public {
        uint256 localSum = 0;
        uint256 arrLength = _arr.length; //Кеширование длины массива
        for (uint256 i = 0; i < arrLength; i++) {
            localSum += _arr[i]; // Чтение в память
        }
        sum = localSum; // Запись в хранилище только один раз
    }

    function transferNoOptimization(address _to, uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount; // Чтение и запись balances[msg.sender]
        balances[_to] += _amount;       // Чтение и запись balances[_to]
    }

    function transferWithOptimization(address _to, uint256 _amount) public {
        uint256 senderBalance = balances[msg.sender]; // Чтение один раз
        require(senderBalance >= _amount, "Insufficient balance");
        balances[msg.sender] = senderBalance - _amount; // запись
        balances[_to] += _amount; // Чтение и запись balances[_to]
    }
}