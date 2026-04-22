import { describe, expect, it } from "vitest";
import {
  loadDefaultAgentInstructionsBundle,
  resolveDefaultAgentInstructionsBundleRole,
} from "./default-agent-instructions.js";

describe("default agent instructions language policy", () => {
  it("loads default bundles with an explicit always-french rule", async () => {
    const defaultBundle = await loadDefaultAgentInstructionsBundle(resolveDefaultAgentInstructionsBundleRole("ic"));
    const ceoBundle = await loadDefaultAgentInstructionsBundle(resolveDefaultAgentInstructionsBundleRole("ceo"));

    expect(defaultBundle["AGENTS.md"]).toContain("Réponds toujours en français");
    expect(ceoBundle["AGENTS.md"]).toContain("Réponds toujours en français");
    expect(ceoBundle["SOUL.md"]).toContain("Réponds toujours en français");
    expect(ceoBundle["HEARTBEAT.md"]).toContain("Réponds toujours en français");
  });
});
