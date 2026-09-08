import { useMemo, useState } from "react";
import {
  DEFAULT_TOKENIZER_ID,
  TOKENIZERS,
  TOKEN_COLORS,
  getTokenizer,
} from "./tokenizers.js";
import "./TokenizerWidget.css";

const SAMPLE_TEXT =
  "The quick brown fox jumps over the lazy dog. Tokenizers split text into pieces called tokens!";

function encodeSafely(encodeFn, text) {
  try {
    return { tokens: encodeFn(text), error: null };
  } catch (err) {
    return { tokens: [], error: err instanceof Error ? err.message : String(err) };
  }
}

function decodeSafely(decodeFn, tokenIds) {
  try {
    return { text: decodeFn(tokenIds), error: null };
  } catch (err) {
    return { text: "", error: err instanceof Error ? err.message : String(err) };
  }
}

function parseTokenIds(raw) {
  const ids = raw
    .split(/[\s,\[\]]+/)
    .map((piece) => piece.trim())
    .filter((piece) => piece.length > 0)
    .map((piece) => Number(piece));

  if (ids.some((id) => !Number.isInteger(id) || id < 0)) {
    throw new Error("Token list must contain only non-negative integers.");
  }
  return ids;
}

export default function TokenizerWidget() {
  const [mode, setMode] = useState("encode"); // "encode" | "decode"
  const [tokenizerId, setTokenizerId] = useState(DEFAULT_TOKENIZER_ID);
  const [text, setText] = useState(SAMPLE_TEXT);
  const [tokenIdsInput, setTokenIdsInput] = useState("");

  const [encodeResult, setEncodeResult] = useState(null); // { tokens, pieces, error }
  const [decodeResult, setDecodeResult] = useState(null); // { text, error }

  const tokenizer = useMemo(() => getTokenizer(tokenizerId), [tokenizerId]);

  function handleTokenize() {
    const { tokens, error } = encodeSafely(tokenizer.encode, text);
    if (error) {
      setEncodeResult({ tokens: [], pieces: [], error });
      return;
    }
    const pieces = tokens.map((id) => {
      const { text: piece } = decodeSafely(tokenizer.decode, [id]);
      return piece;
    });
    setEncodeResult({ tokens, pieces, error: null });
  }

  function handleDetokenize() {
    let ids;
    try {
      ids = parseTokenIds(tokenIdsInput);
    } catch (err) {
      setDecodeResult({ text: "", error: err.message });
      return;
    }
    const { text: decoded, error } = decodeSafely(tokenizer.decode, ids);
    setDecodeResult({ text: decoded, error });
  }

  return (
    <div className="tokenizer-widget">
      <div className="tokenizer-widget__toolbar">
        <div className="tokenizer-widget__tabs" role="tablist">
          <button
            role="tab"
            aria-selected={mode === "encode"}
            className={mode === "encode" ? "is-active" : ""}
            onClick={() => setMode("encode")}
          >
            Text → Tokens
          </button>
          <button
            role="tab"
            aria-selected={mode === "decode"}
            className={mode === "decode" ? "is-active" : ""}
            onClick={() => setMode("decode")}
          >
            Tokens → Text
          </button>
        </div>

        <label className="tokenizer-widget__select">
          Tokenizer
          <select
            value={tokenizerId}
            onChange={(e) => setTokenizerId(e.target.value)}
          >
            {TOKENIZERS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="tokenizer-widget__hint">{tokenizer.description}</p>

      {mode === "encode" ? (
        <div className="tokenizer-widget__panel">
          <textarea
            className="tokenizer-widget__textarea"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to tokenize..."
          />
          <div className="tokenizer-widget__actions">
            <button onClick={handleTokenize}>Tokenize</button>
            {encodeResult && !encodeResult.error && (
              <span className="tokenizer-widget__count">
                {encodeResult.tokens.length} token
                {encodeResult.tokens.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {encodeResult?.error && (
            <p className="tokenizer-widget__error">{encodeResult.error}</p>
          )}

          {encodeResult && !encodeResult.error && (
            <>
              <h3>Colorized tokens</h3>
              <div className="tokenizer-widget__colorized">
                {encodeResult.pieces.map((piece, idx) => (
                  <span
                    key={idx}
                    className="tokenizer-widget__token"
                    style={{
                      backgroundColor:
                        TOKEN_COLORS[idx % TOKEN_COLORS.length],
                    }}
                    title={`token id: ${encodeResult.tokens[idx]}`}
                  >
                    {piece.replace(/\n/g, "\u23ce\n")}
                  </span>
                ))}
              </div>

              <h3>Token IDs</h3>
              <pre className="tokenizer-widget__ids">
                [{encodeResult.tokens.join(", ")}]
              </pre>
            </>
          )}
        </div>
      ) : (
        <div className="tokenizer-widget__panel">
          <textarea
            className="tokenizer-widget__textarea"
            rows={6}
            value={tokenIdsInput}
            onChange={(e) => setTokenIdsInput(e.target.value)}
            placeholder="Enter comma or space separated token IDs, e.g. 464, 3712, 3290"
          />
          <div className="tokenizer-widget__actions">
            <button onClick={handleDetokenize}>Detokenize</button>
          </div>

          {decodeResult?.error && (
            <p className="tokenizer-widget__error">{decodeResult.error}</p>
          )}

          {decodeResult && !decodeResult.error && (
            <>
              <h3>Decoded text</h3>
              <pre className="tokenizer-widget__ids">{decodeResult.text}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
