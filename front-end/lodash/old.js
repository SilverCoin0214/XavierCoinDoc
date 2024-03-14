var ss = {
  // 将输出数组根据size(默认1)  分成多个size长度的数组  多余的部分归类在一个数组中的二维数组输出
  chunk: function (array, size = 1) {
    var len = array.length;
    if (len == 0) return [[]];
    var result = [];
    var temp = [];
    for (let i = 0; i < len; i++) {
      if (temp.length < size) {
        temp.push(array[i]);
      } else {
        result.push(temp.slice());
        temp = [];
        temp.push(array[i]);
      }
    }
    if (temp.length !== 0) {
      result.push(temp.slice());
    }
    return result;
  },
  compact: function (array) {
    // 处理输入数组中的  输出原数组中所有的非假值
    var len = array.length;
    if (len == 0) return [];
    var result = [];
    for (let i = 0; i < len; i++) {
      if (
        array[i] === undefined ||
        array[i] === 0 ||
        array[i] === "" ||
        array[i] === false ||
        array[i] === null ||
        isNaN(array[i])
      ) {
        continue;
      } else {
        result.push(array[i]);
      }
    }
    return result;
  },
  concat: function (array, values) {
    // concar函数会获取第二位开始的所有值或者数组  这一位着会竟可能多的使用输入的数组
    var result = array;
    for (let i = 1; i < arguments.length; i++) {
      if (!(arguments[i] instanceof Array)) {
        result.push(arguments[i]);
      } else {
        for (let j = 0; j < arguments[i].length; j++) {
          // 这里直接推入第一层
          result.push(arguments[i][j]);
        }
      }
    }
    return result;
  },
  difference: function (array) {
    // 排除array中带有的values值
    if (array.length == 0 || arguments.length == 1) return array;
    var del = [];
    for (let i = 1; i < arguments.length; i++) {
      for (let j = 0; j < arguments[i].length; j++) {
        del.push(arguments[i][j]);
      }
    }
    var result = [];
    for (let i = 0; i < array.length; i++) {
      var flag = true;
      for (let j = 0; j < del.length; j++) {
        if (array[i] === del[j]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        result.push(array[i]);
      }
    }
    return result;
  },
  differenceBy: function (array) {
    // array (Array): 要检查的数组。
    // [values] (...Array): 排除的值。
    // [iteratee=_.identity] (Array|Function|Object|string): iteratee 调用每个元素。
    // 排除array中带有的values值
    if (array.length == 0 || arguments.length == 1) return array;
    var del = [];
    if (arguments.length == 2) {
      return this.difference(arguments[0], arguments[1]);
    }
    for (let i = 1; i < arguments.length - 1; i++) {
      for (let j = 0; j < arguments[i].length; j++) {
        del.push(arguments[i][j]);
      }
    }
    var iteratee = arguments[arguments.length - 1];
    if (iteratee instanceof Array) {
      return this.difference(...arguments);
    }
    var result = [];
    for (let i = 0; i < array.length; i++) {
      var flag = true;
      for (let j = 0; j < del.length; j++) {
        // if(array[i] === del[j]){
        //     flag = false;
        //     break;
        // }
        if (typeof iteratee === "function") {
          if (iteratee(array[i]) === iteratee(del[j])) {
            flag = false;
            break;
          }
        } else if (typeof iteratee === "string") {
          if (array[i][iteratee] === del[j][iteratee]) {
            flag = false;
            break;
          }
        }
      }
      if (flag) {
        result.push(array[i]);
      }
    }
    return result;
  },
  differenceWith: function (array, values, comparator) {
    var result = [];
    var same = [];
    for (let i = 0; i < values.length; i++) {
      if (!(values[i] instanceof Array)) {
        for (let j = 0; j < array.length; j++) {
          if (comparator(array[j], values[i])) {
            same.push(array[j]);
          }
        }
      } else {
        for (let m = 0; m < array.length; m++) {
          for (let n = 0; n < values[i].length; n++) {
            if (comparator(array[m], values[i][n])) {
              same.push(array[m]);
            }
          }
        }
      }
    }

    for (let i = 0; i < array.length; i++) {
      var flag = true;
      for (let j = 0; j < same.length; j++) {
        if (comparator(array[i], same[j])) {
          flag = false;
        }
      }
      if (flag) {
        result.push(array[i]);
      }
    }
    return result;
  },
  drop: function (array, n = 1) {
    // 丢弃数组前面n个数  如果N大于数组的长度 则返回空数组
    var len = array.length;
    if (len <= n) {
      return [];
    } else {
      var result = [];
      for (let i = n; i < len; i++) {
        result.push(array[i]);
      }
      return result;
    }
  },
  dropRight: function (array, n = 1) {
    var result = [];
    if (n >= array.length) return result;
    if (n < 0) n = 0;
    for (let i = 0; i < array.length - n; i++) {
      result.push(array[i]);
    }
    return result;
  },
  dropRightWhile: function (array, predicate) {
    var idx;
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate instanceof Array) {
        if (array[i][predicate[0]] !== predicate[1]) {
          idx = i;
          break;
        }
      } else if (typeof predicate === "function") {
        if (!predicate(array[i])) {
          idx = i;
          break;
        }
      } else if (typeof predicate === "string") {
        if (!array[i][predicate]) {
          idx = i;
          break;
        }
      } else {
        var flag = true;
        for (var key in predicate) {
          if (predicate[key] !== array[i][key]) {
            flag = false;
          }
        }
        if (!flag) {
          idx = i;
          break;
        }
      }
    }
    if (idx === undefined) return [];
    return array.slice(0, idx + 1);
  },
  dropWhile: function (array, predicate) {
    var idx;
    for (let i = 0; i < array.length; i++) {
      if (predicate instanceof Array) {
        if (array[i][predicate[0]] !== predicate[1]) {
          idx = i;
          break;
        }
      } else if (typeof predicate === "function") {
        if (!predicate(array[i])) {
          idx = i;
          break;
        }
      } else if (typeof predicate === "string") {
        if (!array[i][predicate]) {
          idx = i;
          break;
        }
      } else {
        var flag = true;
        for (var key in predicate) {
          if (predicate[key] !== array[i][key]) {
            flag = false;
          }
        }
        if (!flag) {
          idx = i;
          break;
        }
      }
    }
    if (idx === undefined) return [];
    return array.slice(idx);
  },
  fill: function (array, value, start = 0, end = array.length) {
    // 将array中的 start到end范围内的数都替换为value
    if (start > end) {
      return array;
    }
    if (start < 0) {
      start = 0;
    }
    for (let i = start; i < end; i++) {
      array[i] = value;
    }
    return array;
  },
  find: function (collection, predicate, fromIndex = 0) {
    // collection (Array|Object): 一个用来迭代的集合。
    // [predicate=_.identity] (Array|Function|Object|string): 每次迭代调用的函数。
    // [fromIndex=0] (number): 开始搜索的索引位置。
    if (!(collection instanceof Array)) {
      collection = [collection];
    }
    if (fromIndex > collection.length) return undefined;

    // 迭代数组
    if (typeof predicate === "string") {
      for (let i = fromIndex; i < collection.length; i++) {
        if (collection[i][predicate] !== undefined) {
          return collection[i];
        }
      }
      return undefined;
    } else if (predicate instanceof Array) {
      for (let i = fromIndex; i < collection.length; i++) {
        if (collection[i][predicate[0]] == predicate[1]) {
          return collection[i];
        }
      }
    } else if (typeof predicate === "function") {
      for (let i = fromIndex; i < collection.length; i++) {
        if (predicate(collection[i])) {
          return collection[i];
        }
      }
      return undefined;
    } else {
      for (let i = fromIndex; i < collection.length; i++) {
        var flag = true;
        for (var key in predicate) {
          if (predicate[key] !== collection[i][key]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          return collection[i];
        }
      }
      return undefined;
    }
  },
  findIndex: function (array, predicate, fromIndex = 0) {
    // array (Array): 要搜索的数组。
    // [predicate=_.identity] (Array|Function|Object|string): 这个函数会在每一次迭代调用。
    // [fromIndex=0] (number): The index to search from.
    if (predicate instanceof Array) {
      for (let i = fromIndex; i < array.length; i++) {
        if (array[i][predicate[0]] == predicate[1]) {
          return i;
        }
      }
      return -1;
    } else if (typeof predicate === "function") {
      for (let i = fromIndex; i < array.length; i++) {
        if (predicate(array[i])) {
          return i;
        }
      }
      return -1;
    } else if (typeof predicate === "object") {
      for (let i = fromIndex; i < array.length; i++) {
        var flag = true;
        for (var key in array[i]) {
          if (array[i][key] !== predicate[key]) {
            flag = false;
          }
        }
        if (flag) {
          return i;
        }
      }
      return -1;
    } else if (typeof predicate === "string") {
      for (let i = fromIndex; i < array.length; i++) {
        if (array[i][predicate]) {
          return i;
        }
      }
      return -1;
    }
  },
  findLastIndex: function (array, predicate, fromIndex = array.length - 1) {
    // array (Array): 要搜索的数组。
    // [predicate=_.identity] (Array|Function|Object|string): 这个函数会在每一次迭代调用。
    // [fromIndex=array.length-1] (number): The index to search from.
    if (predicate instanceof Array) {
      for (let i = fromIndex; i >= 0; i--) {
        if (array[i][predicate[0]] == predicate[1]) {
          return i;
        }
      }
      return -1;
    } else if (typeof predicate === "function") {
      for (let i = fromIndex; i >= 0; i--) {
        if (predicate(array[i])) {
          return i;
        }
      }
      return -1;
    } else if (typeof predicate === "object") {
      for (let i = fromIndex; i >= 0; i--) {
        var flag = true;
        for (var key in array[i]) {
          if (array[i][key] !== predicate[key]) {
            flag = false;
          }
        }
        if (flag) {
          return i;
        }
      }
      return -1;
    } else if (typeof predicate === "string") {
      for (let i = fromIndex; i >= 0; i--) {
        if (array[i][predicate]) {
          return i;
        }
      }
      return -1;
    }
  },
  first: function (array) {
    return array.length == 0 ? undefined : array[0];
  },
  head: function (array) {
    return array.length == 0 ? undefined : array[0];
  },
  flatten: function (array) {
    //实现数组降维  使用高阶函数实现
    // function flatten(ary){
    //     return ary.reduce((result,item,idx,ary)=>{
    //         if(item instanceof Array){
    //             result.push(...item);
    //         }else{
    //             result.push(item);
    //         }
    //         return result;
    //     },[])
    // }

    // 减少一级array的嵌套深度
    var result = [];
    var len = array.length;
    if (len == 0) return [];
    for (let i = 0; i < len; i++) {
      if (array[i] instanceof Array) {
        for (let j = 0; j < array[i].length; j++) {
          result.push(array[i][j]);
        }
      } else {
        result.push(array[i]);
      }
    }
    return result;
  },
  flattenDeep: function (array) {
    return array.reduce((result, item, idx, ary) => {
      return result.concat(
        item instanceof Array ? this.flattenDeep(item) : item
      );
    }, []);
  },
  flattenDepth: function (array, depth = 1) {
    var count = 0;
    while (count < depth) {
      array = this.flatten(array);
      count++;
    }
    return array;
  },
  fromPairs: function (pairs) {
    var result = {};
    for (let i = 0; i < pairs.length; i++) {
      result[pairs[i][0]] = pairs[i][1];
    }
    return result;
  },
  indexOf: function (array, value, fromIndex = 0) {
    // 返回数组中从fromIndex开始检索的value的最近下标
    var len = array.length;
    if (len == 0 || fromIndex >= len) return -1;
    if (fromIndex < 0) {
      fromIndex = fromIndex + len;
      if (fromIndex < 0) {
        fromIndex = 0;
      }
    }
    for (let i = fromIndex; i < len; i++) {
      if (array[i] === value || (isNaN(array[i]) && isNaN(value))) {
        return i;
      }
    }
    return -1;
  },
  initial: function (array) {
    // 获取数组中除了最后一个元素之外的所有元素
    var len = array.length;
    if (len <= 1) return array;
    var result = [];
    for (let i = 0; i < len - 1; i++) {
      result[i] = array[i];
    }
    return result;
  },
  intersection: function (array) {
    // 输入多个数组  返回他们共同的交集元素
    if (arguments.length == 0) return [];
    if (arguments.length == 1) return arguments[0];
    for (let i = 0; i < arguments.length; i++) {
      if (arguments[i].length == 0) {
        return [];
      }
    }
    // 使用difference函数进行操作
    var right = 1;
    var start = arguments[0];
    var end = arguments[right];
    while (right < arguments.length) {
      var res = [];
      for (let i = 0; i < start.length; i++) {
        for (let j = 0; j < end.length; j++) {
          if (start[i] === end[j]) {
            res.push(start[i]);
          }
        }
      }
      start = res;
      right++;
    }
    return res;
  },
  intersectionBy: function (array) {
    // [arrays] (...Array): 待检查的数组。
    // [iteratee=_.identity] (Array|Function|Object|string): iteratee（迭代器）调用每个元素。
    if (array.length == 0 || arguments.length == 1) return array;
    if (arguments.length == 2) return this.intersection(...arguments);
    var temp = array.slice();
    var iteratee = arguments[arguments.length - 1];

    for (let i = 1; i < arguments.length - 1; i++) {
      var res = [];
      for (let j = 0; j < temp.length; j++) {
        var flag = false;
        for (let x = 0; x < arguments[i].length; x++) {
          if (typeof iteratee === "function") {
            if (iteratee(temp[j]) === iteratee(arguments[i][x])) {
              flag = true;
            }
          } else if (typeof iteratee === "string") {
            if (temp[j][iteratee] === arguments[i][x][iteratee]) {
              flag = true;
            }
          }
        }
        if (flag) {
          res.push(temp[j]);
        }
      }
      temp = res;
    }
    return temp;
  },
  intersectionWith: function (array) {
    // 输入多个数组  返回他们共同的交集元素
    if (arguments[0].length == 0) return [];

    // 使用difference函数进行操作
    var right = 1;
    var start = arguments[0];
    var end = arguments[right];
    var comparator = arguments[arguments.length - 1];
    while (right < arguments.length - 1) {
      var res = [];
      for (let i = 0; i < start.length; i++) {
        for (let j = 0; j < end.length; j++) {
          if (comparator(start[i], end[j])) {
            res.push(start[i]);
          }
        }
      }
      start = res;
      right++;
    }
    return res;
  },
  join: function (array, separator = ",") {
    // 把数组拼接符号后输出
    var res = "";
    var len = array.length;
    if (len == 0) return res;
    if (len == 1) return res + array[0];
    for (let i = 0; i < len - 1; i++) {
      res += array[i];
      res += separator;
    }
    res += array[len - 1];
    return res;
  },
  last: function (array) {
    //返回数组中的最后一个数
    var len = array.length;
    if (len == 0) return undefined;
    return array[len - 1];
  },
  lastIndexOf: function (array, value, fromIndex = array.length - 1) {
    var len = array.length;
    if (len === 0 || fromIndex < 0) return -1;
    if (fromIndex >= len) {
      fromIndex = len - 1;
    }
    for (let i = fromIndex; i >= 0; i--) {
      if (array[i] === value || (isNaN(array[i]) && isNaN(value))) {
        return i;
      }
    }
  },
  nth: function (array, n = 0) {
    var len = array.length;
    if (n > 0 && n > len - 1) return undefined;
    if (n < 0) {
      n = n + len;
    }
    if (n < 0) return undefined;
    return array[n];
  },
  pull: function (array, values) {
    //移除数组中含有的values
    var len = array.length;
    if (len == 0) return [];
    var slow = 0;
    for (let i = 0; i < len; i++) {
      var flag = true;
      for (let j = 1; j < arguments.length; j++) {
        if (array[i] === arguments[j]) {
          flag = false;
          continue;
        }
      }
      if (flag) {
        array[slow] = array[i];
        slow++;
      }
    }
    array.length = slow;
    return array;
  },
  pullAll: function (array, values) {
    // 数组与数组
    return this.pull(array, ...values);
    /*var len = array.length;
        if(len ==0)return [];
        var slow = 0;
        for(let i=0;i<len;i++){
            var flag = true;
            for(let j=0;j<values.length;j++){
                if(array[i]===values[j]){
                    flag = false;
                    continue;
                }
            }
            if(flag){
                array[slow] = array[i];
                slow ++;
            }
        }
        array.length = slow;
        return array;*/
  },
  pullAt: function (array, indexes) {
    // 数组和数组下标
    var index = [];
    for (let i = 1; i < arguments.length; i++) {
      if (arguments[i] instanceof Array) {
        index.push(...arguments[i]);
      } else {
        index.push(arguments[i]);
      }
    }
    var idx = 0;
    var result = [];
    for (let i = 0; i < index.length; i++) {
      if (array[index[i]] !== undefined) {
        result.push(array[index[i]]);
        array[index[i]] = undefined;
      }
    }
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== undefined) {
        array[idx] = array[i];
        idx++;
      }
    }
    array.length = idx;
    return result;
  },
  pullAllBy: function (array, values, iteratee) {
    // array (Array): 要修改的数组。
    // values (Array): 要移除值的数组。
    // [iteratee=_.identity] (Array|Function|Object|string): iteratee（迭代器）调用每个元素。
    if (arguments.length <= 2) return this.pullAll(...arguments);
    var idx = 0;
    for (let i = 0; i < array.length; i++) {
      var flag = true;
      for (let j = 0; j < values.length; j++) {
        if (typeof iteratee === "function") {
          if (iteratee(array[i]) === iteratee(values[j])) {
            flag = false;
          }
        } else if (typeof iteratee === "string") {
          if (array[i][iteratee] === values[j][iteratee]) {
            flag = false;
          }
        }
      }
      if (flag) {
        array[idx] = array[i];
        idx++;
      }
    }
    array.length = idx;
    return array;
  },
  pullAllWith: function (array, values, comparator) {
    // array (Array): 要修改的数组。
    // values (Array): 要移除值的数组。
    // [comparator] (Function): comparator（比较器）调用每个元素。

    var idx = 0;
    for (let i = 0; i < array.length; i++) {
      var flag = false;
      for (let j = 0; j < values.length; j++) {
        if (comparator(array[i], values[j])) {
          flag = true;
        }
      }
      if (!flag) {
        array[idx] = array[i];
        idx++;
      }
    }
    array.length = idx;
    return array;
  },
  remove: function (array, predicate) {
    // 移除数组中 对于predicate返回true的数
    var slow = 0;
    for (let i = 0; i < array.length; i++) {
      if (predicate(array[i])) {
        array[slow] = array[i];
        slow++;
      }
    }
    array.length = slow;
    return array;
  },
  reverse: function (array) {
    // 修改原数组  翻转数组内的数
    var len = array.length;
    if (len == 0) return [];
    var left = 0;
    var right = len - 1;
    while (left < right) {
      var temp = array[left];
      array[left] = array[right];
      array[right] = temp;
      left++;
      right--;
    }
    return array;
  },
  slice: function (array, start = 0, end = array.length) {
    // 返回数组 下标start到end之间的数  如果start<0 则使用0  end大于len则使用Len
    // end < start 则返回空
    var len = array.length;
    if (start > end || len == 0) {
      return [];
    }
    if (start < 0) {
      start = 0;
    }
    if (end > len) {
      end = len;
    }
    var result = [];
    for (let i = start; i < end; i++) {
      result.push(array[i]);
    }
    return result;
  },
  sortedIndex: function (array, value) {
    var len = array.length;
    if (len == 0 || len == 1) return 0;
    // 确定数组升序和降序
    var flag = true; // true升序  false降序
    if (array[0] > array[1]) {
      flag = false;
    }
    if (flag) {
      // 排除首部
      if (value <= array[0]) {
        return 0;
        // 排除尾部
      } else if (value > array[len - 1]) {
        return len;
      } else {
        for (let i = 0; i < len - 1; i++) {
          if (array[i] < value && array[i + 1] >= value) {
            return i + 1;
          }
        }
      }
    } else {
      if (value >= array[0]) {
        return 0;
      } else if (value < array[len - 1]) {
        return len;
      } else {
        for (let i = 0; i < len - 1; i++) {
          if (array[i] > value && array[i + 1] <= value) {
            return i + 1;
          }
        }
      }
    }
  },
  sortedIndexOf: function (array, value) {
    var len = array.length;
    if (len == 0 || len == 1) return 0;
    // 确定数组升序和降序
    var flag = true; // true升序  false降序
    if (array[0] > array[1]) {
      flag = false;
    }
    if (flag) {
      // 排除首部
      if (value <= array[0]) {
        return 0;
        // 排除尾部
      } else if (value > array[len - 1]) {
        return len;
      } else {
        for (let i = 0; i < len - 1; i++) {
          if (array[i] < value && array[i + 1] >= value) {
            return i + 1;
          }
        }
      }
    } else {
      if (value >= array[0]) {
        return 0;
      } else if (value < array[len - 1]) {
        return len;
      } else {
        for (let i = 0; i < len - 1; i++) {
          if (array[i] > value && array[i + 1] <= value) {
            return i + 1;
          }
        }
      }
    }
  },
  sortedIndexBy: function (array, value, iteratee) {
    // array (Array): 要检查的排序数组。
    // value (*): 要评估的值。
    // [iteratee=_.identity] (Array|Function|Object|string): 迭代函数，调用每个元素。
    for (let i = 0; i < array.length; i++) {
      if (typeof iteratee === "function") {
        if (iteratee(array[i]) >= iteratee(value)) {
          return i;
        }
      } else if (typeof iteratee === "string") {
        if (array[i][iteratee] >= value[iteratee]) {
          return i;
        }
      }
    }
    return array.length;
  },
  sortedIndexOf: function (array, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  },
  sortedLastIndex: function (array, value) {
    // array (Array): 要检查的排序数组。
    // value (*): 要评估的值。
    if (array.lengh === 0) return array;
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i] <= value) {
        return i + 1;
      }
    }
    return 0;
  },
  sortedLastIndexBy: function (array, value, iteratee) {
    // array (Array): 要检查的排序数组。
    // value (*): 要评估的值。
    // [iteratee=_.identity] (Array|Function|Object|string): 迭代函数，调用每个元素。
    if (array.lengh === 0) return array;
    for (let i = array.length - 1; i >= 0; i--) {
      if (typeof iteratee === "function") {
        if (iteratee(array[i]) <= iteratee(value)) {
          return i + 1;
        }
      } else if (typeof iteratee === "string") {
        if (array[i][iteratee] <= value[iteratee]) {
          return i + 1;
        }
      }
    }
    return 0;
  },
  sortedLastIndexOf: function (array, value) {
    // array (Array): 要检查的排序数组。
    // value (*): 要评估的值。
    if (array.lengh === 0) return array;
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i] == value) {
        return i;
      }
    }
    return -1;
  },
  sortedUniq: function (array) {
    var result = [];
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] !== array[i + 1]) {
        result.push(array[i]);
      }
    }
    result.push(array[array.length - 1]);
    return result;
  },
  sortedUniqBy: function (array, iteratee) {
    // array (Array): 要检查的数组。
    // [iteratee] (Function): 迭代函数，调用每个元素。
    var result = [];
    if (array.length == 0) return [];
    result.push(array[0]);
    for (let i = 1; i < array.length; i++) {
      if (iteratee(array[i]) === iteratee(array[i - 1])) {
        continue;
      }
      result.push(array[i]);
    }
    return result;
  },
  tail: function (array) {
    // 返回除了数组第一个元素以外的全部元素
    var len = array.length;
    if (len <= 1) return [];
    var result = [];
    for (let i = 1; i < array.length; i++) {
      result.push(array[i]);
    }
    return result;
  },
  take: function (array, n = 1) {
    // 从数组左边开始获取n个元素
    var len = array.length;
    if (len == 0 || n == 0) return [];
    if (n > len) {
      n = len;
    }
    var result = [];
    for (let i = 0; i < n; i++) {
      result.push(array[i]);
    }
    return result;
  },
  takeRight: function (array, n = 1) {
    // 从数组右边开始获取n个元素
    var len = array.length;
    if (len == 0 || n == 0) return [];
    if (n > len) {
      n = len;
    }
    var result = [];
    for (let i = len - n; i < len; i++) {
      result.push(array[i]);
    }
    return result;
  },
  takeRightWhile: function (array, predicate) {
    // array (Array): 要检索的数组。
    // [predicate=_.identity] (Array|Function|Object|string): 每次迭代调用的函数。
    var idx;
    if (predicate instanceof Array) {
      for (let i = array.length - 1; i >= 0; i--) {
        if (array[i][predicate[0]] === predicate[1]) {
          idx = i;
        } else {
          break;
        }
      }
      if (idx === undefined) return [];
      return array.slice(idx);
    } else if (typeof predicate === "function") {
      for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i])) {
          idx = i;
        } else {
          break;
        }
      }
      console.log(idx);
      if (idx === undefined) return [];
      return array.slice(idx);
    } else if (typeof predicate === "object") {
      for (let i = array.length - 1; i >= 0; i--) {
        var flag = true;
        for (var key in array[i]) {
          if (array[i][key] !== predicate[key]) {
            flag = false;
          }
        }
        if (flag) {
          idx = i;
        }
      }
      console.log(idx);
      if (idx === undefined) return [];
      return array.slice(idx);
    } else if (typeof predicate === "string") {
      for (let i = array.length - 1; i >= 0; i--) {
        if (array[i][predicate]) {
          idx = i;
        } else {
          break;
        }
      }
      if (idx === undefined) return [];
      return array.slice(idx);
    }
  },
  takeWhile: function (array, predicate) {
    // array (Array): 需要处理的数组
    // [predicate=_.identity] (Array|Function|Object|string): 每次迭代调用的函数。
    var idx;
    if (predicate instanceof Array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i][predicate[0]] === predicate[1]) {
          idx = i;
        } else {
          break;
        }
      }
      if (idx === undefined) return [];
      return array.slice(0, idx + 1);
    } else if (typeof predicate === "function") {
      for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
          idx = i;
        } else {
          break;
        }
      }
      if (idx === undefined) return [];
      return array.slice(0, idx + 1);
    } else if (typeof predicate === "object") {
      for (let i = 0; i < array.length; i++) {
        var flag = true;
        for (var key in array[i]) {
          if (array[i][key] !== predicate[key]) {
            flag = false;
          }
        }
        if (flag) {
          idx = i;
        }
      }
      if (idx === undefined) return [];
      return array.slice(0, idx + 1);
    } else if (typeof predicate === "string") {
      for (let i = 0; i < array.length; i++) {
        if (array[i][predicate]) {
          idx = i;
        } else {
          break;
        }
      }
      if (idx === undefined) return [];
      return array.slice(0, idx + 1);
    }
  },
  union: function (arrays) {
    // 使用Map记录
    var result = [];
    var map = {};
    for (let i = 0; i < arguments.length; i++) {
      for (let j = 0; j < arguments[i].length; j++) {
        if (map[arguments[i][j]] == undefined) {
          result.push(arguments[i][j]);
          map[arguments[i][j]] = true;
        }
      }
    }
    return result;
  },
  unionBy: function (arrays) {
    // [arrays] (...Array): 要检查的数组。
    // [iteratee=_.identity] (Array|Function|Object|string): 迭代函数，调用每个元素。
    var iteratee = arguments[arguments.length - 1];
    if (iteratee instanceof Array) return this.union(...arguments);
    var result = [];
    var map = {};
    for (let i = 0; i < arguments.length - 1; i++) {
      for (let j = 0; j < arguments[i].length; j++) {
        if (typeof iteratee === "function") {
          if (map[iteratee(arguments[i][j])] === undefined) {
            result.push(arguments[i][j]);
            map[iteratee(arguments[i][j])] = true;
          }
        } else if (typeof iteratee === "string") {
          if (map[arguments[i][j][iteratee]] === undefined) {
            result.push(arguments[i][j]);
            map[arguments[i][j][iteratee]] = true;
          }
        }
      }
    }
    return result;
  },
  unionWith: function (arrays) {
    // [arrays] (...Array): 要检查的数组。
    // [comparator] (Function): 比较函数，调用每个元素。
    var result = [];
    var comparator = arguments[arguments.length - 1];
    for (let i = 0; i < arguments.length - 1; i++) {
      for (let j = 0; j < arguments[i].length; j++) {
        var flag = true;
        for (let x = 0; x < result.length; x++) {
          if (comparator(arguments[i][j], result[x])) {
            flag = false;
          }
        }
        if (flag) {
          result.push(arguments[i][j]);
        }
      }
    }
    return result;
  },
  uniq: function (array) {
    var map = {};
    var result = [];
    for (let i = 0; i < array.length; i++) {
      if (map[array[i]] === undefined) {
        result.push(array[i]);
        map[array[i]] = true;
      }
    }
    return result;
  },
  uniqBy: function (array, iteratee) {
    // array (Array): 要检查的数组。
    // [iteratee=_.identity] (Array|Function|Object|string): 迭代函数，调用每个元素。
    if (arguments.length === 1) return this.uniq(array);
    var map = {};
    var result = [];
    for (let i = 0; i < array.length; i++) {
      if (typeof iteratee === "function") {
        if (!map[iteratee(array[i])]) {
          map[iteratee(array[i])] = true;
          result.push(array[i]);
        }
      } else if (typeof iteratee === "string") {
        if (!map[array[i][iteratee]]) {
          map[array[i][iteratee]] = true;
          result.push(array[i]);
        }
      }
    }
    return result;
  },
  uniqWith: function (array, comparator) {
    // array (Array): 要检查的数组。
    // [comparator] (Function): 比较函数，调用每个元素。
    var result = [];
    for (let i = 0; i < array.length; i++) {
      var flag = true;
      for (let j = 0; j < result.length; j++) {
        if (comparator(array[i], result[j])) {
          flag = false;
          break;
        }
      }
      if (flag) {
        result.push(array[i]);
      }
    }
    return result;
  },
  unzip: function (array) {
    if (array.length == 0 || array[0].length == 0) return [[]];
    var result = [];
    // [['a',1,true],['c',0,false]] => [['a','c'],[1,0],[true,false]]
    var len = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i].length > len) {
        len = array[i].length;
      }
    }
    var size = array.length;
    for (let i = 0; i < len; i++) {
      result.push([]);
    }
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < size; j++) {
        result[i][j] = array[j][i];
      }
    }
    return result;
  },
  unzipWith: function (array, iteratee) {
    // array (Array): 要处理的分组元素数组。
    // [iteratee=_.identity] (Function): 这个函数用来组合重组的值。
    if (array.length == 0 || array[0].length == 0) return [[]];
    var result = [];
    // [['a',1,true],['c',0,false]] => [['a','c'],[1,0],[true,false]]
    var len = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i].length > len) {
        len = array[i].length;
      }
    }
    var size = array.length;
    for (let i = 0; i < len; i++) {
      result.push([]);
    }
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < size; j++) {
        result[i][j] = array[j][i];
      }
    }

    for (let i = 0; i < result.length; i++) {
      result[i] = iteratee(...result[i]);
    }
    return result;
  },
  without: function (array, values) {
    // 过滤数组与pull类似  区别在于这个方法返回一个新数组
    var len = array.length;
    if (len == 0) return [];
    if (arguments.length == 1) return array.slice();
    var result = [];
    for (let i = 0; i < len; i++) {
      var flag = true;
      for (let j = 1; j < arguments.length; j++) {
        if (array[i] === arguments[j]) {
          flag = false;
        }
      }
      if (flag) {
        result.push(array[i]);
      }
    }
    return result;
  },
  xor: function (arrays) {
    var map = {};
    var all = [];
    for (let i = 0; i < arguments.length; i++) {
      for (let j = 0; j < arguments[i].length; j++) {
        all.push(arguments[i][j]);
        if (map[arguments[i][j]] === undefined) {
          map[arguments[i][j]] = 1;
        } else {
          map[arguments[i][j]]++;
        }
      }
    }
    var result = [];
    for (let i = 0; i < all.length; i++) {
      if (map[all[i]] == 1) {
        result.push(all[i]);
      }
    }
    return result;
  },
  xorBy: function (arrays) {
    // [arrays] (...Array): 要检查的数组。
    // [iteratee=_.identity] (Array|Function|Object|string): 调用每一个元素的迭代函数。
    var iteratee = arguments[arguments.length - 1];

    if (iteratee instanceof Array) {
      return this.xor(...arguments);
    }
    var all = [];
    var map = {};
    for (let i = 0; i < arguments.length - 1; i++) {
      for (let j = 0; j < arguments[i].length; j++) {
        all.push(arguments[i][j]);
        if (typeof iteratee === "function") {
          if (map[iteratee(arguments[i][j])] === undefined) {
            map[iteratee(arguments[i][j])] = 1;
          } else {
            map[iteratee(arguments[i][j])]++;
          }
        } else if (typeof iteratee === "string") {
          if (map[arguments[i][j][iteratee]] === undefined) {
            map[arguments[i][j][iteratee]] = 1;
          } else {
            map[arguments[i][j][iteratee]]++;
          }
        }
      }
    }
    var result = [];
    for (let i = 0; i < all.length; i++) {
      if (typeof iteratee === "function") {
        if (map[iteratee(all[i])] == 1) {
          result.push(all[i]);
        }
      } else if (typeof iteratee === "string") {
        if (map[all[i][iteratee]] == 1) {
          result.push(all[i]);
        }
      }
    }
    return result;
  },
  xorWith: function (arrays) {
    // [arrays] (...Array): 要检查的数组。
    // [comparator] (Function): 调用每一个元素的比较函数。
    var comparator = arguments[arguments.length - 1];
    var all = [];
    for (let i = 0; i < arguments.length - 1; i++) {
      for (let j = 0; j < arguments[i].length; j++) {
        all.push(arguments[i][j]);
      }
    }
    var result = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i] === undefined) continue;
      for (let j = i + 1; j < all.length; j++) {
        if (all[j] === undefined) continue;
        if (comparator(all[i], all[j])) {
          all[i] = undefined;
          all[j] = undefined;
        }
      }
    }
    for (let i = 0; i < all.length; i++) {
      if (all[i] !== undefined) {
        result.push(all[i]);
      }
    }
    return result;
  },
  zip: function (arrays) {
    if (arguments.length == 0 || arguments[0].length == 0) {
      return [[]];
    }
    var num = 0;
    for (let i = 0; i < arguments.length; i++) {
      if (arguments[i].length > num) {
        num = arguments[i].length;
      }
    }
    var size = arguments.length;
    var result = [];
    for (let i = 0; i < num; i++) {
      var temp = [];
      for (let j = 0; j < size; j++) {
        temp.push(arguments[j][i]);
      }
      result.push(temp.slice());
    }
    return result;
  },
  zipObject: function (props, values) {
    var result = {};
    var psize = props.length;
    var vsize = values.length;
    if (psize <= vsize) {
      // psize少于vsize时 只会创建Psize个内容 但是多余时剩下的属性值为undefined
      for (let i = 0; i < psize; i++) {
        result[props[i]] = values[i];
      }
    } else if (psize > vsize) {
      for (let i = 0; i < psize; i++) {
        // 多余部分用undefined填充
        if (i >= vsize) {
          result[props[psize]] = undefined;
        } else {
          result[props[i]] = values[i];
        }
      }
    }
    return result;
  },
  zipObjectDeep: function (props = [], values = []) {
    // [props=[]] (Array): 属性标识符（属性名）。
    // [values=[]] (Array): 属性值。
    var result = {};
    for (let i = 0; i < props.length; i++) {
      var path = props[i].split(/[\[\].]+/);
      var item = result;

      for (let i = 0; i < path.length - 1; i++) {
        if (item[path[i]]) {
          item = item[path[i]];
        } else {
          // 需要加的是一个数组
          if (isNaN(path[i + 1])) {
            item[path[i]] = {};
          } else {
            item[path[i]] = [];
          }
          item = item[path[i]];
        }
      }
      item[path[path.length - 1]] = values[i];
    }
    return result;
  },
  zipWith: function (arrays) {
    // [arrays] (...Array): 要处理的数组。
    // [iteratee=_.identity] (Function): 函数用来组合分组的值。
    if (arguments.length == 0 || arguments[0].length == 0) {
      return [[]];
    }
    var num = 0;
    var iteratee = arguments[arguments.length - 1];
    if (typeof iteratee === "function") {
      var len = arguments.length - 1;
    } else {
      return this.zip(...arguments);
    }
    for (let i = 0; i < len; i++) {
      if (arguments[i].length > num) {
        num = arguments[i].length;
      }
    }
    var size = len;
    var result = [];
    for (let i = 0; i < num; i++) {
      var temp = [];
      for (let j = 0; j < size; j++) {
        temp.push(arguments[j][i]);
      }
      result.push(temp.slice());
    }
    for (let i = 0; i < result.length; i++) {
      result[i] = iteratee(...result[i]);
    }
    return result;
  },
  countBy: function (collection, iteratee) {
    // collection (Array|Object): 一个用来迭代的集合。
    // [iteratee=_.identity] (Array|Function|Object|string): 一个迭代函数，用来转换key（键）。
    var result = {};
    if (collection instanceof Array) {
      if (iteratee instanceof Array) {
        // for(let i=0;i<collection.length;i++){
        //     if(result[collection[i][iteratee[0]]] === iteratee[1] ){
        //         result[collection[i][iteratee[0]]] = 1;
        //     }else{
        //         result[collection[i][iteratee[0]]]++;
        //     }
        // }
        // return result;
      } else if (typeof iteratee === "function") {
        for (let i = 0; i < collection.length; i++) {
          if (result[iteratee(collection[i])] === undefined) {
            result[iteratee(collection[i])] = 1;
          } else {
            result[iteratee(collection[i])]++;
          }
        }
        return result;
      } else if (typeof iteratee === "object") {
      } else if (typeof iteratee === "string") {
        for (let i = 0; i < collection.length; i++) {
          if (result[collection[i][iteratee]] === undefined) {
            result[collection[i][iteratee]] = 1;
          } else {
            result[collection[i][iteratee]]++;
          }
        }
        return result;
      }
    } else {
      if (iteratee instanceof Array) {
      } else if (typeof iteratee === "function") {
        for (var key in collection) {
          if (result[iteratee(collection[i])] === undefined) {
            result[iteratee(collection[i])] = 1;
          } else {
            result[iteratee(collection[i])]++;
          }
        }
        return result;
      } else if (typeof iteratee === "object") {
      } else if (typeof iteratee === "string") {
        for (var key in collection) {
          if (result[collection[i][iteratee]] === undefined) {
            result[collection[i][iteratee]] = 1;
          } else {
            result[collection[i][iteratee]]++;
          }
        }
        return result;
      }
    }
  },
  forEach: function (collection, iteratee) {
    // collection (Array|Object): 一个用来迭代的集合。
    // [iteratee=_.identity] (Function): 每次迭代调用的函数。
    if (collection instanceof Array) {
      for (let i = 0; i < collection.length; i++) {
        if (iteratee(collection[i]) === false) break;
        iteratee(collection[i]);
      }
    } else {
      for (var key in collection) {
        if (iteratee(collection[key]) === false) break;
        iteratee(collection[key]);
      }
    }
    return collection;
  },
  forEachRight: function (collection, iteratee) {
    // collection (Array|Object): 一个用来迭代的集合。
    // [iteratee=_.identity] (Function): 每次迭代调用的函数。
    if (collection instanceof Array) {
      for (let i = collection.length - 1; i >= 0; i--) {
        if (iteratee(collection[i]) === false) break;
        iteratee(collection[i]);
      }
    } else if (collection instanceof Object) {
      for (var key in collection) {
        if (iteratee(collection[key]) === false) break;
        iteratee(collection[key]);
      }
    }
    return collection;
  },
  every: function (collection, predicate) {
    // collection (Array|Object): 一个用来迭代的集合。
    // [predicate=_.identity] (Array|Function|Object|string): 每次迭代调用的函数。

    //     return ary.reduce((result,item,idx,ary)=>{  简单的实现  没有考虑predicate
    //         return result && (test(item));
    //     },true)
    if (!collection instanceof Array) {
      collection = [collection];
    }
    var flag = true;
    for (let i = 0; i < collection.length; i++) {
      if (predicate instanceof Array) {
        if (collection[i][predicate[0]] !== predicate[1]) {
          flag = false;
          break;
        }
      } else if (typeof predicate === "function") {
        if (!predicate(collection[i])) {
          flag = false;
          break;
        }
      } else if (typeof predicate === "object") {
        for (var key in predicate) {
          if (collection[i][key] !== predicate[key]) {
            flag = false;
            break;
          }
        }
      } else {
        if (!collection[i][predicate]) {
          flag = false;
          break;
        }
      }
    }
    return flag;
  },
  filter: function (collection, predicate) {
    // collection (Array|Object): 一个用来迭代的集合。
    // [predicate=_.identity] (Array|Function|Object|string): 每次迭代调用的函数。
    if (!collection instanceof Array) {
      collection = [collection];
    }
    var result = [];
    for (let i = 0; i < collection.length; i++) {
      if (predicate instanceof Array) {
        if (collection[i][predicate[0]] === predicate[1]) {
          result.push(collection[i]);
        }
      } else if (typeof predicate === "function") {
        if (predicate(collection[i])) {
          result.push(collection[i]);
        }
      } else if (typeof predicate === "object") {
        var flag = true;
        for (var key in predicate) {
          if (collection[i][key] !== predicate[key]) {
            flag = false;
          }
        }
        if (flag) {
          result.push(collection[i]);
        }
      } else {
        if (collection[i][predicate]) {
          result.push(collection[i]);
        }
      }
    }
    return result;
  },
  findLast: function (
    collection,
    predicate,
    fromIndex = collection.length - 1
  ) {
    if (!(collection instanceof Array)) {
      collection = [collection];
    }
    if (fromIndex > collection.length) return undefined;

    // 迭代数组
    if (typeof predicate === "string") {
      for (let i = fromIndex; i >= 0; i--) {
        if (collection[i][predicate] !== undefined) {
          return collection[i];
        }
      }
      return undefined;
    } else if (predicate instanceof Array) {
      for (let i = fromIndex; i >= 0; i--) {
        if (collection[i][predicate[0]] == predicate[1]) {
          return collection[i];
        }
      }
    } else if (typeof predicate === "function") {
      for (let i = fromIndex; i >= 0; i--) {
        if (predicate(collection[i])) {
          return collection[i];
        }
      }
      return undefined;
    } else {
      for (let i = fromIndex; i >= 0; i--) {
        var flag = true;
        for (var key in predicate) {
          if (predicate[key] !== collection[i][key]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          return collection[i];
        }
      }
      return undefined;
    }
  },
  flatMap: function (collection, iteratee) {
    // collection (Array|Object): 一个用来迭代遍历的集合。
    // [iteratee=_.identity] (Array|Function|Object|string): 每次迭代调用的函数。
    var res = [];
    if (collection instanceof Array) {
      for (let i = 0; i < collection.length; i++) {
        if (typeof iteratee === "function") {
          res.push(iteratee(collection[i]));
        } else {
          res.push(collection[i][iteratee]);
        }
      }
    } else if (typeof collection === "object") {
      for (var key in collection) {
        if (typeof iteratee === "function") {
          res.push(iteratee(collection[key]));
        } else {
          res.push(collection[key][iteratee]);
        }
      }
    }
    return this.flatten(res);
  },
  flatMapDeep: function (collection, iteratee) {},
  flattenDepth: function (array, depth = 1) {},
  groupBy: function (collection, iteratee) {
    // collection (Array|Object): 一个用来迭代的集合。
    // [iteratee=_.identity] (Array|Function|Object|string): 这个迭代函数用来转换key。

    if (!collection instanceof Array) {
      collection = [collection];
    }

    var result = {};
    for (let i = 0; i < collection.length; i++) {
      if (typeof iteratee === "function") {
        if (result[iteratee(collection[i])] === undefined) {
          result[iteratee(collection[i])] = [collection[i]];
        } else {
          result[iteratee(collection[i])].push(collection[i]);
        }
      } else if (typeof iteratee === "string") {
        if (result[collection[i][iteratee]] === undefined) {
          result[collection[i][iteratee]] = [collection[i]];
        } else {
          result[collection[i][iteratee]].push(collection[i]);
        }
      }
    }
    return result;
  },
  includes: function (collection, value, fromIndex = 0) {
    // 判断collection类型
    if (collection instanceof Array) {
      var len = collection.length;
      if (len <= fromIndex) return false;
      for (let i = fromIndex; i < len; i++) {
        if (collection[i] === value) {
          return true;
        }
      }
      return false;
    } else if (collection instanceof Object) {
      var len = 0;
      for (var key in collection) {
        len++;
      }
      if (fromIndex >= len) return false;
      for (var key in collection) {
        if (collection[key] === value) {
          return true;
        }
      }
      return false;
    } else if (typeof collection === "string") {
      var clen = collection.length;
      var vlen = value.length;
      if (vlen > clen) return false;
      for (let i = fromIndex; i < clen - vlen; i++) {
        if (collection[i] === value[0]) {
          var idx = 0;
          var flag = true;
          while (idx < vlen && flag) {
            if (collection[i + idx] !== value[idx]) {
              flag = false;
            }
            idx++;
          }
          if (flag) {
            return true;
          }
        }
      }
      return false;
    }
  },
  invokeMap: function (collection, path, args) {
    // collection (Array|Object): 用来迭代的集合。
    // path (Array|Function|string): 用来调用方法的路径 或 者每次迭代调用的函数。
    // [args] (...*): 调用每个方法的参数。
  },
  keyBy: function (collection, iteratee) {
    // collection (Array|Object): 用来迭代的集合。
    // [iteratee=_.identity] (Array|Function|Object|string): 这个迭代函数用来转换key。
    var result = {};
    if (!collection instanceof Array) {
      collection = [collection];
    }

    for (let i = 0; i < collection.length; i++) {
      if (typeof iteratee === "function") {
        result[iteratee(collection[i])] = collection[i];
      } else if (typeof iteratee === "string") {
        result[collection[i][iteratee]] = collection[i];
      }
    }
    return result;
  },
  map: function (collection, iteratee) {
    // collection (Array|Object): 用来迭代的集合。
    // [iteratee=_.identity] (Array|Function|Object|string): 每次迭代调用的函数。
    var result = [];
    if (collection instanceof Array) {
      for (let i = 0; i < collection.length; i++) {
        if (typeof iteratee === "function") {
          result.push(iteratee(collection[i], i, collection));
        } else {
          var iterarr = iteratee.split(/[\[\].]+/);
          var res = collection[i];
          for (let j = 0; j < iterarr.length; j++) {
            res = res[iterarr[j]];
          }
          result.push(res);
        }
      }
      return result;
    } else {
      for (var key in collection) {
        if (typeof iteratee === "function") {
          result.push(iteratee(collection[key], i, collection));
        } else {
          var iterarr = iteratee.split(/[\[\].]+/);
          var res = collection[key];
          for (let i = 0; i < iterarr.length; i++) {
            res = res[iterarr[i]];
          }
          result.push(res);
        }
      }
    }
    return result;
  },
  orderBy: function (collection, iteratees, orders) {
    // collection (Array|Object): 用来迭代的集合。
    // [iteratees=[_.identity]] (Array[]|Function[]|Object[]|string[]): 排序的迭代函数。
    // [orders] (string[]): iteratees迭代函数的排序顺序。
  },
  partition: function (collection, predicate) {
    // collection (Array|Object): 用来迭代的集合。
    // [predicate=_.identity] (Array|Function|Object|string): 每次迭代调用的函数。
    var result = [];
    if (!collection instanceof Array) {
      collection = [collection];
    }
    var tArr = [];
    var fArr = [];
    for (let i = 0; i < collection.length; i++) {
      if (typeof predicate === "function") {
        if (predicate(collection[i])) {
          tArr.push(collection[i]);
        } else {
          fArr.push(collection[i]);
        }
      } else if (predicate instanceof Array) {
        if (collection[i][predicate[0]] === predicate[1]) {
          tArr.push(collection[i]);
        } else {
          fArr.push(collection[i]);
        }
      } else if (typeof predicate === "string") {
        if (collection[i][predicate]) {
          tArr.push(collection[i]);
        } else {
          fArr.push(collection[i]);
        }
      } else {
        var flag = true;
        for (var key in predicate) {
          if (predicate[key] !== collection[i][key]) {
            flag = false;
          }
        }
        if (flag) {
          tArr.push(collection[i]);
        } else {
          fArr.push(collection[i]);
        }
      }
    }
    result.push(tArr);
    result.push(fArr);
    return result;
  },
  reduce: function (collection, iteratee, accumulator = 0) {
    // collection (Array|Object): 用来迭代的集合。
    // [iteratee=_.identity] (Function): 每次迭代调用的函数。
    // [accumulator] (*): 初始值。
    if (collection instanceof Array) {
      for (let i = 0; i < collection.length; i++) {
        accumulator = iteratee(accumulator, collection[i], i, collection);
      }
      return accumulator;
    } else {
      for (var key in collection) {
        accumulator = iteratee(accumulator, collection[key], key, collection);
      }
      return accumulator;
    }
  },
  reduceRight: function (collection, iteratee, accumulator) {
    // collection (Array|Object): 用来迭代的集合。
    // [iteratee=_.identity] (Function): 每次迭代调用的函数。
    // [accumulator] (*): 初始值。
    if (collection instanceof Array) {
      for (let i = collection.length - 1; i >= 0; i--) {
        accumulator = iteratee(accumulator, collection[i], i, collection);
      }
      return accumulator;
    } else {
      for (var key in collection) {
        accumulator = iteratee(accumulator, collection[key], key, collection);
      }
      return accumulator;
    }
  },
  reject: function (collection, predicate) {
    // collection (Array|Object): 用来迭代的集合。
    // [predicate=_.identity] (Array|Function|Object|string): 每次迭代调用的函数
    var result = [];
    if (collection instanceof Array) {
      for (let i = 0; i < collection.length; i++) {
        if (predicate instanceof Array) {
          if (collection[i][predicate[0]] !== predicate[1]) {
            result.push(collection[i]);
          }
        } else if (typeof predicate === "function") {
          if (!predicate(collection[i])) {
            result.push(collection[i]);
          }
        } else if (typeof predicate === "object") {
          var flag = false;
          for (var key in predicate) {
            if (predicate[key] !== collection[i][key]) {
              flag = true;
            }
          }
          if (flag) {
            result.push(collection[i]);
          }
        } else if (typeof predicate === "string") {
          if (!collection[i][predicate]) {
            result.push(collection[i]);
          }
        }
      }
      return result;
    } else {
      var flag = false;
      for (var key in collection) {
        if (predicate instanceof Array) {
          if (collection[key][predicate[0]] !== predicate[1]) {
            flag = true;
          }
        } else if (typeof predicate === "function") {
          if (!predicate(collection[i])) {
            flag = true;
          }
        } else if (typeof predicate === "object") {
          for (var key in predicate) {
            if (predicate[key] !== collection[i][key]) {
              flag = true;
            }
          }
        } else if (typeof predicate === "string") {
          if (!collection[i][predicate]) {
            flag = true;
          }
        }
      }
      if (flag) {
        for (var key in collection) {
          result.push(collection[key]);
        }
      } else {
        return [];
      }
    }
  },
  sample: function (collection) {
    var len = collection.length;
    if (len == 0) return undefined;
    var ran = parseInt(Math.random() * len);
    return collection[ran];
  },
  sampleSize: function (collection, n = 1) {
    if (n == 0 || collection.length == 0) return [];
    var num = 0;
    var result = [];
    if (n > collection.length) {
      n = collection.length;
    }

    while (num < n) {
      var ran = parseInt(Math.random() * collection.length);
      result.push(collection[ran]);
      for (let i = ran + 1; i < collection.length; i++) {
        collection[i - 1] = collection[i];
      }
      collection.length = collection.length - 1;
      num++;
    }
    return result;
  },
  shuffle: function (collection) {
    return this.sampleSize(collection, collection.length);
  },
  size: function (collection) {
    if (collection instanceof Array || typeof collection === "string") {
      return collection.length;
    } else if (collection instanceof Object) {
      var num = 0;
      for (var i in collection) {
        num++;
      }
      return num;
    }
  },
  some: function (collection, predicate) {
    // some: function(ary,test){
    //     // return ary.reduce((result,item,idx,ary)=>{
    //     //     return result || (test(item));
    //     // },false)
    //     return !this.every(ary,function(...args){
    //         return !test(...args);
    //     });
    // },
    // collection (Array|Object): 用来迭代的集合。
    // [predicate=_.identity] (Array|Function|Object|string): 每次迭代调用的函数

    if (!collection instanceof Array) {
      collection = [collection];
    }

    for (let i = 0; i < collection.length; i++) {
      if (typeof predicate === "function") {
        if (predicate(collection[i])) {
          return true;
        }
      } else if (typeof predicate === "string") {
        if (collection[i][predicate]) {
          return true;
        }
      } else if (predicate instanceof Array) {
        if (collection[i][predicate[0]] === predicate[1]) {
          return true;
        }
      } else {
        var flag = true;
        for (var key in predicate) {
          if (predicate[key] !== collection[i][key]) {
            flag = false;
          }
        }
        if (flag) {
          return true;
        }
      }
    }
    return false;
  },
  sortBy: function (collection, iteratees) {
    // collection (Array|Object): 用来迭代的集合。
    // [iteratees=[_.identity]] (...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])): 这个函数决定排序。
  },
  after: function (n, func) {
    var i = 0;
    return function (...args) {
      i++;
      if (i >= n) {
        return func(...args);
      }
    };
  },
  ary: function (func, n = func.length) {
    return function (...args) {
      return func(...args.slice(0, n));
    };
  },
  before: function (n, func) {
    var i = 0;
    var result;
    return function (...args) {
      i++;
      if (i < n) {
        result = func(...args);
      }
      return result;
    };
  },
  bind: function (f, ...fixedArgs) {
    return function bound(...args) {
      //[7,8,9]
      var copy = fixedArgs.slice();
      var j = 0;

      for (var i = 0; i < copy.length; i++) {
        if (copy[i] === null) {
          copy[i] = args[j++];
        }
      }
      while (j < args.length) {
        copy.push(args[j++]);
      }

      return f(...copy);
    };
  },
  curry: function (fn, length = f.length) {
    return function (...args) {
      if (args.length >= length) {
        return f(...args);
      } else {
        return curry(f.bind(null, ...args), length - args.length);
      }
    };
  },
  flip: function (func) {
    return function (...args) {
      return func(...args.reverse());
    };
  },
  negate: function (func) {
    return function (...args) {
      return !func(...args);
    };
  },
  spread: function (func, start = 0) {
    return function (args) {
      return func(...ary);
    };
  },
  unary: function (func) {
    return function (arg) {
      return func(arg);
    };
  },
  castArray: function (value) {
    if (value instanceof Array) return value;
    if (arguments.length === 0) return [];
    return [value];
  },
  clone: function (value) {
    var res = value;
    return res;
  },
  cloneDeep: function (value) {
    if (value instanceof Array) {
      var res = [];
      for (let i = 0; i < value.length; i++) {
        res.push(this.cloneDeep(value[i]));
      }
      return res;
    } else if (value instanceof RegExp) {
      return value;
    } else if (typeof value === "object") {
      var res = {};
      for (var key in value) {
        res[key] = this.cloneDeep(value[key]);
      }
      return res;
    } else {
      var res = value;
      return res;
    }
  },
  cloneDeepWith: function (value, customizer) {
    if (value instanceof Array) {
      var res = [];
      for (let i = 0; i < value.length; i++) {
        res.push(this.cloneDeepWith(value[i], customizer));
      }
      return res;
    } else if (typeof value === "object") {
      var res = {};
      for (var key in value) {
        res[key] = this.cloneDeepWith(value[key], customizer);
      }
      return res;
    } else {
      var res = customizer(value);
      return res;
    }
  },
  cloneWith: function () {},
  conformsTo: function (object, source) {
    var flag = true;
    for (var key in source) {
      if (!source[key](object[key])) {
        flag = false;
      }
    }
    return flag;
  },
  eq: function (value, other) {
    if (value !== value && other !== other) {
      return true;
    } else {
      return value === other;
    }
  },
  gt: function (value, other) {
    return Number(value) > Number(other);
  },
  gte: function (value, other) {
    return Number(value) >= Number(other);
  },
  isArguments: function (value) {
    return value.constrator === Array;
  },
  isArray: function (value) {
    return value instanceof Array;
  },
  isArrayBuffer: function (value) {
    return value.toString() === "[object ArrayBuffer]";
  },
  isArrayLike: function (value) {
    return (
      typeof value === "object" &&
      value.length !== undefined &&
      value.length >= 0 &&
      value.length <= Number.MAX_SAFE_INTEGER
    );
  },
  isArrayLikeObject: function (value) {
    return (
      typeof value === "object" &&
      value.length !== undefined &&
      value.length >= 0 &&
      value.length <= Number.MAX_SAFE_INTEGER
    );
  },
  isBoolean: function (value) {
    if (value === null || value === undefined) return false;
    return value.constructor === Boolean;
  },
  isBuffer: function (value) {},
  isDate: function (value) {
    if (!value) return false;
    return value.constructor === Date;
  },
  isElement: function (value) {
    if (!value) return false;
    return value.constructor === HTMLBodyElement;
  },
  isEmpty: function (value) {
    if (typeof value !== "object") {
      return true;
    } else if (value === null) {
      return true;
    } else if (value instanceof Array) {
      return value.length === 0;
    } else {
      if (this.isArrayLike(value)) {
        return value.length === 0;
      } else {
        var count = 0;
        for (var key in value) {
          if (value.hasOwnProperty(key)) {
            count++;
          }
        }
        return count === 0;
      }
    }
  },
  isEqual: function (value, other) {
    if (value instanceof Array && other instanceof Array) {
      if (value.length !== other.length) return false;
      var result = true;
      for (let i = 0; i < value.length; i++) {
        result = result && this.isEqual(value[i], other[i]);
        if (result === false) break;
      }
      return result;
    } else if (typeof value === "object" && typeof other === "object") {
      var count1 = 0;
      var count2 = 0;
      for (var key in value) {
        count1++;
      }
      for (var key in other) {
        count2++;
      }
      if (count2 !== count1) return false;

      for (var key in value) {
        if (!this.isEqual(value[key], other[key])) {
          return false;
        }
      }
      return true;
    } else {
      return value === other;
    }
  },
  isEqualWith: function (value, other, customizer) {
    if (value instanceof Array && other instanceof Array) {
      if (value.length !== other.length) return false;
      var result = true;
      result = result && this.isEqualWith(value[0], other[0], customizer);
      // if(result===false)break;
      return result;
    } else if (typeof value === "object" && typeof other === "object") {
      var count1 = 0;
      var count2 = 0;
      for (var key in value) {
        count1++;
      }
      for (var key in other) {
        count2++;
      }
      if (count2 !== count1) return false;

      for (var key in value) {
        if (!this.isEqualWith(value[key], other[key], customizer)) {
          return false;
        }
      }
      return true;
    } else {
      if (customizer(value, other)) {
        return true;
      } else {
        return false;
      }
    }
  },
  isError: function (value) {
    return value instanceof Error;
  },
  isFinite: function (value) {
    return typeof value === "number" && isFinite(value);
  },
  isFunction: function (value) {
    return typeof value === "function";
  },
  isInteger: function (value) {
    return (
      typeof value === "number" && isFinite(value) && parseInt(value) === value
    );
  },
  isLength: function (value) {
    return this.isInteger(value) && value >= 0;
  },
  isMap: function (value) {
    return value instanceof Map;
  },
  isMatch: function (object, source) {
    for (var key in source) {
      if (typeof source[key] !== "object") {
        if (source[key] !== object[key]) {
          return false;
        }
      } else {
        if (!this.isMatch(source[key], object[key])) {
          return false;
        }
      }
    }
    return true;
  },
  isMatchWith: function (object, source, customizer) {
    for (var key in source) {
      if (!customizer(source[key], object[key])) {
        return false;
      }
    }
    return true;
  },
  isNaN: function (value) {
    if (value === null || value === undefined) return false;
    return value.constructor === Number && !(value === value);
  },
  isNative: function (value) {},
  isNil: function (value) {
    return value === null || value === undefined;
  },
  isNull: function (value) {
    return value === null;
  },
  isNumber: function (value) {
    return typeof value === "number";
  },
  isObject: function (value) {
    return (
      (typeof value === "object" || typeof value === "function") &&
      value !== null
    );
  },
  isObjectLike: function (value) {
    return typeof value === "object" && value !== null;
  },
  isPlainObject: function (value) {
    return value.constructor === Object;
  },
  isRegExp: function (value) {
    return value instanceof RegExp;
  },
  isSafeInteger: function (value) {
    return this.isInteger(value) && Number.isSafeInteger(value);
  },
  isSet: function (value) {
    return value instanceof Set;
  },
  isString: function (value) {
    return typeof value === "string";
  },
  isSymbol: function (value) {
    return typeof value === "symbol";
  },
  isTypedArray: function (value) {
    return (
      value instanceof Uint16Array ||
      value instanceof Uint32Array ||
      value instanceof Uint8Array ||
      value instanceof Uint8ClampedArray
    );
  },
  isUndefined: function (value) {
    return value === undefined;
  },
  isWeakMap: function (value) {
    return value instanceof WeakMap;
  },
  isWeakSet: function (value) {
    return value instanceof WeakSet;
  },
  lt: function (value, other) {
    return Number(value) < Number(other);
  },
  lte: function (value, other) {
    return Number(value) <= Number(other);
  },
  toArray: function (value) {
    if (value === null) return [];
    if (typeof value !== "object" && typeof value !== "string") return [];
    if (value instanceof Array) {
      return value;
    }
    if (this.isArrayLike(value) || typeof value === "string") {
      var result = [];
      for (let i = 0; i < value.length; i++) {
        result[i] = value[i];
      }
      return result;
    }
    var result = [];
    for (var key in value) {
      result.push(value[key]);
    }
    return result;
  },
  toFinite: function (value) {
    var r = Number(value);
    if (this.isFinite(r)) {
      return r;
    } else {
      if (Number.isNaN(r)) {
        return 0;
      } else if (r === Infinity) {
        return Number.MAX_VALUE;
      } else {
        return Number.MIN_VALUE;
      }
    }
  },
  toInteger: function (value) {
    value = Number(value);
    if (isNaN(value)) return 0;
    if (value === Number.MIN_VALUE) return 0;
    if (value === Number.MAX_VALUE || value === Infinity)
      return Number.MAX_VALUE;
    if (value === -Infinity) return Number.MIN_VALUE;
    return parseInt(value);
  },
  toLength: function (value) {
    value = Number(value);
    if (isNaN(value)) return 0;
    if (value < 0) return 0;
    if (value > 2 ** 32) return 2 ** 32;
    if (value === Number.MIN_VALUE) return 0;
    return parseInt(value);
  },
  toNumber: function (value) {
    return typeof value === "number" ? value : Number(value);
  },
  toPlainObject: function (value) {
    var result = {};
    for (var key in value) {
      result[key] = value[key];
    }
    return result;
  },
  toSafeInteger: function (value) {
    var r = this.toInteger(value);
    if (r > Number.MAX_SAFE_INTEGER) {
      return Number.MAX_SAFE_INTEGER;
    } else if (r < Number.MIN_SAFE_INTEGER) {
      return Number.MIN_SAFE_INTEGER;
    } else {
      return r;
    }
  },
  toString: function (value) {
    if (value === null || value === undefined) return "";
    //如何区分 0和 -0
    if (1 / value === -Infinity) return "-0";
    return String(value);
  },
  add: function (augend, addend) {
    return augend + addend;
  },
  ceil: function (number, precision = 0) {
    // 判断有无小数
    var ans = Math.pow(10, precision);
    if (number * ans === parseInt(number * ans)) {
      return number;
    } else {
      return parseInt(number * ans + 1) / ans;
    }
  },
  divide: function (dividend, divisor) {
    if (dividend == 0 && divisor == 0) return NaN;
    if (dividend == 0) return 0;
    if (divisor == 0) return Infinity;
    return dividend / divisor;
  },
  floor: function (number, precision = 0) {
    var ans = Math.pow(10, precision);
    return parseInt(number * ans) / ans;
  },
  max: function (array) {
    var len = array.length;
    if (len == 0) return undefined;
    var max = -Infinity;
    for (let i = 0; i < len; i++) {
      if (array[i] > max) {
        max = array[i];
      }
    }
    return max;
  },
  maxBy: function (array, iteratee) {
    var len = array.length;
    if (len == 0) return undefined;
    var max = array[0];
    for (let i = 1; i < array.length; i++) {
      if (typeof iteratee === "function") {
        if (iteratee(max) < iteratee(array[i])) {
          max = array[i];
        }
      } else if (typeof iteratee === "string") {
        if (max[iteratee] < array[i][iteratee]) {
          max = array[i];
        }
      }
    }
    return max;
  },
  mean: function (array) {
    var len = array.length;
    if (len == 0) return 0;
    var sum = 0;
    for (let i = 0; i < len; i++) {
      sum += array[i];
    }
    return sum / len;
  },
  meanBy: function (array, iteratee) {
    if (array.length == 0) return NaN;
    if (typeof iteratee === "function") {
      var sum = iteratee(array[0]);
      var count = 1;
      for (let i = 1; i < array.length; i++) {
        sum += iteratee(array[i]);
        count++;
      }
      return sum / count;
    } else if (typeof iteratee === "string") {
      var sum = array[0][iteratee];
      var count = 1;
      for (let i = 1; i < array.length; i++) {
        sum += array[i][iteratee];
        count++;
      }
      return sum / count;
    }
  },
  minBy: function (array, iteratee) {
    var len = array.length;
    if (len == 0) return undefined;
    var min = array[0];
    for (let i = 1; i < array.length; i++) {
      if (typeof iteratee === "function") {
        if (iteratee(min) > iteratee(array[i])) {
          min = array[i];
        }
      } else if (typeof iteratee === "string") {
        if (min[iteratee] > array[i][iteratee]) {
          min = array[i];
        }
      }
    }
    return min;
  },
  min: function (array) {
    var min = Infinity;
    var len = array.length;
    if (len == 0) return undefined;
    for (let i = 0; i < len; i++) {
      if (array[i] < min) {
        min = array[i];
      }
    }
    return min;
  },
  multiply: function (multiplier, multiplicand) {
    return multiplier * multiplicand;
  },
  round: function (number, precision = 0) {
    var ans = Math.pow(10, precision + 1);
    var temp = parseInt(number * ans);
    if (temp % 10 >= 5) {
      temp = temp - (temp % 10) + 10;
    } else {
      temp = temp - (temp % 10);
    }
    return temp / ans;
  },
  subtract: function (minuend, subtrahend) {
    return minuend - subtrahend;
  },
  sum: function (array) {
    var sum = 0;
    var len = array.length;
    for (let i = 0; i < len; i++) {
      sum += array[i];
    }
    return sum;
  },
  sumBy: function (array, iteratee) {
    var sum = 0;
    var len = array.length;
    for (let i = 0; i < len; i++) {
      if (typeof iteratee === "function") {
        sum += iteratee(array[i]);
      } else if (typeof iteratee === "string") {
        sum += array[i][iteratee];
      }
    }
    return sum;
  },
  clamp: function (number, lower, upper) {
    if (number > upper) return upper;
    if (number < lower) return lower;
    return number;
  },
  inRange: function (number, start = 0, end) {
    if (arguments.length == 2) {
      (start = 0), (end = arguments[1]);
    }
    if (end < start) {
      var temp = end;
      end = start;
      start = temp;
    }
    return number >= start && number < end;
  },
  random: function (lower = 0, upper = 1, floating) {
    if (arguments.length == 1) {
      if (typeof arguments[0] === "boolean") {
        floating = arguments[0];
        lower = 0;
        upper = 1;
      }
    } else if (arguments.length === 2) {
      if (typeof arguments[1] === "boolean") {
        floating = arguments[1];
        lower = 0;
        upper = arguments[0];
      } else {
        lower = arguments[0];
        upper = arguments[1];
      }
    }
    if (floating) {
      return lower + Math.random() * (upper - lower);
    } else {
      if (this.isInteger(lower) && this.isInteger(upper)) {
        return parseInt(lower + Math.random() * (upper - lower));
      } else {
        return lower + Math.random() * (upper - lower);
      }
    }
  },
  assign: function (object, sources) {
    var len = arguments.length;
    for (let i = 1; i < len; i++) {
      for (key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          object[key] = arguments[i][key];
        }
      }
    }
    return object;
  },
  assignIn: function (object, sources) {
    for (let i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        object[key] = arguments[i][key];
      }
    }
    return object;
  },
  assignInWith: function (object, sources, customizer) {
    var customizer = arguments[arguments.length - 1];
    if (typeof customizer === "function") {
      for (let i = 1; i < arguments.length - 1; i++) {
        for (var key in arguments[i]) {
          object[key] = customizer(object[key], arguments[i][key]);
        }
      }
      return object;
    } else {
      return this.assignIn(...arguments);
    }
  },
  assignWith: function (object, sources, customizer) {
    var customizer = arguments[arguments.length - 1];
    if (typeof customizer === "function") {
      for (let i = 1; i < arguments.length - 1; i++) {
        for (var key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) {
            object[key] = customizer(object[key], arguments[i][key]);
          }
        }
      }
      return object;
    } else {
      return this.assign(...arguments);
    }
  },
  at: function (object, path) {
    if (object.length == 0 || path.length == 0) return [];
    var result = [];
    if (typeof path === "string") {
      path = [path];
    }

    var arr = []; // 此时会因为]的匹配多出一个''
    for (let i = 0; i < path.length; i++) {
      var temp = path[i].split(/[\[\].]+/);
      arr.push(temp.slice());
    }
    for (let i = 0; i < arr.length; i++) {
      let item = object;
      for (let j = 0; j < arr[i].length; j++) {
        if (item === undefined) break;
        if (arr[i][j] == "") continue;
        item = item[arr[i][j]];
      }
      if (item !== undefined) {
        result.push(item);
      }
    }
    return result;
  },
  create: function (prototype, properties) {
    var res = {};
    res.__proto__ = prototype;
    for (var key in properties) {
      if (properties.hasOwnProperty(key)) {
        res[key] = properties[key];
      }
    }
    return res;
  },
  defaults: function (object, sources) {
    var len = arguments.length;
    if (len == 1) return object;
    for (let i = 1; i < arguments.length; i++) {
      for (key in arguments[i]) {
        if (object[key] === undefined) {
          object[key] = arguments[i][key];
        }
      }
    }
    return object;
  },
  defaultsDeep: function (object, sources) {},
  toPairs: function (object) {
    var res = [];
    if (object instanceof Set) {
      object.forEach((item, idx, set) => {
        res.push([item, item]);
      });
    } else if (object instanceof Map) {
      object.forEach((value, key, map) => {
        res.push([key, value]);
      });
    } else {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          res.push([key, object[key]]);
        }
      }
    }
    return res;
  },
  toPairsIn: function (object) {
    var res = [];
    if (object instanceof Set) {
      object.forEach((item, idx, set) => {
        res.push([item, item]);
      });
    } else if (object instanceof Map) {
      object.forEach((value, key, map) => {
        res.push([key, value]);
      });
    } else {
      for (var key in object) {
        res.push([key, object[key]]);
      }
    }
    return res;
  },
  findKey: function (object, predicate) {
    for (var key in object) {
      if (typeof predicate === "function") {
        if (predicate(object[key])) {
          return key;
        }
      } else if (predicate instanceof Array) {
        if (object[key][predicate[0]] === predicate[1]) {
          return key;
        }
      } else if (typeof predicate === "object") {
        var flag = true;
        for (var i in predicate) {
          if (predicate[i] !== object[key][i]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          return key;
        }
      } else {
        if (object[key][predicate]) {
          return key;
        }
      }
    }
    return undefined;
  },
  findLastKey: function (object, predicate) {
    for (var key in object) {
      if (typeof predicate === "function") {
        if (predicate(object[key])) {
          var res = key;
        }
      } else if (predicate instanceof Array) {
        if (object[key][predicate[0]] === predicate[1]) {
          var res = key;
        }
      } else if (typeof predicate === "object") {
        var flag = true;
        for (var i in predicate) {
          if (predicate[i] !== object[key][i]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          var res = key;
        }
      } else {
        if (object[key][predicate]) {
          var res = key;
        }
      }
    }
    return res;
  },
  forIn: function (object, iteratee) {
    for (var key in object) {
      if (iteratee(object[key], key) === false) {
        break;
      }
    }
    return object;
  },
  forInRight: function (object, iteratee) {
    var res = [];
    for (var key in object) {
      res.push([key, object[key]]);
    }
    for (let i = res.length - 1; i >= 0; i--) {
      if (iteratee(res[i][1], res[i][0]) === false) break;
    }
    return object;
  },
  forOwn: function (object, iteratee) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (iteratee(object[key], key) === false) {
          break;
        }
      }
    }
    return object;
  },
  forOwnRight: function (object, iteratee) {
    var res = [];
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        res.push([key, object[key]]);
      }
    }
    for (let i = res.length - 1; i >= 0; i--) {
      if (iteratee(res[i][1], res[i][0]) === false) break;
    }
    return object;
  },
  functions: function (object) {
    var result = [];
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        result.push(key);
      }
    }
    return result;
  },
  functionsIn: function (object) {
    var result = [];
    for (var key in object) {
      result.push(key);
    }
    return result;
  },
  get: function (object, path, defaultValue) {
    if (typeof path === "string") {
      var arr = path.split(/[\[\].]+/);
    } else {
      var arr = path;
    }
    var item = object;
    for (let i = 0; i < arr.length; i++) {
      if (item === undefined) return defaultValue;
      item = item[arr[i]];
    }
    if (item === undefined) {
      return defaultValue;
    } else {
      return item;
    }
  },
  set: function (object, path, value) {
    if (typeof path === "string") {
      var arr = path.split(/[\[\].]+/);
    } else {
      var arr = path;
    }

    var item = object;
    for (let i = 0; i < arr.length - 1; i++) {
      if (item[arr[i]]) {
        item = item[arr[i]];
      } else {
        // 需要加的是一个数组
        if (isNaN(arr[i + 1])) {
          item[arr[i]] = {};
        } else {
          item[arr[i]] = [];
        }
        item = item[arr[i]];
      }
    }
    item[arr[arr.length - 1]] = value;
    return object;
  },
  has: function (object, path) {
    // 直接属性   需要使用hasOwnProperty
    if (typeof path === "string") {
      var arr = path.split(/[\[\].]+/);
    } else {
      var arr = path;
    }

    var item = object;
    for (let i = 0; i < arr.length; i++) {
      if (item.hasOwnProperty(arr[i])) {
        item = item[arr[i]];
      } else {
        return false;
      }
    }
    return true;
  },
  hasIn: function (object, path) {
    //  直接属性和继承属性
    if (typeof path === "string") {
      var arr = path.split(/[\[\].]+/);
    } else {
      var arr = path;
    }

    var item = object;
    for (let i = 0; i < arr.length; i++) {
      if (item == undefined) return false;
      item = item[arr[i]];
    }
    if (item === undefined) {
      return false;
    }
    return true;
  },
  invert: function (object) {
    for (key in object) {
      object[object[key]] = key;
      delete object[key];
    }
    return object;
  },
  keys: function (object) {
    var result = [];
    for (key in Object(object)) {
      if (object.hasOwnProperty(key)) {
        result.push(key);
      }
    }
    return result;
  },
  keysIn: function (object) {
    var result = [];
    for (key in Object(object)) {
      result.push(key);
    }
    return result;
  },
  mapKeys: function (object, iteratee) {
    var res = {};
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof iteratee === "function") {
          res[iteratee(object[key], key)] = object[key];
        } else {
          res[object[key][iteratee]] = object[key];
        }
      }
    }
    return res;
  },
  mapValues: function (object, iteratee) {
    var res = {};
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof iteratee === "function") {
          res[key] = iteratee(object[key], key);
        } else {
          res[key] = object[key][iteratee];
        }
      }
    }
    return res;
  },
  merge: function (object, sources) {},
  mergeWith: function (object, sources) {},
  omit: function (object, props) {
    for (let i = 0; i < props.length; i++) {
      if (object[props[i]] !== undefined) {
        delete object[props[i]];
      }
    }
    return object;
  },
  omitBy: function (object, predicate) {
    var res = {};
    for (var key in object) {
      if (!predicate(object[key], key)) {
        res[key] = object[key];
      }
    }
    return res;
  },
  pick: function (object, props) {
    var result = {};
    for (let i = 0; i < props.length; i++) {
      if (object[props[i]] !== undefined) {
        result[props[i]] = object[props[i]];
      }
    }
    return result;
  },
  pickBy: function (object, predicate) {
    var res = {};
    for (var key in object) {
      if (predicate(object[key], key)) {
        res[key] = object[key];
      }
    }
    return res;
  },
  result: function (object, path, defaultValue) {
    if (typeof path === "string") {
      path = path.split(/[\[\].]+/);
    }
    for (let i = 0; i < path.length; i++) {
      object = object[path[i]];
      if (object === undefined) break;
    }
    if (object === undefined) {
      if (typeof defaultValue === "function") {
        return defaultValue();
      } else {
        return defaultValue;
      }
    }
    if (typeof object === "function") {
      return object();
    } else {
      return object;
    }
  },
  setWith: function (object, path, value, customizer) {
    if (typeof path === "string") {
      arr = path.split(/[\[\].]+/);
    } else {
      arr = path;
    }
    var idx = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "") continue;
      arr[idx++] = arr[i];
    }
    arr.length = idx;

    var item = object;
    for (let i = 0; i < arr.length - 1; i++) {
      if (item[arr[i]]) {
        item = item[arr[i]];
      } else {
        // 需要加的是一个数组
        if (isNaN(arr[i + 1])) {
          item[arr[i]] = {};
        } else {
          item[arr[i]] = {};
        }
        item = item[arr[i]];
      }
    }
    item[arr[arr.length - 1]] = customizer(value, arr[arr.length - 1], item);
    return object;
  },
  transform: function (object, iteratee, accumulator) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (iteratee(accumulator, object[key], key, object) === false) break;
      }
    }
    return accumulator;
  },
  unset: function (object, path) {
    if (typeof path === "string") {
      path = path.split(/[\[\].]+/);
    }
    for (let i = 0; i < path.length; i++) {
      object = object[path[i]];
      if (object === undefined) return false;
    }
    delete object;
    return true;
  },
  update: function (object, path, updater) {
    if (typeof path === "string") {
      var arr = path.split(/[\[\].]+/);
    } else {
      var arr = path;
    }

    var item = object;
    for (let i = 0; i < arr.length - 1; i++) {
      if (item[arr[i]]) {
        item = item[arr[i]];
      } else {
        // 需要加的是一个数组
        if (isNaN(arr[i + 1])) {
          item[arr[i]] = {};
        } else {
          item[arr[i]] = [];
        }
        item = item[arr[i]];
      }
    }
    item[arr[arr.length - 1]] = updater(item[arr[arr.length - 1]]);
    return object;
  },
  updateWith: function (object, path, updater, customizer) {
    if (customizer(path) === undefined) {
      path = customizer;
    } else {
      path = customizer(path);
    }

    if (typeof path === "string") {
      var arr = path.split(/[\[\].]+/);
    } else {
      var arr = path;
    }
    var idx = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "") continue;
      arr[idx++] = arr[i];
    }
    arr.length = idx;

    var item = object;
    for (let i = 0; i < arr.length - 1; i++) {
      if (item[arr[i]]) {
        item = item[arr[i]];
      } else {
        // 需要加的是一个数组
        if (isNaN(arr[i + 1])) {
          item[arr[i]] = {};
        } else {
          item[arr[i]] = [];
        }
        item = item[arr[i]];
      }
    }
    item[arr[arr.length - 1]] = updater(item[arr[arr.length - 1]]);
    return object;
  },
  values: function (object) {
    var result = [];
    if (object instanceof Object) {
      for (key in object) {
        if (object.hasOwnProperty(key)) {
          result.push(object[key]);
        }
      }
    } else {
      object = Object(object);
      for (key in object) {
        result.push(object[key]);
      }
    }
    return result;
  },
  valuesIn: function (object) {
    var result = [];
    if (object instanceof Object) {
      for (key in object) {
        result.push(object[key]);
      }
    } else {
      object = Object(object);
      for (key in object) {
        result.push(object[key]);
      }
    }
    return result;
  },
  camelCase: function (string = "") {
    // 标记是否在寻找单词头
    var flag = true;
    // 标记开头部分是否
    var result = "";
    for (let i = 0; i < string.length; i++) {
      var code = string.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        if (flag) {
          result += string[i];
          flag = false;
        } else {
          result += String.fromCharCode(code + 32);
        }
      } else if (code >= 97 && code <= 122) {
        if (flag) {
          result += String.fromCharCode(code - 32);
          flag = false;
        } else {
          result += string[i];
        }
      } else {
        flag = true;
      }
    }
    if (result.length == 0) return result;
    var res = "";
    res += String.fromCharCode(result.charCodeAt(0) + 32);
    for (let i = 1; i < result.length; i++) {
      res += result[i];
    }
    return res;
  },
  capitalize: function (string = "") {
    var result = "";
    var len = string.length;
    for (let i = 0; i < len; i++) {
      var code = string.charCodeAt(i);
      if (i == 0 && code >= 65 && code <= 90) {
        result += string[i];
      } else if (i == 0 && code >= 97 && code <= 122) {
        result += String.fromCharCode(code - 32);
      } else if (code >= 65 && code <= 90) {
        result += String.fromCharCode(code + 32);
      } else if (code >= 97 && code <= 122) {
        result += string[i];
      } else {
        result += string[i];
      }
    }
    return result;
  },
  deburr: function (string = "") {},
  endsWith: function (string = "", target, position = string.length) {
    var slen = string.length;
    var tlen = target.length;
    if (slen == 0 || tlen > slen) return false;
    if (tlen == 0) return true;
    var start = position - tlen;
    if (start < 0) return false;
    for (let i = start; i < position; i++) {
      if (string[i] !== target[i - start]) {
        return false;
      }
    }
    return true;
  },
  escape: function (string = "") {
    string = string.replace("&", "&amp;");
    string = string.replace(">", "&lt;");
    string = string.replace("<", "&gt;");
    string = string.replace('"', "&quot;");
    string = string.replace("'", "&apos;");
    return string;
  },
  escapeRegExp: function (string = "") {
    function replacer(match, p1, p2, p3, offset, string) {
      // p1 is nondigits, p2 digits, and p3 non-alphanumerics
      return "\\" + match;
    }

    return string.replace(/[\^\$\.\*\+\?\(\)\[\]\{\}\|]/g, replacer);
    // var res ='';
    // for(let i=0;i<string.length;i++){
    //     var s = string[i];
    //     if(s==="^"||s==="$"||s==="."||s==="*"||s==="+"||s==="?"||s==="("||s===")"||s==="["||s==="]"||s==="{"||s==="}"||s==="|"){
    //         res += '\\';
    //     }
    //     res += s;
    // }
    // return res;
  },
  kebabCase: function (string = "") {
    // 小写转大写 加 '-'
    // 大小写字母后跟非字母 加一个 '-'
    var result = "";
    for (let i = 0; i < string.length - 1; i++) {
      var code = string.charCodeAt(i);
      var NextCode = string.charCodeAt(i + 1);
      if (code >= 65 && code <= 90) {
        result += String.fromCharCode(code + 32);
        if (
          NextCode < 65 ||
          NextCode > 122 ||
          (NextCode > 90 && NextCode < 97)
        ) {
          result += "-";
        }
      } else if (code >= 97 && code <= 122) {
        result += string[i];
        if (NextCode < 97 || NextCode > 122) {
          result += "-";
        }
      }
    }
    var res = "";
    // 判断有没有多加'-'
    if (result[result.length - 1] === "-") {
      for (let i = 0; i < result.length - 1; i++) {
        res += result[i];
      }
      result = res;
    }

    var lastCode = string.charCodeAt(string.length - 1);
    if (lastCode >= 97 && lastCode <= 122) {
      result += string[string.length - 1];
    } else if (lastCode >= 65 && lastCode <= 90) {
      result += String.fromCharCode(lastCode + 32);
    }
    return result;
  },
  lowerCase: function (string = "") {
    var result = "";
    for (let i = 0; i < string.length - 1; i++) {
      var code = string.charCodeAt(i);
      var NextCode = string.charCodeAt(i + 1);
      if (code >= 65 && code <= 90) {
        result += String.fromCharCode(code + 32);
        if (
          NextCode < 65 ||
          NextCode > 122 ||
          (NextCode > 90 && NextCode < 97)
        ) {
          result += " ";
        }
      } else if (code >= 97 && code <= 122) {
        result += string[i];
        if (NextCode < 97 || NextCode > 122) {
          result += " ";
        }
      }
    }
    var res = "";
    // 判断有没有多加'-'
    if (result[result.length - 1] === " ") {
      for (let i = 0; i < result.length - 1; i++) {
        res += result[i];
      }
      result = res;
    }

    var lastCode = string.charCodeAt(string.length - 1);
    if (lastCode >= 97 && lastCode <= 122) {
      result += string[string.length - 1];
    } else if (lastCode >= 65 && lastCode <= 90) {
      result += String.fromCharCode(lastCode + 32);
    }
    return result;
  },
  lowerFirst: function (string = "") {
    var result = "";
    for (let i = 0; i < string.length; i++) {
      var code = string.charCodeAt(i);
      if (i == 0 && code >= 65 && code <= 90) {
        result += String.fromCharCode(code + 32);
      } else {
        result += string[i];
      }
    }
    return result;
  },
  pad: function (string = "", length = 0, chars = " ") {
    var slen = string.length;
    console.log(slen, length);
    if (slen >= length) return string;

    var addlen = length - slen;
    var clen = chars.length;
    var Count = parseInt(addlen / clen); //能添加的总条数
    var les = addlen % clen; // 多余的
    // 根据Count的奇偶确定les加的位置
    if (Count % 2 == 0) {
      var leftCount = Count / 2;
      var rightCount = Count / 2;
      var rles = les;
    } else {
      var leftCount = Math.floor(Count / 2) + les;
      var rightCount = Math.ceil(Count / 2);
      var lles = les;
    }
    var ladd = "";
    for (let i = 0; i < leftCount; i++) {
      ladd += chars;
    }
    if (lles !== undefined) {
      for (let i = 0; i < lles; i++) {
        ladd += chars[i];
      }
    }
    var radd = "";
    for (let i = 0; i < rightCount; i++) {
      radd += chars;
    }
    if (rles !== undefined) {
      for (let i = 0; i < rles; i++) {
        radd += chars[i];
      }
    }
    return ladd + string + radd;
  },
  padEnd: function (string = "", length = 0, chars = " ") {
    // [string=''] (string): 要填充的字符串。
    // [length=0] (number): 填充的长度。
    // [chars=' '] (string): 填充字符。
    var slen = string.length;
    if (length <= slen) {
      return string;
    }
    var addlen = length - slen;
    var clen = chars.length;
    // 填充的位会影响chars是否完整
    var size = parseInt(addlen / clen);
    var les = addlen % clen;
    var add = "";
    for (let i = 0; i < size; i++) {
      add += chars;
    }
    for (let i = 0; i < les; i++) {
      add += chars[i];
    }
    string = string + add;
    return string;
  },
  padStart: function (string = "", length = 0, chars = " ") {
    // [string=''] (string): 要填充的字符串。
    // [length=0] (number): 填充的长度。
    // [chars=' '] (string): 填充字符。
    var slen = string.length;
    if (length <= slen) {
      return string;
    }
    var addlen = length - slen;
    var clen = chars.length;
    // 填充的位会影响chars是否完整
    var size = parseInt(addlen / clen);
    var les = addlen % clen;

    console.log(slen, clen, addlen, size, les);
    var add = "";
    for (let i = 0; i < size; i++) {
      add += chars;
    }
    for (let i = 0; i < les; i++) {
      add += chars[i];
    }
    string = add + string;
    return string;
  },
  parseInt: function (string, radix = 10) {
    var result = 0;
    var len = string.length;
    for (let i = len - 1; i >= 0; i--) {
      result += Number(string[i]) * Math.pow(10, len - 1 - i);
    }
    return result;
  },
  repeat: function (string = "", n = 1) {
    var result = "";
    for (let i = 0; i < n; i++) {
      result += string;
    }
    return result;
  },
  replace: function (string = "", pattern, replacement) {
    // [string=''] (string): 待替换的字符串。
    // pattern (RegExp|string): 要匹配的内容。
    // replacement (Function|string): 替换的内容。
    var result = "";
    // 字符串
    if (typeof pattern === "string") {
      var slen = string.length;
      var plen = pattern.length;
      if (plen > slen) return string;
      for (let i = 0; i <= slen - plen; i++) {
        var idx = 0;
        var flag = true;
        if (string[i] === pattern[idx]) {
          while (idx < plen && flag) {
            if (string[i + idx] === pattern[idx]) {
              idx++;
            } else {
              flag = false;
            }
          }
          if (flag) {
            if (typeof replacement === "function") {
              var temp = "";
              for (let j = i; j < i + plen; j++) {
                temp += string[j];
              }
              result += replacement(temp);
            } else {
              result += replacement;
            }
            i = i + plen;
          } else {
            result += string[i];
          }
        } else {
          result += string[i];
        }
      }
    } else {
      // 正则
    }
    return result;
  },
  snakeCase: function (string = "") {
    var result = "";
    for (let i = 0; i < string.length - 1; i++) {
      var code = string.charCodeAt(i);
      var NextCode = string.charCodeAt(i + 1);
      if (code >= 65 && code <= 90) {
        result += String.fromCharCode(code + 32);
        if (
          NextCode < 65 ||
          NextCode > 122 ||
          (NextCode > 90 && NextCode < 97)
        ) {
          result += "_";
        }
      } else if (code >= 97 && code <= 122) {
        result += string[i];
        if (NextCode < 97 || NextCode > 122) {
          result += "_";
        }
      }
    }
    var res = "";
    // 判断有没有多加'_'
    if (result[result.length - 1] === "_") {
      for (let i = 0; i < result.length - 1; i++) {
        res += result[i];
      }
      result = res;
    }

    var lastCode = string.charCodeAt(string.length - 1);
    if (lastCode >= 97 && lastCode <= 122) {
      result += string[string.length - 1];
    } else if (lastCode >= 65 && lastCode <= 90) {
      result += String.fromCharCode(lastCode + 32);
    }
    return result;
  },
  split: function (string = "", separator, limit) {
    if (separator.length == 0) {
      var res = [];
      for (let i = 0; i < string.length; i++) {
        res[i] = string[i];
      }
      return res;
    }

    var res = [];
    var temp = "";
    for (let i = 0; i < string.length - separator.length; i++) {
      if (res.length >= limit) {
        break;
      }
      if (string[i] === separator[0]) {
        var idx = 0;
        var flag = true;
        while (idx < separator.length && flag) {
          if (string[i + idx] === separator[idx]) {
            idx++;
          } else {
            flag = false;
          }
        }
        if (flag) {
          res.push(temp);
          temp = "";
        }
      } else {
        temp += string[i];
      }
    }
    return res;
  },
  startCase: function (string = "") {
    // 标记字符结束  小写或大写转非字母    小写转大写
    // 标记字符开始   非字符转 大小写 或者   小写转大写
    var res = "";
    var flag = true; //标记字符开始
    for (let i = 0; i < string.length - 1; i++) {
      var code = string.charCodeAt(i);
      var nextCode = string.charCodeAt(i + 1);
      // 大写
      if (code >= 65 && code < 90) {
        res += string[i];
        //大写后跟非字符
        if (
          nextCode < 65 ||
          nextCode > 122 ||
          (nextCode > 90 && nextCode < 97)
        ) {
          res += " ";
        }
        flag = false;
      } else if (code >= 97 && code <= 122) {
        if (flag) {
          res += String.fromCharCode(code - 32);
        } else {
          res += string[i];
        }
        if (nextCode < 97 || nextCode > 122) {
          res += " ";
        }
        flag = false;
      } else {
        flag = true;
      }
    }

    var lastCode = string.charCodeAt(string.length - 1);
    if (
      (lastCode >= 65 && lastCode <= 90) ||
      (lastCode >= 97 && lastCode <= 122)
    ) {
      res += string[string.length - 1];
    }
    return res.trim();
  },
  startsWith: function (string = "", target, position = 0) {
    return string[position] === target;
  },
  template: function (tplStr = "", options = {}) {
    var tplParts = tplStr.split(/(<%=|<%|%>)/);
    var funcSource = `
            var result = [];
            with(data){
        `;
    for (let i = 0; i < tplParts.length; i++) {
      var part = tplParts[i];
      if (part === "<%=") {
        funcSource += "result.push(" + tplParts[++i] + ")";
      } else if (part === "<%") {
        funcSource += tplParts[++i];
      } else if (part === "%>") {
      } else {
        funcSource += "result.push(`" + part + "`)";
      }
      funcSource += "}\n";
      funcSource += 'return result.join("")';
      return new Function("data", funcSource);
    }
  },
  toLower: function (string = "") {
    var res = "";
    for (let i = 0; i < string.length; i++) {
      var code = string.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        code = code + 32;
        res += String.fromCharCode(code);
      } else {
        res += string[i];
      }
    }
    return res;
  },
  toUpper: function (string = "") {
    var res = "";
    for (let i = 0; i < string.length; i++) {
      var code = string.charCodeAt(i);
      if (code >= 97 && code <= 122) {
        code = code - 32;
        res += String.fromCharCode(code);
      } else {
        res += string[i];
      }
    }
    return res;
  },
  trim: function (string = "", chars) {
    if (chars === undefined) {
      return this.trim(this.trim(string, " "), String.fromCharCode(160));
    }
    return this.trimEnd(this.trimStart(string, chars), chars);
  },
  trimEnd: function (string = "", chars) {
    var result = "";
    var right;
    if (chars === undefined) {
      return this.trimEnd(this.trimEnd(string, " "), String.fromCharCode(160));
    }
    for (let i = string.length - 1; i >= 0; i--) {
      var flag = false;
      for (let j = 0; j < chars.length; j++) {
        if (string[i] === chars[j]) {
          flag = true;
        }
      }
      if (!flag) {
        right = i;
        break;
      }
    }
    for (let i = 0; i <= right; i++) {
      result += string[i];
    }
    return result;
  },
  trimStart: function (string = "", chars) {
    var result = "";
    var left;
    if (chars === undefined) {
      return this.trimStart(
        this.trimStart(string, " "),
        String.fromCharCode(160)
      );
    }
    for (let i = 0; i < string.length; i++) {
      var flag = false;
      for (let j = 0; j < chars.length; j++) {
        if (string[i] === chars[j]) {
          flag = true;
        }
      }
      if (!flag) {
        left = i;
        break;
      }
    }
    for (let i = left; i < string.length; i++) {
      result += string[i];
    }
    return result;
  },
  truncate: function (string = "", options = {}) {},
  unescape: function (string = "") {
    string = string.replace("&amp;", "&");
    string = string.replace("&lt;", ">");
    string = string.replace("&gt;", "<");
    string = string.replace("&quot;", '"');
    string = string.replace("&apos;", "'");
    return string;
  },
  upperCase: function (string = "") {
    var result = "";
    for (let i = 0; i < string.length - 1; i++) {
      var code = string.charCodeAt(i);
      var NextCode = string.charCodeAt(i + 1);
      if (code >= 65 && code <= 90) {
        result += string[i];
        if (
          NextCode < 65 ||
          NextCode > 122 ||
          (NextCode > 90 && NextCode < 97)
        ) {
          result += " ";
        }
      } else if (code >= 97 && code <= 122) {
        result += String.fromCharCode(code - 32);
        if (NextCode < 97 || NextCode > 122) {
          result += " ";
        }
      }
    }
    var res = "";
    // 判断有没有多加'-'
    if (result[result.length - 1] === " ") {
      for (let i = 0; i < result.length - 1; i++) {
        res += result[i];
      }
      result = res;
    }

    var lastCode = string.charCodeAt(string.length - 1);
    if (lastCode >= 97 && lastCode <= 122) {
      result += String.fromCharCode(lastCode - 32);
    } else if (lastCode >= 65 && lastCode <= 90) {
      result += string[string.length - 1];
    }
    return result;
  },
  upperFirst: function (string = "") {
    var result = "";
    for (let i = 0; i < string.length; i++) {
      var code = string.charCodeAt(i);
      if (i == 0 && code >= 97 && code <= 122) {
        result += String.fromCharCode(code - 32);
      } else {
        result += string[i];
      }
    }
    return result;
  },
  words: function (string = "", pattern) {
    // [pattern] (RegExp|string): 匹配模式。
  },
  attempt: function (func) {
    var args = [];
    for (let i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    try {
      return func(...args);
    } catch (error) {
      return error;
    }
  },
  bindAll: function (object, methodNames) {},
  cond: function (pairs) {},
  conforms: function (source) {
    // 返回函数
    return function (arg) {
      for (var key in source) {
        if (source[key] !== arg[key]) {
          return false;
        }
      }
      return true;
    };
  },
  constant: function (value) {
    return function () {
      return value;
    };
  },
  defaultTo: function (value, defaultValue) {
    if (isNaN(value)) return defaultValue;
    if (value === undefined || value === null) return defaultValue;
    return value;
  },
  flow: function (funcs) {
    return function (...args) {
      if (typeof funcs === "function") {
        funcs = [funcs];
      }
      var cas = args;
      return funcs.reduce((pre, cur, curIdx, ary) => {
        cas = pre(...cas);
        if (!cas instanceof Array) cas = [cas];
        if (curIdx === funcs.length - 1) return cur(...cas);
      });
    };
  },
  flowRight: function (funcs) {
    return function (...args) {
      if (typeof funcs === "function") {
        funcs = [funcs];
      }
      var rev = [];
      for (let i = funcs.length - 1; i >= 0; i--) {
        rev.push(funcs[i]);
      }

      var cas = args;
      return rev.reduce((pre, cur, curIdx, ary) => {
        cas = pre(...cas);
        if (!cas instanceof Array) cas = [cas];
        if (curIdx === funcs.length - 1) return cur(...cas);
      });
    };
  },
  identity: function (value) {
    return value;
  },
  iteratee: function (func = this.identity) {
    return function callback(arg) {
      if (typeof func === "function") {
        return func(arg);
      } else if (func instanceof Array) {
        return arg[func[0]] === func[1];
      } else if (typeof func === "object") {
        for (var key in func) {
          if (func[key] !== arg[key]) {
            return false;
          }
          return true;
        }
      } else {
        return args[func] == true;
      }
    };
  },
  matches: function (source) {
    return function (arg) {
      for (var key in source) {
        if (source[key] !== arg[key]) {
          return false;
        }
      }
      return true;
    };
  },
  matchesProperty: function (path, srcValue) {
    if (typeof path === "string") {
      var pathArr = path.split(/[\[\].]+/);
    } else {
      var pathArr = path;
    }

    return function (...args) {
      for (let i = 0; i < args.length; i++) {
        var temp = args[i];
        for (let j = 0; j < pathArr.length; j++) {
          temp = temp[pathArr[j]];
          if (temp === undefined) break;
        }
        if (temp === srcValue) return true;
      }
      return false;
    };
  },
  method: function (path) {
    if (typeof path === "string") {
      path = path.split(/[\[\].]+/);
    }
    var get = [];
    for (let i = 1; i < arguments.length; i++) {
      get.push(arguments[i]);
    }

    return function (obj) {
      for (let i = 0; i < path.length; i++) {
        obj = obj[path[i]];
        if (obj === undefined) return false;
      }
      return obj(...get);
    };
  },
  methodOf: function (object) {
    var args = [];
    for (let i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    return function (path) {
      if (typeof path === "string") {
        path = path.split(/[\[\].]+/);
      }

      if (path[path.length - 1] === "") {
        path.length = path.length - 1;
      }
      console.log(path);
      var item = object;
      for (let i = 0; i < path.length; i++) {
        item = item[path[i]];
        if (item === undefined) return;
      }
      return item(...args);
    };
  },
  mixin: function (object, source, options = {}) {
    // [object=lodash] (Function|Object): 目标对象。
    // source (Object): 来源对象。
    // [options={}] (Object): 选项对象。
    // [options.chain=true] (boolean): 是否开启链式操作
  },
  noop: function () {
    return undefined;
  },
  nthArg: function (n = 0) {
    return function (...args) {
      if (n < 0) n = n + args.length;
      return args[n];
    };
  },
  over: function (iteratees) {
    if (typeof iteratees === "function") {
      iteratees = [iteratees];
    }
    return function (...args) {
      var res = [];
      for (let i = 0; i < iteratees.length; i++) {
        res.push(iteratees[i](...args));
      }
      return res;
    };
  },
  overEvery: function (predicates) {
    if (typeof predicates === "function") {
      predicates = [predicates];
    }
    return function (...args) {
      return predicates.reduce((pre, cur, idx) => {
        return pre && cur(...args);
      }, true);
    };
  },
  overSome: function (predicates) {
    if (typeof predicates === "function") {
      predicates = [predicates];
    }
    return function (...args) {
      return predicates.reduce((pre, cur, idx) => {
        return pre || cur(...args);
      }, false);
    };
  },
  property: function (path) {
    if (typeof path === "string") {
      path = path.split(/[\[\].]+/);
    }

    return function (obj) {
      for (let i = 0; i < path.length; i++) {
        obj = obj[path[i]];
        if (obj === undefined) return undefined;
      }
      return obj;
    };
  },
  propertyOf: function (object) {
    return function (path) {
      var obj = object;
      if (typeof path === "string") {
        path = path.split(/[\[\].]+/);
      }
      if (path[path.length - 1] === "") {
        path.length = path.length - 1;
      }

      for (let i = 0; i < path.length; i++) {
        obj = obj[path[i]];
        if (obj === undefined) return undefined;
      }
      return obj;
    };
  },
  range: function (start = 0, end, step = 1) {
    if (arguments.length == 0) return [];
    if (arguments.length == 1) {
      end = arguments[0];
      start = 0;
    }
    var result = [];
    if (step === 0) {
      var count = Math.abs(start - end);
      if (count < 0) count = 0;
      for (let i = 0; i < count; i++) {
        result[i] = start;
      }
      //没传step
    } else if (arguments.length < 3) {
      if (start > end) {
        for (let i = start; i > end; i--) {
          result.push(i);
        }
      } else {
        for (let i = start; i < end; i++) {
          result.push(i);
        }
      }
    } else {
      // 传了  step
      if (start > end && step > 0) return [];
      if (start < end && step < 0) return [];
      if (start > end) {
        for (let i = start; i > end; i += step) {
          result.push(i);
        }
      } else {
        for (let i = start; i < end; i += step) {
          result.push(i);
        }
      }
    }
    return result;
  },
  rangeRight: function (start = 0, end, step = 1) {
    return this.range(...arguments).reverse();
  },
  stubArray: function () {
    return [];
  },
  stubFalse: function () {
    return false;
  },
  stubObject: function () {
    return {};
  },
  stubString: function () {
    return "";
  },
  stubTrue: function () {
    return true;
  },
  times: function (n, iteratee) {
    var res = [];
    var idx = 0;
    for (let i = 0; i < n; i++) {
      res.push(iteratee(idx++));
    }
    return res;
  },
  toPath: function (value) {
    var res = value.split(/[\[\].]+/);
    if (res[res.length - 1] === "") {
      res.length = res.length - 1;
    }
    return res;
  },
  uniqueId: function (prefix = "") {
    var timestamp = new Date().getTime();
    return prefix + timestamp;
  },
  memoize: function (f, resolver = this.indentity) {
    var cache = new Map();

    function memoized(...args) {
      var key = resolver(...args);
      if (cache.has(key)) {
        return cache.get[key];
      } else {
        cache.set(arg, f(key));
        return f(key);
      }
    }
    memoized.cache = cache;
    return memoized;
  },
  once: function (func) {
    var flag = true;
    return function (...args) {
      if (flag) {
        flag = false;
        return func(...args);
      }
    };
  },
  parseJson: function () {
    var i = 0;
    return parseValue();

    function parseValue(str) {
      if (str[i] === "[") {
        return parseArray();
      }
      if (stri[i] === "{") {
        return parseObject();
      }
      if (str[i] === '"') {
        return parseString();
      }
      if (str[i] === "t") {
        return parseTrue();
      }
      if (str[i] === "n") {
        return parseNull();
      }
      if (str[i] === "f") {
        return parseFalse();
      }
      return parseNumber();
    }

    function parseArray() {
      var result = [];
      i++;

      while (str[i] !== "]") {
        var value = parseValue();
        result.push(value);
        if (str[i] === ",") {
          i++;
        }
      }
      i++;
      return result;
    }

    function parseObject() {
      var result = {};
      i++;

      while (str[i] !== "}") {
        var key = parseString();
        i++;
        var value = parseValue();
        result[key] = value;

        if (str[i] === ",") {
          i++;
        }
      }
      i++;
      return result;
    }

    function parseString() {
      i++;
      var pos = i;
      while (str[pos] !== '"') {
        pos++;
      }
      var result = str.slice(i, pos);
      i = pos + 1;
      return result;
    }

    function parseTrue() {
      i += 4;
      return true;
    }

    function parseFalse() {
      i += 5;
      return false;
    }

    function parseNull() {
      i += 4;
      return null;
    }

    function parseNumber() {
      var numStr = "";
      while (isNumberDigit(str[i])) {
        numStr += str[i++];
      }
      return parseInt(numStr);
    }

    function isNumberDigit(c) {
      var code = c.charCodeAt(0);
      var code0 = "0".charCodeAt(0);
      var code9 = "9".charCodeAt(0);
      return code >= code0 && code <= code9;
    }
  },
  stringifyJson: function (value) {
    if (Array.isArray(value)) {
      var result = "[";
      for (let i = 0; i < value.length; i++) {
        result += JSONStringify(value[i]);
        if (i < value.length - 1) result += ",";
      }
    } else if (typeof value == "string") {
      return '"' + value + '"';
    } else if (typeof value == "number") {
      return "" + value;
    } else if (typeof value == "boolean") {
      return "" + value;
    } else if (value === null) {
      return null;
    } else if (typeof value === "object") {
      var result = "{";
      for (var key in value) {
        var val = value[key];
        result += '"' + key + '":';
        result += JSONStringify(val) + '"';
      }
      result = result.slice(0, -1);
      result += "}";
    }
    return result;
  },
  compose: function (funcs) {
    return function (...args) {
      var value = funcs[0](...args);
      for (let i = 1; i < funcs.length; i++) {
        value = funcs[i](value);
      }
      return value;
    };
  },
};
