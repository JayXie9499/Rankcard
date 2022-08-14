# Rankcard

- [Descripton](#description)
- [Installation](#installation)
- [Usage](#usage)

---

## Description
This is the rank card generator for Oyster.

---

## Installation

```sh
npm install @jayxie9499/rankcard
```
```sh
yarn add @jayxie9499/rankcard
```
```sh
pnpm add @jayxie9499/rankcard
```

---

## Usage

```js
const { Rankcard } = require("@jayxie9499/rankcard");
const rankcard = new Rankcard()
  .setAvatar("avatar url")
  .setUsername("Oyster")
  .setDiscriminator("6440")
  .setStatus("online")
  .setRank(1)
  .setLevel(1)
  .setCurrentXp(10)
  .setRequiredXp(100)
  .build();

channel.send({
  file: [await rankcard]
});
```