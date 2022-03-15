function gcd(a, b) {
    if (b === 0n) {
        return a;
    }
    return gcd(b, a % b);
}

function gcd_iter(a, b) {
    var q, r;
    while (b > 0) {
      q = a / b;
      r = a - q * b;
      a = b;
      b = r;
    }
    return a;
  }

  function powmod(b, e, m) {
    let c = 1n;
    let eprime = 0;
  
    do {
      eprime += 1;
      c = (b * c) % m;
    } while (eprime < e);
  
    return c;
  }

  function powerMod(base, exponent, modulus) {
    if (modulus === 1n) return 0;
    var result = 1n;
    base = base % modulus;
    while (exponent > 0n) {
        if (exponent % 2n === 1n)  //odd number
            result = (result * base) % modulus;
        exponent = exponent >> 1n; //divide by 2
        base = (base * base) % modulus;
    }
    return result;
  }

const a7 = 1001821n;
const a = 53n; //1000000181n;
const b = 1979339339n;

//const c2 = gcd_iter(a7, b);

const c = powerMod(45813234n, 2298293n, 53096513n)

console.log(c);

