import ts from "typescript"

export type Change = { start: number; end: number; text: string }

export function source(path: string, text: string): ts.SourceFile {
  const file = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const diagnostics = (file as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] }).parseDiagnostics
  if (diagnostics.length) throw new Error(`${path}: fix syntax errors before initialization.`)
  return file
}

export function apply(text: string, changes: Change[]): string {
  return changes.sort((a, b) => b.start - a.start).reduce((value, change) =>
    value.slice(0, change.start) + change.text + value.slice(change.end), text)
}

export function property(object: ts.ObjectLiteralExpression, name: string): ts.PropertyAssignment | undefined {
  if (object.properties.some(item => ts.isSpreadAssignment(item) || !item.name || ts.isComputedPropertyName(item.name))) {
    throw new Error("Computed or spread configuration is unsupported. Use explicit object properties before running init.")
  }
  const matches = object.properties.filter(item => item.name && (ts.isIdentifier(item.name) || ts.isStringLiteral(item.name)) && item.name.text === name)
  if (matches.length > 1 || (matches[0] && !ts.isPropertyAssignment(matches[0]))) throw new Error(`Ambiguous '${name}' configuration.`)
  return matches[0] as ts.PropertyAssignment | undefined
}

export function objectValue(value: ts.Expression, label: string): ts.ObjectLiteralExpression {
  if (!ts.isObjectLiteralExpression(value)) throw new Error(`${label} must be an explicit object literal for safe setup.`)
  return value
}

export function addProperty(object: ts.ObjectLiteralExpression, text: string): Change {
  return { start: object.getStart() + 1, end: object.getStart() + 1, text: `\n${text},\n` }
}

export function imports(file: ts.SourceFile, module: string): ts.ImportDeclaration[] {
  return file.statements.filter((node): node is ts.ImportDeclaration => ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text === module)
}

export function namedImport(file: ts.SourceFile, module: string, name: string): string | undefined {
  for (const declaration of imports(file, module)) {
    const clause = declaration.importClause
    if (clause?.isTypeOnly) continue
    const bindings = clause?.namedBindings
    if (!bindings || !ts.isNamedImports(bindings)) continue
    const item = bindings.elements.find(element => !element.isTypeOnly && (element.propertyName?.text ?? element.name.text) === name)
    if (item) return item.name.text
  }
  return undefined
}

export function unusedName(file: ts.SourceFile, name: string): void {
  let used = false
  function visit(node: ts.Node): void {
    if (ts.isIdentifier(node) && node.text === name) used = true
    ts.forEachChild(node, visit)
  }
  visit(file)
  if (used) throw new Error(`The identifier '${name}' is already used. Rename it before initialization to avoid a collision.`)
}
