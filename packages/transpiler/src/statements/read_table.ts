import * as abaplint from "@abaplint/core";
import {IStatementTranspiler} from "./_statement_transpiler";
import {Traversal} from "../traversal";
import {FieldSymbolTranspiler, SourceTranspiler} from "../expressions";
import {UniqueIdentifier} from "../unique_identifier";

export class ReadTableTranspiler implements IStatementTranspiler {

  public transpile(node: abaplint.Nodes.StatementNode, traversal: Traversal): string {

    let prefix = "";
    const s = node.findDirectExpression(abaplint.Expressions.SimpleSource2);
    const ret = traversal.traverse(s);

    const extra: string[] = [];
    const index = node.findExpressionAfterToken("INDEX");
    if (index) {
      const s = new SourceTranspiler().transpile(index, traversal);
      extra.push("index: " + s);
    }

    const rt = node.findDirectExpression(abaplint.Expressions.ReadTableTarget);
    const target = rt?.findDirectExpression(abaplint.Expressions.Target);
    const fs = rt?.findDirectExpression(abaplint.Expressions.FSTarget);
    if (rt && fs) {
      const name = new FieldSymbolTranspiler().transpile(fs, traversal);
      extra.push("assigning: " + name);
    } else if (target) {
      const name = traversal.traverse(target);
      extra.push("into: " + name);
    }

    const compare = node.findDirectExpression(abaplint.Expressions.ComponentCompareSimple);
    if (compare) {
      const components = compare.findDirectExpressions(abaplint.Expressions.ComponentChain);
      const sources = compare.findDirectExpressions(abaplint.Expressions.Source);
      if (components.length !== sources.length) {
        throw new Error("READ TABLE, transpiler unexpected lengths");
      }
      const conds: string[] = [];
      for (let i = 0; i < components.length; i++) {
        const s = traversal.traverse(sources[i]);
        if (s.includes("await")) {
          const id = UniqueIdentifier.get();
          prefix += "const " + id + " = " + s + ";\n";
          conds.push("abap.compare.eq(i." + components[i].concatTokens() + ", " + id + ")");
        } else {
          conds.push("abap.compare.eq(i." + components[i].concatTokens() + ", " + s + ")");
        }
      }
      extra.push("withKey: (i) => {return " + conds.join(" && ") + ";}");
    }

    let concat = "";
    if (extra.length > 0) {
      concat = ",{" + extra.join(",") + "}";
    }

    return prefix + "abap.statements.readTable(" + ret + concat + ");";
  }

}