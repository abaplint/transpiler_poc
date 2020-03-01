import {Nodes} from "abaplint";
import {IExpressionTranspiler} from "./_expression_transpiler";
// todo, foobar
// import * as BasicTypes from "../../../runtime/src/types";

export class TypeNameTranspiler implements IExpressionTranspiler {

  public transpile(node: Nodes.ExpressionNode): string {

    switch (node?.getFirstToken().getStr().toUpperCase()) {
      case "I":
        return "abap.types.Integer"; // + new BasicTypes.Integer().constructor.name;
      case "C":
        return "abap.types.Character"; // + new BasicTypes.Character().constructor.name;
      case "P":
        return "abap.types.Packed"; // + new BasicTypes.Packed().constructor.name;
      case "STRING":
        return "abap.types.String"; // + new BasicTypes.String().constructor.name;
      default:
        return "todo, TypeNameTranspiler";
    }

  }

}