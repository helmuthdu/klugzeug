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

Rules: no alternative paths, no explanations longer than one sentence, every step ends with something the reader can check. Show the expected output at each step, and say what to notice ("Notice that the prompt changed."). Never open with "In this tutorial you will learn…". Run the whole tutorial from a clean state before shipping it.

## How-to guide

```md
# <Imperative task>

Use this when <situation>. Before you start, you need <prerequisite>.

1. <Action>
2. <Action>. If <condition>, do <alternative>.
3. <Verify>: <what success looks like>.

Related: [<Reference page>](...)
```

Rules: one task, goal in the title ("How to …" or an imperative that names the outcome), written from the user's goal rather than the tool's controls, conditions expressed as branches, no teaching of concepts (link to explanation instead).

## Reference

```md
# <Noun>

## <Item>
- Type: `<signature>`
- Default: `<value>`
- Throws: `<ErrorType>` when <condition>

<One sentence describing the behaviour.>

Example (optional, when it clarifies usage):
```ts
<runnable usage>
```
```

Rules: complete for its scope, consistent order and structure that mirror the code, no procedures, one entry per public export. Examples illustrate; they do not instruct.

## Explanation

```md
# About <topic>

<The problem.> <The decision.> <The alternatives considered and why they were rejected.>
<The consequences the reader will meet.>
```

Rules: no step-by-step instructions, no reference tables that belong in reference pages (link them), state trade-offs honestly. Make connections to related topics, give history and context, and present alternatives and differing perspectives. "Why" can head a section, but the page title is "About …". Keep it bounded to one topic.

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
