import ts from "typescript";
import binaryen from 'binaryen'

interface DocEntry
{
    name?: string;
    fileName?: string;
    documentation?: string;
    type?: string;
    constructors?: DocEntry[];
    parameters?: DocEntry[];
    returnType?: string;
}

/** Generate documentation for all classes in a set of .ts files */
async function generateDocumentation(
    fileNames: string[],
    options: ts.CompilerOptions
): Promise<void>
{
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options);

    // Get the checker, we will use it to find more about classes
    let checker = program.getTypeChecker();
    let output: DocEntry[] = [];
    var myModule = new binaryen.Module();

    // Visit every sourceFile in the program
    for (const sourceFile of program.getSourceFiles())
    {
        if (!sourceFile.isDeclarationFile)
        {
            // Walk the tree to search for classes
            ts.forEachChild(sourceFile, visit);
        }
    }
    let lastNode;

    return;

    /** visit nodes finding exported classes */
    function visit(node: ts.Node)
    {
        // Only consider exported nodes
        if (!isNodeExported(node))
        {
            return;
        }

        switch (node.kind)
        {
            case ts.SyntaxKind.Unknown:
                break;
            case ts.SyntaxKind.EndOfFileToken:
            case ts.SyntaxKind.SingleLineCommentTrivia:
            case ts.SyntaxKind.MultiLineCommentTrivia:
            case ts.SyntaxKind.NewLineTrivia:
            case ts.SyntaxKind.WhitespaceTrivia:
            case ts.SyntaxKind.ShebangTrivia:
            case ts.SyntaxKind.ConflictMarkerTrivia:
                break;
            case ts.SyntaxKind.NumericLiteral:
                const n = Number(node.getText());
                if (Math.floor(n) == n)
                    lastNode = myModule.i32.const(n);
                else
                    lastNode = myModule.f64.const(n);
                break;
            case ts.SyntaxKind.BigIntLiteral:
                const bi = BigInt(node.getText()).toString(2);
                lastNode = myModule.i64.const(Number.parseInt(bi.substring(0, bi.length / 2), 2), Number.parseInt(bi.substring(bi.length / 2), 2))
                break;
            case ts.SyntaxKind.StringLiteral:
                lastNode = myModule.call('String',)
            case ts.SyntaxKind.JsxText:
            case ts.SyntaxKind.JsxTextAllWhiteSpaces:
            case ts.SyntaxKind.RegularExpressionLiteral:
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
            case ts.SyntaxKind.TemplateHead:
            case ts.SyntaxKind.TemplateMiddle:
            case ts.SyntaxKind.TemplateTail:
            case ts.SyntaxKind.OpenBraceToken:
            case ts.SyntaxKind.CloseBraceToken:
            case ts.SyntaxKind.OpenParenToken:
            case ts.SyntaxKind.CloseParenToken:
            case ts.SyntaxKind.OpenBracketToken:
            case ts.SyntaxKind.CloseBracketToken:
            case ts.SyntaxKind.DotToken:
            case ts.SyntaxKind.DotDotDotToken:
            case ts.SyntaxKind.SemicolonToken:
            case ts.SyntaxKind.CommaToken:
            case ts.SyntaxKind.QuestionDotToken:
            case ts.SyntaxKind.LessThanToken:
            case ts.SyntaxKind.LessThanSlashToken:
            case ts.SyntaxKind.GreaterThanToken:
            case ts.SyntaxKind.LessThanEqualsToken:
            case ts.SyntaxKind.GreaterThanEqualsToken:
            case ts.SyntaxKind.EqualsEqualsToken:
            case ts.SyntaxKind.ExclamationEqualsToken:
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            case ts.SyntaxKind.EqualsGreaterThanToken:
            case ts.SyntaxKind.PlusToken:
            case ts.SyntaxKind.MinusToken:
            case ts.SyntaxKind.AsteriskToken:
            case ts.SyntaxKind.AsteriskAsteriskToken:
            case ts.SyntaxKind.SlashToken:
            case ts.SyntaxKind.PercentToken:
            case ts.SyntaxKind.PlusPlusToken:
            case ts.SyntaxKind.MinusMinusToken:
            case ts.SyntaxKind.LessThanLessThanToken:
            case ts.SyntaxKind.GreaterThanGreaterThanToken:
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
            case ts.SyntaxKind.AmpersandToken:
            case ts.SyntaxKind.BarToken:
            case ts.SyntaxKind.CaretToken:
            case ts.SyntaxKind.ExclamationToken:
            case ts.SyntaxKind.TildeToken:
            case ts.SyntaxKind.AmpersandAmpersandToken:
            case ts.SyntaxKind.BarBarToken:
            case ts.SyntaxKind.QuestionToken:
            case ts.SyntaxKind.ColonToken:
            case ts.SyntaxKind.AtToken:
            case ts.SyntaxKind.QuestionQuestionToken:
            case ts.SyntaxKind.BacktickToken:
            case ts.SyntaxKind.HashToken:
            case ts.SyntaxKind.EqualsToken:
            case ts.SyntaxKind.PlusEqualsToken:
            case ts.SyntaxKind.MinusEqualsToken:
            case ts.SyntaxKind.AsteriskEqualsToken:
            case ts.SyntaxKind.AsteriskAsteriskEqualsToken:
            case ts.SyntaxKind.SlashEqualsToken:
            case ts.SyntaxKind.PercentEqualsToken:
            case ts.SyntaxKind.LessThanLessThanEqualsToken:
            case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
            case ts.SyntaxKind.AmpersandEqualsToken:
            case ts.SyntaxKind.BarEqualsToken:
            case ts.SyntaxKind.BarBarEqualsToken:
            case ts.SyntaxKind.AmpersandAmpersandEqualsToken:
            case ts.SyntaxKind.QuestionQuestionEqualsToken:
            case ts.SyntaxKind.CaretEqualsToken:
            case ts.SyntaxKind.Identifier:
            case ts.SyntaxKind.PrivateIdentifier:
            case ts.SyntaxKind.BreakKeyword:
            case ts.SyntaxKind.CaseKeyword:
            case ts.SyntaxKind.CatchKeyword:
            case ts.SyntaxKind.ClassKeyword:
            case ts.SyntaxKind.ConstKeyword:
            case ts.SyntaxKind.ContinueKeyword:
            case ts.SyntaxKind.DebuggerKeyword:
            case ts.SyntaxKind.DefaultKeyword:
            case ts.SyntaxKind.DeleteKeyword:
            case ts.SyntaxKind.DoKeyword:
            case ts.SyntaxKind.ElseKeyword:
            case ts.SyntaxKind.EnumKeyword:
            case ts.SyntaxKind.ExportKeyword:
            case ts.SyntaxKind.ExtendsKeyword:
            case ts.SyntaxKind.FalseKeyword:
            case ts.SyntaxKind.FinallyKeyword:
            case ts.SyntaxKind.ForKeyword:
            case ts.SyntaxKind.FunctionKeyword:
            case ts.SyntaxKind.IfKeyword:
            case ts.SyntaxKind.ImportKeyword:
            case ts.SyntaxKind.InKeyword:
            case ts.SyntaxKind.InstanceOfKeyword:
            case ts.SyntaxKind.NewKeyword:
            case ts.SyntaxKind.NullKeyword:
            case ts.SyntaxKind.ReturnKeyword:
            case ts.SyntaxKind.SuperKeyword:
            case ts.SyntaxKind.SwitchKeyword:
            case ts.SyntaxKind.ThisKeyword:
            case ts.SyntaxKind.ThrowKeyword:
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.TryKeyword:
            case ts.SyntaxKind.TypeOfKeyword:
            case ts.SyntaxKind.VarKeyword:
            case ts.SyntaxKind.VoidKeyword:
            case ts.SyntaxKind.WhileKeyword:
            case ts.SyntaxKind.WithKeyword:
            case ts.SyntaxKind.ImplementsKeyword:
            case ts.SyntaxKind.InterfaceKeyword:
            case ts.SyntaxKind.LetKeyword:
            case ts.SyntaxKind.PackageKeyword:
            case ts.SyntaxKind.PrivateKeyword:
            case ts.SyntaxKind.ProtectedKeyword:
            case ts.SyntaxKind.PublicKeyword:
            case ts.SyntaxKind.StaticKeyword:
            case ts.SyntaxKind.YieldKeyword:
            case ts.SyntaxKind.AbstractKeyword:
            case ts.SyntaxKind.AccessorKeyword:
            case ts.SyntaxKind.AsKeyword:
            case ts.SyntaxKind.AssertsKeyword:
            case ts.SyntaxKind.AssertKeyword:
            case ts.SyntaxKind.AnyKeyword:
            case ts.SyntaxKind.AsyncKeyword:
            case ts.SyntaxKind.AwaitKeyword:
            case ts.SyntaxKind.BooleanKeyword:
            case ts.SyntaxKind.ConstructorKeyword:
            case ts.SyntaxKind.DeclareKeyword:
            case ts.SyntaxKind.GetKeyword:
            case ts.SyntaxKind.InferKeyword:
            case ts.SyntaxKind.IntrinsicKeyword:
            case ts.SyntaxKind.IsKeyword:
            case ts.SyntaxKind.KeyOfKeyword:
            case ts.SyntaxKind.ModuleKeyword:
            case ts.SyntaxKind.NamespaceKeyword:
            case ts.SyntaxKind.NeverKeyword:
            case ts.SyntaxKind.OutKeyword:
            case ts.SyntaxKind.ReadonlyKeyword:
            case ts.SyntaxKind.RequireKeyword:
            case ts.SyntaxKind.NumberKeyword:
            case ts.SyntaxKind.ObjectKeyword:
            case ts.SyntaxKind.SatisfiesKeyword:
            case ts.SyntaxKind.SetKeyword:
            case ts.SyntaxKind.StringKeyword:
            case ts.SyntaxKind.SymbolKeyword:
            case ts.SyntaxKind.TypeKeyword:
            case ts.SyntaxKind.UndefinedKeyword:
            case ts.SyntaxKind.UniqueKeyword:
            case ts.SyntaxKind.UnknownKeyword:
            case ts.SyntaxKind.FromKeyword:
            case ts.SyntaxKind.GlobalKeyword:
            case ts.SyntaxKind.BigIntKeyword:
            case ts.SyntaxKind.OverrideKeyword:
            case ts.SyntaxKind.OfKeyword:
            case ts.SyntaxKind.QualifiedName:
            case ts.SyntaxKind.ComputedPropertyName:
            case ts.SyntaxKind.TypeParameter:
            case ts.SyntaxKind.Parameter:
            case ts.SyntaxKind.Decorator:
            case ts.SyntaxKind.PropertySignature:
            case ts.SyntaxKind.PropertyDeclaration:
            case ts.SyntaxKind.MethodSignature:
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.ClassStaticBlockDeclaration:
            case ts.SyntaxKind.Constructor:
            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.SetAccessor:
            case ts.SyntaxKind.CallSignature:
            case ts.SyntaxKind.ConstructSignature:
            case ts.SyntaxKind.IndexSignature:
            case ts.SyntaxKind.TypePredicate:
            case ts.SyntaxKind.TypeReference:
            case ts.SyntaxKind.FunctionType:
            case ts.SyntaxKind.ConstructorType:
            case ts.SyntaxKind.TypeQuery:
            case ts.SyntaxKind.TypeLiteral:
            case ts.SyntaxKind.ArrayType:
            case ts.SyntaxKind.TupleType:
            case ts.SyntaxKind.OptionalType:
            case ts.SyntaxKind.RestType:
            case ts.SyntaxKind.UnionType:
            case ts.SyntaxKind.IntersectionType:
            case ts.SyntaxKind.ConditionalType:
            case ts.SyntaxKind.InferType:
            case ts.SyntaxKind.ParenthesizedType:
            case ts.SyntaxKind.ThisType:
            case ts.SyntaxKind.TypeOperator:
            case ts.SyntaxKind.IndexedAccessType:
            case ts.SyntaxKind.MappedType:
            case ts.SyntaxKind.LiteralType:
            case ts.SyntaxKind.NamedTupleMember:
            case ts.SyntaxKind.TemplateLiteralType:
            case ts.SyntaxKind.TemplateLiteralTypeSpan:
            case ts.SyntaxKind.ImportType:
            case ts.SyntaxKind.ObjectBindingPattern:
            case ts.SyntaxKind.ArrayBindingPattern:
            case ts.SyntaxKind.BindingElement:
            case ts.SyntaxKind.ArrayLiteralExpression:
            case ts.SyntaxKind.ObjectLiteralExpression:
            case ts.SyntaxKind.PropertyAccessExpression:
            case ts.SyntaxKind.ElementAccessExpression:
            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.NewExpression:
            case ts.SyntaxKind.TaggedTemplateExpression:
            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.ParenthesizedExpression:
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.ArrowFunction:
            case ts.SyntaxKind.DeleteExpression:
            case ts.SyntaxKind.TypeOfExpression:
            case ts.SyntaxKind.VoidExpression:
            case ts.SyntaxKind.AwaitExpression:
            case ts.SyntaxKind.PrefixUnaryExpression:
            case ts.SyntaxKind.PostfixUnaryExpression:
            case ts.SyntaxKind.BinaryExpression:
            case ts.SyntaxKind.ConditionalExpression:
            case ts.SyntaxKind.TemplateExpression:
            case ts.SyntaxKind.YieldExpression:
            case ts.SyntaxKind.SpreadElement:
            case ts.SyntaxKind.ClassExpression:
            case ts.SyntaxKind.OmittedExpression:
            case ts.SyntaxKind.ExpressionWithTypeArguments:
            case ts.SyntaxKind.AsExpression:
            case ts.SyntaxKind.NonNullExpression:
            case ts.SyntaxKind.MetaProperty:
            case ts.SyntaxKind.SyntheticExpression:
            case ts.SyntaxKind.SatisfiesExpression:
            case ts.SyntaxKind.TemplateSpan:
            case ts.SyntaxKind.SemicolonClassElement:
            case ts.SyntaxKind.Block:
            case ts.SyntaxKind.EmptyStatement:
            case ts.SyntaxKind.VariableStatement:
            case ts.SyntaxKind.ExpressionStatement:
            case ts.SyntaxKind.IfStatement:
            case ts.SyntaxKind.DoStatement:
            case ts.SyntaxKind.WhileStatement:
            case ts.SyntaxKind.ForStatement:
            case ts.SyntaxKind.ForInStatement:
            case ts.SyntaxKind.ForOfStatement:
            case ts.SyntaxKind.ContinueStatement:
            case ts.SyntaxKind.BreakStatement:
            case ts.SyntaxKind.ReturnStatement:
            case ts.SyntaxKind.WithStatement:
            case ts.SyntaxKind.SwitchStatement:
            case ts.SyntaxKind.LabeledStatement:
            case ts.SyntaxKind.ThrowStatement:
            case ts.SyntaxKind.TryStatement:
            case ts.SyntaxKind.DebuggerStatement:
            case ts.SyntaxKind.VariableDeclaration:
            case ts.SyntaxKind.VariableDeclarationList:
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.InterfaceDeclaration:
            case ts.SyntaxKind.TypeAliasDeclaration:
            case ts.SyntaxKind.EnumDeclaration:
            case ts.SyntaxKind.ModuleDeclaration:
            case ts.SyntaxKind.ModuleBlock:
            case ts.SyntaxKind.CaseBlock:
            case ts.SyntaxKind.NamespaceExportDeclaration:
            case ts.SyntaxKind.ImportEqualsDeclaration:
            case ts.SyntaxKind.ImportDeclaration:
            case ts.SyntaxKind.ImportClause:
            case ts.SyntaxKind.NamespaceImport:
            case ts.SyntaxKind.NamedImports:
            case ts.SyntaxKind.ImportSpecifier:
            case ts.SyntaxKind.ExportAssignment:
            case ts.SyntaxKind.ExportDeclaration:
            case ts.SyntaxKind.NamedExports:
            case ts.SyntaxKind.NamespaceExport:
            case ts.SyntaxKind.ExportSpecifier:
            case ts.SyntaxKind.MissingDeclaration:
            case ts.SyntaxKind.ExternalModuleReference:
            case ts.SyntaxKind.JsxElement:
            case ts.SyntaxKind.JsxSelfClosingElement:
            case ts.SyntaxKind.JsxOpeningElement:
            case ts.SyntaxKind.JsxClosingElement:
            case ts.SyntaxKind.JsxFragment:
            case ts.SyntaxKind.JsxOpeningFragment:
            case ts.SyntaxKind.JsxClosingFragment:
            case ts.SyntaxKind.JsxAttribute:
            case ts.SyntaxKind.JsxAttributes:
            case ts.SyntaxKind.JsxSpreadAttribute:
            case ts.SyntaxKind.JsxExpression:
            case ts.SyntaxKind.CaseClause:
            case ts.SyntaxKind.DefaultClause:
            case ts.SyntaxKind.HeritageClause:
            case ts.SyntaxKind.CatchClause:
            case ts.SyntaxKind.AssertClause:
            case ts.SyntaxKind.AssertEntry:
            case ts.SyntaxKind.ImportTypeAssertionContainer:
            case ts.SyntaxKind.PropertyAssignment:
            case ts.SyntaxKind.ShorthandPropertyAssignment:
            case ts.SyntaxKind.SpreadAssignment:
            case ts.SyntaxKind.EnumMember:
            case ts.SyntaxKind.UnparsedPrologue:
            case ts.SyntaxKind.UnparsedPrepend:
            case ts.SyntaxKind.UnparsedText:
            case ts.SyntaxKind.UnparsedInternalText:
            case ts.SyntaxKind.UnparsedSyntheticReference:
            case ts.SyntaxKind.SourceFile:
            case ts.SyntaxKind.Bundle:
            case ts.SyntaxKind.UnparsedSource:
            case ts.SyntaxKind.InputFiles:
            case ts.SyntaxKind.JSDocTypeExpression:
            case ts.SyntaxKind.JSDocNameReference:
            case ts.SyntaxKind.JSDocMemberName:
            case ts.SyntaxKind.JSDocAllType:
            case ts.SyntaxKind.JSDocUnknownType:
            case ts.SyntaxKind.JSDocNullableType:
            case ts.SyntaxKind.JSDocNonNullableType:
            case ts.SyntaxKind.JSDocOptionalType:
            case ts.SyntaxKind.JSDocFunctionType:
            case ts.SyntaxKind.JSDocVariadicType:
            case ts.SyntaxKind.JSDocNamepathType:
            case ts.SyntaxKind.JSDoc:
            case ts.SyntaxKind.JSDocComment:
            case ts.SyntaxKind.JSDocText:
            case ts.SyntaxKind.JSDocTypeLiteral:
            case ts.SyntaxKind.JSDocSignature:
            case ts.SyntaxKind.JSDocLink:
            case ts.SyntaxKind.JSDocLinkCode:
            case ts.SyntaxKind.JSDocLinkPlain:
            case ts.SyntaxKind.JSDocTag:
            case ts.SyntaxKind.JSDocAugmentsTag:
            case ts.SyntaxKind.JSDocImplementsTag:
            case ts.SyntaxKind.JSDocAuthorTag:
            case ts.SyntaxKind.JSDocDeprecatedTag:
            case ts.SyntaxKind.JSDocClassTag:
            case ts.SyntaxKind.JSDocPublicTag:
            case ts.SyntaxKind.JSDocPrivateTag:
            case ts.SyntaxKind.JSDocProtectedTag:
            case ts.SyntaxKind.JSDocReadonlyTag:
            case ts.SyntaxKind.JSDocOverrideTag:
            case ts.SyntaxKind.JSDocCallbackTag:
            case ts.SyntaxKind.JSDocEnumTag:
            case ts.SyntaxKind.JSDocParameterTag:
            case ts.SyntaxKind.JSDocReturnTag:
            case ts.SyntaxKind.JSDocThisTag:
            case ts.SyntaxKind.JSDocTypeTag:
            case ts.SyntaxKind.JSDocTemplateTag:
            case ts.SyntaxKind.JSDocTypedefTag:
            case ts.SyntaxKind.JSDocSeeTag:
            case ts.SyntaxKind.JSDocPropertyTag:
            case ts.SyntaxKind.SyntaxList:
            case ts.SyntaxKind.NotEmittedStatement:
            case ts.SyntaxKind.PartiallyEmittedExpression:
            case ts.SyntaxKind.CommaListExpression:
            case ts.SyntaxKind.MergeDeclarationMarker:
            case ts.SyntaxKind.EndOfDeclarationMarker:
            case ts.SyntaxKind.SyntheticReferenceExpression:
            case ts.SyntaxKind.Count:
            case ts.SyntaxKind.FirstAssignment:
            case ts.SyntaxKind.LastAssignment:
            case ts.SyntaxKind.FirstCompoundAssignment:
            case ts.SyntaxKind.LastCompoundAssignment:
            case ts.SyntaxKind.FirstReservedWord:
            case ts.SyntaxKind.LastReservedWord:
            case ts.SyntaxKind.FirstKeyword:
            case ts.SyntaxKind.LastKeyword:
            case ts.SyntaxKind.FirstFutureReservedWord:
            case ts.SyntaxKind.LastFutureReservedWord:
            case ts.SyntaxKind.FirstTypeNode:
            case ts.SyntaxKind.LastTypeNode:
            case ts.SyntaxKind.FirstPunctuation:
            case ts.SyntaxKind.LastPunctuation:
            case ts.SyntaxKind.FirstToken:
            case ts.SyntaxKind.LastToken:
            case ts.SyntaxKind.FirstTriviaToken:
            case ts.SyntaxKind.LastTriviaToken:
            case ts.SyntaxKind.FirstLiteralToken:
            case ts.SyntaxKind.LastLiteralToken:
            case ts.SyntaxKind.FirstTemplateToken:
            case ts.SyntaxKind.LastTemplateToken:
            case ts.SyntaxKind.FirstBinaryOperator:
            case ts.SyntaxKind.LastBinaryOperator:
            case ts.SyntaxKind.FirstStatement:
            case ts.SyntaxKind.LastStatement:
            case ts.SyntaxKind.FirstNode:
            case ts.SyntaxKind.FirstJSDocNode:
            case ts.SyntaxKind.LastJSDocNode:
            case ts.SyntaxKind.FirstJSDocTagNode:
            case ts.SyntaxKind.LastJSDocTagNode:
                break;
            default:
                const x: never = node.kind;
                break;
        }

        if (ts.isClassDeclaration(node) && node.name)
        {
            // This is a top level class, get its symbol
            let symbol = checker.getSymbolAtLocation(node.name);
            if (symbol)
            {
                output.push(serializeClass(symbol));
            }
            // No need to walk any further, class expressions/inner declarations
            // cannot be exported
        } else if (ts.isModuleDeclaration(node))
        {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit);
        }
    }

    /** Serialize a symbol into a json object */
    function serializeSymbol(symbol: ts.Symbol): DocEntry
    {
        return {
            name: symbol.getName(),
            documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
            type: checker.typeToString(
                checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
            )
        };
    }

    /** Serialize a class symbol information */
    function serializeClass(symbol: ts.Symbol)
    {
        let details = serializeSymbol(symbol);

        // Get the construct signatures
        let constructorType = checker.getTypeOfSymbolAtLocation(
            symbol,
            symbol.valueDeclaration!
        );
        details.constructors = constructorType
            .getConstructSignatures()
            .map(serializeSignature);
        return details;
    }

    /** Serialize a signature (call or construct) */
    function serializeSignature(signature: ts.Signature)
    {
        return {
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment(checker))
        };
    }

    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node: ts.Node): boolean
    {
        return (
            (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 ||
            (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
        );
    }
}

generateDocumentation(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
});