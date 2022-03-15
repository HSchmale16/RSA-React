/* global BigInt */
/**
 * https://en.wikipedia.org/wiki/RSA_(cryptosystem)#Example
 */

import React, {useReducer} from "react";
import './App.css'

function rootNth(val, k=2n) {
  let o = 0n; // old approx value
  let x = val;
  let limit = 100;
  
  while(x**k!==k && x!==o && --limit) {
    o=x;
    x = ((k-1n)*x + val/x**(k-1n))/k;
  }
  
  return x;
}

function isPrime(n) {
  const to = rootNth(n);
  if (n % 2n === 0n) return n === 2n;
  if (n % 3n === 0n) return n === 5n;

  for (let d = 5n; d <= to; d += 6n) {
    if (n % d === 0n) {
      return false;
    }
  }
  return true;
}


function gcd_iter(a, b) {
  var q, r;
  while (b > 0n) {
    q = a / b;
    r = a - q * b;
    a = b;
    b = r;
  }
  return a;
}

function lcm(a, b) {
  return (a / gcd_iter(a, b)) * b;
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

  const pIsPrime = isPrime(p);
  const qIsPrime = isPrime(q);

  var n='?',p1='?',q1='?',totient='?',gcdETotient='?',d='?',c='?';
  var m1 = '?';

  if (p !== q && p !== 0n && q !== 0n && pIsPrime && qIsPrime) {
    n = p * q;

    p1 = p - 1n;
    q1 = q - 1n;
  
    totient = lcm(p1, q1);
  
    gcdETotient = gcd_iter(e, totient);
    
    d = inverse(e, totient);
  
    c = powerMod(m, e, n);
    m1 = powerMod(c, d, n);
  }
  

  /* React form bullshit */

  const reducerInputChange = (e) => {
    const { name, value } = e.target
    dispatchFormValue({ [name]: BigInt(value) })  
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
        className={pIsPrime ? "" : "error"}
        value={p.toString()} onChange={reducerInputChange}/>

      <br/>

      <label htmlFor="q">Q = </label>
      <input name="q"
        className={qIsPrime ? "" : "error"}
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
