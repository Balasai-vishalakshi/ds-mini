document.getElementById('expressionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const infix = document.getElementById('infix').value.replace(/\s+/g, '');
    const variableInput = document.getElementById('variables').value.trim();
    
    // Parse variable values
    const variables = parseVariables(variableInput);
    
    // Replace variables in the infix expression with their values
    const replacedInfix = replaceVariables(infix, variables);
    
    // Convert to postfix
    const postfix = infixToPostfix(replacedInfix);
    
    // Evaluate postfix expression
    const result = evaluatePostfix(postfix);
    
    // Display results
    document.getElementById('postfixResult').textContent = postfix;
    document.getElementById('evaluationResult').textContent = result;
});

function parseVariables(input) {
    const variables = {};
    const pairs = input.split(',');
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        variables[key.trim()] = parseFloat(value.trim());
    });
    return variables;
}

function replaceVariables(expression, variables) {
    return expression.split('').map(char => {
        return variables.hasOwnProperty(char) ? variables[char] : char;
    }).join('');
}

function infixToPostfix(infix) {
    let output = '';
    const operators = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
    
    for (let i = 0; i < infix.length; i++) {
        const c = infix[i];
        
        if (/\d/.test(c) || (c === '.' && /\d/.test(infix[i + 1]))) {
            // Handle multi-digit numbers
            let number = '';
            while (i < infix.length && (/[\d.]/.test(infix[i]))) {
                number += infix[i++];
            }
            i--; // Adjust for loop increment
            output += number + ' ';
        } else if (c === '(') {
            operators.push(c);
        } else if (c === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                output += operators.pop() + ' ';
            }
            operators.pop(); // Remove '('
        } else if ('+-*/'.includes(c)) {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[c]) {
                output += operators.pop() + ' ';
            }
            operators.push(c);
        }
    }
    
    while (operators.length) {
        output += operators.pop() + ' ';
    }
    
    return output.trim();
}

function evaluatePostfix(postfix) {
    const stack = [];
    const tokens = postfix.split(/\s+/);
    
    for (const token of tokens) {
        if (/\d/.test(token)) {
            stack.push(parseFloat(token));
        } else if ('+-*/'.includes(token)) {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(a / b); break;
            }
        }
    }
    
    return stack.pop();
}
