# Diátaxis templates

## Tutorial

```md
# First <outcome>

You will <outcome> in about <time>. You need <prerequisites>.

## 1. <Step>
<Do this.> You should see <observable result>.

## 2. <Step>
...

## What you built
<One paragraph. Link to the how-to guides and reference for next steps.>
```

Rules: no alternative paths, no explanations longer than one sentence, every step ends with something the reader can check.

## How-to guide

```md
# <Imperative task>

Use this when <situation>. Before you start, you need <prerequisite>.

1. <Action>
2. <Action>. If <condition>, do <alternative>.
3. <Verify>: <what success looks like>.

Related: [<Reference page>](...)
```

Rules: one task, goal in the title, conditions expressed as branches, no teaching of concepts (link to explanation instead).

## Reference

```md
# <Noun>

## <Item>
- Type: `<signature>`
- Default: `<value>`
- Throws: `<ErrorType>` when <condition>

<One sentence describing the behaviour.>
```

Rules: complete for its scope, consistent order, no procedures, one entry per public export.

## Explanation

```md
# Why <topic>

<The problem.> <The decision.> <The alternatives considered and why they were rejected.>
<The consequences the reader will meet.>
```

Rules: no step-by-step instructions, no reference tables that belong in reference pages (link them), state trade-offs honestly.

## README

```md
# <name>

<One sentence: what it does and for whom. Matches the package description.>

## Install
<command>

## Usage
<minimal example, runnable>

## Documentation
<links to the guides and reference>

## License
<license>
```

## JSDoc

```ts
/**
 * Summarise what the function returns, in one sentence.
 *
 * @param input - What it accepts, and any constraint that the type does not express.
 * @returns What the caller receives, including the empty case.
 * @throws {ValidationError} When `input` is not a non-empty string.
 * @example
 * ```ts
 * summarise('abc'); // 'abc'
 * ```
 */
```
