/* global BigInt */
/**
 * https://en.wikipedia.org/wiki/RSA_(cryptosystem)#Example
 */

import React, {useReducer} from "react";
import './App.css'


function isPrime(n) {
  for (let d = 2n; d <= n/2n; d++) {
    console.log(d, n % d)
    if (n % d === 0n) {
      return false;
    }
  }
  return true;
}

function gcd(a, b) {
  if (b === 0n) {
    return a;
  }
  return gcd(b, a % b);
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

/**
 * Computes ax === b(mod m)
 * @param {*} e 
 * @param {*} tot 
 */
function extended_gcd(a, b) {
  let [old_r, r] = [a, b];
  let [old_s, s] = [1n, 0n];
  let [old_t, t] = [0n, 1n];

  while (r !== 0n) {
    let quotient = old_r / r;
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
    [old_t, t] = [t, old_t - quotient * t];
  }
  let res = {
    'bez': [old_s, old_t],
    'gcd': old_r,
    'quot': [t, s]
  };
  console.log('extended_gcd', res);
  return res;
}

/** computes ax (mod n) == 1 */
function inverse(a, n) {
  let t = 0n;
  let new_t = 1n;
  let r = n;
  let new_r = a;

  while (new_r !== 0n) {
    let quot = r / new_r;

    [t, new_t] = [new_t, t - quot * new_t];
    [r, new_r] = [new_r, r - quot * new_r];
  }

  if (r > 1) {
    return "ERROR"
  }

  if (t < 0) {
    t = t + n;
  }

  return t;
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

function RSAExample() {
  const formInitialState = {
    p: 61n,
    q: 53n,
    e: 17n,
    m: 65n, // nice!!! : the message
    c: 0n,
  }

  const [inputValues, dispatchFormValue] = useReducer(
    (curVal, newVal) => ({ ...curVal, ...newVal }),
    formInitialState,
  )
  
  const {p, q, e, m} = inputValues;
  console.log(inputValues);

  var n='?',p1='?',q1='?',totient='?',gcdETotient='?',d='?',c='?';
  var m1 = '?';

  if (p !== q && p !== 0n && q !== 0n && isPrime(p) && isPrime(q)) {
    n = p * q;

    p1 = p - 1n;
    q1 = q - 1n;
  
    totient = lcm(p1, q1);
  
    gcdETotient = gcd(e, totient);
    
    d = inverse(e, totient);
  
    c = powmod(m, e, n);
    m1 = powmod(c, d, n);
  }
  

  /* React form bullshit */

  const reducerInputChange = (e) => {
    const { name, value } = e.target
    dispatchFormValue({ [name]: BigInt(value) })
    
    console.log(inputValues)
  }


  const onFormSubmit = (e) => {
    e.preventDefault();
  }

  return <form onSubmit={onFormSubmit}>
    <h1>Encrypt and Decrypt using RSA</h1>
    <fieldset>
      <legend>Choose Prime P and Q</legend>

      <label htmlFor="p">P = </label>
      <input name="p"
        className={isPrime(p) ? "" : "error"}
        value={p.toString()} onChange={reducerInputChange}/>

      <br/>

      <label htmlFor="q">Q = </label>
      <input name="q"
        className={isPrime(q) ? "" : "error"}
        value={q.toString()} onChange={reducerInputChange}/>
    </fieldset>

    <fieldset>
      <legend>Compute N = pq</legend>
      <label htmlFor="n">N = </label>
      <input name="n" value={n.toString()} disabled/>
    </fieldset>

    <fieldset>
      <legend>
        Compute Carmichael's Totient Function
      </legend>

      <label htmlFor="totient">λ(n) = lcm(p-1, q-1) = lcm({p1.toString()}, {q1.toString()}) = </label>
      <input name="totient" value={totient.toString()} disabled/>
    </fieldset>

    <fieldset>
      <legend>
        Pick an E that is coprime to {totient.toString()}
      </legend>

      <label htmlFor="e">E = </label>
      <input name="e" value={e.toString()} onChange={reducerInputChange}/>

      <br/>

      <label htmlFor="gcdETotient">GCD of λ({n.toString()}) and {e.toString()} (If coprime is 1)</label>
      <input name="gcdETotient" value={gcdETotient.toString()} disabled/>
    </fieldset>

    <fieldset>
      <legend>Compute d, the modular multiplicative inverse of e (mod λ(n))</legend>

      <label htmlFor="d">d = </label>
      <input name="d" value={d.toString()} disabled/>
    </fieldset>

    <fieldset>
      <legend>Encrypt and Decrypt the Message</legend>

      <fieldset>
        <legend>Pick an Integer M to Encrypt</legend>

        <label htmlFor="m">Message = </label>
        <input name="m" value={m.toString()} onChange={reducerInputChange}/>
      </fieldset>

      
      <fieldset>
        <legend>The Encrypted Message is</legend>

        <p>
          The public key is c(m) = m<sup>e</sup> mod n<br/>
            c({m.toString()}) = {m.toString()} <sup>{e.toString()}</sup>
            mod {n.toString()} = {c.toString()}
        </p>
      </fieldset>

      <fieldset>
        <legend>To Decrypt the Message</legend>
        <p>
          The private key is m(c) = c<sup>d</sup> mod n<br/>
            m({c.toString()}) = {c.toString()} <sup>{d.toString()}</sup>
            mod {n.toString()} = {m1.toString()}
        </p>
      </fieldset>

    </fieldset>
  </form>

}


function App() {
  return (
    <RSAExample/>
  );
}

export default App;
