# Logical Expression

Logical Expressions are very similar to the Binary Expressions. They also consist of one operators and two operands connected by this operator. According to this they have absolutely the same code to be parsed as Binary Expressions. But still we prefer to create separate AST subtree for such type of expressions with it's own type. It's because logical operators don't behave like others - they *short-circuit*. It means that if, after evaluating the left operand, we know what the result of the logical expression must be, we don’t evaluate the right operand. So, because the evaluation step of the Logical Expressions is different - we create for them separate node with it's own type. IMO it's just cleaner to check the type of the node to make decision about how to evaluate it instead of checking the operator value.

There are two types of Logical Expressions:
- logical OR expression;
- logical AND expression.

In logical OR expressions the two operands are connected by the || operator. In logical AND expressions the two operands are connected by the && operator.

The precedence of the AND operator is higher than the precedence of the OR operator. It means that in the Grammar the Logical OR Expressions are located above the Logical AND Expressions.

The precedence of the Logical Expressions are higher than the precednce of the Assignment Expressions. And at the same time it's lower than the precedence of the Equality Expressions. So, in Grammar the Logical Expressions are located after the Assignment Expressions and above the Equality Expressions:


```
AssignmentExpression => IDENTIFIER AssignmentOperator AssignmentExpression | LogicalORExpression;

AssignmentOperator   => SIMPLE_ASSIGNMENT_OPERATOR | COMPLEX_ASSIGNMENT_OPERATOR;

LogicalORExpression => LogicalAndExpression (LOGICAL_OR_OPERATOR LogicalAndExpression)*;

LogicalAndExpression => EqualityExpression (LOGICAL_AND_OPERATOR EqualityExpression)*;
```

The code to parse Logical Expressions is identical to the code to parse Binary Expressions:

```
LogicalOrExpression() {
  let leftOperand = this.LogicalAndExpression();

  while(this._check('LOGICAL_OR')) {
    const operator = this._eat('LOGICAL_OR');

    const rightOperand = this.LogicalAndExpression();

    leftOperand = this.LogicalNode(
      leftOperand, 
      operator.value, 
      rightOperand
    );  
  }   

  return leftOperand;
}
```

```
LogicalAndExpression() {
  let leftOperand = this.EqualityExpression();

  while(this._check('LOGICAL_AND')) {
    const operator = this._eat('LOGICAL_AND');

    const rightOperand = this.EqualityExpression();

    leftOperand = this.LogicalNode(
      leftOperand, 
      operator.value, 
      rightOperand
    );  
  }   

  return leftOperand;
}
```
