// Configuration for the tokenizer widget.
//
// Each entry wraps one of the encodings shipped by the `gpt-tokenizer` package
// (a pure-JS re-implementation of OpenAI's open-source `tiktoken` library).
// These are real, production tokenizer vocabularies/merge tables used by
// actual open-source-documented LLMs, so switching between them shows how
// differently each model chops up the same piece of text.
import * as gpt2 from "gpt-tokenizer/encoding/gpt2";
import * as r50kBase from "gpt-tokenizer/encoding/r50k_base";
import * as cl100kBase from "gpt-tokenizer/encoding/cl100k_base";
import * as o200kBase from "gpt-tokenizer/encoding/o200k_base";

export const TOKENIZERS = [
  {
    id: "gpt2",
    label: "GPT-2 (byte-level BPE)",
    description: "Original GPT-2 tokenizer, 50,257 tokens.",
    encode: gpt2.encode,
    decode: gpt2.decode,
  },
  {
    id: "r50k_base",
    label: "GPT-3 / r50k_base",
    description: "Used by GPT-3 base models (davinci, curie, ...).",
    encode: r50kBase.encode,
    decode: r50kBase.decode,
  },
  {
    id: "cl100k_base",
    label: "GPT-3.5 / GPT-4 (cl100k_base)",
    description: "Used by gpt-3.5-turbo and gpt-4.",
    encode: cl100kBase.encode,
    decode: cl100kBase.decode,
  },
  {
    id: "o200k_base",
    label: "GPT-4o (o200k_base)",
    description: "Used by gpt-4o and newer OpenAI models.",
    encode: o200kBase.encode,
    decode: o200kBase.decode,
  },
];

export const DEFAULT_TOKENIZER_ID = TOKENIZERS[2].id;

export function getTokenizer(id) {
  return TOKENIZERS.find((t) => t.id === id) ?? TOKENIZERS[0];
}

// A palette that cycles across tokens so adjacent tokens are always visually
// distinguishable.
export const TOKEN_COLORS = [
  "#f6c7ff",
  "#c7e9ff",
  "#c7ffd9",
  "#fff3c7",
  "#ffd6c7",
  "#d8c7ff",
  "#c7fff2",
  "#ffe0f0",
];
