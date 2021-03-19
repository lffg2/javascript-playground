const OK = Symbol('Result.ok');
const ERR = Symbol('Result.err');
const $type = Symbol('Result.$type');
const $data = Symbol('Result.$data');

const resultPrototype = {
  // Checks if the Result is the ok variant.
  isOk() {
    return this[$type] === OK;
  },
  
  // Checks if the Result is the err variant.
  isErr() {
    return this[$type] === ERR;
  },
  
  // Creates a new Result type by mapping the ok variant.
  // Error variant is ignored (although a new Result is also created).
  map(fn) {
    return this.match({
      ok: (data) => ok(fn(data)),
      err: (error) => err(error)
    });
  },
  
  // Throws an `Error` with `message` if the Result is the err variant.
  // Returns the wrapped value if the Result is the ok variant.
  expect(message) {
    return this.match({
      ok: (data) => data,
      err: () => throw new Error(message)
    });
  },
  
  // Throws if the Result is err. Otherwise, returns the wrapped value.
  unwrap() {
    return this.expect('Cannot unwrap err Result variant');
  },
  
  // Match the result variant, executing a callback function and returning the value.
  match(matchMap) {
    switch (this[$type]) {
      case OK: return matchMap.ok(this[$data]);
      case ERR: return matchMap.err(this[$data]);
      default: throw new Error('Unreachable; invalid Result type');
    }
  }
};

// Creates a new ok variant Result.
function ok(val) {
  return Object.assign(Object.create(resultPrototype), {
    [$type]: OK,
    [$data]: val
  });
}

// Creates a new err variant Result.
function err(val) {
  return Object.assign(Object.create(resultPrototype), {
    [$type]: ERR,
    [$data]: val
  });
}
