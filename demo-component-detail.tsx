import { useEffect, useState } from "react";
import { Button } from "./components/quest/button";
import { Card, CardContent } from "./components/quest/card";
import { Code } from "@astryxdesign/core/Code";
import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { Section } from "@astryxdesign/core/Section";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { componentDocsStyles as styles } from "./demo-component-docs.styles";
import type { CatalogEntry } from "./demo-component-docs-model";
import {
  displayName,
  primaryExport,
  registryUrl,
} from "./demo-component-docs-model";
import { githubUrl } from "./demo-site-nav";

export type SourceState =
  | { status: "loading" }
  | { status: "ready"; source: string }
  | { status: "error"; message: string };

type RegistryFile = { path: string; target?: string; content: string };

function registryFiles(value: unknown): readonly RegistryFile[] {
  if (
    !value ||
    typeof value !== "object" ||
    !("files" in value) ||
    !Array.isArray(value.files)
  ) {
    throw new Error("Registry response does not contain files.");
  }
  return value.files.filter((file): file is RegistryFile => {
    if (!file || typeof file !== "object") return false;
    return (
      "path" in file &&
      typeof file.path === "string" &&
      "content" in file &&
      typeof file.content === "string"
    );
  });
}

async function loadComponentSource(
  name: string,
  signal: AbortSignal,
): Promise<string> {
  const response = await fetch(`/r/quest-${name}.json`, { signal });
  if (!response.ok) throw new Error(`Registry returned ${response.status}.`);
  const files = registryFiles((await response.json()) as unknown);
  const target = `components/quest/${name}.tsx`;
  const source = files.find(
    (file) => file.path === target || file.target === `@${target}`,
  );
  if (!source) throw new Error(`Registry item does not contain ${target}.`);
  return source.content;
}

function useComponentSource(name: string): SourceState {
  const [state, setState] = useState<SourceState>({ status: "loading" });
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    loadComponentSource(name, controller.signal)
      .then((source) => setState({ status: "ready", source }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setState({
          status: "error",
          message:
            error instanceof Error ? error.message : "Unable to load source.",
        });
      });
    return () => controller.abort();
  }, [name]);
  return state;
}

function CopyButton({
  label,
  copiedLabel,
  text,
}: {
  label: string;
  copiedLabel: string;
  text: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  };
  return (
    <Stack gap={2} hAlign="start">
      <Button size="sm" variant="outline" onClick={() => void copy()}>
        {status === "copied" ? copiedLabel : label}
      </Button>
      {status === "error" ? (
        <Text as="p" type="supporting" color="accent" role="status">
          Copy failed. Select the code below.
        </Text>
      ) : null}
    </Stack>
  );
}

function SourceSection({
  entry,
  state,
}: {
  entry: CatalogEntry;
  state: SourceState;
}) {
  if (state.status === "loading")
    return <Text role="status">Loading editable source…</Text>;
  if (state.status === "error")
    return (
      <Stack gap={2}>
        <Text as="p" role="alert" color="accent">
          {state.message}
        </Text>
        <Link href={`/r/quest-${entry.name}.json`} isStandalone>
          Open registry item
        </Link>
      </Stack>
    );
  return (
    <Stack gap={3}>
      <Stack direction="horizontal" gap={3} wrap="wrap" hAlign="between">
        <Text as="p" color="secondary">
          Copied by the CLI into <Code>components/quest/{entry.name}.tsx</Code>.
        </Text>
        <CopyButton
          label="Copy source"
          copiedLabel="Source copied"
          text={state.source}
        />
      </Stack>
      <CodeBlock
        code={state.source}
        language="tsx"
        title={`${entry.name}.tsx`}
        width="100%"
        hasLineNumbers
        isCollapsible
        collapsibleThreshold={30}
      />
    </Stack>
  );
}

function ComponentHeader({ entry }: { entry: CatalogEntry }) {
  return (
    <Stack gap={3}>
      <Text type="label" color="accent">
        COMPONENT
      </Text>
      <Heading level={1} type="display-1">
        {displayName(entry.name)}
      </Heading>
      <Text as="p" type="large" color="secondary">
        A source-copy pixel composition built on {entry.native}. Own the React
        and StyleX source; keep Astryx interaction semantics.
      </Text>
      <Stack direction="horizontal" gap={4} wrap="wrap">
        <Link href={`/r/quest-${entry.name}.json`} isStandalone>
          Registry JSON
        </Link>
        <Link
          href={`${githubUrl}/blob/main/components/quest/${entry.name}.tsx`}
          isStandalone
        >
          View on GitHub
        </Link>
      </Stack>
    </Stack>
  );
}

function InstallSection({ command }: { command: string }) {
  return (
    <Section variant="muted" padding={6}>
      <Stack gap={4}>
        <Heading level={2}>Install</Heading>
        <CopyButton
          label="Copy install command"
          copiedLabel="Install command copied"
          text={command}
        />
        <CodeBlock
          code={command}
          language="shell"
          title="terminal"
          width="100%"
          hasLineNumbers={false}
        />
      </Stack>
    </Section>
  );
}

function ImportSection({ entry }: { entry: CatalogEntry }) {
  const code = `import {${primaryExport(entry.name)}} from '@/components/quest/${entry.name}'`;
  return (
    <Card>
      <CardContent>
        <Stack gap={4}>
          <Heading level={2}>Import</Heading>
          <Text as="p" color="secondary">
            The default initializer writes components beneath the{" "}
            <Code>@/components/quest</Code> alias.
          </Text>
          <CodeBlock
            code={code}
            language="tsx"
            title="component.tsx"
            width="100%"
            hasLineNumbers={false}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export function ComponentDetail({ entry }: { entry: CatalogEntry }) {
  const sourceState = useComponentSource(entry.name);
  const installCommand = `npx quest-ui add ${entry.name} --registry ${registryUrl}`;
  return (
    <Stack width="100%" maxWidth={960} gap={8} xstyle={styles.content}>
      <ComponentHeader entry={entry} />
      <InstallSection command={installCommand} />
      <ImportSection entry={entry} />
      <Section variant="transparent" padding={0}>
        <Stack gap={4}>
          <Heading level={2}>Source</Heading>
          <SourceSection entry={entry} state={sourceState} />
        </Stack>
      </Section>
    </Stack>
  );
}

export function MissingComponent({ name }: { name: string }) {
  return (
    <Stack width="100%" maxWidth={720} gap={4} xstyle={styles.content}>
      <Text type="label" color="accent">
        NOT FOUND
      </Text>
      <Heading level={1}>Unknown component: {name}</Heading>
      <Text as="p" color="secondary">
        Choose an installable QuestUI component from the catalog.
      </Text>
      <Link href="/components" isStandalone>
        Browse all components
      </Link>
    </Stack>
  );
}
