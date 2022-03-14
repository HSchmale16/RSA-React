/* global BigInt */
/**
 * https://en.wikipedia.org/wiki/RSA_(cryptosystem)#Example
 */

import React, {useReducer} from "react";

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

function RSAExample() {
  const formInitialState = {
    p: 61n,
    q: 53n,
    e: 17n,
    m: 69n // nice!!! : the message
  }

  const [inputValues, dispatchFormValue] = useReducer(
    (curVal, newVal) => ({ ...curVal, ...newVal }),
    formInitialState,
  )
  
  const {p, q, e, m} = inputValues;
  console.log(inputValues);

  const n = p * q;

  const p1 = p - 1n;
  const q1 = q - 1n;

  const totient = lcm(p1, q1);

  const gcdETotient = gcd(e, totient);
  
  const d = extended_gcd(e, totient);

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
      <input name="p" value={p.toString()} onChange={reducerInputChange}/>

      <br/>

      <label htmlFor="q">Q = </label>
      <input name="q" value={q.toString()} onChange={reducerInputChange}/>
    </fieldset>

    <fieldset>
      <legend>Compute N = pq</legend>
      <label htmlFor="n">N</label>
      <input name="n" value={n.toString()} disabled/>
    </fieldset>

    <fieldset>
      <legend>
        Compute Carmichael's Totient Function
      </legend>

      <label htmlFor="totient">λ(n) = lcm({p1.toString()}, {q1.toString()}) = </label>
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
      </fieldset>

      <fieldset>
        <legend>To Decrypt the Message</legend>
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
