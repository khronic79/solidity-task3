// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

contract Optimization {
    uint[] data = [10, 20, 30, 40, 0, 0, 0];

    uint256 public sum;

    struct DataStruct {
        uint64 a;
        uint64 b;
        uint64 c;
        uint64 d;
    }

    uint256 public dataResult;

    mapping(address => uint256) public balances;

    mapping(address => uint256) public uintSafe;

    mapping(address => DataStruct) public dataStructSafe;

    constructor() {
        address sender = msg.sender;
        balances[sender] = 10 ether;
    }

    // Функция, в которой происходит обращение к storage
    // в каждом вычислении, что требует максимального кол-ва газа
    function noOptExpressionWithStorage () public {
      uint one = data[0] + data[1];
      uint two = data[0] + data[1] + data[2];
      uint three = data[0] + data[1] + data[2] + data[3];
      data[4] = one;
      data[5] = two;
      data[6] = three;
    }
    // Оптимизированная фукнция noOptExpressionWithStorage,
    // в которой данные один раз вычитываются из storage,
    // записываются в memory и далее производятся вычисления,
    // что ведет к экономии газа
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

    // В данной функции производится упаковка нескольких значений,
    // которые не превышают 64 бита в одну переменную величиной 256 бит,
    // после этого производится запись в storage
    // Данный вариант дает незначительную экономию газа в сравнении с writeStructured
    function writePacked(uint64 _a, uint64 _b, uint64 _c, uint64 _d) public {
        address sender = msg.sender;
        uint256 packedData = uint256(_a) | (uint256(_b) << 64) | (uint256(_c) << 128) | (uint256(_d) << 192);
        uintSafe[sender] = packedData;
    }
    
    // В противовес writePacked все данные распределены в структуре.
    function writeStructured(uint64 _a, uint64 _b, uint64 _c, uint64 _d) public {
        DataStruct memory structuredData;
        address sender = msg.sender;
        structuredData.a = _a;
        structuredData.b = _b;
        structuredData.c = _c;
        structuredData.d = _d;
        dataStructSafe[sender] = structuredData;
    }

    // Неоптимизированная функция, в которой
    // действия производятся на аргументами,
    // объявлеными в memory
    function processDataNoOptimization(uint256[] memory _data) public {
        uint256 result = 0;
        for (uint256 i = 0; i < _data.length; i++) {
            result += _data[i];
        }
        dataResult = result;
    }

    // Оптимизированная функция, в которой
    // действия производятся на аргументами,
    // объявлеными в calldata
    function processDataWithOptimization(uint256[] calldata _data) public {
        uint256 result = 0;
        for (uint256 i = 0; i < _data.length; i++) {
            result += _data[i];
        }
        dataResult = result;
    }

    // В данной функции чтение длинны массива
    // производится в каждой иттерации цикла,
    // что является неоптимальным решение и тратит лишний газ
    function sumArrayNoOptimization(uint256[] memory _arr) public {
        for (uint256 i = 0; i < _arr.length; i++) {
            sum += _arr[i];
        }
    }
    // Чтобы оптимизировать sumArrayNoOptimization
    // необходимо закэшировать длинну массива в переменную
    // и в цикле образаться только к ней, а не каждый
    // вычитывать длинную массива
    function sumArrayWithOptimization(uint256[] memory _arr) public {
        uint256 localSum = 0;
        uint256 arrLength = _arr.length;
        for (uint256 i = 0; i < arrLength; i++) {
            localSum += _arr[i];
        }
        sum = localSum;
    }
}